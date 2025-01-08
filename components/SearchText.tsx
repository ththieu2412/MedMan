import { StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

type SearchTextProps = {
  placeholder: string;
  setSearchText: (text: string) => void;
  style?: ViewStyle; // Thêm prop style tùy chọn
};

const SearchText: React.FC<SearchTextProps> = ({ placeholder, setSearchText, style }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <View style={[styles.inputWrapper, isFocused && styles.focusedInput]}>
        <FontAwesome
          name="search"
          size={20}
          color="#666666"
          style={styles.icon}
        />
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={(value) => setSearchInput(value)}
          onSubmitEditing={() => setSearchText(searchInput)}
          value={searchInput}
        />
      </View>
    </View>
  );
};

export default SearchText;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  inputWrapper: {
    position: 'relative',
    borderColor: '#cccccc',
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    position: 'absolute',
    left: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingLeft: 40,
  },
  focusedInput: {
    borderColor: '#66CCFF',
    borderWidth: 2,
  },
});
