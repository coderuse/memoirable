/// <reference path="../../../typings/index.d.ts" />

import { Dispatcher } from 'flux';

import { AppEvent } from '../events/appEvent';

const AppDispatcher: Dispatcher<AppEvent> = new Dispatcher<AppEvent>();

export default AppDispatcher;