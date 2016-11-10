// Type definitions for Google Drive API v3
// Project: https://developers.google.com/drive/
// Definitions by: vvakame's gapidts <https://github.com/vvakame/gapidts>
// Definitions: https://github.com/vvakame/gapidts

// OAuth2 scopes
// https://www.googleapis.com/auth/drive
//   View and manage the files in your Google Drive
// https://www.googleapis.com/auth/drive.appdata
//   View and manage its own configuration data in your Google Drive
// https://www.googleapis.com/auth/drive.file
//   View and manage Google Drive files and folders that you have opened or created with this app
// https://www.googleapis.com/auth/drive.metadata
//   View and manage metadata of files in your Google Drive
// https://www.googleapis.com/auth/drive.metadata.readonly
//   View metadata for files in your Google Drive
// https://www.googleapis.com/auth/drive.photos.readonly
//   View the photos, videos and albums in your Google Photos
// https://www.googleapis.com/auth/drive.readonly
//   View the files in your Google Drive
// https://www.googleapis.com/auth/drive.scripts
//   Modify your Google Apps Script scripts' behavior

/// <reference path="./googleapis-nodejs-common.d.ts" />

declare module "googleapis" {
    function drive(version:string):typeof googleapis.drive;
    function drive(opts: {version:string; auth?: googleapis.google.auth.OAuth2; }):typeof googleapis.drive;
}
/**
 * Manages files in Drive including uploading, downloading, searching, detecting changes, and updating sharing permissions.
 */
declare module googleapis.drive {
    var about: {
        /**
         * Gets information about the user, the user's Drive, and system capabilities.
         */
        get: (params: {
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: IAbout, incomingMessage: any /* http.IncomingMessage */) => void) => void;
    };
    var changes: {
        /**
         * Gets the starting pageToken for listing future changes.
         */
        getStartPageToken: (params: {
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: IStartPageToken, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Lists changes for a user.
         * @params {boolean} includeRemoved Whether to include changes indicating that items have left the view of the changes list, for example by deletion or lost access.
         * @params {number} pageSize The maximum number of changes to return per page.
         * @params {string} pageToken The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response or to the response from the getStartPageToken method.
         * @params {boolean} restrictToMyDrive Whether to restrict the results to changes inside the My Drive hierarchy. This omits changes to files such as those in the Application Data folder or shared files which have not been added to My Drive.
         * @params {string} spaces A comma-separated list of spaces to query within the user corpus. Supported values are 'drive', 'appDataFolder' and 'photos'.
         */
        list: (params: {
            includeRemoved?: boolean;
            pageSize?: number;
            pageToken: string;
            restrictToMyDrive?: boolean;
            spaces?: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: IChangeList, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Subscribes to changes for a user.
         * @params {boolean} includeRemoved Whether to include changes indicating that items have left the view of the changes list, for example by deletion or lost access.
         * @params {number} pageSize The maximum number of changes to return per page.
         * @params {string} pageToken The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response or to the response from the getStartPageToken method.
         * @params {boolean} restrictToMyDrive Whether to restrict the results to changes inside the My Drive hierarchy. This omits changes to files such as those in the Application Data folder or shared files which have not been added to My Drive.
         * @params {string} spaces A comma-separated list of spaces to query within the user corpus. Supported values are 'drive', 'appDataFolder' and 'photos'.
         */
        watch: (params: {
            includeRemoved?: boolean;
            pageSize?: number;
            pageToken: string;
            restrictToMyDrive?: boolean;
            spaces?: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
            resource?: IChannel;
        }, callback: (err: IErrorResponse, response: IChannel, incomingMessage: any /* http.IncomingMessage */) => void) => void;
    };
    var channels: {
        /**
         * Stop watching resources through this channel
         */
        stop: (params: {
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
            resource?: IChannel;
        }, callback: (err: IErrorResponse, response: any, incomingMessage: any /* http.IncomingMessage */) => void ) => void; // void
    };
    var comments: {
        /**
         * Creates a new comment on a file.
         * @params {string} fileId The ID of the file.
         */
        create: (params: {
            fileId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
            resource?: IComment;
        }, callback: (err: IErrorResponse, response: IComment, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Deletes a comment.
         * @params {string} commentId The ID of the comment.
         * @params {string} fileId The ID of the file.
         */
        delete: (params: {
            commentId: string;
            fileId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: any, incomingMessage: any /* http.IncomingMessage */) => void ) => void; // void
        /**
         * Gets a comment by ID.
         * @params {string} commentId The ID of the comment.
         * @params {string} fileId The ID of the file.
         * @params {boolean} includeDeleted Whether to return deleted comments. Deleted comments will not include their original content.
         */
        get: (params: {
            commentId: string;
            fileId: string;
            includeDeleted?: boolean;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: IComment, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Lists a file's comments.
         * @params {string} fileId The ID of the file.
         * @params {boolean} includeDeleted Whether to include deleted comments. Deleted comments will not include their original content.
         * @params {number} pageSize The maximum number of comments to return per page.
         * @params {string} pageToken The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response.
         * @params {string} startModifiedTime The minimum value of 'modifiedTime' for the result comments (RFC 3339 date-time).
         */
        list: (params: {
            fileId: string;
            includeDeleted?: boolean;
            pageSize?: number;
            pageToken?: string;
            startModifiedTime?: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: ICommentList, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Updates a comment with patch semantics.
         * @params {string} commentId The ID of the comment.
         * @params {string} fileId The ID of the file.
         */
        update: (params: {
            commentId: string;
            fileId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
            resource?: IComment;
        }, callback: (err: IErrorResponse, response: IComment, incomingMessage: any /* http.IncomingMessage */) => void) => void;
    };
    var files: {
        /**
         * Creates a copy of a file and applies any requested updates with patch semantics.
         * @params {string} fileId The ID of the file.
         * @params {boolean} ignoreDefaultVisibility Whether to ignore the domain's default visibility settings for the created file. Domain administrators can choose to make all uploaded files visible to the domain by default; this parameter bypasses that behavior for the request. Permissions are still inherited from parent folders.
         * @params {boolean} keepRevisionForever Whether to set the 'keepForever' field in the new head revision. This is only applicable to files with binary content in Drive.
         * @params {string} ocrLanguage A language hint for OCR processing during image import (ISO 639-1 code).
         */
        copy: (params: {
            fileId: string;
            ignoreDefaultVisibility?: boolean;
            keepRevisionForever?: boolean;
            ocrLanguage?: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
            resource?: IFile;
        }, callback: (err: IErrorResponse, response: IFile, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Creates a new file.
         * @params {boolean} ignoreDefaultVisibility Whether to ignore the domain's default visibility settings for the created file. Domain administrators can choose to make all uploaded files visible to the domain by default; this parameter bypasses that behavior for the request. Permissions are still inherited from parent folders.
         * @params {boolean} keepRevisionForever Whether to set the 'keepForever' field in the new head revision. This is only applicable to files with binary content in Drive.
         * @params {string} ocrLanguage A language hint for OCR processing during image import (ISO 639-1 code).
         * @params {boolean} useContentAsIndexableText Whether to use the uploaded content as indexable text.
         */
        create: (params: {
            ignoreDefaultVisibility?: boolean;
            keepRevisionForever?: boolean;
            ocrLanguage?: string;
            useContentAsIndexableText?: boolean;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
            resource?: IFile;
        }, callback: (err: IErrorResponse, response: IFile, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Permanently deletes a file owned by the user without moving it to the trash. If the target is a folder, all descendants owned by the user are also deleted.
         * @params {string} fileId The ID of the file.
         */
        delete: (params: {
            fileId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: any, incomingMessage: any /* http.IncomingMessage */) => void ) => void; // void
        /**
         * Permanently deletes all of the user's trashed files.
         */
        emptyTrash: (params: {
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: any, incomingMessage: any /* http.IncomingMessage */) => void ) => void; // void
        /**
         * Exports a Google Doc to the requested MIME type and returns the exported content.
         * @params {string} fileId The ID of the file.
         * @params {string} mimeType The MIME type of the format requested for this export.
         */
        export: (params: {
            fileId: string;
            mimeType: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: any, incomingMessage: any /* http.IncomingMessage */) => void ) => void; // void
        /**
         * Generates a set of file IDs which can be provided in create requests.
         * @params {number} count The number of IDs to return.
         * @params {string} space The space in which the IDs can be used to create new files. Supported values are 'drive' and 'appDataFolder'.
         */
        generateIds: (params: {
            count?: number;
            space?: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: IGeneratedIds, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Gets a file's metadata or content by ID.
         * @params {boolean} acknowledgeAbuse Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when alt=media.
         * @params {string} fileId The ID of the file.
         */
        get: (params: {
            acknowledgeAbuse?: boolean;
            fileId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: IFile, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Lists or searches files.
         * @params {string} corpus The source of files to list.
         * @params {string} orderBy A comma-separated list of sort keys. Valid keys are 'createdTime', 'folder', 'modifiedByMeTime', 'modifiedTime', 'name', 'quotaBytesUsed', 'recency', 'sharedWithMeTime', 'starred', and 'viewedByMeTime'. Each key sorts ascending by default, but may be reversed with the 'desc' modifier. Example usage: ?orderBy=folder,modifiedTime desc,name. Please note that there is a current limitation for users with approximately one million files in which the requested sort order is ignored.
         * @params {number} pageSize The maximum number of files to return per page.
         * @params {string} pageToken The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response.
         * @params {string} q A query for filtering the file results. See the "Search for Files" guide for supported syntax.
         * @params {string} spaces A comma-separated list of spaces to query within the corpus. Supported values are 'drive', 'appDataFolder' and 'photos'.
         */
        list: (params: {
            corpus?: string;
            orderBy?: string;
            pageSize?: number;
            pageToken?: string;
            q?: string;
            spaces?: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: IFileList, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Updates a file's metadata and/or content with patch semantics.
         * @params {string} addParents A comma-separated list of parent IDs to add.
         * @params {string} fileId The ID of the file.
         * @params {boolean} keepRevisionForever Whether to set the 'keepForever' field in the new head revision. This is only applicable to files with binary content in Drive.
         * @params {string} ocrLanguage A language hint for OCR processing during image import (ISO 639-1 code).
         * @params {string} removeParents A comma-separated list of parent IDs to remove.
         * @params {boolean} useContentAsIndexableText Whether to use the uploaded content as indexable text.
         */
        update: (params: {
            addParents?: string;
            fileId: string;
            keepRevisionForever?: boolean;
            ocrLanguage?: string;
            removeParents?: string;
            useContentAsIndexableText?: boolean;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
            resource?: IFile;
        }, callback: (err: IErrorResponse, response: IFile, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Subscribes to changes to a file
         * @params {boolean} acknowledgeAbuse Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when alt=media.
         * @params {string} fileId The ID of the file.
         */
        watch: (params: {
            acknowledgeAbuse?: boolean;
            fileId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
            resource?: IChannel;
        }, callback: (err: IErrorResponse, response: IChannel, incomingMessage: any /* http.IncomingMessage */) => void) => void;
    };
    var permissions: {
        /**
         * Creates a permission for a file.
         * @params {string} emailMessage A custom message to include in the notification email.
         * @params {string} fileId The ID of the file.
         * @params {boolean} sendNotificationEmail Whether to send a notification email when sharing to users or groups. This defaults to true for users and groups, and is not allowed for other requests. It must not be disabled for ownership transfers.
         * @params {boolean} transferOwnership Whether to transfer ownership to the specified user and downgrade the current owner to a writer. This parameter is required as an acknowledgement of the side effect.
         */
        create: (params: {
            emailMessage?: string;
            fileId: string;
            sendNotificationEmail?: boolean;
            transferOwnership?: boolean;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
            resource?: IPermission;
        }, callback: (err: IErrorResponse, response: IPermission, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Deletes a permission.
         * @params {string} fileId The ID of the file.
         * @params {string} permissionId The ID of the permission.
         */
        delete: (params: {
            fileId: string;
            permissionId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: any, incomingMessage: any /* http.IncomingMessage */) => void ) => void; // void
        /**
         * Gets a permission by ID.
         * @params {string} fileId The ID of the file.
         * @params {string} permissionId The ID of the permission.
         */
        get: (params: {
            fileId: string;
            permissionId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: IPermission, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Lists a file's permissions.
         * @params {string} fileId The ID of the file.
         */
        list: (params: {
            fileId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: IPermissionList, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Updates a permission with patch semantics.
         * @params {string} fileId The ID of the file.
         * @params {string} permissionId The ID of the permission.
         * @params {boolean} removeExpiration Whether to remove the expiration date.
         * @params {boolean} transferOwnership Whether to transfer ownership to the specified user and downgrade the current owner to a writer. This parameter is required as an acknowledgement of the side effect.
         */
        update: (params: {
            fileId: string;
            permissionId: string;
            removeExpiration?: boolean;
            transferOwnership?: boolean;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
            resource?: IPermission;
        }, callback: (err: IErrorResponse, response: IPermission, incomingMessage: any /* http.IncomingMessage */) => void) => void;
    };
    var replies: {
        /**
         * Creates a new reply to a comment.
         * @params {string} commentId The ID of the comment.
         * @params {string} fileId The ID of the file.
         */
        create: (params: {
            commentId: string;
            fileId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
            resource?: IReply;
        }, callback: (err: IErrorResponse, response: IReply, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Deletes a reply.
         * @params {string} commentId The ID of the comment.
         * @params {string} fileId The ID of the file.
         * @params {string} replyId The ID of the reply.
         */
        delete: (params: {
            commentId: string;
            fileId: string;
            replyId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: any, incomingMessage: any /* http.IncomingMessage */) => void ) => void; // void
        /**
         * Gets a reply by ID.
         * @params {string} commentId The ID of the comment.
         * @params {string} fileId The ID of the file.
         * @params {boolean} includeDeleted Whether to return deleted replies. Deleted replies will not include their original content.
         * @params {string} replyId The ID of the reply.
         */
        get: (params: {
            commentId: string;
            fileId: string;
            includeDeleted?: boolean;
            replyId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: IReply, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Lists a comment's replies.
         * @params {string} commentId The ID of the comment.
         * @params {string} fileId The ID of the file.
         * @params {boolean} includeDeleted Whether to include deleted replies. Deleted replies will not include their original content.
         * @params {number} pageSize The maximum number of replies to return per page.
         * @params {string} pageToken The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response.
         */
        list: (params: {
            commentId: string;
            fileId: string;
            includeDeleted?: boolean;
            pageSize?: number;
            pageToken?: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: IReplyList, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Updates a reply with patch semantics.
         * @params {string} commentId The ID of the comment.
         * @params {string} fileId The ID of the file.
         * @params {string} replyId The ID of the reply.
         */
        update: (params: {
            commentId: string;
            fileId: string;
            replyId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
            resource?: IReply;
        }, callback: (err: IErrorResponse, response: IReply, incomingMessage: any /* http.IncomingMessage */) => void) => void;
    };
    var revisions: {
        /**
         * Permanently deletes a revision. This method is only applicable to files with binary content in Drive.
         * @params {string} fileId The ID of the file.
         * @params {string} revisionId The ID of the revision.
         */
        delete: (params: {
            fileId: string;
            revisionId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: any, incomingMessage: any /* http.IncomingMessage */) => void ) => void; // void
        /**
         * Gets a revision's metadata or content by ID.
         * @params {boolean} acknowledgeAbuse Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when alt=media.
         * @params {string} fileId The ID of the file.
         * @params {string} revisionId The ID of the revision.
         */
        get: (params: {
            acknowledgeAbuse?: boolean;
            fileId: string;
            revisionId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: IRevision, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Lists a file's revisions.
         * @params {string} fileId The ID of the file.
         * @params {number} pageSize The maximum number of revisions to return per page.
         * @params {string} pageToken The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response.
         */
        list: (params: {
            fileId: string;
            pageSize?: number;
            pageToken?: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
        }, callback: (err: IErrorResponse, response: IRevisionList, incomingMessage: any /* http.IncomingMessage */) => void) => void;
        /**
         * Updates a revision with patch semantics.
         * @params {string} fileId The ID of the file.
         * @params {string} revisionId The ID of the revision.
         */
        update: (params: {
            fileId: string;
            revisionId: string;
            key?: string; // API_KEY
            auth?: googleapis.google.auth.OAuth2; // string(API_KEY) or googleapis.google.auth.OAuth2
            resource?: IRevision;
        }, callback: (err: IErrorResponse, response: IRevision, incomingMessage: any /* http.IncomingMessage */) => void) => void;
    };
    /**
     * Information about the user, the user's Drive, and system capabilities.
     */
    interface IAbout {
        /**
         * Whether the user has installed the requesting app.
         */
        appInstalled: boolean;
        /**
         * A map of source MIME type to possible targets for all supported exports.
         */
        exportFormats: {
            [name:string]: string[];
        };
        /**
         * The currently supported folder colors as RGB hex strings.
         */
        folderColorPalette: string[];
        /**
         * A map of source MIME type to possible targets for all supported imports.
         */
        importFormats: {
            [name:string]: string[];
        };
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#about".
         */
        kind: string;
        /**
         * A map of maximum import sizes by MIME type, in bytes.
         */
        maxImportSizes: {
            [name:string]: string /* int64 */ ;
        };
        /**
         * The maximum upload size in bytes.
         */
        maxUploadSize: string; // int64
        /**
         * The user's storage quota limits and usage. All fields are measured in bytes.
         */
        storageQuota: {
            limit: string; // int64
            usage: string; // int64
            usageInDrive: string; // int64
            usageInDriveTrash: string; // int64
        };
        /**
         * The authenticated user.
         */
        user: IUser;
    }
    /**
     * A change to a file.
     */
    interface IChange {
        /**
         * The updated state of the file. Present if the file has not been removed.
         */
        file: IFile;
        /**
         * The ID of the file which has changed.
         */
        fileId: string;
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#change".
         */
        kind: string;
        /**
         * Whether the file has been removed from the view of the changes list, for example by deletion or lost access.
         */
        removed: boolean;
        /**
         * The time of this change (RFC 3339 date-time).
         */
        time: string; // date-time
    }
    /**
     * A list of changes for a user.
     */
    interface IChangeList {
        /**
         * The page of changes.
         */
        changes: IChange[];
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#changeList".
         */
        kind: string;
        /**
         * The starting page token for future changes. This will be present only if the end of the current changes list has been reached.
         */
        newStartPageToken: string;
        /**
         * The page token for the next page of changes. This will be absent if the end of the current changes list has been reached.
         */
        nextPageToken: string;
    }
    /**
     * An notification channel used to watch for resource changes.
     */
    interface IChannel {
        /**
         * The address where notifications are delivered for this channel.
         */
        address: string;
        /**
         * Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds. Optional.
         */
        expiration: string; // int64
        /**
         * A UUID or similar unique string that identifies this channel.
         */
        id: string;
        /**
         * Identifies this as a notification channel used to watch for changes to a resource. Value: the fixed string "api#channel".
         */
        kind: string;
        /**
         * Additional parameters controlling delivery channel behavior. Optional.
         */
        params: {
            [name:string]: string;
        };
        /**
         * A Boolean value to indicate whether payload is wanted. Optional.
         */
        payload: boolean;
        /**
         * An opaque ID that identifies the resource being watched on this channel. Stable across different API versions.
         */
        resourceId: string;
        /**
         * A version-specific identifier for the watched resource.
         */
        resourceUri: string;
        /**
         * An arbitrary string delivered to the target address with each notification delivered over this channel. Optional.
         */
        token: string;
        /**
         * The type of delivery mechanism used for this channel.
         */
        type: string;
    }
    /**
     * A comment on a file.
     */
    interface IComment {
        /**
         * A region of the document represented as a JSON string. See anchor documentation for details on how to define and interpret anchor properties.
         */
        anchor: string;
        /**
         * The user who created the comment.
         */
        author: IUser;
        /**
         * The plain text content of the comment. This field is used for setting the content, while htmlContent should be displayed.
         */
        content: string;
        /**
         * The time at which the comment was created (RFC 3339 date-time).
         */
        createdTime: string; // date-time
        /**
         * Whether the comment has been deleted. A deleted comment has no content.
         */
        deleted: boolean;
        /**
         * The content of the comment with HTML formatting.
         */
        htmlContent: string;
        /**
         * The ID of the comment.
         */
        id: string;
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#comment".
         */
        kind: string;
        /**
         * The last time the comment or any of its replies was modified (RFC 3339 date-time).
         */
        modifiedTime: string; // date-time
        /**
         * The file content to which the comment refers, typically within the anchor region. For a text file, for example, this would be the text at the location of the comment.
         */
        quotedFileContent: {
            mimeType: string;
            value: string;
        };
        /**
         * The full list of replies to the comment in chronological order.
         */
        replies: IReply[];
        /**
         * Whether the comment has been resolved by one of its replies.
         */
        resolved: boolean;
    }
    /**
     * A list of comments on a file.
     */
    interface ICommentList {
        /**
         * The page of comments.
         */
        comments: IComment[];
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#commentList".
         */
        kind: string;
        /**
         * The page token for the next page of comments. This will be absent if the end of the comments list has been reached.
         */
        nextPageToken: string;
    }
    /**
     * The metadata for a file.
     */
    interface IFile {
        /**
         * A collection of arbitrary key-value pairs which are private to the requesting app.
         * Entries with null values are cleared in update and copy requests.
         */
        appProperties: {
            [name:string]: string;
        };
        /**
         * Capabilities the current user has on the file.
         */
        capabilities: {
            canComment: boolean;
            canCopy: boolean;
            canEdit: boolean;
            canReadRevisions: boolean;
            canShare: boolean;
        };
        /**
         * Additional information about the content of the file. These fields are never populated in responses.
         */
        contentHints: {
            indexableText: string;
            thumbnail: {
                image: string; // byte
                mimeType: string;
            };
        };
        /**
         * The time at which the file was created (RFC 3339 date-time).
         */
        createdTime: string; // date-time
        /**
         * A short description of the file.
         */
        description: string;
        /**
         * Whether the file has been explicitly trashed, as opposed to recursively trashed from a parent folder.
         */
        explicitlyTrashed: boolean;
        /**
         * The final component of fullFileExtension. This is only available for files with binary content in Drive.
         */
        fileExtension: string;
        /**
         * The color for a folder as an RGB hex string. The supported colors are published in the folderColorPalette field of the About resource.
         * If an unsupported color is specified, the closest color in the palette will be used instead.
         */
        folderColorRgb: string;
        /**
         * The full file extension extracted from the name field. May contain multiple concatenated extensions, such as "tar.gz". This is only available for files with binary content in Drive.
         * This is automatically updated when the name field changes, however it is not cleared if the new name does not contain a valid extension.
         */
        fullFileExtension: string;
        /**
         * The ID of the file's head revision. This is currently only available for files with binary content in Drive.
         */
        headRevisionId: string;
        /**
         * A static, unauthenticated link to the file's icon.
         */
        iconLink: string;
        /**
         * The ID of the file.
         */
        id: string;
        /**
         * Additional metadata about image media, if available.
         */
        imageMediaMetadata: {
            aperture: number; // float
            cameraMake: string;
            cameraModel: string;
            colorSpace: string;
            exposureBias: number; // float
            exposureMode: string;
            exposureTime: number; // float
            flashUsed: boolean;
            focalLength: number; // float
            height: number; // int32
            isoSpeed: number; // int32
            lens: string;
            location: {
                altitude: number; // double
                latitude: number; // double
                longitude: number; // double
            };
            maxApertureValue: number; // float
            meteringMode: string;
            rotation: number; // int32
            sensor: string;
            subjectDistance: number; // int32
            time: string;
            whiteBalance: string;
            width: number; // int32
        };
        /**
         * Whether the file was created or opened by the requesting app.
         */
        isAppAuthorized: boolean;
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#file".
         */
        kind: string;
        /**
         * The last user to modify the file.
         */
        lastModifyingUser: IUser;
        /**
         * The MD5 checksum for the content of the file. This is only applicable to files with binary content in Drive.
         */
        md5Checksum: string;
        /**
         * The MIME type of the file.
         * Drive will attempt to automatically detect an appropriate value from uploaded content if no value is provided. The value cannot be changed unless a new revision is uploaded.
         * If a file is created with a Google Doc MIME type, the uploaded content will be imported if possible. The supported import formats are published in the About resource.
         */
        mimeType: string;
        /**
         * Whether the file has been modified by this user.
         */
        modifiedByMe: boolean;
        /**
         * The last time the file was modified by the user (RFC 3339 date-time).
         */
        modifiedByMeTime: string; // date-time
        /**
         * The last time the file was modified by anyone (RFC 3339 date-time).
         * Note that setting modifiedTime will also update modifiedByMeTime for the user.
         */
        modifiedTime: string; // date-time
        /**
         * The name of the file. This is not necessarily unique within a folder.
         */
        name: string;
        /**
         * The original filename of the uploaded content if available, or else the original value of the name field. This is only available for files with binary content in Drive.
         */
        originalFilename: string;
        /**
         * Whether the user owns the file.
         */
        ownedByMe: boolean;
        /**
         * The owners of the file. Currently, only certain legacy files may have more than one owner.
         */
        owners: IUser[];
        /**
         * The IDs of the parent folders which contain the file.
         * If not specified as part of a create request, the file will be placed directly in the My Drive folder. Update requests must use the addParents and removeParents parameters to modify the values.
         */
        parents: string[];
        /**
         * The full list of permissions for the file. This is only available if the requesting user can share the file.
         */
        permissions: IPermission[];
        /**
         * A collection of arbitrary key-value pairs which are visible to all apps.
         * Entries with null values are cleared in update and copy requests.
         */
        properties: {
            [name:string]: string;
        };
        /**
         * The number of storage quota bytes used by the file. This includes the head revision as well as previous revisions with keepForever enabled.
         */
        quotaBytesUsed: string; // int64
        /**
         * Whether the file has been shared.
         */
        shared: boolean;
        /**
         * The time at which the file was shared with the user, if applicable (RFC 3339 date-time).
         */
        sharedWithMeTime: string; // date-time
        /**
         * The user who shared the file with the requesting user, if applicable.
         */
        sharingUser: IUser;
        /**
         * The size of the file's content in bytes. This is only applicable to files with binary content in Drive.
         */
        size: string; // int64
        /**
         * The list of spaces which contain the file. The currently supported values are 'drive', 'appDataFolder' and 'photos'.
         */
        spaces: string[];
        /**
         * Whether the user has starred the file.
         */
        starred: boolean;
        /**
         * A short-lived link to the file's thumbnail, if available. Typically lasts on the order of hours.
         */
        thumbnailLink: string;
        /**
         * Whether the file has been trashed, either explicitly or from a trashed parent folder. Only the owner may trash a file, and other users cannot see files in the owner's trash.
         */
        trashed: boolean;
        /**
         * A monotonically increasing version number for the file. This reflects every change made to the file on the server, even those not visible to the user.
         */
        version: string; // int64
        /**
         * Additional metadata about video media. This may not be available immediately upon upload.
         */
        videoMediaMetadata: {
            durationMillis: string; // int64
            height: number; // int32
            width: number; // int32
        };
        /**
         * Whether the file has been viewed by this user.
         */
        viewedByMe: boolean;
        /**
         * The last time the file was viewed by the user (RFC 3339 date-time).
         */
        viewedByMeTime: string; // date-time
        /**
         * Whether users with only reader or commenter permission can copy the file's content. This affects copy, download, and print operations.
         */
        viewersCanCopyContent: boolean;
        /**
         * A link for downloading the content of the file in a browser. This is only available for files with binary content in Drive.
         */
        webContentLink: string;
        /**
         * A link for opening the file in a relevant Google editor or viewer in a browser.
         */
        webViewLink: string;
        /**
         * Whether users with only writer permission can modify the file's permissions.
         */
        writersCanShare: boolean;
    }
    /**
     * A list of files.
     */
    interface IFileList {
        /**
         * The page of files.
         */
        files: IFile[];
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#fileList".
         */
        kind: string;
        /**
         * The page token for the next page of files. This will be absent if the end of the files list has been reached.
         */
        nextPageToken: string;
    }
    /**
     * A list of generated file IDs which can be provided in create requests.
     */
    interface IGeneratedIds {
        /**
         * The IDs generated for the requesting user in the specified space.
         */
        ids: string[];
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#generatedIds".
         */
        kind: string;
        /**
         * The type of file that can be created with these IDs.
         */
        space: string;
    }
    /**
     * A permission for a file. A permission grants a user, group, domain or the world access to a file or a folder hierarchy.
     */
    interface IPermission {
        /**
         * Whether the permission allows the file to be discovered through search. This is only applicable for permissions of type domain or anyone.
         */
        allowFileDiscovery: boolean;
        /**
         * A displayable name for users, groups or domains.
         */
        displayName: string;
        /**
         * The domain to which this permission refers.
         */
        domain: string;
        /**
         * The email address of the user or group to which this permission refers.
         */
        emailAddress: string;
        /**
         * The time at which this permission will expire (RFC 3339 date-time).
         */
        expirationTime: string; // date-time
        /**
         * The ID of this permission. This is a unique identifier for the grantee, and is published in User resources as permissionId.
         */
        id: string;
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#permission".
         */
        kind: string;
        /**
         * A link to the user's profile photo, if available.
         */
        photoLink: string;
        /**
         * The role granted by this permission. Valid values are:  
         * - owner 
         * - writer 
         * - commenter 
         * - reader
         */
        role: string;
        /**
         * The type of the grantee. Valid values are:  
         * - user 
         * - group 
         * - domain 
         * - anyone
         */
        type: string;
    }
    /**
     * A list of permissions for a file.
     */
    interface IPermissionList {
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#permissionList".
         */
        kind: string;
        /**
         * The full list of permissions.
         */
        permissions: IPermission[];
    }
    /**
     * A reply to a comment on a file.
     */
    interface IReply {
        /**
         * The action the reply performed to the parent comment. Valid values are:  
         * - resolve 
         * - reopen
         */
        action: string;
        /**
         * The user who created the reply.
         */
        author: IUser;
        /**
         * The plain text content of the reply. This field is used for setting the content, while htmlContent should be displayed. This is required on creates if no action is specified.
         */
        content: string;
        /**
         * The time at which the reply was created (RFC 3339 date-time).
         */
        createdTime: string; // date-time
        /**
         * Whether the reply has been deleted. A deleted reply has no content.
         */
        deleted: boolean;
        /**
         * The content of the reply with HTML formatting.
         */
        htmlContent: string;
        /**
         * The ID of the reply.
         */
        id: string;
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#reply".
         */
        kind: string;
        /**
         * The last time the reply was modified (RFC 3339 date-time).
         */
        modifiedTime: string; // date-time
    }
    /**
     * A list of replies to a comment on a file.
     */
    interface IReplyList {
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#replyList".
         */
        kind: string;
        /**
         * The page token for the next page of replies. This will be absent if the end of the replies list has been reached.
         */
        nextPageToken: string;
        /**
         * The page of replies.
         */
        replies: IReply[];
    }
    /**
     * The metadata for a revision to a file.
     */
    interface IRevision {
        /**
         * The ID of the revision.
         */
        id: string;
        /**
         * Whether to keep this revision forever, even if it is no longer the head revision. If not set, the revision will be automatically purged 30 days after newer content is uploaded. This can be set on a maximum of 200 revisions for a file.
         * This field is only applicable to files with binary content in Drive.
         */
        keepForever: boolean;
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#revision".
         */
        kind: string;
        /**
         * The last user to modify this revision.
         */
        lastModifyingUser: IUser;
        /**
         * The MD5 checksum of the revision's content. This is only applicable to files with binary content in Drive.
         */
        md5Checksum: string;
        /**
         * The MIME type of the revision.
         */
        mimeType: string;
        /**
         * The last time the revision was modified (RFC 3339 date-time).
         */
        modifiedTime: string; // date-time
        /**
         * The original filename used to create this revision. This is only applicable to files with binary content in Drive.
         */
        originalFilename: string;
        /**
         * Whether subsequent revisions will be automatically republished. This is only applicable to Google Docs.
         */
        publishAuto: boolean;
        /**
         * Whether this revision is published. This is only applicable to Google Docs.
         */
        published: boolean;
        /**
         * Whether this revision is published outside the domain. This is only applicable to Google Docs.
         */
        publishedOutsideDomain: boolean;
        /**
         * The size of the revision's content in bytes. This is only applicable to files with binary content in Drive.
         */
        size: string; // int64
    }
    /**
     * A list of revisions of a file.
     */
    interface IRevisionList {
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#revisionList".
         */
        kind: string;
        /**
         * The page token for the next page of revisions. This will be absent if the end of the revisions list has been reached.
         */
        nextPageToken: string;
        /**
         * The full list of revisions.
         */
        revisions: IRevision[];
    }
    interface IStartPageToken {
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#startPageToken".
         */
        kind: string;
        /**
         * The starting page token for listing changes.
         */
        startPageToken: string;
    }
    /**
     * Information about a Drive user.
     */
    interface IUser {
        /**
         * A plain text displayable name for this user.
         */
        displayName: string;
        /**
         * The email address of the user. This may not be present in certain contexts if the user has not made their email address visible to the requester.
         */
        emailAddress: string;
        /**
         * Identifies what kind of resource this is. Value: the fixed string "drive#user".
         */
        kind: string;
        /**
         * Whether this user is the requesting user.
         */
        me: boolean;
        /**
         * The user's ID as visible in Permission resources.
         */
        permissionId: string;
        /**
         * A link to the user's profile photo, if available.
         */
        photoLink: string;
    }
}
