export const loadGoogleScript = () => {
  // I feel like adding the "function" is a typo but apparently it works?
  console.log("Hello")
  const id = 'google-js'
  const src = "https://apis.google.com/js/api.js" // Quad used platform.js

  const firstJs = document.getElementsByTagName('script')[0] // because react

  if(document.getElementById(id)) return;
  else{
    const js = document.createElement('script');
    js.id = id
    js.src = src;
    js.onload = handleClientLoad; // fascinating
    firstJs.parentNode.insertBefore(js, firstJs);
  }
}

// copied from https://developers.google.com/calendar/api/quickstart/js


const CLIENT_ID = '45873534951-ebrqt8r78ii9vsh5smmf0d0nllm2aa6g.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCEGfVixki6n9JjL4mU9jhT6AHEtEofHP4';

console.log(CLIENT_ID)

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";


/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
export function handleClientLoad(){
  console.log("client load yay")
  
  
  window.gapi.load("client:auth2", () => {
    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(window.window.gapi.auth2.getAuthInstance().isSignedIn.get());
      console.log("handle client load seemed to have worked")
    }, function(error) {
      console.log(JSON.stringify(error, null, 2));
    });
  })
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  console.log("Update sign-in status: ", isSignedIn)
  
  var authorizeButton = document.getElementById('authorize_button');
  var signoutButton = document.getElementById('signout_button');

  if (isSignedIn) {
    console.log(window.gapi.auth2.getAuthInstance().
                currentUser.get().getBasicProfile().getEmail());
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
       *  Sign in the user upon button click.
       */
export function handleAuthClick(event) {
  window.gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
export function handleSignoutClick(event) {
  window.gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  console.log(message)
  // var pre = document.getElementById('content');
  // var textContent = document.createTextNode(message + '\n');
  // pre.appendChild(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  // https://stackoverflow.com/questions/29974011/try-to-display-calendar-list-from-google-api-using-java-script
  var request = window.gapi.client.calendar.calendarList.list();
  request.execute(function(resp){
    var calendars = resp.items;
    console.log(calendars);
  });
  
  // window.gapi.client.calendar.events.list({
  //   'calendarId': 'primary',
  //   'timeMin': (new Date()).toISOString(),
  //   'showDeleted': false,
  //   'singleEvents': true,
  //   'maxResults': 10,
  //   'orderBy': 'startTime'
  // }).then(function(response) {
  //   var events = response.result.items;
  //   appendPre('Upcoming events:');

  //   if (events.length > 0) {
  //     for (var i = 0; i < events.length; i++) {
  //       var event = events[i];
  //       var when = event.start.dateTime;
  //       if (!when) {
  //         when = event.start.date;
  //       }
  //       appendPre(event.summary + ' (' + when + ')')
  //     }
  //   } else {
  //     appendPre('No upcoming events found.');
  //   }
  // });
}