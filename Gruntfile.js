module.exports = function (grunt) {
  'use strict';

  var config = require('config');
  var pkg = grunt.file.readJSON('package.json');
  for (var taskName in pkg.devDependencies) {
    if (taskName.indexOf('grunt-') > -1) {
      grunt.loadNpmTasks(taskName);
    }
  }

  var buildPaths = config.get('buildPaths');
  var portConfig = config.get('portConfig');

  var styleBuildDest = {};
  styleBuildDest[buildPaths.buildLocation + 'app.css'] = 'src/sass/main.scss';

  var appBuildDest = buildPaths.buildLocation + 'bundle.js';

  console.log(appBuildDest);

  grunt.initConfig({
    pkg: pkg,
    clean: {
      build: buildPaths.clean
    },
    copy: {
      build: {
        files: [
          // Copy plugin-assets to build location
          { expand: true, cwd: buildPaths.assetPath, src: ['**'], dest: buildPaths.buildLocation, filter: 'isFile' }
        ]
      }
    },
    sass: {
      dev: {
        options: {
          sourcemap: 'none',
          style: 'expanded',
          trace: true,
          require: ['susy', 'normalize-scss']
        },
        files: styleBuildDest
      }
    },
    webpack: {
      build: {
        entry: './src/app/index.tsx',
        output: {
          filename: buildPaths.buildLocation + 'bundle.js',
        },

        // Enable sourcemaps for debugging webpack's output.
        devtool: 'source-map',

        resolve: {
          // Add '.ts' and '.tsx' as resolvable extensions.
          extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
        },

        module: {
          loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: 'ts-loader' }
          ],

          preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: 'source-map-loader' }
          ]
        },

        // When importing a module whose path matches one of the following, just
        // assume a corresponding global variable exists and use that instead.
        // This is important because it allows us to avoid bundling all of our
        // dependencies, which allows browsers to cache those libraries between builds.
        externals: {
          'react': 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    connect: {
      options: {
        hostname: '127.0.0.1'
      },
      build: {
        options: {
          port: portConfig.build,
          base: buildPaths.buildLocation,
          open: {
            target: 'http://127.0.0.1:<%= connect.build.options.port %>/index.html'
          }
        }
      }
    },
    watch: {
      styles: {
        files: [
          'src/sass/**/*.scss'
        ],
        tasks: ['sass:dev']
      },
      jsChanges: {
        files: ['src/**/*.ts', 'src/**/*.tsx'],
        tasks: ['webpack']
      }
    }
  });

  grunt.registerTask('default', ['clean', 'copy', 'sass', 'webpack', 'connect', 'watch']);

  grunt.registerTask('styles', ['sass', 'watch:styles']);

  grunt.registerTask('build', ['clean', 'copy', 'sass', 'webpack']);
}