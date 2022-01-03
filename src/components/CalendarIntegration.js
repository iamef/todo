import { Button } from '@mui/material';
import React from 'react'

import CalendarSelection from './CalendarSelection'
// import { gapiSignin, gapiSignout, handleClientLoad, getCalendarList, loadGoogleScript } from '../utils/gapiFunctions'


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
        super(props) // props are external and are passed into the class
        console.log("Cal Integration", props)
        
        this.onSigninChange = this.onSigninChange.bind(this);
        this.handleShowCalClick = this.handleShowCalClick.bind(this);
        
        // state is internal
        this.state = { signedIn: props.signedIn, calendarsAvailable: undefined, showCalendars: false }
    }

    componentDidMount(){
        console.log("calint mount", this.state)
    }

    componentDidUpdate(){
        console.log("calint update", this.props, this.state)
    }

    // called when signin listener is changed
    onSigninChange(isSignedIn){
        // console.log("onSigninChange", isSignedIn)
        this.setState({ signedIn: isSignedIn})
        
        if(isSignedIn){
            // getCalendarList((cals) => {
            //     // console.log(cals)
            //     this.setState({calendarsAvailable: cals});
            // })
        }else{
            this.setState({calendarsAvailable: undefined})
        }

        // console.log(this.state)
    }
    
    handleAuthClick(){
        // gapiSignin()
    }

    handleSignoutClick(){
        // gapiSignout()
    }

    handleShowCalClick(){
        console.log("clicked!")
        this.setState((state) => {
            return {showCalendars: !state.showCalendars}
        });

        // getCalendarList((cals) => {
        //     // console.log(cals)
        //     this.setState({calendarsAvailable: cals});
        // })

    }

    render(){
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