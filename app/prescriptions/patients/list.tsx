import React from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

const patientsData = [
  { id: '1', code: 'PT0001', name: 'John Doe', gender: '0' },
  { id: '2', code: 'PT0002', name: 'Jane Smith', gender: '1' },
  { id: '3', code: 'PT0003', name: 'Alice Brown', gender: '0' },
  { id: '4', code: 'PT0004', name: 'Michael Johnson', gender: '0' },
  { id: '5', code: 'PT0005', name: 'Emily Davis', gender: '1' },
  { id: '6', code: 'PT0006', name: 'David Wilson', gender: '0' },
  { id: '7', code: 'PT0007', name: 'Sophia Miller', gender: '1' },
  { id: '8', code: 'PT0008', name: 'James Taylor', gender: '0' },
  { id: '9', code: 'PT0009', name: 'Charlotte Anderson', gender: '1' },
  { id: '10', code: 'PT0010', name: 'Benjamin Thomas', gender: '0' },
  { id: '11', code: 'PT0011', name: 'Grace Jackson', gender: '1' },
  { id: '12', code: 'PT0012', name: 'William White', gender: '0' },
  { id: '13', code: 'PT0013', name: 'Olivia Harris', gender: '1' },
  { id: '14', code: 'PT0014', name: 'Ethan Clark', gender: '0' },
  { id: '15', code: 'PT0015', name: 'Isabella Lewis', gender: '1' },
  { id: '16', code: 'PT0016', name: 'Alexander Robinson', gender: '0' },
  { id: '17', code: 'PT0017', name: 'Amelia Walker', gender: '1' },
  { id: '18', code: 'PT0018', name: 'Mason Hall', gender: '0' },
  { id: '19', code: 'PT0019', name: 'Harper Allen', gender: '1' },
  { id: '20', code: 'PT0020', name: 'Jack Young', gender: '0' },
];


const PatientListScreen = () => {
  const renderItem = ({ item }) => {
    // Lựa chọn ảnh đại diện dựa trên giới tính
    const avatarSource = item.gender === '0'
      ? require('@/assets/images/avatar/man.png') // Giới tính nam
      : require('@/assets/images/avatar/woman.png'); // Giới tính nữ

    return (
      <Link href={`/prescriptions/patients/${item.id}`} asChild>
        <TouchableOpacity style={styles.item}>
          <View style={styles.itemContent}>
            <Image source={avatarSource} style={styles.avatar} />
            <View>
              <Text style={styles.code}>{item.code}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={18} color="#888" />
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <FlatList
      data={patientsData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
    />
  );
};

export default PatientListScreen;

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    transitionDuration: '0.3s',
    transform: [{ scale: 1.0 }],
  },
  itemContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  code: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    color: '#333',
  },
  itemHover: {
    transform: [{ scale: 1.05 }],  // Thêm hiệu ứng hover nhẹ khi nhấn vào item
  },
});
