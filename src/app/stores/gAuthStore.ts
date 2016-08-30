/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../../../lib/typings/index.d.ts" />

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
  _scopes = ['https://www.googleapis.com/auth/drive.appfolder'];
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
  constructor(dispatcher: Flux.Dispatcher<AppEvent>) {
    super(dispatcher, (event: AppEvent) => {
      if (event.type !== AuthActionTypes.AUTHENTICATE_INITIALIZE ||
        event.payLoad.provider !== ProviderTypes.GOOGLE) {
        return;
      }
      this._authorize.bind(this, true, event)();
    }, () => {
      return {};
    });
  }
}

const GoogleAuthStoreInstance = new GoogleAuthStore(AppDispatcher);

export default GoogleAuthStoreInstance;
