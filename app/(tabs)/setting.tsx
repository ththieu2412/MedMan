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
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { add, format } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/context/AuthContext";
import { employeeDetail } from "@/services/api";
import { formatDate } from "@/utils/formatDate";

export default function SettingScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const [image, setImage] = useState(null);
  const [fullname, setFullName] = useState("");
  const [gender, setGender] = useState("Nam");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [cccd, setCccd] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const shouldShowButton = user?.role === "admin";

  // Fetch dữ liệu chi tiết nhân viên
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await employeeDetail(user?.employee_id);
        if (response.success) {
          setDateOfBirth(formatDate(response.data.date_of_birth));
          setCccd(response.data.citizen_id);
          setAddress(response.data.address);
          setPhoneNumber(response.data.phone_number);
          setEmail(response.data.email);
          setFullName(response.data.full_name);
          setGender(response.data.gender == false ? "Nữ" : "Nam");
          setImage(response.data.image);
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };
    fetchData();
  }, []);

  // Hàm xử lý cập nhật thông tin
  const handleEdit = () => {
    if (!isEdited) {
      Alert.alert("Thông báo", "Bạn chưa thay đổi thông tin.");
      return;
    }

    Alert.alert("Xác nhận", "Bạn có muốn lưu thay đổi không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đồng ý",
        onPress: () => {
          console.log("Thông tin đã được lưu!");
          setIsEdited(false);
        },
      },
    ]);
  };

  // Hàm xử lý chọn ngày
  const handleDateConfirm = (date) => {
    setDateOfBirth(format(date, "dd/MM/yyyy"));
    setIsEdited(true);
    hideDatePicker();
  };

  const handleInputChange = (text, field) => {
    setIsEdited(true);
    switch (field) {
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
    }
  };

  // Hàm hiển thị chọn ảnh
  const handleChoosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: "photo",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Hàm chụp ảnh mới
  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleEditImage = () => {
    Alert.alert("Chọn ảnh", "Bạn muốn làm gì?", [
      { text: "Hủy", style: "cancel" },
      { text: "Chọn từ thư viện", onPress: handleChoosePhoto },
      { text: "Chụp ảnh mới", onPress: handleTakePhoto },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Header />
      <View style={styles.profileImageContainer}>
        <Image
          source={
            image
              ? { uri: image }
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

      {/* Hiển thị thông tin người dùng */}
      <View style={styles.nameRoleContainer}>
        <Text style={styles.name}>{fullname}</Text>
        <Text style={styles.role}>{user?.role}</Text>
      </View>

      <View style={styles.inputTextFieldContainer}>
        <Text style={styles.inputLabel}>Giới tính</Text>
        <Picker
          selectedValue={gender}
          onValueChange={(value) => {
            setGender(value);
            setIsEdited(true);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Nam" value="Nam" />
          <Picker.Item label="Nữ" value="Nữ" />
        </Picker>

        {/* Chọn ngày tháng năm sinh */}
        <Text style={styles.inputLabel}>Ngày tháng năm sinh</Text>
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => setDatePickerVisibility(true)}
        >
          <FontAwesome name="birthday-cake" size={24} color="black" />
          <Text style={styles.textInput}>{dateOfBirth || "Chọn ngày"}</Text>
        </TouchableOpacity>

        <CustomInput
          label="CCCD"
          placeholder="Nhập CCCD"
          icon={<AntDesign name="idcard" size={24} color="black" />}
          onChangeText={(text) => {
            handleInputChange(text, "cccd");
          }}
          text={cccd}
          edit={shouldShowButton}
        />
        <CustomInput
          label="Địa chỉ"
          placeholder="Nhập địa chỉ"
          icon={<FontAwesome6 name="address-book" size={24} color="black" />}
          onChangeText={(text) => handleInputChange(text, "address")}
          text={address}
          edit={shouldShowButton}
        />
        <CustomInput
          label="SĐT"
          placeholder="Nhập số điện thoại"
          icon={<Feather name="phone" size={24} color="black" />}
          onChangeText={(text) => handleInputChange(text, "phoneNumber")}
          text={phoneNumber}
          edit={shouldShowButton}
        />
        <CustomInput
          label="Email"
          placeholder="Nhập email"
          icon={<Fontisto name="email" size={24} color="black" />}
          onChangeText={(text) => handleInputChange(text, "email")}
          text={email}
          edit={shouldShowButton}
        />
        {/* <CustomInput
          label="Password"
          placeholder="Nhập mật khẩu"
          icon={<AntDesign name="unlock" size={24} color="black" />}
          type="password"
          onChangeText={(text) => handleInputChange(text, "password")}
          text="****************"
        /> */}
      </View>

      {shouldShowButton && isEdited && (
        <MyButton
          title="Sửa thông tin"
          onPress={handleEdit}
          buttonStyle={{ backgroundColor: "green", marginBottom: spacing.md }}
        />
      )}

      <MyButton
        title="Đăng xuất"
        onPress={logout}
        buttonStyle={{ backgroundColor: "red" }}
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
    padding: 20,
  },
  picker: {
    borderWidth: 1, // Đặt độ dày viền
    borderColor: "#000", // Màu của viền (ở đây là màu đen)
    borderRadius: 8, // Góc bo tròn của viền
    paddingLeft: 10, // Thêm padding để cách nội dung trong picker
    paddingRight: 10,
  },
  textInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
  },
});
