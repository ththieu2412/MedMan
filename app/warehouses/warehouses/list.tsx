import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { getWarehouseList } from "@/services/api/warehouseService"; // API call để lấy danh sách nhà kho
import { useToken } from "@/hooks/useToken"; // Hook để lấy token
import { Warehouse } from "@/types"; // Định nghĩa kiểu Warehouse
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]); // Khởi tạo state để chứa dữ liệu nhà kho
  const router = useRouter();
  const token = useToken();

  // Hàm lấy danh sách nhà kho
  const fetchData = async () => {
    try {
      const data = await getWarehouseList(token);
      setWarehouses(data.data); // Gán dữ liệu vào state
    } catch (error: any) {
      console.error("Error fetching warehouse list:", error.message);
    }
  };

  // Gọi fetchData khi component được mount
  useEffect(() => {
    fetchData();
  }, []);

  // Sử dụng useFocusEffect để gọi lại fetchData khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData(); // Fetch lại dữ liệu mỗi khi màn hình được focus
    }, [])
  );

  // Render mỗi item trong danh sách
  const renderItem = ({ item }: { item: Warehouse }) => (
    <Link href={`/warehouses/warehouses/${item.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        {/* Hiển thị thông tin nhà kho */}
        <View style={styles.info}>
          <Text style={styles.name}>Tên kho: {item.warehouse_name}</Text>
          <Text style={styles.price}>Địa chỉ: {item.address}</Text>
          <Text style={styles.quantity}>
            Trạng thái: {item.is_active ? "Hoạt động" : "Không hoạt động"}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Nút Thêm Kho */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("warehouses/warehouses/add")}
      >
        <Text style={styles.addButtonText}>+ Thêm Kho</Text>
      </TouchableOpacity>

      {/* Danh sách nhà kho */}
      <FlatList
        data={warehouses} // Sử dụng dữ liệu từ state
        keyExtractor={(item) => item.id.toString()} // Sử dụng id của nhà kho làm key
        renderItem={renderItem} // Hàm render mỗi item
        contentContainerStyle={styles.container} // Style cho nội dung FlatList
      />
    </View>
  );
};

// Styles cho giao diện
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
  addButton: {
    backgroundColor: "#1E88E5",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WarehouseList;
