import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "@/components/Home/Header"; // Đảm bảo đường dẫn đúng
import SearchText from "@/components/SearchText"; // Đảm bảo đường dẫn đúng
import PrescriptionsList from "../prescriptions/prescriptions/list"; // Đảm bảo đường dẫn đúng
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";

const Prescriptions = () => {
  const router = useRouter();
  const handleAdd = () => {
    router.push("/prescriptions/prescriptions/add");
  };
  return (
    <View style={styles.container}>
      <Header />
      <SearchText
        placeholder={"Tìm kiếm theo bác sĩ (bệnh nhân)"}
        setSearchText={function (text: string): void {
          throw new Error("Function not implemented.");
        }}
      />
      <Text style={styles.heading}>DANH SÁCH ĐƠN THUỐC</Text>
      <PrescriptionsList />
      <MyButton title={"Kê đơn thuốc"} onPress={handleAdd} />
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
