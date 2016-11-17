/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IndexLink, Link } from 'react-router';
import { AuthActionTypes, ProviderTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import GAuthStore from '../stores/gAuthStore';

import browserHistory from '../browserHistory';

declare function require(name:string);
var ReactMarkdown = require('react-markdown');

import * as ace from 'brace';
import 'brace/mode/markdown';
import 'brace/theme/textmate';

function onChange(newValue) {
  console.log('change',newValue);
}

export interface IMarkdowState { inputText: string };

export default class Markdown extends React.Component<{}, IMarkdowState> {
  _listenerToken : FBEmitter.EventSubscription;

  constructor(props) {
    super(props);
    this.state = { inputText: `# Diary, O' Diary!!!`};
 }

  _navigateBack() {
    browserHistory.goBack();
  }

  // https://github.com/ajaxorg/ace/wiki/Configuring-Ace
  // https://github.com/ajaxorg/ace/blob/master/lib/ace/theme/textmate.css
  componentDidMount() {
    const editor = ace.edit('editor');
    editor.setOptions({
      //fontFamily: 'tahoma',
      fontSize: '18pt',
      showGutter: false,
      showLineNumbers: false,
      highlightActiveLine: false,
      wrap: true
    });
    //editor.getSession().setMode('ace/mode/markdown');
    editor.setTheme('ace/theme/textmate');
    editor.setValue(this.state.inputText);
    editor.on('change',function(e){
      this.setState({inputText: editor.getValue()});
    }.bind(this));
  }

  saveToDrive(drive){
   //GAuthStore._saveToGoogleDrive(this.state.inputText);
  }

  render() {
    return (
      <div className="row">
        <div className="markdown-left">
          <div id="editor"></div>
        </div>
        <div className="markdown-right">
          <div id="markdown-output" className="markdown-output-wrapper">
            <ReactMarkdown source={this.state.inputText} />
          </div>
        </div>
      </div>
    );
  }
}

