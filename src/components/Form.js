import React, { useState } from 'react';

import { auth, fs } from '../firebase';

import { RadioGroup, TextField, FormControlLabel, FormLabel, Radio, FormGroup } from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { AddCircleRoundedIcon, AddCircleOutlineOutlinedIcon } from '@mui/icons-material'
// import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { addDoc, collection } from 'firebase/firestore';

// import * as chrono from 'chrono-node';

// Added more fields usinig this!
// https://dev.to/jleewebdev/using-the-usestate-hook-and-working-with-forms-in-react-js-m6b
const Form = () => {
    const [formData, setFormData] = useState({
        atitle: "",
        // dueDate: new Date(),
        dueDate: null,
        deadlineType: "noDeadline",
        estTime: "",
        priority: "tbd",
        folder: "",
        list: ""
    });

    const [quickAdd, setQuickAdd] = useState({text: "", formModified: false})
    
    const createTodo = () => {
        const todo = {
            ...formData,
            complete: false,
        };
        
        
        if(todo.dueDate !== null){ // || todo.dueDate !== "" || (todo.dueDate instanceof Date && isNaN(todo.dueDate))){
            // todo.dueDate = todo.dueDate.toLocaleString()
            var datObjDueDate = todo.dueDate
            todo.dueDate = datObjDueDate.toLocaleDateString().split("/", 2).join("/") + " ";
            todo.dueDate += datObjDueDate.toLocaleTimeString().split(" ")[0].split(":", 2).join(":")
            todo.dueDate += datObjDueDate.toLocaleTimeString().split(" ")[1]
        }
        
        var todoFilePath = "users/" + (auth.currentUser ? auth.currentUser.uid : null) + "/Todos";
        // todoFilePath +=  formData.folder + "/" + formData.list;

        addDoc(collection(fs, todoFilePath), todo);

        setFormData({
            atitle: "",
            dueDate: todo.dueDate,
            // dueDate: new Date(),
            deadlineType: "noDeadline",
            estTime: "",
            priority: "tbd",
            folder: "",
            list: ""
        })

        setQuickAdd({text: "", formModified: false})
    }

    function parseQuickAdd(e){
        var currQAStr = e.target.value
        
        setQuickAdd({...quickAdd, text: currQAStr})

        // var apple = chrono.parse(currQAStr)
        // console.log(apple)

        // TODO split into many diff functions
        // FIND DATE
        var dateParseData = parseDate(currQAStr)

        // FIND TIME
        var timeParseData = parseTime(currQAStr)

        // rest of string is title
        var title = currQAStr;
        
        console.log(dateParseData, timeParseData)

        if(dateParseData !== false){
            var dueDate;
            if(timeParseData !== false){
                dueDate = new Date(dateParseData.year, dateParseData.month, dateParseData.day, 
                                        timeParseData.hours, timeParseData.minutes)
                
                title = currQAStr.substring(0, Math.min(dateParseData.startIndex, timeParseData.startIndex)) + 
                        currQAStr.substring(Math.min(dateParseData.endIndex, timeParseData.endIndex), Math.max(dateParseData.startIndex, timeParseData.startIndex)) + 
                        currQAStr.substring(Math.max(dateParseData.endIndex, timeParseData.endIndex))

            }else{
                dueDate = new Date(dateParseData.year, dateParseData.month, dateParseData.day)
                setFormData({...formData, dueDate: dueDate})
                console.log("set form data", dueDate)

                title = currQAStr.substring(0, dateParseData.startIndex) + 
                        currQAStr.substring(dateParseData.endIndex)
            }
            setFormData({...formData, dueDate: dueDate, atitle: title})
            console.log("set form data", dueDate, title)
        }else{
            if(timeParseData !== false){
                
                var dateNow = new Date()
                
                if(dateNow.getHours() > timeParseData.hours){
                    dateNow.setDate(dateNow.getDate() + 1)
                }else if(dateNow.getHours() === timeParseData.hours){
                    if(dateNow.getMinutes() > timeParseData.minutes){
                        dateNow.setDate(dateNow.getDate() + 1)
                    }
                }
                
                console.log(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())

                dueDate = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), 
                                        timeParseData.hours, timeParseData.minutes)
                
                title = currQAStr.substring(0, timeParseData.startIndex) + 
                    currQAStr.substring(timeParseData.endIndex)

                setFormData({...formData, dueDate: dueDate, atitle: title})
            }else{
                dueDate = new Date(dateParseData.year, dateParseData.month, dateParseData.day)
                setFormData({...formData, dueDate: dueDate})
                console.log("set form data", dueDate)
                setFormData({...formData, atitle: title, dueDate: null})
            }
            
            console.log("set form data", dueDate, title)
        }

        
        // common terms
        
        // find item name
    }

    /** returns JSON in format
    // {
    //     "month": month number 0 index, 
    //     "day": day, 
    //     "year": year, 
    //     startIndex: 
    //     endIndex: 
    //     matchStr
    // }
     */
    function parseDate(str){
        var dateFound = false;
        
        var dateNow = new Date();
        var day = null;
        var month = null;
        var year = null;

        // today, tod
        var todayRegExp = /tod(ay){0,1}\s/i
        var res = todayRegExp.exec(str)  // var res = todayRegExp.exec("todtodaytodayTODAY ")
        if(res !== null){
            console.log(res)
            dateFound = true

            day = dateNow.getDate()
            month = dateNow.getMonth()
            year = dateNow.getFullYear()
            console.log(month, day, year, res[0], res.index)
            return {"month": month, "day": day, "year": year, startIndex: res.index, endIndex: res.index + res[0].length, matchStr: res[0]}
        }
        
        // tomorrow, tmr
        if(!dateFound){
            var tomorrowRegExp = /tom(morrow){0,1}\s/i
            res = tomorrowRegExp.exec(str)  // var res = todayRegExp.exec("todtodaytodayTODAY ")
            console.log(res)
            if(res !== null){
                dateFound = true

                var dateTomorrow = new Date()
                dateTomorrow.setDate(dateNow.getDate() + 1)

                day = dateTomorrow.getDate()
                month = dateTomorrow.getMonth()
                year = dateTomorrow.getFullYear()
                console.log(month, day, year, res[0], res.index)
                return {"month": month, "day": day, "year": year, startIndex: res.index, endIndex: res.index + res[0].length, matchStr: res[0]}
            }
        }
        if(!dateFound){
            var tmrRegExp = /tmr{0,1}\s/i
            res = tmrRegExp.exec(str)  // var res = todayRegExp.exec("todtodaytodayTODAY ")
            console.log(res)
            if(res !== null){
                dateFound = true

                dateTomorrow = new Date()
                dateTomorrow.setDate(dateNow.getDate() + 1)

                day = dateTomorrow.getDate()
                month = dateTomorrow.getMonth()
                year = dateTomorrow.getFullYear()
                console.log(month, day, year, res[0], res.index)

                return {"month": month, "day": day, "year": year, startIndex: res.index, endIndex: res.index + res[0].length, matchStr: res[0]}
            }
        }

        // day month strs
        // TODO add on
        // TODO add day number checks for 31+ (ex: January 39th)
        if(!dateFound){
            var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
            for(var i=0; i < monthNames.length; i++){
                // console.log(monthStr)
                var monthStr = monthNames[i]

                var splitIndex = 3
                if(monthStr === "September"){
                    splitIndex = 4
                }

                var monthREString = monthStr.substring(0, splitIndex) + "(" + monthStr.substring(splitIndex) + "){0,1}"
                var dayREString = "[123]{0,1}\\d(\\w\\w){0,1}"

                // TODO add European method
                var monthRegExp = RegExp(monthREString + "\\s" + dayREString, "i")
                // var res = monthRegExp.exec('"January 1", "February 5", "March 2nd", "April 5", "May 6", "June 21", "July 55", "August 24", "September 33", "October 44", "November 7", "December 39"')
                
                res = monthRegExp.exec(str)
                if(res !== null){
                    dateFound = true
                    
                    day = parseInt(res[0].split("\\s")[1])
                    month = i
                    year = dateNow.getFullYear()

                    if(month < dateNow.getMonth()){
                        year += 1
                    }
                    
                    console.log(month, day, year, monthRegExp, res)
                    return {"month": month, "day": day, "year": year, startIndex: res.index, endIndex: res.index + res[0].length, matchStr: res[0]}
                }
            }
        }
        
        // this day of the week
        // TODO add this as an option
        var daysOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        if(!dateFound){
            for(i=0; i < daysOfWeekNames.length; i++){
                var dayStr = daysOfWeekNames[i]
                
                splitIndex = 3
                var thisDayRegExp = RegExp(dayStr.substring(0, splitIndex) + "(" + dayStr.substring(splitIndex) + "){0,1}\\s", "i")
                // res = thisDayRegExp.exec("'Sun day', 'Monday ', 'Tuesday ', 'Wed nesday', 'Thurs day', 'Fri day', 'Sat urday'")
                // console.log(res);
                res = thisDayRegExp.exec(str)

                if(dayStr === 'Tuesday'){
                    if(res === null){
                        // Tues
                        var tuesRegExp = RegExp("Tues\\s", "i")
                        console.log(tuesRegExp.exec("tues tuesday"))
                        res = tuesRegExp.exec(str)
                    }
                }else if(dayStr === 'Wednesday'){
                    if(res === null){
                        var wedsRegExp = RegExp("Weds\\s", "i")
                        res = wedsRegExp.exec(str)
                    }
                }else if(dayStr === 'Thursday'){
                    if(res === null){
                        // Thur/Thurs
                        var thursRegExp = RegExp("Thur[s]{0,1}\\s", "i")
                        res = thursRegExp.exec(str)
                    }
                }

                if(res !== null){
                    dateFound = true
                    
                    var daysFromToday = i - dateNow.getDay()
                    if(daysFromToday <= 0){
                        daysFromToday += 7
                    }
                    
                    var dateWeekday = new Date()

                    dateWeekday.setDate(dateNow.getDate() + daysFromToday)

                    day = dateWeekday.getDate()
                    month = dateWeekday.getMonth()
                    year = dateWeekday.getFullYear()
                    console.log(month, day, year, res[0], res.index)

                    console.log(thisDayRegExp, res)
                    return {"month": month, "day": day, "year": year, startIndex: res.index, endIndex: res.index + res[0].length, matchStr: res[0]}
                }
            }
        }
        // if(!dateFound){
        //     // for Tues
        //     var tuesRegExp = RegExp("Tues\\s", "i")
        //     console.log(tuesRegExp.exec("tues tuesday"))
        //     res = tuesRegExp.exec(str)
        //     if(res !== null){
        //         dateFound = true
        //         console.log(tuesRegExp, res)
        //         return {"month": month, "day": day, "year": year, startIndex: res.index, endIndex: res.index + res[0].length, matchStr: res[0]}
        //     }
        // }
        // if(!dateFound){
        //     // for Weds
        //     var wedsRegExp = RegExp("Weds\\s", "i")
        //     res = wedsRegExp.exec(str)
        //     if(res !== null){
        //         dateFound = true
        //         console.log(wedsRegExp, res)
        //         return {"month": month, "day": day, "year": year, startIndex: res.index, endIndex: res.index + res[0].length, matchStr: res[0]}
        //     }
        // }
        // if(!dateFound){
        //     // Thur/Thurs
        //     var thursRegExp = RegExp("Thur[s]{0,1}\\s", "i")
        //     res = thursRegExp.exec(str)
        //     if(res !== null){
        //         dateFound = true
        //         console.log(thursRegExp, res)
        //         return {"month": month, "day": day, "year": year, startIndex: res.index, endIndex: res.index + res[0].length, matchStr: res[0]}
        //     }
        // }

        // TODO next day of the week
        if(!dateFound){
        }

        return false;
    }

    /** 
     * returns JSON
     * {
     *  hours (as integer)
     *  minutes (as integer)
     *  matchStr
     *  startIndex
     *  endIndex
     * }
     */
    function parseTime(str){
        var timeFound = false
        
        // 7pm or 7 pm 7:30pm
        // TODO more sophisticated time parsing (99 is not valid)
        var timeAMRegExp = /[01]{0,1}\d(:\d\d){0,1}\s{0,1}am\s/i
        var res = timeAMRegExp.exec(str)
        if(res !== null){
            console.log(res)
            timeFound = true

            var hours = parseInt(res[0].match(/[01]{0,1}\d/)[0])
            var minutes = 0
            if(res[1] !== undefined){
                minutes = parseInt(res[1].substring(1))
            }

            console.log(hours, minutes, res[0], res.index)
            return { hours: hours, minutes: minutes, matchStr: res[0], startIndex: res.index, endIndex: res.index + res[0].length }

        }

        if(!timeFound){
            var timePMRegExp = /[01]{0,1}\d(:\d\d){0,1}\s{0,1}pm\s/i
            res = timePMRegExp.exec(str)
            if(res !== null){
                console.log(res)
                timeFound = true
    
                hours = parseInt(res[0].match(/[01]{0,1}\d/)[0])
                hours += 12

                minutes = 0
                if(res[1] !== undefined){
                    minutes = parseInt(res[1].substring(1))
                }

                console.log(hours, minutes, res[0], res.index)
                return { hours: hours, minutes: minutes, matchStr: res[0], startIndex: res.index, endIndex: res.index + res[0].length }
            }
        }
        
        
        // 23:47
        if(!timeFound){
            var hhmmRegExp = /([012]{0,1}\d:\d\d)\s/i
            res = hhmmRegExp.exec(str);

            if(res !== null){
                [hours, minutes] = res[1].split(":")
                hours = parseInt(hours)
                minutes = parseInt(minutes)

                console.log(hours, minutes, res[0], res.index)
                return { hours: hours, minutes: minutes, matchStr: res[0], startIndex: res.index, endIndex: res.index + res[0].length }
            }
        }


        // TODO "at" parsing

        return false;
    }


    return (
        <>
            <TextField
                    required
                    variant='standard'
                    label='Quick Add Todo'
                    type='text'
                    value={quickAdd.text}
                    onChange={(e) => parseQuickAdd(e)}
                    disabled={quickAdd.formModified}
                    className='textfield'
                    size='medium'
                />

            <div className='form'>
                <TextField
                    required
                    variant='standard'
                    label='Add Todo'
                    type='text'
                    value={formData.atitle}
                    onChange={(e) => {setFormData({...formData, atitle: e.target.value}); setQuickAdd({...quickAdd, formModified: true})}}
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
                            
                            setQuickAdd({...quickAdd, formModified: true})
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
                            onChange={(e) => setFormData({...formData, deadlineType: "noDeadline", dueDate: null})}
                            label="No Deadline" />
                    </RadioGroup>
                </FormGroup>
                
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
                
                {/* <TextField
                    variant='standard'
                    label='Priority '
                    helperText="0-100 (0 is highest, 100 is lowest)"
                    type='number'
                    value={formData.estTime}
                    onChange={(e) => setFormData({...formData, estTime: e.target.value})}
                    className='textfield'
                    size='medium'
                />
                
                <br/> */}

                
                <FormLabel component="legend">Priority</FormLabel>  
                <RadioGroup row>
                    <FormControlLabel 
                        checked={formData.priority === 'tbd'}
                        control={<Radio />} 
                        onChange={(e) => setFormData({...formData, priority: 'tbd'})}
                        label="To Be Determined" />
                    {/* <FormControlLabel 
                        checked={formData.priority === 'vlow'}
                        control={<Radio />} 
                        onChange={(e) => setFormData({...formData, priority: 'vlow'})}
                        label="Very Low" /> */}
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
                    {/* <FormControlLabel 
                        checked={formData.priority === 'vHIGH'}
                        control={<Radio />} 
                        onChange={(e) => setFormData({...formData, priority: 'vHIGH'})}
                        label="Very high" /> */}
                </RadioGroup>

                <TextField 
                    required
                    variant='standard'
                    label="folder"
                    value={formData.folder}
                    onChange={(e) => setFormData({...formData, folder: e.target.value})}
                    type='text'
                />

                <TextField 
                    required
                    variant='standard'
                    label="list name"
                    value={formData.list}
                    onChange={(e) => setFormData({...formData, list: e.target.value})}
                    type='text'
                />

                <div className='add'>
                    {
                        formData.atitle === '' ?
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