import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Image, Alert } from "react-native";
import MyButton from "@/components/MyButton";
import { spacing } from "@/constants/dimensions";
import { useRouter } from "expo-router";
import { createMedicine } from "@/services/api"; // Import hàm createMedicine
import { useToken } from "@/hooks/useToken";
import { Medicine } from "@/types";

const AddMedicine = () => {
  const router = useRouter();
  const token = useToken(); // Lấy token từ context hoặc nơi lưu trữ

  // State lưu trữ thông tin thuốc
  const [medicine, setMedicine] = useState<Medicine>({
    id: 0,
    medicine_name: "",
    sale_price: 0,
    stock_quantity: 0,
    description: "",
    unit: "",
    image: "",
  });

  // Hàm xử lý khi người dùng nhấn nút lưu
  const handleSave = async () => {
    if (
      !medicine.medicine_name ||
      !medicine.sale_price ||
      !medicine.stock_quantity ||
      !medicine.description ||
      !medicine.unit
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin thuốc!");
      return;
    }

    // Tạo đối tượng thuốc để gửi tới API
    const newMedicine = {
      medicine_name: medicine.medicine_name,
      sale_price: medicine.sale_price,
      stock_quantity: medicine.stock_quantity,
      description: medicine.description,
      unit: medicine.unit,
      image: medicine.image || "", // Cung cấp link ảnh (nếu có)
    };

    try {
      // Gọi hàm createMedicine để tạo thuốc mới
      const response = await createMedicine(newMedicine);

      // Hiển thị thông báo thành công
      Alert.alert("Thành công", "Đã thêm thuốc thành công!");

      // Chuyển trang sau khi lưu thành công
      router.replace("/(tabs)/medicines");
    } catch (error) {
      // TypeScript requires type assertion for unknown errors
      const errorMessage =
        (error as Error).message || "Có lỗi xảy ra khi thêm thuốc.";
      // Xử lý lỗi khi tạo thuốc mới
      Alert.alert("Lỗi", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Thuốc Mới</Text>

      {/* Tên Thuốc */}
      <Text style={styles.label}>Tên Thuốc</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên Thuốc"
        value={medicine.medicine_name}
        onChangeText={(text) =>
          setMedicine({ ...medicine, medicine_name: text })
        }
      />

      {/* Giá Thuốc */}
      <Text style={styles.label}>Giá Thuốc</Text>
      <TextInput
        style={styles.input}
        placeholder="Giá Thuốc"
        keyboardType="numeric"
        value={medicine.sale_price.toString()}
        onChangeText={(text) =>
          setMedicine({ ...medicine, sale_price: parseFloat(text) })
        }
      />

      {/* Số Lượng */}
      <Text style={styles.label}>Số Lượng</Text>
      <TextInput
        style={styles.input}
        placeholder="Số Lượng"
        keyboardType="numeric"
        value={medicine.stock_quantity.toString()}
        onChangeText={(text) =>
          setMedicine({ ...medicine, stock_quantity: parseInt(text) })
        }
      />

      {/* Mô Tả */}
      <Text style={styles.label}>Mô Tả</Text>
      <TextInput
        style={styles.input}
        placeholder="Dùng sáng tối"
        value={medicine.description}
        onChangeText={(text) => setMedicine({ ...medicine, description: text })}
      />

      {/* Đơn Vị */}
      <Text style={styles.label}>Đơn Vị</Text>
      <TextInput
        style={styles.input}
        placeholder="viên, hộp,..."
        value={medicine.unit}
        onChangeText={(text) => setMedicine({ ...medicine, unit: text })}
      />

      {/* Link Ảnh */}
      <Text style={styles.label}>Link Ảnh (Tùy Chọn)</Text>
      <TextInput
        style={styles.input}
        placeholder="hinh a"
        value={medicine.image}
        onChangeText={(text) => setMedicine({ ...medicine, image: text })}
      />

      {/* Hiển thị ảnh nếu có */}
      {medicine.image ? (
        <Image source={{ uri: medicine.image || "" }} style={styles.image} />
      ) : null}

      {/* Nút Lưu */}
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
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
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
