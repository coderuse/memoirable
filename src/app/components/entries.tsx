/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, IndexLink, Link } from 'react-router';
import { AuthActionTypes, ProviderTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import GAuthStore from '../stores/gAuthStore';
import { Utils } from '../helpers';

export interface IEntries {};
export interface IEntriesState {files? : any, currentClass?: string}
export default class Entries extends React.Component<IEntries, IEntriesState> {
  _listenerToken: FBEmitter.EventSubscription;
  _currentClass : string = 'hide-entries';
  _listenerTokenDateChanged: FBEmitter.EventSubscription;
  _displayInitialHeader : string =  'show-initial-header';
  _stopPropagation: boolean = false;
  constructor(props) {
    super();
  }
  selectedFile: any = {name : ''};

  /**
   * @description
   *
   * Handles functionality when the componentWillMount 
   * 
   * @returns 
   */
  componentWillMount() {
    this.fetchFiles(false);
  }
  
  /**
   * @description
   *
   * Fetches files for the selected date
   * 
   * @param trigger: refers whether we want to make the first file as selected or not
   * @param dateGiven: refers to the given date
   * @returns 
   */
  fetchFiles(trigger, dateGiven?){
    let date = dateGiven ? dateGiven : new Date(); // if date is given use it otherwise use the current day
    let selectedDate = '' + date.getFullYear() + Utils.padString(date.getMonth()) + Utils.padString(date.getDate());
    var that = this;

    AuthActions.getFilesForSelectedDate({ provider: ProviderTypes.GOOGLE, date: selectedDate, pr: function(files){
      that.setState({files: files});

      if(!trigger){
        that.entryClicked(files[0]);  
      }
      
    }})
  }
  
  /**
   * @description
   *
   * Handles the click of entries
   * 
   * @returns 
   */
  handleClickEntries() {
    if(this._currentClass === 'hide-entries') {
      this._currentClass = 'show-entries';
      this._displayInitialHeader = 'hide-initial-header';
    }
    else {
      this._currentClass = 'hide-entries';
      this._displayInitialHeader = 'show-initial-header';
    }
    this.setState({
      currentClass: this._currentClass
    })
  }

  /**
   * @description
   *
   * Handles the click of a particular entry
   * 
   * @param obj: refers to file object with id to be used as selected file
   * @returns 
   */
  entryClicked(obj) {
    if(obj && obj.id){
      GAuthStore.currentFileObj = obj;
      GAuthStore.currentFileId = obj.id;
    }
    GAuthStore._changeToken = AuthActionTypes.SELECTED_FILE;
    GAuthStore.emitChange();
  }

  /**
   * @description
   *
   * Handles functionality when componentDidMount
   * 
   * @returns 
   */
  componentDidMount(){
    this._listenerToken = GAuthStore.addChangeListener(AuthActionTypes.SAVE_FILE, function(){
      this.fetchFiles(true, GAuthStore.selectedDate);
    }.bind(this));


    this._listenerTokenDateChanged = GAuthStore.addChangeListener(AuthActionTypes.CALENDAR_DATE_CHANGED, function(){
      this.fetchFiles(false, GAuthStore.selectedDate);
    }.bind(this));
  }

  render() {
    var files = this.state && this.state.files ? this.state.files : [];
    var selectedFile = GAuthStore.currentFileObj != null ? GAuthStore.currentFileObj : { 'name': ''};
    selectedFile.cleanedName = selectedFile.name.substr(9,10);
    var displayInitialHeader = !this._currentClass;
    return (
      <div>
        <div className={this._displayInitialHeader} onClick={this.handleClickEntries.bind(this)}>
          <div className="entries-header">
              <div className="entries-header-selected">{selectedFile.cleanedName}</div>
          </div>
        </div>
        <div className={this._currentClass}>
          <div className="entries-header" onClick={this.handleClickEntries.bind(this)}>
            <div className="entries-header-selected">{selectedFile.cleanedName}</div>
            <div className="entries-header-minimize memocon-remove"></div>
          </div>
          <div className="entries-list">
            { files ? files.map(function(val,index){
              if(val){
                let className = 'entries-item';
                let value = val.name.substr(9,10)+'...';
                if(val.id === selectedFile.id){
                  className = className + " selected-item";
                }

                return <div className={className} key={index} onClick={() => this.entryClicked(val)}>
                  {value}
                </div>
                
              }
              }.bind(this))
              : <div></div>
            }
          </div>
      </div>
    </div>
    );
  }
}