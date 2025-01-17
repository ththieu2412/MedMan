import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ReportPatient } from "@/services/api"; // Giả sử bạn đã cấu hình API ở đây
import * as Print from "expo-print";
import Icon from "react-native-vector-icons/FontAwesome5"; // Sử dụng icon từ FontAwesome5

const ReportPatients = () => {
  const [reportData, setReportData] = useState<any[]>([]);

  // Hàm để gọi API và lấy dữ liệu báo cáo theo tháng
  const fetchReport = async (year: number) => {
    try {
      const allData = [];

      // Lặp qua 12 tháng trong năm
      for (let month = 1; month <= 12; month++) {
        const response = await ReportPatient(Number(year), Number(month)); // Gọi API theo từng tháng
        console.log(response);
        if (response.success && response.data) {
          console.log(response.data.data); // Log dữ liệu nếu thành công
          allData.push(response.data.data); // Thêm dữ liệu vào mảng
        } else {
          console.warn(
            `Không có dữ liệu cho tháng ${month} năm ${year}: ${response.errorMessage}`
          );
        }
      }

      // Cập nhật state với dữ liệu báo cáo
      setReportData(allData);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  // Hàm để in báo cáo
  const print = async () => {
    const htmlContent = `
      <html>
        <body>
          <h1 style="text-align: center;">Báo Cáo Bệnh Nhân</h1>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Tháng</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Nam</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Nữ</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tổng Cộng</th>
            </tr>
            ${reportData
              .map(
                (item) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.Date}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.Male}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.Female}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.Total}</td>
                </tr>`
              )
              .join("")}
          </table>
        </body>
      </html>
    `;
    await Print.printAsync({ html: htmlContent });
  };

  // Gọi API khi component load
  useEffect(() => {
    fetchReport(2024); // Gọi API cho năm 2024
  }, []);

  console.log("Danh sách báo cáo: ", reportData);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Báo Cáo Bệnh Nhân</Text>

      <Button title="Lấy Báo Cáo" onPress={() => fetchReport(2024)} />

      <TouchableOpacity style={styles.button} onPress={print}>
        <Icon name="print" size={20} color="#fff" />
        <Text style={styles.buttonText}>In Báo Cáo</Text>
      </TouchableOpacity>

      {reportData && (
        <ScrollView style={styles.reportContainer}>
          <FlatList
            data={reportData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.reportItem}>
                <Text style={styles.text}>Tháng: {item.Date}</Text>
                <Text style={styles.text}>Nam: {item.Male}</Text>
                <Text style={styles.text}>Nữ: {item.Female}</Text>
                <Text style={styles.text}>Tổng cộng: {item.Total}</Text>
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
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

export default ReportPatients;
