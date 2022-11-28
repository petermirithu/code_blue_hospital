import {
    View,
    Text,    
    useToast,
    Image
} from "native-base";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { StyleSheet } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import Toaster from "./Toaster";
import Moment from 'moment';
import { useAssets } from 'expo-asset';
import { get_payments } from "../services/PaymentService";

export default function Payments({ text }) {
    const toast = useToast();    

    const [assets] = useAssets([
        require('../assets/animations/empty.gif'),
    ]);            


    const [pageLoading, setPageLoading] = useState(null);
    
    const [tableData, setTableData] = useState([]);    

    const tableHead = ['Number', 'Admission Id', 'Pharmacist Id', 'Amount Paid', "Payment Made On"];
      

    const formatTableData = async (newData) => {
        await get_payments().then(response => {
            let counter = 1;
            let tableData_ = []
            for (let record of response.data) {
                let payload = [counter, record?.admission_id, record?.pharmacist_id, record?.amount_paid, Moment(record?.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a")];
                tableData_.push(payload);
                counter++;
            }
            setTableData([]);
            setTableData(tableData_);
            
        }).catch(error => {
            const toastId = "errorLoading";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title={"Oh Snap! Something went wrong."} description={"An error occured while loading payments"} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        });
        setPageLoading(false);
    }


    useEffect(() => {
        if (pageLoading == null) {
            setPageLoading(true);
            formatTableData();            
        }
    }, [pageLoading, tableData])

    if (pageLoading == null || pageLoading == true || !assets) {
        return (
            <View alignItems="center" justifyContent="center" flex="1" background="#f8f9fa">
                <Loader text={"Loading cards ..."}></Loader>
            </View>
        )
    }

    return (
        <>
            <Text style={styles.title}>Payments</Text>

            <Table style={styles.table}>
                <Row data={tableHead} style={styles.tableData} textStyle={styles.headerText} />
                {
                    (tableData?.length > 0) ?
                        tableData.map((rowData, index) => (                           
                            <Row
                                key={index}
                                data={rowData}
                                style={[styles.row, index % 2 && { backgroundColor: '#edf2f4' }]}
                            />                            
                        ))
                        :
                        <View alignItems={"center"}>
                            <Image source={assets[0]} width={200} height={200}></Image>
                            <Text>No record for you</Text>
                        </View>
                }
            </Table>
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