import React from 'react';
import './App.css';
import TodoApp from './components/TodoApp'
import CalendarIntegration from './components/CalendarIntegration';
import { loadGoogleScript } from './utils/loadgs';

function App() {
  loadGoogleScript();

  return (
    <>
      <div className='app'>
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