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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import {
  DeletePatient,
  PatientDetail,
  UpdatePatient,
} from "@/services/api/patientService";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SettingScreen() {
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    image: null,
    full_name: "",
    gender: "Nam",
    date_of_birth: "",
    id_card: "",
    address: "",
    phoneNumber: "",
    email: "",
    insurance: 0,
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const router = useRouter();

  // Fetch dữ liệu chi tiết bệnh nhân
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PatientDetail(Number(id));
        if (response.success) {
          setFormData({
            image: null,
            full_name: response.data.full_name,
            gender: response.data.gender === false ? "Nữ" : "Nam",
            date_of_birth: response.data.date_of_birth,
            id_card: response.data.id_card || "",
            address: response.data.address || "",
            phoneNumber: response.data.phone_number || "",
            email: response.data.email || "",
            insurance: response.data.insurance,
          });
        } else {
          Alert.alert("Error", "Failed to fetch patient details.");
        }
      } catch (error) {
        console.error(error);
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
        address: formData.address,
        phone_number: formData.phoneNumber,
        email: formData.email,
        insurance: formData.insurance,
      };

      const response = await UpdatePatient(Number(id), updateData); // Cập nhật bệnh nhân

      if (response.success) {
        Alert.alert("Thông báo", "Lưu thông tin thành công!");
      } else {
        if (response.errorMessage.phone_number) {
          Alert.alert("Lỗi", response.errorMessage.phone_number.join(","));
        } else if (response.errorMessage.insurance) {
          Alert.alert("Lỗi", response.errorMessage.insurance.join(", "));
        } else {
          Alert.alert("Lỗi", response.errorMessage.email.join(", "));
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi lưu thông tin.");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Xóa Bệnh Nhân",
      "Bạn có chắc chắn muốn xóa bệnh nhân này không?",
      [
        {
          text: "Xóa",
          onPress: async () => {
            try {
              const response = await DeletePatient(Number(id));
              if (response.success) {
                Alert.alert("Thông báo", "Bệnh nhân đã được xóa thành công!");
                router.replace("/(tabs)/patients");
              } else {
                Alert.alert(
                  "Lỗi",
                  response.errorMessage || "Không thể xóa bệnh nhân."
                );
              }
            } catch (error) {
              Alert.alert("Lỗi", "Đã xảy ra lỗi khi xóa bệnh nhân.");
            }
          },
        },
        { text: "Hủy", style: "cancel" },
      ]
    );
  };

  const handlePush = () => {
    router.push("/(tabs)/prescriptions?id=1");
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
      </View>

      <View style={styles.inputTextFieldContainer}>
        <CustomInput
          label="ID_card"
          placeholder="02xxxxxx"
          icon={<FontAwesome name="user" size={24} color="black" />}
          onChangeText={(text) => handleFieldChange("cccd", text)}
          text={formData.id_card}
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

        <CustomInput
          label="Ngày tháng năm sinh"
          placeholder="dd/MM/YYYY"
          icon={<FontAwesome name="birthday-cake" size={24} color="black" />}
          text={formData.date_of_birth}
          type={""}
          edit={false}
        />

        <CustomInput
          label="Địa chỉ"
          placeholder="789 Phạm Ngọc Thạch, Hà Nội"
          icon={<FontAwesome name="map-marker" size={24} color="black" />}
          text={formData.address}
          onChangeText={(text) => handleFieldChange("address", text)}
          type={""}
          edit={true}
        />
        <CustomInput
          label="SĐT"
          placeholder="0918xxxxxx"
          icon={<FontAwesome name="phone" size={24} color="black" />}
          text={formData.phoneNumber}
          onChangeText={(text) => handleFieldChange("phoneNumber", text)}
          type={""}
          edit={true}
        />
        <CustomInput
          label="Email"
          placeholder="example@gmail.com"
          icon={<FontAwesome name="envelope" size={24} color="black" />}
          text={formData.email}
          onChangeText={(text) => handleFieldChange("email", text)}
          type={""}
          edit={true}
        />
        <CustomInput
          label="Insurance"
          placeholder="0"
          icon={
            <MaterialCommunityIcons
              name="mother-heart"
              size={24}
              color="black"
            />
          }
          text={String(formData.insurance)}
          onChangeText={(text) => handleFieldChange("insurance", text)}
          type={""}
          edit={true}
        />
      </View>

      <MyButton
        title="Lưu"
        onPress={handleEdit}
        buttonStyle={styles.saveButton}
      />
      <MyButton title="Đơn thuốc" onPress={handlePush} />
      <MyButton
        title="Xóa"
        onPress={handleDelete}
        buttonStyle={styles.deleteButton}
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
  picker: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 12,
    padding: spacing.xs,
  },
  textInput: {
    fontSize: fontSize.md,
    paddingVertical: spacing.sm,
  },
  saveButton: {
    backgroundColor: "green",
  },
  deleteButton: {
    backgroundColor: "red",
  },
});
