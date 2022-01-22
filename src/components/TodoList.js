import { motion } from 'framer-motion';
import React from 'react';
import { auth, fs } from '../firebase';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { TableContainer, Table, TableRow, TableCell, TableBody, TableHead } from '@mui/material';
import { calculateBuffer } from '../utils/calculateOvershoot';
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, setDoc, updateDoc } from 'firebase/firestore';
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
        
        // TODO check if auth to loaded properly...
        if(typeof(auth) === "undefined"){
            this.todoFilePath = "users/" + null + "/Todos";
        }else{
            this.todoFilePath = "users/" + (auth.currentUser ? auth.currentUser.uid : null) + "/Todos";
        }
        this.unsubscribeFirebaseTodolist = () => {};
    }

    componentDidMount(){
        console.log("Todolist mount", this.props, this.state)
        
        if(this.props.firebaseSignedIn !== null){
            this.initializeTodolist()
        }else{
            console.log("Firebase login is null")
            // debugger;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        console.log("Todolist update", prevProps, this.props, prevState, this.state)
        
        if(this.props.firebaseSignedIn !== null){
            // if you just signed into FIREBASE
            if(prevProps.firebaseSignedIn !== this.props.firebaseSignedIn){
                this.initializeTodolist()
            // if you just signed into GCAL
            }else if(prevProps.gapiSignedIn !== this.props.gapiSignedIn && this.props.gapiSignedIn === true){
                if(Array.isArray(this.state.todoList)){
                    this.getTodoListWithBuffers(this.state.todoList, (todoListWithBuffers) => {
                        this.setState({todoList: todoListWithBuffers});
                    })
                }
            }
        }else{
            if(prevProps.firebaseSignedIn){
                this.setState({todoList: false})
                // this.initializeTodolist()
            }
        }
    }

    initializeTodolist(){
        if(this.todoFilePath.split("/")[1] === "null"){
            if((auth.currentUser ? auth.currentUser.uid : null) !== null){
                this.unsubscribeFirebaseTodolist();
            }
        }else{
            if((auth.currentUser ? auth.currentUser.uid : null) === null){
                this.unsubscribeFirebaseTodolist();
            }
        }
        
        this.todoFilePath = "users/" + (auth.currentUser ? auth.currentUser.uid : null) + "/Todos";
        
        var fsTodoRef = collection(fs, this.todoFilePath);

        // var fsTodoQuery = query(fsTodoRef, orderBy("folder"), orderBy("list"));
        var fsTodoQuery = query(fsTodoRef);
        
        // console.log(fsTodoQuery);

        this.unsubscribeFirebaseTodolist = onSnapshot(fsTodoQuery, { includeMetadataChanges: true } ,(querySnapshot) => {
            var itemAdded = false;
            var updateItemModified = false;
            var itemRemoved = false;
            // check what kinds of changes were made to the firebase todolist
            
            console.log(querySnapshot.size, querySnapshot.docs.length, querySnapshot.docChanges().length)
            
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    itemAdded = true;
                    // console.log("New firebase item: ", change.doc.data());
                }
                if (change.type === "modified") {
                    if(querySnapshot.docChanges().length === 1 && Array.isArray(this.state.todoList)){
                        var found = this.state.todoList.find((todo) => todo.id === change.doc.id)
                        var changedData = change.doc.data()
                        
                        if(found.complete === changedData.complete && 
                            found.deadlineType === changedData.deadlineType &&
                            found.dueDate === changedData.dueDate &&
                            found.estTime === changedData.estTime &&
                            found.priority === changedData.priority &&
                            found.atitle === changedData.atitle){
                                console.log("(no need to edit) Modified firebase item: ", change.doc.id, change.doc.data());
                        }else{
                            updateItemModified = true;
                        }
                    }
                }
                if (change.type === "removed") {
                    itemRemoved = true;
                    // console.log("Removed firebase item: ", change.doc.data());
                }
            });

            if(itemAdded || itemRemoved || updateItemModified){
                var fsTodoList = [] // when a list is empty you want it update the firestore to empty
                
                // console.log(querySnapshot);
                querySnapshot.forEach((qdoc) => {
                    console.log(qdoc.id, " => ", qdoc.data());
                    fsTodoList.push({id: qdoc.id, ...qdoc.data()})
                });

                // TODO implement calendar stuff later
                if(this.props.gapiSignedIn === true){
                    this.getTodoListWithBuffers(fsTodoList, (todoListWithBuffers) => {
                        todoListWithBuffers.sort(this.sortTodosFunction("complete", "folder", "list", "dueDate"))
                        this.setState({todoList: todoListWithBuffers});
                    })
                }else{
                    // TODO reset buffer if you aren't signed in
                    fsTodoList.sort(this.sortTodosFunction("complete", "folder", "list", "dueDate"))
                    this.setState({todoList: fsTodoList});
                }

                // this.setState({todoList: fsTodoList});
                // console.log("todoList", todoList)
            }

        });

    }

    getTodoListWithBuffers(todoList, callback){
        getDoc(doc(fs, "users/" + (auth.currentUser ? auth.currentUser.uid : null))).then((docSnap) => {
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

                    setDoc(doc(fs, this.todoFilePath + "/" + todo.id), {...todo, bufferData: buffers[todo.id]} )

                    // todo.bufferData = buffers[todo.id]
                }
                
                callback(todoList)
            })

        })
    }
    
    // argsTuple in the form (whatever to sort by, isAscending)
    // javascript technically doesn't have tuples...
    // returns a comparable function given the arguments
    // creds: https://stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields
    sortTodosFunction(...argsTuple){
        
        function compare(item1, item2, type, ascending=true){
            if(type === 'dueDate'){
                var ret;
    
                if(item1 === '' && item2 === ''){
                    ret = 0
                }else if(item1 === ''){
                    ret = 1  // this means item1 - item2 is positive
                }else if(item2 === ''){
                    ret = -1 // this means item1 - item2 is negative
                }
                ret = Date.parse(item1) - Date.parse(item2)
    
                return (ascending ? ret : -1*ret)
            }
    
            if (item1 === item2) return 0;
            return item1 < item2 ? -1 : 1;
        }
        
        return function(item1, item2){
            
            console.log(argsTuple)

            for(var arg of argsTuple){
                console.log(arg)
                
                var type, sortAscending;
                if(Array.isArray(arg)){
                    type = arg[0];
                    sortAscending = arg[1];
                }else{
                    type = arg;
                    sortAscending = true;
                }

                var res = compare(item1[type], item2[type], type, sortAscending);
                
                console.log(item1[type], item2[type], type, sortAscending, res)

                if(res !== 0) return res;
            }
            
            return 0;
        }
    }
    
    deleteTodo(todo){
        var todoDoc = doc(collection(fs, this.todoFilePath), todo.id)
        console.log(todoDoc.id, todoDoc)
        deleteDoc(todoDoc)
    }
    
    completeTodo(todo){
        var todoDoc = doc(collection(fs, this.todoFilePath), todo.id)
        console.log(todoDoc.id, todoDoc)
        updateDoc(todoDoc, {complete: !todo.complete})  
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
                    <TableCell>folder/list</TableCell>
                    <TableCell>atitle</TableCell>
                    <TableCell align="right">dueDate</TableCell>
                    {/* <TableCell align="right">deadline</TableCell> */}
                    <TableCell align="right">estTime</TableCell>
                    {/* <TableCell align="right">priority</TableCell> */}
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
                                    onClick={ () => this.completeTodo(todo)}
                                    fontSize='large'
                                /> :
                                <CheckCircleOutlineIcon
                                    className='icon'
                                    onClick={ () => this.completeTodo(todo) }
                                    fontSize='large'
                                />
                            }
                            {/* <motion.div> */}
                                <HighlightOffIcon
                                    className='icon'
                                    onClick={ () => this.deleteTodo(todo) }
                                    fontSize='large'
                                />
                            {/* </motion.div> */}
                        </TableCell>
                        <TableCell component="th" scope="row">
                            { todo.folder + "/" + todo.list }
                        </TableCell>
                        <TableCell component="th" scope="row">
                            {todo.atitle}
                        </TableCell>
                        <TableCell align="right">{todo.dueDate}</TableCell>
                        {/* <TableCell align="right">{todo.deadlineType}</TableCell> */}
                        <TableCell align="right">{todo.estTime}</TableCell>
                        {/* <TableCell align="right">{todo.priority}</TableCell> */}
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