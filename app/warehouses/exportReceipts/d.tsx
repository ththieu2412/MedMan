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
  RefreshControl,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { detailES, updateES, deleteES } from "@/services/api/ESService"; // Đổi sang dịch vụ cho phiếu xuất
import { detailbyESId } from "@/services/api/ESdetailService"; // Đổi sang chi tiết phiếu xuất
import { getWarehouseList } from "@/services/api/warehouseService";
import { useToken } from "@/hooks/useToken";
import Icon from "react-native-vector-icons/FontAwesome";

const ESDetails = () => {
  const [esDetails, setEsDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedES, setUpdatedES] = useState<any>({
    id: "",
    export_date: "",
    warehouse: "",
    is_approved: false,
    employee: "",
    total_value: 0, // Tên trường đã thay đổi
    details: [],
  });
  const [warehouses, setWarehouses] = useState<any[]>([]); // Danh sách kho
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false);
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false); // Thêm state refreshing

  const { id } = useLocalSearchParams();
  const token = useToken();
  const router = useRouter();

  const fetchESDetails = async () => {
    if (!id) return;
    try {
      const data = await detailES(Number(id)); // Sử dụng dịch vụ phiếu xuất
      if (data.success) {
        setEsDetails(data.data.data);
        setUpdatedES({
          id: data.data.data.id,
          export_date: data.data.data.export_date, // Đổi tên trường
          warehouse: data.data.data.warehouse,
          is_approved: data.data.data.is_approved,
          employee: data.data.data.employee,
          total_value: data.data.data.total_value, // Thay đổi trường tổng giá trị
          details: data.data.data.details || [],
        });
        setLoading(false);
        setError(null);
      } else {
        Alert.alert("Thông báo lỗi", data.errorMessage);
      }
    } catch (error: any) {
      setLoading(false);
      setError("Không thể tải thông tin phiếu xuất. Vui lòng thử lại.");
    }
  };

  const fetchWarehousesList = async () => {
    try {
      const response = await getWarehouseList();
      if (response.success) {
        const formattedData = response.data.data.map((item: any) => ({
          label: item.warehouse_name,
          value: item.id,
        }));
        setWarehouses(formattedData);
      } else {
        Alert.alert("Thông báo lỗi", response.errorMessage);
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error);
    }
  };

  const fetchProductDetails = async () => {
    if (!id) return;
    try {
      const response = await detailbyESId(Number(id)); // Sử dụng API chi tiết phiếu xuất
      if (response.success) {
        setProductDetails(response.data.data || []);
      } else {
        Alert.alert("Thông báo lỗi", response.errorMessage);
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error);
    }
  };

  useEffect(() => {
    fetchESDetails();
    fetchWarehousesList();
    fetchProductDetails();
  }, []);

  const handleUpdate = async () => {
    if (!updatedES) return;

    try {
      const warehouseItem = warehouses.find(
        (item) => item.label === updatedES.warehouse
      );
      if (!warehouseItem) {
        Alert.alert(
          "Lỗi",
          "Không tìm thấy kho phù hợp. Vui lòng kiểm tra lại."
        );
        return;
      }

      const updatedESData = {
        id: updatedES.id,
        export_date: updatedES.export_date,
        warehouse: warehouseItem.value,
        is_approved: updatedES.is_approved,
        employee: updatedES.employee,
        total_value: updatedES.total_value,
      };

      const response = await updateES(esDetails.id, updatedESData); // Cập nhật phiếu xuất
      if (response.success) {
        Alert.alert("Thành công", "Cập nhật phiếu xuất thành công!");
        fetchESDetails();
      } else {
        Alert.alert("Thông báo lỗi", response.errorMessage);
      }

      setIsEditing(false);
    } catch (error: any) {
      Alert.alert("Thông báo lỗi", error || "Đã xảy ra lỗi.");
    }
  };

  const handleWarehouseChange = (value: any) => {
    const selectedWarehouse = warehouses.find((item) => item.value === value);
    if (selectedWarehouse) {
      setUpdatedES((prevState) => ({
        ...prevState,
        warehouse: selectedWarehouse.label, // Cập nhật kho mới bằng tên
      }));
    }
  };

  const handleDelete = async () => {
    if (!esDetails) return;
    Alert.alert(
      "Xóa Phiếu Xuất",
      "Bạn có chắc chắn muốn xóa phiếu xuất này không?",
      [
        {
          text: "Xóa",
          onPress: async () => {
            try {
              const response = await deleteES(esDetails.id); // Xóa phiếu xuất
              if (response.success) {
                Alert.alert("Thành công", "Xóa phiếu xuất thành công!");
              } else {
                Alert.alert("Thông báo lỗi", response.errorMessage);
              }
              router.replace("/warehouses/exportReceipts/list");
            } catch (error: any) {
              Alert.alert("Lỗi", error || "Xóa phiếu xuất thất bại.");
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
    router.push(`/warehouses/exportReceipts/exportReceiptDetails/${id}`);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchESDetails();
    await fetchWarehousesList();
    await fetchProductDetails();
    setRefreshing(false);
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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Chi Tiết Phiếu Xuất</Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setIsEditing(true)} // Chỉnh sửa phiếu xuất
      >
        <Icon name="pencil" size={24} color="#007bff" />
      </TouchableOpacity>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Mã Phiếu Xuất:</Text>
        <Text style={styles.value}>{esDetails.id}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Người xuất:</Text>
        <Text style={styles.value}>{esDetails.employee}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Ngày lập phiếu:</Text>
        <Text style={styles.value}>{esDetails.export_date}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Kho:</Text>

        {isEditing ? (
          <View style={styles.switchWrapper}>
            <Text style={styles.value}>
              {updatedES.warehouse || "Không xác định"}
            </Text>
            <RNPickerSelect
              onValueChange={handleWarehouseChange}
              items={warehouses}
              placeholder={{ label: "Chọn kho...", value: null }}
              style={pickerSelectStyles}
              value={
                updatedES.warehouse
                  ? warehouses.find(
                      (item) => item.label === updatedES.warehouse
                    )?.value
                  : null
              }
            />
          </View>
        ) : (
          <Text style={styles.value}>
            {updatedES.warehouse || "Không xác định"}
          </Text>
        )}
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Tổng giá trị:</Text>
        <Text style={styles.value}>{esDetails.total_value} đồng</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Trạng thái:</Text>
        {isEditing ? (
          <View style={styles.switchWrapper}>
            <Switch
              value={updatedES.is_approved}
              onValueChange={(value) =>
                setUpdatedES({ ...updatedES, is_approved: value })
              }
            />
            <Text style={styles.switchLabel}>
              {updatedES.is_approved ? "Đã duyệt" : "Chưa duyệt"}
            </Text>
          </View>
        ) : (
          <Text style={styles.value}>
            {esDetails.is_approved ? "Đã duyệt" : "Chưa duyệt"}
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
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditDetails}
          >
            <Icon name="pencil" size={24} color="#007bff" />
          </TouchableOpacity>
          {productDetails.map((detail: any) => (
            <View key={detail.id} style={styles.productDetail}>
              <Text style={styles.productDetailText}>
                Tên sản phẩm: {detail.product_name}
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
        !esDetails.is_approved && (
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
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  detailContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  value: {
    flex: 2,
    fontSize: 16,
    color: "gray",
  },
  switchWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  toggleButton: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  productDetailsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  productDetail: {
    marginBottom: 15,
  },
  productDetailText: {
    fontSize: 16,
    color: "gray",
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
  deleteButton: {
    backgroundColor: "#ffc107",
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default ESDetails;
