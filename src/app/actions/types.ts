export const LoadingActionTypes = {
  SHOW_LOADER: 'loader.show',
  HIDE_LOADER: 'loader.hide'
};

export const LoadEntriesActionTypes = {
  GET_ENTRIES: 'entries.get'
}

export const AuthActionTypes = {
  AUTH_INITIALIZE: 'auth.initialize',
  AUTH_GET_PROFILE: 'auth.getProfile',
  GOOGLE_CREATE_INITIAL_FOLDERS: 'google.initialFolders',
  CALENDAR_DATE_CHANGED: 'calendar.changedDate'
}

export const ProviderTypes = {
  GOOGLE: 'google',
  ONEDRIVE: 'onedrive',
  DROPBOX: 'dropbox',
  LOCALDRIVE: 'localdrive'
}