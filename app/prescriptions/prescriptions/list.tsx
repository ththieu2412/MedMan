import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';  // Import icon từ thư viện vector icons
import { useRouter } from 'expo-router';  // Dùng useRouter để điều hướng
import data from '@/data/prescription.json';  // Đảm bảo đường dẫn đúng

// Define the type for a single prescription item
interface Prescription {
  id: string;
  diagnosis: string;
  doctor: {
    full_name: string;
  };
  patient: {
    full_name: string;
  };
  prescription_date: string;
  instruction: string;
}

const PrescriptionsList = () => {
  const router = useRouter();

  const [selectedItem, setSelectedItem] = useState(null);

  const renderItem = ({ item }: { item: Prescription }) => (
  <View style={styles.prescriptionItem}>
    <View style={styles.diagnosisContainer}>
      <Text style={styles.diagnosis}>{item.diagnosis}</Text>

      {/* Icon menu bên phải diagnosis */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setSelectedItem(item)}  // Chọn item khi nhấn vào icon
      >
        <Ionicons name="ellipsis-horizontal" size={24} color="gray" />
      </TouchableOpacity>
    </View>

    <Text>Bác sĩ: {item.doctor.full_name}</Text>
    <Text>Bệnh nhân: {item.patient.full_name}</Text>
    <Text>Ngày kê đơn: {new Date(item.prescription_date).toLocaleString()}</Text>
    <Text>Hướng dẫn: {item.instruction}</Text>

    {/* Hiển thị menu nếu item được chọn */}
    {selectedItem === item && (
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push(`/prescriptions/prescriptions/${item.id}`)}  // Điều hướng đến màn hình chỉnh sửa
        >
          <Ionicons name="create" size={20} color="green" />
          <Text style={styles.menuText}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Alert.alert('Xóa đơn thuốc', 'Bạn có chắc chắn muốn xóa đơn thuốc này?', [
              { text: 'Hủy', style: 'cancel' },
              { text: 'Xóa', onPress: () => handleDelete(item.id) },
            ]);
          }}
        >
          <Ionicons name="trash" size={20} color="red" />
          <Text style={styles.menuText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

  const handleDelete = (id) => {
    console.log(`Đơn thuốc có ID ${id} đã được xóa`);
  };

  return (
    <View style={styles.container}>  {/* Wrap all items inside a parent View */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default PrescriptionsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f5',  // Màu nền nhẹ nhàng
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',  // Màu sắc trang nhã
    textAlign: 'center',  // Căn giữa tiêu đề
  },
  prescriptionItem: {
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,  // Góc bo tròn lớn hơn
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,  // Để tăng hiệu ứng bóng trong Android
    borderWidth: 1,
    borderColor: '#ddd',  // Đường viền nhạt
  },
  diagnosisContainer: {
    flexDirection: 'row',  // Căn các phần tử theo chiều ngang
    justifyContent: 'space-between',  // Khoảng cách giữa diagnosis và icon
    alignItems: 'center',  // Căn giữa các phần tử theo chiều dọc
  },
  diagnosis: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2980b9',  // Màu xanh dịu cho chẩn đoán
    marginBottom: 5,
    flex: 1,  // Chiếm hết không gian còn lại
  },
  iconButton: {
    padding: 10,
  },
  menu: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 150,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
  },
});
