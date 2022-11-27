import { backendBaseUrl} from "./GlobalConfig";
import Axios from "../configurations/Interceptor";

/**
 * ********************************************* Server Requests ********************************************* 
 */
 export const get_pharmacists = () => {      
    return Axios.get(backendBaseUrl + "/get_pharmacists")
}