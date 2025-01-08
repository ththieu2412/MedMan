import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Text, View, Image, TouchableOpacity,  Alert } from 'react-native';
import { useRouter } from 'expo-router';
import MyButton from '@/components/MyButton';
import FormField from '@/components/FormField';

const SignIn = () => {
  const router = useRouter();

  const [userName, setUserName] = useState('admin');
  const [password, setPassword] = useState('12345');

  const validateLogin = () => {
    if (userName === '' || password === '') {
      Alert.alert('Error', 'Please enter both username and password');
    } else if (userName === 'admin' && password === '12345') {
      router.navigate('/(tabs)');
    } else {
      Alert.alert('Error', 'Invalid username or password');
    }
  };

  const onForgotPassword = () => {
    router.push('/forget-pass'); 
  };
      
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0055A8', }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Image
            source={require('@/assets/images/login.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.form}>
            <FormField
              title={'Username'}
              placeholder={'Enter your username'}
              value={userName}
              onChangeText={setUserName}
            />
            <FormField
              title={'Password'}
              placeholder={'Enter your password'}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={onForgotPassword}>
              <Text style={styles.forgetPass}>Forget Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: '80%' }}>
            <MyButton title={'Login'} onPress={validateLogin} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: 500,
    height: 500,
  },
  form: {
    width: '90%',
    padding: 20,
    gap: 20,
  },
  forgetPass: {
    textAlign: 'right',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: -10,
  },
});


