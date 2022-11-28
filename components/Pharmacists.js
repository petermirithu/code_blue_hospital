import {
    View,
    Text,
    Button,
    Modal,
    Input,
    Radio,
    HStack,
    useToast,
    Image
} from "native-base";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { useSelector, useDispatch } from "react-redux";
import Toaster from "./Toaster";
import { delete_user, register_user, update_user } from "../services/Authentication";
import Moment from 'moment';
import { get_pharmacists } from "../services/PharmacistService";
import { setPharmacists } from "../redux/PharmacistsSlice";
import { useAssets } from 'expo-asset';

export default function Pharmacists({ text }) {
    const toast = useToast();
    const dispatch = useDispatch();

    const [assets] = useAssets([
        require('../assets/animations/empty.gif'),
    ]);

    const [showModal, setShowModal] = useState(false);

    const formDataTemplate = {
        username: "", password: "", name: "", email: "",
        phone_no: "", date_of_birth: "", id: ""
    }

    const [formData, setFormData] = useState(formDataTemplate);

    const [statusRadio, setStatusRadio] = useState("");
    const [genderRadio, setGenderRadio] = useState("");
    const [modalState, setModalState] = useState("add");
    const [saveUpdateLoading, setSaveUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(null);

    const [tableData, setTableData] = useState([]);

    const { userProfile } = useSelector((state) => state.userProfile);
    const { pharmacists } = useSelector((state) => state.pharmacists);

    const tableHead = ['Number', 'Name', 'Email', 'Phone_no', "Gender", "Status"];

    const handleForm = (option, data) => {
        let currentState = { ...formData }
        if (option == "username") {
            currentState.username = data;
        }
        else if (option == "password") {
            currentState.password = data;
        }
        else if (option == "name") {
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
        setFormData(currentState);
    }

    const addPharmacist = () => {
        setModalState("add");
        setFormData(formDataTemplate);
        setGenderRadio("");
        setStatusRadio("");
        setShowModal(true);
    }

    const selectRecord = (rowData) => {
        if (userProfile.admin != true) {
            const toastId = "warningPermisisons";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Restricted!"} description={"You don't have permission to access more information"} status="warning" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
            return
        }
        setModalState("update");
        const selected = pharmacists[rowData[0] - 1]
        setStatusRadio(selected?.status);
        setGenderRadio(selected?.gender);
        setFormData({
            name: selected?.name,
            email: selected?.email,
            phone_no: selected?.phone_no,
            date_of_birth: selected?.date_of_birth,
            id: selected?.id
        })
        setShowModal(true);
    }

    const fetchPharmacists = async () => {
        await get_pharmacists().then(response => {
            dispatch(setPharmacists(response.data));
            formatTableData(response.data);
        }).catch(error => {
            const toastId = "errorLoading";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while loading pharmacists"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        });
        setSaveUpdateLoading(false);
        setDeleteLoading(false);
        setFormData(formDataTemplate);
        setGenderRadio("");
        setStatusRadio("");
        setShowModal(false);
    }

    const submitForm = async (option) => {
        setSaveUpdateLoading(true);
        if (option == "save") {
            const payload = {
                administrator_id: userProfile.id,
                username: formData.username,
                password: formData.password,
                name: formData.name,
                email: formData.email,
                phone_no: formData.phone_no,
                gender: genderRadio,
                status: statusRadio,
                date_of_birth: formData.date_of_birth,
                user_type: "pharmacist"
            }
            await register_user(payload).then(async response => {
                await fetchPharmacists();
                const toastId = "sucess";
                if (!toast.isActive(toastId)) {
                    toast.show({
                        placement: "top",
                        id: toastId,
                        render: () => <Toaster title={"Successfully created the pharmacist's account."} status="success" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
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
                status: statusRadio,
                date_of_birth: formData.date_of_birth,
                id: formData.id,
                user_type: "pharmacist",
            }
            await update_user(payload).then(async response => {
                await fetchPharmacists();
                const toastId = "sucess";
                if (!toast.isActive(toastId)) {
                    toast.show({
                        placement: "top",
                        id: toastId,
                        render: () => <Toaster title={"Successfully updated the pharmacist's account."} status="success" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
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


    const deletePharmacist = async () => {
        setDeleteLoading(true);
        await delete_user("pharmacist", formData.id).then(async response => {
            await fetchPharmacists();
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
            let payload = [counter, person?.name, person?.email, person?.phone_no, person?.gender, person?.status];
            tableData_.push(payload);
            counter++;
        }
        setTableData([]);
        setTableData(tableData_);
    }


    useEffect(() => {
        if (pageLoading == null) {
            setPageLoading(true);
            formatTableData(pharmacists);
            setPageLoading(false);
        }
    }, [showModal, formData, statusRadio, genderRadio, modalState, saveUpdateLoading, pageLoading, tableData, deleteLoading])

    if (pageLoading == null || pageLoading == true || !assets) {
        return (
            <View alignItems="center" justifyContent="center" flex="1" background="#f8f9fa">
                <Loader text={"Loading cards ..."}></Loader>
            </View>
        )
    }

    return (
        <>
            <Text style={styles.title}>Pharmacists</Text>
            {userProfile.admin == true ?
                <Button style={styles.add} width={100} onPress={() => addPharmacist()}>Add</Button>
                :
                <></>
            }

            <Table style={styles.table}>
                <Row data={tableHead} style={styles.tableData} textStyle={styles.headerText} />
                {
                    (tableData?.length > 0) ?
                        tableData.map((rowData, index) => (
                            <TouchableOpacity onPress={() => selectRecord(rowData)}>
                                <Row
                                    key={index}
                                    data={rowData}
                                    style={[styles.row, index % 2 && { backgroundColor: '#edf2f4' }]}
                                />
                            </TouchableOpacity>
                        ))
                        :
                        <View alignItems={"center"}>
                            <Image source={assets[0]} width={200} height={200}></Image>
                            <Text>No record for you</Text>
                        </View>
                }
            </Table>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} safeAreaTop={true} closeOnOverlayClick={false} animationPreset="slide" size={"xl"}>
                <Modal.Content>
                    <Modal.CloseButton />
                    {modalState == "add" ?
                        <Modal.Header>Add a Pharmacist</Modal.Header>
                        :
                        <>
                            {userProfile.admin == true ?
                                <Modal.Header>Update a Pharmacist</Modal.Header>
                                :
                                <Modal.Header>View a Pharmacist</Modal.Header>
                            }
                        </>
                    }
                    <Modal.Body padding={5}>
                        {modalState == "add" ?
                            <HStack space={3} marginBottom={5}>
                                <View width={260}>
                                    <Text>Username</Text>
                                    <Input key={"username"} variant="underlined" value={formData.username} placeholder="Create a username for login" w={"100%"} onChangeText={(val) => handleForm("username", val)} />
                                </View>
                                <View width={260}>
                                    <Text>Password</Text>
                                    <Input key={"password"} variant="underlined" value={formData.password} placeholder="Create a password for login" w={"100%"} onChangeText={(val) => handleForm("password", val)} />
                                </View>
                            </HStack>
                            :
                            <></>
                        }
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
                        <Text>Status</Text>
                        <Radio.Group name="status" key={"status"} value={statusRadio} onChange={val => {
                            setStatusRadio(val);
                        }} marginBottom={5}>
                            <HStack space={3}>
                                <Radio value="Permanent">
                                    Permanent
                                </Radio>
                                <Radio value="Internship">
                                    Internship
                                </Radio>
                            </HStack>
                        </Radio.Group>
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

                            {userProfile.admin == true ?
                                <>
                                    {modalState == "add" ?
                                        <Button width={(saveUpdateLoading == true) ? 120 : 100} isLoadingText={"Saving ..."} isLoading={saveUpdateLoading} isDisabled={saveUpdateLoading || deleteLoading} onPress={() => {
                                            submitForm("save");
                                        }}>
                                            Save
                                        </Button>
                                        :
                                        <>
                                            <Button width={(deleteLoading == true) ? 120 : 100} isDisabled={saveUpdateLoading || deleteLoading} isLoadingText={"Deleteing ..."} isLoading={deleteLoading} colorScheme="error" onPress={() => {
                                                deletePharmacist();
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
                                </>
                                :
                                <></>
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