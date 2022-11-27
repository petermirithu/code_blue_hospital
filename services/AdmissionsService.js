import { backendBaseUrl} from "./GlobalConfig";
import Axios from "../configurations/Interceptor";

/**
 * ********************************************* Server Requests ********************************************* 
 */
export const get_admissions = () => {      
    return Axios.get(backendBaseUrl + "/get_admissions")
}

export const add_admissions = (payload) => {      
    return Axios.post(backendBaseUrl + "/add_admissions",payload)
}

export const update_admissions = (payload) => {      
    return Axios.post(backendBaseUrl + "/update_admissions",payload)
}

export const delete_admission = (admission_id) => {      
    return Axios.delete(backendBaseUrl + "/delete_admission/"+admission_id)
}






