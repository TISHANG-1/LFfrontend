import * as actionType from "../constants/userConstant" ;  



export const userReducer = ( state = {authData : null} , action) =>{ 
      switch(action.type)
      {   
       case  actionType.USER_LOGIN_GOOGLE_AUTH:  
        console.log(action?.data) ;
        localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
        return {   
             ...state, 
             authData: action?.data, 
             loading: false, 
        } 
        case actionType.USER_LOGOUT_GOOGLE_AUTH: 
          localStorage.clear() ; 
          return{ 
             ...state ,
             authData:null, 
             loading: false, 
             err: null,   
            
          }
        case actionType.USER_AUTH_ERROR: 
          return{ 
            ...state,
             error: action.data, 
          }
        default : 
          return {...state ,}
      }
     

}