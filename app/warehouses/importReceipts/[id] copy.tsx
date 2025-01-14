import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Switch,
  ScrollView,
} from "react-native";
import MyButton from "@/components/MyButton"; // Giả sử bạn có một component Button tuỳ chỉnh
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { detailIR, updateIR, deleteIR } from "@/services/api/IRService"; // Import các API service
import { useToken } from "@/hooks/useToken"; // Hook lấy token cho API call

const IRDetails = () => {
  const [irDetails, setIrDetails] = useState<any>(null); // Lưu chi tiết phiếu nhập
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Thông báo lỗi nếu có
  const [isEditing, setIsEditing] = useState<boolean>(false); // Trạng thái chỉnh sửa
  const [updatedIR, setUpdatedIR] = useState<any>({
    id: "",
    import_date: "", // Ngày nhập
    warehouse: "", // Tên kho
    is_approved: false, // Trạng thái duyệt
    employee: "", // Tên nhân viên
    total_amount: 0, // Tổng tiền
    details: [], // Chi tiết sản phẩm
  });
  const { id } = useLocalSearchParams(); // Lấy id từ URL
  const token = useToken(); // Lấy token
  const router = useRouter();

  // Hàm lấy dữ liệu chi tiết phiếu nhập
  const fetchIRDetails = async () => {
    if (!id) return;

    try {
      const data = await detailIR(token, Number(id)); // Gọi API lấy chi tiết phiếu nhập
      console.log("data chi tiết", data);
      setIrDetails(data.data); // Lưu thông tin phiếu nhập vào state
      setUpdatedIR({
        id: data.data.id, // Cập nhật tên phiếu nhập
        import_date: data.data.import_date, // Ngày nhập
        warehouse: data.data.warehouse, // Tên kho
        is_approved: data.data.is_approved, // Trạng thái duyệt
        employee: data.data.employee, // Tên nhân viên
        total_amount: data.data.total_amount,
        details: data.data.details || [], // Cập nhật chi tiết sản phẩm
      });
      setLoading(false);
      setError(null);
    } catch (error: any) {
      setLoading(false);
      setError("Không thể tải thông tin phiếu nhập. Vui lòng thử lại.");
    }
  };

  // Gọi fetchIRDetails khi component mount
  useEffect(() => {
    fetchIRDetails();
  }, [id]);

  // Xử lý cập nhật phiếu nhập
  const handleUpdate = async () => {
    if (!updatedIR) return;

    try {
      const response = await updateIR(token, irDetails.id, updatedIR);
      fetchIRDetails(); // Tải lại dữ liệu sau khi cập nhật
      Alert.alert("Cập nhật phiếu nhập thành công!");
      setIsEditing(false); // Tắt chế độ chỉnh sửa
    } catch (error) {
      Alert.alert("Cập nhật phiếu nhập thất bại. Vui lòng thử lại.");
    }
  };

  // Xử lý xóa phiếu nhập
  const handleDelete = async () => {
    if (!irDetails) return;

    Alert.alert(
      "Xóa Phiếu Nhập",
      "Bạn có chắc chắn muốn xóa phiếu nhập này không?",
      [
        {
          text: "Xóa",
          onPress: async () => {
            try {
              await deleteIR(token, irDetails.id);
              router.replace("/warehouses/importReceipts/list"); // Điều hướng về danh sách phiếu nhập
              Alert.alert("Xóa phiếu nhập thành công!");
            } catch (error) {
              Alert.alert("Xóa phiếu nhập thất bại. Vui lòng thử lại.");
            }
          },
        },
        { text: "Hủy", style: "cancel" },
      ]
    );
  };

  // Giao diện khi có lỗi
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{error}</Text>
      </View>
    );
  }

  // Giao diện khi đang loading
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Giao diện chi tiết phiếu nhập
  if (irDetails) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Chi Tiết Phiếu Nhập</Text>

        {/* Mã phiếu nhập */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Mã Phiếu Nhập:</Text>
          <Text style={styles.value}>{irDetails.id}</Text>
        </View>

        {/* Tên phiếu nhập */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Nhân viên nhập:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={updatedIR.employee}
              onChangeText={(text) =>
                setUpdatedIR({ ...updatedIR, employee: text })
              } // Cập nhật giá trị
            />
          ) : (
            <Text style={styles.value}>{irDetails.employee}</Text>
          )}
        </View>

        {/* Ngày nhập */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Ngày Nhập:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={updatedIR.import_date}
              onChangeText={(text) =>
                setUpdatedIR({ ...updatedIR, import_date: text })
              } // Cập nhật giá trị
            />
          ) : (
            <Text style={styles.value}>{irDetails.import_date}</Text>
          )}
        </View>
        {/* kho */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Kho:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={updatedIR.warehouse}
              onChangeText={(text) =>
                setUpdatedIR({ ...updatedIR, warehouse: text })
              } // Cập nhật giá trị
            />
          ) : (
            <Text style={styles.value}>{irDetails.warehouse}</Text>
          )}
        </View>
        {/* tổng tiền */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Tổng tiền:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={updatedIR.warehouse}
              onChangeText={(text) =>
                setUpdatedIR({ ...updatedIR, total_amount: text })
              } // Cập nhật giá trị
            />
          ) : (
            <Text style={styles.value}>{irDetails.total_amount} đồng</Text>
          )}
        </View>
        {/* Trạng thái */}
        <View style={styles.detailContainer}>
  <Text style={styles.label}>Trạng thái:</Text>
  {isEditing ? (
    <View style={styles.switchWrapper}>
      <Switch
        value={updatedIR.is_approved} // Dùng updatedIR.is_approved
        onValueChange={(value) =>
          setUpdatedIR({ ...updatedIR, is_approved: value })
        } // Cập nhật giá trị
      />
      <Text style={styles.switchLabel}>
        {updatedIR.is_approved ? "Đã duyệt" : "Chưa duyệt"}
      </Text>
    </View>
  ) : (
    <Text style={styles.value}>
      {irDetails.is_approved ? "Đã duyệt" : "Chưa duyệt"}
    </Text>
  )}
</View>


        {/* Chi tiết sản phẩm */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Chi Tiết Sản Phẩm:</Text>
          {irDetails.details?.map((detail: any, index: number) => (
            <View key={index} style={styles.productDetail}>
              <Text>{detail.product_name}</Text>
              <Text>Số Lượng: {detail.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Chỉnh sửa và xóa */}
        {isEditing ? (
          <>
            <MyButton
              title="Lưu"
              onPress={handleUpdate}
              buttonStyle={{ backgroundColor: "#1E88E5", marginTop: 20 }}
            />
            <MyButton
              title="Hủy"
              onPress={() => setIsEditing(false)}
              buttonStyle={{ backgroundColor: "gray", marginTop: 10 }}
            />
          </>
        ) : (
          <>
            <MyButton
              title="Cập Nhật"
              onPress={() => setIsEditing(true)}
              buttonStyle={{ backgroundColor: "#1E88E5", marginTop: 20 }}
            />
            <MyButton
              title="Xóa"
              onPress={handleDelete}
              buttonStyle={{ backgroundColor: "red", marginTop: 10 }}
            />
          </>
        )}
      </ScrollView>
    );
  }
};

export default IRDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "black",
  },
  detailContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "black",
  },
  switchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Giữ cho Switch luôn căn trái
    marginLeft: 10, // Khoảng cách từ label đến switch
  },
  switchLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: "black",  // Màu cho "Đã duyệt" hoặc "Chưa duyệt"
  },
  value: {
    fontSize: 16,
    flex: 2,
    color: "black",
  },
  input: {
    fontSize: 16,
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 5,
    color: "black",
  },
  productDetail: {
    marginVertical: 10,
  },
});
