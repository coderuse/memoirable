/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import browserHistory from '../browserHistory';
import { AuthActionTypes, ProviderTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import GAuthStore from '../stores/gAuthStore'; 

export class Home extends React.Component<{}, {}> {
  _listenerToken: FBEmitter.EventSubscription;
  constructor() {
    super();
  }

  componentDidMount() {
    this._listenerToken = GAuthStore.addChangeListener(AuthActionTypes.AUTH_INITIALIZE, () => { 
      browserHistory.push('/dashboard');     
    });
  }

  componentWillUnmount() {
    GAuthStore.removeChangeListener(this._listenerToken);
  }

  _authenticate(provider: string) {
    AuthActions.authorize({ provider: provider });
  } 

  render() {
    return (
      <div className="row">
        <div className="logo"></div>
        <div className="footer-to-diary">
          <button className="strip-button"
              onClick={this._authenticate.bind(this, ProviderTypes.GOOGLE) }>
            Hi, here's your diary.
          </button>
        </div>
      </div>
    );
  }
}