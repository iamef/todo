import { Button } from '@mui/material';
import React from 'react'

import CalendarSelection from './CalendarSelection'
import { gapiSignin, gapiSignout, handleClientLoad, getCalendarList, loadGoogleScript } from '../utils/loadgs'


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
            Sign Out
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
        super(props)
        
        this.onSigninChange = this.onSigninChange.bind(this);

        this.state = { signedIn: null }
    }

    // called when signin listener is changed
    onSigninChange(isSignedIn){
        console.log("onSigninChange", isSignedIn)
        this.setState({ signedIn: isSignedIn})
        
        if(isSignedIn){
            getCalendarList((cals) => {
                console.log(cals)
                this.setState({calendarsAvailable: cals});
            })
        }else{
            this.setState({calendarsAvailable: undefined})
        }

        console.log(this.state)
    }
    
    handleAuthClick(){
        gapiSignin()
    }

    handleSignoutClick(){
        gapiSignout()
    }

    handleShowCalClick(){
        console.log("clicked!")
        this.setState((state) => {
            return {showCalendars: !state.showCalendars}
        });

        getCalendarList((cals) => {
            // console.log(cals)
            this.setState({calendarsAvailable: cals});
        })

    }

    render(){
        loadGoogleScript(() => handleClientLoad(this.onSigninChange))
        
        var button;
        // console.log("CalInt.js", window.gapi)
        if (this.state.signedIn){
            return (
                <>
                <SignoutButton onClick={this.handleSignoutClick} />
                <CalendarSelection calendars = {this.state.calendarsAvailable}/>
                </>
            )
        }else if(this.state.signedIn === null){
            return null;
        }
        
        return (
        <>
            <LoginButton onClick={this.handleAuthClick} />
        </>)
    }
}

export default CalendarIntegration;