import React from 'react'

import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

import { get, ref, set } from 'firebase/database';
import { db } from '../firebase';

class CalendarSelection extends React.Component{
  constructor(props){
    console.log("CalSelection", props)
    super(props)

    this.state = {}

    // var formDataInitialJSON = this.props.calendars.map((calendar) => {
    //     return "\"" + calendar.id + "\"" + ": false"
    // }).toString()
    // formDataInitialJSON = JSON.parse("{" + formDataInitialJSON + "}")
    // this.setState(formDataInitialJSON);

    // this.state = [];


    
    // this.componentDidUpdate = this.componentDidUpdate.bind(this)
  }

  componentDidMount(){
    console.log("cal selection mount");

    get(ref(db, 'Calendars')).then((value) => {
      // console.log(value.val())
      var formDataInitialJSON = value.val().map((calID) => {
        return "\"" + calID + "\"" + ": true"
      }).toString();
      formDataInitialJSON = JSON.parse("{" + formDataInitialJSON + "}")
      
      // console.log(formDataInitialJSON)

      this.setState(formDataInitialJSON);

    }, (reason) => console.log(reason))
    // this.setState(['aaf', 'asdfasd', 'asdf'])
    // firebase.database().ref("Calendars").get().then((value) => {
    //   console.log(value.val())
    //   this.setState(value.val())
    // }, (reason) => console.log(reason))

  }

  // static getDerivedStateFromProps(props, state){
  //   console.log(props, this.props, state)
  //   if(props === this.props) return;

  //   // var formDataInitialJSON = ""
    
  //   if(!(this.props.calendars === undefined)){
  //     console.log("this cal is not undefined")
  //     var formDataInitialJSON = this.props.calendars.map((calendar) => {
  //         return "\"" + calendar.id + "\"" + ": false"
  //     }).toString()
  //     formDataInitialJSON = JSON.parse("{" + formDataInitialJSON + "}")
  //     this.setState(formDataInitialJSON);
  //     console.log(formDataInitialJSON)
  //   }
  // }

  // updatedJSON(){
    
  // }

  handleCheckChange(event, calendarId){
    console.log(event, {...this.state})
    this.setState(JSON.parse("{\"" + calendarId + "\"" + ": " + event.target.checked + "}"))
  }

  getChecked(calendarId){
    // console.log(this.state)
    // return false;
    // return this.state.includes(calendarId);
    if(this.state[calendarId] === undefined){
    //   // firebase.database().ref("Calendars").get().then((value) => console.log(value), (reason) => console.log(reason))
      return false;
    }
    return this.state[calendarId];
  }

  submitCheckedCalendars(){
    var calsToInclude = []
    console.log(this.state)
    for(var key in this.state){
      if(this.state[key]) calsToInclude.push(key)
    }
    console.log(calsToInclude)
    set(ref(db, "Calendars"), calsToInclude)
    // firebase.database().ref("Calendars").set(calsToInclude);
    this.setState({});
  }

  render() {
    if(this.props.calendars === undefined) return null;

    return (
      <>
      <FormGroup>
          { this.props.calendars.map((calendar) => 
              <FormControlLabel 
                  checked={ this.getChecked(calendar.id) }
                  control={<Checkbox/>}
                  label= {calendar.summary}
                  key= {calendar.id}
                  onChange={ (e) => this.handleCheckChange(e, calendar.id) }
              /> 
          ) }
      </FormGroup>
      <Button
        onClick={() => this.submitCheckedCalendars() }
      >
        Submit
      </Button>
      </>
  )}
}

export default CalendarSelection;