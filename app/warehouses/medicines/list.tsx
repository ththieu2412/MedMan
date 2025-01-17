import React from "react";
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { Medicine } from "@/types";

const defaultImage = require("@/assets/images/medicine/default.jpg");

const MedicineList = ({
  medicines,
  isEdit,
}: {
  medicines: Medicine[];
  isEdit: boolean;
}) => {
  const renderItem = ({ item }: { item: Medicine }) => (
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
      <View style={styles.cardHeader}>
        {/* Hiển thị link chỉ khi isEdit là true và đặt nó bên phải */}
        {isEdit && (
          <Link href={`/warehouses/medicines/${item.id}`} asChild>
            <Text style={styles.link}>View Details</Text>
          </Link>
        )}
      </View>
    </TouchableOpacity>
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
    borderRadius: 12, // Bo góc mềm mại
    marginBottom: 20, // Tăng khoảng cách giữa các thẻ
    padding: 15, // Thêm khoảng cách bên trong thẻ
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    width: "100%",
  },
  cardHeader: {
    flexDirection: "row", // Đặt các phần tử theo chiều ngang
    justifyContent: "flex-end", // Đưa liên kết về bên phải
    marginBottom: 10, // Khoảng cách giữa header và phần dưới
  },
  image: {
    width: "100%",
    height: 180, // Thêm chút chiều cao cho ảnh
    borderRadius: 12, // Bo góc mềm mại cho ảnh
    marginBottom: 15, // Khoảng cách giữa ảnh và thông tin
  },
  info: {
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 20, // Tăng kích thước chữ tên thuốc để dễ nhìn
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333", // Màu chữ tối cho dễ đọc
  },
  price: {
    fontSize: 18,
    color: "#5c5c5c", // Màu xám nhẹ cho giá
    marginBottom: 8,
  },
  quantity: {
    fontSize: 16,
    color: "#777", // Màu xám nhẹ cho số lượng
  },
  link: {
    fontSize: 16,
    color: "#0066cc", // Màu xanh nhẹ cho link
    fontWeight: "500", // Chữ đậm cho link
    textDecorationLine: "underline", // Gạch dưới cho link
  },
});

export default MedicineList;
