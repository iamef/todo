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
export default CalendarIntegration;