import { Button } from '@mui/material';
import React from 'react';

import CalendarSelection from './CalendarSelection';
import { gapiSignin, gapiSignout, getCalendarList } from '../utils/gapiFunctions';

function LoginButton(props){
    return (
        <Button
            variant='contained'
            id='authorize_button'
            onClick={props.onClick}
        >
            Connect to GCAL
        </Button>
    )
}

function SignoutButton(props){
    return (    
        <Button
            variant='contained'
            id='signout_button'
            onClick={props.onClick}
        >
            Disconnect Google Calendar
        </Button>
    )

}

function ShowCalendarButton(props){
    return (
        <Button
            onClick={props.onClick}
        >
            Show / Hide Calendar Checkboxes
        </Button>
    )
}

class CalendarIntegration extends React.Component{
    constructor(props){
        super(props) // props are external and are passed into the class
        // console.log("Cal Integration", props)
        
        this.handleShowCalClick = this.handleShowCalClick.bind(this);
        
        // state is internal
        this.state = { calendarsAvailable: undefined, showCalendars: false };
    }

    componentDidMount(){
        // console.log("calint mount", this.props, this.state)
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        // console.log("calint update", prevProps, this.props, prevState, this.state)
        
        /* can implement getCalendarList here, 
           but I don't want user to sign out to have list update
        if(prevProps.gapiSignedIn == false && this.props.gapiSignedIn == true){
            getCalendarList((cals) => {
                // console.log(cals)
                this.setState({calendarsAvailable: cals});
            })
        } 
        */
        
        // calendars shouldn't be available when user signs out
        if(prevProps.gapiSignedIn === true && this.props.gapiSignedIn === false){
            this.setState({calendarsAvailable: undefined});
        }
    }

    handleAuthClick(){
        gapiSignin()
    }

    handleSignoutClick(){
        gapiSignout()
    }

    // the show cal checkboxes button
    // should only show when signed in
    handleShowCalClick(){
        var show = !this.state.showCalendars;
        if(show){
            getCalendarList((cals) => {
                this.setState({calendarsAvailable: cals});
            })
        }
        
        console.log("clicked!")
        this.setState((state) => {
            return {showCalendars: !state.showCalendars};
        });
    }

    render(){
        if (this.props.gapiSignedIn){
            if (this.state.showCalendars)
                return (
                <>
                <SignoutButton onClick={this.handleSignoutClick} />
                <ShowCalendarButton onClick={this.handleShowCalClick}></ShowCalendarButton>
                <CalendarSelection 
                    calendars = {this.state.calendarsAvailable}
                    userFirebasePath = {this.props.userFirebasePath}
                />
                </>
                )
            else{
                return (
                <>
                <SignoutButton onClick={this.handleSignoutClick} />
                <ShowCalendarButton onClick={this.handleShowCalClick}></ShowCalendarButton>
                {/* <CalendarSelection calendars = {this.state.calendarsAvailable}/> */}
                </>
                )
            }
        }else if(this.props.gapiSignedIn === null){
            return null;
        }
        
        return <LoginButton onClick={this.handleAuthClick} />
    }
}

export default CalendarIntegration;