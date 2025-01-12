import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Header from '@/components/Home/Header';
import PatientListScreen from '../prescriptions/patients/list';
import MyButton from '@/components/MyButton';
import SearchText from '@/components/SearchText';
import { useRouter } from 'expo-router';

const Patients = () => {
  const router = useRouter();
  const handlePress = () => {
    router.push('/prescriptions/patients/add');
  }

  return (
    <View style={styles.container}>
      <Header />
      
      {/* Phần tìm kiếm */}
      <SearchText placeholder={"Nhập tên bệnh nhân"} style={styles.search} setSearchText={function (text: string): void {
        throw new Error('Function not implemented.');
      } } />
      
      {/* Phần tiêu đề */}
      {/* <View style={styles.titleContainer}> */}
        <Text style={styles.title}>Danh sách bệnh nhân</Text>
      {/* </View> */}

      {/* Danh sách bệnh nhân */}
      <PatientListScreen style={styles.patientList} />

      {/* Nút thêm bệnh nhân */}
      <MyButton title={"Thêm bệnh nhân"} style={styles.addButton} onPress={handlePress}/>
    </View>
  );
}

export default Patients;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  search: {
    marginBottom: 20, 
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  titleContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 10,
  },
  patientList: {
    marginTop: 20, 
  },
  addButton: {
    marginTop: 30,
    backgroundColor: '#007BFF',  
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
