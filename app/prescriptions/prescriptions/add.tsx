import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { Patient, Medicine } from "@/types";
import {
  createPrescription,
  getMedicineList,
  getPatients,
} from "@/services/api";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/context/AuthContext";

const AddPrescriptions = () => {
  const [diagnosis, setDiagnosis] = useState("");
  const [instruction, setInstruction] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [patients, setPatients] = useState<Patient[] | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [medicineList, setMedicineList] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<
    { id: string; name: string; quantity: string; usage: string }[]
  >([]);
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
      setMedicineList(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thuốc: ", error);
    }
  };

  useEffect(() => {
    fetchMedicine();
    fetchPatient();
    setDoctorId(user?.employee_id);
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = medicineList.filter((medicine) =>
        medicine.medicine_name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredMedicines(filtered);
    } else {
      setFilteredMedicines([]);
    }
  }, [searchText]);

  const addMedicine = (medicine) => {
    if (selectedMedicines.some((item) => item.id === medicine.id)) {
      Alert.alert("Thông báo", "Thuốc đã được chọn.");
      return;
    }
    setSelectedMedicines((prev) => [
      ...prev,
      {
        id: medicine.id,
        medicine_name: medicine.medicine_name,
        quantity: "",
        usage: "",
      },
    ]);
    setSearchText("");
    setFilteredMedicines([]);
  };

  const updateMedicineDetails = (id, field, value) => {
    setSelectedMedicines((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddPrescription = async () => {
    if (
      !diagnosis ||
      !instruction ||
      !selectedPatient ||
      selectedMedicines.length === 0 ||
      selectedMedicines.some((item) => !item.quantity || !item.usage)
    ) {
      Alert.alert("Error", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const newPrescription = {
      diagnosis,
      instruction,
      doctor_id: doctorId,
      patient_id: selectedPatient,
      details: selectedMedicines,
    };

    console.log("Đơn thuốc mới: ", newPrescription);
    console.log(
      "Chi tiết đơn thuốc: ",
      newPrescription.medicines,
      " ===",
      selectedMedicines
    );
    const response = await createPrescription(newPrescription);
    if (response.success) {
      router.replace("/(tabs)/prescriptions");
      Alert.alert("Thông báo", "Đơn thuốc được thêm thành công!");
    } else {
      console.log("Thêm đơn thuốc thất bại:", response.errorMessage);
    }
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
        onValueChange={(itemValue) => setSelectedPatient(itemValue)}
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

      {/* Search and Add Medicines */}
      <Text style={styles.label}>Chọn thuốc:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên thuốc"
        value={searchText}
        onChangeText={setSearchText}
      />
      {filteredMedicines.length > 0 && (
        <FlatList
          data={filteredMedicines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.medicineItem}
              onPress={() => addMedicine(item)}
            >
              <Text style={styles.medicineText}>{item.medicine_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Selected Medicines */}
      {selectedMedicines.map((medicine) => (
        <View key={medicine.id} style={styles.selectedMedicineItem}>
          <Text style={styles.medicineText}>{medicine.medicine_name}</Text>
          <TextInput
            style={styles.quantityInput}
            placeholder="Số lượng"
            keyboardType="numeric"
            value={medicine.quantity}
            onChangeText={(value) =>
              updateMedicineDetails(medicine.id, "quantity", value)
            }
          />
          <TextInput
            style={styles.usageInput}
            placeholder="Cách sử dụng"
            value={medicine.usage}
            onChangeText={(value) =>
              updateMedicineDetails(medicine.id, "usage", value)
            }
          />
        </View>
      ))}

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
  medicineItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  medicineText: {
    fontSize: 16,
    color: "#333",
  },
  selectedMedicineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  quantityInput: {
    height: 40,
    width: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft: 10,
    backgroundColor: "#fff",
  },
  usageInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
