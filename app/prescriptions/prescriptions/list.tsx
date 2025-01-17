import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PrescriptionsList = ({
  prescriptions,
  loading,
}: {
  prescriptions: Prescription[]; // Danh sách ban đầu
  loading: boolean; // Trạng thái tải
}) => {
  const router = useRouter();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    Alert.alert("Xóa đơn thuốc", "Bạn có chắc chắn muốn xóa đơn thuốc này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: () => {
          // Giả sử bạn cần gọi API hoặc thực hiện việc xóa trong database ở đây
          // Sau khi xóa, bạn có thể cập nhật lại danh sách prescription nếu cần
          // (có thể thay thế `prescriptions` bằng API call)
        },
      },
    ]);
  };

  const renderItem = useCallback(
    ({ item }: { item: Prescription }) => (
      <View style={styles.prescriptionItem}>
        <View style={styles.diagnosisContainer}>
          <Text style={styles.diagnosis}>MÃ ĐƠN THUỐC: {item.id}</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setSelectedItemId(item.id)}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="gray" />
          </TouchableOpacity>
        </View>
        <Text style={styles.namdiagnosis}>
          Tên bệnh: {item.diagnosis || "Không rõ"}
        </Text>
        <Text>Bác sĩ: {item.details?.doctor?.full_name || "Không rõ"}</Text>
        <Text>Bệnh nhân: {item.details?.patient?.full_name || "Không rõ"}</Text>
        <Text>
          Ngày kê đơn:{" "}
          {item.prescription_date
            ? new Date(item.prescription_date).toLocaleString()
            : "Không rõ"}
        </Text>
        <Text>Hướng dẫn: {item.instruction || "Không rõ"}</Text>

        {selectedItemId === item.id && (
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                router.push(`/prescriptions/prescriptions/${item.id}`)
              }
            >
              <Ionicons name="create" size={20} color="green" />
              <Text style={styles.menuText}>Chỉnh sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons name="trash" size={20} color="red" />
              <Text style={styles.menuText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    ),
    [selectedItemId, router]
  );

  return (
    <TouchableWithoutFeedback onPress={() => setSelectedItemId(null)}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={prescriptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          windowSize={5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>Không có đơn thuốc nào.</Text>
            </View>
          }
        />
      )}
    </TouchableWithoutFeedback>
  );
};

export default PrescriptionsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f5",
  },
  prescriptionItem: {
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  diagnosisContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  diagnosis: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    flex: 1,
  },
  namdiagnosis: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 10,
  },
  menu: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 150,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
