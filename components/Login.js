import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    Button,
    Flex,
    Image,
    Input,
    Checkbox,
    useToast,    
    HStack
} from "native-base";
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { login_user, storeAuthToken} from "../services/Authentication";
import { navigateReset } from "../services/RootNavigation";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../redux/UserProfileSlice";
import Toaster from "./Toaster";

const { height } = Dimensions.get('window');

export default function Login({ source }) {

    const dispatch = useDispatch();    

    const toast = useToast();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, updateForm] = useState({ username: "", password: "" });    
    const [isRequesting, setIsRequesting] = useState(false);    

    const handleFormData = (type, text) => {
        if (type == "username") {
            updateForm({ username: text, password: formData.password });
        }
        else{
            updateForm({ username: formData.username, password: text })
        }        
    }

    const routeUser = (userData) => {
        dispatch(setUserProfile(userData));
        if (userData?.admin == true) {
            navigateReset("Admin's Home");
        }
        else if (userData?.doctor == true) {
            navigateReset("Doctor's Home");
        }
        else if (userData?.nurse == true) {
            navigateReset("Nurse's Home");
        }
        else {
            navigateReset("Pharmacist's Home");
        }
    }

    const submitLoginDetails = async () => {
        if (formData.username.length < 3) {
            const toastId = "invalidUsername";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Invalid username"} description={"Please enter a valid username"} status="warning" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        }
        else if (formData.password.length < 5) {
            const toastId = "invalidPassword";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Invalid password"} description={"Please enter a valid password"} status="warning" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        }
        else {
            setIsRequesting(true);
            await login_user(formData).then(async result => {
                storeAuthToken(result?.data?.token)
                delete result.data.token;
                routeUser(result?.data);                
            }).catch(error => {
                if (error?.response?.status == 404) {
                    const toastId = "noUsername";
                    if (!toast.isActive(toastId)) {
                        toast.show({
                            placement: "top",
                            id: toastId,
                            render: () => <Toaster title={error?.response?.data} status="warning" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                        })
                    }
                }               
                else {
                    const toastId = "authError";
                    if (!toast.isActive(toastId)) {
                        toast.show({
                            placement: "top",
                            id: toastId,
                            render: () => <Toaster title={error?.response?.data} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                        })
                    }
                }
                setIsRequesting(false);
            });
        }
    }    

    useEffect(() => {

    }, [showPassword, formData, isRequesting])

    return (
        <View style={styles.container} width="100%">
            <Flex direction="row" flex="1">
                <Image source={{ uri: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1453&q=80" }} alt="Introduction image" style={styles.image} />
                <View flex={1} alignItems="center" justifyContent="center">
                    <View style={styles.card}>
                        <Text style={styles.title} color={"#393A35"}>Sign In</Text>
                        <Text style={styles.subTitle}>Welcome to  <Text style={styles.subTitle} color="#00bbf9">Code Blue Hospital</Text></Text>
                        <Text style={styles.text}>Username</Text>
                        <Input nativeID="username" variant="underlined" marginBottom={5} placeholder={"Enter your username"} type="text" value={formData.username} style={styles.input} onChangeText={(username) => handleFormData('username', username)} />
                        <Text style={styles.text}>Password</Text>
                        <Input nativeID="password" variant="underlined" marginBottom={5} placeholder={"Enter your password"} value={formData.password} type={showPassword ? "text" : "password"} style={styles.input} onChangeText={(password) => handleFormData('password', password)} />
                        <Flex position={"relative"} direction="row" justifyContent={"space-between"} marginBottom={30}>
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <HStack space={3}>
                                    <Checkbox isChecked={showPassword} accessibilityLabel="Show password or not" />
                                    <Text fontWeight={"bold"}>Show password</Text>
                                </HStack>
                            </TouchableOpacity>
                        </Flex>
                        <Button isLoading={isRequesting} isLoadingText={"Authenticating ..."} onPress={submitLoginDetails} style={styles.signIn}>Sign In</Button>
                    </View>                    
                </View>
            </Flex>
        </View>
    )
}
const styles = StyleSheet.create({    
    container: {
        flex: 1,   
        backgroundColor:"#f8f9fa"               
    },
    image: {
        width: "50%",
        height: height,
    },
    input: {
        width: "100%",
        margin: 2,
    },
    title: {
        fontSize: 50,
        textAlign: "center",
        paddingBottom: 10,
        fontFamily: "ChangaOne",
        lineHeight: 55,
        paddingTop: 5
    },
    subTitle: {
        fontSize: 17,
        fontFamily: "PoppinsBold",
        fontWeight: "bold",
        textAlign: "center",
        paddingBottom: 10,
        lineHeight: 25,
    },
    text: {
        fontWeight: "bold",
    },
    card: {
        alignSelf: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        marginBottom: 10,
        position: "relative",
        marginTop: 50,
        marginBottom: 30,
        width: 500,        
        shadowColor:"black",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.1,
        shadowRadius: 16.0,
        elevation: 20,        
    },

    signIn: {
        alignSelf: "center",
        width: "100%",
    },
})