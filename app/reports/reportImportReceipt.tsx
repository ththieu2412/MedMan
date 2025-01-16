import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useToken } from "@/hooks/useToken";
import { ReportImportReceipt } from "@/services/api";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Thư viện chọn ngày
import moment from "moment"; // Thư viện moment để định dạng ngày
import Icon from "react-native-vector-icons/FontAwesome5"; // Sử dụng icon từ FontAwesome5

const reportImportReceipt = () => {
  const [startDate, setStartDate] = useState(""); // Hiển thị dd/MM/yyyy
  const [endDate, setEndDate] = useState(""); // Hiển thị dd/MM/yyyy
  const [startDateForApi, setStartDateForApi] = useState(""); // Gửi yyyy-MM-dd
  const [endDateForApi, setEndDateForApi] = useState(""); // Gửi yyyy-MM-dd
  const [reportData, setReportData] = useState<any>(null);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Điều khiển mở rộng/thu hẹp phần nhập điều kiện
  const token = useToken();

  const fetchReport = async () => {
    try {
      const data = await ReportImportReceipt(
        token,
        startDateForApi,
        endDateForApi
      );
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const handleStartDateConfirm = (date: Date) => {
    setStartDate(moment(date).format("DD/MM/YYYY"));
    setStartDateForApi(moment(date).format("YYYY-MM-DD"));
    setStartDatePickerVisible(false);
  };

  const handleEndDateConfirm = (date: Date) => {
    setEndDate(moment(date).format("DD/MM/YYYY"));
    setEndDateForApi(moment(date).format("YYYY-MM-DD"));
    setEndDatePickerVisible(false);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const print = async () => {
    const htmlContent = `
      <html>
        <body>
          <h1 style="text-align: center;">Báo Cáo Phiếu Nhập Hàng</h1>
          <h3 style="text-align: center;">Từ ngày: ${startDate} - Đến ngày: ${endDate}</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Ngày Nhập</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tên Nhân Viên</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tên Thuốc</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Số Lượng Nhập</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tổng Chi Phí</th>
            </tr>
            ${reportData?.data
              ?.map(
                (item) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.import_date}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.employee_name}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.medicine_name}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.total_cost}</td>
                </tr>
              `
              )
              .join("")}
          </table>
        </body>
      </html>
    `;
    await Print.printAsync({ html: htmlContent });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Báo Cáo Phiếu Nhập Hàng</Text>

      {/* Nút thu gọn/mở rộng */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleExpand}>
        <Icon
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#007BFF"
        />
        <Text style={styles.toggleText}>
          {isExpanded ? "Thu hẹp" : "Mở rộng"}
        </Text>
      </TouchableOpacity>

      {/* Phần nhập điều kiện (ẩn/hiện dựa vào `isExpanded`) */}
      {isExpanded && (
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setStartDatePickerVisible(true)}
          >
            <Icon name="calendar" size={20} color="#555" />
            <Text style={styles.dateText}>
              {startDate || "Chọn ngày bắt đầu"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setEndDatePickerVisible(true)}
          >
            <Icon name="calendar" size={20} color="#555" />
            <Text style={styles.dateText}>
              {endDate || "Chọn ngày kết thúc"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={fetchReport}>
            <Icon name="file-alt" size={20} color="#fff" />
            <Text style={styles.buttonText}>Lấy Báo Cáo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={print}>
            <Icon name="print" size={20} color="#fff" />
            <Text style={styles.buttonText}>In Báo Cáo</Text>
          </TouchableOpacity>
        </View>
      )}

      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={() => setStartDatePickerVisible(false)}
      />

      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={() => setEndDatePickerVisible(false)}
      />

      {reportData && (
        <ScrollView style={styles.reportContainer}>
          <FlatList
            data={reportData.data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.reportItem}>
                <Text style={styles.text}>Ngày Nhập: {item.import_date}</Text>
                <Text style={styles.text}>
                  Tên Nhân Viên: {item.employee_name}
                </Text>
                <Text style={styles.text}>Tên Thuốc: {item.medicine_name}</Text>
                <Text style={styles.text}>Số Lượng Nhập: {item.quantity}</Text>
                <Text style={styles.text}>Tổng Chi Phí: {item.total_cost}</Text>
              </View>
            )}
          />
        </ScrollView>
      )}
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
  toggleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  toggleText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#007BFF",
  },
  filterContainer: {
    marginBottom: 16,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#555",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
  },
  reportContainer: {
    marginTop: 20,
  },
  reportItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
});

export default reportImportReceipt;
