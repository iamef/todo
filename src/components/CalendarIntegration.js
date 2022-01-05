import { Button } from '@mui/material';
import React from 'react'

import CalendarSelection from './CalendarSelection'
import { gapiSignin, gapiSignout, getCalendarList } from '../utils/gapiFunctions'

import { auth, firebaseSignInWithGoogle, db, firebaseSignOut } from "../firebase"

function FireSignInButton(props){
    return (
        <Button
            variant='contained'
            id='ahhhhhhhhhhh'
            onClick={props.onClick}
        >
            Firebase Sign In
        </Button>
    )
}

function FireSignOutButton(props){
    return (
        <Button
            variant='contained'
            id='ouuuutt'
            onClick={props.onClick}
        >
            Firebase Sign Out
        </Button>
    )
}


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
        // console.log("Cal Integration", props)
        
        this.handleShowCalClick = this.handleShowCalClick.bind(this);
        
        // state is internal
        this.state = { calendarsAvailable: undefined, showCalendars: false }
    }

    componentDidMount(){
        // console.log("calint mount", this.props, this.state)
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        // console.log("calint update", prevProps, this.props, prevState, this.state)
        
        /* can implement getCalendarList here, 
           but I don't want user to sign out to have list update
        if(prevProps.signedIn == false && this.props.signedIn == true){
            getCalendarList((cals) => {
                // console.log(cals)
                this.setState({calendarsAvailable: cals});
            })
        } 
        */
        
        // calendars shouldn't be available when user signs out
        if(prevProps.signedIn === true && this.props.signedIn === false){
            this.setState({calendarsAvailable: undefined})
        }
    }

    handleAuthClick(){
        gapiSignin()
    }

    handleSignoutClick(){
        gapiSignout()
    }

    happyMonster(){
        // debugger;
        firebaseSignInWithGoogle().then((result) => {
            console.log(result)
            debugger;
        })
        // var result = await signInWithPopup(auth, provider)
        // console.log(result);
    }

    sadMonster(){
        debugger;
        
        firebaseSignOut().then(() => {
            console.log("signed out")
        })
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
            return {showCalendars: !state.showCalendars}
        });
    }

    render(){
        if (this.props.signedIn){
            if (this.state.showCalendars)
                return (
                <>
                <FireSignInButton onClick={this.happyMonster} />
                <FireSignOutButton onClick={this.sadMonster} />
                <SignoutButton onClick={this.handleSignoutClick} />
                <ShowCalendarButton onClick={this.handleShowCalClick}></ShowCalendarButton>
                <CalendarSelection calendars = {this.state.calendarsAvailable}/>
                </>
                )
            else{
                return (
                <>
                <FireSignInButton onClick={this.happyMonster} />
                <FireSignOutButton onClick={this.sadMonster} />
                <SignoutButton onClick={this.handleSignoutClick} />
                <ShowCalendarButton onClick={this.handleShowCalClick}></ShowCalendarButton>
                {/* <CalendarSelection calendars = {this.state.calendarsAvailable}/> */}
                </>
                )
            }
        }else if(this.props.signedIn === null){
            return (
                <>
                <FireSignInButton onClick={this.happyMonster} />
                <FireSignOutButton onClick={this.sadMonster} />
                </>
            )
        }
        
        return (
        <>
            <FireSignInButton onClick={this.happyMonster} />
            <FireSignOutButton onClick={this.sadMonster} />
            <LoginButton onClick={this.handleAuthClick} />
        </>)
    }
}

export default CalendarIntegration;