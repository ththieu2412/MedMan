import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { fontSize, spacing } from "@/constants/dimensions";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomInput from "@/components/CustomInput";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { DeletePatient, UpdatePatient } from "@/services/api/patientService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DeleteEmployee, employeeDetail, UpdateEmployee } from "@/services/api";

export default function SettingScreen() {
  const { id } = useLocalSearchParams();
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    image: null,
    full_name: "",
    gender: "Nam",
    date_of_birth: "",
    id_card: "",
    address: "",
    phone_number: "",
    email: "",
    citizen_id: "",
    is_active: false,
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const router = useRouter();

  // Fetch dữ liệu chi tiết bệnh nhân
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await employeeDetail(Number(id));

        if (response.success) {
          // Kiểm tra nếu response.data tồn tại
          setEmployee(response.data);
          setFormData({
            image: null,
            full_name: response.data.full_name,
            gender: response.data.gender === false ? "Nữ" : "Nam",
            date_of_birth: response.data.date_of_birth,
            id_card: response.data.id_card || "",
            address: response.data.address || "",
            phone_number: response.data.phone_number || "",
            email: response.data.email || "",
            citizen_id: response.data.citizen_id,
            is_active: response.data.is_active,
          });
        } else {
          Alert.alert("Lỗi", response.error);
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong.");
      }
    };

    fetchData();
  }, [id]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateConfirm = (date) => {
    handleFieldChange("date_of_birth", format(date, "dd/MM/yyyy"));
    setDatePickerVisibility(false);
  };

  const handleImagePicker = async (source) => {
    try {
      const permissionResult =
        source === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          `You need to grant ${source} permissions to continue.`
        );
        return;
      }

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 1,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaType: ImagePicker.MediaTypeOptions.Photo,
              allowsEditing: true,
              quality: 1,
            });

      if (!result.canceled) {
        handleFieldChange("image", { uri: result.uri });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to pick an image.");
    }
  };

  const handleEditImage = () => {
    Alert.alert(
      "Chọn phương thức",
      "Bạn muốn chọn ảnh từ thư viện hay chụp ảnh mới?",
      [
        {
          text: "Chọn từ thư viện",
          onPress: () => handleImagePicker("library"),
        },
        { text: "Chụp ảnh", onPress: () => handleImagePicker("camera") },
        { text: "Hủy", style: "cancel" },
      ]
    );
  };

  const handleEdit = () => {
    Alert.alert("Xác nhận", "Bạn có muốn lưu thông tin đã chỉnh sửa?", [
      {
        text: "Đồng ý",
        onPress: save,
      },
      {
        text: "Hủy",
        style: "cancel",
      },
    ]);
  };

  const save = async () => {
    try {
      const updateData = {
        citizen_id: formData.citizen_id,
        address: formData.address,
        phone_number: formData.phone_number,
        email: formData.email,
        is_active: formData.is_active,
      };

      console.log(employee.id);
      const response = await UpdateEmployee(Number(employee.id), updateData); // Cập nhật bệnh nhân
      console.log(response);
      if (response.success) {
        Alert.alert("Thông báo", "Lưu thông tin thành công!");
      } else {
        Alert.alert("Lỗi", "Lưu thông tin không thành công.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi lưu thông tin.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: spacing.xl * 2 }}
    >
      <View style={styles.profileImageContainer}>
        <Image
          source={
            formData.image
              ? formData.image
              : require("@/assets/images/avatar/default.png")
          }
          style={styles.profileImage}
        />
        <TouchableOpacity
          style={styles.editContainer}
          onPress={handleEditImage}
        >
          <FontAwesome name="pencil-square-o" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.nameRoleContainer}>
        <Text style={styles.name}>{formData.full_name}</Text>
        <Text style={styles.role}>{formData.id_card}</Text>
      </View>

      <View style={styles.inputTextFieldContainer}>
        <CustomInput
          label="Citizen_ID"
          placeholder="02xxxxxx"
          icon={<FontAwesome name="user" size={24} color="black" />}
          onChangeText={(text) => handleFieldChange("citizen_id", text)}
          text={formData.citizen_id}
          type={""}
          edit={false}
        />
        <CustomInput
          label="Gender"
          placeholder="Nam hoặc Nữ"
          icon={<FontAwesome name="user" size={24} color="black" />}
          onChangeText={(text) => handleFieldChange("gender", text)}
          text={formData.gender}
          type={""}
          edit={false}
        />

        <Text style={styles.inputLabel}>Ngày tháng năm sinh</Text>
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
          <Text style={styles.textInput}>
            {formData.date_of_birth || "Chọn ngày"}
          </Text>
        </TouchableOpacity>

        <CustomInput
          label="Địa chỉ"
          placeholder="789 Phạm Ngọc Thạch, Hà Nội"
          icon={<FontAwesome name="map-marker" size={24} color="black" />}
          text={formData.address}
          onChangeText={(text) => handleFieldChange("address", text)}
          type={""}
        />
        <CustomInput
          label="SĐT"
          placeholder="0918xxxxxx"
          icon={<FontAwesome name="phone" size={24} color="black" />}
          text={formData.phone_number}
          onChangeText={(text) => handleFieldChange("phone_number", text)}
          type={""}
        />
        <CustomInput
          label="Email"
          placeholder="example@gmail.com"
          icon={<FontAwesome name="envelope" size={24} color="black" />}
          text={formData.email}
          onChangeText={(text) => handleFieldChange("email", text)}
          type={""}
        />

        <Text style={styles.inputLabel}>Trạng thái làm việc</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={formData.is_active}
            onValueChange={(value) => handleFieldChange("is_active", value)}
          >
            <Picker.Item label="Đang làm việc" value={1} />
            <Picker.Item label="Nghỉ việc" value={0} />
          </Picker>
        </View>
      </View>

      <MyButton
        title="Lưu"
        onPress={handleEdit}
        buttonStyle={styles.saveButton}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  profileImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
  },
  profileImage: {
    height: 140,
    width: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#007bff",
  },
  role: {
    fontSize: fontSize.md,
    color: "#007bff",
  },
  nameRoleContainer: {
    alignItems: "center",
    marginVertical: spacing.sm,
  },
  editContainer: {
    height: 35,
    width: 35,
    backgroundColor: "orange",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -18,
    marginLeft: 50,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: "#262626",
  },
  inputTextFieldContainer: {
    marginTop: spacing.sm,
  },
  inputLabel: {
    fontSize: fontSize.md,
    fontWeight: "bold",
    color: "black",
    marginVertical: spacing.sm,
  },
  textInput: {
    fontSize: fontSize.md,
    paddingVertical: spacing.sm,
  },
  saveButton: {
    backgroundColor: "green",
  },

  picker: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
});
