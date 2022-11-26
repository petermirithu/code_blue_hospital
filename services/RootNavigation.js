import { createNavigationContainerRef } from '@react-navigation/native';


export const navigationRef = createNavigationContainerRef()

export const navigate = (name, params) => {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }    
}

export const navigateReset = (name, params) => {
    if (navigationRef.isReady()) {
        navigationRef.current && navigationRef.current.reset({
            index: 0,
            routes: [{ name: name, params: params}]
        });
    }
}

export const navigateHome = async (data) => {    
    if (data && data?.admin == true) {
        navigateReset("Admin's Home");
    }
    else if (data && data?.admin == false) {
        navigateReset("Investigator's Home");
    }
    else if (data && data?.admin == undefined) {
        navigateReset("Participant's Home");
    }
}