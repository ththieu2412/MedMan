// import React from 'react';
// import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
// import { useRouter } from 'expo-router';

// const defaultImage = require('@/assets/images/medicine/default.jpg');

// type Medicine = {
//   id: number;
//   name: string;
//   price: number;
//   stock: number;
//   image?: string;
// };

// const medicines: Medicine[] = require('@/data/medicine.json');

// const MedicineList = () => {
//   const router = useRouter();

//   const renderItem = ({ item }: {item: Medicine}) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => router.push(`/warehouses/medicines/${item.id}`)}
//     >
//       {/* Ảnh thuốc */}
//       <Image
//         source={ item.image ? { uri: item.image } : defaultImage }
//         style={styles.image}
//       />

//       {/* Thông tin thuốc */}
//       <View style={styles.info}>
//         <Text style={styles.name}>{item.name}</Text>
//         <Text style={styles.price}>Price: {item.price} VND</Text>
//         <Text style={styles.quantity}>Stock: {item.stock} units</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <FlatList
//       data={medicines}
//       keyExtractor={(item) => item.id.toString()}
//       renderItem={renderItem}
//       contentContainerStyle={styles.container}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//   },
//   card: {
//     flexDirection: 'column',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 15,
//     padding: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 5,
//     width: '100%',
//   },
//   image: {
//     width: '100%',
//     height: 150,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   info: {
//     paddingHorizontal: 10,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   price: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 5,
//   },
//   quantity: {
//     fontSize: 14,
//     color: '#666',
//   },
// });

// export default MedicineList;

import React, { useEffect, useState } from 'react';
import { View, Image, Text, FlatList } from 'react-native';

// Định nghĩa kiểu cho đối tượng thuốc
interface Medicine {
  id: number;
  medicine_name: string;
  unit: string;
  sale_price: number;
  description: string;
  stock_quantity: number;
  image: string | null;  // image có thể là chuỗi base64 hoặc null
}

const MedicineList = () => {
  // Khai báo state với kiểu dữ liệu là mảng các đối tượng Medicine
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    // Fetch dữ liệu từ API Django
    fetch('http://192.168.1.9:8000/api/warehouses/medicine-list/')
      .then(response => response.json())
      .then(data => {
        setMedicines(data.data);  // Dữ liệu trả về từ API
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <View>
      <FlatList
        data={medicines}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <Text>{item.medicine_name}</Text>
            <Text>Giá: {item.sale_price} VND</Text>
            <Text>Đơn vị: {item.unit}</Text>
            {item.image ? (
              <Image
                source={{ uri: item.image }}  // Hiển thị ảnh từ base64
                style={{ width: 100, height: 100, borderRadius: 10 }}
              />
            ) : (
              <Text>Không có hình ảnh</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default MedicineList;
