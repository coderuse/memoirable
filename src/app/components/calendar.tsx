/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, IndexLink, Link } from 'react-router';
import { ProviderTypes } from '../actions/types';
import * as AuthActions from '../actions/authActions';
import GAuthStore from '../stores/gAuthStore';
import { Utils } from '../helpers';

export interface ICalendarDate {date: any, month: number, year: number};

export default class Calendar extends React.Component<ICalendarDate, {}> {
  _listenerToken: FBEmitter.EventSubscription;
  toggledClass: string = 'hide-header-menu';
  rowArray =  ['row1','row2','row3','row4','row5','row6'];
  selectedDate: any;
  count : number = 0;
  monthArray: any = {
      row1: [],
      row2: [],
      row3: [],
      row4: [],
      row5: [],
      row6: []
    };
  constructor(props) {
    super();
    this.selectedDate = GAuthStore._getSelectedDate();
  }

  /**
   * @description
   *
   * populate the month array using the month and year as input
   * 
   * @returns 
   */
  componentWillMount() {
    this.populateValuesByMonth(this.props.month, this.props.year, this.monthArray);
  }

  /**
   * @description
   *
   * checks whether the calendar component should update on not based on the selected date
   * also based on the month and the year
   * 
   * @returns 
   */
  shouldComponentUpdate(nextProps: any, nextState: any) {
    if(this.props.month !== nextProps.month || this.props.year !== nextProps.year ){
      this.resetMonthArray(this.monthArray);
      this.populateValuesByMonth(nextProps.month, nextProps.year, this.monthArray);
      return true;
    }
    else if(!Utils.compareDate(this.props.date, nextProps.date)){
      return true;
    } 
    else {
      return false;
    }
  }

  /**
   * @description
   *
   * reset month array to initial values
   * 
   * @returns 
   */
  resetMonthArray(month){
    for(var i=1;i<=6;i++){
      month['row'+i] = [];
    }
  }

  /**
   * @description
   *
   * Creates the month array for the given month and year
   * 
   * @param monthNum : given month number (0-11)
   * @param year : refers to the year value
   * @param monthArray : refers to the month Array
   * @returns 
   */
  populateValuesByMonth(monthNum, year, monthArray){
    let firstDate = new Date(year, monthNum);
    let firstDay = firstDate.getDay();
    let count = 0;
    
    let rowArray =  ['row1','row2','row3','row4','row5','row6'];
    for(var i=0; i < rowArray.length; i++){
      for(var j=0; j < 7 ; j++){
        if(i==0 && j<firstDay){
          monthArray[rowArray[i]].push('');
        }
        else{
          count = count+1;
          if(count> Utils.daysInMonth(monthNum, year)){
            monthArray[rowArray[i]].push('');
          }
          else{
            monthArray[rowArray[i]].push(count);
          }
          
        }
        
      }
    }
  }

  /**
   * @description
   *
   * Toggles the class and sets state
   * 
   * @returns 
   */
  toggleClass(){
    this.toggledClass =  this.toggledClass === 'hide-header-menu' ? 'show-header-menu' : 'hide-header-menu' ;
    this.setState({'name':'button-state-changed'});
  }

  /**
   * @description
   *
   * Click handler for the selected date
   * 
   * @param date: the clicked date
   * @returns 
   */
  handleClick(date){
    AuthActions.calendarDateChanged({ provider: ProviderTypes.GOOGLE, date: date});
  }

  render() {
    var monthArray = this.monthArray;
    return (
      <div className="calendar-wrapper pull-left">
        <div className="calendar-value">{ Utils.getMonth(this.props.month)+' '+this.props.year}</div>
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
              { monthArray ? monthArray[rowNum].map(function(val,index){
                let date = new Date(this.props.year, this.props.month, val);
                if(val === ''){
                  return <div key={'empty'+index} ></div>
                }
                else{
                  return <div className={Utils.compareDate(date ,this.props.date) ? 'selected-date'  : '' } key={'value'+index} onClick={() => {this.handleClick(date)}}>{val}</div>
                }
              }.bind(this)) : <div></div>}
            </div>
          }.bind(this))
        }
      </div>
    );
  }
}
