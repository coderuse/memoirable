/// <reference path="../../typings/index.d.ts" />

import { createHistory } from 'history';
import { Router, Route, IndexRoute, Link, useRouterHistory } from 'react-router';

const browserHistory = useRouterHistory(createHistory)({
  basename: '/memoirable'
});

export default browserHistory;