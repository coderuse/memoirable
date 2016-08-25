#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

# https://gist.github.com/domenic/ec8b0fc8ab45f39403dd

SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"
TARGET_FOLDER="build"

function doBuild {
  bower install
  grunt build
}

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy; just doing a build."
    doBuild
    exit 0
fi

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Attaching deploy key to SSH
chmod 600 id_rsa
eval `ssh-agent -s`
ssh-add id_rsa

# Clone the existing gh-pages for this repo into out/
# Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deply)
git clone $REPO build
cd build
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
cd ..

# Clean out existing built artifacts
rm -rf build/**/* || exit 0

# Run our compile script
doBuild

# Now let's go have some fun with the cloned repo
cd build
git config user.name "Arnab Das"
git config user.email "arnab@coderuse.com"

# If there are no changes (e.g. this is a README update) then just bail.
if [ -z `git diff --exit-code` ]; then
    echo "No changes to the spec on this push; exiting."
    exit 0
fi

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add --all .
git commit -m "Deploy to GitHub Pages: ${SHA}"

# Now that we're all set up, we can push.
git push $SSH_REPO $TARGET_BRANCH