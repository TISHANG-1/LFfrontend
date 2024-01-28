import './App.css';  
import { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route , Routes } from 'react-router-dom';
import ChatRoom from './component/ChatRoom';   
import Navbar from './component/Navbar/Navbar'; 
import AuthDiv from './component/AuthDiv/AuthDiv';  
import WebFont from 'webfontloader';
import { useSelector } from 'react-redux';
function App() {  

  const {authData, loading} = useSelector(state=>state.authData) ; 
  const [user , setUser] = useState(false) ;  
  useEffect(()=>{
    WebFont.load({
       google:{
           families:["Roboto" ,"Droid Sans" , "Chilanka" , "Salsa" , "Josefin Slab"] 
       }
    }) } ,[]) ; 
  useEffect(()=>{  
      
            setUser(localStorage.getItem('profile')) ;
     
  } , [authData]) ;  
  

  return ( 
    <Router>
     <Navbar/>   
    <Fragment>
      <Routes>
      
     { !user && <Route path = '/' Component = {AuthDiv}/>  }
      {user && <Route path = '/' Component={ChatRoom}/>}
      </Routes>

    </Fragment> 
    </Router>
    
   
  );
}

export default App;
