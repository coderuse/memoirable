/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IndexLink, Link } from 'react-router';
import { AuthActionTypes, ProviderTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import GAuthStore from '../stores/gAuthStore';
import Entries from '../components/entries';
import browserHistory from '../browserHistory';

declare function require(name:string);
var ReactMarkdown = require('react-markdown');

import * as ace from 'brace';
import 'brace/mode/markdown';
import 'brace/theme/textmate';

function onChange(newValue) {
  console.log('change',newValue);
}

export interface IMarkdowState { inputText?: string , files?: any};

export default class Markdown extends React.Component<{}, IMarkdowState> {
  _listenerToken : FBEmitter.EventSubscription;
  _valueBefore: string;
  files: any;
  constructor(props) {
    super(props);
    this.state = { inputText: `# Diary, O' Diary!!!`};
 }

  _navigateBack() {
    browserHistory.goBack();
  }

  componentWillMount() {
    this.fetchFilesForToday();
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
      wrap: true,
      vScrollBarAlwaysVisible: true
    });
    //editor.getSession().setMode('ace/mode/markdown');
    //editor.setTheme('ace/theme/chaos');
    editor.setValue(this.state.inputText);
    editor.on('change',function(e){
      this.setState({inputText: editor.getValue()});

      this._valueBefore = editor.getValue();
      var timeout;
      let val = editor.getValue();
      if(typeof timeout !== 'function'){
        timeout = setTimeout(function(val) {
                    this._checkTriggerShouldHappenOrNot(val)
                  }.bind(this, val ), 2000);
      }
      
    }.bind(this));
  }

  _checkTriggerShouldHappenOrNot(val){
    if(this.state.inputText === val){
      GAuthStore._createOrUpdateFile('','',this.state.inputText,0);
    }
  }

  newEntry(){
    var that = this;
    const editor = ace.edit('editor');
    var pr = new Promise( function(resolve, reject ){
      
    });

    GAuthStore._addNewEntry(pr);

    pr.then(function(response: any){
        
      console.log("*********************");
      
      console.log(response);
      console.log("*********************");

      that.setState({files: response.files});
    
    }, function(reason){

    });
  }

  fetchFilesForToday(){
    let date = new Date();
    let selectedDate = date.getFullYear()+"."+date.getMonth()+"."+date.getDate();
    var that = this;
    var pr = new Promise( function(resolve, reject ){
      
    });

    GAuthStore._getFilesByDate(selectedDate,pr)

    

    pr.then(function(response: any){
        
      console.log("*********************");
      
      console.log(response);
      console.log("*********************");

      that.setState({files: response.files});
    
    }, function(reason){

    });
  }

  render() {
    return (
      <div className="row">
        <div className="markdown markdown-left">
          <div id="editor"></div>
          <Entries></Entries>
        </div>
        <div className="markdown markdown-right">
          <div id="markdown-output" className="markdown-output-wrapper">
            <ReactMarkdown source={this.state.inputText} />
          </div>
          <div className="new-entry" onClick={this.newEntry} title="Add New Entry">
            <i className="memocon memocon-add"></i>
          </div>
        </div>
      </div>
    );
  }
}
