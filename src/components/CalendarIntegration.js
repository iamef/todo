import { Button } from '@mui/material';
import React from 'react'

import CalendarSelection from './CalendarSelection'
import { gapiSignin, gapiSignout, handleClientLoad, getCalendarList, loadGoogleScript } from '../utils/gapiFunctions'


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
        this.handleShowCalClick = this.handleShowCalClick.bind(this);
        
        this.state = { signedIn: null, calendarsAvailable: undefined, showCalendars: false }
    }

    componentDidMount(){
        // console.log(this.state)
        // console.log("mount")
        
        handleClientLoad(this.onSigninChange)
        // const auth = new google.auth.GoogleAuth({
        // // Scopes can be specified either as an array or as a single, space-delimited string.
        // scopes: ["https://www.googleapis.com/auth/calendar.readonly"]
        // });
        // const authClient = auth.getClient();

        // console.log("mount", authClient)
    }

    // called when signin listener is changed
    onSigninChange(isSignedIn){
        // console.log("onSigninChange", isSignedIn)
        this.setState({ signedIn: isSignedIn})
        
        if(isSignedIn){
            getCalendarList((cals) => {
                // console.log(cals)
                this.setState({calendarsAvailable: cals});
            })
        }else{
            this.setState({calendarsAvailable: undefined})
        }

        // console.log(this.state)
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
        
        // console.log("CalInt.js", window.gapi)
        if (this.state.signedIn){
            if (this.state.showCalendars)
                return (
                <>
                <SignoutButton onClick={this.handleSignoutClick} />
                <ShowCalendarButton onClick={this.handleShowCalClick}></ShowCalendarButton>
                <CalendarSelection calendars = {this.state.calendarsAvailable}/>
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