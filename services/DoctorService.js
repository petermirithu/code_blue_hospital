import { backendBaseUrl} from "./GlobalConfig";
import Axios from "../configurations/Interceptor";

/**
 * ********************************************* Server Requests ********************************************* 
 */
 export const get_doctors = () => {      
    return Axios.get(backendBaseUrl + "/get_doctors")
}