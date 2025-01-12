import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";

const AddPrescriptions = () => {
  const [diagnosis, setDiagnosis] = useState("");
  const [prescriptionDate, setPrescriptionDate] = useState("");
  const [instruction, setInstruction] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");

  const handleAddPrescription = () => {
    // if (
    //   !diagnosis ||
    //   !prescriptionDate ||
    //   !instruction ||
    //   !doctorName ||
    //   !patientName
    // ) {
    //   Alert.alert("Error", "Please fill in all fields.");
    //   return;
    // }

    const newPrescription = {
      diagnosis,
      prescription_date: prescriptionDate,
      instruction,
      doctor: { id: 1, full_name: doctorName },
      patient: { id: 2, full_name: patientName },
    };

    router.replace("/(tabs)/prescriptions");
    Alert.alert("Success", "Prescription added successfully!");
    console.log(newPrescription);

    // Reset form fields
    setDiagnosis("");
    setPrescriptionDate("");
    setInstruction("");
    setDoctorName("");
    setPatientName("");
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

      {/* Prescription Date */}
      <TextInput
        style={styles.input}
        placeholder="Prescription Date (YYYY-MM-DD HH:MM)"
        value={prescriptionDate}
        onChangeText={setPrescriptionDate}
      />

      {/* Instruction */}
      <TextInput
        style={styles.input}
        placeholder="Instruction"
        value={instruction}
        onChangeText={setInstruction}
      />

      {/* Doctor Name */}
      <TextInput
        style={styles.input}
        placeholder="Doctor's Name"
        value={doctorName}
        onChangeText={setDoctorName}
      />

      {/* Patient Name */}
      <TextInput
        style={styles.input}
        placeholder="Patient's Name"
        value={patientName}
        onChangeText={setPatientName}
      />

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
