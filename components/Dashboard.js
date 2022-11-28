import {
    View,
    Text,    
    Flex,
    Image,
    HStack,
    useToast,   
} from "native-base";
import { useEffect, useState } from "react";
import { useAssets } from 'expo-asset';
import Loader from "./Loader";
import { StyleSheet } from 'react-native';
import {get_patients} from "../services/PatientService";
import Toaster from "./Toaster";
import { useDispatch, useSelector } from "react-redux";
import {setPatients} from "../redux/PatientsSlice";
import { get_doctors } from "../services/DoctorService";
import { setDoctors } from "../redux/DoctorsSlice";
import { get_nurses } from "../services/NurseService";
import { setNurses } from "../redux/NursesSlice";
import { get_pharmacists } from "../services/PharmacistService";
import { setPharmacists } from "../redux/PharmacistsSlice";
import { get_revenue } from "../services/PaymentService";
import { get_admissions } from "../services/AdmissionsService";
import { setAdmisisons } from "../redux/AdmissionsSlice";

export default function Dashboard({ text }) {
    const toast = useToast();
    const dispatch = useDispatch();  

    const [assets] = useAssets([
        require("../assets/animations/patient.gif"),
        require("../assets/animations/pharmacist.gif"),
        require("../assets/animations/doctors.gif"),
        require("../assets/animations/nurse.gif"),
        require("../assets/animations/revenue.gif"),
        require("../assets/animations/admission.gif"),
    ]);

    const [loaded, setLoaded] = useState(null);
    const [revenue, setRevenue] = useState(0);

    const { patients } = useSelector((state) => state.patients);
    const { doctors } = useSelector((state) => state.doctors);
    const { pharmacists } = useSelector((state) => state.pharmacists);
    const { nurses } = useSelector((state) => state.nurses);
    const { userProfile } = useSelector((state) => state.userProfile);
    const { admissions } = useSelector((state) => state.admissions);


    const loadData= async () => {
        await get_patients().then(response=>{                        
            dispatch(setPatients(response.data));                     
        }).catch(error=>{
            const toastId = "errorLoadingPatients";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while loading patients"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }                        
        });
        await get_doctors().then(response=>{            
            dispatch(setDoctors(response.data));                     
        }).catch(error=>{
            const toastId = "errorLoadingDoctors";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while loading doctors"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }                        
        });
        await get_nurses().then(response=>{            
            dispatch(setNurses(response.data));                     
        }).catch(error=>{
            const toastId = "errorLoadingNurses";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while loading nurses"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }                        
        });
        await get_pharmacists().then(response=>{            
            dispatch(setPharmacists(response.data));                     
        }).catch(error=>{
            const toastId = "errorLoadingPharmacists";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while loading pharmacists"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }                        
        });
        await get_admissions().then(response => {
            dispatch(setAdmisisons(response.data));            
        }).catch(error => {
            const toastId = "errorLoading";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while loading admissions"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        });
        if(userProfile.admin==true){
            await get_revenue().then(response=>{            
                setRevenue(response.data)
            }).catch(error=>{
                const toastId = "errorLoadingRevenue";
                if (!toast.isActive(toastId)) {
                    toast.show({
                        placement: "top",
                        id: toastId,
                        render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while loading revenue"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                    })
                }                        
            });    
        }
        setLoaded(true);
    }

    useEffect(() => {
        if(loaded==null){
            setLoaded(false);
            loadData();
        }           
        
        console.log(admissions);
        
    }, [loaded, revenue])

    if (!assets || (loaded==false || loaded==null)) {
        return (
            <View alignItems="center" justifyContent="center" flex="1" background="#f8f9fa">
                <Loader text={"Loading cards ..."}></Loader>
            </View>
        )
    }

    return (
        <>
            <Text style={styles.title}>Dashboard</Text>

            <Flex direction="row">
                <View style={styles.card} marginRight={10} width={300}>
                    <HStack space={3}>
                        <Image source={assets[0]} style={styles.image}></Image>
                        <Flex direction="column" marginTop={10}>
                            <Text fontStyle={"italic"}>No of Patients</Text>
                            <Text style={styles.number} color={"amber.500"}>{patients?.length}</Text>
                        </Flex>
                    </HStack>
                </View>
                <View style={styles.card} marginRight={10}>
                    <HStack space={3}>
                        <Image source={assets[1]} style={styles.image}></Image>
                        <Flex direction="column" marginTop={10}>
                            <Text fontStyle={"italic"}>No of Pharmacists</Text>
                            <Text style={styles.number} color={"primary.500"}>{pharmacists?.length}</Text>
                        </Flex>
                    </HStack>
                </View>
                <View style={styles.card}>
                    <HStack space={3}>
                        <Image source={assets[2]} style={styles.image}></Image>
                        <Flex direction="column" marginTop={10}>
                            <Text fontStyle={"italic"}>No of Doctors</Text>
                            <Text style={styles.number} color={"info.500"}>{doctors?.length}</Text>
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
                            <Text style={styles.number} color={"#38a3a5"}>{nurses?.length}</Text>
                        </Flex>
                    </HStack>
                </View>                
                <View style={styles.card} marginRight={10} display={(userProfile.admin==true)?"block":"none"}>
                    <HStack space={3}>
                        <Image source={assets[4]} style={styles.image}></Image>
                        <Flex direction="column" marginTop={10}>
                            <Text fontStyle={"italic"}>Revenue Raised</Text>
                            <Text style={styles.number} color={"#ffc300"}>ksh {revenue}</Text>
                        </Flex>
                    </HStack>
                </View>
                <View style={styles.card} marginRight={10} display={(userProfile.admin!=true)?"block":"none"}>
                    <HStack space={3}>
                        <Image source={assets[5]} style={styles.image}></Image>
                        <Flex direction="column" marginTop={10}>
                            <Text fontStyle={"italic"}>No of Admissions</Text>
                            <Text style={styles.number} color={"#4cc9f0"}>{admissions?.length}</Text>
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
        padding:10,  
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.1,
        shadowRadius: 16.0,
        elevation: 20,   
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