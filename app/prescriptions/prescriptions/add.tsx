import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { Patient } from "@/types";
import { getMedicineList, getPatients } from "@/services/api";
import { Picker } from "@react-native-picker/picker"; // Import Picker
import { useAuth } from "@/context/AuthContext";

const AddPrescriptions = () => {
  const [diagnosis, setDiagnosis] = useState("");
  const [instruction, setInstruction] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [patients, setPatients] = useState<Patient[] | null>(null);
  const [patientName, setPatientName] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const { user } = useAuth();

  const fetchPatient = async () => {
    try {
      const response = await getPatients();
      setPatients(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bệnh nhân: ", error);
    }
  };

  const fetchMedicine = async () => {
    try {
      const response = await getMedicineList();
      console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bệnh nhân: ", error);
    }
  };

  useEffect(() => {
    fetchMedicine();
    fetchPatient();
    setDoctorId(user?.employee_id);
  }, []);

  const handleAddPrescription = () => {
    if (!diagnosis || !instruction || !selectedPatient) {
      Alert.alert("Error", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const newPrescription = {
      diagnosis,
      instruction,
      doctor_id: doctorId,
      patient_id: selectedPatient,
    };

    router.replace("/(tabs)/prescriptions");
    Alert.alert("Thông báo", "Đơn thuốc được thêm thành công!");
    console.log(newPrescription);

    // Reset form fields
    setDiagnosis("");
    setInstruction("");
    setPatientName("");
    setSelectedPatient(""); // Reset patient selection
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KÊ ĐƠN THUỐC</Text>

      {/* Diagnosis */}
      <TextInput
        style={styles.input}
        placeholder="Diagnosis"
        value={diagnosis}
        onChangeText={setDiagnosis}
      />

      {/* Instruction */}
      <TextInput
        style={styles.input}
        placeholder="Instruction"
        value={instruction}
        onChangeText={setInstruction}
      />

      {/* Patient Name Picker */}
      <Text style={styles.label}>Chọn bệnh nhân:</Text>
      <Picker
        selectedValue={selectedPatient}
        style={styles.input}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedPatient(itemValue);
          const selected = patients?.find(
            (patient) => patient.id === itemValue
          );
          setPatientName(selected ? selected.full_name : "");
        }}
      >
        <Picker.Item label="Chọn bệnh nhân" value="" />
        {patients?.map((patient) => (
          <Picker.Item
            key={patient.id}
            label={patient.full_name}
            value={patient.id}
          />
        ))}
      </Picker>

      {/* Save Button */}
      <TouchableOpacity style={styles.button} onPress={handleAddPrescription}>
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddPrescriptions;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
