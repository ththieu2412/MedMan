import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import {
  getMedicineList,
  getWarehouseList,
  searchEmployeeByRole,
} from "@/services/api/index";

const AddIRScreenWithDetails = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [warehouse, setWarehouse] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [itemDetails, setItemDetails] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState({
    id: null,
    medicine_name: "",
    sale_price: 0,
    stock_quantity: 0,
  });
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  // Fetch data for medicines, warehouses, and employees
  useEffect(() => {
    fetchMedicines();
    fetchWarehouses();
    fetchEmployees();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await getMedicineList();
      if (response.data && Array.isArray(response.data)) {
        const options = response.data.map((medicine) => ({
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
      Alert.alert("Lỗi", "Không thể tải danh sách thuốc.");
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await getWarehouseList(token);
      console.log("response nahf kho", response.data);
      if (response.data && Array.isArray(response.data)) {
        const options = response.data.map((warehouse) => ({
          label: warehouse.warehouse_name,
          value: warehouse.id,
        }));
        setWarehouses(options);
      } else {
        Alert.alert("Lỗi", "Dữ liệu nhà kho không đúng định dạng.");
      }
    } catch (error) {
      console.log("response nahf kho", error);
      Alert.alert("Lỗi", "Không thể tải danh sách nhà kho.");
    }
  };

  const fetchEmployees = async () => {
    try {
      console.log("respon nhân viên");
      const response = await searchEmployeeByRole(toke, "Staff");
      console.log("respon nhân viên", response.data);
      if (response.data && Array.isArray(response.data)) {
        const options = response.data.map((employee) => ({
          label: employee.full_name,
          value: employee.id,
        }));
        setEmployees(options);
      } else {
        Alert.alert("Lỗi", "Dữ liệu nhân viên không đúng định dạng.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách nhân viên.");
    }
  };

  const handleMedicineChange = (value) => {
    const selected = medicines.find((medicine) => medicine.value === value);
    if (selected) {
      setSelectedMedicine(selected);
      setPrice(selected.sale_price.toString());
    }
  };

  const addDetail = () => {
    if (
      !warehouse ||
      !employee ||
      !selectedMedicine.id ||
      !quantity ||
      !price
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const detail = {
      medicine_name: selectedMedicine.medicine_name,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    };

    setItemDetails([...itemDetails, { id: itemDetails.length + 1, detail }]);
    setQuantity("");
    setPrice("");
    calculateTotalAmount();
  };

  const calculateTotalAmount = () => {
    const total = itemDetails.reduce(
      (sum, item) => sum + item.detail.quantity * item.detail.price,
      0
    );
    setTotalAmount(total);
  };

  const removeDetail = (id) => {
    const newItemDetails = itemDetails.filter((item) => item.id !== id);
    setItemDetails(newItemDetails);
    calculateTotalAmount();
  };

  const renderDetail = ({ item }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailText}>
        {item.detail.medicine_name} - {item.detail.quantity} x{" "}
        {item.detail.price} VND
      </Text>
      <TouchableOpacity onPress={() => removeDetail(item.id)}>
        <Ionicons name="trash-outline" size={20} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );

  const handleSave = () => {
    if (!totalAmount || !warehouse || !employee || itemDetails.length === 0) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const irData = {
      total_amount: totalAmount,
      is_approved: isApproved,
      warehouse,
      employee,
      details: itemDetails,
    };

    Alert.alert("Thành công", "Phiếu nhập đã được lưu.");
    console.log(irData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Phiếu Nhập</Text>

      <RNPickerSelect
        onValueChange={(value) => setWarehouse(value)}
        items={warehouses}
        placeholder={{ label: "Chọn nhà kho...", value: null }}
        style={pickerSelectStyles}
      />

      <RNPickerSelect
        onValueChange={(value) => setEmployee(value)}
        items={employees}
        placeholder={{ label: "Chọn nhân viên...", value: null }}
        style={pickerSelectStyles}
      />

      <RNPickerSelect
        onValueChange={(value) => handleMedicineChange(value)}
        items={medicines}
        placeholder={{ label: "Chọn thuốc...", value: null }}
        style={pickerSelectStyles}
      />

      <View style={styles.inputGroup}>
        <Ionicons name="calculator-outline" size={20} color="#333" />
        <TextInput
          style={styles.input}
          placeholder="Số lượng"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />
      </View>

      <View style={styles.inputGroup}>
        <Ionicons name="pricetag-outline" size={20} color="#333" />
        <TextInput
          style={styles.input}
          placeholder="Giá"
          keyboardType="numeric"
          value={price}
          editable={false}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={addDetail}>
        <Text style={styles.buttonText}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" /> Thêm Chi
          Tiết
        </Text>
      </TouchableOpacity>

      <FlatList
        data={itemDetails}
        renderItem={renderDetail}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Chưa có chi tiết phiếu nhập.</Text>
        }
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          <Ionicons name="save" size={20} color="#fff" /> Lưu Phiếu Nhập
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  inputGroup: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  input: { flex: 1, borderBottomWidth: 1, borderColor: "#ccc", marginLeft: 10 },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  switchText: { fontSize: 16, marginLeft: 10 },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  detailText: { fontSize: 16, color: "#333", flex: 1 },
  emptyText: { textAlign: "center", color: "#999" },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  inputAndroid: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
});

export default AddIRScreenWithDetails;
