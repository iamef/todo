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


// function CalendarCheckboxes(props){
//     // props.calsIds.map((id)) => <FormControlLabel />
// }


// const CalendarIntegration = () => {
//     return (
//         <> 
//         {/* This is necessary because JSX need parent */}
//             <Button
//                 variant='contained'
//                 id='authorize_button'
//                 onClick={handleAuthClick}
//             >
//                 Connect to GCAL
//             </Button>

//             <Button
//                 variant='contained'
//                 id='signout_button'
//                 onClick={handleSignoutClick}
//             >
//                 Sign Out
//             </Button>

//             <Checkbox>
//                 label
//             </Checkbox>

//         </>
//     );
// }


export default CalendarIntegration;