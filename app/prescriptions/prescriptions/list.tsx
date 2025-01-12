import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import data from "@/data/prescription.json";

// Define the type for a single prescription item
interface Prescription {
  id: number;
  diagnosis: string;
  doctor: {
    full_name: string;
  };
  patient: {
    full_name: string;
  };
  prescription_date: string;
  instruction: string;
}

const PrescriptionsList = () => {
  const router = useRouter();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // Handle item delete
  const handleDelete = (id: number) => {
    console.log(`Đã xóa đơn thuốc với ID: ${id}`);
    // Add your delete logic here
  };

  // Render a single item in the list
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
        <Text style={styles.namdiagnosis}>Tên bệnh: {item.diagnosis}</Text>
        <Text>Bác sĩ: {item.doctor.full_name}</Text>
        <Text>Bệnh nhân: {item.patient.full_name}</Text>
        <Text>
          Ngày kê đơn: {new Date(item.prescription_date).toLocaleString()}
        </Text>
        <Text>Hướng dẫn: {item.instruction}</Text>

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
              onPress={() => {
                Alert.alert(
                  "Xóa đơn thuốc",
                  "Bạn có chắc chắn muốn xóa đơn thuốc này?",
                  [
                    { text: "Xóa", onPress: () => handleDelete(item.id) },
                    { text: "Hủy", style: "cancel" },
                  ]
                );
              }}
            >
              <Ionicons name="trash" size={20} color="red" />
              <Text style={styles.menuText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    ),
    [selectedItemId, router] // Adding selectedItemId and router to dependencies
  );

  return (
    <TouchableWithoutFeedback onPress={() => setSelectedItemId(null)}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={5}
      />
    </TouchableWithoutFeedback>
  );
};

export default PrescriptionsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f5", // Màu nền nhẹ nhàng
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50", // Màu sắc trang nhã
    textAlign: "center", // Căn giữa tiêu đề
  },
  prescriptionItem: {
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12, // Góc bo tròn lớn hơn
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Để tăng hiệu ứng bóng trong Android
    borderWidth: 1,
    borderColor: "#ddd", // Đường viền nhạt
  },
  diagnosisContainer: {
    flexDirection: "row", // Căn các phần tử theo chiều ngang
    justifyContent: "space-between", // Khoảng cách giữa diagnosis và icon
    alignItems: "center", // Căn giữa các phần tử theo chiều dọc
  },
  diagnosis: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    flex: 1, // Chiếm hết không gian còn lại
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
});
