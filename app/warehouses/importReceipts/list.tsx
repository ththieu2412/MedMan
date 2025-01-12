import React from 'react';

import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ReportScreen = () => {
  // Dữ liệu mẫu
  const medicines = [
    { id: '1', name: 'Paracetamol', quantity: 100, price: 5000 },
    { id: '2', name: 'Amoxicillin', quantity: 50, price: 10000 },
    { id: '3', name: 'Cefuroxime', quantity: 30, price: 20000 },
  ];

  // Hàm tính tổng tiền
  const calculateTotal = () => {
    return medicines.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  // Hàm render row
  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.name}</Text>
      <Text style={styles.tableCell}>{item.quantity}</Text>
      <Text style={styles.tableCell}>{item.price.toLocaleString()} VNĐ</Text>
      <Text style={styles.tableCell}>
        {(item.quantity * item.price).toLocaleString()} VNĐ
      </Text>
    </View>
  );

  return (
    <FlatList
      data={medicines}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => (
        <View style={styles.container}>
          {/* Tiêu đề */}
          <View style={styles.header}>
            <Text style={styles.title}>Chi Tiết Phiếu Nhập Thuốc</Text>
          </View>

          {/* Thông tin phiếu nhập */}
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>Mã Phiếu: PN001</Text>
            <Text style={styles.infoText}>Ngày Lập Phiếu: 08/01/2025</Text>
            <Text style={styles.infoText}>Nhà Cung Cấp: Công ty TNHH Dược An Bình</Text>
          </View>

          {/* Danh sách thuốc */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Tên Thuốc</Text>
            <Text style={styles.tableHeaderText}>Số Lượng</Text>
            <Text style={styles.tableHeaderText}>Đơn Giá</Text>
            <Text style={styles.tableHeaderText}>Thành Tiền</Text>
          </View>
        </View>
      )}
      renderItem={renderItem}
      ListFooterComponent={() => (
        <View>
          {/* Tổng cộng */}
          <Text style={styles.totalText}>
            Tổng Cộng: {calculateTotal().toLocaleString()} VNĐ
          </Text>

          {/* Chữ ký */}
          <View style={styles.signatureSection}>
            <View style={styles.signature}>
              <Text>Người Lập Phiếu</Text>
              <Text style={styles.signatureLine}>___________________</Text>
            </View>
            <View style={styles.signature}>
              <Text>Nhà Cung Cấp</Text>
              <Text style={styles.signatureLine}>___________________</Text>
            </View>
          </View>

          {/* Nút xuất PDF */}
          <TouchableOpacity style={styles.button}>
            <FontAwesome name="file-pdf-o" size={20} color="#fff" />
            <Text style={styles.buttonText}>Xuất PDF</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  infoSection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
  },
  tableHeaderText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  totalText: {
    textAlign: 'right',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  signature: {
    alignItems: 'center',
    width: '45%',
  },
  signatureLine: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

