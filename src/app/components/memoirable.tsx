/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IndexLink, Link } from 'react-router';

import browserHistory from '../browserHistory';

export class MemoirableApp extends React.Component<{}, {}> {
  constructor() {
    super();
  }

  /**
   * @description
   *
   * Handles the browser back functionality
   * 
   * @returns 
   */
  _navigateBack() {
    browserHistory.goBack();
  }

  render() {
    return (
      <div className="container">
        <div id="header" />
        <div id="content">
          {this.props.children}
        </div>
        <div id="footer" />
      </div>
    );
  }
}
