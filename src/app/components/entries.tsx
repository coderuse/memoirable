/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, IndexLink, Link } from 'react-router';
import { ProviderTypes } from '../actions/types';
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
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return true;
  }

  fetchFilesForToday(){
    let date = GAuthStore._getSelectedDate();
    let selectedDate = date.getFullYear()+"."+date.getMonth()+"."+date.getDate();
    var that = this;
    GAuthStore._getFilesByDate(selectedDate, function(that, files){
      that.setState({files: files});
    }.bind(this, that))
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

  render() {
    var files = this.state && this.state.files ? this.state.files : [];
    return (
      <div className="memocon-view_headline" title="Entries" onClick={this.handleClickEntries.bind(this)}>
        <div className={this._currentClass}>
        { files ? files.map(function(val,index){
                        return <div key={index}>
                          {val.name}
                        </div>
                        }) : <div></div>
        }
        </div>
      </div>
    );
  }
}
