import { StyleSheet, Text, View, FlatList, Image, Animated, Modal, TouchableOpacity } from 'react-native'; 
import React, { useEffect, useState } from 'react';
import { Employee } from '@/types';
import MyButton from '@/components/MyButton';
import SearchText from '@/components/SearchText';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { formatDate } from '@/utils/formatDate';


const data: Employee[] = require('@/data/employees.json');

const ListEmployees = () => {
  const { role } = useLocalSearchParams();

  const [fadeAnim] = useState(new Animated.Value(0)); // Khởi tạo hiệu ứng mờ
  console.log(role);
  const [selectedRole, setSelectedRole] = useState(role); // Trạng thái vai trò được chọn
  const [filteredData, setFilteredData] = useState<Employee[]>(data); // Dữ liệu đã lọc
  const [modalVisible, setModalVisible] = useState(false); // Modal lọc

  // Hiệu ứng mờ
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Lọc dữ liệu theo vai trò
  useEffect(() => {
    const filtered = data.filter((employee) => employee.role === selectedRole);
    setFilteredData(filtered);
  }, [selectedRole]);

  // Hàm lấy tiêu đề theo vai trò
  const getHeaderTitle = () => {
    switch (selectedRole) {
      case 'Doctor':
        return 'DANH SÁCH BÁC SĨ';
      case 'Pharmacist':
        return 'DANH SÁCH DƯỢC SĨ';
      case 'Staff':
        return 'DANH SÁCH NHÂN VIÊN';
      default:
        return 'DANH SÁCH NHÂN VIÊN';
    }
  };

  return (
    <View style={styles.container}>
      {/* Tiêu đề động */}
      <Text style={styles.header}>{getHeaderTitle()}</Text>

      {/* Thanh tìm kiếm và icon lọc */}
      <View style={styles.searchContainer}>
        <SearchText placeholder="Nhập tên nhân viên" style={styles.searchText} />
        <TouchableOpacity style={styles.filterIconContainer} onPress={() => setModalVisible(true)}>
          <MaterialIcons name="filter-list" size={30} color="#007bff" />
          <Text style={styles.filterText}>Lọc</Text>
        </TouchableOpacity>
      </View>

      {/* Modal bộ lọc */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn vai trò</Text>
            <TouchableOpacity style={styles.modalOption} onPress={() => { setSelectedRole('Doctor'); setModalVisible(false); }}>
              <Text style={styles.modalOptionText}>Bác sĩ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => { setSelectedRole('Pharmacist'); setModalVisible(false); }}>
              <Text style={styles.modalOptionText}>Dược sĩ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => { setSelectedRole('Staff'); setModalVisible(false); }}>
              <Text style={styles.modalOptionText}>Nhân viên</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Danh sách nhân viên */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Animated.View style={[styles.itemContainer, { opacity: fadeAnim }]}>
            <Link href={`/accounts/doctors/${item.id}`} params={{ item }}>
              <Image source={item.image ? { uri: item.image } : require('@/assets/images/avatar/default.png')} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.full_name}</Text>
                <Text style={styles.info}>{item.gender}</Text>
                <Text style={styles.info}>{ formatDate(item.date_of_birth)}</Text>
              </View>
            </Link>
          </Animated.View>
        )}
      />
      
      {/* Nút thêm bác sĩ */}
      <MyButton title="Thêm nhân viên mới" style={styles.button} />
    </View>
  );
};

export default ListEmployees;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e6f7ff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#007bff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchText: {
    flex: 7,
  },
  filterIconContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    height: 45,
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  filterText: {
    fontSize: 16,
    color: '#007bff',
    marginLeft: 5,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
  },
  textContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
  },
});
