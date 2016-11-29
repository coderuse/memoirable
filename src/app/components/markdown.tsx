/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IndexLink, Link } from 'react-router';
import { AuthActionTypes, ProviderTypes, EditorActionTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import GAuthStore from '../stores/gAuthStore';
import Entries from '../components/entries';
import browserHistory from '../browserHistory';
import Emitter from '../events/appEvent';

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
  initialFileValue: string;

  constructor(props) {
    super(props);
    this.state = { inputText: `# Diary, O' Diary!!!`};
 }

  /**
   * @description
   *
   * Handles the back functionality of browser
   * 
   * @returns 
   */
  _navigateBack() {
    browserHistory.goBack();
  }

  /**
   * @description
   *
   * changes the selected text based on action such as BOLD, ITALICS, UNDERLINE
   * 
   * @param key: refers to whether the left button is clicked or right
   * @returns 
   */
  changeStyle(changeDelimiter: string, editor: ace.Editor) {
    let selectionRange = editor.getSelectionRange();
    editor.session.replace(selectionRange, changeDelimiter + editor.getCopyText() + changeDelimiter);
  }

  // https://github.com/ajaxorg/ace/wiki/Configuring-Ace
  // https://github.com/ajaxorg/ace/blob/master/lib/ace/theme/textmate.css
  componentDidMount() {
    const editor = ace.edit('editor');
    editor.$blockScrolling = Infinity;

    // listens to the editor actions
    Emitter.addListener('editor.actions', function(type: string) {
      switch(type) {
        case EditorActionTypes.BOLD:
          this.changeStyle('**', editor);
          break;
        case EditorActionTypes.ITALICS:
          this.changeStyle('*', editor);
          break;
        case EditorActionTypes.UNDERLINE:
          this.changeStyle('__', editor);
          break;
        case EditorActionTypes.LIST:
          this.changeStyle('*', editor);
          break;
        case EditorActionTypes.QUOTE:
          this.changeStyle('*', editor);
          break;
        default:
          break;
      }
    }.bind(this));
    
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

      if(typeof timeout !== 'function' && val !== this.initialFileValue){
        timeout = setTimeout(function(val, state) {
                    this._checkTriggerShouldHappenOrNot(val);
                  }.bind(this, val , this.fetchedFileState), 2000);
      }
      
    }.bind(this));

    // handles the focus of the editor
    editor.on("focus", function(){
      if(this.focusCount === 0 ){
        this.setState({ inputText : ''});
      }
      editor.setValue(this.state.inputText);
      this.focusCount++;
    }.bind(this));

    var that = this;

    // Add the listener for the selected file, whether it has changed or not
    this._listenerToken = GAuthStore.addChangeListener(AuthActionTypes.SELECTED_FILE, function(){
      if(GAuthStore.currentFileId !== ''){
        GAuthStore._getFileContents(GAuthStore.currentFileId).then( function(response){
            that.setState({inputText: response.body});
            that.initialFileValue = response.body;
            editor.setValue(that.state.inputText);
            that.focusCount = 0;
            that.valueWhileSaving = '';

            if(response.body.length >= 10){
              that.focusCount++;
            }
        }, function(reason){
          console.log(reason);
        });
      }
      else {
        that.setState({inputText: ''});
        that.initialFileValue = '';
        editor.setValue(that.state.inputText);
        that.focusCount = 0;
        that.valueWhileSaving = '';
      }
    });
  }

  /**
   * @description
   *
   * Checks whether to save the current file or not
   * 
   * @param key: refers to whether the left button is clicked or right
   * @returns 
   */
  _checkTriggerShouldHappenOrNot(val){
    if(val && val.length >= 10 && this.state.inputText === val && this.valueWhileSaving !== val){
      this.valueWhileSaving = this.state.inputText;
      GAuthStore._createOrUpdateFile(GAuthStore.currentFolderIdInUse,this.state.inputText , null , GAuthStore.selectedDate);
    }
  }

  /**
   * @description
   *
   * Adds a new entry: makes the editor blank and relevant changes
   * 
   * @param key: refers to whether the left button is clicked or right
   * @returns 
   */
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