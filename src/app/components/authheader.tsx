/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AuthActionTypes, ProviderTypes, EditorActionTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import Emitter from '../events/appEvent';
import GAuthStore from '../stores/gAuthStore';

import CalendarWrapper from '../components/calendarwrapper';

export default class AuthHeader extends React.Component<{}, any> {
  _listenerToken: FBEmitter.EventSubscription;
  toggledClass: string = 'hide-header-menu';
  constructor() {
    super();
    GAuthStore.cleanState();
    this.state = GAuthStore.getState();
  }

  componentDidMount() {
    this._listenerToken = GAuthStore.addChangeListener(AuthActionTypes.AUTH_GET_PROFILE, this._setStateFromStores.bind(this));
    AuthActions.updateProfileInfo({ provider: ProviderTypes.GOOGLE });
    AuthActions.createInitialFolderStructure({ provider: ProviderTypes.GOOGLE});
  }

  componentWillUnmount() {
    GAuthStore.removeChangeListener(this._listenerToken);
  }

  _setStateFromStores() {
    this.setState(GAuthStore.getState());
  }

  saveToDrive(drive){
    AuthActions.createInitialFolderStructure({ provider: ProviderTypes.GOOGLE});
  }

  toggleClass(){
    this.toggledClass =  this.toggledClass === 'hide-header-menu' ? 'show-header-menu' : 'hide-header-menu' ;
    this.setState({'name':'button-state-changed'});
  }

  editorAction(type: any) {
    Emitter.emit('editor.actions', type);
  }

  render() {
    return (
      <div className="auth-header row">
          <CalendarWrapper></CalendarWrapper>
          <button className="strip-button pull-left">
            <span className="memocon-format_bold" onClick={() => this.editorAction(EditorActionTypes.BOLD)} />
          </button>
          <button className="strip-button pull-left">
            <span className="memocon-format_italic" onClick={() => this.editorAction(EditorActionTypes.ITALICS)} />
          </button>
          <button className="strip-button pull-left">
            <span className="memocon-format_underlined" onClick={() => this.editorAction(EditorActionTypes.UNDERLINE)} />
          </button>
          <button className="strip-button pull-left">
            <span className="memocon-format_list_bulleted" onClick={() => this.editorAction(EditorActionTypes.LIST)} />
          </button>
          <button className="strip-button pull-left">
            <span className="memocon-format_quote" onClick={() => this.editorAction(EditorActionTypes.QUOTE)} />
          </button>
          <button className="strip-button pull-right text-content">
            {this.state.displayName}
          </button>
      </div>
    );
  }
}
