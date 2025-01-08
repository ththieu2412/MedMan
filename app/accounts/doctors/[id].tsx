import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Employee } from '@/types';

const DetailDoctor = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [doctorData, setDoctorData] = useState({
    full_name: "Dr. John Doe",
    date_of_birth: "01/01/1980",
    gender: "Nam",
    idCard: "123456789",
    phone_number: "0901234567",
    address: "123 Đường ABC, TP.HCM",
    email: "john.doe@example.com",
    role: "Bác sĩ",
    avatar: require('@/assets/images/avatar/default.png'),
  });

  const [editedDoctorData, setEditedDoctorData] = useState({ ...doctorData }); 
  const router = useRouter();

  const closeModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setEditedDoctorData({ ...doctorData }); 
    setModalVisible(true);
  };

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa bác sĩ này?',
      [
        {
          text: 'Hủy',
          onPress: () => console.log('Hủy xóa'),
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: () => {
            router.back();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSave = () => {
    setDoctorData({ ...editedDoctorData }); 
    closeModal(); 
  };

  // Hàm thay đổi giá trị trong modal
  const handleChange = (field: keyof Employee, value: string) => {
    setEditedDoctorData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={doctorData.avatar} style={styles.avatar} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{doctorData.full_name}</Text>
        <Text style={styles.info}>Ngày sinh: {doctorData.date_of_birth}</Text>
        <Text style={styles.info}>Giới tính: {doctorData.gender}</Text>
        <Text style={styles.info}>CMND: {doctorData.idCard}</Text>
        <Text style={styles.info}>Số điện thoại: {doctorData.phone_number}</Text>
        <Text style={styles.info}>Địa chỉ: {doctorData.address}</Text>
        <Text style={styles.info}>Email: {doctorData.email}</Text>
        <Text style={styles.info}>Vai trò: {doctorData.role}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={openModal}>
          <Text style={styles.buttonText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>

      {/* Modal sửa thông tin bác sĩ */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Sửa Thông Tin Bác Sĩ</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Tên bác sĩ"
              value={editedDoctorData.full_name}
              onChangeText={(text) => handleChange('full_name', text)} // Cập nhật tên bác sĩ
            />
            <TextInput
              style={styles.input}
              placeholder="Ngày sinh"
              value={editedDoctorData.date_of_birth}
              onChangeText={(text) => handleChange('date_of_birth', text)} // Cập nhật ngày sinh
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={editedDoctorData.phone_number}
              onChangeText={(text) => handleChange('phone_number', text)} // Cập nhật số điện thoại
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editedDoctorData.email}
              onChangeText={(text) => handleChange('email', text)} // Cập nhật email
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.modalButtonText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7', // Màu nền tổng thể của trang
    paddingHorizontal: 20, // Thêm khoảng cách hai bên để giao diện không bị sát
  },
  header: {
    backgroundColor: '#007bff', // Nền xanh
    paddingVertical: 60, // Tăng khoảng cách cho phần trên
    alignItems: 'center', // Căn giữa các phần tử
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 30, // Thêm khoảng cách cho phần thông tin bác sĩ
    marginTop: 20, // Đẩy xuống dưới một chút
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70, // Bo tròn ảnh đại diện
    borderWidth: 5,
    borderColor: '#ffffff', // Viền trắng cho ảnh đại diện
    marginTop: 40, // Thêm khoảng cách từ trên để avatar không bị căn giữa
  },
  infoContainer: {
    padding: 25,
    backgroundColor: '#ffffff', // Nền trắng cho phần thông tin
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, // Đẩy phần thông tin lên để gắn sát vào header
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10, // Bóng mờ cho Android
  },
  name: {
    fontSize: 30, // Tăng kích thước chữ
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15, // Tăng khoảng cách dưới tên
  },
  info: {
    fontSize: 18, // Chữ lớn hơn cho thông tin
    color: '#666',
    marginBottom: 12, // Tăng khoảng cách giữa các thông tin
    lineHeight: 25, // Tăng chiều cao dòng để dễ đọc
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 30,
    paddingBottom: 20,
  },
  button: {
    width: 150,
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // Thêm bóng mờ cho nút
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Bóng mờ cho Android
  },
  editButton: {
    backgroundColor: '#4CAF50', // Màu xanh lá cho nút sửa
  },
  deleteButton: {
    backgroundColor: '#F44336', // Màu đỏ cho nút xóa
  },
  buttonText: {
    fontSize: 20, // Tăng kích thước chữ của nút
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // Style cho modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ cho modal
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20, // Thêm khoảng cách phía trên các nút
  },
  modalButton: {
    width: '48%',
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // Thêm bóng mờ cho các nút
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50', // Màu xanh lá cho nút Lưu
  },
  cancelButton: {
    backgroundColor: '#F44336', // Màu đỏ cho nút Hủy
  },
  modalButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DetailDoctor;
