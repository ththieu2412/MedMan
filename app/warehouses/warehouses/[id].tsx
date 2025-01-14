import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert, TextInput, Switch } from "react-native";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import {
  detailWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "@/services/api/warehouseService"; // Import API service
import { useToken } from "@/hooks/useToken"; // Hook để lấy token

const WarehouseDetails = () => {
  const [warehouse, setWarehouse] = useState<any>(null); // Lưu thông tin kho
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Lưu thông báo lỗi nếu có
  const [isEditing, setIsEditing] = useState<boolean>(false); // Trạng thái form chỉnh sửa
  const [updatedWarehouse, setUpdatedWarehouse] = useState<any>({
    address: "", // Khởi tạo address rỗng
    is_active: false, // Khởi tạo is_active là false
  }); // Lưu thông tin kho đã thay đổi
  const { id } = useLocalSearchParams(); // Lấy id từ URL
  const token = useToken(); // Lấy token cho API call
  const router = useRouter();

  console.log("ID warehouse: ", id);
  // Hàm lấy dữ liệu chi tiết kho
  const fetchWarehouseDetails = async () => {
    if (!id) return;

    try {
      const data = await detailWarehouse(token, Number(id)); // Gọi API để lấy chi tiết kho
      setWarehouse(data.data); // Lưu dữ liệu vào state
      setUpdatedWarehouse({
        address: data.data.address, // Cập nhật address
        is_active: data.data.is_active, // Cập nhật is_active
      });
      setLoading(false); // Dừng trạng thái loading
      setError(null); // Đặt lỗi thành null khi lấy thành công
    } catch (error: any) {
      setLoading(false); // Dừng trạng thái loading khi có lỗi
      setError("Không thể tải thông tin kho. Vui lòng thử lại.");
    }
  };

  // Gọi fetchWarehouseDetails khi component được mount
  useEffect(() => {
    fetchWarehouseDetails();
  }, [id]);

  // Xử lý cập nhật kho
  const handleUpdate = async () => {
    if (!updatedWarehouse) return;
    console.log("Cập nhật kho:", updatedWarehouse);
    try {
      // Gọi API cập nhật kho
      const response = await updateWarehouse(
        token,
        warehouse.id,
        updatedWarehouse
      );
      console.log("Cập nhật kho thành công:", updatedWarehouse);
      console.log("Cập nhật kho thành công:", response);

      // Sau khi cập nhật thành công, tải lại thông tin kho
      fetchWarehouseDetails(); // Gọi lại hàm để tải lại dữ liệu kho mới từ server

      Alert.alert("Cập nhật kho thành công!");
      setIsEditing(false); // Tắt chế độ chỉnh sửa
    } catch (error) {
      console.error("Cập nhật kho thất bại:", error);
      Alert.alert("Cập nhật kho thất bại. Vui lòng thử lại.");
    }
  };

  // Xử lý xóa kho
  const handleDelete = async () => {
    if (!warehouse) return;

    Alert.alert("Xóa Kho", "Bạn có chắc chắn muốn xóa kho này không?", [
      {
        text: "Xóa",
        onPress: async () => {
          try {
            const response = await deleteWarehouse(token, warehouse.id);
            console.log(`Đã xóa kho: ${warehouse.id}`, response.errorMessage);
            router.replace("/warehouses/warehouses/list"); // Điều hướng về danh sách kho
            Alert.alert("Xóa kho thành công!");
          } catch (error) {
            console.error("Xóa kho thất bại:", error);
            Alert.alert("Xóa kho thất bại. Vui lòng thử lại.");
          }
        },
      },
      { text: "Hủy", style: "cancel" },
    ]);
  };

  // Hiển thị giao diện khi có lỗi
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{error}</Text>
      </View>
    );
  }

  // Hiển thị giao diện khi đang loading
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Hiển thị thông tin chi tiết kho
  if (warehouse) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chi Tiết Kho</Text>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Mã Kho:</Text>
          <Text style={styles.value}>{warehouse.id}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Tên Kho:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={updatedWarehouse.warehouse_name} // Dùng updatedWarehouse.warehouse_name
              onChangeText={
                (text) =>
                  setUpdatedWarehouse({
                    ...updatedWarehouse,
                    warehouse_name: text,
                  }) // Cập nhật giá trị
              }
            />
          ) : (
            <Text style={styles.value}>{warehouse.warehouse_name}</Text>
          )}
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Địa Chỉ:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={updatedWarehouse.address} // Dùng updatedWarehouse.address
              onChangeText={
                (text) =>
                  setUpdatedWarehouse({ ...updatedWarehouse, address: text }) // Cập nhật giá trị
              }
            />
          ) : (
            <Text style={styles.value}>{warehouse.address}</Text>
          )}
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Trạng Thái:</Text>
          {isEditing ? (
            <Switch
              value={updatedWarehouse.is_active} // Dùng updatedWarehouse.is_active
              onValueChange={
                (value) =>
                  setUpdatedWarehouse({ ...updatedWarehouse, is_active: value }) // Cập nhật giá trị
              }
            />
          ) : (
            <Text style={styles.value}>
              {warehouse.is_active ? "Hoạt động" : "Không hoạt động"}
            </Text>
          )}
        </View>

        {isEditing ? (
          <>
            <MyButton
              title="Lưu"
              onPress={handleUpdate}
              buttonStyle={{ backgroundColor: "#1E88E5", marginTop: 20 }}
            />
            <MyButton
              title="Hủy"
              onPress={() => setIsEditing(false)}
              buttonStyle={{ backgroundColor: "gray", marginTop: 10 }}
            />
          </>
        ) : (
          <>
            <MyButton
              title="Cập Nhật"
              onPress={() => setIsEditing(true)}
              buttonStyle={{ backgroundColor: "#1E88E5", marginTop: 20 }}
            />
            <MyButton
              title="Xóa"
              onPress={handleDelete}
              buttonStyle={{ backgroundColor: "red", marginTop: 10 }}
            />
          </>
        )}
      </View>
    );
  }
};

export default WarehouseDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "black",
  },
  detailContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "black",
  },
  value: {
    fontSize: 16,
    flex: 2,
    color: "black",
  },
  input: {
    fontSize: 16,
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 5,
    color: "black",
  },
});
