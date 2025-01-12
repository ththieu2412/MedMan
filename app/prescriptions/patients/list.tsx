// import React from 'react';
// import { FlatList, Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import { Link } from 'expo-router';

// const patientsData = [
//   { id: '1', code: 'PT0001', name: 'John Doe', gender: '0' },
//   { id: '2', code: 'PT0002', name: 'Jane Smith', gender: '1' },
//   { id: '3', code: 'PT0003', name: 'Alice Brown', gender: '0' },
//   { id: '4', code: 'PT0004', name: 'Michael Johnson', gender: '0' },
//   { id: '5', code: 'PT0005', name: 'Emily Davis', gender: '1' },
//   { id: '6', code: 'PT0006', name: 'David Wilson', gender: '0' },
//   { id: '7', code: 'PT0007', name: 'Sophia Miller', gender: '1' },
//   { id: '8', code: 'PT0008', name: 'James Taylor', gender: '0' },
//   { id: '9', code: 'PT0009', name: 'Charlotte Anderson', gender: '1' },
//   { id: '10', code: 'PT0010', name: 'Benjamin Thomas', gender: '0' },
//   { id: '11', code: 'PT0011', name: 'Grace Jackson', gender: '1' },
//   { id: '12', code: 'PT0012', name: 'William White', gender: '0' },
//   { id: '13', code: 'PT0013', name: 'Olivia Harris', gender: '1' },
//   { id: '14', code: 'PT0014', name: 'Ethan Clark', gender: '0' },
//   { id: '15', code: 'PT0015', name: 'Isabella Lewis', gender: '1' },
//   { id: '16', code: 'PT0016', name: 'Alexander Robinson', gender: '0' },
//   { id: '17', code: 'PT0017', name: 'Amelia Walker', gender: '1' },
//   { id: '18', code: 'PT0018', name: 'Mason Hall', gender: '0' },
//   { id: '19', code: 'PT0019', name: 'Harper Allen', gender: '1' },
//   { id: '20', code: 'PT0020', name: 'Jack Young', gender: '0' },
// ];


// const PatientListScreen = () => {
//   const renderItem = ({ item }) => {
//     // Lựa chọn ảnh đại diện dựa trên giới tính
//     const avatarSource = item.gender === '0'
//       ? require('@/assets/images/avatar/man.png') // Giới tính nam
//       : require('@/assets/images/avatar/woman.png'); // Giới tính nữ

//     return (
//       <Link href={`/prescriptions/patients/${item.id}`} asChild>
//         <TouchableOpacity style={styles.item}>
//           <View style={styles.itemContent}>
//             <Image source={avatarSource} style={styles.avatar} />
//             <View>
//               <Text style={styles.code}>{item.code}</Text>
//               <Text style={styles.name}>{item.name}</Text>
//             </View>
//           </View>
//           <FontAwesome name="chevron-right" size={18} color="#888" />
//         </TouchableOpacity>
//       </Link>
//     );
//   };

//   return (
//     <FlatList
//       data={patientsData}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.id}
//       contentContainerStyle={styles.list}
//     />
//   );
// };

// export default PatientListScreen;

// const styles = StyleSheet.create({
//   list: {
//     paddingBottom: 20,
//   },
//   item: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     marginBottom: 10,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 5,
//     transitionDuration: '0.3s',
//     transform: [{ scale: 1.0 }],
//   },
//   itemContent: {
//     flexDirection: 'row',
//     flex: 1,
//     alignItems: 'center',
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   code: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   name: {
//     fontSize: 16,
//     color: '#333',
//   },
//   itemHover: {
//     transform: [{ scale: 1.05 }],  // Thêm hiệu ứng hover nhẹ khi nhấn vào item
//   },
// });

import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { 
  getImportReceiptListsapi, 
  getImportReceiptapi, 
  addImportReceiptapi, 
  updateImportReceiptapi, 
  deleteImportReceiptapi,
  getImportReceiptDetailsByIdsapi,
  addImportReceiptDetailapi,
  updateImportReceiptDetailapi,
  deleteImportReceiptDetailapi,
  getMedicineListsapi,
  getMedicineDetailapi,
  addMedicineapi,
  updateMedicineapi,
  deleteMedicineapi,
  getPatientListsapi,
  getPatientDetailapi,
  addPatientapi,
  updatePatientapi,
  deletePatientapi
} from '@/services/apiServices';  // Import your API services

const App = () => {
  // Sample data
  const sampleImportReceipt = {
  "id": 1,
  "import_date": "2025-01-11",
  "warehouse": 1,
  "total_amount": 15000,
  "employee": 3,
  "is_approved": true
};

  const sampleImportReceiptDetail = {
    medicineId: 1,
    quantity: 100,
    price: 200,
  };

  const sampleMedicine = {
  "id": 1,
  "medicine_name": "Paracetamol",
  "unit": "Box",
  "sale_price": 10.0,
  "description": "Pain reliever",
  "stock_quantity": 500,
  "image": null
};

  const samplePatient = {
    name: "Jane Doe",
    age: 28,
    address: "456 Oak Street, Springfield",
  };

  const handleGetImportReceipts = async () => {
    try {
      const data = await getImportReceiptListsapi();
      console.log('Import Receipts:', data);
    } catch (error) {
      console.error('Error getting Import Receipts:', error);
    }
  };

  const handleGetImportReceipt = async (id) => {
    try {
      const data = await getImportReceiptapi(id);
      console.log('Import Receipt:', data);
    } catch (error) {
      console.error('Error getting Import Receipt:', error);
    }
  };

  const handleAddImportReceipt = async () => {
    try {
      const data = await addImportReceiptapi(sampleImportReceipt);
      console.log('Added Import Receipt:', data);
    } catch (error) {
      console.error('Error adding Import Receipt:', error);
    }
  };

  const handleUpdateImportReceipt = async (id) => {
    try {
      const data = await updateImportReceiptapi(id, sampleImportReceipt);
      console.log('Updated Import Receipt:', data);
    } catch (error) {
      console.error('Error updating Import Receipt:', error);
    }
  };

  const handleDeleteImportReceipt = async (id) => {
    try {
      const data = await deleteImportReceiptapi(id);
      console.log('Deleted Import Receipt:', data);
    } catch (error) {
      console.error('Error deleting Import Receipt:', error);
    }
  };

  const handleAddImportReceiptDetail = async () => {
    try {
      const data = await addImportReceiptDetailapi(sampleImportReceiptDetail);
      console.log('Added Import Receipt Detail:', data);
    } catch (error) {
      console.error('Error adding Import Receipt Detail:', error);
    }
  };

  const handleGetMedicineLists = async () => {
    try {
      const data = await getMedicineListsapi();
      console.log('Medicines:', data);
    } catch (error) {
      console.error('Error getting Medicines:', error);
    }
  };

  const handleGetMedicineDetail = async (id) => {
    try {
      const data = await getMedicineDetailapi(id);
      console.log('Medicine Detail:', data);
    } catch (error) {
      console.error('Error getting Medicine Detail:', error);
    }
  };

  const handleAddMedicine = async () => {
    try {
      const data = await addMedicineapi(sampleMedicine);
      console.log('Added Medicine:', data);
    } catch (error) {
      console.error('Error adding Medicine:', error);
    }
  };

  const handleGetPatientLists = async () => {
    try {
      const data = await getPatientListsapi();
      console.log('Patients:', data);
    } catch (error) {
      console.error('Error getting Patients:', error);
    }
  };

  const handleGetPatientDetail = async (id) => {
    try {
      const data = await getPatientDetailapi(id);
      console.log('Patient Detail:', data);
    } catch (error) {
      console.error('Error getting Patient Detail:', error);
    }
  };

  const handleAddPatient = async () => {
    try {
      const data = await addPatientapi(samplePatient);
      console.log('Added Patient:', data);
    } catch (error) {
      console.error('Error adding Patient:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>API Testing Interface</Text>

      <Button title="Get Import Receipts" onPress={handleGetImportReceipts} />
      <Button title="Get Import Receipt" onPress={() => handleGetImportReceipt(1)} />
      <Button title="Add Import Receipt" onPress={handleAddImportReceipt} />
      <Button title="Update Import Receipt" onPress={() => handleUpdateImportReceipt(1)} />
      <Button title="Delete Import Receipt" onPress={() => handleDeleteImportReceipt(1)} />

      <Button title="Get Medicines" onPress={handleGetMedicineLists} />
      <Button title="Get Medicine Detail" onPress={() => handleGetMedicineDetail(1)} />
      <Button title="Add Medicine" onPress={handleAddMedicine} />

      <Button title="Get Patients" onPress={handleGetPatientLists} />
      <Button title="Get Patient Detail" onPress={() => handleGetPatientDetail(1)} />
      <Button title="Add Patient" onPress={handleAddPatient} />
    </View>
  );
};

export default App;
