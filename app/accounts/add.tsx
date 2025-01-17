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
import { parse } from "date-fns";
import { useRouter } from "expo-router";
import { format, formatDate } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import CustomInput from "@/components/CustomInput";
import MyButton from "@/components/MyButton";
import { fontSize, spacing } from "@/constants/dimensions";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { createEmployees, createPatient } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const validateFields = (profile) => {
  const errors = {};

  // Kiểm tra trường họ tên
  if (/[^a-zA-Z\s]/.test(profile.full_name)) {
    errors.full_name = "Họ tên không chứa ký tự đặc biệt!";
  }

  // Kiểm tra trường ngày sinh
  if (new Date(profile.date_of_birth) > new Date()) {
    errors.date_of_birth = "Ngày sinh phải nhỏ hơn ngày hiện tại!";
  }

  // Kiểm tra CCCD (13 ký tự số)
  if (!/^\d{12}$/.test(profile.citizen_id)) {
    errors.citizen_id = "CCCD phải là chuỗi 12 ký tự số!";
  }

  // Kiểm tra số điện thoại
  if (!/^\d{10,20}$/.test(profile.phone_number)) {
    errors.phone_number = "Số điện thoại phải là chuỗi số từ 10 đến 20 ký tự!";
  }

  // Kiểm tra email
  if (
    !profile.email ||
    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(profile.email)
  ) {
    errors.email = "Email không hợp lệ!";
  }

  // Kiểm tra các trường còn lại
  if (!profile.address) {
    errors.address = "Địa chỉ không được để trống!";
  }

  return errors;
};

const SettingScreen = () => {
  const [profile, setProfile] = useState({
    // image: null,
    full_name: "",
    gender: "Nam",
    date_of_birth: "",
    citizen_id: "",
    address: "",
    phone_number: "",
    email: "",
    is_active: false,
    role: "staff",
  });

  const [errors, setErrors] = useState({});

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const router = useRouter();
  const user = useAuth();

  const handleEdit = useCallback(async () => {
    if (
      !profile.address ||
      !profile.date_of_birth ||
      !profile.email ||
      !profile.full_name ||
      !profile.citizen_id ||
      !profile.phone_number ||
      !profile.gender ||
      !profile.role
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const validationErrors = validateFields(profile);
    setErrors(validationErrors);

    // Nếu có lỗi, không tiếp tục
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    Alert.alert("Xác nhận", "Bạn có muốn tạo nhân viên mới?", [
      {
        text: "Đồng ý",
        onPress: async () => {
          try {
            const formattedProfile = {
              ...profile,
              date_of_birth: profile.date_of_birth
                ? format(
                    parse(profile.date_of_birth, "dd/MM/yyyy", new Date()),
                    "yyyy-MM-dd"
                  )
                : null, // Xử lý nếu date_of_birth null
            };

            console.log("Profile gửi tạo: ", formattedProfile);

            const response = await createEmployees(formattedProfile);
            console.log(response);

            if (response.success) {
              Alert.alert("Thông báo", "Thêm nhân viên thành công");
              console.log("Nhân viên đã được tạo!");
              router.push(`./list?role=${profile.role}`);
            } else {
              if (response.error.date_of_birth) {
                Alert.alert("Lỗi", response.error.date_of_birth);
              } else {
                Alert.alert("Lỗi", response.error.detail);
              }
            }
          } catch (error) {
            console.log("Lỗi khi tạo nhân viên: ", error);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi tạo nhân viên.");
          }
        },
      },
      { text: "Hủy", style: "cancel" },
    ]);
  }, [profile]);

  const handleFieldChange = useCallback(
    (field) => (value) => {
      setProfile((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleDateConfirm = (date) => {
    setProfile((prev) => ({
      ...prev,
      date_of_birth: format(date, "dd/MM/yyyy"),
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
        {errors.full_name && (
          <Text style={styles.errorText}>{errors.full_name}</Text>
        )}

        <Text style={styles.inputLabel}>Role</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={profile.role}
            onValueChange={(value) => {
              // Kiểm tra nếu giá trị mới khác với giá trị cũ trước khi cập nhật
              if (profile.role !== value) {
                handleFieldChange("role")(value);
              }
            }}
          >
            <Picker.Item label="Quản lý" value="admin" />
            <Picker.Item label="Nhân Viên" value="staff" />
            <Picker.Item label="Bác sĩ" value="doctor" />
            <Picker.Item label="Dược sĩ" value="pharmacist" />
          </Picker>
        </View>

        <Text style={styles.inputLabel}>Giới tính</Text>
        <View style={styles.inputRow}>
          <FontAwesome name="transgender" size={24} color="black" />
          <Picker
            selectedValue={profile.gender === 1 ? "Nam" : "Nữ"}
            onValueChange={handleFieldChange("gender")}
            style={styles.pickerA}
          >
            <Picker.Item label="Nam" value="1" style={styles.pickerItemText} />
            <Picker.Item label="Nữ" value="0" style={styles.pickerItemText} />
          </Picker>
        </View>

        <Text style={styles.inputLabel}>Ngày tháng năm sinh</Text>
        <TouchableOpacity style={styles.inputRow} onPress={showDatePicker}>
          <FontAwesome name="birthday-cake" size={24} color="black" />
          <Text style={styles.textInput}>
            {profile.date_of_birth || "Chọn ngày"}
          </Text>
        </TouchableOpacity>
        {errors.date_of_birth && (
          <Text style={styles.errorText}>{errors.date_of_birth}</Text>
        )}

        <CustomInput
          label="CCCD"
          placeholder="0802xxxxxxxx"
          icon={<AntDesign name="idcard" size={24} color="black" />}
          onChangeText={handleFieldChange("citizen_id")}
        />
        {errors.citizen_id && (
          <Text style={styles.errorText}>{errors.citizen_id}</Text>
        )}

        <CustomInput
          label="Địa chỉ"
          placeholder="789 Pham Ngoc Thach St, Hanoi, Vietnam"
          icon={<FontAwesome6 name="address-book" size={24} color="black" />}
          onChangeText={handleFieldChange("address")}
        />
        {errors.address && (
          <Text style={styles.errorText}>{errors.address}</Text>
        )}

        <CustomInput
          label="SĐT"
          placeholder="0918xxxxxx"
          icon={<Feather name="phone" size={24} color="black" />}
          onChangeText={handleFieldChange("phone_number")}
        />
        {errors.phone_number && (
          <Text style={styles.errorText}>{errors.phone_number}</Text>
        )}

        <CustomInput
          label="Email"
          placeholder="xxx@gmail.com"
          icon={<FontAwesome name="envelope" size={24} color="black" />}
          onChangeText={handleFieldChange("email")}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <Text style={styles.inputLabel}>Trạng thái làm việc</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={profile.is_active}
            onValueChange={(value) => handleFieldChange("is_active", value)}
          >
            <Picker.Item
              label="Đang làm việc"
              value={1}
              style={styles.pickerItemText}
            />
            <Picker.Item
              label="Nghỉ việc"
              value={0}
              style={styles.pickerItemText}
            />
          </Picker>
        </View>
      </View>

      <MyButton
        title="Tạo mới"
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

  picker: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  inputRow: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 15,
    marginLeft: 8,
  },
  pickerItemText: {
    color: "#000000", // Màu chữ mà bạn muốn, ở đây là màu xanh dương
  },
  pickerA: { flex: 1, marginLeft: spacing.sm, color: "#cccccc" },
  textInput: { flex: 1, marginLeft: spacing.sm, fontSize: fontSize.md },
});

export default SettingScreen;
