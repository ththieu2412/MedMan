import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { iconSize } from "@/constants/dimensions";

const ERLayout = () => {
  const router = useRouter();
  const backHome = () => {
    router.push("/(tabs)");
    // const backHome = () => {
    //   Alert.alert(
    //     "Xác nhận thoát",
    //     "Bạn có chắc chắn muốn thoát không? Các thay đổi chưa được lưu sẽ bị mất.",
    //     [
    //       { text: "Hủy", style: "cancel" },
    //       {
    //         text: "Thoát",
    //         onPress: () => router.replace("/warehouses/importReceipts/list"),
    //       },
    //     ]
    //   );
    // };
  };

  return (
    <Stack>
      <Stack.Screen
        name="list"
        options={{
          title: "Danh sách",
          headerShown: true,
          headerTintColor: "#FFFFFF",
          headerStyle: {
            backgroundColor: "#1E90FF",
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
      <Stack.Screen
        name="add"
        options={{
          title: "Thêm Mới",
          headerShown: true,
          headerTintColor: "#FFFFFF",
          headerStyle: {
            backgroundColor: "#1E90FF",
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
      <Stack.Screen
        name="[id]"
        options={{
          title: "Chi tiết phiếu xuất",
          headerShown: false,
          headerTintColor: "#FFFFFF",
          headerStyle: {
            backgroundColor: "#1E90FF",
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

export default ERLayout;

const styles = StyleSheet.create({
  icon: {
    marginRight: 50,
  },
});
