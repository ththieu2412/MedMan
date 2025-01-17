import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ReportInventory } from "@/services/api"; // Giả sử bạn đã cấu hình API ở đây
import { useToken } from "@/hooks/useToken";
import * as Print from "expo-print";
import Icon from "react-native-vector-icons/FontAwesome5"; // Sử dụng icon từ FontAwesome5

const reportInventoryScreen = () => {
  const [reportData, setReportData] = useState<any>(null);
  const token = useToken();

  const fetchReport = async () => {
    try {
      const data = await ReportInventory(token);
      console.log("Response nhận được từ report tồn kho", data);
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const print = async () => {
    const htmlContent = `
      <html>
        <body>
          <h1 style="text-align: center;">Báo Cáo Tồn Kho</h1>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">STT</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tên Thuốc</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tồn Kho</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Trạng Thái</th>
            </tr>
            ${reportData?.data
              ?.map(
                (item, index) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${
                    index + 1
                  }</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${
                    item.medicine_name
                  }</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${
                    item.stock_quantity
                  }</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${
                    item.status_inventory
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
      <Text style={styles.title}>Báo Cáo Tồn Kho</Text>

      <Button title="Lấy Báo Cáo" onPress={fetchReport} />

      <TouchableOpacity style={styles.button} onPress={print}>
        <Icon name="print" size={20} color="#fff" />
        <Text style={styles.buttonText}>In Báo Cáo</Text>
      </TouchableOpacity>

      {reportData && (
        <ScrollView style={styles.reportContainer}>
          <FlatList
            data={reportData.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.reportItem}>
                <Text style={styles.text}>STT: {index + 1}</Text>
                <Text style={styles.text}>Tên Thuốc: {item.medicine_name}</Text>
                <Text style={styles.text}>Tồn Kho: {item.stock_quantity}</Text>
                <Text style={styles.text}>
                  Trạng Thái: {item.status_inventory}
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

export default reportInventoryScreen;
