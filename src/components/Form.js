import React, { useState } from 'react';

import db from '../firebase';
import { push, ref } from 'firebase/database';

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
        // dueDate: new Date(),
        dueDate: "",
        deadlineType: "noDeadline",
        estTime: "",
        priority: "tbd"
    });
    
    const createTodo = () => {
        const todoRef = ref(db, "Todo");
        const todo = {
            ...formData,
            complete: false,
        };

        todo.dueDate = todo.dueDate.toLocaleString()

        console.log(todo);
        push(todoRef, todo);
        setFormData({
            title: "",
            dueDate: "",
            // dueDate: new Date(),
            deadlineType: "noDeadline",
            estTime: "",
            priority: "tbd"
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
                        // required={formData.deadlineType !== "noDeadline"}
                        value={formData.dueDate}
                        label="Due Date"
                        onChange={(e) => {
                            console.log(e);
                            if(formData.deadlineType === "noDeadline")
                                setFormData({...formData, dueDate: e, deadlineType: "hard"});
                            else
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
                            checked={formData.deadlineType === "hard"}
                            control={<Radio />} 
                            onChange={(e) => setFormData({...formData, deadlineType: "hard"})}
                            label="Hard Deadline" />
                        <FormControlLabel 
                            checked={formData.deadlineType === "soft"}
                            control={<Radio />} 
                            onChange={(e) => setFormData({...formData, deadlineType: "soft"})}
                            label="Soft Deadline" />
                        <FormControlLabel 
                            checked={formData.deadlineType === "noDeadline"}
                            control={<Radio />} 
                            onChange={(e) => setFormData({...formData, deadlineType: "noDeadline", dueDate: ""})}
                            label="No Deadline" />
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