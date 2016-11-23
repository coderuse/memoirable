/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, IndexLink, Link } from 'react-router';
import { AuthActionTypes, ProviderTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import GAuthStore from '../stores/gAuthStore';

export interface IEntries {};
export interface IEntriesState {files? : any, currentClass?: string}
export default class Entries extends React.Component<IEntries, IEntriesState> {
  _listenerToken: FBEmitter.EventSubscription;
  _currentClass : string = "hide-entries";
  _listenerTokenDateChanged: FBEmitter.EventSubscription;
  constructor(props) {
    super();
  }
  selectedFile: any = {name : ''};
  componentWillMount() {
    this.fetchFiles(false);
  }

  fetchFiles(trigger, dateGiven?){
    console.log(dateGiven);
    let date = dateGiven ? dateGiven : new Date(); // if date is given use it otherwise use the current day
    let selectedDate = '' + date.getFullYear() + date.getMonth() + date.getDate();
    var that = this;

    AuthActions.getFilesForSelectedDate({ provider: ProviderTypes.GOOGLE, date: selectedDate, pr: function(files){
      that.setState({files: files});

      if(!trigger){
        that.entryClicked(files[0]);  
      }
      
    }})
  }
  
  handleClickEntries() {
    if(this._currentClass === 'hide-entries') {
      this._currentClass = 'show-entries';
    }
    else {
      this._currentClass = 'hide-entries';
    }
    this.setState({
      currentClass: this._currentClass
    })
  }

  entryClicked(obj) {
    if(obj && obj.id){
      GAuthStore.currentFileObj = obj;
      GAuthStore.currentFileId = obj.id;
      GAuthStore._changeToken = AuthActionTypes.SELECTED_FILE;
      GAuthStore.emitChange();
    }
  }

  componentDidMount(){
    this._listenerToken = GAuthStore.addChangeListener(AuthActionTypes.SAVE_FILE, function(){
      this.fetchFiles(true);
    }.bind(this));


    this._listenerTokenDateChanged = GAuthStore.addChangeListener(AuthActionTypes.CALENDAR_DATE_CHANGED, function(){
      this.fetchFiles(false, GAuthStore.selectedDate);
    }.bind(this));
  }

  render() {
    var files = this.state && this.state.files ? this.state.files : [];
    var that = this;
    var selectedFile = GAuthStore.currentFileObj? GAuthStore.currentFileObj : { 'name': 'initial'};
    selectedFile.cleanedName = selectedFile.name.substr(9,10);

    return (
      <div>
        <div className="memocon-view_headline" title="Entries" onClick={this.handleClickEntries.bind(this)}>
          
        </div>
        <div className={this._currentClass}>
          <div className="entries-header">
            <div className="entries-header-selected">{selectedFile.cleanedName}</div>
            <div className="entries-header-close" onClick={this.handleClickEntries.bind(this)}>X</div>
          </div>
          <div className="entries-list">
            { files ? files.map(function(val,index){

              let className = 'entries-item';
              let value = val.name.substr(9,10)+'...';
              if(val.id === selectedFile.id){
                className = className + " selected-item";
              }

              return <div className={className} key={index} onClick={that.entryClicked.bind(that, val)}>
                {value}
              </div>
              }) : <div></div>
            }
          </div>
        </div>
      </div>
    );
  }
}