import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import Header from "@/components/Profile/Header";
import CustomInput from "@/components/CustomInput";
import MyButton from "@/components/MyButton";
import { fontSize, spacing } from "@/constants/dimensions";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { createPatient } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const SettingScreen = () => {
  const [profile, setProfile] = useState({
    image: null,
    full_name: "",
    gender: 0,
    date_of_birth: "",
    id_card: "",
    address: "",
    phone_number: "",
    email: "",
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [employee, setEmployee] = useState<string | null>(null);

  const router = useRouter();
  const user = useAuth();

  useEffect(() => {
    if (user.user?.employee_id) {
      setEmployee(user.user.employee_id);
    }
  }, [user]);

  const handleEdit = useCallback(async () => {
    if (
      !profile.address ||
      !profile.date_of_birth ||
      !profile.email ||
      !profile.full_name ||
      !profile.id_card ||
      !profile.phone_number ||
      !profile.gender
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    Alert.alert("Xác nhận", "Bạn có muốn tạo nhân viên mới?", [
      {
        text: "Đồng ý",
        onPress: async () => {
          try {
            console.log("Profile Patient: ", profile);
            const response = await createPatient({
              ...profile,
              employee,
            });
            console.log(response);
            if (response.success) {
              Alert.alert("Thông báo", "Thêm bệnh nhân thành công");
              console.log("Bệnh nhân đã được tạo!");
              router.push(`/(tabs)/patients`);
            } else {
              Alert.alert("Lỗi", response.errorMessage);
            }
          } catch (error) {
            // console.error("Lỗi khi tạo nhân viên:", error);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi tạo bệnh nhân.");
          }
        },
      },
      { text: "Hủy", style: "cancel" },
    ]);
  }, [profile, employee]);

  const handleFieldChange = (field) => (value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleDateConfirm = (date) => {
    setProfile((prev) => ({
      ...prev,
      date_of_birth: format(date, "yyyy-MM-dd"),
    }));
    hideDatePicker();
  };

  const handleChoosePhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "You need to grant media library permissions to select a photo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Photo,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProfile((prev) => ({ ...prev, image: { uri: result.uri } }));
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "You need to grant camera permissions to take a photo."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProfile((prev) => ({ ...prev, image: { uri: result.uri } }));
    }
  };

  const handleEditImage = () => {
    Alert.alert(
      "Chọn phương thức",
      "Bạn muốn chọn ảnh từ thư viện hay chụp ảnh mới?",
      [
        { text: "Chọn từ thư viện", onPress: handleChoosePhoto },
        { text: "Chụp ảnh", onPress: handleTakePhoto },
        { text: "Hủy", style: "cancel" },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 2 * spacing.xl }}
    >
      <View style={styles.profileImageContainer}>
        <Image
          source={
            profile.image
              ? profile.image
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

      <View style={styles.inputTextFieldContainer}>
        <CustomInput
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          icon={<AntDesign name="user" size={24} color="black" />}
          onChangeText={handleFieldChange("full_name")}
        />
        <Text style={styles.inputLabel}>Giới tính</Text>
        <View style={styles.inputRow}>
          <FontAwesome name="transgender" size={24} color="black" />
          <Picker
            selectedValue={profile.gender === 1 ? "Nam" : "Nữ"}
            onValueChange={handleFieldChange("gender")}
            style={styles.picker}
          >
            <Picker.Item label="Nam" value="1" />
            <Picker.Item label="Nữ" value="0" />
          </Picker>
        </View>

        <Text style={styles.inputLabel}>Ngày tháng năm sinh</Text>
        <TouchableOpacity style={styles.inputRow} onPress={showDatePicker}>
          <FontAwesome name="birthday-cake" size={24} color="black" />
          <Text style={styles.textInput}>
            {profile.date_of_birth || "Chọn ngày"}
          </Text>
        </TouchableOpacity>

        <CustomInput
          label="CCCD"
          placeholder="0802xxxxxxxx"
          icon={<AntDesign name="idcard" size={24} color="black" />}
          onChangeText={handleFieldChange("id_card")}
        />
        <CustomInput
          label="Địa chỉ"
          placeholder="789 Pham Ngoc Thach St, Hanoi, Vietnam"
          icon={<FontAwesome6 name="address-book" size={24} color="black" />}
          onChangeText={handleFieldChange("address")}
        />
        <CustomInput
          label="SĐT"
          placeholder="0918xxxxxx"
          icon={<Feather name="phone" size={24} color="black" />}
          onChangeText={handleFieldChange("phone_number")}
        />
        <CustomInput
          label="Email"
          placeholder="xxx@gmail.com"
          icon={<FontAwesome name="envelope" size={24} color="black" />}
          onChangeText={handleFieldChange("email")}
        />
      </View>

      <MyButton
        title="Lưu"
        onPress={handleEdit}
        buttonStyle={{ backgroundColor: "green", marginBottom: spacing.md }}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
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
  inputTextFieldContainer: { marginTop: spacing.sm },
  inputLabel: {
    fontSize: fontSize.md,
    fontWeight: "bold",
    color: "black",
    marginVertical: spacing.sm,
  },
  inputRow: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  picker: { flex: 1, marginLeft: spacing.sm, color: "#cccccc" },
  textInput: { flex: 1, marginLeft: spacing.sm, fontSize: fontSize.md },
});

export default SettingScreen;
