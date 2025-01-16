// import React from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// // Component hiển thị chi tiết phiếu nhập
// const ImportReceiptDetail = ({ receipt, products, onAddProduct }) => {
//   const handleAddProduct = () => {
//     Alert.alert('Thông báo', 'Chức năng Thêm Sản Phẩm đang được thực hiện!');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Chi Tiết Phiếu Nhập</Text>
//       <View style={styles.infoCard}>
//         <Text>Mã Phiếu: {receipt.id}</Text>
//         <Text>Ngày: {receipt.date}</Text>
//         <Text>Nhà Cung Cấp: {receipt.supplier}</Text>
//         <Text>Tổng Giá Trị: {receipt.total}</Text>
//       </View>
//       <FlatList
//         data={products}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.productItem}>
//             <Text>Tên: {item.name}</Text>
//             <Text>Số Lượng: {item.quantity}</Text>
//             <Text>Đơn Giá: {item.price}</Text>
//             <Text>Thành Tiền: {item.total}</Text>
//           </View>
//         )}
//       />
//       <TouchableOpacity style={styles.addButton} onPress={onAddProduct || handleAddProduct}>
//         <Text style={styles.addButtonText}>+ Thêm Sản Phẩm</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// // Dữ liệu mẫu
// const sampleReceipt = {
//   id: 'PN00123',
//   date: '2025-01-08',
//   supplier: 'Nhà Cung Cấp B',
//   total: '3,000,000 VND',
// };

// const sampleProducts = [
//   { id: 1, name: 'Sản phẩm A', quantity: 10, price: '200,000 VND', total: '2,000,000 VND' },
//   { id: 2, name: 'Sản phẩm B', quantity: 5, price: '100,000 VND', total: '500,000 VND' },
//   { id: 3, name: 'Sản phẩm C', quantity: 10, price: '50,000 VND', total: '500,000 VND' },
// ];

// const App = () => {
//   return (
//     <ImportReceiptDetail
//       receipt={sampleReceipt}
//       products={sampleProducts}
//       onAddProduct={() => {
//         Alert.alert('Thông báo', 'Bạn đã nhấn vào Thêm Sản Phẩm!');
//       }}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
//   infoCard: { padding: 16, backgroundColor: '#f9f9f9', borderRadius: 5, marginBottom: 16 },
//   productItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
//   addButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 16 },
//   addButtonText: { color: '#fff', fontWeight: 'bold' },
// });

// export default App;
