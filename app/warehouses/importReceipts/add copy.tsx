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

const AddIRScreenWithDetails = () => {
  const [totalAmount, setTotalAmount] = useState(0); // Tổng tiền
  const [isApproved, setIsApproved] = useState(false); // Trạng thái đã duyệt
  const [warehouse, setWarehouse] = useState(""); // Nhà kho
  const [employee, setEmployee] = useState(""); // Nhân viên
  const [itemDetails, setItemDetails] = useState([]); // Mảng lưu chi tiết phiếu nhập
  const [medicines, setMedicines] = useState([]); // Danh sách thuốc
  const [selectedMedicine, setSelectedMedicine] = useState({
    id: null,
    medicine_name: "",
    sale_price: 0,
    stock_quantity: 0,
  });
  const [quantity, setQuantity] = useState(""); // Số lượng thuốc
  const [price, setPrice] = useState(""); // Giá thuốc

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Lấy danh sách thuốc (mock API hoặc dữ liệu cứng)
  const fetchMedicines = async () => {
    const mockMedicines = [
      {
        id: 1,
        medicine_name: "Paracetamol",
        sale_price: 5000,
        stock_quantity: 100,
      },
      { id: 2, medicine_name: "Aspirin", sale_price: 7000, stock_quantity: 50 },
    ];
    setMedicines(
      mockMedicines.map((medicine) => ({
        label: medicine.medicine_name,
        value: medicine.id,
        sale_price: medicine.sale_price,
        stock_quantity: medicine.stock_quantity,
      }))
    );
  };

  // Xử lý chọn thuốc
  const handleValueChange = (value) => {
    const selected = medicines.find((medicine) => medicine.value === value);
    if (selected) {
      setSelectedMedicine(selected);
      setPrice(selected.sale_price.toString());
    }
  };

  // Tính tổng tiền
  const calculateTotalAmount = () => {
    const total = itemDetails.reduce(
      (sum, item) => sum + item.detail.quantity * item.detail.price,
      0
    );
    setTotalAmount(total);
  };

  // Thêm chi tiết phiếu nhập
  const addDetail = () => {
    if (!warehouse || !employee) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin phiếu nhập trước.");
      return;
    }

    if (!selectedMedicine.id || !quantity || !price) {
      Alert.alert("Lỗi", "Vui lòng chọn thuốc, nhập số lượng và giá.");
      return;
    }

    const detail = {
      medicine_name: selectedMedicine.medicine_name,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    };

    setItemDetails([...itemDetails, { id: itemDetails.length + 1, detail }]);
    setQuantity(""); // Reset số lượng
    setPrice(""); // Reset giá
    calculateTotalAmount(); // Cập nhật tổng tiền
  };

  // Xóa chi tiết
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

  // Lưu phiếu nhập (chỉ lưu tạm vào mảng)
  const handleSave = () => {
    if (!warehouse || !employee || itemDetails.length === 0) {
      Alert.alert(
        "Lỗi",
        "Vui lòng nhập đầy đủ thông tin và chi tiết phiếu nhập."
      );
      return;
    }

    const irData = {
      total_amount: totalAmount,
      is_approved: isApproved,
      warehouse,
      employee,
      details: itemDetails,
    };

    console.log("Phiếu nhập đã lưu tạm:", irData);
    Alert.alert("Thành công", "Phiếu nhập đã được lưu tạm thời.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Phiếu Nhập</Text>

      <View style={styles.inputGroup}>
        <MaterialIcons name="warehouse" size={20} color="#333" />
        <TextInput
          style={styles.input}
          placeholder="Nhà kho"
          value={warehouse}
          onChangeText={setWarehouse}
        />
      </View>

      <View style={styles.inputGroup}>
        <Ionicons name="person-outline" size={20} color="#333" />
        <TextInput
          style={styles.input}
          placeholder="Nhân viên"
          value={employee}
          onChangeText={setEmployee}
        />
      </View>

      <RNPickerSelect
        onValueChange={(value) => handleValueChange(value)}
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
