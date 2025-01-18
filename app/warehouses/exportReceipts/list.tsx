import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRouter } from "expo-router";
import { useToken } from "@/hooks/useToken";
import { searchExportReceipts, getERList } from "@/services/api/index"; // Import API functions
import { useFocusEffect } from "@react-navigation/native";
import { TextInput } from "react-native";
import { format } from "date-fns/format";

const ERListScreen = () => {
  const [erList, setErList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [export_date, setExport_date] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [is_approved, setIsApproved] = useState(false);
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const token = useToken();
  const router = useRouter();
  const formatDateTimeList = (inputDateTime) => {
    // Chuyển chuỗi thành đối tượng Date
    const date = new Date(inputDateTime);

    // Lấy ngày, tháng, năm, giờ, phút
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Trả về chuỗi định dạng dd/mm/yyyy hh:mm
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  const formatDateTimeDetail = (isoDate) => {
    // Chuyển chuỗi ISO thành đối tượng Date
    const date = new Date(isoDate);

    // Lấy ngày, tháng, năm, giờ, phút
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Trả về chuỗi định dạng dd/mm/yyyy hh:mm
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  const fetchListER = async () => {
    try {
      setLoading(true);
      const response = await getERList(); // Fetch all export receipts
      console.log("response xuất", response.data);
      setErList(response.data || []);
    } catch (error) {
      Alert.alert("Error", "An error occurred while fetching records.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredERList = async () => {
    if (!export_date && !prescription && !warehouse && !is_approved) {
      Alert.alert("Lỗi", "Vui lòng  chỉ nhập  một tham số để tìm kiếm.");
      return;
    }

    try {
      setLoading(true);
      const response = await searchExportReceipts(
        export_date ? export_date.toISOString().split("T")[0] : null,
        prescription,
        warehouse,
        is_approved ? "true" : "false"
      );
      console;
      setErList(response.data || []);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data.errorMessage || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchListER();
    }, [])
  );

  const resetFilters = () => {
    setExport_date(null);
    setIsApproved(false);
    setPrescription("");
    setWarehouse("");
    setWarehouse("");

    fetchListER();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/warehouses/exportReceipts/${item.id}`)}
    >
      <Text style={styles.erName}>
        <Ionicons name="document-text-outline" size={16} color="#FF9800" /> Mã
        phiếu: {item.id}
      </Text>
      <Text style={styles.erDate}>
        <Ionicons name="person-outline" size={16} color="#FF9800" /> Nhân viên
        lập: {item.employee.full_name}
      </Text>
      <Text style={styles.erDate}>
        <Ionicons name="document-text-outline" size={16} color="#FF9800" /> Đơn
        thuốc: {item.prescription}
      </Text>
      <Text style={styles.erDate}>
        <Ionicons name="business-outline" size={16} color="#FF9800" /> Nhà kho:{" "}
        {item.warehouse.warehouse_name}
      </Text>
      <Text style={styles.erDate}>
        <Ionicons name="calendar-outline" size={16} color="#FF9800" /> Ngày lập:{" "}
        {/* {item.export_date} */}
        {format(new Date(item.export_date), "dd/MM/yyyy HH:mm")}
      </Text>
      <Text style={styles.erDate}>
        <Ionicons name="cash-outline" size={16} color="#FF9800" /> Tổng tiền:{" "}
        {item.total_amount} đồng
      </Text>
      <Text style={styles.erDate}>
        <Ionicons
          name={
            item.is_approved
              ? "checkmark-circle-outline"
              : "close-circle-outline"
          }
          size={16}
          color={item.is_approved ? "#4CAF50" : "#FF5252"}
        />{" "}
        Trạng thái: {item.is_approved ? "Đã duyệt" : "Chưa duyệt"}
      </Text>
    </TouchableOpacity>
  );

  const showDate = (date) =>
    date ? date.toLocaleDateString("vi-VN") : "Chọn ngày";

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setIsSearchExpanded(!isSearchExpanded)}
        >
          <Ionicons
            name={
              isSearchExpanded ? "chevron-up-outline" : "chevron-down-outline"
            }
            size={20}
            color="#fff"
          />
          <Text style={styles.expandButtonText}>
            {isSearchExpanded ? "Thu gọn" : "Mở rộng"}
          </Text>
        </TouchableOpacity>

        {isSearchExpanded && (
          <View style={styles.searchContainer}>
            <View style={styles.row}>
              {/* <TouchableOpacity
                style={[styles.datePickerButton, styles.rowItem]}
                onPress={() => setStartPickerVisible(true)}
              >
                <Text style={styles.datePickerText}>
                  <Ionicons name="calendar-outline" size={16} color="#333" /> Ngày xuất: {showDate(export_date)}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isStartPickerVisible}
                mode="date"
                onConfirm={(date) => {
                  setStartPickerVisible(false);
                  setExport_date(date);
                }}
                onCancel={() => setStartPickerVisible(false)}
              /> */}
            </View>

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.rowItem]}
                placeholder="Đơn thuốc"
                value={prescription}
                onChangeText={setPrescription}
              />
              <TextInput
                style={[styles.input, styles.rowItem]}
                placeholder="Nhà kho"
                value={warehouse}
                onChangeText={setWarehouse}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.switchContainer, styles.rowItem]}>
                <Text>Trạng thái đã duyệt</Text>
                <Switch value={is_approved} onValueChange={setIsApproved} />
              </View>
              <TouchableOpacity
                style={[styles.searchButton, styles.rowItem]}
                onPress={fetchFilteredERList}
              >
                <Ionicons name="search-outline" size={20} color="#fff" />
                <Text style={styles.searchButtonText}>Tìm kiếm</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={resetFilters}
        >
          <Ionicons name="refresh-outline" size={20} color="#000" />
          <Text style={styles.clearFiltersText}>Xóa bộ lọc</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={erList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No ER records available.</Text>}
      />
      <TouchableOpacity
        style={styles.clearFiltersButton}
        onPress={() => router.replace("/warehouses/exportReceipts/add/")} // Chuyển hướng đến trang thêm phiếu
      >
        <Ionicons name="add" size={20} color="#000" />
        <Text style={styles.clearFiltersText}>Thêm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9", // Nền sáng
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  erName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  erDate: {
    fontSize: 14,
    color: "#777",
  },
  searchContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  expandButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  expandButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  rowItem: {
    flex: 1,
    marginRight: 10, // Khoảng cách giữa các item
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  datePickerText: {
    color: "#333",
    marginLeft: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  clearFiltersButton: {
    padding: 10,
    backgroundColor: "#FFEB3B",
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  clearFiltersText: {
    color: "#000",
    fontWeight: "bold",
    marginLeft: 5,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
});

export default ERListScreen;
