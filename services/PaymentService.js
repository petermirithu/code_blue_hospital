import { backendBaseUrl} from "./GlobalConfig";
import Axios from "../configurations/Interceptor";

/**
 * ********************************************* Server Requests ********************************************* 
 */
 export const get_revenue = () => {      
    return Axios.get(backendBaseUrl + "/get_revenue")
}