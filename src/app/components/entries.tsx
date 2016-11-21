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

  componentWillMount() {
    this.fetchFilesForToday();

    // this._listenerToken = GAuthStore.addChangeListener(AuthActionTypes.FETCH_FILES_FOR_DATE, function(){
    //   this.setState({date: GAuthStore._getSelectedDate()});
    // }.bind(this));
  }

  fetchFilesForToday(){
    let date = new Date();
    let selectedDate = date.getFullYear()+"."+date.getMonth()+"."+date.getDate();
    var that = this;
    var pr = new Promise( function(resolve, reject ){
      resolve({
        this: that
      });
    });

    AuthActions.getFilesForSelectedDate({ provider: ProviderTypes.GOOGLE, date: selectedDate, pr: pr })
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
      GAuthStore._getFileContents(obj.id).then( function(response){

      }, function(reason){

      });
    }
  }

  render() {
    var files = this.state && this.state.files ? this.state.files : [];
    var that = this;
    return (
      <div className="memocon-view_headline" title="Entries" onClick={this.handleClickEntries.bind(this)}>
        <div className={this._currentClass}>
        { files ? files.map(function(val,index){

          let value = val.name.substr(13,10);
                        return <div key={index} onClick={that.entryClicked.bind(that, val)}>
                          {value}
                        </div>
                        }) : <div></div>
        }
        </div>
      </div>
    );
  }
}
