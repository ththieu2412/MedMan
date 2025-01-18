import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import {
  createER,
  employeeDetail,
  getPrescriptionNoER,
  getWarehouseList,
  searchEmployeeByRole,
} from "@/services/api"; // API function để lấy đơn thuốc và nhà kho
import { useAuth } from "@/context/AuthContext";

const AddExportReceiptScreen = () => {
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [employee, setEmployee] = useState(null);
  const router = useRouter();
  const user = useAuth();
  const employee_id = user.user?.employee_id;
  // Lấy danh sách đơn thuốc chưa có phiếu nhập
  const fetchPrescriptions = async () => {
    try {
      setLoading(true); // Set loading true khi bắt đầu
      const response = await getPrescriptionNoER();
      console.log("Prescription Response:", response); // Log để kiểm tra dữ liệu trả về
      if (response.success) {
        setPrescriptionList(response.data || []);
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
      if (response.success && Array.isArray(response.data.data)) {
        setWarehouseList(response.data.data || []);
        console.log("Warehouse Response:", response.data.data);
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
  const fetchEmployeeDetail = async () => {
    try {
      const response = await employeeDetail(Number(employee_id));
      if (response.success) {
        if (response?.data?.id) {
          setEmployee(response.data?.full_name || "");
        } else {
        }
      } else {
        Alert.alert("Lỗi", "Có lỗi xảy ra khi tải thông tin nhân viên.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tải thông tin nhân viên.");
    }
  };
  useEffect(() => {
    fetchEmployeeDetail();
    fetchPrescriptions();
    fetchWarehouses();
  }, []);

  // Xử lý khi người dùng chọn đơn thuốc và nhấn thêm phiếu xuất
  const handleAddExportReceipt = async () => {
    if (!selectedPrescription || !selectedWarehouse) {
      Alert.alert("Lỗi", "Vui lòng chọn một đơn thuốc và một nhà kho.");
      return;
    }

    try {
      const payload = {
        prescription: Number(selectedPrescription),
        warehouse: Number(selectedWarehouse),
        employee: Number(employee_id), // Gửi kèm thông tin nhân viên
      };
      console.log("phản ", payload);
      const response = await createER(payload); // Gọi API tạo phiếu xuất
      console.log("phản ", response.data.data);
      if (response.success) {
        console.log("susscess");
        if (response.data.id) {
          Alert.alert("Thành công", "Phiếu xuất đã được thêm thành công.");
          router.push("/warehouses/exportReceipts/list");
          console.log("phảnjjj ", response.data.data);
        } else {
          console.log("phảnjjj ", response.data);
        }
        // Chuyển hướng về danh sách phiếu xuất
      } else {
        console.log("phản lỗi  ", response.data);
        Alert.alert(
          "Lỗi",
          response.errorMessage || "Không thể thêm phiếu xuất."
        );
      }
    } catch (error) {
      console.log("phản lỗi catch ", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi thêm phiếu xuất.");
    }
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
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nhân viên:</Text>
        <TextInput
          style={styles.input}
          value={employee || ""}
          editable={false}
          placeholder="Thông tin nhân viên..."
        />
      </View>
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
                label={`Kho ${warehouse.warehouse_name}`}
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
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
  },
});

export default AddExportReceiptScreen;
