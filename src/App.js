import React, { useEffect, useState } from 'react';

import './App.css';
import TodoApp from './components/TodoApp'
import CalendarIntegration from './components/CalendarIntegration';
import { loadGoogleScript, handleClientLoad } from './utils/gapiFunctions';
// import { getTodos } from './utils/calculateOvershoot';

function App() {
  const [gapiState, setGapiState] = useState({
    loaded: false,
    signedIn: null
  })

  // debugger;
  
  // console.log("sign in change", gapiState)

  // , () => {
  //   console.log("gapiLoaded", gapiState)
    
  //   handleClientLoad((isSignedIn) => {
  //     setGapiState({signedIn: isSignedIn}, () => console.log("sign in change", gapiState))
  //   });

  useEffect(() => {
    // console.log("useEffect", gapiState)
    if(!gapiState.loaded){
      loadGoogleScript(() => {
        setGapiState({loaded: true, signedIn: null});    
        // console.log("updating gapi State")
      });
    }else if(gapiState.signedIn === null){
      handleClientLoad((isSignedIn) => {
            setGapiState({loaded: true, signedIn: isSignedIn});
      });
    }
  });

  // debugger;

  return (
    <>
      <div className='app'>
        <CalendarIntegration 
          gapiLoaded={gapiState.loaded} 
          signedIn={gapiState.signedIn}/>
        <TodoApp />
      </div>
      {/* <script async defer src="https://apis.google.com/js/api.js"
      onload="this.onload=function(){};handleClientLoad()"
      onreadystatechange="if (this.readyState === 'complete') this.onload()">
    </script> */}
    </>
  );
}
export default App;