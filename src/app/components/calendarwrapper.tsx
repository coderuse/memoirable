/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, IndexLink, Link } from 'react-router';
import Calendar from './calendar';
import GAuthStore from '../stores/gAuthStore';
import * as AuthActions from '../actions/authActions';
import { AuthActionTypes, ProviderTypes } from '../actions/types';
export default class CalendarWrapper extends React.Component<{}, { date?: Date, month?: number, year? :number}> {
  _listenerToken: FBEmitter.EventSubscription;
  date: number;
  count: number = 1;
  monthsArray;
  selectedDate: Date;
  constructor() {
    super();
    let dateFromStore = GAuthStore._getSelectedDate()
    this.state = {date: dateFromStore, month: dateFromStore.getMonth(), year: dateFromStore.getFullYear()};
  }

  componentWillMount() {
    this._listenerToken = GAuthStore.addChangeListener(AuthActionTypes.CALENDAR_DATE_CHANGED, function(){
      this.setState({date: GAuthStore._getSelectedDate()});
    }.bind(this));

    this.monthsArray = this.get3MonthsArray();
  }

  componentWillUnmount() {
    GAuthStore.removeChangeListener(this._listenerToken);
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    if( this.state.date !== nextState.date){
      return true;
    }
    else if( this.state.month !== nextState.month || this.state.year !== nextState.year) {
      return true;
    }
    else{
      return false;
    }
  }

  arrowClickHandler(key){
   let month = this.state.month;
   let year = this.state.year;
   if(key === 'left'){
      if(month === 0 ){
        month = 11;
        year = year -1 ;
      }
      else {
        month = month -1;
      }
    }
    else if (key === 'right'){
      if(month === 11){
        month = 0;
        year = year + 1;
      }
      else{
        month = month + 1;
      }
    }
    console.log('testing');
    
    this.setState({month: month, year: year});
    this.monthsArray = this.get3MonthsArray();
  }

  get3MonthsArray(){
    let monthsArray = [];
    let month = this.state.month;
    let year = this.state.year;

    if(month === 0 ){
      monthsArray.push({month: 11, year: year-1});
      monthsArray.push({month: 0, year: year});
      monthsArray.push({month: 1, year: year});
    }
    else if(month === 11){
      monthsArray.push({month: 10,year: year});
      monthsArray.push({month: 11,year: year});
      monthsArray.push({month: 0,year: year+1});
    }
    else{
      monthsArray.push({month: month-1,year: year});
      monthsArray.push({month: month,year: year});
      monthsArray.push({month: month+1,year: year});
    }

    return monthsArray;
  }

  render() {
    console.log("render called");
    return (
      <div className="wrapper">
        <div className="memocon-left-arrow" onClick={this.arrowClickHandler.bind(this,'left')}></div>
        <div className="selected-date"></div>
        <Calendar date={this.state.date} month={this.monthsArray[0].month} year={this.monthsArray[0].year}></Calendar>
        <Calendar date={this.state.date} month={this.monthsArray[1].month} year={this.monthsArray[1].year}></Calendar>
        <Calendar date={this.state.date} month={this.monthsArray[2].month} year={this.monthsArray[2].year}></Calendar>
        <div className="memocon-right-arrow" onClick={this.arrowClickHandler.bind(this,'right')}></div>
      </div>
    );
  }
}

