import { ImageBackground, StyleSheet, Text, View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import MyButton from '@/components/MyButton';
import { useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter();
  const onLogin = () => {
    router.push('/sign-in');
  }

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current; 

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <ImageBackground
      source={require('@/assets/images/background.jpg')}
      style={styles.background}
    >
      <Animated.View
        style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={styles.title}>Welcome to MedMan!</Text>
        <Text style={styles.description}>
          The efficient prescription management application that connects doctors and patients, saving time and ensuring comprehensive healthcare.
        </Text>
        <MyButton title="Getting Started" onPress={onLogin}/>
      </Animated.View>
    </ImageBackground>
  );
};

export default Index;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end', // Đẩy nội dung xuống dưới cùng
  },
  container: {
    position: 'absolute',
    bottom: 0, // Đặt container ở dưới cùng
    width: '100%', // Đảm bảo container chiếm toàn bộ chiều ngang
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 30,
    borderTopLeftRadius: 20, // 2 góc trên có borderRadius
    borderTopRightRadius: 20, 
    alignItems: 'center',
    minHeight: 250, // Đặt chiều cao cố định cho container
    paddingBottom: 20, // Giảm khoảng cách dưới cùng
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
});
