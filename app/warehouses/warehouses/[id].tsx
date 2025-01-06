import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { Warehouse } from "@/constants/types";

interface WarehouseDetailsModalProps {
  visible: boolean;
  warehouse: Warehouse | null;
  onClose: () => void;
  onUpdate: (updatedWarehouse: Warehouse) => Promise<void>;
  onDelete: () => Promise<void>;
}

const WarehouseDetail: React.FC<WarehouseDetailsModalProps> = ({
  visible,
  warehouse,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [editedWarehouse, setEditedWarehouse] =
    React.useState<Warehouse | null>(warehouse);

  React.useEffect(() => {
    setEditedWarehouse(warehouse);
  }, [warehouse]);

  const handleUpdateWarehouse = async () => {
    if (!editedWarehouse?.warehouse_name || !editedWarehouse.address) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ thông tin");
      return;
    }
    try {
      await onUpdate(editedWarehouse);
      onClose();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Có lỗi xảy ra khi cập nhật kho");
    }
  };

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Chi tiết kho</Text>
        {editedWarehouse && (
          <>
            <TextInput
              style={styles.input}
              value={editedWarehouse.warehouse_name}
              onChangeText={(text) =>
                setEditedWarehouse({
                  ...editedWarehouse,
                  warehouse_name: text,
                })
              }
              placeholder="Tên kho"
            />
            <TextInput
              style={styles.input}
              value={editedWarehouse.address}
              onChangeText={(text) =>
                setEditedWarehouse({ ...editedWarehouse, address: text })
              }
              placeholder="Địa chỉ"
            />
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateWarehouse}
            >
              <Text style={styles.updateButtonText}>Cập nhật</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteButtonText}>Xóa kho này</Text>
            </TouchableOpacity>
          </>
        )}
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
  updateButton: {
    backgroundColor: "#007bff",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  updateButtonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#007bff",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default WarehouseDetail;
