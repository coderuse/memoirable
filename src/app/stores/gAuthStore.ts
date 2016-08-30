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
  _clientId = '732661329249-n46fvmeaa0mq1n7l8ks93r5kvmivqumi.apps.googleusercontent.com';
  _scopes = ['https://www.googleapis.com/auth/drive.appfolder', 'https://www.googleapis.com/auth/plus.me'];
  callback: () => void;
  _authorize(immediate: boolean, event: AppEvent) {

    gapi.auth.authorize(
      {
        'client_id': this._clientId,
        'scope': this._scopes.join(' '),
        'immediate': immediate
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
