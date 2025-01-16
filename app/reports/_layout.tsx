import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { iconSize } from "@/constants/dimensions"; // Bạn có thể thay đổi giá trị cho `iconSize` nếu cần

const ReportLayout = () => {
  const router = useRouter();

  // Hàm quay lại trang chủ hoặc một trang nào đó
  const backHome = () => {
    router.replace("/(tabs)"); // Điều hướng về trang chủ hoặc một tab chính
  };

  return (
    <Stack>
      {/* Báo cáo Nhập Hàng */}
      <Stack.Screen
        name="reportImportReceipt"
        options={{
          title: "Báo Cáo Phiếu Nhập Hàng",
          headerShown: true,
          headerTintColor: "#FFFFFF",
          headerStyle: {
            backgroundColor: "#1E90FF", // Màu nền header
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={backHome} style={styles.icon}>
              <Ionicons name={"arrow-back"} size={iconSize.md} color="white" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Báo cáo Hoạt Động Nhân Viên */}
      <Stack.Screen
        name="reportEmployeeActivity"
        options={{
          title: "Báo Cáo Hoạt Động Nhân Viên",
          headerShown: true,
          headerTintColor: "#FFFFFF",
          headerStyle: {
            backgroundColor: "#1E90FF", // Màu nền header
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={backHome} style={styles.icon}>
              <Ionicons name={"arrow-back"} size={iconSize.md} color="white" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Báo cáo Tồn Kho */}
      <Stack.Screen
        name="reportInventory"
        options={{
          title: "Báo Cáo Tồn Kho",
          headerShown: true,
          headerTintColor: "#FFFFFF",
          headerStyle: {
            backgroundColor: "#1E90FF", // Màu nền header
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={backHome} style={styles.icon}>
              <Ionicons name={"arrow-back"} size={iconSize.md} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default ReportLayout;

const styles = StyleSheet.create({
  icon: {
    marginLeft: 10, // Căn trái cho icon quay lại
  },
});
