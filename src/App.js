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
    firebaseSignedIn: null,
    userFilePath: "users/" + null
  })

  
  // console.log("sign in change", gapiState)

  // , () => {
  //   console.log("gapiLoaded", gapiState)
    
  //   handleClientLoad((isSignedIn) => {
  //     setGapiState({signedIn: isSignedIn}, () => console.log("sign in change", gapiState))
  //   });

  // useEffect is called after React updates the DOM
  // TODO fix this because onAuthStateChange gets added every single time
  useEffect(() => {
    console.log("useEffect")
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
        // TODO check if firebase is even online at all
        console.log("fsignin status actually changed", state.userFilePath)
        
        // TODO TEST IF THIS ACTUALLY WORKS
        setState({...state, firebaseSignedIn: (user !== null), userFilePath: "users/" + (user ? user.uid : null)})
      }
      
    })

  });


  // debugger;

  return (
    <>
      <div className='app'>
        <FirebaseSignin 
          firebaseSignedIn={state.firebaseSignedIn}
        />
        <CalendarIntegration 
          gapiLoaded={state.gapiLoaded} 
          gapiSignedIn={state.gapiSignedIn}
          userFirebasePath={state.userFilePath}
        />
        <TodoApp 
          gapiLoaded={state.gapiLoaded} 
          gapiSignedIn={state.gapiSignedIn}
          firebaseSignedIn={state.firebaseSignedIn}
          userFirebasePath={state.userFilePath}
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