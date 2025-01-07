import React from 'react';
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const defaultImage = require('@/assets/images/medicine/default.jpg');

type Medicine = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
};

const medicines: Medicine[] = require('@/data/medicine.json');

const MedicineList = () => {
  const router = useRouter();

  const renderItem = ({ item }: {item: Medicine}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/warehouses/medicines/${item.id}`)}
    >
      {/* Ảnh thuốc */}
      <Image
        source={ item.image ? { uri: item.image } : defaultImage }
        style={styles.image}
      />

      {/* Thông tin thuốc */}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>Price: {item.price} VND</Text>
        <Text style={styles.quantity}>Stock: {item.stock} units</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={medicines}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  info: {
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
});

export default MedicineList;
