import { Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


/**
 * API Base url
 */
const BACKEND_BASE_URL_LOCAL = "http://localhost:8000/v1/api";
const BACKEND_BASE_URL_PRODUCTION = "https://pyra.pythonanywhere.com/v1/api"
export const backendBaseUrl = (Platform.OS == "web" && __DEV__)?BACKEND_BASE_URL_LOCAL:BACKEND_BASE_URL_PRODUCTION;

/**
 * Dimensions
 */
 export const Width = Dimensions.get('screen').width
 export const Height = Dimensions.get('screen').height

/**
 * User Profile Cache Section
 */
export const getCachedUserProfile = async () => {    
    const cachedData = await AsyncStorage.getItem('profile');
    if (cachedData == null || cachedData == undefined) {
        return null
    }        
    return JSON.parse(cachedData) 
}

export const setCachedUserProfile = async (data) => {    
    let plainText=data;

    if (typeof (data) == "object") {
        plainText = JSON.stringify(data);
    }
    await AsyncStorage.setItem("profile", plainText);    
}