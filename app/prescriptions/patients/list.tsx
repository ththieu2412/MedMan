import React from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Patient } from "@/types";

const PatientListScreen = ({ patients }: { patients: Patient[] }) => {
  const renderItem = ({ item }: { item: Patient }) => {
    // Lựa chọn ảnh đại diện dựa trên giới tính
    const avatarSource =
      item.gender === true
        ? require("@/assets/images/avatar/man.png") // Giới tính nam
        : require("@/assets/images/avatar/woman.png"); // Giới tính nữ

    return (
      <Link href={`/prescriptions/patients/${item.id}`} asChild>
        <TouchableOpacity style={styles.item}>
          <View style={styles.itemContent}>
            <Image source={avatarSource} style={styles.avatar} />
            <View>
              <Text style={styles.code}>{item.id_card}</Text>
              <Text style={styles.name}>{item.full_name}</Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={18} color="#888" />
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <FlatList
      data={patients}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
    />
  );
};

export default PatientListScreen;

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    transitionDuration: "0.3s",
    transform: [{ scale: 1.0 }],
  },
  itemContent: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  code: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    color: "#333",
  },
  itemHover: {
    transform: [{ scale: 1.05 }], // Thêm hiệu ứng hover nhẹ khi nhấn vào item
  },
});
