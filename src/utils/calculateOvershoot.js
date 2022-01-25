// later on add support for overshoots  based on priority
// Update to this https://blog.patricktriest.com/what-is-async-await-why-should-you-care/
export async function calculateBuffer(todos, calendars){
  var buffersById = {}
  
  // get calendars that are checked
  // console.log("unsortedtodos", todos)

  // console.log(calendars)
  if(calendars === undefined){
    for(var nocaltodo of todos){
      nocaltodo.bufferMS = "select calendars"
    }
    return todos;
  }

  // sort todos in order of dueDate
  // can later incoporate priority
  var sortedTodos = todos.slice().sort((item1, item2) => {
    if(item1.dueDate === '' && item2.dueDate === ''){
      return 0
    }else if(item1.dueDate === ''){
      return 1  // this means item1 - item2 is positive
    }else if(item2.dueDate === ''){
      return -1 // this means item1 - item2 is negative
    }
    
    return Date.parse(item1.dueDate) - Date.parse(item2.dueDate)
  });
  
  console.log("SORTED", sortedTodos)

  var currBufferMS = 0;
  var prevTodoDueDate = new Date()
  var prevTodoName = "none, 1st todo"

  for(var todo of sortedTodos){
    // var calIter = calendars.values(); // returns iterator so I can call next
    
    // var eList = await returnEventsRecursion(calIter, prevTodoEndString, '2022-01-25T07:36:53.880Z');
    buffersById[todo.id] = {}

    if(todo.dueDate === '' || todo.complete){
        // debugger;
        buffersById[todo.id]["bufferMS"] = "N/A"
        continue;
    }

    var todoDueDate = new Date(todo.dueDate)
    
    var prevBufferMS = currBufferMS;
    var msBetweenTasks = Math.max(0, todoDueDate - prevTodoDueDate);
    var hoursBetweenTasks = msBetweenTasks / (60*60*1000);
    
    var msEventsBetweenTasks = 0;
    var hoursEventsBetweenTasks = 0

    var msToComplete = Number(todo.estTime) * 60*60*1000

    console.log(prevBufferMS / (60*60*1000), hoursBetweenTasks, hoursEventsBetweenTasks)

    if(prevTodoDueDate < todoDueDate){
      var eList = []

      for(var calId of calendars){
        
        var events = await window.gapi.client.calendar.events.list({
          'calendarId': calId,
          'timeMin': prevTodoDueDate.toISOString(), // note this is end time
          'timeMax': todoDueDate.toISOString(), 
          'showDeleted': false,
          'singleEvents': true,
          'orderBy': 'startTime'
        });
        // console.log(events.result.items)
        eList = eList.concat(events.result.items)
      }

      console.log('eList', eList)
      buffersById[todo.id]["events"] = []
      for(var event of eList){
        // TODO needs to work on this calculation
        console.log(event.summary, event.start, event.end);
        buffersById[todo.id]["events"].push({
            summary: event.summary, 
            start: event.start.dateTime,
            end: event.end.dateTime,
            htmlLink: event.htmlLink
        })
        // debugger;
        // console.log(event);

        var startTime = Math.max(prevTodoDueDate, new Date(event.start.dateTime))
        var endTime = Math.min(todoDueDate, new Date(event.end.dateTime))
        
        // console.log((endTime - startTime) / (60*60*1000))
        
        msEventsBetweenTasks += (endTime - startTime)

      }

      buffersById[todo.id]["events"].sort((item1, item2) => {
        if(item1.start === '' && item2.start === ''){
          return 0
        }else if(item1.start === ''){
          return 1  // this means item1 - item2 is positive
        }else if(item2.start === ''){
          return -1 // this means item1 - item2 is negative
        }
        
        return Date.parse(item1.start) - Date.parse(item2.start)
      });

      hoursEventsBetweenTasks = msEventsBetweenTasks / (60*60*1000)
      
      prevTodoDueDate = todoDueDate
    }

    currBufferMS = prevBufferMS + msBetweenTasks - 
                            msEventsBetweenTasks - msToComplete
    // currBuffer -= Number(todo.estTime) * 60*60*1000  // convert to miliseconds
    console.log(todo.id)
    
    buffersById[todo.id]["prevTodo"] = prevTodoName;
    buffersById[todo.id]["prevBuffer"] = prevBufferMS;
    buffersById[todo.id]["hoursBetweensTasks"] = hoursBetweenTasks;
    buffersById[todo.id]["hoursEventBetweensTasks"] = hoursEventsBetweenTasks;
    buffersById[todo.id]["hoursToComplete"] = Number(todo.estTime);
    
    
    buffersById[todo.id]["bufferMS"] = currBufferMS

    prevTodoName = todo.atitle
  }

  return buffersById
}