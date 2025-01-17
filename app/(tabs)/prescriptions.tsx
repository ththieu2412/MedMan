import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/Home/Header";
import SearchText from "@/components/SearchText";
import PrescriptionsList from "../prescriptions/prescriptions/list";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { getPrescriptionList } from "@/services/api"; // Đảm bảo đường dẫn tới API đúng
import { useAuth } from "@/context/AuthContext";

const Prescriptions = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const shouldShowButton = user?.role === "doctor";

  const handleAdd = () => {
    router.push("/prescriptions/prescriptions/add");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getPrescriptionList();
      setPrescriptions(data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <SearchText
        placeholder={"Tìm kiếm theo bác sĩ (bệnh nhân)"}
        setSearchText={(text: string) => setSearchText(text)}
      />
      <Text style={styles.heading}>DANH SÁCH ĐƠN THUỐC</Text>
      <PrescriptionsList prescriptions={prescriptions} loading={loading} />
      {shouldShowButton && (
        <MyButton title={"Kê đơn thuốc"} onPress={handleAdd} />
      )}
    </View>
  );
};

export default Prescriptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
});
