import React from "react";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { TableRow, TableCell } from '@mui/material';

function TodoItem(props) {
    return (
        <TableRow
            key={props.todo.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            className={props.todo.complete ? "complete" : "pending"}
        >
            {/* complete buttons */}
            <TableCell className={props.todo.complete ? "complete" : "pending"}>
                {props.todo.complete ?
                    <CheckCircleIcon
                        className='icon'
                        onClick={() => this.completeTodo(props.todo)}
                        fontSize='large'
                    /> :
                    <CheckCircleOutlineIcon
                        className='icon'
                        onClick={() => this.completeTodo(props.todo)}
                        fontSize='large'
                    />
                }
                {/* <motion.div> */}
                <HighlightOffIcon
                    className='icon'
                    onClick={() => this.deleteTodo(props.todo)}
                    fontSize='large'
                />
                {/* </motion.div> */}
            </TableCell>

            {/* folder / list */}
            <TableCell component="th" scope="row" className={props.todo.complete ? "complete" : "pending"}>
                {props.todo.folder + "/" + props.todo.list}
            </TableCell>

            {/* complete buttons */}
            {props.headCells.map((cellJson) =>
                cellJson.firebaseKey === undefined ?
                    null :
                    <TableCell
                        align={cellJson.align}
                        className={props.todo.complete ? "complete" : "pending"}
                        onDoubleClick={() => this.editTodo(props.todo, cellJson.firebaseKey)}
                    >
                        {props.todo[cellJson.firebaseKey]}
                    </TableCell>
            )}

            {['bufferHrs', 'bufferHrs_tbd', 'bufferHrs_medium', "bufferHrs_high"].map((bufferType) =>
                <TableCell
                    align="right"
                    className={props.todo.complete ? "complete" : "pending"}
                >
                    {props.todo[bufferType] ? props.todo[bufferType] : "loading"}
                </TableCell>
            )}
        </TableRow>
    )
}

export default TodoItem;