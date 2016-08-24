/// <reference path="../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';

import { Home } from './views/home';
import { MemoirableApp } from './components/memoirable';

ReactDOM.render(
  (
    <Router history={hashHistory}>
      <Route path="/" component={MemoirableApp}>
        <IndexRoute component={Home}/>
      </Route>
    </Router>
  ),
  document.getElementById('memoirable')
);