import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Flex,
    Image,
    HStack,
    Button,
    Box
} from "native-base";
import { useAssets } from 'expo-asset';
import Loader from "../components/Loader";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { Fontisto } from '@expo/vector-icons';
import Dashboard from "../components/Dashboard";
import Doctors from "../components/Doctors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigateReset } from "../services/RootNavigation";
import { Badge } from 'native-base';
import Patients from "../components/Patients";
import Admissions from "../components/Admissions";

export default function NurseHome({ navigation }) {

    const [assets] = useAssets([
        require('../assets/logo.png'),
    ]);

    const { userProfile } = useSelector((state) => state.userProfile);
    const [section, setSection] = useState("dashboard");

    const signOut = async () => {
        const keys = await AsyncStorage.getAllKeys()
        await AsyncStorage.multiRemove(keys)
        navigateReset("Authorise");
    }

    useEffect(() => {

    }, [section])

    if (!assets) {
        return (
            <View alignItems="center" justifyContent="center" flex="1" background="#f8f9fa">
                <Loader text={"Loading"}></Loader>
            </View>
        )
    }

    return (
        <Flex direction="row" style={{ overflow: "hidden" }} flex={1}>
            <View background={"#1b263b"} width={"20%"} height={"100%"} position={"relative"}>
                <Image source={assets[0]} alt="Loader" style={{ width: 150, height: 150 }} />
                <View paddingLeft={5}>
                    <TouchableOpacity onPress={() => setSection("dashboard")}>
                        <HStack space={3} marginTop={3} marginBottom={3}>
                            <MaterialIcons name="dashboard" size={24} color="#c5d5ee" />
                            <Text style={styles.link}>Dashboard</Text>
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSection("doctors")}>
                        <HStack space={3} marginTop={3} marginBottom={3}>
                            <Fontisto name="doctor" size={24} color="#c5d5ee" />
                            <Text style={styles.link}>Doctors</Text>
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSection("patients")}>
                        <HStack space={3} marginTop={3} marginBottom={3}>
                            <Fontisto name="bed-patient" size={24} color="#c5d5ee" />
                            <Text style={styles.link}>Patients</Text>
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSection("admissions")}>
                        <HStack space={3} marginTop={3} marginBottom={3}>
                            <FontAwesome name="book" size={24} color="#c5d5ee" />
                            <Text style={styles.link}>Admissions</Text>
                        </HStack>
                    </TouchableOpacity>
                </View>
                <Button onPress={() => signOut()} colorScheme={"error"} position={"absolute"} bottom={5} left={16} width={120}>Sign Out</Button>
            </View>
            <View width={"80%"} background={"#e9ecef"}>
                <HStack px="3" py="3" style={styles.navbar}>
                    <HStack alignItems="center"></HStack>
                    <HStack>
                        <Badge colorScheme="indigo" variant={"solid"} marginRight={5}>Nurse</Badge>
                        <Box alignItems="flex-start">
                            <HStack space={3} marginRight={5}>
                                <FontAwesome name="user" size={24} color="black" />
                                <Text fontWeight={"bold"}>Logged in as:- <Text textTransform="capitalize" fontWeight={"medium"}> {userProfile.username}</Text></Text>
                            </HStack>
                        </Box>
                    </HStack>
                </HStack>

                <View paddingTop={5} paddingLeft={5}>
                    {section == "dashboard" ?
                        <Dashboard></Dashboard>
                        :
                        <></>
                    }
                    {section == "doctors" ?
                        <Doctors></Doctors>
                        :
                        <></>
                    }
                    {section == "patients" ?
                        <Patients></Patients>
                        :
                        <></>
                    }
                    {section == "admissions" ?
                        <Admissions></Admissions>
                        :
                        <></>
                    }

                </View>
            </View>
        </Flex>
    )
}

const styles = StyleSheet.create({
    navbar: {
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#fff",
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.1,
        shadowRadius: 16.0,
        elevation: 20,
    },
    link: {
        fontWeight: "bold",
        color: "white"
    }
})