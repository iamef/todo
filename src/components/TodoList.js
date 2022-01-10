import { motion } from 'framer-motion';
import React from 'react';
import { auth, db, fs } from '../firebase';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { TableContainer, Table, TableRow, TableCell, TableBody, TableHead } from '@mui/material';
import { calculateBuffer } from '../utils/calculateOvershoot';
import { get, onValue, query, ref, remove, update } from 'firebase/database';
import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

function deleteTodo(todo){
    debugger;
    const todoFilePath = "users/" + auth.currentUser.uid + "/Todos/no folder/not labeled";
    var todoDoc = doc(collection(fs, todoFilePath), todo.id)
    console.log(todoDoc.id, todoDoc)
    deleteDoc(todoDoc)
    // const todoRef = ref(db, "Todo/" + todo.id);
    // remove(todoRef);
}

function completeTodo(todo){
    // const todoRef = firebase.database().ref('Todo').child(todo.id);
    const todoRef = ref(db, "Todo/" + todo.id);
    update(todoRef, {
        complete: !todo.complete,
    })
}

class TodoList extends React.Component{
    constructor(props){
        super(props);
        console.log("Todolist props", props);

        this.initializeTodolist = this.initializeTodolist.bind(this)
        // need the todoList because 
        // this.state.todoList can be mappable
        // whereas this.state cannot be mappable
        // https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-react-js
        this.state = { todoList: false }
    }

    componentDidMount(){
        console.log("Todolist mount", this.props, this.state)
        
        if(this.props.firebaseSignedIn){
            this.initializeTodolist()
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        console.log("Todolist update", prevProps, this.props, prevState, this.state)
        if(this.props.firebaseSignedIn){
            // if you just signed into FIREBASE
            if(prevProps.firebaseSignedIn !== this.props.firebaseSignedIn){
                this.initializeTodolist()
            // if you just signed into GCAL
            }else if(prevProps.gapiSignedIn !== this.props.gapiSignedIn && this.props.gapiSignedIn === true){
                this.getTodoListWithBuffers(this.state.todoList, (todoListWithBuffers) => {
                    this.setState({todoList: todoListWithBuffers});
                })
            }
        }else{
            if(prevProps.firebaseSignedIn){
                this.setState({todoList: false})
            }
        }
    }

    initializeTodolist(){
        const todoFilePath = "users/" + auth.currentUser.uid + "/Todos/no folder/not labeled";
        var fsTodoRef = collection(fs, todoFilePath);

        var fsTodoQuery = query(fsTodoRef);
        
        // console.log(fsTodoQuery);

        
        onSnapshot(fsTodoQuery, (querySnapshot) => {
            var itemAdded = false;
            var itemModified = false;
            var itemRemoved = false;
            // check what kinds of changes were made to the firebase todolist
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    itemAdded = true;
                    console.log("New firebase item: ", change.doc.data());
                }
                if (change.type === "modified") {
                    itemModified = true;
                    console.log("Modified firebase item: ", change.doc.data());
                }
                if (change.type === "removed") {
                    itemRemoved = true;
                    console.log("Removed firebase item: ", change.doc.data());
                }
                // debugger;
            });

            var fsTodoList = [] // when a list is empty you want it update the firestore to empty
            
            // debugger;
            // console.log(querySnapshot);
            querySnapshot.forEach((qdoc) => {
                console.log(qdoc.id, " => ", qdoc.data());
                fsTodoList.push({id: qdoc.id, ...qdoc.data()})
            });

            // TODO implement calendar stuff later
            if(this.props.gapiSignedIn === true){
                this.getTodoListWithBuffers(fsTodoList, (todoListWithBuffers) => {
                    this.setState({todoList: todoListWithBuffers});
                })
            }else{
                this.setState({todoList: fsTodoList});
            }

            // this.setState({todoList: fsTodoList});
            // console.log("todoList", todoList)

        });

        // const todoRef = ref(db, "Todo");
        // onValue(todoRef, (snapshot) => {
        //     // Snapshot returns a DataSnapshot object
        //     // console.log("snapshot", snapshot) 
            
        //     const todos = snapshot.val();
        //     console.log("Log todos", todos)
        
        //     const todoList = []
        //     for (let id in todos) {
        //         // console.log(id)
        //         todoList.push({ id, ...todos[id] });
        //     }

        //     if(this.props.gapiSignedIn === true){
        //         this.getTodoListWithBuffers(todoList, (todoListWithBuffers) => {
        //             this.setState({todoList: todoListWithBuffers});
        //         })
        //     }else{
        //         this.setState({todoList: todoList});
        //     }

        //     // console.log("todoList", todoList)
        // });
    }

    getTodoListWithBuffers(todoList, callback){
        const todoFilePath = "users/" + auth.currentUser.uid + "/Todos/no folder/not labeled";
        
        getDoc(doc(fs, "users/" + auth.currentUser.uid)).then((docSnap) => {
            // debugger;
            // console.log(docSnap.data().calendars)

            var calendars = docSnap.data().calendars

            calculateBuffer(todoList, calendars).then((buffers) => {
                for(var todo of todoList){
                    var bufferMS = buffers[todo.id]["bufferMS"]
                    
                    if(typeof(bufferMS) === 'number'){
                        todo.bufferHrs = Number(Math.round( (bufferMS/(60*60*1000)) +"e+2") + "e-2")
                    }else{
                        todo.bufferHrs = bufferMS
                    }

                    debugger;
                    setDoc(doc(fs, todoFilePath + "/" + todo.id), todo)
                    setDoc(doc(fs, todoFilePath + "/" + todo.id + "/bufferdata/bufferdata"), buffers[todo.id])

                    // todo.bufferData = buffers[todo.id]
                }
                
                callback(todoList)
            })

        })
        
        // get(ref(db, 'Calendars')).then((calendarsSnapshot) => {
        //     var calendars = calendarsSnapshot.val();
        //     // console.log("Log todos", todos)

        //     calculateBuffer(todoList, calendars).then((buffers) => {
        //         for(var todo of todoList){
        //             var bufferMS = buffers[todo.id]["bufferMS"]
                    
        //             if(typeof(bufferMS) === 'number'){
        //                 todo.bufferHrs = Number(Math.round( (bufferMS/(60*60*1000)) +"e+2") + "e-2")
        //             }else{
        //                 todo.bufferHrs = bufferMS
        //             }

        //             todo.bufferData = buffers[todo.id]
        //         }
                
        //         callback(todoList)
        //     })
        // });
    }
    
    render(){
        return (
            <motion.div>
            <h2>TodoList</h2>
            
            {/* <SortTodos></SortTodos> */}
            
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
                    <TableCell align="right">buffer</TableCell>
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
                        <TableCell align="right">{todo.bufferHrs ? todo.bufferHrs : "loading"}</TableCell>
                        </TableRow>
                    )
                    : null
                }
                </TableBody>
            </Table>
            </TableContainer>
            </motion.div>
        );
    }
}
export default TodoList;