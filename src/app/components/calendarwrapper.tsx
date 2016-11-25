/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, IndexLink, Link } from 'react-router';
import Calendar from './calendar';
import GAuthStore from '../stores/gAuthStore';
import * as AuthActions from '../actions/authActions';
import { AuthActionTypes, ProviderTypes } from '../actions/types';
export default class CalendarWrapper extends React.Component<{}, { date?: Date, month?: number, year? :number, wrapperstate?: string}> {
  _listenerToken: FBEmitter.EventSubscription;
  date: number;
  count: number = 1;
  wrapperToggledClass: string = 'hide-wrapper';
  monthsArray;
  selectedDate: Date;
  constructor() {
    super();
    let dateFromStore = GAuthStore._getSelectedDate()
    this.state = {date: dateFromStore, month: dateFromStore.getMonth(), year: dateFromStore.getFullYear()};
  }

  /**
   * @description
   *
   * Adds the listener for the calendar date changed event
   * populates the three months array based on the current month and year in use
   * 
   * @returns 
   */
  componentWillMount() {
    this._listenerToken = GAuthStore.addChangeListener(AuthActionTypes.CALENDAR_DATE_CHANGED, function(){
      this.setState({date: GAuthStore._getSelectedDate()});
    }.bind(this));
    this.monthsArray = this.get3MonthsArray(this.state.date.getMonth(),this.state.date.getFullYear());
  }

  /**
   * @description
   *
   * Removes the listener while unmounting
   * 
   * @returns 
   */
  componentWillUnmount() {
    GAuthStore.removeChangeListener(this._listenerToken);
  }

  /**
   * @description
   *
   * Checks whether the component should update or not
   * based on date has changed or not
   * current year and month have changed or not
   * whether to show the calendar wrapper or not
   * 
   * @param nextProps : refers to the next set of values for props object
   * @param nextState: refers to the next set of values for state object
   * @returns 
   */
  shouldComponentUpdate(nextProps: any, nextState: any) {
    if( this.state.date !== nextState.date){
      return true;
    }
    else if( this.state.month !== nextState.month || this.state.year !== nextState.year) {
      return true;
    }
    else if ( nextState.wrapperstate && nextState.wrapperstate === 'wrapper-toggled'){
      return true;
    }
    else{
      return false;
    }
  }

  /**
   * @description
   *
   * Click handler for left and right buttons for the calendar wrapper
   * 
   * @param key: refers to whether the left button is clicked or right
   * @returns 
   */
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
    this.monthsArray = this.get3MonthsArray(month,year);
    this.setState({month: month, year: year});
  }

  /**
   * @description
   *
   * Click handler for left and right buttons for the calendar wrapper
   * 
   * @param key: refers to whether the left button is clicked or right
   * @returns 
   */
  get3MonthsArray(month,year){
    let monthsArray = [];

    if(month === 0 ) {
      monthsArray.push({month: 11, year: year-1});
      monthsArray.push({month: 0, year: year});
      monthsArray.push({month: 1, year: year});
    }
    else if(month === 11) {
      monthsArray.push({month: 10,year: year});
      monthsArray.push({month: 11,year: year});
      monthsArray.push({month: 0,year: year+1});
    }
    else {
      monthsArray.push({month: month-1,year: year});
      monthsArray.push({month: month,year: year});
      monthsArray.push({month: month+1,year: year});
    }

    return monthsArray;
  }

  toggleCalendar() {
    if(this.wrapperToggledClass === 'hide-wrapper'){
      this.wrapperToggledClass = 'wrapper';
    }
    else {
      this.wrapperToggledClass = 'hide-wrapper';
    }

    this.setState({
      wrapperstate : 'wrapper-toggled'
    });
  }
  
  render() {
    return (
      <div className="calendar-wrapper-head">
        <button className="strip-button text-content" onClick={this.toggleCalendar.bind(this)}>
          {this.state.date.toDateString()}
        </button>
        <div className={this.wrapperToggledClass} onBlur={this.toggleCalendar.bind(this)}>
          <div className="memocon-navigate_before pull-left" onClick={this.arrowClickHandler.bind(this,'left')}></div>
          <div className="selected-date"></div>
          <Calendar date={this.state.date} month={this.monthsArray[0].month} year={this.monthsArray[0].year}></Calendar>
          <Calendar date={this.state.date} month={this.monthsArray[1].month} year={this.monthsArray[1].year}></Calendar>
          <Calendar date={this.state.date} month={this.monthsArray[2].month} year={this.monthsArray[2].year}></Calendar>
          <div className="memocon-navigate_next" onClick={this.arrowClickHandler.bind(this,'right')}></div>
        </div>
      </div>
    );
  }
}
