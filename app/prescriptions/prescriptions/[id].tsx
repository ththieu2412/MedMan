import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native"; // Import from react-navigation
import MyButton from "@/components/MyButton";
import { router } from "expo-router";
import { spacing } from "@/constants/dimensions";

const PrescriptionDetail = () => {
  const route = useRoute(); // Get route from useRoute hook

  const navigation = useNavigation();

  // Hàm điều hướng về danh sách đơn thuốc
  const handleBack = () => {
    navigation.goBack(); // Use navigation to go back
  };

  // if (!prescription) {
  //   return <Text>Không tìm thấy thông tin đơn thuốc.</Text>; // Fallback if prescription is not available
  // }

  const handleEdit = () => {
    Alert.alert("Xác nhận", "Bạn có muốn tạo nhân viên mới?", [
      {
        text: "Đồng ý",
        onPress: () => {
          console.log("Nhân viên đã được tạo!");
          router.push(`/(tabs)/prescriptions`);
        },
      },
      {
        text: "Hủy",
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.heading}>Chi Tiết Đơn Thuốc</Text>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Bác sĩ:</Text>
          <Text style={styles.value}>NGUYEN VAN A</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Bệnh nhân:</Text>
          <Text style={styles.value}>PHAN VAN B</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Ngày kê đơn:</Text>
          <Text style={styles.value}>12.03.2025</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Hướng dẫn:</Text>
          <Text style={styles.value}>ABCXYZ</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Chẩn đoán:</Text>
          <Text style={styles.value}>XYZABC</Text>
        </View>

        {/* Các nút để quay lại */}
        <View style={styles.buttonContainer}>
          <MyButton
            title="Sửa"
            onPress={handleEdit}
            buttonStyle={{ marginBottom: spacing.md }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default PrescriptionDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  scrollView: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2c3e50",
  },
  detailContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2980b9",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#34495e",
  },
  buttonContainer: {
    marginTop: 20,
  },
});
