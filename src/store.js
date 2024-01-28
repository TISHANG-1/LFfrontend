import {createStore , combineReducers , applyMiddleware , compose} from "redux"   ;   
import  thunk  from "redux-thunk";     
import {composeWithDevTools} from "redux-devtools-extension"   ;  
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
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store =  createStore(reducer , initialState , composeEnhancers(applyMiddleware(...middleware)));  

export default store; 