import { backendBaseUrl} from "./GlobalConfig";
import Axios from "../configurations/Interceptor";

/**
 * ********************************************* Server Requests ********************************************* 
 */
 export const get_nurses = () => {      
    return Axios.get(backendBaseUrl + "/get_nurses")
}