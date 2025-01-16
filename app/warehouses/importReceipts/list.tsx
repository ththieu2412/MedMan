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
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRouter } from "expo-router";
import { useToken } from "@/hooks/useToken";
import { searchImportReceipts, getIRList } from "@/services/api/IRService";
import { useFocusEffect } from "@react-navigation/native";

const ImportReceiptList = () => {
  const [receiptList, setReceiptList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const token = useToken();
  const router = useRouter();

  const fetchAllReceipts = async () => {
    try {
      setLoading(true);
      const response = await getIRList(token);
      setReceiptList(response.data || []);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách phiếu nhập.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredReceipts = async () => {
    if (
      !startDate &&
      !endDate &&
      !employeeName &&
      !warehouseName &&
      !isApproved
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập ít nhất một tiêu chí tìm kiếm.");
      return;
    }

    if (endDate && startDate && endDate < startDate) {
      Alert.alert("Lỗi", "Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
      return;
    }

    try {
      setLoading(true);
      const response = await searchImportReceipts(
        token,
        startDate ? startDate.toISOString().split("T")[0] : null,
        endDate ? endDate.toISOString().split("T")[0] : null,
        employeeName,
        warehouseName,
        isApproved ? "true" : "false"
      );
      setReceiptList(response || []);
    } catch (error) {
      console.error(
        "Error searching receipts:",
        error.response?.data.errorMessage
      );
      Alert.alert("Lỗi", error.response?.data.errorMessage || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllReceipts();
    }, [])
  );

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setEmployeeName("");
    setWarehouseName("");
    setIsApproved(false);
    fetchAllReceipts();
  };

  const renderReceiptItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`warehouses/importReceipts/${item.id}`)}
    >
      <Text style={styles.receiptId}>
        <Ionicons name="document-text-outline" size={16} color="#4CAF50" /> Mã
        phiếu: {item.id}
      </Text>
      <Text style={styles.receiptDetail}>
        <Ionicons name="person-outline" size={16} color="#4CAF50" /> Nhân viên
        lập: {item.employee_name}
      </Text>
      <Text style={styles.receiptDetail}>
        <Ionicons name="business-outline" size={16} color="#4CAF50" /> Nhà kho:{" "}
        {item.warehouse_name}
      </Text>
      <Text style={styles.receiptDetail}>
        <Ionicons name="calendar-outline" size={16} color="#4CAF50" /> Ngày lập:{" "}
        {item.import_date}
      </Text>
      <Text style={styles.receiptDetail}>
        <Ionicons name="cash-outline" size={16} color="#4CAF50" /> Tổng tiền:{" "}
        {item.total_amount} đồng
      </Text>
      <Text style={styles.receiptDetail}>
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

  const formatDate = (date) =>
    date ? date.toLocaleDateString("vi-VN") : "Chọn ngày";

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
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
          <>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setStartPickerVisible(true)}
            >
              <Text style={styles.datePickerText}>
                <Ionicons name="calendar-outline" size={16} color="#333" /> Từ
                ngày: {formatDate(startDate)}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isStartPickerVisible}
              mode="date"
              onConfirm={(date) => {
                setStartPickerVisible(false);
                setStartDate(date);
              }}
              onCancel={() => setStartPickerVisible(false)}
            />

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setEndPickerVisible(true)}
            >
              <Text style={styles.datePickerText}>
                <Ionicons name="calendar-outline" size={16} color="#333" /> Đến
                ngày: {formatDate(endDate)}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isEndPickerVisible}
              mode="date"
              onConfirm={(date) => {
                setEndPickerVisible(false);
                setEndDate(date);
              }}
              onCancel={() => setEndPickerVisible(false)}
            />

            <TextInput
              style={styles.input}
              placeholder="Nhân viên"
              value={employeeName}
              onChangeText={setEmployeeName}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhà kho"
              value={warehouseName}
              onChangeText={setWarehouseName}
            />
            <View style={styles.switchContainer}>
              <Text>Trạng thái đã duyệt</Text>
              <Switch value={isApproved} onValueChange={setIsApproved} />
            </View>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={fetchFilteredReceipts}
            >
              <Ionicons name="search-outline" size={20} color="#fff" />
              <Text style={styles.searchButtonText}>Tìm kiếm</Text>
            </TouchableOpacity>
          </>
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
        data={receiptList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReceiptItem}
        ListEmptyComponent={<Text>Không có dữ liệu phiếu nhập.</Text>}
      />
      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/warehouses/importReceipts/add")}
      >
        <Ionicons name="add" size={40} color="#fff" />
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
  receiptId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  receiptDetail: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
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
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
    marginTop: 10,
  },
  clearFiltersText: {
    color: "#000",
    fontWeight: "bold",
    marginLeft: 5,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Shadow for Android
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, // Shadow for iOS
    shadowRadius: 4,
  },
});

export default ImportReceiptList;
