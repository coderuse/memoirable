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
  _isChrome: boolean;
  _listenerToken: FBEmitter.EventSubscription;
  constructor() {
    super();
    
    this._isChrome = !!window['chrome'] && !!window['chrome']['webstore'];  
  }

  /**
   * @description
   *
   * Handles functionality when componentWillMount
   * 
   * @returns 
   */
  componentWillMount() {
    this.state = {
      diveInPages: []
    };
  }

  /**
   * @description
   *
   * Handles functionality when componentDidMount
   * 
   * @returns 
   */
  componentDidMount() {
    this._listenerToken = GAuthStore.addChangeListener(AuthActionTypes.AUTH_INITIALIZE, () => { 
      browserHistory.push('/dashboard');     
    });

    this.setState({
      diveInPages: [
        {
          text: '#first_adventure'
        },
        {
          text: '#first_date'
        },
        {
          text: '#with_friends'
        },
        {
          text: '#the_proposal'
        },
        {
          text: '#the_marriage'
        },
        {
          text: '#the_day'
        }
      ]
    });
  }

  /**
   * @description
   *
   * Handles functionality when componentWillUnmount
   * 
   * @returns 
   */
  componentWillUnmount() {
    GAuthStore.removeChangeListener(this._listenerToken);
  }

  /**
   * @description
   *
   * Authenticates based on provider
   * 
   * @param provider: refers to the provider
   * @returns 
   */
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
          <div className="message">
            <p className="hide-low-width">
            We wade through moments. Moments, we create, we become part of and some moments are just created for us. We should capture these moments. What we thought at that time. Some pictures of whom, we were with. And some evaluation/re-thinking of the activities we did at that time. We should write them. In a very personal space. Which no one but only you can access anytime. And that should also be free. Because, such space should have no connection with earthly matters.
            </p>
            <p>
            We have made this diary. It's not fancy. It's not full of features. It's very simple. But, here we can write our own words. In our own style. No one else but you can only access this. And of-course it's free. We are using GitHub pages for hosting. And using Google drive to store the files with your own authentication. So, complete privacy unless credential is shared with someone else. We are not even using any domain name. So, we have no recurring cost, neither you.
            </p>
            <p>Enjoy writing the <span className="message-logo">Memoirables</span>. :-)</p>
          </div>
        </div>
        </div>
        <div className="footer-to-diary">
          <span className={this._isChrome? 'collapse': 'not-supported'}>
            Currently we only support Chrome with at-least 1024px x 768px resolution
          </span>
          <button className={this._isChrome? 'strip-button': 'collapse'}
              onClick={this._authenticate.bind(this, ProviderTypes.GOOGLE) }>
            Hi, here's your diary
          </button>
        </div>
      </div>
    );
  }
}