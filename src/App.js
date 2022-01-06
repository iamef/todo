import React, { useEffect, useState } from 'react';

import { onAuthStateChanged } from "firebase/auth";

import './App.css';
import TodoApp from './components/TodoApp'
import CalendarIntegration from './components/CalendarIntegration';
import { loadGoogleScript, handleClientLoad } from './utils/gapiFunctions';
import { auth } from './firebase';
import FirebaseSignin from './components/FirebaseSignin';
// import { getTodos } from './utils/calculateOvershoot';

function App() {
  const [state, setState] = useState({
    gapiLoaded: false,
    gapiSignedIn: null,
    firebaseSignedIn: null
  })

  
  // console.log("sign in change", gapiState)

  // , () => {
  //   console.log("gapiLoaded", gapiState)
    
  //   handleClientLoad((isSignedIn) => {
  //     setGapiState({signedIn: isSignedIn}, () => console.log("sign in change", gapiState))
  //   });

  useEffect(() => {
    // console.log("useEffect", gapiState)
    if(!state.gapiLoaded){
      loadGoogleScript(() => {
        setState({...state, gapiLoaded: true});    
        // console.log("updating gapi State")
      });
    }else if(state.gapiSignedIn === null){
      handleClientLoad((isSignedIn) => {
            setState({...state, gapiSignedIn: isSignedIn});
      });
    }
    
    onAuthStateChanged(auth, (user) => {
      // debugger;
      console.log(user);
      if(state.firebaseSignedIn !== (user !== null)){
        console.log("fsignin status actually changed", state.firebaseSignedIn)
        setState({...state, firebaseSignedIn: (user !== null)})
      }
      
    })

  });


  // debugger;

  return (
    <>
      <div className='app'>
        <FirebaseSignin 
          signedIn={state.firebaseSignedIn}
        />
        <CalendarIntegration 
          gapiLoaded={state.gapiLoaded} 
          signedIn={state.gapiSignedIn}/>
        <TodoApp 
          gapiLoaded={state.gapiLoaded} 
          gapiSignedIn={state.gapiSignedIn}
          firebaseSignedIn={state.firebaseSignedIn}
        />
      </div>
      {/* <script async defer src="https://apis.google.com/js/api.js"
      onload="this.onload=function(){};handleClientLoad()"
      onreadystatechange="if (this.readyState === 'complete') this.onload()">
    </script> */}
    </>
  );
}
export default App;