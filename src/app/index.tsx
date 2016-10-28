/// <reference path="../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router';

import { MemoirableApp } from './components/memoirable';
import { Markdown } from './components/markdown';
import { Home } from './views/home';
import { Dashboard } from './views/dashboard';

ReactDOM.render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={MemoirableApp}>
        <IndexRoute component={Home}/>
        <Route path="/dashboard" component={Dashboard}/>
        <Route path="/markdown" component={Markdown}/>
      </Route>
    </Router>
  ),
  document.getElementById('memoirable')
);