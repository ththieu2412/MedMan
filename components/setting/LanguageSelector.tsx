import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Import Picker từ thư viện @react-native-picker/picker
import { Picker } from '@react-native-picker/picker';

export default function LanguageSelector() {
  const [language, setLanguage] = useState('en');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Language</Text>
      <Picker
        selectedValue={language}
        onValueChange={(itemValue) => setLanguage(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Vietnamese" value="vi" />
      </Picker>
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
  picker: {
    height: 50,
    width: '100%',
  },
});
