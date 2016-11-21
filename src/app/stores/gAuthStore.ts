/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../../../lib/dtds/index.d.ts" />

import AppDispatcher from '../dispatchers/appDispatcher';

import { AuthActionTypes, ProviderTypes } from '../actions/types';
import { BaseStore } from './baseStore';
import { Server } from '../api/baseDAO';
import { AppEvent } from '../events/appEvent';
import { IAuth } from '../interfaces/auth';

// https://developers.google.com/drive/v3/web/appdata
// https://console.developers.google.com/apis/credentials?project=memoirable
// https://security.google.com/settings/security/permissions
class GoogleAuthStore extends BaseStore < IAuth > {
  _clientId = '797749045300-48asg0koqf5aa9npc40kmch9r754dl87.apps.googleusercontent.com';
  _scopes = ['https://www.googleapis.com/auth/drive.appdata', 'https://www.googleapis.com/auth/plus.me'];
  callback: () => void;
  selectedDate = new Date();
  folderIds = {
    'Memoirable': '',
    'Entries': '',
    'currentFolderId': ''
  }
  currentFileId: string;
  currentFolderIdInUse: string;

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

  _saveToGoogleDrive(data: string) {
    gapi.client.load('drive', 'v3', function() {
      var createRequest = gapi.client.drive.files.create({ 'uploadType': 'media' });
      createRequest.then(function(res) {
        gapi.client.request({ 
          'path': ('/upload/drive/v3/files/' + res.result.id).toString(),
          'method': 'PATCH', 
          'body': data, 
          'headers': '', 
          'params': '' })
        .then(function(response) {

        }, function(reason) {
          console.log(reason);
        });

      }, function(err) {
        console.log(err);
      });

    });
  }

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

          // create a folder for the current date in the format (yyyy/mm/dd) if it does not exists
          let date = new Date();
          that._createFolderIfNotExistent({
            name: date.getFullYear() + "." + date.getMonth() + "." + date.getDate(),
            parent: folderIds['Entries']
          });

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
              // create a folder for the current date in the format (yyyy/mm/dd) if it does not exists
              let date = new Date();
              that._createFolderIfNotExistent({
                name: date.getFullYear() + "." + date.getMonth() + "." + date.getDate(),
                parent: [response.result.id]
              });
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

  _createFolder(data) {
    var currentObj = {
      name: data.name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [data.parent]
    };
    return this._requestForFolderGoogleDrive(currentObj);
  }

  _createFolderIfNotExistent(data) {
    var that = this;
    gapi.client.load('drive', 'v3', function() {
      gapi.client.drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and name = '" + data.name + "'",
        fields: 'files(id, name)',
        spaces: 'appDataFolder'
      }).then(function(response) {
        if (response.result.files.length === 0) {
          that._createFolder(data).then(function(response) {
            that.currentFolderIdInUse = response.result.id;
            that.folderIds['currentFolderId'] = response.result.id;

            // folder with the current date is created, create the file for this day
            that._addNewEntry(function() {
              console.log("file created");
            });

          }, function(reason) {

          })
        } else {

          this._createOrUpdateFile(response.result.files[0].id, response.result.files[0].name, "", 0, this._getFileContents.bind(this, response.result.files[0].id));
          this.currentFolderIdInUse = response.result.files[0].id;
          this.folderIds['currentFolderId'] = response.result.files[0].id;
        }
      }.bind(this));
    }.bind(this));
  }

  _requestForFolderGoogleDrive(data) {
    return gapi.client.request({
      'path': '/drive/v3/files',
      'method': 'POST',
      'body': data
    })
  }

  _createOrUpdateFile(parentId, parentName, data, count, callback ? ) {
    var parentId = parentId.length > 0 ? parentId : this.currentFolderIdInUse;
    var date = new Date();
    var parentName = parentName.length > 0 ? parentName : date.getFullYear() + "." + date.getMonth() + "." + date.getDate();
    var count = count != 0 ? count : 1;
    var filename = parentName + "." + (count+1) + ".md";
    var file = new File([data.toString()], filename, { type: "text/markdown", })
    //var fileId = this.currentFileId ? this.currentFileId : '';

    this._isFileExistent(filename, parentName, this._insertOrUpdateFile.bind(this, file, parentId, filename, callback));

  }

  _isFileExistent(name: string, parent, callback) {
    var checkName = name.substr(0, name.length - 2);
    console.log(checkName);
    gapi.client.drive.files.list({
      q: "mimeType='text/markdown' and name contains " + "'" + checkName + "'",
      fields: 'files(id, name)',
      spaces: 'appDataFolder'
    }).then(function(response) {
      console.log(response);
      if (response.result.files.length === 0) {
        if (callback) {
          callback();
        }
      }
      else {
        if (callback) {
          let id = response.result.files[0].id;
          callback(id);
        }
      }
    }, function(reason) {

    });
  }

  _insertOrUpdateFile(fileData, folderId? , filename? , callback? , fileId?) {
    console.log(arguments);
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

      var path, method;
      if (fileId && fileId.length > 0) {
        path = '/upload/drive/v2/files/' + fileId;
        method = 'PUT'
      } else {
        path = '/upload/drive/v2/files';
        method = 'POST'
      }

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
        if (fileId) {
          that.currentFileId = response.result.id;
        }
        if (callback && fileId) {
          //callback(fileId);
          callback.resolve()
        }

       // that._getFileContents(response.result.id, callback);
      }, function(reason) {

      })
    }
  }

  _getSelectedDate() {
    return this.selectedDate;
  }

  _setSelectedDate(event) {
    this.selectedDate = event.payLoad.date;
    this._changeToken = event.type;
    this.emitChange();
  }

  _addNewEntry(callback) {
    let date = new Date();
    let name = date.getFullYear() + "." + date.getMonth() + "." + date.getDate() + ".";
    var that = this;
    gapi.client.drive.files.list({
      q: "mimeType='text/markdown' and name contains " + "'" + name + "'",
      fields: 'files(id, name)',
      spaces: 'appDataFolder'
    }).then(function(response) {
      let count = response.result.files.length;
      that._createOrUpdateFile('', '', '', count, callback);
    }, function(reason) {

    });
  }

  _getFileContents(id? , callback?) {
    gapi.client.drive.files.get({
      fileId: id,
      alt: 'media'
    }).then(function(response) {
      console.log(response);
      if(callback){
        console.log(callback);
        callback.resolve(response.body);
      }
    }, function(reason) {

    });
  }


  _getFilesByDate(date, pr) {
    gapi.client.load('drive', 'v3', function() {
      gapi.client.drive.files.list({
        q: "mimeType='text/markdown' and name contains " + "'" + date + "'",
        fields: 'files(id, name)',
        spaces: 'appDataFolder'
      }).then(function(response) {
        // found the files for the given date
        console.log(pr);
        pr.resolve(response.result.files);
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