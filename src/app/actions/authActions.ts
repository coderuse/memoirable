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

export function createInitialFolderStructure(payload?: any) {
  AppDispatcher.dispatch(new AppEvent(AuthActionTypes.GOOGLE_CREATE_INITIAL_FOLDERS, payload));
}

export function calendarDateChanged(payload?: any){
  AppDispatcher.dispatch(new AppEvent(AuthActionTypes.CALENDAR_DATE_CHANGED, payload));
}