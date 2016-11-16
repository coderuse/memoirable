/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, IndexLink, Link } from 'react-router';
import { AuthActionTypes, ProviderTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import CalendarWrapper from '../components/calendarwrapper';
import GAuthStore from '../stores/gAuthStore';


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

  render() {
    return (
      <header className="auth-header">
        <div className="auth-header-left">
          <CalendarWrapper></CalendarWrapper>
        </div>
        <div className="auth-header-right" onClick={this.toggleClass.bind(this)}> {this.state.displayName}
          <div className="dropdown-wrapper">
            <button id="savetodrive" className={this.toggledClass} type="button" onClick={this.saveToDrive.bind(this,'google')}>Create Initial Structure</button>
          </div>
        </div>
      </header>
    );
  }
}
