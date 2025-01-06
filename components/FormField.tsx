import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const FormField = ({ title, placeholder, value, onChangeText }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#b0b0b0"
        style={[styles.input, isFocused && styles.inputFocused]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={title === 'Password' && !showPassword}
      />

      {title === 'Password' && (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Feather
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#7B7B8B"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  input: {
    borderColor: '#cccccc',
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 20,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#ffffff',
  },
  inputFocused: {
    borderColor: '#000000',
    shadowColor: '#007bff',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
});

export default FormField;
