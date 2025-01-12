import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { iconSize } from "@/constants/dimensions";

const PatientsLayout = () => {
  const router = useRouter();
  const backHome = () => {
    router.replace("/(tabs)/patients");
  };

  return (
    <Stack>
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
          title: "Chi Tiết",
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
    </Stack>
  );
};

export default PatientsLayout;

const styles = StyleSheet.create({
  icon: {
    marginRight: 50,
  },
});
