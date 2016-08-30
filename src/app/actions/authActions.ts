/// <reference path="../../../typings/index.d.ts" />

import { AuthActionTypes } from './types';
import { AppEvent } from '../events/appEvent';
import AppDispatcher from '../dispatchers/appDispatcher';

export function authorize(payload?: { provider: string }) {
  AppDispatcher.dispatch(new AppEvent(AuthActionTypes.AUTH_INITIALIZE, payload));
}

export function updateProfileInfo(payload?: { provider: string }) {
  AppDispatcher.dispatch(new AppEvent(AuthActionTypes.AUTH_GET_PROFILE, payload));
}