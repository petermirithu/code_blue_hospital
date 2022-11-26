import {
    View,
    Text,    
    Flex,
    Image,
    HStack,
} from "native-base";
import { useEffect } from "react";
import { useAssets } from 'expo-asset';
import Loader from "./Loader";
import { StyleSheet } from 'react-native';


export default function Pharmacists({ text }) {

    const [assets] = useAssets([
        require("../assets/animations/patient.gif"),        
    ]);

    useEffect(() => {

    }, [])

    if (!assets) {
        return (
            <View alignItems="center" justifyContent="center" flex="1" background="#f8f9fa">
                <Loader text={"Loading cards ..."}></Loader>
            </View>
        )
    }

    return (
        <>
            <Text style={styles.title}>Pharmacists</Text>

            <Flex direction="row">
                <View style={styles.card} marginRight={10} width={300}>
                    <HStack space={3}>
                        <Image source={assets[0]} style={styles.image}></Image>
                        <Flex direction="column" marginTop={10}>
                            <Text fontStyle={"italic"}>No of Patients</Text>
                            <Text style={styles.number} color={"amber.500"}>100</Text>
                        </Flex>
                    </HStack>
                </View>
                <View style={styles.card} marginRight={10}>
                    <HStack space={3}>
                        <Image source={assets[1]} style={styles.image}></Image>
                        <Flex direction="column" marginTop={10}>
                            <Text fontStyle={"italic"}>No of Pharmacists</Text>
                            <Text style={styles.number} color={"primary.500"}>100</Text>
                        </Flex>
                    </HStack>
                </View>
                <View style={styles.card}>
                    <HStack space={3}>
                        <Image source={assets[2]} style={styles.image}></Image>
                        <Flex direction="column" marginTop={10}>
                            <Text fontStyle={"italic"}>No of Doctors</Text>
                            <Text style={styles.number} color={"info.500"}>100</Text>
                        </Flex>
                    </HStack>
                </View>
            </Flex>
            <Flex direction="row" marginTop={10}>
                <View style={styles.card} marginRight={10} width={300}>
                    <HStack space={3}>
                        <Image source={assets[3]} style={styles.image}></Image>
                        <Flex direction="column" marginTop={10}>
                            <Text fontStyle={"italic"}>No of Nurses</Text>
                            <Text style={styles.number} color={"#38a3a5"}>100</Text>
                        </Flex>
                    </HStack>
                </View>
                <View style={styles.card} marginRight={10}>
                    <HStack space={3}>
                        <Image source={assets[4]} style={styles.image}></Image>
                        <Flex direction="column" marginTop={10}>
                            <Text fontStyle={"italic"}>Revenue Raised</Text>
                            <Text style={styles.number} color={"#ffc300"}>ksh 1200</Text>
                        </Flex>
                    </HStack>
                </View>
            </Flex>
        </>
    )
}   

const styles = StyleSheet.create({
    title:{                
        fontSize: 50,        
        paddingBottom: 20,        
        lineHeight:55,
        color:"#393A35",
        fontFamily:"ChangaOne"
    },
    card:{
        borderRadius:10, 
        backgroundColor:"#fff",                
        padding:10        
    },
    image:{        
        width:150,
        height:150,        
    },
    number:{
        fontWeight:"bold",
        fontSize:35
    }
})