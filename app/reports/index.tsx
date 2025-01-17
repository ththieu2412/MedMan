import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

const IndexScreen = () => {
  const router = useRouter();

  // Hàm để điều hướng đến màn hình báo cáo cụ thể
  const navigateToReport = (reportName: string) => {
    router.push(`/reports/${reportName}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn Báo Cáo</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToReport("reportImportReceipt")}
      >
        <Text style={styles.buttonText}>Báo Cáo Phiếu Nhập Hàng</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToReport("reportEmployeeActivity")}
      >
        <Text style={styles.buttonText}>Báo Cáo Hoạt Động Nhân Viên</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToReport("reportInventory")}
      >
        <Text style={styles.buttonText}>Báo Cáo Tồn Kho</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToReport("reportPatient")}
      >
        <Text style={styles.buttonText}>Báo Cáo Bệnh Nhân</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToReport("reportSales")}
      >
        <Text style={styles.buttonText}>Báo Cáo Doanh Số</Text>
        {/* Tùy chỉnh theo báo cáo thứ 4 */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#1E90FF",
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    width: "100%",
    marginBottom: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default IndexScreen;
