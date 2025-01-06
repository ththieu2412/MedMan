import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileInfo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Information</Text>
      <Text style={styles.info}>Name: Tran Huynh Trung Hieu</Text>
      <Text style={styles.info}>Email: trung.hieu@example.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
});
