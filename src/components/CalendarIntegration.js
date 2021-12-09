import { Button } from '@mui/material';
import React from 'react'

import CalendarSelection from './CalendarSelection'
import { gapiSignin, gapiSignout, handleClientLoad, getCalendarList, loadGoogleScript } from '../utils/loadgs'

const CalendarIntegration = () => {
    return (
        <> 
        {/* This is necessary because JSX need parent */}
            <Button
                variant='contained'
                id='authorize_button'
                onClick={handleAuthClick}
            >
                Connect to GCAL
            </Button>

            <Button
                variant='contained'
                id='signout_button'
                onClick={handleSignoutClick}
            >
                Sign Out
            </Button>
        </>
    );
}
export default CalendarIntegration;