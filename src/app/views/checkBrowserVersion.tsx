/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import browserHistory from '../browserHistory';

export class CheckBrowserVersion extends React.Component<{}, {}> {
  _isChrome: boolean;
  constructor() {
    super();
    
    this._isChrome = !!window['chrome'] && !!window['chrome']['webstore'];  
  }

  componentWillMount() {
    if (this._isChrome)
      browserHistory.push('/home');
  }

  render() {
    return (
      <div className="incompatible-browser-notice">
        Currently we only support Google Chrome. Please open this site in same.
      </div>
    );
  }
}