import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/Home/Header";
import PatientListScreen from "../prescriptions/patients/list";
import MyButton from "@/components/MyButton";
import SearchText from "@/components/SearchText";
import { useRouter } from "expo-router";
import { Patient } from "@/types";
import { getPatients } from "@/services/api/patientService";
import { useAuth } from "@/context/AuthContext";

const Patients = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const { user } = useAuth();
  const shouldShowButton = user?.role === "doctor" || user?.role === "staff";

  const handlePress = () => {
    router.push("/prescriptions/patients/add");
  };
  const [patients, setPatitients] = useState<Patient[]>([]);

  const fetchData = async () => {
    const response = await getPatients();
    if (response.success) {
      setPatitients(response.data.data);
    } else {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPatient = patients.filter((patients) =>
    patients.full_name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header />

      <SearchText
        placeholder={"Nhập tên bệnh nhân"}
        style={styles.search}
        setSearchText={setSearchText}
      />

      {/* Phần tiêu đề */}
      <Text style={styles.title}>Danh sách bệnh nhân</Text>

      {/* Danh sách bệnh nhân */}
      {filteredPatient.length > 0 ? (
        <PatientListScreen patients={filteredPatient} />
      ) : (
        <Text style={styles.noResultText}>Không tìm thấy thuốc phù hợp</Text>
      )}

      {/* Nút thêm bệnh nhân */}
      {shouldShowButton && (
        <MyButton title={"Thêm bệnh nhân"} onPress={handlePress} />
      )}
    </View>
  );
};

export default Patients;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  search: {
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  titleContainer: {
    backgroundColor: "#ffffff",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 10,
  },
  patientList: {
    marginTop: 20,
  },
  addButton: {
    marginTop: 30,
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  noResultText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});
