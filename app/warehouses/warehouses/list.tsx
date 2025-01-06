import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  getWarehousesapi,
  addWarehouseapi,
  updateWarehouseapi,
  deleteWarehouseapi,
} from "@/services/apiServices";
import { Warehouse, ApiResponse } from "@/constants/types";
import AddWarehouse from "./add";
import WarehouseDetail from "./[id]";

const ListWarehouse: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const response: ApiResponse<Warehouse[]> = await getWarehousesapi();
      if (response.statuscode === 200 && response.status === "success") {
        setWarehouses(response.data);
      } else {
        Alert.alert(
          "Lỗi",
          response.errorMessage || "Không thể tải danh sách kho."
        );
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Có lỗi xảy ra khi lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  };



  const handleAddWarehouse = async (newWarehouse: Warehouse) => {
    try {
      const response: ApiResponse<null> = await addWarehouseapi(newWarehouse);
      if (response.statuscode === 200 && response.status === "success") {
        setWarehouses([...warehouses, newWarehouse]);
      } else {
        throw new Error(response.errorMessage || "Không thể thêm kho mới");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
  };


  const handleUpdateWarehouse = async (updatedWarehouse: Warehouse) => {
    try {
      const response: ApiResponse<null> = await updateWarehouseapi(
        updatedWarehouse.id.toString(),
        updatedWarehouse
      );
      if (response.statuscode === 200 && response.status === "success") {
        setWarehouses((prev) =>
          prev.map((warehouse) =>
            warehouse.id === updatedWarehouse.id ? updatedWarehouse : warehouse
          )
        );
      } else {
        throw new Error(response.errorMessage || "Không thể cập nhật kho");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
  };


  const handleDeleteWarehouse = async () => {
    if (!selectedWarehouse) return;
    try {
      const response: ApiResponse<null> = await deleteWarehouseapi(
        selectedWarehouse.id.toString()
      );
      if (response.statuscode === 200 && response.status === "success") {
        setWarehouses((prev) =>
          prev.filter((warehouse) => warehouse.id !== selectedWarehouse.id)
        );
      } else {
        throw new Error(response.errorMessage || "Không thể xóa kho");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách nhà kho</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={warehouses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedWarehouse(item);
                setShowDetailModal(true);
              }}
              style={styles.listItem}
            >
              <Text style={styles.itemText}>{item.warehouse_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <AddWarehouse
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddWarehouse}
      />
      <WarehouseDetail
        visible={showDetailModal}
        warehouse={selectedWarehouse}
        onClose={() => setShowDetailModal(false)}
        onUpdate={handleUpdateWarehouse}
        onDelete={handleDeleteWarehouse}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  listItem: {
    padding: 16,
    backgroundColor: "#ffffff",
    marginBottom: 8,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 28,
    textAlign: "center",
  },
});

export default ListWarehouse;
