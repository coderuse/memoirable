/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, IndexLink, Link } from 'react-router';
import { AuthActionTypes, ProviderTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import GAuthStore from '../stores/gAuthStore';
import { Utils } from '../helpers';

export default class Calender extends React.Component<{month: number, year: number}, any> {
  _listenerToken: FBEmitter.EventSubscription;
  toggledClass: string = 'hide-header-menu';
  month: any ;
  rowArray =  ['row1','row2','row3','row4','row5','row6'];
  constructor(props) {
    super();
    GAuthStore.cleanState();
    this.state = GAuthStore.getState();
    this.month = this.populateValuesByMonth(props.month, props.year);
  }

  componentDidMount() {
    this._listenerToken = GAuthStore.addChangeListener(AuthActionTypes.AUTH_GET_PROFILE, this._setStateFromStores.bind(this));
    AuthActions.updateProfileInfo({ provider: ProviderTypes.GOOGLE });
    this.setState({value:'changed'});
  }

  componentWillUnmount() {
    GAuthStore.removeChangeListener(this._listenerToken);
  }

  _setStateFromStores() {
    this.setState(GAuthStore.getState());
  }

  saveToDrive(drive){
   GAuthStore._saveToGoogleDrive("");
  }

  populateValuesByMonth(monthNum, year){
    let firstDate = new Date(year, monthNum);
    console.log(firstDate);
    let firstDay = firstDate.getDay();
    let count = 0;

    let month: any = {
      row1: [],
      row2: [],
      row3: [],
      row4: [],
      row5: [],
      row6: []
    };
    let rowArray =  ['row1','row2','row3','row4','row5','row6'];
    for(var i=0; i < rowArray.length; i++){
      for(var j=0; j < 7 ; j++){
        if(i==0 && j<firstDay){
          month[rowArray[i]].push('');
        }
        else{
          count = count+1;
          if(count> Utils.daysInMonth(monthNum, year)){
            month[rowArray[i]].push('');
          }
          else{
            month[rowArray[i]].push(count);
          }
          
        }
        
      }
    }
    return month;
  }

  toggleClass(){
    this.toggledClass =  this.toggledClass === 'hide-header-menu' ? 'show-header-menu' : 'hide-header-menu' ;
    this.setState({'name':'button-state-changed'});
  }

  render() {
    var month = this.month;
    return (
      <div className="calendar-wrapper">
        <div className="weekdays">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>
        {this.rowArray.map(function(rowNum,index){
          return <div key={rowNum+index} className="weekvalues">
              { month ? month[rowNum].map(function(val,index){
                if(val === ''){
                  return <div key={'empty'+index}>{val}</div>
                }
                else{
                  return <div key={'value'+index}>{val}</div>
                }
              }) : <div></div>}
            </div>
          }.bind(this))
        }
      </div>
    );
  }
}

