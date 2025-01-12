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
import Header from "@/components/Profile/Header";
import { fontSize, spacing } from "@/constants/dimensions";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomInput from "@/components/CustomInput";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import Feather from "@expo/vector-icons/build/Feather";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";
export default function SettingScreen() {
  const [image, setImage] = useState(null);

  const [gender, setGender] = useState("Nam");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [cccd, setCccd] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasChanges =
      dateOfBirth || cccd || address || phoneNumber || email || password;
    setIsEdited(hasChanges);
  }, [dateOfBirth, cccd, address, phoneNumber, email, password]);

  // Hàm xử lý logout
  const logout = () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn đăng xuất?", [
      {
        text: "Đồng ý",
        onPress: () => {
          console.log("User logged out");
          router.replace("/sign-in");
        },
      },
      {
        text: "Hủy",
        style: "cancel",
      },
    ]);
  };

  // Hàm xử lý khi nhấn nút sửa thông tin
  const handleEdit = () => {
    console.log("Đang sửa");
    if (!isEdited) {
      return; // Nếu chưa có thay đổi, không cho phép sửa
    }
    Alert.alert("Xác nhận", "Bạn có muốn sửa thông tin?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: () => {
          console.log("Thông tin đã được lưu!");
          setIsEdited(false); // Reset trạng thái
        },
      },
    ]);
  };

  const handleInputChange = (text, field) => {
    console.log(`${field} đã thay đổi:`, text);

    switch (field) {
      case "dateOfBirth":
        setDateOfBirth(text);
        break;
      case "cccd":
        setCccd(text);
        break;
      case "address":
        setAddress(text);
        break;
      case "phoneNumber":
        setPhoneNumber(text);
        break;
      case "email":
        setEmail(text);
        break;
      case "password":
        setPassword(text);
        break;
      default:
        break;
    }
  };

  // Hiển thị modal chọn ngày tháng
  const showDatePicker = () => {
    setDatePickerVisibility(true);
    setIsEdited(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setDateOfBirth(format(date, "dd/MM/yyyy")); // Định dạng ngày tháng
    hideDatePicker();
  };

  const handleChoosePhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
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
      console.log("Ảnh đã chọn:", result.uri);
      setImage({ uri: result.uri });
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
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
      setImage({ uri: result.uri });
    }
  };

  const handleEditImage = () => {
    Alert.alert(
      "Chọn phương thức",
      "Bạn muốn chọn ảnh từ thư viện hay chụp ảnh mới?",
      [
        {
          text: "Chọn từ thư viện",
          onPress: handleChoosePhoto,
        },
        {
          text: "Chụp ảnh",
          onPress: handleTakePhoto,
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 2 * spacing.xl }}
    >
      <Header />
      <View style={styles.profileImageContainer}>
        <Image
          source={image ? image : require("@/assets/images/avatar/default.png")}
          style={styles.profileImage}
        />
        <TouchableOpacity
          style={styles.editContainer}
          onPress={handleEditImage}
        >
          <FontAwesome name="pencil-square-o" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Profile detail container */}
      <View style={styles.nameRoleContainer}>
        <Text style={styles.name}>Nguyễn Văn A</Text>
        <Text style={styles.role}>Doctor</Text>
      </View>

      <View style={styles.inputTextFieldContainer}>
        <Text style={styles.inputLabel}>Giới tính</Text>
        <View style={styles.inputRow}>
          <FontAwesome name="transgender" size={24} color="black" />
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => {
              setGender(itemValue);
              handleInputChange(itemValue, "gender"); // In giá trị giới tính ra console
            }}
            style={styles.picker}
          >
            <Picker.Item label="Nam" value="Nam" />
            <Picker.Item label="Nữ" value="Nữ" />
          </Picker>
        </View>

        {/* Chọn ngày tháng năm sinh */}
        <Text style={styles.inputLabel}>Ngày tháng năm sinh</Text>
        <TouchableOpacity style={styles.inputRow} onPress={showDatePicker}>
          <FontAwesome name="birthday-cake" size={24} color="black" />
          <Text style={styles.textInput}>
            {dateOfBirth ? dateOfBirth : "Chọn ngày"}
          </Text>
        </TouchableOpacity>

        {/* Các trường thông tin khác */}
        <CustomInput
          label="CCCD"
          placeholder="0802xxxxxxxx"
          icon={<AntDesign name="idcard" size={24} color="black" />}
          onChangeText={(text) => handleInputChange(text, "cccd")}
          type={""}
        />
        <CustomInput
          label="Địa chỉ"
          placeholder="789 Pham Ngoc Thach St, Hanoi, Vietnam"
          icon={<FontAwesome6 name="address-book" size={24} color="black" />}
          onChangeText={(text) => handleInputChange(text, "address")}
          type={""}
        />
        <CustomInput
          label="SĐT"
          placeholder="0918xxxxxx"
          icon={<Feather name="phone" size={24} color="black" />}
          onChangeText={(text) => handleInputChange(text, "phoneNumber")}
          type={""}
        />
        <CustomInput
          label="Email"
          placeholder="xxx@gmail.com"
          icon={<Fontisto name="email" size={24} color="black" />}
          onChangeText={(text) => handleInputChange(text, "email")}
          type={""}
        />
        <CustomInput
          label="Password"
          placeholder="****************"
          icon={<AntDesign name="unlock" size={24} color="black" />}
          type="password"
          onChangeText={(text) => handleInputChange(text, "password")}
        />
      </View>

      {isEdited && (
        <MyButton
          title="Sửa thông tin"
          onPress={handleEdit}
          buttonStyle={{ backgroundColor: "green", marginBottom: spacing.md }}
        />
      )}

      {/* Nút Đăng xuất */}
      <MyButton
        title="Đăng xuất"
        onPress={logout}
        buttonStyle={{ backgroundColor: "red" }}
      />

      {/* Modal chọn ngày */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
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
  nameRoleContainer: {
    alignItems: "center",
    marginVertical: spacing.sm,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: "#262626",
  },
  role: {
    fontSize: fontSize.md,
    color: "#007bff",
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
  inputRow: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  picker: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  textInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
  },
});
