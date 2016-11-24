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
  CALENDAR_DATE_CHANGED: 'calendar.changedDate',
  FETCH_FILES_FOR_DATE: 'files.selectedDate',
  FETCH_PARTICULAR_FILE: 'files.fetchFile',
  SAVE_FILE: 'file.save',
  ADD_NEW_ENTRY: 'entry.add',
  SELECTED_FILE: 'file.selected'
}

export const ProviderTypes = {
  GOOGLE: 'google',
  ONEDRIVE: 'onedrive',
  DROPBOX: 'dropbox',
  LOCALDRIVE: 'localdrive'
}

export const EditorActionTypes = {
  BOLD: 'bold',
  ITALICS: 'italics',
  UNDERLINE: 'underline',
  LIST: 'list',
  QUOTE: 'quote'
} 