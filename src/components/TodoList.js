import React from "react";

import { fs } from "../firebase";

import { motion } from "framer-motion";

import { TableContainer, Table, TableRow, TableCell, TableBody, TableHead, Button, TableSortLabel } from "@mui/material";
import { calculateBuffer, todosDateTimeParse, compareForMultipleProperties, sortedArray } from "../utils/todosFunctions";
import { arrayUnion, collection, doc, getDoc, onSnapshot, query, setDoc } from "firebase/firestore";
import TodoItem from "./TodoItem";

class TodoList extends React.Component{
    constructor(props){
        super(props);
        console.log("Todolist props", props);
        
        this.initializeTodolist = this.initializeTodolist.bind(this);
        
        // need the todoList because 
        // this.state.todoList can be mappable
        // whereas this.state cannot be mappable
        // https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-react-js
        
        // making todoList into a variable doesn't work
        // the todolist won't update when I click complete and stuff
        this.state = { todoList: false, hardDeadlineOnlyBuffer: false };

        this.orderBy = ["complete", "priority", "dueDate", "folder", "list"];
        
        // making this into a variable does seem to work
        // and this updates in the todolist app
        // hypothesis: this works because the todoList updates when happyDay update
        // the todoList update sort of carries the happyDay update
        // so todoList still needs to be a state for this to work
        this.todoFilePath = props.userFirebasePath +  "/Todos";
        
        this.unsubscribeFirebaseTodolist = () => {};

        this.headCells = [
            {
              firebaseKey: ["folder", "list"],
              id: "todoFolderList",
              numeric: false,
              disablePadding: true,
              label: "folder/list",
              align: "left"

            },
            {
              firebaseKey: "atitle",
              id: "todoTitle",
              numeric: false,
              disablePadding: true,
              label: "title",
              align: "left"
            },
            {
              firebaseKey: "dueDate",
              id: "todoDueDate",
              numeric: false,
              disablePadding: false,
              label: "dueDate",
              align: "right"
            },
            {
              firebaseKey: "deadlineType",
              id: "todoDeadlineType",
              numeric: true,
              disablePadding: false,
              label: "dType",
              align: "right"
            },
            {
              firebaseKey: "estTime",
              id: "todoEstimatedTime",
              numeric: true,
              disablePadding: false,
              label: "eT",
              align: "right"
            },
            {
              firebaseKey: "priority",
              id: "todoPriority",
              numeric: false,
              disablePadding: false,
              label: "priority",
              align: "right"
            },
            {
              firebaseKey: "bufferHrs",
              id: "todoBuffer",
              numeric: true,
              disablePadding: false,
              label: "buffer",
              align: "right"
            },
        ];
    }

    componentDidMount(){
        console.log("Todolist mount", this.props, this.state);
        
        if(this.props.firebaseSignedIn !== null){
            this.initializeTodolist();
        }else{
            console.log("Firebase login is null");
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        console.log("Todolist update", prevProps, this.props, prevState, this.state);
        
        this.todoFilePath = this.props.userFirebasePath +  "/Todos";
        
        // currently in iniitialize function
        // if(prevProps.firebaseSignedIn !== this.props.firebaseSignedIn){
        //     this.unsubscribeFirebaseTodolist();
        // }


        if(this.props.firebaseSignedIn !== null){
            // if you just signed into or out of FIREBASE
            if(prevProps.firebaseSignedIn !== this.props.firebaseSignedIn){
                this.initializeTodolist();
            // if you just signed into GCAL
            }else if(this.props.gapiSignedIn === true){
                if(prevProps.gapiSignedIn !== this.props.gapiSignedIn || prevState.hardDeadlineOnlyBuffer !== this.state.hardDeadlineOnlyBuffer){
                    if(Array.isArray(this.state.todoList)){
                        this.getTodoListWithBuffers(this.state.todoList, (todoListWithBuffers) => {
                            this.setState({todoList: todoListWithBuffers});
                        });
                    }
                }

                // TODO Take an action if you are logged out of gapi
            }
        }else{
            if(prevProps.firebaseSignedIn){
                alert("somehow firebase signin has become null");
                
                this.unsubscribeFirebaseTodolist();
                this.setState({todoList: false});
            }
        }
    }

    initializeTodolist(){
        this.unsubscribeFirebaseTodolist();
        
        var fsTodoRef = collection(fs, this.todoFilePath);

        // var fsTodoQuery = query(fsTodoRef, orderBy("folder"), orderBy("list"));
        var fsTodoQuery = query(fsTodoRef);
        
        // console.log(fsTodoQuery);

        //runs whenever the todolist on Firebase gets updated
        this.unsubscribeFirebaseTodolist = onSnapshot(fsTodoQuery, { includeMetadataChanges: true }, (querySnapshot) => {
            var itemAdded = false;
            var updateItemModified = false;
            var itemRemoved = false;
            // check what kinds of changes were made to the firebase todolist
            
            console.log(querySnapshot.size, querySnapshot.docs.length, querySnapshot.docChanges().length);
            
            // log what kinds of changes happened
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    itemAdded = true;
                    console.log("New firebase item: ", change.doc.data());
                }
                if (change.type === "modified") {
                    if(querySnapshot.docChanges().length === 1 && Array.isArray(this.state.todoList)){
                        var found = this.state.todoList.find((todo) => todo.id === change.doc.id);
                        var changedData = change.doc.data();
                        
                        if(found === undefined || changedData === undefined){
                            debugger;
                            alert("found or changedData is undefined");
                            console.log("found or changedData is undefined", found, changedData);
                        }else{
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
                    
                }
                if (change.type === "removed") {
                    itemRemoved = true;
                    // console.log("Removed firebase item: ", change.doc.data());
                }
            });

            // avoid infinite updates due to recalculating buffer time
            if(itemAdded || itemRemoved || updateItemModified){
                var fsTodoList = []; // when a list is empty you want it update the firestore to empty
                
                querySnapshot.forEach((qdoc) => {
                    console.log(qdoc.id, " => ", qdoc.data());
                    fsTodoList.push({id: qdoc.id, ...qdoc.data()});
                });

                // recalculate buffers
                if(this.props.gapiSignedIn === true){
                    this.getTodoListWithBuffers(fsTodoList, (todoListWithBuffers) => {
                        todoListWithBuffers.sort(compareForMultipleProperties(...this.orderBy));
                        this.setState({todoList: todoListWithBuffers});
                    });
                }else{
                    // TODO reset buffer if you aren't signed in
                    for(var todo of fsTodoList){
                        todo.bufferHrs = "Log Into GCAL";
                    }
                    fsTodoList.sort(compareForMultipleProperties(...this.orderBy));
                    this.setState({todoList: fsTodoList});
                }

            }

        });

    }

    getTodoListWithBuffers(todoList, callback){
        getDoc(doc(fs, this.props.userFirebasePath)).then((docSnap) => {
            // console.log(docSnap.data().calendars)

            var calendars = docSnap.data().calendars;
            console.log(calendars);

            if(calendars === undefined){
                for(var todo of todoList){
                  todo.bufferHrs = "select calendars";
                }
                callback(todoList);
            }else{
                calculateBuffer(todoList, calendars, this.state.hardDeadlineOnlyBuffer).then((buffers) => {
                    for(var todo of todoList){
                        var bufferMS = buffers[todo.id]["bufferMS"];
                        
                        
                        if(typeof(bufferMS) === "number"){
                            todo.bufferHrs = Number(Math.round( (bufferMS/(60*60*1000)) +"e+2") + "e-2");
                        }else{
                            todo.bufferHrs = bufferMS;
                        }
                        
                        for(var priority of ["tbd", "medium", "high"]){
                            // debugger;
                            
                            bufferMS = buffers[todo.id]["bufferMS_" + priority];
                            if(typeof(bufferMS) === "number"){
                                todo["bufferHrs_" + priority] = Number(Math.round( (bufferMS/(60*60*1000)) +"e+2") + "e-2");
                            }else if(typeof(bufferMS) === "undefined"){
                                todo["bufferHrs_" + priority] = "--";
                            }else{
                                todo["bufferHrs_" + priority] = bufferMS;
                            }

                        }

                        setDoc(doc(fs, this.todoFilePath + "/" + todo.id), {...todo, bufferData: buffers[todo.id]} );

                        // todo.bufferData = buffers[todo.id]
                    }
                    
                    callback(todoList);
                });
            }

        });
    }
    
    render(){
        return (
            <motion.div>
            <h2>TodoList</h2>
            
            {/* <SortTodos></SortTodos> */}

            { this.state.hardDeadlineOnlyBuffer ?
                <Button 
                    variant="contained"
                    onClick={() => this.setState({hardDeadlineOnlyBuffer: false})}
                >
                    Calculate Buffer for All Deadlines
                </Button>
                :
                <Button 
                    variant="outlined"
                    onClick={() => this.setState({hardDeadlineOnlyBuffer: true})}
                >
                    Calculate Buffer for HARD Deadlines Only
                </Button>
            }
            
            <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" padding="none" >
                {/* // TODO add table based sorting! https://mui.com/components/tables/#sorting-amp-selecting */}
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        {this.headCells.map((cellJson) => 
                            <TableCell align={cellJson.align} key={cellJson.id}>
                                <TableSortLabel
                                    active={this.orderBy[1] === cellJson.firebaseKey}
                                    onClick={() => {
                                        this.setState({todoList: sortedArray(this.state.todoList, "complete", cellJson.firebaseKey)});
                                        this.orderBy.splice(1,0,cellJson.firebaseKey);
                                        this.orderBy = [...new Set(this.orderBy)];
                                        console.log("clicked", cellJson.label, this.orderBy);
                                    }}
                                >{cellJson.label}</TableSortLabel>
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                {this.state.todoList ?
                    this.state.todoList.map((todo) => 
                        <TodoItem todo={todo} headCells={this.headCells} todoFilePath={this.todoFilePath} key={todo.id}/>
                    )
                    :
                    null
                }
                </TableBody>
            </Table>
            </TableContainer>
            </motion.div>
        );
    }
}
export default TodoList;