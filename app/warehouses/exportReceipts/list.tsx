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

const ERListScreen = () => {
  const [erList, setErList] = useState([]);
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

  const fetchListER = async () => {
    try {
      setLoading(true);
      const response = await getERList(token); // Fetch all export receipts
      setErList(response.data || []);
    } catch (error) {
      console.error("Error fetching all ER records:", error);
      Alert.alert("Error", "An error occurred while fetching records.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredERList = async () => {
    if (!startDate && !endDate && !employeeName && !warehouseName && !isApproved) {
      Alert.alert("Lỗi", "Vui lòng nhập ít nhất một tham số để tìm kiếm.");
      return;
    }

    if (endDate && startDate && endDate < startDate) {
      Alert.alert("Lỗi", "Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
      return;
    }

    try {
      setLoading(true);
      const response = await searchExportReceipts(
        token,
        startDate ? startDate.toISOString().split("T")[0] : null,
        endDate ? endDate.toISOString().split("T")[0] : null,
        employeeName,
        warehouseName,
        isApproved ? "true" : "false"
      );
      setErList(response || []);
    } catch (error) {
      console.error("Error searching ER list:", error.response?.data.errorMessage);
      Alert.alert("Error", error.response?.data.errorMessage || "An error occurred");
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
    setStartDate(null);
    setEndDate(null);
    setEmployeeName("");
    setWarehouseName("");
    setIsApproved(false);
    fetchListER();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/warehouses/exportReceipts/${item.id}`)}
    >
      <Text style={styles.erName}>
        <Ionicons name="document-text-outline" size={16} color="#FF9800" /> Mã phiếu:{" "}
        {item.id}
      </Text>
      <Text style={styles.erDate}>
        <Ionicons name="person-outline" size={16} color="#FF9800" /> Nhân viên lập:{" "}
        {item.employee_name}
      </Text>
      <Text style={styles.erDate}>
        <Ionicons name="business-outline" size={16} color="#FF9800" /> Nhà kho:{" "}
        {item.warehouse_name}
      </Text>
      <Text style={styles.erDate}>
        <Ionicons name="calendar-outline" size={16} color="#FF9800" /> Ngày lập:{" "}
        {item.export_date}
      </Text>
      <Text style={styles.erDate}>
        <Ionicons name="cash-outline" size={16} color="#FF9800" /> Tổng tiền:{" "}
        {item.total_amount} đồng
      </Text>
      <Text style={styles.erDate}>
        <Ionicons
          name={item.is_approved ? "checkmark-circle-outline" : "close-circle-outline"}
          size={16}
          color={item.is_approved ? "#4CAF50" : "#FF5252"}
        />{" "}
        Trạng thái: {item.is_approved ? "Đã duyệt" : "Chưa duyệt"}
      </Text>
    </TouchableOpacity>
  );

  const showDate = (date) => (date ? date.toLocaleDateString("vi-VN") : "Chọn ngày");

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
      name={isSearchExpanded ? "chevron-up-outline" : "chevron-down-outline"}
      size={20}
      color="#fff"
    />
    <Text style={styles.expandButtonText}>
      {isSearchExpanded ? "Thu gọn" : "Mở rộng"}
    </Text>
  </TouchableOpacity>

  {isSearchExpanded && (
    <>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.datePickerButton, styles.rowItem]}
          onPress={() => setStartPickerVisible(true)}
        >
          <Text style={styles.datePickerText}>
            <Ionicons name="calendar-outline" size={16} color="#333" /> Từ ngày:{" "}
            {showDate(startDate)}
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
          style={[styles.datePickerButton, styles.rowItem]}
          onPress={() => setEndPickerVisible(true)}
        >
          <Text style={styles.datePickerText}>
            <Ionicons name="calendar-outline" size={16} color="#333" /> Đến ngày:{" "}
            {showDate(endDate)}
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
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.rowItem]}
          placeholder="Nhân viên"
          value={employeeName}
          onChangeText={setEmployeeName}
        />
        <TextInput
          style={[styles.input, styles.rowItem]}
          placeholder="Nhà kho"
          value={warehouseName}
          onChangeText={setWarehouseName}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.switchContainer, styles.rowItem]}>
          <Text>Trạng thái đã duyệt</Text>
          <Switch value={isApproved} onValueChange={setIsApproved} />
        </View>
        <TouchableOpacity style={[styles.searchButton, styles.rowItem]} onPress={fetchFilteredERList}>
          <Ionicons name="search-outline" size={20} color="#fff" />
          <Text style={styles.searchButtonText}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>
    </>
  )}

  <TouchableOpacity style={styles.clearFiltersButton} onPress={resetFilters}>
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
});

export default ERListScreen;
