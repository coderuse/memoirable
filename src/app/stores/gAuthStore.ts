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
class GoogleAuthStore extends BaseStore<IAuth>{
  _clientId = '797749045300-48asg0koqf5aa9npc40kmch9r754dl87.apps.googleusercontent.com';
  _scopes = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/plus.me'];
  callback: () => void;
  selectedDate = new Date();
  folderIds = {
    'Memoirable': '',
    'Entries': '',
    'currentFolderId': ''
  }
  currentFolderIdInUse: string;

  _authorize(immediate: boolean, event: AppEvent) {

    gapi.auth.authorize(
      {
        'client_id': this._clientId,
        'scope': this._scopes.join(' '),
        'immediate': immediate,
        response_type: 'token'
      }, function (authResult) {
        if (!authResult || authResult.error) {
          this._authorize.bind(this, false, event)();
          return;
        }

        this._changeToken = event.type;
        this.emitChange();
      }.bind(this));
  }
  _getProfileInfo(event: AppEvent) {
    gapi.client.load('plus', 'v1', function () {
      var request = gapi.client.plus.people.get({
        'userId': 'me'
      });
      request.execute(function (resp) {
        this._state = {
          displayName: resp.displayName
        };       
        this._changeToken = event.type;
        this.emitChange();
      }.bind(this));
    }.bind(this));
  }

  _saveToGoogleDrive(data:string){
    console.log(data);
    gapi.client.load('drive', 'v3', function(){
      var createRequest = gapi.client.drive.files.create({'uploadType':'media'});
      createRequest.then(function(res){
        console.log(res);
        gapi.client.request({'path': ('/upload/drive/v3/files/'+res.result.id).toString(), 'method':'PATCH', 'body':data, 'headers':'',  'params': ''}).then(function(response) {
          console.log(response);
        }, function(reason) {
          console.log(reason);
        });

      },function(err){
        console.log(err);
      });

   });
  }

  _createInitialFolderStructure(event: AppEvent, folderIds){
    var that = this;
    gapi.client.load('drive','v3', function(){

      gapi.client.drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and name='Memoirable' or name='Entries'",
        fields: 'files(id, name)',
        spaces: 'appDataFolder'
      }).then( function (response) {

        // check whether the initial structure is present or not 
        if(response.result.files.length !== 0){
          response.result.files.forEach( function( item, index){
            if(item.name === 'Memoirable'){
              folderIds['Memoirable'] = item.id;
            }
            else if ( item.name === 'Entries'){
              folderIds['Entries'] = item.id;
            }
          });

          // create a folder for the current date in the format (yyyy/mm/dd) if it does not exists
          let date = new Date();
          that._createFolderIfNotExistent({
            name : date.getFullYear()+"."+date.getMonth()+"."+date.getDate(),
            parent : folderIds['Entries']
          });

        }
        else {

          // Initial Structure not present , create Memoirable and Entries Inside Memoirable folder
          let data = {
              name : 'Memoirable',
              mimeType: 'application/vnd.google-apps.folder',
              parents: ['appDataFolder']
          };

          that._requestForFolderGoogleDrive(data).then(function(response) {
                let data = {
                  name : 'Entries',
                  mimeType: 'application/vnd.google-apps.folder',
                  parents: [response.result.id]
                };
                that._requestForFolderGoogleDrive(data).then(function(response) {
                  
                },function(reason){

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

  _createFolder(data){
    var currentObj = {
        name : data.name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [data.parent]
    };
    return this._requestForFolderGoogleDrive(currentObj);
  }

  _createFolderIfNotExistent(data){
    console.log(data);
    var that = this;
    gapi.client.load('drive','v3', function(){
      gapi.client.drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and name = '"+data.name+"'",
        fields: 'files(id, name)',
        spaces: 'appDataFolder'
      }).then( function (response) {
        if(response.result.files.length === 0){
          that._createFolder(data).then( function(response){
            this.currentFolderIdInUse = response.result.id;
            this.folderIds['currentFolderId'] = response.result.id;
          }, function(reason){

          })
        }
        else{
          console.log("folder exists");
          this.currentFolderIdInUse = response.result.files[0].id;
          this.folderIds['currentFolderId'] = response.result.files[0].id;
        }
      }.bind(this));
    }.bind(this));
  }

  _requestForFolderGoogleDrive(data){
    return gapi.client.request({
      'path': '/drive/v3/files',
      'method' : 'POST',
      'body': data
    })
  }

  _createFileUsingParentId(data){
    
    var that = this;
    //let currentFolderID = this.currentFolderIdInUse;
    gapi.client.load('drive','v3', function(){
      // gapi.client.drive.files.list({
      //   q: "mimeType='text/plain' and "+"'"+ currentFolderID +"'"+ " in parents",
      //   fields: 'files(id, name)',
      //   spaces: 'appDataFolder'
      // }).then( function (response) {
      //    console.log(response);
        
      //   gapi.client.drive.files.create({
      //     uploadType: 'media',
      //     resource: {
      //       mimeType: 'text/plain',
      //       spaces: ['appDataFolder'],
      //       parents: [ that.currentFolderIdInUse],
      //       name: '1_',
      //       appProperties : {
      //         data: JSON.stringify(data)
      //       }
      //     }
      //   }).then(function(response){
      //     console.log(response);
      //   } ,  function(reason) {

      //   });
      // });


      gapi.client.request({
        'path': 'upload/drive/v3/files',
        'method' : 'POST',
        'params' : {
          uploadType: 'multipart'
        },
        'body':
        {
                  name : 'Chabaskardaraye',
                  parents: [this.folderIds['currentFolderId']],
                  spaces: ['appDataFolder'],
                  appProperties: {
                    'data': JSON.stringify(data)
                  }
                }
      }).then(function(res){
        console.log(res);
      },function(r){})

      this._getCurrentFile(data)


    }.bind(this));

    

    

  }

  _getCurrentFile(data){
    var date = new Date();
    var folderIds =  this.folderIds;
    console.log(folderIds);
    var dateVal = date.getFullYear()+"."+date.getMonth()+"."+date.getDate();
      gapi.client.drive.files.list({
        q: "'"+this.folderIds['currentFolderId']+"'"+" in parents",
        fields: 'files(id, name, parents)',
        spaces: 'appDataFolder'
      }).then( function (response) {
         console.log(response);


        

        // gapi.client.drive.files.create({
        //   uploadType: 'media',
        //   resource: {
        //     mimeType: 'text/plain',
        //     spaces: ['appDataFolder'],
        //     parents: [folderIds['currentFolderId']],
        //     name: '1_',
        //     appProperties : {
        //       data: JSON.stringify(data)
        //     }
        //   }
        // }).then(function(response){
        //   console.log(response);
        // } ,  function(reason) {

        // });
      
      })
  }

  _getSelectedDate(){
    return this.selectedDate;
  }

  _setSelectedDate(event){
    this.selectedDate = event.payLoad.date;
    this._changeToken = event.type;
    this.emitChange();
  }

  _isInitialStructureSetup (){
    let params = {
      q:"mimeType='application/vnd.google-apps.folder' and name='Memoirable'",
      fields: 'nextPageToken, files(id, name)',
      spaces: 'drive',
    };

    gapi.client.request({
      'path': '/drive/v3/files',
      'method' : 'GET',
      'params' : Object.keys(params).map((i) => i+'='+params[i]).join('&')
    }).then( function(response){
      console.log(response.result);
    }, function(reason){

    })
  }

  constructor(dispatcher: Flux.Dispatcher<AppEvent>) {
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