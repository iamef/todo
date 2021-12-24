// This function is probably unnecessary because we already get the todos from another place
// export function getTodos(){
//   firebase.database().ref("Todo").get().then((value) => {
//       console.log(value.val())

import { gapiSignin } from "./gapiFunctions";

      

//     }, (reason) => console.log(reason))
// }

// later on add support for overshoots  based on priority
// Update to this https://blog.patricktriest.com/what-is-async-await-why-should-you-care/
export async function calculateBuffer(todos, calendars){
  // get calendars that are checked
  console.log("unsortedtodos", todos)

  console.log(calendars)

  // sort todos in order of dueDate
  // can later incoporate priority
  todos.sort((item1, item2) => {
    if(item1.dueDate == '' && item2.dueDate == ''){
      return 0
    }else if(item1.dueDate == ''){
      return 1  // this means item1 - item2 is positive
    }else if(item2.dueDate == ''){
      return -1 // this means item1 - item2 is negative
    }
    
    return Date.parse(item1.dueDate) - Date.parse(item2.dueDate)
  });

}

const eventsDispatcher = {

}


// /** Loads google calendar api
//  * @param {string} apiKey api key for google's calendar api
//  * @return {Promise} resolves when api is successfully loaded and rejects when an error occurs
//  */
// export function loadCalendarAPI(apiKey) {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement("script");
//     script.src = "https://apis.google.com/js/api.js";
//     document.body.appendChild(script);
//     script.onload = () => {
//       gapi.load("client", () => {
//         gapi.client.init({ apiKey: apiKey })
//           .then(() => {
//             gapi.client
//               .load(
//                 "https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest"
//               )
//               .then(
//                 () => resolve("GAPI client successfully loaded for API"),
//                 (err) => reject(err)
//               );
//           });
//       });
//     }
//   })
// }

// /** query calendar API for events
//  * @param {string} calendarId id of the calendar, looks like s9ajkhr604dfrmvm7185lesou0@group.calendar.google.com
//  * @param {number} [maxResults=1000] maximum number of events returned, can be up to 2500, currently doesn't support more events
//  * @returns {Object} see https://developers.google.com/calendar/v3/reference/events/list for shape of response object
//  */
// export function getEventsList(calendarId, maxResults = 1000) {
//   return gapi.client.calendar.events.list({
//     calendarId: calendarId,
//     maxResults: maxResults,
//   });
// }