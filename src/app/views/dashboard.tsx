/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AuthActionTypes, ProviderTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import MarkDown from '../components/markdown';
import AuthHeader from '../components/authheader';
import Calender from '../components/calender';
import GAuthStore from '../stores/gAuthStore';

import { IAuth } from '../interfaces/auth';

export class Dashboard extends React.Component<{}, IAuth> {
  _listenerToken: FBEmitter.EventSubscription;
  currentMonth: number;
  currentYear: number;
  constructor() {
    super();
    GAuthStore.cleanState();
    this.state = GAuthStore.getState();
    this.currentMonth = new Date().getMonth();
    
    this.currentYear = new Date().getFullYear();
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

  render() {
    var currentMonth = this.currentMonth;
    var currentYear = this.currentYear;
    return (
      <div className="row">
        <AuthHeader></AuthHeader>
        <div className="row">
          <div className="main-content-left">&nbsp;</div>
          <div className="main-content-right">
            <MarkDown></MarkDown>
          </div>
        </div>
        <div className="row">
          <Calender month={currentMonth - 1} year={currentYear}></Calender>
          <Calender month={currentMonth} year={currentYear}></Calender>
          <Calender month={currentMonth + 1} year={currentYear}></Calender>
        </div>
      </div>
    );
  }
}