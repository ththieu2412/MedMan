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
} from "react-native";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import {
  detailER,
  deleteER,
  updateERAndDetails,
  getMedicineList,
} from "@/services/api/index";
import { useToken } from "@/hooks/useToken";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; // Import RNPicker

const ExportReceiptDetails = () => {
  const [exportDetails, setExportDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isProductEditable, setIsProductEditable] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newMedicine, setNewMedicine] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(1);

  const { id } = useLocalSearchParams();
  const token = useToken();
  const router = useRouter();
  const [medicines, setMedicines] = useState<any[]>([]);

  // Fetch export details
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
      } else {
        setError("Dữ liệu phiếu xuất không hợp lệ.");
      }
    } catch (err: any) {
      setError("Không thể tải thông tin phiếu xuất. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch medicines list
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

  // Refresh data
  const onRefresh = async () => {
    setLoading(true);
    await fetchExportDetails();
    setLoading(false);
  };

  // Add product to export receipt
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

  // Fetch data when component is mounted
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Chi Tiết Phiếu Xuất</Text>

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
            <Text style={styles.value}>
              {exportDetails.warehouse?.warehouse_name}
            </Text>
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
              {exportDetails.employee?.full_name || "Không xác định"}
            </Text>
          </View>

          {/* Product List */}
          <View>
            {exportDetails.details.map((detail: any, index: number) => (
              <View key={index} style={styles.productDetail}>
                <Text style={styles.productDetailText}>
                  Thuốc: {detail.medicine_name} - Số lượng: {detail.quantity}
                </Text>
              </View>
            ))}
          </View>

          {/* Add Product */}
          <TouchableOpacity
            style={styles.addProductButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle" size={70} color="#1a73e8" />
          </TouchableOpacity>

          {/* Modal to Add Product */}
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Thêm Sản Phẩm</Text>
                <Picker
                  selectedValue={newMedicine}
                  onValueChange={(itemValue) => setNewMedicine(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Chọn thuốc" value="" />
                  {medicines.map((medicine) => (
                    <Picker.Item
                      key={medicine.value}
                      label={medicine.label}
                      value={medicine.value}
                    />
                  ))}
                </Picker>
                <TextInput
                  style={styles.input}
                  value={String(newQuantity)}
                  onChangeText={(text) => setNewQuantity(Number(text))}
                  keyboardType="numeric"
                  placeholder="Nhập số lượng"
                />
                <MyButton
                  title="Thêm"
                  onPress={handleAddProduct}
                  buttonStyle={styles.addButton}
                />
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeModal}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1a73e8",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  input: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 5,
    fontSize: 16,
  },
  detailContainer: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
  },
  toggleButton: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#1a73e8",
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  productDetailsContainer: {
    marginTop: 10,
  },
  productDetail: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
  },
  productDetailText: {
    fontSize: 14,
  },
  updateButton: {
    backgroundColor: "#4caf50",
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "#d32f2f",
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  editButton: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  addProductButton: {
    position: "absolute",
    right: -10,
    bottom: -150,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4caf50",
    marginTop: 10,
  },
  closeModal: {
    marginTop: 20,
    textAlign: "center",
    color: "#1a73e8",
    fontWeight: "600",
  },
});

export default ExportReceiptDetails;
