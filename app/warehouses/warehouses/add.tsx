import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { Warehouse } from "@/constants/types";

interface AddWarehouseModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (warehouse: Warehouse) => void;
}

const AddWarehouse: React.FC<AddWarehouseModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [newWarehouse, setNewWarehouse] = useState<Warehouse>({
    id: 0,
    warehouse_name: "",
    address: "",
    is_active: true,
  });

  const handleAdd = () => {
    if (!newWarehouse.warehouse_name || !newWarehouse.address) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ thông tin");
      return;
    }
    onAdd(newWarehouse);
    setNewWarehouse({
      id: 0,
      warehouse_name: "",
      address: "",
      is_active: true,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Thêm kho mới</Text>
        <TextInput
          style={styles.input}
          value={newWarehouse.warehouse_name}
          onChangeText={(text) =>
            setNewWarehouse({ ...newWarehouse, warehouse_name: text })
          }
          placeholder="Tên kho"
        />
        <TextInput
          style={styles.input}
          value={newWarehouse.address}
          onChangeText={(text) =>
            setNewWarehouse({ ...newWarehouse, address: text })
          }
          placeholder="Địa chỉ"
        />
        <View style={styles.row}>
          <Text>Trạng thái: </Text>
          <TouchableOpacity
            onPress={() =>
              setNewWarehouse({
                ...newWarehouse,
                is_active: !newWarehouse.is_active,
              })
            }
          >
            <Text style={styles.toggleText}>
              {newWarehouse.is_active ? "✅ Hoạt động" : "❌ Ngừng hoạt động"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: 300,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 16,
    color: "#007bff",
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#6c757d",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default AddWarehouse;
