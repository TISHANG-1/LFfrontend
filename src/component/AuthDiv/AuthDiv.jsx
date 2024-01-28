import React from 'react' 
import "./Styles.css"
import GoogleLoginComponent from '../GoogleLoginSignUp/GoogleLoginComponent'
const AuthDiv = () => {
  return (
    <div className='auth-div-container'>  
        <div className='text-div'>  
            
             Chat one-to-one, or chat in common chat room
           </div>
        <div className='text-div'>  
            
         Easy Login to your account using google login, safe and secure, enjoy chating with friends, chat history is stored and maintend, user info is also preserved
        </div>
         {<GoogleLoginComponent/>}
    </div>
  )
}

export default AuthDiv
