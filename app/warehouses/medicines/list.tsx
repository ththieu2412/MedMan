import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { getMedicineList } from "@/services/api/medicineService";
import { useToken } from "@/hooks/useToken";
import { Medicine } from "@/types";

const defaultImage = require("@/assets/images/medicine/default.jpg");

const MedicineList = ({ medicines }: { medicines: Medicine[] }) => {
  // const [medicines, setMedicines] = useState<Medicine[]>([]);
  const router = useRouter();
  // const fetchData = async () => {
  //   try {
  //     const data = await getMedicineList();
  //     setMedicines(data.data); // Gán dữ liệu vào state
  //   } catch (error: any) {
  //     console.error("Error fetching medicine list:", error.message);
  //   }
  // };

  // Gọi fetchData khi component được mount
  // useEffect(() => {
  //   fetchData();
  // }, []);

  const renderItem = ({ item }: { item: Medicine }) => (
    <Link href={`/warehouses/medicines/${item.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        {/* Ảnh thuốc */}
        <Image source={defaultImage} style={styles.image} />

        {/* Thông tin thuốc */}
        <View style={styles.info}>
          <Text style={styles.name}>{item.medicine_name}</Text>
          <Text style={styles.price}>Price: {item.sale_price} VND</Text>
          <Text style={styles.quantity}>
            Stock: {item.stock_quantity} {item.unit}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <FlatList
      data={medicines}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    width: "100%",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  info: {
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  quantity: {
    fontSize: 14,
    color: "#666",
  },
});

export default MedicineList;
