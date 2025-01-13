import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Header from "@/components/Home/Header";
import SearchText from "@/components/SearchText";
import MedicineList from "../warehouses/medicines/list";
import * as Animatable from "react-native-animatable"; // Import animatable
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { useToken } from "@/hooks/useToken";

const Medicines = () => {
  const router = useRouter();

  const handleAdd = () => {
    router.push("/warehouses/medicines/add");
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* Thêm hiệu ứng cho SearchText */}
      <Animatable.View
        animation="fadeInDown"
        duration={1000}
        style={styles.searchContainer}
      >
        <SearchText placeholder="Nhập tên thuốc" />
      </Animatable.View>

      {/* Tiêu đề Danh Mục Thuốc */}
      <Animatable.Text
        animation="bounceIn"
        duration={1500}
        style={styles.title}
      >
        DANH MỤC THUỐC
      </Animatable.Text>

      {/* Hiển thị danh sách thuốc */}
      <Animatable.View
        animation="fadeInUpBig"
        duration={1000}
        style={styles.medicineListContainer}
      >
        <MedicineList />
      </Animatable.View>

      {/* Thêm nút thuốc */}
      <MyButton
        title={"Thêm thuốc"}
        style={styles.addButton}
        onPress={handleAdd}
      />
    </View>
  );
};

export default Medicines;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f9f9f9", // Màu nền nhẹ nhàng
  },
  searchContainer: {
    marginVertical: 15,
  },
  title: {
    fontSize: 26, // Độ lớn chữ vừa phải
    fontWeight: "700",
    color: "#333", // Màu chữ tối
    textAlign: "center",
    letterSpacing: 1.5, // Giãn cách chữ một chút
    marginVertical: 20,
  },
  medicineListContainer: {
    flex: 1,
    marginBottom: 30, // Khoảng cách dưới lớn hơn
  },
  addButton: {
    backgroundColor: "#4CAF50", // Màu nền nút
    paddingVertical: 12, // Padding lớn hơn để nút dễ nhấn
    paddingHorizontal: 25,
    borderRadius: 25, // Bo góc mềm mại hơn
    position: "absolute",
    bottom: 30, // Cách đáy màn hình lớn hơn
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Tạo độ bóng mờ
  },
});
