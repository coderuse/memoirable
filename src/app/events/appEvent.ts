/// <reference path="../../../typings/index.d.ts" />

import {EventEmitter} from 'fbemitter';

export class AppEvent {
  constructor(public type: string, public payLoad?: any) {}
}

const emitter = new EventEmitter();

export default emitter;