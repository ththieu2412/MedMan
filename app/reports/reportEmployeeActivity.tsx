import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import * as Print from "expo-print";
import { useToken } from "@/hooks/useToken";
import { ReportEmployeeActivity } from "@/services/api"; // API cho báo cáo hoạt động nhân viên
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Thư viện chọn ngày
import moment from "moment"; // Thư viện moment để định dạng ngày
import Icon from "react-native-vector-icons/FontAwesome5"; // Sử dụng icon từ FontAwesome5

const reportEmployeeActivity = () => {
  const [startDate, setStartDate] = useState(""); // Hiển thị dd/MM/yyyy
  const [endDate, setEndDate] = useState(""); // Hiển thị dd/MM/yyyy
  const [startDateForApi, setStartDateForApi] = useState(""); // Gửi yyyy-MM-dd
  const [endDateForApi, setEndDateForApi] = useState(""); // Gửi yyyy-MM-dd
  const [limit, setLimit] = useState(""); // Truyền giá trị limit từ TextInput
  const [reportData, setReportData] = useState<any>(null);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Điều khiển mở rộng/thu hẹp phần nhập điều kiện
  const token = useToken();

  const fetchReport = async () => {
    try {
      const data = await ReportEmployeeActivity(
        token,
        limit // Truyền giá trị limit vào API
      );
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const print = async () => {
    const htmlContent = `
      <html>
        <body>
          <h1 style="text-align: center;">Báo Cáo Hoạt Động Nhân Viên</h1>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">STT</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tên Nhân Viên</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Số Phiếu Nhận</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tổng Số Lượng</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tổng Giá Trị</th>
            </tr>
            ${reportData?.data
              ?.map(
                (item, index) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${
                    index + 1
                  }</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${
                    item.employee_name
                  }</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${
                    item.total_receipts
                  }</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${
                    item.total_quantity
                  }</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${
                    item.total_value
                  }</td>
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
      <Text style={styles.title}>Báo Cáo Hoạt Động Nhân Viên</Text>

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
          {/* TextInput nhập giá trị limit */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={limit}
              onChangeText={setLimit}
              keyboardType="numeric"
              placeholder="Nhập giới hạn"
            />
          </View>

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

      {reportData && (
        <ScrollView style={styles.reportContainer}>
          <FlatList
            data={reportData.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.reportItem}>
                <Text style={styles.text}>STT: {index + 1}</Text>
                <Text style={styles.text}>
                  Tên Nhân Viên: {item.employee_name}
                </Text>
                <Text style={styles.text}>
                  Số Phiếu Nhận: {item.total_receipts}
                </Text>
                <Text style={styles.text}>
                  Tổng Số Lượng: {item.total_quantity}
                </Text>
                <Text style={styles.text}>
                  Tổng Giá Trị: {item.total_value}
                </Text>
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
  inputContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textInput: {
    fontSize: 16,
    color: "#555",
    padding: 8,
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

export default reportEmployeeActivity;
