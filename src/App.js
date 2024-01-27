import './App.css';  
import { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route , Routes } from 'react-router-dom';
import ChatRoom from './component/ChatRoom';  
import Navbar from './component/Navbar/Navbar';
function App() {
  return ( 
    <Router>
    <Fragment>
     <Navbar/> 
     <ChatRoom/>
    </Fragment> 
    </Router>
    
   
  );
}

export default App;
