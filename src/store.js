import {createStore , combineReducers , applyMiddleware} from "redux"   ;   
import {composeWithDevTools} from "redux-devtools-extension"   ;  
import { thunk } from "redux-thunk";    
import {userReducer} from "../src/reducer/userReducer"; 



const reducer =  combineReducers({
       authData: userReducer ,
}) ; 

let initialState = { 
    authData : { 
        user : localStorage.getItem('profile'),
     }  
}  

const middleware  =  [thunk] ; 
const store =  createStore(reducer , initialState ,  composeWithDevTools(applyMiddleware(...middleware))) ; 

export default store; 