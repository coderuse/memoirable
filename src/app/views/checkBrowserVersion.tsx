/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import browserHistory from '../browserHistory';

export class Home extends React.Component<{}, {}> {
  constructor() {
    super();
    
    const isChrome = !!window['chrome'] && !!window['chrome']['webstore'];
  }

}