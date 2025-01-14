import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { getIRList } from "@/services/api/IRService"; // API call to fetch IR list
import { useToken } from "@/hooks/useToken"; // Token hook
import { useFocusEffect } from "@react-navigation/native"; // Hook to detect screen focus

const IRListScreen = () => {
  const [irList, setIrList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useToken();
  const router = useRouter();

  // Function to fetch the IR list
  const fetchIRList = async () => {
    try {
      setLoading(true);
      const response = await getIRList(token);
      setIrList(response.data || []); // Update state with fetched data
    } catch (error: any) {
      console.error("Error fetching IR list:", error);
      Alert.alert("Error", "Unable to fetch IR list.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchIRList();
    }, [])
  );

  // Render item for the IR list
  const renderItem = ({ item }) => (
    
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/warehouses/importReceipts/${item.id}`)} // Navigate to IR detail screen
    >
      <Text style={styles.irName}>Mã phiếu: {item.id}</Text>
      <Text style={styles.irDate}>Nhân viên lập: {item.employee_name}</Text>
      <Text style={styles.irDate}>Nhà kho: {item.warehouse_name}</Text>
      <Text style={styles.irDate}>Ngày lập: {item.import_date}</Text>
      <Text style={styles.irDate}>Tổng tiền: {item.total_amount} đồng</Text>
      <Text style={styles.irDate}>
                  Trạng thái: {item.is_approved ? "Đã duyệt" : "Chưa duyệt"}
                </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={irList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No IR records available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  irName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  irDate: {
    fontSize: 14,
    color: "#777",
  },
});

export default IRListScreen;
