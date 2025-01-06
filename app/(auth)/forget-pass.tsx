import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import MyButton from '@/components/MyButton';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

const ForgetPass = () => {
  const router = useRouter();

  const onSubmit = () => {
    Alert.alert('Success', 'Password reset link has been sent to your email.');
    router.push('/sign-in'); 
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.Text entering={FadeIn} style={styles.title}>
        Forgot Your Password?
      </Animated.Text>
      <Animated.Text entering={FadeInUp.delay(100)} style={styles.description}>
        Don't worry! Enter your email address below and we'll send you a link to reset your password.
      </Animated.Text>

      {/* Email Input */}
      <Animated.View entering={FadeInUp.delay(200)} style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          placeholderTextColor="#aaa"
        />
      </Animated.View>

      {/* Submit Button */}
      <Animated.View entering={FadeInUp.delay(300)} style={styles.buttonContainer}>
        <MyButton title={'Send Reset Link'} onPress={onSubmit}></MyButton>
      </Animated.View>

      {/* Back to Login */}
      <Animated.Text
        entering={FadeInUp.delay(400)}
        style={styles.backText}
        onPress={() => router.push('/sign-in')}
      >
        Back to Login
      </Animated.Text>
    </View>
  );
};

export default ForgetPass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0055A8',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#d9e6ff',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#d9e6ff',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  backText: {
    fontSize: 16,
    color: '#d9e6ff',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
