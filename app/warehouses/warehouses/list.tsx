import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { getWarehouseList } from "@/services/api/warehouseService"; // API call để lấy danh sách nhà kho
import { useToken } from "@/hooks/useToken"; // Hook để lấy token
import { Warehouse } from "@/types"; // Định nghĩa kiểu Warehouse
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import { searchWarehouses } from "@/services/api/warehouseService"; // Hàm tìm kiếm

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]); // Khởi tạo state để chứa dữ liệu nhà kho
  const [address, setAddress] = useState(""); // State để lưu địa chỉ tìm kiếm
  const [isActive, setIsActive] = useState(false); // State để lưu trạng thái hoạt động của kho
  const [loading, setLoading] = useState(false); // State để kiểm tra trạng thái đang tải
  const router = useRouter();
  const token = useToken();

  // Hàm lấy danh sách nhà kho
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getWarehouseList();
      console.log("Data gtruocw  ======: ", data.data);
      if (data.success) {
        // if (Array.isArray(data.data)) {
        setWarehouses(data.data.data);
        // Alert.alert("Thành công", "Đã load.");
      } else {
        Alert.alert("Lỗi", data.errorMessage);
        // router.replace("/warehouses/warehouses/list");
      }
      // Gán dữ liệu vào state
    } catch (error: any) {
      Alert.alert("Lỗi", error || "Không thể lấy danh sách kho.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm kho theo các tham số
  const handleSearch = async () => {
    // Kiểm tra nếu ít nhất một tham số tìm kiếm đã được nhập
    if (!address && !isActive) {
      // Hiển thị thông báo lỗi hoặc không thực hiện tìm kiếm nếu không có tham số tìm kiếm
      alert(
        "Vui lòng nhập ít nhất một thông tin tìm kiếm (địa chỉ hoặc trạng thái kho)."
      );
      return; // Dừng hàm nếu không có tham số tìm kiếm
    }

    setLoading(true);
    const result = await searchWarehouses(address, isActive ? "true" : "false");
    setLoading(false);
    setWarehouses(result.data.data || []); // Cập nhật danh sách kho
  };

  // Hàm lấy lại tất cả các kho (xóa các tham số tìm kiếm và tải lại danh sách)
  const handleReset = () => {
    setAddress(""); // Xóa địa chỉ tìm kiếm
    setIsActive(false); // Đặt lại trạng thái là false
    fetchData(); // Lấy lại toàn bộ danh sách kho
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

  console.log("Dữ liệu warehoues: ", warehouses);

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
      {/* Form tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tìm theo địa chỉ kho"
          value={address}
          onChangeText={setAddress}
        />

        {/* Switch để tìm kiếm theo trạng thái kho */}
        <View style={styles.switchContainer}>
          <Text>Trạng thái kho</Text>
          <Switch value={isActive} onValueChange={setIsActive} />
        </View>

        <Button title="Tìm kiếm" onPress={handleSearch} />
      </View>

      {/* Nút Lấy lại tất cả kho */}
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Lấy lại tất cả kho</Text>
      </TouchableOpacity>

      {/* Nút Thêm Kho */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/warehouses/warehouses/add")}
      >
        <Text style={styles.addButtonText}>Thêm Kho</Text>
      </TouchableOpacity>

      {/* Danh sách nhà kho */}
      {loading ? (
        <Text>Đang tải...</Text>
      ) : (
        <FlatList
          data={warehouses} // Sử dụng dữ liệu từ state
          keyExtractor={(item) => item.id.toString()} // Sử dụng id của nhà kho làm key
          renderItem={renderItem} // Hàm render mỗi item
          contentContainerStyle={styles.container} // Style cho nội dung FlatList
        />
      )}
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
  resetButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchContainer: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default WarehouseList;
