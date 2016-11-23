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

export interface IMarkdowState { inputText?: string , files?: any};

export default class Markdown extends React.Component<{}, IMarkdowState> {
  _listenerToken : FBEmitter.EventSubscription;
  valueBefore: string;
  files: any;
  valueWhileSaving: string = '';
  focusCount: number = 0;
  fetchedFileState: string = 'file.initial';
  constructor(props) {
    super(props);
    this.state = { inputText: `# Diary, O' Diary!!!`};
 }

  _navigateBack() {
    browserHistory.goBack();
  }

  componentWillMount() {
    
  }

  shouldComponentUpdate(nextProps, nextState, nextContext){
    return true;
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

      this.valueBefore = editor.getValue();
      var timeout;
      let val = editor.getValue();
      if(typeof timeout !== 'function'){
        timeout = setTimeout(function(val, state) {
                    this._checkTriggerShouldHappenOrNot(val,state)
                  }.bind(this, val , this.fetchedFileState), 2000);
      }
      
    }.bind(this));


    editor.on("focus", function(){
      if(this.focusCount === 0 ){
        this.setState({ inputText : ''});
      }
      editor.setValue(this.state.inputText);
      this.focusCount++;
      that.fetchedFileState = 'file.changed';
    }.bind(this));

    var that = this;
    this._listenerToken = GAuthStore.addChangeListener(AuthActionTypes.SELECTED_FILE, function(){
      GAuthStore._getFileContents(GAuthStore.currentFileId).then( function(response){
          that.fetchedFileState = 'file.fetched';
          that.setState({inputText: response.body});
          editor.setValue(that.state.inputText);
          that.focusCount = 0;
          that.valueWhileSaving = '';

          if(response.body.length >= 10){
            that.focusCount++;
          }
      }, function(reason){
        console.log(reason);
      });
    });
  }

  _checkTriggerShouldHappenOrNot(val){
    if(this.fetchedFileState !== 'file.fetched' && val && val.length >= 10 && this.state.inputText === val && this.valueWhileSaving !== val){
      var key = 'update';

      if(GAuthStore.currentFileId === ''){
        key = 'create';
      }
      this.valueWhileSaving = this.state.inputText;
      GAuthStore._createOrUpdateFile(GAuthStore.currentFolderIdInUse,'',this.state.inputText,0, key, GAuthStore.selectedDate);
    }
  }

  newEntry(){
    // Empty the editor
    const editor = ace.edit('editor');
    this.setState({inputText: ''});
    editor.setValue('');
    this.focusCount = 0;
    this.valueWhileSaving = '';
    GAuthStore.currentFileId = '';
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
          <div className="new-entry" onClick={this.newEntry.bind(this)} title="Add New Entry">
            <i className="memocon memocon-add"></i>
          </div>
        </div>
      </div>
    );
  }
}