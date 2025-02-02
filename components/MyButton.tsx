import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

type MyButtonProps = {
  title: string;
  onPress: () => void;
  buttonStyle?: object;
};

const MyButton: React.FC<MyButtonProps> = ({ title, onPress, buttonStyle }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.button, buttonStyle]}
        onPress={onPress}
      >
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyButton;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15, 
  },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#333333',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
