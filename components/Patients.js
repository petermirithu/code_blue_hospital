import {
    View,
    Text,
    Button,
    Modal,
    Input,
    Radio,
    HStack,
    useToast,    
} from "native-base";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { useSelector, useDispatch } from "react-redux";
import Toaster from "./Toaster";
import { delete_user, update_user } from "../services/Authentication";
import Moment from 'moment';
import { add_patient, get_patients} from "../services/PatientService";
import { setPatients } from "../redux/PatientsSlice";

export default function Patients({ text }) {
    const toast = useToast();
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);

    const formDataTemplate = {
        name: "", email: "",
        phone_no: "",
        date_of_birth: "", id: "", weight: "", height: ""        
    }

    const [formData, setFormData] = useState(formDataTemplate);

    const [genderRadio, setGenderRadio] = useState("");    
    const [modalState, setModalState] = useState("add");
    const [saveUpdateLoading, setSaveUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(null);


    const [tableData, setTableData] = useState([]);

    const { patients } = useSelector((state) => state.patients);    

    const tableHead = ['Number', 'Name', 'Email', 'Phone_no', "Gender", "Joined On"];

    const handleForm = (option, data) => {
        let currentState = { ...formData }        
        if (option == "name") {
            currentState.name = data;
        }
        else if (option == "email") {
            currentState.email = data;
        }
        else if (option == "phone_no") {
            currentState.phone_no = data;
        }
        else if (option == "dob") {
            currentState.date_of_birth = data;
        }
        else if (option == "weight") {
            currentState.weight = data;
        }
        else if (option == "height") {
            currentState.height = data;
        }        
        setFormData(currentState);
    }

    const addPatient = () => {
        setModalState("add");
        setFormData(formDataTemplate);
        setGenderRadio("");        
        setShowModal(true);
    }

    const selectRecord = (rowData) => {
        setModalState("update");
        const selected = patients[rowData[0] - 1]
        setGenderRadio(selected?.gender);        
        setFormData({
            name: selected?.name,
            email: selected?.email,
            phone_no: selected?.phone_no,
            date_of_birth: selected?.date_of_birth,
            weight: selected?.weight,
            height: selected?.height,
            id: selected?.id
        })
        setShowModal(true);
    }

    const fetchPatients = async () => {
        await get_patients().then(response => {
            dispatch(setPatients(response.data));
            formatTableData(response.data);
        }).catch(error => {
            const toastId = "errorLoading";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while loading patients"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        });
        setSaveUpdateLoading(false);
        setDeleteLoading(false);
        setFormData(formDataTemplate);
        setGenderRadio("");        
        setShowModal(false);
    }

    const submitForm = async (option) => {
        setSaveUpdateLoading(true);
        if (option == "save") {
            const payload = {                
                name: formData.name,
                email: formData.email,
                phone_no: formData.phone_no,
                gender: genderRadio,
                date_of_birth: formData.date_of_birth,
                weight: formData.weight,
                height: formData.height,                
                user_type: "patient"
            }            

            await add_patient(payload).then(async response => {
                await fetchPatients();
                const toastId = "sucess";
                if (!toast.isActive(toastId)) {
                    toast.show({
                        placement: "top",
                        id: toastId,
                        render: () => <Toaster title={"Successfully created the patient's account."} status="success" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                    })
                }
            }).catch(error => {
                const toastId = "error";
                if (!toast.isActive(toastId)) {
                    toast.show({
                        placement: "top",
                        id: toastId,
                        render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while saving the account"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                    })
                }
                setSaveUpdateLoading(false);
                setShowModal(false);
            })
        }
        else {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone_no: formData.phone_no,
                gender: genderRadio,
                date_of_birth: formData.date_of_birth,
                weight: formData.weight,
                height: formData.height,                  
                id: formData.id,
                user_type: "patient",
            }
            await update_user(payload).then(async response => {
                await fetchPatients();
                const toastId = "sucess";
                if (!toast.isActive(toastId)) {
                    toast.show({
                        placement: "top",
                        id: toastId,
                        render: () => <Toaster title={"Successfully updated the patient's account."} status="success" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                    })
                }
            }).catch(error => {
                const toastId = "error";
                if (!toast.isActive(toastId)) {
                    toast.show({
                        placement: "top",
                        id: toastId,
                        render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while updating the account"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                    })
                }
                setSaveUpdateLoading(false);
                setShowModal(false);
            })
        }
    }


    const deletePatient = async () => {
        setDeleteLoading(true);
        await delete_user("patient", formData.id).then(async response => {
            await fetchPatients();
            const toastId = "success";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Successfully deleted that account."} status="success" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        }).catch(error => {
            const toastId = "error";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while deleting that account"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
            setDeleteLoading(false);
            setSaveUpdateLoading(false);
            setShowModal(false);
        })
    }

    const formatTableData = (newData) => {
        let counter = 1;
        let tableData_ = []
        for (let person of newData) {
            let payload = [counter, person?.name, person?.email, person?.phone_no, person?.gender, Moment(person?.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a")];
            tableData_.push(payload);
            counter++;
        }
        setTableData([]);
        setTableData(tableData_);
    }


    useEffect(() => {
        if (pageLoading == null) {
            setPageLoading(true);
            formatTableData(patients);
            setPageLoading(false);
        }
    }, [showModal, formData, genderRadio, modalState, saveUpdateLoading, pageLoading, tableData, deleteLoading])

    if (pageLoading == null || pageLoading == true) {
        return (
            <View alignItems="center" justifyContent="center" flex="1" background="#f8f9fa">
                <Loader text={"Loading cards ..."}></Loader>
            </View>
        )
    }

    return (
        <>
            <Text style={styles.title}>Patients</Text>
            <Button style={styles.add} width={100} onPress={() => addPatient()}>Add</Button>

            <Table style={styles.table}>
                <Row data={tableHead} style={styles.tableData} textStyle={styles.headerText} />
                {
                    tableData.map((rowData, index) => (
                        <TouchableOpacity onPress={() => selectRecord(rowData)}>
                            <Row
                                key={index}
                                data={rowData}
                                style={[styles.row, index % 2 && { backgroundColor: '#edf2f4' }]}
                            />
                        </TouchableOpacity>
                    ))
                }
            </Table>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} safeAreaTop={true} closeOnOverlayClick={false} animationPreset="slide" size={"xl"}>
                <Modal.Content>
                    <Modal.CloseButton />
                    {modalState == "add" ?
                        <Modal.Header>Add a Patient</Modal.Header>
                        :
                        <Modal.Header>Update a Patient</Modal.Header>
                    }
                    <Modal.Body padding={5}>
                        <Text>Name</Text>
                        <Input key={"name"} variant="underlined" value={formData.name} placeholder="Enter their full name" w="100%" marginBottom={5} onChangeText={(val) => handleForm("name", val)} />
                        <Text>Email</Text>
                        <Input key={"email"} variant="underlined" value={formData.email} placeholder="Enter their email" w="100%" marginBottom={5} onChangeText={(val) => handleForm("email", val)} />
                        <HStack space={3} marginBottom={5}>
                            <View width={260}>
                                <Text>Phone Number</Text>
                                <Input key={"phone_no"} variant="underlined" value={formData.phone_no} placeholder="Should be atleast 10 characters" w="100%" onChangeText={(val) => handleForm("phone_no", val)} />
                            </View>
                            <View width={260}>
                                <Text>Gender</Text>
                                <Radio.Group name="gender" key="gender" value={genderRadio} onChange={val => {
                                    setGenderRadio(val);
                                }}>
                                    <HStack space={3}>
                                        <Radio value="Male">
                                            Male
                                        </Radio>
                                        <Radio value="Female">
                                            Female
                                        </Radio>
                                    </HStack>
                                </Radio.Group>
                            </View>
                        </HStack>                        
                        <HStack space={3}>
                            <View width={260}>
                                <Text>Weight in kg</Text>
                                <Input key={"weight"} variant="underlined" value={formData.weight} placeholder="What their weight?" w="100%" marginBottom={5} onChangeText={(val) => handleForm("weight", val)} />
                            </View>
                            <View width={260}>
                                <Text>Height in cm</Text>
                                <Input key={"height"} variant="underlined" value={formData.height} placeholder="What their height?" w="100%" marginBottom={5} onChangeText={(val) => handleForm("height", val)} />
                            </View>
                        </HStack> 
                        <Text>Date of Birth</Text>
                        <Input key={"dob"} variant="underlined" value={formData.date_of_birth} placeholder="When were they born?" w="100%" marginBottom={5} onChangeText={(val) => handleForm("dob", val)} />                                                                                             
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="outline" isDisabled={saveUpdateLoading || deleteLoading} width={100} colorScheme="bluegray" onPress={() => {
                                setShowModal(false);
                            }}>
                                Cancel
                            </Button>

                            {modalState == "add" ?
                                <Button width={(saveUpdateLoading == true) ? 120 : 100} isLoadingText={"Saving ..."} isLoading={saveUpdateLoading} isDisabled={saveUpdateLoading || deleteLoading} onPress={() => {
                                    submitForm("save");
                                }}>
                                    Save
                                </Button>
                                :
                                <>
                                    <Button width={(deleteLoading == true) ? 120 : 100} isDisabled={saveUpdateLoading || deleteLoading} isLoadingText={"Deleteing ..."} isLoading={deleteLoading} colorScheme="error" onPress={() => {
                                        deletePatient();
                                    }}>
                                        Delete
                                    </Button>
                                    <Button width={(saveUpdateLoading == true) ? 120 : 100} isLoadingText={"Updating ..."} isLoading={saveUpdateLoading} isDisabled={saveUpdateLoading || deleteLoading} onPress={() => {
                                        submitForm("update");
                                    }}>
                                        Update
                                    </Button>
                                </>
                            }
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 50,
        paddingBottom: 20,
        lineHeight: 55,
        color: "#393A35",
        fontFamily: "ChangaOne"
    },
    table: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.1,
        shadowRadius: 16.0,
        elevation: 20,

    },
    tableHead: {
        height: 50,
        backgroundColor: '#f1f8ff',
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 18
    },
    row: { height: 40, backgroundColor: '#fff' },
    add: {
        position: "absolute",
        top: 40,
        right: 20,
    }
})