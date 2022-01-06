import { Button } from '@mui/material';
import React from 'react'

import { firebaseSignInWithGoogle, firebaseSignOut } from "../firebase"


function FirebaseSignInButton(props){
  return (
      <Button
          variant='contained'
          // id='ahhhhhhhhhhh'
          onClick={props.onClick}
      >
          Firebase Sign In
      </Button>
  )
}

function FirebaseSignOutButton(props){
  return (
      <Button
          variant='contained'
          // id='ouuuutt'
          onClick={props.onClick}
      >
          Firebase Sign Out
      </Button>
  )
}

class FirebaseSignin extends React.Component{
  constructor(props){
      super(props) // props are external and are passed into the class
      console.log("FSignIn", props)
      
      // state is internal
      // don't keep track of firebase sign in here
      // this.state = { firebasedSignedIn: props }
  }

  componentDidMount(){
      // console.log("calint mount", this.props, this.state)
  }

  componentDidUpdate(prevProps, prevState, snapshot){
      // console.log("calint update", prevProps, this.props, prevState, this.state)
      
      /* can implement getCalendarList here, 
         but I don't want user to sign out to have list update
      if(prevProps.signedIn == false && this.props.signedIn == true){
          getCalendarList((cals) => {
              // console.log(cals)
              this.setState({calendarsAvailable: cals});
          })
      } 
      */
      
      // calendars shouldn't be available when user signs out
      // if(prevProps.signedIn === true && this.props.signedIn === false){
      //     this.setState({calendarsAvailable: undefined})
      // }
  }


  signIn(){
      // debugger;
      firebaseSignInWithGoogle().then((result) => {
          console.log(result)
          debugger;
      })
      // var result = await signInWithPopup(auth, provider)
      // console.log(result);
  }

  signOut(){
      firebaseSignOut().then(() => {
          console.log("signed out")
      })
  }

  
  render(){
    if(this.props.firebaseSignedIn === null){
        return null
    }else if(this.props.firebaseSignedIn === false){
        return <FirebaseSignInButton onClick={this.signIn} />
    }
    
    return (
      <>
          <FirebaseSignOutButton onClick={this.signOut} />
      </>)
  }
}

export default FirebaseSignin;