/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AuthActionTypes, ProviderTypes, EditorActionTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import Emitter from '../events/appEvent';
import GAuthStore from '../stores/gAuthStore';
import browserHistory from '../browserHistory';
import CalendarWrapper from '../components/calendarwrapper';

export default class AuthHeader extends React.Component<{}, any> {
  _listenerToken: FBEmitter.EventSubscription;
  toggledClass: string = 'hide-header-menu';
  constructor() {
    super();
    GAuthStore.cleanState();
    this.state = GAuthStore.getState();
  }

  /**
   * @description
   *
   * Adds listener, updates profile info and creates initial folder structure in google drive
   * 
   * @returns 
   */
  componentDidMount() {
    this._listenerToken = GAuthStore.addChangeListener(AuthActionTypes.AUTH_GET_PROFILE, this._setStateFromStores.bind(this));
    AuthActions.updateProfileInfo({ provider: ProviderTypes.GOOGLE });
    AuthActions.createInitialFolderStructure({ provider: ProviderTypes.GOOGLE});
  }

  /**
   * @description
   *
   * Removes listener while unmounting
   * 
   * @returns 
   */
  componentWillUnmount() {
    GAuthStore.removeChangeListener(this._listenerToken);
  }

  /**
   * @description
   *
   * Sets state based on GAuthStore
   * 
   * @returns 
   */
  _setStateFromStores() {
    this.setState(GAuthStore.getState());
  }

  /**
   * @description
   *
   * Emits the editor related actions
   * 
   * @param type: refers to the type of editor action
   * @returns 
   */

  toggleClass(){
    this.toggledClass =  this.toggledClass.indexOf('hide-header-menu') !== -1 ? 'show-header-menu' : 'hide-header-menu' ;
    this.setState({'name':'button-state-changed'});
  }

  /**
   * @description
   *
   * Emits the editor related actions
   * 
   * @param type: refers to the type of editor action
   * @returns 
   */
  editorAction(type: any) {
    Emitter.emit('editor.actions', type);
  }

  logout() {
    GAuthStore._sign_out();
    browserHistory.replace('/');
    browserHistory.push('/');  
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
          <div className="dropdown pull-right">
            <button className="strip-button text-content" type="button" onClick={this.toggleClass.bind(this)}>
              {this.state.displayName}
            </button>
            <div className={this.toggledClass}>
              <button className="strip-button dropdown-button" onClick={this.logout}>Sign Out</button>
            </div>
          </div>
      </div>
    );
  }
}
