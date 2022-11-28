import { backendBaseUrl} from "./GlobalConfig";
import Axios from "../configurations/Interceptor";

/**
 * ********************************************* Server Requests ********************************************* 
 */
export const get_revenue = () => {      
    return Axios.get(backendBaseUrl + "/get_revenue")
}

export const add_payment = (payload) => {      
    return Axios.post(backendBaseUrl + "/add_payment",payload)
}

export const get_payments = () => {      
    return Axios.get(backendBaseUrl + "/get_payments")
}
