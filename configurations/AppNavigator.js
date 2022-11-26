import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from "../services/RootNavigation";
// import Navbar from "../components/";
import Authorise from "../screens/Authorise";
import AdminHome from '../screens/AdminHome';

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

            {/* Cockpit */}
            <Screen name="Admin's Home" component={AdminHome}></Screen>            
        </Navigator>
    </NavigationContainer>
)