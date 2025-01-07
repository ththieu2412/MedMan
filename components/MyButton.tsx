import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

type MyButtonProps = {
  title: string;
  onPress: () => void;
}

const MyButton: React.FC<MyButtonProps> = ({ title, onPress}) => {
  return (
    <View>
      <TouchableOpacity 
      activeOpacity={0.8}
      style={styles.cotainer}
      onPress={onPress}
      >
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MyButton

const styles = StyleSheet.create({
  cotainer: {
    backgroundColor: '#1E88E5',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#333333',
    shadowOffset: {
      width: 2,
      height: 4, // Điều chỉnh độ lệch của bóng
    },
    shadowOpacity: 0.4, // Đổ bóng nhẹ hơn
    shadowRadius: 6, // Làm bóng mềm hơn
    elevation: 5, // Tạo độ nổi cho Android
  },
  text: {
    color: '#FFFFFF', // Giữ màu chữ trắng
    fontSize: 18, // Chữ to hơn để dễ đọc
    fontWeight: '600', // Giảm trọng lượng để chữ thanh thoát hơn
    letterSpacing: 1, // Tạo khoảng cách giữa các ký tự
  },
})