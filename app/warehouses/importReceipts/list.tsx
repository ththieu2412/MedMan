import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const ImportReceiptList = ({ receipts, onAdd, onView }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Phiếu Nhập</Text>
      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Text style={styles.addButtonText}>+ Thêm Mới</Text>
      </TouchableOpacity>
      <FlatList
        data={receipts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => onView(item.id)}>
            <Text>Mã Phiếu: {item.id}</Text>
            <Text>Ngày: {item.date}</Text>
            <Text>Nhà Cung Cấp: {item.supplier}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  addButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});
export default ImportReceiptList;
