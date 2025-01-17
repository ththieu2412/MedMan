import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
  Switch,
} from "react-native";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import {
  detailER,
  deleteER,
  updateERAndDetails,
  getMedicineList,
  detailWarehouse,
  employeeDetail,
} from "@/services/api/index";
import { useToken } from "@/hooks/useToken";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const ExportReceiptDetails = () => {
  const [exportDetails, setExportDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false); // Chế độ chỉnh sửa
  const [isProductEditable, setIsProductEditable] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newMedicine, setNewMedicine] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [employeeName, setEmployeeName] = useState<string | null>(null);
  const [warehouseName, setWarehouseName] = useState<string | null>(null);
  const { id } = useLocalSearchParams();
  const token = useToken();
  const router = useRouter();
  const [medicines, setMedicines] = useState<any[]>([]);

  const fetchExportDetails = async () => {
    if (!Number(id)) {
      setError("Không tìm thấy mã phiếu xuất.");
      setLoading(false);
      return;
    }
    try {
      const data = await detailER(Number(id));
      if (data?.data?.id) {
        setExportDetails(data.data);
        setError(null);
        await fetchAdditionalDetails(data.data);
      } else {
        setError("Dữ liệu phiếu xuất không hợp lệ.");
      }
    } catch (err: any) {
      setError("Không thể tải thông tin phiếu xuất. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdditionalDetails = async (exportData: any) => {
    try {
      if (exportData.employee) {
        const employeeData = await employeeDetail(exportData.employee);
        if (employeeData?.full_name) {
          setEmployeeName(employeeData.full_name);
        } else {
          setEmployeeName("Không xác định");
        }
      }
      if (exportData?.warehouse) {
        const warehouseData = await detailWarehouse(exportData.warehouse);
        if (warehouseData?.data?.data?.warehouse_name) {
          setWarehouseName(warehouseData.data.data.warehouse_name);
        } else {
          setWarehouseName("Không xác định");
        }
      }
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.message ||
          "Không thể tải thông tin nhân viên hoặc kho. Vui lòng thử lại."
      );
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await getMedicineList();
      if (response?.data && Array.isArray(response.data)) {
        const availableMedicines = response.data.filter((medicine: any) => {
          return !exportDetails?.details?.some(
            (detail: any) => detail.medicine === medicine.id
          );
        });

        const options = availableMedicines.map((medicine: any) => ({
          label: medicine.medicine_name,
          value: medicine.id,
          sale_price: medicine.sale_price,
          stock_quantity: medicine.stock_quantity,
        }));
        setMedicines(options);
      } else {
        Alert.alert("Lỗi", "Dữ liệu thuốc không đúng định dạng.");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải danh sách thuốc.");
    }
  };

  const onRefresh = async () => {
    setLoading(true);
    await fetchExportDetails();
    setLoading(false);
  };

  const toggleApproveStatus = async (value: boolean) => {
    try {
      const updatedData = {
        ...exportDetails,
        is_approved: value,
      };
      await updateERAndDetails(id, updatedData); // Gọi API để cập nhật trạng thái
      setExportDetails(updatedData);
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.message || "Không thể cập nhật trạng thái. Vui lòng thử lại."
      );
    }
  };

  const handleAddProduct = () => {
    if (!newMedicine) {
      Alert.alert("Lỗi", "Vui lòng chọn thuốc.");
      return;
    }
    const selectedMedicine = medicines.find(
      (medicine) => medicine.value === newMedicine
    );
    const newProduct = {
      medicine_name: selectedMedicine?.label || "Unknown",
      quantity: newQuantity,
    };

    setExportDetails((prevDetails: any) => ({
      ...prevDetails,
      details: [...prevDetails.details, newProduct],
    }));
    setModalVisible(false);
  };

  const handleDelete = async () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa phiếu xuất này?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteER(Number(id)); // Gọi API xóa phiếu xuất
              Alert.alert("Thành công", "Phiếu xuất đã được xóa.");
              router.replace("/warehouses/exportReceipts/list"); // Điều hướng sau khi xóa
            } catch (error: any) {
              Alert.alert(
                "Lỗi",
                error.message || "Không thể xóa phiếu xuất. Vui lòng thử lại."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    fetchExportDetails();
  }, []);

  useEffect(() => {
    if (exportDetails) {
      fetchMedicines();
    }
  }, [exportDetails]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Chi Tiết Phiếu Xuất</Text>
        <TouchableOpacity
          style={styles.editApproveButton}
          onPress={() => setIsEditing(!isEditing)} // Bật/tắt chế độ chỉnh sửa
        >
          <Ionicons
            name={isEditing ? "checkmark-done-circle" : "create"}
            size={24}
            color="#1a73e8"
          />
        </TouchableOpacity>

        {exportDetails && (
          <>
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Mã Phiếu Xuất:</Text>
              <Text style={styles.value}>{exportDetails.id}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Đơn Thuốc:</Text>
              <Text style={styles.value}>{exportDetails.prescription}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Kho:</Text>
              <Text style={styles.value}>{warehouseName}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Tổng Tiền:</Text>
              <Text style={styles.value}>{exportDetails.total_amount}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Ngày Xuất:</Text>
              <Text style={styles.value}>
                {new Date(exportDetails.export_date).toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Nhân Viên:</Text>
              <Text style={styles.value}>
                {employeeName || "Không xác định"}
              </Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Trạng thái:</Text>
              {/* Chỉ cho phép chỉnh sửa khi isEditing = true */}
              <Switch
                value={exportDetails.is_approved}
                onValueChange={toggleApproveStatus}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={exportDetails.is_approved ? "#f5dd4b" : "#f4f3f4"}
                disabled={!isEditing} // Disable khi không chỉnh sửa
              />
              <Text style={styles.value}>
                {exportDetails.is_approved ? "Duyệt" : "Chưa duyệt"}
              </Text>
            </View>

            {/* Chỉnh sửa số lượng thuốc */}
            {isEditing && (
              <View>
                <Text style={styles.label}>Số Lượng:</Text>
                <TextInput
                  style={styles.input}
                  value={newQuantity.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) => setNewQuantity(Number(text))}
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Thêm Thuốc</Text>
            </TouchableOpacity>

            {/* Modal để thêm thuốc */}
            <Modal
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
              transparent={true}
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Picker
                    selectedValue={newMedicine}
                    onValueChange={(itemValue) => setNewMedicine(itemValue)}
                  >
                    {medicines.map((medicine) => (
                      <Picker.Item
                        key={medicine.value}
                        label={medicine.label}
                        value={medicine.value}
                      />
                    ))}
                  </Picker>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleAddProduct}
                  >
                    <Text style={styles.buttonText}>Thêm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Hủy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        )}
      </ScrollView>

      {/* Xóa phiếu xuất */}
      <MyButton title="Xóa Phiếu Xuất" onPress={handleDelete} />
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  detailContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    width: "30%",
  },
  value: {
    width: "70%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1a73e8",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  editApproveButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
});

export default ExportReceiptDetails;
