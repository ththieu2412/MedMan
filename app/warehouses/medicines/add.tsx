import MyButton from "@/components/MyButton";
import { spacing } from "@/constants/dimensions";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  Alert,
} from "react-native";

const AddMedicine = () => {
  const router = useRouter();
  // State lưu trữ thông tin thuốc
  const [medicine, setMedicine] = useState({
    id: "",
    name: "Hello",
    price: "20000",
    stock: "20",
    image: "",
  });

  // Hàm xử lý khi người dùng nhấn nút lưu
  const handleSave = () => {
    if (!medicine.name || !medicine.price || !medicine.stock) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin thuốc!");
      return;
    }

    console.log("Thông tin thuốc:", medicine);
    Alert.alert("Thành công", "Đã thêm thuốc thành công!");
    router.replace("/(tabs)/medicines");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Thuốc Mới</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên Thuốc"
        value={medicine.name}
        onChangeText={(text) => setMedicine({ ...medicine, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Giá Thuốc"
        keyboardType="numeric"
        value={medicine.price}
        onChangeText={(text) => setMedicine({ ...medicine, price: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Số Lượng"
        keyboardType="numeric"
        value={medicine.stock}
        onChangeText={(text) => setMedicine({ ...medicine, stock: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Link Ảnh (Tùy Chọn)"
        value={medicine.image}
        onChangeText={(text) => setMedicine({ ...medicine, image: text })}
      />

      {medicine.image ? (
        <Image source={{ uri: medicine.image }} style={styles.image} />
      ) : null}

      <MyButton
        title="Lưu"
        onPress={handleSave}
        buttonStyle={{ marginBottom: spacing.md }}
      />
    </View>
  );
};

export default AddMedicine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 15,
    alignSelf: "center",
  },
});
