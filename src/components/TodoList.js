import { motion } from 'framer-motion';
import React from 'react';
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

class TodoList extends React.Component{
    constructor(props){
        super(props);
        console.log("Todolist props", props);

        // need the todoList because 
        // this.state.todoList can be mappable
        // whereas this.state cannot be mappable
        // https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-react-js
        this.state = { todoList: false }
    }

    componentDidMount(){
        console.log("Todolist mount", this.props, this.state)
        const todoRef = firebase.database().ref('Todo');
        todoRef.on('value', (snapshot) => {
            // Snapshot returns a DataSnapshot object
            // console.log("snapshot", snapshot) 
            
            const todos = snapshot.val();
            console.log("Log todos", todos)
        
            const todoList = []
            for (let id in todos) {
                // console.log(id)
                todoList.push({ id, ...todos[id] });
            }

            if(this.props.signedIn === true){
                debugger;
                firebase.database().ref('Calendars').get().then((calendarsSnapshot) => {
                    var calendars = calendarsSnapshot.val();

                    // console.log("Log todos", todos)

                    calculateBuffer(todoList, calendars)
                    
                    this.setState(this.setState({todoList: todoList}));
                });
            }else{
                this.setState({todoList: todoList});
            }

            // console.log("todoList", todoList)
            // calculateBuffer(todoList, calendars)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        console.log("Todolist update", prevProps, this.props, prevState, this.state)

        if(prevProps.signedIn !== this.props.signedIn && this.props.signedIn === true){
            debugger;
            firebase.database().ref('Calendars').get().then((calendarsSnapshot) => {
                var calendars = calendarsSnapshot.val();

                // console.log("Log todos", todos)

                calculateBuffer(this.state.todoList, calendars)
                
                // this.setState(todoList);
            });
        }
    }
    
    render(){
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
                    <TableCell align="right">deadline</TableCell>
                    <TableCell align="right">estTime</TableCell>
                    <TableCell align="right">priority</TableCell>
                    <TableCell align="right">overshoot</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {this.state.todoList ?
                    this.state.todoList.map((todo) => 
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
                        <TableCell align="right">0</TableCell>
                        </TableRow>
                    )
                    : null
                }
                </TableBody>
            </Table>
            </TableContainer>
            </motion.div>
        );
        
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
    }
}
export default TodoList;