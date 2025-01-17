import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Animated,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Employee } from "@/types";
import MyButton from "@/components/MyButton";
import SearchText from "@/components/SearchText";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { getEmployees } from "@/services/api";

const ListEmployees = () => {
  const { role } = useLocalSearchParams();
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0)); // Hiệu ứng mờ
  const [selectedRole, setSelectedRole] = useState(role || ""); // Vai trò
  const [filteredData, setFilteredData] = useState<Employee[]>([]);
  const [modalVisible, setModalVisible] = useState(false); // Modal
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [searchText, setSearchText] = useState("");

  const handleError = (error: any) => {
    const errorMessage =
      error?.errorMessage ||
      error?.message ||
      "Đã xảy ra lỗi. Vui lòng thử lại!";
    Alert.alert("Lỗi", errorMessage);
  };

  // Lấy danh sách nhân viên từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getEmployees();
        if (result.success && Array.isArray(result.data)) {
          setEmployees(result.data);
        } else {
          handleError(result);
          setEmployees([]);
        }
      } catch (error) {
        handleError(error);
        setEmployees([]);
      }
    };

    fetchData();
  }, []);

  // Lọc dữ liệu theo vai trò và từ khóa tìm kiếm
  useEffect(() => {
    if (employees) {
      const sanitizedRole = selectedRole.trim().toLowerCase();
      const filtered = employees.filter(
        (employee) =>
          employee.role.toLowerCase() === sanitizedRole &&
          employee.full_name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [selectedRole, searchText, employees]);

  // Hiệu ứng mờ khi load danh sách
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const getHeaderTitle = () => {
    switch (selectedRole.toLowerCase()) {
      case "doctor":
        return "DANH SÁCH BÁC SĨ";
      case "pharmacist":
        return "DANH SÁCH DƯỢC SĨ";
      case "staff":
        return "DANH SÁCH NHÂN VIÊN";
      default:
        return "DANH SÁCH NHÂN VIÊN";
    }
  };

  const handleAdd = () => {
    router.push("./add");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{getHeaderTitle()}</Text>

      {/* Thanh tìm kiếm và nút lọc */}
      <View style={styles.searchContainer}>
        <SearchText
          placeholder="Nhập tên nhân viên"
          style={styles.searchText}
          setSearchText={setSearchText} // Sửa thành cập nhật trạng thái
        />
        <TouchableOpacity
          style={styles.filterIconContainer}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="filter-list" size={30} color="#007bff" />
          <Text style={styles.filterText}>Lọc</Text>
        </TouchableOpacity>
      </View>

      {/* Modal lọc */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn vai trò</Text>
            {["Doctor", "Pharmacist", "Staff"].map((role) => (
              <TouchableOpacity
                key={role}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedRole(role);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{role}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Danh sách nhân viên */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Animated.View style={[styles.itemContainer, { opacity: fadeAnim }]}>
            <Link href={`/accounts/${item.id}`} asChild>
              <TouchableOpacity>
                <Image
                  source={
                    item.image
                      ? { uri: item.image }
                      : require("@/assets/images/avatar/default.png")
                  }
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.id_card}>{item.id_card}</Text>
                  <Text style={styles.name}>{item.full_name}</Text>
                  <Text style={styles.info}>
                    {item.gender === true || item.gender === 1 ? "Nam" : "Nữ"}
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        )}
      />

      {/* Nút thêm */}
      <MyButton title="Thêm nhân viên mới" onPress={handleAdd} />
    </View>
  );
};

export default ListEmployees;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e6f7ff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#007bff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchText: {
    flex: 7,
  },
  filterIconContainer: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    height: 45,
    backgroundColor: "#e6f7ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007bff",
  },
  filterText: {
    fontSize: 16,
    color: "#007bff",
    marginLeft: 5,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalOptionText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
  },
  textContainer: {
    justifyContent: "center",
    flex: 1,
  },
  id_card: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  name: {
    fontSize: 18, // Tăng kích thước chữ để dễ nhìn hơn
    color: "#333", // Màu đen để dễ nhìn
    fontWeight: "700", // Đậm hơn
    marginBottom: 5,
    shadowColor: "#000", // Thêm bóng đổ để tạo chiều sâu
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  info: {
    fontSize: 14,
    color: "#777", // Lighter color for gender text
    fontStyle: "italic",
    letterSpacing: 0.5,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: "center",
  },
});
