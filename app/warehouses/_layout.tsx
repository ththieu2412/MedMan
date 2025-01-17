import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const WarehouseLayout = () => {
  return (
    <Stack>
      {/* <Stack.Screen name="exportReceipts" options={{ headerShown: false }} />
      <Stack.Screen name="importReceipts" options={{ headerShown: false }} /> */}
      <Stack.Screen name="medicines" options={{ headerShown: false }} />
      <Stack.Screen name="warehouses" options={{ headerShown: false }} />
    </Stack>
  );
};

export default WarehouseLayout;

const styles = StyleSheet.create({});
