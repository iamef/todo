import React from 'react';
import './App.css';
import TodoApp from './components/TodoApp'
import CalendarIntegration from './components/CalendarIntegration';

function App() {
  return (
    <>
      <div className='app'>
        <CalendarIntegration />
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