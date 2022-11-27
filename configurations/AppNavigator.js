import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from "../services/RootNavigation";
// import Navbar from "../components/";
import Authorise from "../screens/Authorise";
import AdminHome from '../screens/AdminHome';
import NurseHome from '../screens/NurseHome';
import DoctorHome from '../screens/DoctorHome';

const { Screen, Navigator } = createStackNavigator();

const screenOptions = {
    headerLeftShown: false,
    header: () => {
        return (            
            <></>
            // <Navbar></Navbar>            
        )
    }
}

export const AppNavigator = () => (
    <NavigationContainer ref={navigationRef}>
        <Navigator initialRouteName="Authorise" screenOptions={screenOptions}>                            
            {/* Login  */}
            <Screen name="Authorise" component={Authorise} options={{ headerShown: false }}></Screen>                                

            {/* Landing pages */}
            <Screen name="Admin's Home" component={AdminHome}></Screen>            
            <Screen name="Nurse's Home" component={NurseHome}></Screen>            
            <Screen name="Doctor's Home" component={DoctorHome}></Screen>            
            {/* <Screen name="Pharmacist's Home" component={AdminHome}></Screen>             */}
        </Navigator>
    </NavigationContainer>
)