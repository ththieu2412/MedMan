import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import {
  createImportReceiptAndDetails,
  getMedicineList,
  getWarehouseList,
  searchEmployeeByRole,
} from "@/services/api/index";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

const AddIRScreenWithDetails = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [warehouse, setWarehouse] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [itemDetails, setItemDetails] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState({
    id: null,
    medicine_name: "",
    sale_price: 0,
    stock_quantity: 0,
  });
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const user = useAuth();
  const employee_id = user.user?.employee_id;

  useEffect(() => {
    fetchMedicines();
    fetchWarehouses();
    fetchEmployees();
    calculateTotalAmount();
  }, [itemDetails]);

  const fetchMedicines = async () => {
    try {
      const response = await getMedicineList();
      if (response.data && Array.isArray(response.data)) {
        const availableMedicines = response.data.filter((medicine) => {
          // Kiểm tra nếu thuốc chưa có trong chi tiết
          return !itemDetails.some((detail) => detail.id === medicine.id);
        });

        const options = availableMedicines.map((medicine) => ({
          label: medicine.medicine_name,
          value: medicine.id,
          sale_price: medicine.sale_price,
          stock_quantity: medicine.stock_quantity,
        }));

        setMedicines(options);
      } else {
        Alert.alert("Lỗi", "Dữ liệu thuốc không đúng định dạng.");
      }
    } catch (error) {
      Alert.alert("Lỗi", error || "Không thể tải thuốc.");
    }
  };
  const fetchWarehouses = async () => {
    try {
      const response = await getWarehouseList();
      if (response.success) {
        const options = response.data.data.map((warehouse) => ({
          label: warehouse.warehouse_name,
          value: warehouse.id,
        }));
        setWarehouses(options);
      } else {
        Alert.alert("Thông báo lỗi", response.errorMessage);
      }
    } catch (error) {
      Alert.alert("Lỗi", error || "Không thể tải danh sách nhà kho.");
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await searchEmployeeByRole("Staff");
      if (response.success) {
        const options = response.data.data.map((employee) => ({
          label: employee.full_name,
          value: employee.id,
        }));
        setEmployees(options);

        if (employee_id) {
          const selectedEmployee = response.data.data.find(
            (emp) => emp.id === employee_id
          );
          if (selectedEmployee) {
            setEmployee(selectedEmployee.full_name);
          }
        }
      } else {
        Alert.alert("Thông báo lỗi", response.errorMessage);
      }
    } catch (error) {
      Alert.alert("Lỗi", error || "Không thể tải danh sách nhân viên.");
    }
  };

  const handleMedicineChange = (value) => {
    const selected = medicines.find((medicine) => medicine.value === value);
    if (selected) {
      setSelectedMedicine({
        id: value,
        medicine_name: selected.label,
        sale_price: selected.sale_price,
        stock_quantity: selected.stock_quantity,
      });
      setPrice(selected.sale_price.toString());
    }
  };

  const addDetail = () => {
    if (!selectedMedicine.id || !quantity || !price) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin chi tiết.");
      return;
    }

    const newDetail = {
      id: selectedMedicine.id,
      medicine_name: selectedMedicine.medicine_name,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    };
    setItemDetails((prevDetails) => [...prevDetails, newDetail]);

    setQuantity("");
    setPrice("");
    setSelectedMedicine({
      id: null,
      medicine_name: "",
      sale_price: 0,
      stock_quantity: 0,
    });

    setModalVisible(false);
  };

  const calculateTotalAmount = () => {
    const total = itemDetails.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    setTotalAmount(total);
  };

  const handleSave = async () => {
    console.log("nhà kho", warehouse);
    if (!totalAmount || !warehouse || !employee || itemDetails.length === 0) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const formattedDetails = itemDetails.map((item) => ({
      medicine: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const irData = {
      warehouse: warehouse,
      employee: employee_id,
      details: formattedDetails,
    };

    try {
      const response = await createImportReceiptAndDetails(irData);
      if (response.success) {
        Alert.alert("Thành công", "Phiếu nhập đã được lưu.");
        router.push("");
        setTotalAmount(0);
        setWarehouse(null);
        setEmployee(null);
        setItemDetails([]);
      } else {
        Alert.alert(
          "Lỗi",
          response.errorMessage || "Không thể lưu phiếu nhập."
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi lưu phiếu nhập.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Phiếu Nhập</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Kho:</Text>
        <RNPickerSelect
          onValueChange={(value) => setWarehouse(value)}
          items={warehouses}
          placeholder={{ label: "Chọn nhà kho...", value: null }}
          value={
          null
          }
          style={pickerSelectStyles}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nhân viên:</Text>
        <TextInput
          style={styles.input}
          value={employee || ""}
          editable={false}
          placeholder="Chọn nhân viên..."
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>+ Thêm Chi Tiết</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Danh sách chi tiết:</Text>
      <FlatList
        data={itemDetails}
        renderItem={({ item, index }) => (
          <View style={styles.detailRow}>
            <Text>{`${item.medicine_name} - ${item.quantity} x ${item.price} VND`}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                setItemDetails((prev) => prev.filter((_, i) => i !== index));
                calculateTotalAmount();
              }}
            >
              <Ionicons name="trash-bin" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={<Text>Chưa có chi tiết phiếu nhập.</Text>}
      />

      <Text style={styles.totalAmount}>Tổng số tiền: {totalAmount} VND</Text>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu Phiếu Nhập</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <Text style={styles.modalTitle}>Thêm Chi Tiết</Text>
              <RNPickerSelect
                onValueChange={(value) => handleMedicineChange(value)}
                items={medicines}
                placeholder={{ label: "Chọn thuốc...", value: null }}
                style={pickerSelectStyles}
              />
              <TextInput
                style={styles.input}
                placeholder="Số lượng"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
              <TextInput
                style={styles.input}
                placeholder="Giá"
                keyboardType="numeric"
                value={price}
                editable={false}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.addButton} onPress={addDetail}>
                  <Text style={styles.buttonText}>Thêm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
  removeButton: {
    paddingLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%", // Giới hạn chiều cao modal để có thể cuộn
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  inputAndroid: {
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

export default AddIRScreenWithDetails;
