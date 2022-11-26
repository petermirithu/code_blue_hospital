import axios from 'axios';
import promise from 'promise';
import { navigateReset } from "../services/RootNavigation";
import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * Request interceptor 
 */

const signOut = async () => {        
    const keys = await AsyncStorage.getAllKeys()
    await AsyncStorage.multiRemove(keys)   
    navigateReset("Authorise");
}

let Axios = axios.create();

const getAuthToken = async () => {    
    const cachedData = await AsyncStorage.getItem('auth_token');               
    if (cachedData == "null" || cachedData == "undefined" || cachedData == null || cachedData == undefined) {
        return null
    }
    return cachedData
}

Axios.interceptors.request.use(async (config) => {       
    let accessToken = null;
    await getAuthToken().then(token => {
        accessToken = token;        
    })

    if (accessToken) {
        if (config.method !== 'OPTIONS') {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }        
    }
    return config;
}, (error) => {    
    return promise.reject(error);
});

Axios.interceptors.response.use(
    (response) => {        
        if (response?.status === 401 || response?.status === 403) {                        
            signOut();
            return            
        }
        return response;
    },
    (error) => {                           
        if (error?.response?.status === 401 || error?.response?.status === 403) {            
            signOut();        
            return    
        }
        return Promise.reject(error);
    }
);

export default Axios;