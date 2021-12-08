import React from 'react';
import firebase from '../firebase';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { motion } from 'framer-motion';
const Todo = ({ todo }) => {
    const deleteTodo = () => {
        const todoRef = firebase.database().ref('Todo').child(todo.id);
        todoRef.remove();
    }
    const completeTodo = () => {
        const todoRef = firebase.database().ref('Todo').child(todo.id);
        todoRef.update({
            complete: !todo.complete,
        })
    }
    return (
        <>
            <div
                className='todo'>
                <li
                    className='list'>
                    {
                        todo.complete ?
                            <CheckCircleIcon
                                className='icon'
                                onClick={completeTodo}
                                fontSize='large'
                            /> :
                            <CheckCircleOutlineIcon
                                className='icon'
                                onClick={completeTodo}
                                fontSize='large'
                            />
                    }
                    <motion.div>
                        <HighlightOffIcon
                            className='icon'
                            onClick={deleteTodo}
                            fontSize='large'
                        />
                    </motion.div>
                    <h5 className={todo.complete ? 'complete' : 'pending  '}>{todo.title}</h5>
                </li>
            </div>
        </>
    );
}
export default Todo;