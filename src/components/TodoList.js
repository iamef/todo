import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import firebase from '../firebase'

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { TableContainer, Table, TableRow, TableCell, TableBody, TableHead } from '@mui/material';
import { calculateBuffer } from '../utils/calculateOvershoot';


function deleteTodo(todo){
    const todoRef = firebase.database().ref('Todo').child(todo.id);
    todoRef.remove();
}
function completeTodo(todo){
    const todoRef = firebase.database().ref('Todo').child(todo.id);
    todoRef.update({
        complete: !todo.complete,
    })
}

function TodoList(props){
    console.log(props)
    
    const [todoList, setTodoList] = useState();
    useEffect(() => {
        
        firebase.database().ref('Todo').get().then((sometodos) =>
            console.log("some todo", sometodos.val())
        );
        
        const todoRef = firebase.database().ref('Todo');
        todoRef.on('value', (snapshot) => {
            // console.log(snapshot)
            
            const todos = snapshot.val();
            // console.log("Log todos", todos)
            // console.log("parsed todos", JSON.parse(todos))
            
            firebase.database().ref('Calendars').get().then((calendarsSnapshot) => {
                var calendars = calendarsSnapshot.val();

                // console.log("Log todos", todos)
                

                const todoList = []
                for (let id in todos) {
                    // console.log(id)
                    todoList.push({ id, ...todos[id] });
                }
                // console.log("todoList", todoList)
                calculateBuffer(todoList, calendars)
                setTodoList(todoList);
            });

        });
    }, [])
    
    return (
        <motion.div>
        <h2>TodoList</h2>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Todo Item</TableCell>
                <TableCell align="right">dueDate</TableCell>
                <TableCell align="right">hardDeadline</TableCell>
                <TableCell align="right">estTime</TableCell>
                <TableCell align="right">priority</TableCell>
                <TableCell align="right">overshoot</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todoList ?
                todoList.map((todo) => 
                    <TableRow
                    key={todo.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell>
                        {todo.complete ?
                            <CheckCircleIcon
                                className='icon'
                                onClick={ () => completeTodo(todo)}
                                fontSize='large'
                            /> :
                            <CheckCircleOutlineIcon
                                className='icon'
                                onClick={ () => completeTodo(todo) }
                                fontSize='large'
                            />
                         }
                         {/* <motion.div> */}
                            <HighlightOffIcon
                                className='icon'
                                onClick={ () => deleteTodo(todo) }
                                fontSize='large'
                            />
                        {/* </motion.div> */}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {todo.title}
                    </TableCell>
                    <TableCell align="right">{todo.dueDate}</TableCell>
                    <TableCell align="right">{todo.deadlineType}</TableCell>
                    <TableCell align="right">{todo.estTime}</TableCell>
                    <TableCell align="right">{todo.priority}</TableCell>
                    </TableRow>
                )
                : ''}
            </TableBody>
          </Table>
        </TableContainer>
        </motion.div>
        
        // <>
        //     <h2>TodoList</h2>
        //     <motion.div
        //         layout
        //     >
        //         {todoList ?
        //             todoList.map((todo, index) =>
        //                 <Todo todo={todo} key={index} />
        //             )
        //             : ''}
        //     </motion.div>
        // </>
    );
}
export default TodoList;