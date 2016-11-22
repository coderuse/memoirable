/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, IndexLink, Link } from 'react-router';
import { AuthActionTypes, ProviderTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import GAuthStore from '../stores/gAuthStore';

export interface IEntries {};
export interface IEntriesState {files? : any, currentClass: string}
export default class Entries extends React.Component<IEntries, IEntriesState> {
  _listenerToken: FBEmitter.EventSubscription;
  _currentClass : string = "hide-entries";
  constructor(props) {
    super();
  }
  selectedFile: any = {name : ''};
  componentWillMount() {
    this.fetchFilesForToday(false);
  }

  fetchFilesForToday(trigger){
    let date = new Date();
    let selectedDate = date.getFullYear()+"."+date.getMonth()+"."+date.getDate();
    var that = this;
    var pr = new Promise( function(resolve, reject ){
      resolve({
        this: that
      });
    });

    AuthActions.getFilesForSelectedDate({ provider: ProviderTypes.GOOGLE, date: selectedDate, pr: pr, trigger: trigger})
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
      GAuthStore._changeToken = AuthActionTypes.SELECTED_FILE;
      GAuthStore.emitChange();
    }
  }

  componentDidMount(){
    this._listenerToken = GAuthStore.addChangeListener(AuthActionTypes.SAVE_FILE, function(){
      this.fetchFilesForToday(true);
    }.bind(this));
  }

  render() {
    var files = this.state && this.state.files ? this.state.files : [];
    var that = this;
    var selectedFile = GAuthStore.currentFileObj? GAuthStore.currentFileObj : { 'name': 'initial'};
    selectedFile.cleanedName = selectedFile.name.substr(13,10);
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
              let value = val.name.substr(13,10);
              if(val.id === GAuthStore.currentFileId){
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
