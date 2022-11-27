import { backendBaseUrl} from "./GlobalConfig";
import Axios from "../configurations/Interceptor";

/**
 * ********************************************* Server Requests ********************************************* 
 */
export const get_patients = () => {      
    return Axios.get(backendBaseUrl + "/get_patients")
}

export const add_patient = (payload) => {      
    return Axios.post(backendBaseUrl + "/add_patient",payload)
}




