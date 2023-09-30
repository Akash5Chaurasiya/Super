import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Modal, Image, RefreshControl, } from 'react-native'
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import axios from 'axios'
import { ImageIndex } from '../../assets/AssetIndex'
import { Picker } from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather'
import Snackbar from 'react-native-snackbar'


const ApprovalLogs = () => {
    const [data, setData] = useState<any>([]);
    const [pendingdata, setPendingdata] = useState<any>([]);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Approved');

    const handleOpenButtonPress = (imageUrl: any) => {
        console.log('im from here img', imageUrl);
        setSelectedImageUrl(imageUrl);
        setIsModalVisible(!isModalVisible);
    };


    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNoData();
        setRefreshing(false);
    };
    const fetchNoData = async () => {
        const currentDate = new Date();


        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        try {
            const response = await axios.get(`https://chawlacomponents.com/api/v2/attendance/ownApproved?date=${formattedDate}`);
            const data = response.data.data;
            console.log('datale', data)
            setData(data);
            const pendingResponse = await axios.get(`https://chawlacomponents.com/api/v2/attendance/employeeUnderMe`)
            const pendingdata = pendingResponse.data.attendance;
            const pendingData = pendingdata.filter((e:any) => e.status === "pending");
            console.log('pendinglogs', pendingData.length)

            setPendingdata(pendingData)


        }
        catch (err) {
            console.error('Error fetching data:', err);
        }
    }

    const handleReject = async ({id, PunchIn, date}:any) =>{
        console.log("reject data", id, PunchIn, date)
        const approveUrl = `https://chawlacomponents.com/api/v2/attendance/approveAttendance`;
        try{
            const requestData = {
                employeeId: id,
                status: "rejected", 
                punchInTime: PunchIn,
                date: date,
            };
            console.log('Data of approved', requestData);
            const response = await axios.patch(approveUrl, requestData);
            console.log('calling after rejected ', response)
            // Alert.alert('approved successfully');
            Snackbar.show({
                text: 'सफलतापूर्वक अस्वीकृत',
                backgroundColor: 'green',
                duration: 4000,
            });
           
            const updatedPendingData = pendingdata.filter((entry:any) => {
                return entry.employeeId.id !== id || entry.punches[0].punchIn!== PunchIn || entry.date !== date;
            });

            setPendingdata(updatedPendingData);

        }
        catch(error) {
            Snackbar.show({
                text: 'error  in rejection ',
                backgroundColor: '#DC143C',
                duration: 4000,
            });
            console.error('Error:', error);
        }

    }
    useEffect(() => {
        fetchNoData();

    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Navbar />
            <View style={{ padding: 15, flex: 1, marginBottom: 10 }}>
                <View style={{ margin: 15, flexDirection: 'row', justifyContent: 'space-around', }}>

                    <Text style={{ fontSize: 22, color: '#2E2E2E', fontWeight: '700' }}>ApprovalLogs</Text>

                    <View style={{
                       
                        width: '50%',
                      
                        borderColor: '#DEDEDE',
                        borderRadius: 3,
                        borderWidth: 1,
                    }}>

                        <Picker
                            style={{
                                backgroundColor: 'white',
                                // color: '#283093',
                                color:'black',
                                fontWeight:'600'
                               

                            }}
                            selectedValue={selectedOption}
                            onValueChange={itemValue => setSelectedOption(itemValue)}
                        >
                            <Picker.Item label="Approved" value="Approved" />
                            <Picker.Item label="Pending" value="Pending" />
                        </Picker>
                    </View>

                </View>


                <ScrollView horizontal={true}


                >
                    {/* header */}
                    {selectedOption=='Approved'?(  <View>
                        <View style={styles.tableHeader}>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Date
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Name
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Approve Time
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Photo
                                </Text>
                            </View>
                        </View>

                        {/* body */}
                        <FlatList
                            data={data}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }



                            renderItem={({ item: v, index }) => (

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1 }}>
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontFamily: 'Inter-Medium',
                                                }}>
                                                {v.date ? v.date.split('T')[0] : ''}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1 }}>
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontFamily: 'Inter-Medium',
                                                }}>
                                                {v.employeeId?.name}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1, flexBasis: '100%' }}>

                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontFamily: 'Inter-Medium',
                                                }}>
                                                {v.approvedTime ? v.approvedTime.slice(11, 16) : ''}
                                            </Text>

                                        </View>
                                    </View>
                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1, flexBasis: '100%' }}>
                                            <TouchableOpacity onPress={() => handleOpenButtonPress(v.approvedImage)}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text
                                                        style={{
                                                            color: 'black',
                                                            fontFamily: 'Inter-Medium',
                                                        }}>
                                                        Open
                                                    </Text>
                                                    <Image style={{ width: 15, height: 15, marginLeft: 4 }} source={ImageIndex.arrowout} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                            )}

                        />
                    </View>):( 
                        // {pendingdata.length ===0 ? <Text>no one left as pending</Text>
                        // :(
                            <View>
                            <View style={styles.tableHeader}>
                                <View style={styles.tableDataH}>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: '#2E2E2E',
                                            fontFamily: 'Inter-Medium',
                                            fontWeight:'900'
                                        }}>
                                        Date
                                    </Text>
                                </View>
                                <View style={styles.tableDataH}>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: '#2E2E2E',
                                            fontFamily: 'Inter-Medium',
                                            fontWeight:'900'
                                        }}>
                                        Name
                                    </Text>
                                </View>
                                <View style={styles.tableDataH}>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: '#2E2E2E',
                                            fontFamily: 'Inter-Medium',
                                            fontWeight:'900'
                                        }}>
                                        Status
                                    </Text>
                                </View>
                                <View style={styles.tableDataH}>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: '#2E2E2E',
                                            fontFamily: 'Inter-Medium',
                                            fontWeight:'900'
                                        }}>
                                        Reject
                                    </Text>
                                </View>
                            </View>
    
                            {/* body */}
                            <FlatList
                                data={pendingdata}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                }
    
    
    
                                renderItem={({ item: v, index }) => (
    
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    
                                        <View style={styles.tableData}>
                                            <View style={{ flexShrink: 1 }}>
                                                <Text
                                                    style={{
                                                        color: 'black',
                                                        fontFamily: 'Inter-Medium',
                                                    }}>
                                                    {v.date ? v.date.split('T')[0] : ''}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableData}>
                                            <View style={{ flexShrink: 1 }}>
                                                <Text
                                                    style={{
                                                        color: 'black',
                                                        fontFamily: 'Inter-Medium',
                                                    }}>
                                                    {v.employeeId.name}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableData}>
                                            <View style={{ flexShrink: 1, flexBasis: '100%' }}>
    
                                                <Text
                                                    style={{
                                                        color: 'black',
                                                        fontFamily: 'Inter-Medium',
                                                    }}>
                                                    {v.status}
                                                </Text>
    
                                            </View>
                                        </View>
                                        <View style={styles.tableData}>
                                            <View style={{ flexShrink: 1, flexBasis: '100%' ,}}>
                                                <TouchableOpacity style={{borderRadius:4, borderWidth:0.1, backgroundColor:'#283093', width:'50%', padding:'3%'}}
                                                            onPress={() => handleReject({ id: v.employeeId._id, PunchIn: v.punches[0].punchIn, date: v.date })}
                                                            >

                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text
                                                            style={{
                                                                color: 'white',
                                                                fontFamily: 'Inter-Medium',
                                                               marginLeft:'2%'
                                                            }}>
                                                           Reject
                                                        </Text>
                                                        <Feather
                                                            color={'white'}
                                                            name="x"
                                                            size={15}
                                                            style={{marginLeft:3}}
                                                            
                                                        />

                                                     
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
    
                                )}
    
                            />
                        </View>
                        // )
                        // }
                      )}
                  
                    {selectedImageUrl && (
                        <Modal
                            visible={isModalVisible}
                            animationType="fade"
                            transparent={true}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setIsModalVisible(false)}
                                    >
                                        <Image style={{ width: 20, height: 25, marginTop: 3 }} source={ImageIndex.cross} />
                                        {/* <Icon name="close" size={20} color="black" /> */}
                                    </TouchableOpacity>
                                    <Image
                                        source={{ uri: selectedImageUrl }}
                                        style={styles.modalImage}
                                        resizeMode="contain"
                                    />
                                    {/* <Text style={styles.closeText}>Close</Text> */}
                                </View>
                            </View>
                        </Modal>
                    )}
                </ScrollView>
            </View>

        </View>
    )
}

export default ApprovalLogs

const styles = StyleSheet.create({
    tableHeader: {
        backgroundColor: '#ECEDFE',
        flexDirection: 'row',
        borderRadius: 8
    },
    tableData: {
        paddingVertical: 12,
        paddingLeft: 20,
        width: 160,
        // borderBottomWidth:0.3,

        // width:80
    },
    tableDataH: {
        paddingVertical: 16,
        paddingLeft: 24,
        width: 160,
        // width:50
    },
    outerView: {
        padding: '6%', borderWidth: 1, borderRadius: 10, marginLeft: '4%',
        marginRight: '4%', borderColor: '#0000001F', height: '76%',
    }, container: {
        // width: '50%',
        // height: '20%',
        backgroundColor: '#fafafa',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
    modalImage: {
        width: '90%',
        height: undefined,
        aspectRatio: 1, // To maintain a square format
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 15,
        color: 'white',
    },
    closeText: {
        marginTop: 10,
        fontSize: 18,
        color: 'black',
    },

})