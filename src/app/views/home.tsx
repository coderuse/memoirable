/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import browserHistory from '../browserHistory';
import { AuthActionTypes, ProviderTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import GAuthStore from '../stores/gAuthStore';

export interface IHomeState {
  diveInPages?: Array<any>
}; 

export class Home extends React.Component<{}, IHomeState> {
  _listenerToken: FBEmitter.EventSubscription;
  constructor() {
    super();
  }

  componentWillMount() {
    this.state = {
      diveInPages: []
    };
  }

  componentDidMount() {
    this._listenerToken = GAuthStore.addChangeListener(AuthActionTypes.AUTH_INITIALIZE, () => { 
      browserHistory.push('/dashboard');     
    });

    this.setState({
      diveInPages: [
        {
          text: '#First_Adventure'
        },
        {
          text: '#First_Date'
        },
        {
          text: '#With_Friends'
        },
        {
          text: '#The_Proposal'
        },
        {
          text: '#The_Marriage'
        },
        {
          text: '#The_Day'
        }
      ]
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
      <div className="row pers">
        <div className="logo"></div>
        <div className="dive-ins">
        {this.state.diveInPages.map(function(r, i) {
          return (
            <div key={r+i} className={'dive-in-' + (i + 1)}>
              <h1>{this.state.diveInPages[i].text}</h1>
            </div>
            );
        }.bind(this))}
        <div className="dive-in-7">
          <h1>#Let_All_Memoirables_Be_Written</h1>
        </div>
        </div>
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