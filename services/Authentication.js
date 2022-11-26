import { backendBaseUrl} from "./GlobalConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from "../configurations/Interceptor";

/**
 * Helper functions
 */
export const validateEmail = (text) => {        
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {                        
        return false;
    }
    else {                        
        return true;
    }
} 

/**
 * Auth Token Section 
 */
export const storeAuthToken = async (data) => {
    await AsyncStorage.setItem("auth_token", data);    
}

export const clearCacheItem = async (name) => {
    if(name=="everything"){
        await AsyncStorage.clear();        
    }
    else{
        await AsyncStorage.removeItem(name);
    }
}

/**
 * ********************************************* Server Requests ********************************************* 
 */
export const loginUser = (payload) => {      
    return Axios.post(backendBaseUrl + "/login_user", payload)
}