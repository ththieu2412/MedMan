import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Alert } from "react-native";
import MyButton from "@/components/MyButton";
import { router, useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { deleteMedicine, detailMedicine, updateMedicine } from "@/services/api";
import { Medicine } from "@/types";

const MedicineDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [medicineName, setMedicineName] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const fetchData = async () => {
    if (!id) return;
    try {
      console.log(id);
      const response = await detailMedicine(Number(id));
      const medicineData = response.data;
      setMedicine(medicineData);
      setMedicineName(medicineData.medicine_name);
      setSalePrice(medicineData.sale_price.toString());
      setStockQuantity(medicineData.stock_quantity.toString());
      setUnit(medicineData.unit);
    } catch (error: any) {
      console.error("Error fetching medicine details:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleUpdate = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!medicine) return;

    // Tạo đối tượng chỉ chứa các trường đã thay đổi
    const updatedFields: Partial<Medicine> = {};
    if (medicine.medicine_name !== medicineName) {
      updatedFields.medicine_name = medicineName;
    }
    if (medicine.sale_price !== parseFloat(salePrice)) {
      updatedFields.sale_price = parseFloat(salePrice);
    }
    if (medicine.unit !== unit) {
      updatedFields.unit = unit;
    }

    // Nếu không có thay đổi, không gửi yêu cầu API
    if (Object.keys(updatedFields).length === 0) {
      Alert.alert("Thông báo", "Không có thay đổi nào để cập nhật.");
      setIsEditing(false);
      return;
    }

    try {
      // Gửi yêu cầu API với chỉ các trường đã thay đổi
      const response = await updateMedicine(Number(id), updatedFields);

      if (response.success) {
        // Cập nhật trạng thái local với các giá trị mới
        setMedicine((prev) => ({
          ...prev,
          ...updatedFields,
        }));
        setIsEditing(false);
        Alert.alert("Cập nhật thành công", "Thông tin thuốc đã được cập nhật.");
      } else {
        Alert.alert(
          "Lỗi",
          response.errorMessage || "Có lỗi xảy ra khi cập nhật thuốc."
        );
      }
    } catch (error: any) {
      console.error("Error updating medicine:", error.message);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật thuốc.");
    }
  };

  const handleDelete = () => {
    // Xử lý xóa thuốc
    Alert.alert("Xóa Thuốc", "Bạn có chắc chắn muốn xóa thuốc này không?", [
      {
        text: "Xóa",
        onPress: async () => {
          const response = await deleteMedicine(Number(medicine?.id));
          if (response.success) {
            Alert.alert("Thông báo", "Xóa thuốc thành công");
            router.replace("/(tabs)/medicines");
          } else {
            Alert.alert("Lỗi", response.errorMessage);
          }
        },
      },
      { text: "Hủy", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi Tiết Thuốc</Text>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Mã Thuốc:</Text>
        <Text style={styles.value}>TH{medicine?.id}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Tên Thuốc:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={medicineName}
            onChangeText={setMedicineName}
          />
        ) : (
          <Text style={styles.value}>{medicineName}</Text>
        )}
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Giá Thuốc:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={salePrice}
            onChangeText={setSalePrice}
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.value}>{salePrice} VND</Text>
        )}
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Số Lượng Tồn:</Text>

        <Text style={styles.value}>{stockQuantity}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Đơn Vị:</Text>
        {isEditing ? (
          <TextInput style={styles.input} value={unit} onChangeText={setUnit} />
        ) : (
          <Text style={styles.value}>{unit}</Text>
        )}
      </View>

      {/* Nút Cập Nhật */}
      {!isEditing ? (
        <MyButton
          title="Sửa"
          onPress={handleUpdate}
          buttonStyle={{ backgroundColor: "#1E88E5", marginTop: 20 }}
        />
      ) : (
        <MyButton
          title="Lưu"
          onPress={handleSave}
          buttonStyle={{ backgroundColor: "#28a745", marginTop: 20 }}
        />
      )}

      {/* Nút Xóa */}
      <MyButton
        title="Xóa"
        onPress={handleDelete}
        buttonStyle={{ backgroundColor: "red", marginTop: 10 }}
      />
    </View>
  );
};

export default MedicineDetails;

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
    color: "black",
  },
  detailContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "#333",
  },
  value: {
    fontSize: 16,
    flex: 2,
    color: "#555",
  },
  input: {
    fontSize: 16,
    flex: 2,
    color: "#555",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },
});
