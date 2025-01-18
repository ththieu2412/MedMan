import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Switch,
  ScrollView,
  TouchableOpacity,
  RefreshControl, // Import RefreshControl
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { detailIR, updateIR, deleteIR } from "@/services/api/IRService";
import { detailbyIRId } from "@/services/api/IRdetailService";
import { getWarehouseList } from "@/services/api/warehouseService"; // Import hàm fetchWarehouses
import { useToken } from "@/hooks/useToken";
import Icon from "react-native-vector-icons/FontAwesome"; // Import icon thư viện

const IRDetails = () => {
  const [irDetails, setIrDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<boolean>(false);
  const [updatedIR, setUpdatedIR] = useState<any>({
    id: "",
    import_date: "",
    warehouse: "",
    is_approved: false,
    employee: "",
    total_amount: 0,
    details: [],
  });
  const [warehouses, setWarehouses] = useState<any[]>([]); // Danh sách kho
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false);
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false); // Thêm state refreshing

  const { id } = useLocalSearchParams();
  const token = useToken();
  const router = useRouter();

  const fetchIRDetails = async () => {
    if (!id) return;
    try {
      const data = await detailIR(Number(id));
      if (data.success) {
        setIrDetails(data.data.data);
        setUpdatedIR({
          id: data.data.data.id,
          import_date: data.data.data.import_date,
          warehouse: data.data.data.warehouse,
          is_approved: data.data.data.is_approved,
          employee: data.data.data.employee,
          total_amount: data.data.data.total_amount,
          details: data.data.data.details || [],
        });
        setNewStatus(data.data.data.is_approved);
        setLoading(false);
        setError(null);
      } else {
        Alert.alert("Thông báo lỗi", data.errorMessage);
        // router.replace("/warehouses/warehouses/list");
      }
      // if (data.data) {
      //   setIrDetails(data.data);
      //   setUpdatedIR({
      //     id: data.data.id,
      //     import_date: data.data.import_date,
      //     warehouse: data.data.warehouse,
      //     is_approved: data.data.is_approved,
      //     employee: data.data.employee,
      //     total_amount: data.data.total_amount,
      //     details: data.data.details || [],
      //   });
      // }
      // setLoading(false);
      // setError(null);
    } catch (error: any) {
      setLoading(false);
      setError("Không thể tải thông tin phiếu nhập. Vui lòng thử lại.");
    }
  };

  const fetchWarehousesList = async () => {
    try {
      const response = await getWarehouseList(); // Gọi API lấy danh sách kho
      if (response.success) {
        const formattedData = response.data.data.map((item: any) => ({
          label: item.warehouse_name,
          value: item.id,
        }));
        setWarehouses(formattedData); // Đặt danh sách kho vào state
      } else {
        Alert.alert("Thông báo lỗi", response.errorMessage);
        // router.replace("/warehouses/warehouses/list");
      }
      // if (response.data) {
      //   const formattedData = response.data.map((item: any) => ({
      //     label: item.warehouse_name,
      //     value: item.id,
      //   }));
      //   setWarehouses(formattedData); // Đặt danh sách kho vào state
      // }
    } catch (error: any) {
      Alert.alert("Lỗi", error);
    }
  };

  const fetchProductDetails = async () => {
    if (!id) return;
    try {
      const response = await detailbyIRId(Number(id));
      console.log(
        "response = await detailbyIRId(Number(id));",
        response.data.data
      );
      if (response.success) {
        setProductDetails(response.data.data || []);
      } else {
        Alert.alert("Thông báo lỗi", response.errorMessage);
        // router.replace("/warehouses/warehouses/list");
      }

      // if (response.data) {
      //   setProductDetails(response.data || []);
      // }
    } catch (error: any) {
      Alert.alert("Lỗi", error);
    }
  };

  // useEffect(() => {
  //   fetchIRDetails();
  //   fetchWarehousesList(); // Tải danh sách kho khi component mount
  // }, [id]);
  useEffect(() => {
    fetchIRDetails();
    fetchWarehousesList(); // Tải danh sách kho khi component mount
    fetchProductDetails();
  }, []);

  const handleUpdate = async () => {
    if (!updatedIR) return;

    try {
      // Tìm ID của kho dựa trên tên kho trong danh sách
      const warehouseItem = warehouses.find(
        (item) => item.label === updatedIR.warehouse
      );
      if (!warehouseItem) {
        Alert.alert(
          "Lỗi",
          "Không tìm thấy kho phù hợp. Vui lòng kiểm tra lại."
        );
        return;
      }

      // Chuẩn bị dữ liệu cập nhật
      const updatedIRData = {
        id: updatedIR.id,
        import_date: updatedIR.import_date,
        warehouse: warehouseItem.value, // Sử dụng ID của kho thay vì tên
        is_approved: updatedIR.is_approved,
        employee: updatedIR.employee,
        total_amount: updatedIR.total_amount,
      };

      // Gọi API cập nhật
      const response = await updateIR(irDetails.id, updatedIRData);
      if (response.success) {
        Alert.alert("Thành công", "Cập nhật phiếu nhập thành công!");
        fetchIRDetails();
      } else {
        Alert.alert("Thông báo lỗi", response.errorMessage);
        // router.replace("/warehouses/warehouses/list");
      }
      // Lấy lại dữ liệu sau khi cập nhật
      // fetchIRDetails();

      // Alert.alert("Cập nhật phiếu nhập thành công!");
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert("Thông báo lỗi ", error || "Đã xảy ra lỗi.");
    }
  };

  const handleWarehouseChange = (value: any) => {
    const selectedWarehouse = warehouses.find((item) => item.value === value);
    if (selectedWarehouse) {
      setUpdatedIR((prevState) => ({
        ...prevState,
        warehouse: selectedWarehouse.label, // Cập nhật kho mới bằng tên
      }));
    }
  };

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
              const response = await deleteIR(irDetails.id);
              if (response.success) {
                Alert.alert("Thành công", "Xóa phiếu nhập thành công!.");
              } else {
                Alert.alert("Thông báo lỗi", response.errorMessage);
              }
              router.replace("/warehouses/importReceipts/list");
              Alert.alert("Xóa phiếu nhập thành công!");
            } catch (error: any) {
              Alert.alert(
                "Lỗi",
                error || "Xóa phiếu nhập thất bại. Vui lòng thử lại."
              );
            }
          },
        },
        { text: "Hủy", style: "cancel" },
      ]
    );
  };

  const toggleDetails = () => {
    setIsDetailsExpanded((prevState) => !prevState);
    if (!isDetailsExpanded) {
      fetchProductDetails();
    }
  };

  const handleEditDetails = () => {
    router.push(`/warehouses/importReceipts/importReceiptDetails/${id}`);
  };

  // Hàm xử lý pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    // Tải lại dữ liệu
    await fetchIRDetails();
    await fetchWarehousesList();
    await fetchProductDetails();
    setRefreshing(false); // Kết thúc trạng thái refreshing
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{error}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Thêm RefreshControl
      }
    >
      <Text style={styles.title}>Chi Tiết Phiếu Nhập</Text>
      {!newStatus && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)} // Kích hoạt chế độ chỉnh sửa
        >
          <Icon name="pencil" size={24} color="#007bff" />
        </TouchableOpacity>
      )}
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Mã Phiếu Nhập:</Text>
        <Text style={styles.value}>{irDetails.id}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Nhân viên nhập:</Text>
        <Text style={styles.value}>{irDetails.employee}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Ngày lập phiếu:</Text>
        <Text style={styles.value}>{irDetails.import_date}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Kho:</Text>

        {isEditing ? (
          <View style={styles.switchWrapper}>
            <Text style={styles.value}>
              {updatedIR.warehouse || "Không xác định"} {/* Hiển thị tên kho */}
            </Text>
            <RNPickerSelect
              onValueChange={handleWarehouseChange}
              items={warehouses}
              placeholder={{ label: "Chọn kho...", value: null }}
              style={pickerSelectStyles}
              value={
                updatedIR.warehouse
                  ? warehouses.find(
                      (item) => item.label === updatedIR.warehouse
                    )?.value
                  : null
              }
            />
          </View>
        ) : (
          <Text style={styles.value}>
            {updatedIR.warehouse || "Không xác định"} {/* Hiển thị tên kho */}
          </Text>
        )}
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Tổng tiền:</Text>
        <Text style={styles.value}>{irDetails.total_amount} đồng</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Trạng thái:</Text>
        {isEditing ? (
          <View style={styles.switchWrapper}>
            <Switch
              value={updatedIR.is_approved}
              onValueChange={(value) =>
                setUpdatedIR({ ...updatedIR, is_approved: value })
              }
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

      <TouchableOpacity style={styles.toggleButton} onPress={toggleDetails}>
        <Text style={styles.toggleButtonText}>
          {isDetailsExpanded ? "Thu gọn" : "Xem chi tiết sản phẩm"}
        </Text>
      </TouchableOpacity>

      {isDetailsExpanded && (
        <View style={styles.productDetailsContainer}>
          {!newStatus && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditDetails}
            >
              <Icon name="pencil" size={24} color="#007bff" />
            </TouchableOpacity>
          )}
          {productDetails.map((detail: any, index: number) => (
            <View key={detail.id || index} style={styles.productDetail}>
              <Text style={styles.productDetailText}>
                Tên thuốc: {detail.medicine}
              </Text>
              <Text style={styles.productDetailText}>
                Số lượng: {detail.quantity}
              </Text>
              <Text style={styles.productDetailText}>Giá: {detail.price}</Text>
            </View>
          ))}
        </View>
      )}

      {isEditing ? (
        <>
          <MyButton
            title="Lưu"
            onPress={handleUpdate}
            buttonStyle={styles.saveButton}
          />
          <MyButton
            title="Hủy"
            onPress={() => setIsEditing(false)}
            buttonStyle={styles.cancelButton}
          />
        </>
      ) : (
        !newStatus && ( // Kiểm tra trạng thái trước khi hiển thị
          <MyButton
            title="Xóa"
            onPress={handleDelete}
            buttonStyle={styles.deleteButton}
          />
        )
      )}
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9", // Màu nền sáng, nhẹ nhàng.
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1a73e8", // Màu xanh nổi bật.
  },
  editButton: {
    position: "absolute",
    top: -10,
    right: -10,
    zIndex: 10,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  detailContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: "space-between", // Đảm bảo label và nội dung không bị chồng lên nhau
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "black",
    flex: 2,
    textAlign: "center", // Căn giữa văn bản trong ô
  },
  switchWrapper: {
    flex: 2, // Đảm bảo không gian hợp lý
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Căn giữa switch trong ô
  },
  switchLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: "#555555",
  },
  toggleButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#1a73e8",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  productDetailsContainer: {
    marginTop: 15,
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  productDetail: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  productDetailText: {
    fontSize: 15,
    color: "#555555",
  },
  saveButton: {
    backgroundColor: "#34a853", // Xanh lá cây cho hành động thành công.
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: "#1a73e8",
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#e63946", // Đỏ nổi bật cho hành động nguy hiểm.
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
});

export default IRDetails;
