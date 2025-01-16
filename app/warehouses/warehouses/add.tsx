import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { createWarehouse } from "@/services/api/warehouseService"; // API call để thêm kho
import { useToken } from "@/hooks/useToken"; // Hook để lấy token

const AddWarehouse = () => {
  const [warehouseName, setWarehouseName] = useState("");
  const [address, setAddress] = useState("");
  const [isActive, setIsActive] = useState(true);
  const router = useRouter();
  const token = useToken();

  const handleAddWarehouse = async () => {
    if (!warehouseName || !address) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const payload = {
        warehouse_name: warehouseName,
        address: address,
        is_active: isActive,
      };

      console.log("Payload gửi lên API:", payload); // Kiểm tra dữ liệu trước khi gửi
      const response = await createWarehouse(payload);
      console.log("phản hồi", response);
      if (response.success) {
        Alert.alert("Thành công", "Đã thêm kho mới.");
        router.replace("/warehouses/warehouses/list");
      } else {
        Alert.alert("Thông báo lỗi", response.errorMessage);
        // router.replace("/warehouses/warehouses/list");
      }
    } catch (error: any) {
      // console.error("Error adding warehouse:", error);
      Alert.alert("Lỗi", error || "Không thể thêm kho mới.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Kho Mới</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên Kho"
        value={warehouseName}
        onChangeText={setWarehouseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Địa Chỉ"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddWarehouse}>
        <Text style={styles.buttonText}>Thêm Kho</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddWarehouse;
