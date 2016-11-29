/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../../../lib/dtds/index.d.ts" />

import AppDispatcher from '../dispatchers/appDispatcher';

import AppConstants from '../constants';

import { AuthActionTypes, ProviderTypes } from '../actions/types';
import { BaseStore } from './baseStore';
import { Server } from '../api/baseDAO';
import { AppEvent } from '../events/appEvent';
import { IAuth } from '../interfaces/auth';
import { Utils } from '../helpers';

// https://developers.google.com/drive/v3/web/appdata
// https://console.developers.google.com/apis/credentials?project=memoirable
// https://security.google.com/settings/security/permissions
class GoogleAuthStore extends BaseStore < IAuth > {
  _clientId = AppConstants.gAuthDetails.clientId;
  _scopes = AppConstants.gAuthDetails.scopes;
  callback: () => void;
  selectedDate = new Date();
  folderIds = {
    'Memoirable': '',
    'Entries': '',
    'currentFolderId': ''
  }
  currentFileId: string = '';
  currentFolderIdInUse: string;
  currentFileObj: any ;
  
  /**
   * @description
   *
   * Authorizes the user using the google API
   * 
   * @param immediate : boolean
   * @param event : refers to the event object
   * @returns 
   */
  _authorize(immediate: boolean, event: AppEvent) {
    gapi.auth.authorize({
      'client_id': this._clientId,
      'scope': this._scopes.join(' '),
      'immediate': immediate,
      response_type: 'token'
    }, function(authResult) {
      if (!authResult || authResult.error) {
        this._authorize.bind(this, false, event)();
        return;
      }

      this._changeToken = event.type;
      this.emitChange();
    }.bind(this));
  }
  /**
   * @description
   *
   * Fetches the user details
   * 
   * @param event : refers to the event object
   * @returns 
   */
  _getProfileInfo(event: AppEvent) {
    gapi.client.load('plus', 'v1', function() {
      var request = gapi.client.plus.people.get({
        'userId': 'me'
      });
      request.execute(function(resp) {
        this._state = {
          displayName: resp.displayName
        };
        this._changeToken = event.type;
        this.emitChange();
      }.bind(this));
    }.bind(this));
  }

  /**
   * @description
   *
   * Creates the initial structure if not present
   * 
   * @param event : refers to the event object
   * @param folderIds : refers to the folderIds object
   * @returns 
   */
  _createInitialFolderStructure(event: AppEvent, folderIds) {
    var that = this;
    gapi.client.load('drive', 'v3', function() {
      gapi.client.drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and name='Memoirable' or name='Entries'",
        fields: 'files(id, name)',
        spaces: 'appDataFolder'
      }).then(function(response) {

        // check whether the initial structure is present or not
        if (response.result.files.length !== 0) {
          response.result.files.forEach(function(item, index) {
            if (item.name === 'Memoirable') {
              folderIds['Memoirable'] = item.id;
            } else if (item.name === 'Entries') {
              folderIds['Entries'] = item.id;
            }
          });

          // Entries and Memoirable folder exists

        } else {

          // Initial Structure not present , create Memoirable and Entries Inside Memoirable folder
          let data = {
            name: 'Memoirable',
            mimeType: 'application/vnd.google-apps.folder',
            parents: ['appDataFolder']
          };

          that._requestForFolderGoogleDrive(data).then(function(response) {
            let data = {
              name: 'Entries',
              mimeType: 'application/vnd.google-apps.folder',
              parents: [response.result.id]
            };
            that._requestForFolderGoogleDrive(data).then(function(response) {
              console.log("Entries Folder created");
            }, function(reason) {
              console.log(reason);
            });
          }, function(reason) {
            console.log(reason);
          });
        }
      }, function(reason) {
        console.log(reason);
      });
    })
  }

  /**
   * @description
   *
   * Creates and promise of the google API request
   * 
   * @param data : refers to the data object 
   * @returns Promise of the google API request
   */
  _requestForFolderGoogleDrive(data) {
    return gapi.client.request({
      'path': '/drive/v3/files',
      'method': 'POST',
      'body': data
    })
  }

  /**
   * @description
   *
   * Creates the parameters and cleans them for the subsequent insert function
   * 
   * @param parentId : Id of the parent folder Id
   * @param data : data string to be saved
   * @param callback : callback function if any
   * @param selectedDate : current date in use if any
   * 
   * @returns 
   */
  _createOrUpdateFile(parentId, data, callback?, selectedDate?) {
    var parentId = parentId && parentId.length > 0 ? parentId : '';
    var date = selectedDate ? selectedDate : new Date(); // if date is given use it otherwise use the current day
    var parentName = ''+ date.getFullYear() +  Utils.padString(date.getMonth())  + Utils.padString(date.getDate());
    var filename = parentName + "." + data.substr(0,10)+ ".md";
    var file = new File([data.toString()], filename, { type: "text/markdown", })
    var fileId, key;
    if(this.currentFileId !== ''){
      key = 'update';
      fileId = this.currentFileId
    }
    else{
      key = 'create';
      fileId = '';
    }

    this._insertOrUpdateFile(file, parentId, filename, key, callback, fileId);

  }

  /**
   * @description
   *
   * Inserts or updates the file
   * 
   * @param fileData : File Object
   * @param folderId : id of the parent folder
   * @param filename : name of the file to be saved
   * @param key : whether to create or update the file
   * @param callback : callback function if any
   * @param fileId : used in case of update
   * 
   * @returns 
   */
  _insertOrUpdateFile(fileData, folderId? , filename? , key?,  callback? , fileId?) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    var that = this;
    var reader = new FileReader();
    reader.readAsBinaryString(fileData);
    reader.onload = function(e) {
      var contentType = fileData.type || 'application/octet-stream';
      var metadata = {
        'title': filename,
        'mimeType': contentType,
        'parents': [{ 'id': 'appfolder' }]
      };

      var path, method;
      if (key === 'update') {
        path = '/upload/drive/v2/files/' + fileId;
        method = 'PUT';
      } else {
        path = '/upload/drive/v2/files';
        method = 'POST';
      }

      var base64Data = btoa(reader.result);
      var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

      var request = gapi.client.request({
        'path': path,
        'method': method,
        'params': { 'uploadType': 'multipart' },
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
      });

      request.then(function(response) {
        console.log("inside the insert or update function");
        console.log(response);
        that.currentFileId = response.result.id;
        if(callback  && typeof callback === 'function'){
          callback(response.result.id);
        }

        that._changeToken = 'file.save';
        that.emitChange();
      }, function(reason) {

      })
    }
  }

  /**
   * @description
   *
   * Gets the current selected date
   * 
   * @returns 
   */
  _getSelectedDate() {
    return this.selectedDate;
  }

  /**
   * @description
   *
   * Sets the current selected date and emits the change 
   * 
   * @param event : refers to the event object
   * @returns 
   */
  _setSelectedDate(event) {
    this.selectedDate = event.payLoad.date;
    this._changeToken = event.type;
    setTimeout(function() { // Run after dispatcher has finished
      this.emitChange();
    }.bind(this), 0);
  }

  /**
   * @description
   *
   * Sets the current selected date and emits the change 
   * 
   * @param id : refers to the id of the file
   * @returns Promise of the google API request
   */
  _getFileContents(id) {
    return gapi.client.drive.files.get({
      fileId: id,
      alt: 'media'
    });
  }

  /**
   * @description
   *
   * Gets files for the selected date
   * 
   * @param event : refers to the id of the file with payLoad of date and callback
   * @returns
   */
  _getFilesByDate(event) {
    var date = event.payLoad.date;
    var pr = event.payLoad.pr;
    var that = this;
    gapi.client.load('drive', 'v3', function() {
      gapi.client.drive.files.list({
        q: "mimeType='text/markdown' and name contains " + "'" + date + "'",
        fields: 'files(id, name, modifiedTime)',
        spaces: 'appDataFolder',
        orderBy: 'modifiedTime desc'
      }).then(function(response) {

        if(response.result.files.length && response.result.files[0].id){
          that.currentFileId = response.result.files[0].id;
          that.currentFileObj = response.result.files[0];
          event.payLoad.pr(response.result.files);
        }
        else {
          that.currentFileId = '';
          event.payLoad.pr([]);
          that.currentFileObj = null;
          that.currentFileId = '';
        }
        
      }, function(reason) {

      });
    });
  }

  
  constructor(dispatcher: Flux.Dispatcher < AppEvent > ) {
    super(dispatcher, (event: AppEvent) => {
      if (event.payLoad.provider !== ProviderTypes.GOOGLE) {
        return;
      }
      switch (event.type) {
        case AuthActionTypes.AUTH_INITIALIZE:
          this._authorize.bind(this, true, event)();
          break;
        case AuthActionTypes.AUTH_GET_PROFILE:
          this._getProfileInfo.bind(this, event)();
          break;
        case AuthActionTypes.GOOGLE_CREATE_INITIAL_FOLDERS:
          this._createInitialFolderStructure.bind(this, event, this.folderIds)();
          break;
        case AuthActionTypes.CALENDAR_DATE_CHANGED:
          this._setSelectedDate.bind(this, event)();
          break;
        case AuthActionTypes.FETCH_FILES_FOR_DATE:
          this._getFilesByDate.bind(this, event)();
          break;  
        default:
          break;
      }

    }, () => {
      return {
        displayName: ''
      };
    });
  }
}

const GoogleAuthStoreInstance = new GoogleAuthStore(AppDispatcher);

export default GoogleAuthStoreInstance;
