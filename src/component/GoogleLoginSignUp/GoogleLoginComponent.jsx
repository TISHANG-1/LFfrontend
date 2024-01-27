import { GoogleLogin } from 'react-google-login';
import { gapi } from "gapi-script"; 
import './handleGoogleLogin.css'   
import * as actiontype from "../../constants/userConstant"
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


gapi.load("client:auth2", () => {
  gapi.client.init({
    clientId:
      "870910263745-4kn6i57s8p097mgq77c4peg0uk8g8p9f.apps.googleusercontent.com",
    plugin_name: "chat",
  });
});


const GoogleLoginComponent = () => {     
  const navigate = useNavigate(); 
  const dispatch = useDispatch(); 
  const loginsuccess = async (res) => {
    const result  = await res?.profileObj ; 
    const token  =  await res?.tokenId ;    
    console.log(result , token) ; 
    try{  
        await dispatch({type: actiontype.USER_LOGIN_GOOGLE_AUTH, data : {result, token} }) ;  
        navigate('/') ; 
    } 
    catch(error){ 
        await  dispatch({type: actiontype.USER_AUTH_ERROR , data : {error}}) ;
    }
};   

const loginerror =  async (error)=> 
{ 
      console.log(error) ;  
      await  dispatch({type: actiontype.USER_AUTH_ERROR , data : {error}}) ;
}


  return (  
    <div className='google-login-div'>   
    <div className="google-login-div-2">  
    <GoogleLogin
    clientId="870910263745-4kn6i57s8p097mgq77c4peg0uk8g8p9f.apps.googleusercontent.com"
    onSuccess={loginsuccess}
    onFailure={loginerror}
    cookiePolicy={'single_host_origin'}
    />
    </div>
    </div>
  );
}; 

export default GoogleLoginComponent ; 