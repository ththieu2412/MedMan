import { View, Text, Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Header from "@/components/Home/Header";
import Slider from "@/components/Home/Slider";
import Categories from "@/components/Home/Categories";
import SearchText from "@/components/SearchText";
import { useAuth } from "@/context/AuthContext";

export default function HomeScreen() {
  const user = useAuth();
  // console.log("Home user: ", user);
  return (
    <View>
      <Header />
      {/* <SearchText placeholder={"Tìm kiếm"} /> */}
      <Slider />
      <Categories />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
