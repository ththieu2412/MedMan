import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { getPrescriptionNoER, getWarehouseList } from "@/services/api"; // API function để lấy đơn thuốc và nhà kho

const AddExportReceiptScreen = () => {
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();

  // Lấy danh sách đơn thuốc chưa có phiếu nhập
  const fetchPrescriptions = async () => {
    try {
      setLoading(true); // Set loading true khi bắt đầu
      const response = await getPrescriptionNoER();
      console.log("Prescription Response:", response); // Log để kiểm tra dữ liệu trả về
      if (response.success) {
        setPrescriptionList(response.data.details || []);
      } else {
        Alert.alert(
          "Lỗi",
          response.errorMessage || "Không thể tải danh sách đơn thuốc."
        );
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tải danh sách đơn thuốc.");
    } finally {
      setLoading(false); // Đảm bảo set loading thành false sau khi xong
    }
  };

  // Lấy danh sách nhà kho
  const fetchWarehouses = async () => {
    try {
      const response = await getWarehouseList();
      console.log("Warehouse Response:", response); // Log để kiểm tra dữ liệu trả về
      // Kiểm tra xem dữ liệu có phải là mảng không
      if (response.success && Array.isArray(response.data)) {
        setWarehouseList(response.data.data || []);
        console.log("Warehouse Response:", response.data.data.data.data);
      } else {
        Alert.alert(
          "Lỗi",
          response.errorMessage || "Không thể tải danh sách nhà kho."
        );
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tải danh sách nhà kho.");
    } finally {
      // Không cần set lại loading ở đây, vì đã set loading = false trong `fetchPrescriptions()`
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    fetchWarehouses();
  }, []);

  // Xử lý khi người dùng chọn đơn thuốc và nhấn thêm phiếu xuất
  const handleAddExportReceipt = () => {
    if (!selectedPrescription || !selectedWarehouse) {
      Alert.alert("Lỗi", "Vui lòng chọn một đơn thuốc và một nhà kho.");
      return;
    }
    // Xử lý thêm phiếu xuất (ví dụ: gửi API tạo phiếu xuất)
    Alert.alert(
      "Thông báo",
      `Đã chọn đơn thuốc: ${selectedPrescription} và kho: ${selectedWarehouse}`
    );
    // router.push("/warehouses/exportReceipts"); // Chuyển hướng về danh sách phiếu xuất
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Phiếu Xuất Kho</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Chọn Đơn Thuốc</Text>
        <Picker
          selectedValue={selectedPrescription}
          onValueChange={(itemValue) => setSelectedPrescription(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Chọn đơn thuốc" value={null} />
          {prescriptionList.map((prescription) => (
            <Picker.Item
              key={prescription.id}
              label={`Đơn thuốc ${prescription.id}`}
              value={prescription.id}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Chọn Nhà Kho</Text>
        <Picker
          selectedValue={selectedWarehouse}
          onValueChange={(itemValue) => setSelectedWarehouse(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Chọn nhà kho" value={null} />
          {Array.isArray(warehouseList) && warehouseList.length > 0 ? (
            warehouseList.map((warehouse) => (
              <Picker.Item
                key={warehouse.id}
                label={`Kho ${warehouse.warehouse_namename}`}
                value={warehouse.id}
              />
            ))
          ) : (
            <Picker.Item label="Không có nhà kho" value={null} />
          )}
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleAddExportReceipt}
      >
        <Text style={styles.submitButtonText}>Thêm Phiếu Xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddExportReceiptScreen;
