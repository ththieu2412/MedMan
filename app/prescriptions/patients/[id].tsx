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
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";

export default function SettingScreen() {
  const [image, setImage] = useState(null);
  const [gender, setGender] = useState("Nam");
  const [role, setRole] = useState("Nhân viên");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [cccd, setCccd] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const router = useRouter();

  // Hàm xử lý khi nhấn nút sửa thông tin
  const handleEdit = () => {
    console.log("Đang sửa");

    Alert.alert("Xác nhận", "Bạn có muốn tạo nhân viên mới?", [
      {
        text: "Đồng ý",
        onPress: () => {
          console.log("Nhân viên đã được tạo!");
          console.log(role);
          router.push(`/(tabs)/patients`);
        },
      },
      {
        text: "Hủy",
        style: "cancel",
      },
    ]);
  };

  // Hiển thị modal chọn ngày tháng
  const showDatePicker = () => {
    setDatePickerVisibility(true);
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

  const handleDelete = () => {
    // Xử lý xóa thuốc
    Alert.alert(
      "Xóa Bệnh Nhân",
      "Bạn có chắc chắn muốn xóa bệnh nhân này không?",
      [
        {
          text: "Xóa",
          onPress: () => {
            console.log(`Đã xóa bệnh nhân:`);
            router.replace("/(tabs)/patients");
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
      contentContainerStyle={{ paddingBottom: 2 * spacing.xl }}
    >
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

      <View style={styles.inputTextFieldContainer}>
        <CustomInput
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          icon={<AntDesign name="user" size={24} color="black" />}
          onChangeText={(text) => setCccd(text)}
          type={""}
        />

        <Text style={styles.inputLabel}>Giới tính</Text>
        <View style={styles.inputRow}>
          <FontAwesome name="transgender" size={24} color="black" />
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Nam" value="Nam" />
            <Picker.Item label="Nữ" value="Nữ" />
          </Picker>
        </View>

        <Text style={styles.inputLabel}>Ngày tháng năm sinh</Text>
        <TouchableOpacity style={styles.inputRow} onPress={showDatePicker}>
          <FontAwesome name="birthday-cake" size={24} color="black" />
          <Text style={styles.textInput}>
            {dateOfBirth ? dateOfBirth : "Chọn ngày"}
          </Text>
        </TouchableOpacity>

        <CustomInput
          label="CCCD"
          placeholder="0802xxxxxxxx"
          icon={<AntDesign name="idcard" size={24} color="black" />}
          onChangeText={(text) => setCccd(text)}
          type={""}
        />
        <CustomInput
          label="Địa chỉ"
          placeholder="789 Pham Ngoc Thach St, Hanoi, Vietnam"
          icon={<FontAwesome6 name="address-book" size={24} color="black" />}
          onChangeText={(text) => setAddress(text)}
          type={""}
        />
        <CustomInput
          label="SĐT"
          placeholder="0918xxxxxx"
          icon={<Feather name="phone" size={24} color="black" />}
          onChangeText={(text) => setPhoneNumber(text)}
          type={""}
        />
        <CustomInput
          label="Email"
          placeholder="xxx@gmail.com"
          icon={<Fontisto name="email" size={24} color="black" />}
          onChangeText={(text) => setEmail(text)}
          type={""}
        />
        <CustomInput
          label="Mức hưởng bảo hiểm"
          placeholder="0.x"
          icon={
            <MaterialCommunityIcons
              name="mother-heart"
              size={24}
              color="black"
            />
          }
          onChangeText={(text) => setEmail(text)}
          type={""}
        />
      </View>

      <MyButton
        title="Lưu"
        onPress={handleEdit}
        buttonStyle={{ backgroundColor: "green", marginBottom: spacing.md }}
      />

      <MyButton
        title="Đơn thuốc"
        onPress={handlePush}
        buttonStyle={{ marginBottom: spacing.md, marginTop: -20 }}
      />

      <MyButton
        title="Xóa"
        onPress={handleDelete}
        buttonStyle={{ backgroundColor: "red", marginTop: -20 }}
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
    color: "#cccccc",
  },
  textInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
  },
});
