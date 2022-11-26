import React, { useEffect, useState } from "react";
import {            
    View,    
} from "native-base";
import Login from "../components/Login";
import { navigateReset } from "../services/RootNavigation";
import Loader from "../components/Loader";
import { getCachedUserProfile } from "../services/GlobalConfig";

export default function Authorise({ navigation }) {                     
    const [isLoading, setIsLoading] = useState(null);    

    const checkIfLoggedIn = async () => {
        await getCachedUserProfile().then(userData => {                                   
            if (userData?.admin == true) {
                navigateReset("Admin's Home");
            }
            else if (userData?.doctor == true) {
                navigateReset("Doctor's Home");
            }
            else if (userData?.nurse == true) {
                navigateReset("Nurse's Home");
            }
            else if (userData?.pharmacist == true) {
                navigateReset("Pharmacist's Home");
            }
            else{
                setIsLoading(false);    
            }  
        })
    }

    useEffect(()=>{
        if(isLoading==null){
            setIsLoading(true);
            checkIfLoggedIn();            
        }
    },[isLoading])

    if (isLoading==true || isLoading==null) {
        return (
            <View alignItems="center" justifyContent="center" flex="1" background="#f8f9fa">
                <Loader text={"Loading ..."}></Loader>
            </View>
        )
    }
    return (
        <View style={global.container}>
            <Login source="authorise"/>
        </View>
    )
}