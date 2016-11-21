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

  render() {
    return (
      <div className="auth-header row">
          <CalendarWrapper></CalendarWrapper>
          <button className="strip-button pull-left">
            <span className="memocon-format_bold" />
          </button>
          <button className="strip-button pull-left">
            <span className="memocon-format_italic" />
          </button>
          <button className="strip-button pull-left">
            <span className="memocon-format_underlined" />
          </button>
          <button className="strip-button pull-left">
            <span className="memocon-format_list_bulleted" />
          </button>
          <button className="strip-button pull-left">
            <span className="memocon-format_quote" />
          </button>
          <button className="strip-button pull-right text-content">
            {this.state.displayName}
          </button>
      </div>
    );
  }
}
