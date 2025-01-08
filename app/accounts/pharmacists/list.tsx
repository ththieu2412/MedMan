import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Animated } from 'react-native';
import { Employee } from '@/types';
import ListItem from '@/components/ListEmployee'; // Đảm bảo bạn nhập đúng đường dẫn của component ListItem
import { Link } from 'expo-router';

const pharmacists: Employee[] = require('@/data/employees.json').filter(
  (employee) => employee.role === 'Pharmacist'
);

const ListPharmacist = () => {
  const [fadeAnims, setFadeAnims] = useState<Animated.Value[]>([]);

  useEffect(() => {
    // Khởi tạo fadeAnim cho mỗi item trong danh sách
    const anims = pharmacists.map(() => new Animated.Value(0));
    setFadeAnims(anims);
  }, []);

  useEffect(() => {
    // Bắt đầu hoạt ảnh fadeIn khi component được render
    Animated.stagger(100, fadeAnims.map((anim) => Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }))).start();
  }, [fadeAnims]);

  return (
    <View>
      <Text>DANH SÁCH DƯỢC SĨ</Text>
      <FlatList
        data={pharmacists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <ListItem item={item} fadeAnim={fadeAnims[index]} />
        )}
      />
    </View>
  );
};

export default ListPharmacist;
