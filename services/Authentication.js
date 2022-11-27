import { backendBaseUrl} from "./GlobalConfig";
import Axios from "../configurations/Interceptor";
import AsyncStorage from '@react-native-async-storage/async-storage';


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
export const login_user = (payload) => {      
    return Axios.post(backendBaseUrl + "/login_user", payload)
}

export const register_user = (payload) => {      
    return Axios.post(backendBaseUrl + "/register_user", payload)
}

export const update_user = (payload) => {      
    return Axios.post(backendBaseUrl + "/update_user", payload)
}

export const delete_user = (user_type,user_id) => {      
    return Axios.delete(backendBaseUrl + "/delete_user/"+user_type+"/"+user_id)
}

