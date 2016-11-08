/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, IndexLink, Link } from 'react-router';
import { AuthActionTypes, ProviderTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import GAuthStore from '../stores/gAuthStore';

declare function require(name:string);
var ReactMarkdown = require('react-markdown');

import * as ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

function onChange(newValue) {
  console.log('change',newValue);
}

export default class Markdown extends React.Component<{}, any> {
  _listenerToken : FBEmitter.EventSubscription;
  outputHTML: any;
  inputText: string;

  constructor(props) {
    super(props);
    this.state = {value: ""};
    this.inputText = "";
    this.handleChange = this.handleChange.bind(this);
 }

  handleChange(event) {
    this.inputText = event.target.value;
    this.setState({value: event.target.value});
  }

  _navigateBack() {
    browserHistory.goBack();
  }

  componentDidMount() {
    const editor = ace.edit('editor');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setTheme('ace/theme/monokai');
    editor.on('change',function(e){
      this.inputText = editor.getValue();
      this.setState({value: this.inputText});
    }.bind(this));
  }

  saveToDrive(drive){
   GAuthStore._saveToGoogleDrive(this.inputText);
  }

  render() {
    return (
      <div className="row">
        <div className="markdown-left">
          <div id="editor"> </div>
        </div>
        <div className="markdown-right">
          <div id="markdown-output" className="markdown-output-wrapper">
            <ReactMarkdown source={this.inputText} />
          </div>
        </div>
      </div>
    );
  }
}

