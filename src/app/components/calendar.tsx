/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, IndexLink, Link } from 'react-router';
import { AuthActionTypes, ProviderTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import GAuthStore from '../stores/gAuthStore';
import { Utils } from '../helpers';

export interface ICalendarDate {date: any, month: number, year: number};

export default class Calendar extends React.Component<ICalendarDate, {}> {
  _listenerToken: FBEmitter.EventSubscription;
  toggledClass: string = 'hide-header-menu';
  monthArray: any ;
  rowArray =  ['row1','row2','row3','row4','row5','row6'];
  selectedDate: any;
  count : number = 0;

  constructor(props) {
    super();
    this.selectedDate = GAuthStore._getSelectedDate();
  }

  componentWillMount() {
    this.monthArray = this.populateValuesByMonth(this.props.month, this.props.year);
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {
   GAuthStore.removeChangeListener(this._listenerToken);
  }

  componentWillReceiveProps(nextProps) {
    
  }

  _setStateFromStores() {
  }

  saveToDrive(drive){
   GAuthStore._saveToGoogleDrive("");
  }

  populateValuesByMonth(monthNum, year){
    let firstDate = new Date(year, monthNum);
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

  handleClick(date){
    AuthActions.calendarDateChanged({ provider: ProviderTypes.GOOGLE, date: date});
  }

  render() {
    var month = this.monthArray;
    var year = this.props.year;
    var givenMonth = this.props.month;
    var givenMonthValue = Utils.getMonth(this.props.month);
    var key = this.count;
    var selectedDate = this.props.date;
    return (
      <div className="calendar-wrapper" key={key}>
        <div className="calendar-value">{givenMonthValue+' '+year}</div>
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
                let date = new Date(year,givenMonth, val);
                if(val === ''){
                  return <div key={'empty'+index} ></div>
                }
                else{
                  return <div className={Utils.compareDate(date ,selectedDate) ? 'selected-date'  : '' } key={'value'+index} onClick={() => {this.handleClick(date)}}>{val}</div>
                }
              }.bind(this)) : <div></div>}
            </div>
          }.bind(this))
        }
      </div>
    );
  }
}

