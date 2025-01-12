import React from "react";
import { StyleSheet, Text, View, Image, Alert } from "react-native";
import MyButton from "@/components/MyButton"; // Đảm bảo đường dẫn đúng với nơi bạn lưu component MyButton
import { router } from "expo-router";

const MedicineDetails = () => {
  const handleUpdate = () => {
    // Xử lý cập nhật thuốc
    Alert.alert(
      "Cập Nhật Thuốc",
      "Bạn có muốn cập nhật thông tin thuốc này không?",
      [
        {
          text: "Đồng ý",
          onPress: () => {
            console.log("Chỉnh sửa");
          },
        },
        { text: "Hủy", style: "cancel" },
      ]
    );
  };

  const handleDelete = () => {
    // Xử lý xóa thuốc
    Alert.alert("Xóa Thuốc", "Bạn có chắc chắn muốn xóa thuốc này không?", [
      {
        text: "Xóa",
        onPress: () => {
          console.log(`Đã xóa thuốc:`);
          router.replace("/(tabs)/medicines");
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
        <Text style={styles.value}>1223</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Tên Thuốc:</Text>
        <Text style={styles.value}>A</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Giá Thuốc:</Text>
        <Text style={styles.value}>25000 VND</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Số Lượng:</Text>
        <Text style={styles.value}>22</Text>
      </View>

      {/* {image ? <Image source={{ uri: image }} style={styles.image} /> : null} */}

      {/* Nút Cập Nhật */}
      <MyButton
        title="Cập Nhật"
        onPress={handleUpdate}
        buttonStyle={{ backgroundColor: "#1E88E5", marginTop: 20 }}
      />

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
  image: {
    width: 150,
    height: 150,
    marginTop: 20,
    alignSelf: "center",
  },
});
