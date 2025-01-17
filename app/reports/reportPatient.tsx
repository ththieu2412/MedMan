import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import * as Print from "expo-print";
import { ReportPatient } from "@/services/api";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome5";

const reportImportReceipt = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateForApi, setStartDateForApi] = useState("");
  const [endDateForApi, setEndDateForApi] = useState("");
  const [reportData, setReportData] = useState<any>(null);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchReport = async () => {
    try {
      const data = await ReportPatient(startDateForApi, endDateForApi);
      if (data.success) {
        setReportData(data.data);
      } else {
        Alert.alert("Thông báo", data.errorMessage);
      }
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
          <h1 style="text-align: center;">Báo Cáo Hoạt Động Bệnh Nhân</h1>
          <h3 style="text-align: center;">Từ ngày: ${startDate} - Đến ngày: ${endDate}</h3>
          <div style="text-align: center; margin-bottom: 20px;">
            <strong>Nam:</strong> ${reportData?.data?.Nam} |
            <strong>Nữ:</strong> ${reportData?.data?.Nữ} |
            <strong>Tổng:</strong> ${reportData?.data?.Tổng}
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Ngày Sinh</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tên Bệnh Nhân</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Địa Chỉ</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Ngày Đăng Ký</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Bảo Hiểm</th>
            </tr>
            ${reportData?.data["Danh sách bệnh nhân"]
              ?.map(
                (item) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.date_of_birth}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.full_name}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.address}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.registration_date}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.insurance}</td>
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
      <Text style={styles.title}>Báo Cáo Hoạt Động Bệnh Nhân</Text>

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
        <FlatList
          data={reportData.data["Danh sách bệnh nhân"]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.reportItem}>
              <Text style={styles.text}>Ngày Sinh: {item.date_of_birth}</Text>
              <Text style={styles.text}>Tên Bệnh Nhân: {item.full_name}</Text>
              <Text style={styles.text}>Địa Chỉ: {item.address}</Text>
              <Text style={styles.text}>
                Ngày Đăng Ký: {item.registration_date}
              </Text>
              <Text style={styles.text}>Bảo Hiểm: {item.insurance}</Text>
            </View>
          )}
        />
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
