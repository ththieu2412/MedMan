import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const PrescriptionsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="patients" options={{ headerShown: false }} />
      <Stack.Screen name="prescriptions" options={{ headerShown: false }} />
    </Stack>
  );
};

export default PrescriptionsLayout;

const styles = StyleSheet.create({});
