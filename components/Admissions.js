import {
    View,
    Text,
    Button,
    Modal,
    Input,
    Radio,
    HStack,
    useToast,
    TextArea,
    Select,
    Image
} from "native-base";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { useSelector, useDispatch } from "react-redux";
import Toaster from "./Toaster";
import Moment from 'moment';
import { add_admissions, get_admissions, update_admissions, delete_admission } from "../services/AdmissionsService";
import { setAdmisisons } from "../redux/AdmissionsSlice";
import { useAssets } from 'expo-asset';
import { add_payment } from "../services/PaymentService";

export default function Admissions({ text }) {
    const toast = useToast();
    const dispatch = useDispatch();

    const [assets] = useAssets([
        require('../assets/animations/empty.gif'),
    ]);

    const [showModal, setShowModal] = useState(false);

    const formDataTemplate = {
        symptoms: "",
        id: "",
        prescription: "",
        diagnosis: "",
        notes: "",
        fee: 0,
        drugs: 0,
    }

    const [formData, setFormData] = useState(formDataTemplate);

    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedPatient, setSelectedPatient] = useState("");

    const [modalState, setModalState] = useState("add");
    const [saveUpdateLoading, setSaveUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(null);
    const [total, setTotal] = useState(0);
    const [paid, setPaid] = useState(false);


    const [tableData, setTableData] = useState([]);

    const { userProfile } = useSelector((state) => state.userProfile);
    const { patients } = useSelector((state) => state.patients);
    const { doctors } = useSelector((state) => state.doctors);
    const { admissions } = useSelector((state) => state.admissions);

    const tableHead = ['Number', 'Patient Name', 'Doctor Name', 'Nurse Name', "Treated", "Created On"];

    const handleForm = (option, data) => {
        let currentState = { ...formData }
        if (option == "symptoms") {
            currentState.symptoms = data;
        }
        else if (option == "prescription") {
            currentState.prescription = data;
        }
        else if (option == "diagnosis") {
            currentState.diagnosis = data;
        }
        else if (option == "notes") {
            currentState.notes = data;
        }
        else if (option == "fee") {
            currentState.fee = data;
        }
        else if (option == "drugs") {
            currentState.drugs = data;
        }
        setFormData(currentState);

        const cost = parseInt(currentState.fee) + parseInt(currentState.drugs);
        setTotal(cost);
    }

    const admitPatient = () => {
        setModalState("add");
        setFormData(formDataTemplate);
        setSelectedDoctor("");
        setSelectedPatient("");
        setShowModal(true);
    }

    const recordPayment = () => {
        let preForm = { ...formData };
        preForm.fee = doctors.find(x => x?.id == selectedDoctor)?.fee
        setTotal(preForm.fee);
        setFormData(preForm);
        setModalState("recordPayment");
    }

    const submitPayment = async () => {
        setSaveUpdateLoading(true);
        const payload = {
            amount_paid: total,
            pharmacist_id: userProfile?.id,
            admission_id: formData?.id,
        }
        await add_payment(payload).then(async response => {
            await fetchAdmissions();
            const toastId = "sucess";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Successfully recorded the payment."} status="success" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        }).catch(error => {
            const toastId = "error";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while saving the data"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
            setSaveUpdateLoading(false);
            setShowModal(false);
        })
    }

    const selectRecord = (rowData) => {
        if (userProfile.nurse != true && userProfile.doctor != true && userProfile?.pharmacist != true) {
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
        const selected = admissions?.find(x=>Moment(x?.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a")==rowData[5])        
        setPaid(selected?.treated);
        if((userProfile.nurse == true || userProfile.doctor == true) && selected?.treated==true){
            const toastId = "warningPermisisons";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Can't edit this record"} description={"No modifications are allowed after a Patient is treated"} status="warning" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
            return
        }
        setSelectedDoctor(selected?.doctor?.id);
        setSelectedPatient(selected?.patient?.id);        
        setFormData({
            symptoms: selected?.symptoms,
            id: selected?.id,
            prescription: selected?.prescription||"",
            diagnosis: selected?.diagnosis||"",
            notes: selected?.notes||"",
        })
        setShowModal(true);
    }

    const fetchAdmissions = async () => {
        await get_admissions().then(response => {
            dispatch(setAdmisisons(response.data));
            formatTableData(response.data);
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
        setSaveUpdateLoading(false);
        setDeleteLoading(false);
        setFormData(formDataTemplate);
        setSelectedDoctor("");
        setSelectedPatient("");
        setShowModal(false);
    }

    const submitForm = async (option) => {
        setSaveUpdateLoading(true);
        if (option == "save") {
            const payload = {
                nurse_id: userProfile.id,
                doctor_id: selectedDoctor,
                patient_id: selectedPatient,
                symptoms: formData.symptoms,
            }
            await add_admissions(payload).then(async response => {
                await fetchAdmissions();
                const toastId = "sucess";
                if (!toast.isActive(toastId)) {
                    toast.show({
                        placement: "top",
                        id: toastId,
                        render: () => <Toaster title={"Successfully admitted the patient."} status="success" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                    })
                }
            }).catch(error => {
                const toastId = "error";
                if (!toast.isActive(toastId)) {
                    toast.show({
                        placement: "top",
                        id: toastId,
                        render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while saving the data"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                    })
                }
                setSaveUpdateLoading(false);
                setShowModal(false);
            })
        }
        else {
            const payload = {
                doctor_id: selectedDoctor,
                patient_id: selectedPatient,
                symptoms: formData.symptoms,
                prescription: formData.prescription,
                diagnosis: formData.diagnosis,
                notes: formData.notes,
                admission_id: formData.id,
            }
            await update_admissions(payload).then(async response => {
                await fetchAdmissions();
                const toastId = "sucess";
                if (!toast.isActive(toastId)) {
                    toast.show({
                        placement: "top",
                        id: toastId,
                        render: () => <Toaster title={"Successfully updated the record."} status="success" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                    })
                }
            }).catch(error => {
                const toastId = "error";
                if (!toast.isActive(toastId)) {
                    toast.show({
                        placement: "top",
                        id: toastId,
                        render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while updating the record"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                    })
                }
                setSaveUpdateLoading(false);
                setShowModal(false);
            })
        }
    }


    const deleteAdmission = async () => {
        setDeleteLoading(true);
        await delete_admission(formData.id).then(async response => {
            await fetchAdmissions();
            const toastId = "success";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Successfully deleted that record."} status="success" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        }).catch(error => {
            const toastId = "error";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while deleting that record"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
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

        for (let record of newData) {
            if (userProfile?.doctor == true && record?.doctor?.id == userProfile?.id) {
                let payload = [counter, record?.patient?.name, record?.doctor?.name, record?.nurse?.name, record?.treated.toString(), Moment(record?.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a")];
                tableData_.push(payload);
                counter++;
            }
            else if (userProfile?.doctor != true) {
                let payload = [counter, record?.patient?.name, record?.doctor?.name, record?.nurse?.name, record?.treated.toString(), Moment(record?.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a")];
                tableData_.push(payload);
                counter++;
            }
        }
        setTableData([]);
        setTableData(tableData_);
    }


    useEffect(() => {
        if (pageLoading == null) {
            setPageLoading(true);
            formatTableData(admissions);
            setPageLoading(false);
        }
    }, [showModal, formData, modalState, paid, saveUpdateLoading, total, pageLoading, tableData, deleteLoading, selectedDoctor, selectedPatient])

    if (pageLoading == null || pageLoading == true || !assets) {
        return (
            <View alignItems="center" justifyContent="center" flex="1" background="#f8f9fa">
                <Loader text={"Loading cards ..."}></Loader>
            </View>
        )
    }

    return (
        <>
            {userProfile.doctor == true || userProfile?.pharmacist == true ?
                <Text style={styles.title}>Medical Records</Text>
                :
                <Text style={styles.title}>Admissions</Text>
            }


            {userProfile.nurse == true ?
                <Button style={styles.add} width={100} onPress={() => admitPatient()}>Admit</Button>
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
                        <Modal.Header>Admit a Patient</Modal.Header>
                        :
                        <>
                            {modalState == "update" ?
                                <>
                                    {userProfile.doctor == true ?
                                        <Modal.Header>Update Medical Record</Modal.Header>
                                        :
                                        <>
                                            {userProfile?.pharmacist == true ?
                                                <Modal.Header>View Medical Record</Modal.Header>
                                                :
                                                <Modal.Header>Update an Admission</Modal.Header>
                                            }
                                        </>
                                    }
                                </>
                                :
                                <Modal.Header>Record Payment</Modal.Header>
                            }
                        </>

                    }
                    <Modal.Body padding={5}>
                        {modalState == "recordPayment" ?
                            <>
                                <Text>Doctor Fee in ksh</Text>
                                <Input key={"fee"} variant="underlined" value={formData.fee} w="100%" marginBottom={5} isDisabled={true} />

                                <Text>Enter drug costs in ksh</Text>
                                <Input key={"drugs"} variant="underlined" value={formData.drugs} placeholder="How much do the drugs cost?" w="100%" marginBottom={5} onChangeText={(val) => handleForm("drugs", val)} />

                                <Text fontWeight={"bold"}>Total Cost</Text>
                                <Text color={"teal.500"}>ksh {total}</Text>
                            </>
                            :
                            <>
                                <Text>Select a patient</Text>
                                <Select variant="underlined" marginBottom={5} selectedValue={selectedPatient} width={"100%"} placeholder="Pick a patient to book" mt={1} onValueChange={val => setSelectedPatient(val)} isDisabled={userProfile?.nurse != true}>
                                    {
                                        patients.map((patientData, index) => (
                                            <Select.Item label={patientData.name} value={patientData.id} />
                                        ))
                                    }
                                </Select>
                                {userProfile?.doctor != true ?
                                    <>
                                        <Text>Select a Doctor</Text>
                                        <Select variant="underlined" marginBottom={5} selectedValue={selectedDoctor} width={"100%"} placeholder="Assign a doctor to attend to the patient" mt={1} onValueChange={val => setSelectedDoctor(val)} isDisabled={userProfile?.nurse != true}>
                                            {
                                                doctors.map((doctorData, index) => (
                                                    <Select.Item label={doctorData.name + " - " + doctorData.specialization} value={doctorData.id} />
                                                ))
                                            }
                                        </Select>
                                    </>
                                    :
                                    <></>
                                }

                                <Text>Symptoms</Text>
                                <TextArea h={20} isDisabled={userProfile?.pharmacist} key={"symptoms"} variant="underlined" value={formData.symptoms} placeholder="What symptopms does the patient have?" w="100%" marginBottom={5} onChangeText={(val) => handleForm("symptoms", val)} />

                                {userProfile?.doctor == true || userProfile?.pharmacist == true ?
                                    <>
                                        <Text>Diagnosis</Text>
                                        <TextArea h={20} isDisabled={userProfile?.pharmacist} key={"diagnosis"} variant="underlined" value={formData.diagnosis} placeholder="The patient was diagnosed with?" w="100%" marginBottom={5} onChangeText={(val) => handleForm("diagnosis", val)} />

                                        <Text>Notes</Text>
                                        <TextArea h={20} isDisabled={userProfile?.pharmacist} key={"notes"} variant="underlined" value={formData.notes} placeholder="Write additional notes?" w="100%" marginBottom={5} onChangeText={(val) => handleForm("notes", val)} />

                                        <Text>Prescription</Text>
                                        <TextArea h={20} isDisabled={userProfile?.pharmacist} key={"prescription"} variant="underlined" value={formData.prescription} placeholder="What drugs should be given to the patient?" w="100%" marginBottom={5} onChangeText={(val) => handleForm("prescription", val)} />
                                    </>
                                    :
                                    <></>
                                }

                            </>
                        }

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
                                    {userProfile.nurse == true ?
                                        <Button width={(deleteLoading == true) ? 120 : 100} isDisabled={saveUpdateLoading || deleteLoading} isLoadingText={"Deleteing ..."} isLoading={deleteLoading} colorScheme="error" onPress={() => {
                                            deleteAdmission();
                                        }}>
                                            Delete
                                        </Button>
                                        :
                                        <></>
                                    }
                                    {userProfile?.pharmacist != true ?
                                        <Button width={(saveUpdateLoading == true) ? 120 : 100} isLoadingText={"Updating ..."} isLoading={saveUpdateLoading} isDisabled={saveUpdateLoading || deleteLoading} onPress={() => {
                                            submitForm("update");
                                        }}>
                                            Update
                                        </Button>
                                        :
                                        <>

                                            {modalState == "recordPayment" ?
                                                <Button width={(saveUpdateLoading == true) ? 200 : 150} isLoadingText={"Submitting ..."} isLoading={saveUpdateLoading} isDisabled={saveUpdateLoading || deleteLoading} onPress={() => {
                                                    submitPayment();
                                                }}>
                                                    Submit Payment
                                                </Button>
                                                :
                                                <Button width={(saveUpdateLoading == true) ? 200 : 150} 
                                                    isDisabled={saveUpdateLoading || deleteLoading || paid == true ||
                                                        formData?.diagnosis?.length==0 || formData?.prescription?.length==0 || formData?.notes?.length==0} onPress={() => {
                                                    recordPayment("recordPayment");
                                                }}>
                                                    Record Payment
                                                </Button>
                                            }
                                        </>

                                    }
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