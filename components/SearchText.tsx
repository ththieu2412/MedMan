import { StyleSheet, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

type SearchTextProps = {
  placeholder: string;
  setSearchText: (text: string) => void;
}
const SearchText: React.FC<SearchTextProps> = ({placeholder, setSearchText}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  return (
    <View style={styles.container}>
      <View
        style={[styles.inputWrapper, isFocused && styles.focusedInput]} 
      >
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
          value={searchInput} // Thêm value để giữ trạng thái nhập liệu
        />
      </View>
    </View>
  );
};

export default SearchText;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10, // Khoảng cách giữa các phần tử khác
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
    justifyContent: 'flex-start', // Đảm bảo các phần tử căn chỉnh đúng
  },
  icon: {
    position: 'absolute',
    left: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingLeft: 40, // Đảm bảo có khoảng cách cho icon bên trái
  },
  focusedInput: {
    borderColor: '#66CCFF', 
    borderWidth: 2, 
  },
});
