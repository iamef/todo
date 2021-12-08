import { Button } from '@mui/material';
import React from 'react'

import { handleAuthClick } from '../utils/loadgs'
// import { google } from 'googleapis';

const CalendarIntegration = () => {
    return (
        <Button
            onClick={handleAuthClick}
        >
            Connect to GCAL
        </Button>
    );
}
export default CalendarIntegration;