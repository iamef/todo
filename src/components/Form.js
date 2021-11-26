import React, { useState } from 'react';
import firebase from '../firebase';
import { RadioGroup, TextField } from '@material-ui/core';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

// Added more fields usinig this!
// https://dev.to/jleewebdev/using-the-usestate-hook-and-working-with-forms-in-react-js-m6b
const Form = () => {
    const [formData, setFormData] = useState({
        title: "",
        dueDate: "",
        hardDeadline: "",
        estTime: "",
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
            hardDeadline: "",
            estTime: "",
        })
    }
    return (
        <>
            <div className='form'>
                <TextField
                    variant='standard'
                    label='Add Todo'
                    type='text'
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className='textfield'
                    size='medium'
                />
                <br/>
                
                <TextField
                    variant='standard'
                    label='Due Date'
                    type='text'
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className='textfield'
                    size='medium'
                />

                <div className="radio">
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
                </div>
                
                <TextField
                    variant='standard'
                    label='How Long Will it Take'
                    type='text'
                    value={formData.estTime}
                    onChange={(e) => setFormData({...formData, estTime: e.target.value})}
                    className='textfield'
                    size='medium'
                />
                
                <div className='add'>
                    {
                        formData.title === '' ?
                            <AddCircleOutlineOutlinedIcon
                                fontSize='large'
                                className='icon'
                            />
                            :
                            <AddCircleRoundedIcon
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