import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';

// Giả sử bạn đang lấy dữ liệu từ API và có đường dẫn ảnh (URL)
import userData from '@/data/user.json';

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Giả sử bạn đang load dữ liệu từ file JSON và set vào state
    setUser(userData);
  }, []);

  if (!user) {
    return <Text>Loading...</Text>; // Khi chưa có dữ liệu
  }

  // Đường dẫn ảnh mặc định nếu không có ảnh
  const defaultImage = require('@/assets/images/avatar/default.png');

  // Nếu ảnh là URL từ API, chỉ cần sử dụng URL đó trong source
  const userImage = user.image ? { uri: user.image } : defaultImage;

  return (
    <View>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 7, alignItems: 'center' }}>
        <Image
          source={userImage} // Nếu có ảnh từ API thì sử dụng URL, nếu không có thì dùng ảnh mặc định
          style={{ width: 45, height: 45, borderRadius: 99 }}
        />
        <View>
          <Text>Hello,👋</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{user.username}</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
