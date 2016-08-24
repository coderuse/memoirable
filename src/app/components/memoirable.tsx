/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hashHistory, IndexLink, Link } from 'react-router';

export class MemoirableApp extends React.Component<{}, {}> {
  constructor() {
    super();
  }

  _navigateBack() {
    hashHistory.goBack();
  }

  render() {
    return (
      <div className="row">
        <div id="header" />
        <div id="content">
          {this.props.children}
        </div>
        <div id="footer" />
      </div>
    );
  }
}