import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { AuthProvider } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { iconSize } from "@/constants/dimensions";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="accounts" options={{ headerShown: false }} />
            <Stack.Screen
              name="prescriptions"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="warehouses" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          {/* <StatusBar style="auto" /> */}
        </ThemeProvider>
      </SafeAreaView>
    </AuthProvider>
  );
}
