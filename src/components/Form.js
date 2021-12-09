import React, { useState } from 'react';

import firebase from '../firebase';

import { RadioGroup, TextField, FormControlLabel, FormLabel, Radio, FormGroup } from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { AddCircleRoundedIcon, AddCircleOutlineOutlinedIcon } from '@mui/icons-material'
// import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';


// Added more fields usinig this!
// https://dev.to/jleewebdev/using-the-usestate-hook-and-working-with-forms-in-react-js-m6b
const Form = () => {
    const [formData, setFormData] = useState({
        title: "",
        dueDate: new Date(),
        hardDeadline: true,
        estTime: "",
        priority: "high"
    });
    
    const createTodo = () => {
        const todoRef = firebase.database().ref('Todo');
        const todo = {
            ...formData,
            complete: false,
        };
        todoRef.push(todo);
        setFormData({
            title: "",
            dueDate: "",
            hardDeadline: true,
            estTime: "",
            priority: "high"
        })
    }
    return (
        <>
            <div className='form'>
                <TextField
                    required
                    variant='standard'
                    label='Add Todo'
                    type='text'
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className='textfield'
                    size='medium'
                />
                <br/>
                <br/>
                
                <FormGroup row>
                    {/* attempts to change color https://github.com/mui-org/material-ui-pickers/issues/393 */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        renderInput={(props) => <TextField {...props} />}
                        value={formData.dueDate}
                        label="Due Date"
                        onChange={(e) => {
                            console.log(e);
                            setFormData({...formData, dueDate: e});
                        }}
                        className='textfield'
                        size='medium'
                    />
                    </LocalizationProvider>

                    {/* <TextField
                        variant='standard'
                        label='Due Date'
                        type='datetime-local'
                        value={formData.dueDate}
                        defaultValue={new Date()}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        className='textfield'
                        size='medium'
                    /> */}

                    <RadioGroup row>
                        <FormControlLabel 
                            checked={formData.hardDeadline}
                            control={<Radio />} 
                            onChange={(e) => setFormData({...formData, hardDeadline: e.target.checked})}
                            label="Hard Deadline" />
                        <FormControlLabel 
                            checked={!formData.hardDeadline}
                            control={<Radio />} 
                            onChange={(e) => setFormData({...formData, hardDeadline: !e.target.checked})}
                            label="Soft Deadline" />
                    </RadioGroup>
                </FormGroup>
                
                {/* <div className="radio">
                    <label>
                        <input type="radio" value="option1" checked={true} />
                        Hard Deadline
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input type="radio" value="option2" />
                        Soft Deadline
                    </label>
                </div> */}
                
                <TextField
                    variant='standard'
                    label='Estimated Hours'
                    helperText="How Long Will the Task Take You?"
                    type='number'
                    value={formData.estTime}
                    onChange={(e) => setFormData({...formData, estTime: e.target.value})}
                    className='textfield'
                    size='medium'
                />
                
                
                <br/>
                <br/>
                
                <FormLabel component="legend">Priority</FormLabel>  
                <RadioGroup row>

                    <FormControlLabel 
                        checked={formData.priority === 'tbd'}
                        control={<Radio />} 
                        onChange={(e) => setFormData({...formData, priority: 'tbd'})}
                        label="To Be Determined" />
                    <FormControlLabel 
                        checked={formData.priority === 'vlow'}
                        control={<Radio />} 
                        onChange={(e) => setFormData({...formData, priority: 'vlow'})}
                        label="Very Low" />
                    <FormControlLabel 
                        checked={formData.priority === 'low'}
                        control={<Radio />} 
                        onChange={(e) => setFormData({...formData, priority: 'low'})}
                        label="Low" />
                    <FormControlLabel 
                        checked={formData.priority === 'medium'}
                        control={<Radio />} 
                        onChange={(e) => setFormData({...formData, priority: 'medium'})}
                        label="Medium" />
                    <FormControlLabel 
                        checked={formData.priority === 'high'}
                        control={<Radio />} 
                        onChange={(e) => setFormData({...formData, priority: 'high'})}
                        label="High" />
                    <FormControlLabel 
                        checked={formData.priority === 'vHIGH'}
                        control={<Radio />} 
                        onChange={(e) => setFormData({...formData, priority: 'vHIGH'})}
                        label="Very high" />
                </RadioGroup>

                <TextField
                    disabled
                    variant='standard'
                    label='priority'
                    type='text'
                    value={formData.priority}
                    // onChange={(e) => setFormData({...formData, estTime: e.target.value})}
                    className='textfield'
                    size='medium'
                />
                
                <div className='add'>
                    {
                        formData.title === '' ?
                            <AddCircleOutlineIcon
                                fontSize='large'
                                className='icon'
                            />
                            :
                            <AddCircleIcon
                                onClick={createTodo}
                                fontSize='large'
                                className='icon'
                            />
                    }
                </div>
            </div>
        </>
    );
}
export default Form;