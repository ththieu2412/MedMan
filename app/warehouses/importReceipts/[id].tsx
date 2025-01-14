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
} from "react-native";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { detailIR, updateIR, deleteIR } from "@/services/api/IRService";
import { detailbyIRId } from "@/services/api/IRdetailService";
import { useToken } from "@/hooks/useToken";
import Icon from "react-native-vector-icons/FontAwesome"; // Import icon thư viện

const IRDetails = () => {
  const [irDetails, setIrDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedIR, setUpdatedIR] = useState<any>({
    id: "",
    import_date: "",
    warehouse: "",
    is_approved: false,
    employee: "",
    total_amount: 0,
    details: [],
  });
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false);
  const [productDetails, setProductDetails] = useState<any[]>([]);

  const { id } = useLocalSearchParams();
  const token = useToken();
  const router = useRouter();

  const fetchIRDetails = async () => {
    if (!id) return;
    try {
      const data = await detailIR(token, Number(id));
      if (data.data) {
        setIrDetails(data.data);
        setUpdatedIR({
          id: data.data.id,
          import_date: data.data.import_date,
          warehouse: data.data.warehouse,
          is_approved: data.data.is_approved,
          employee: data.data.employee,
          total_amount: data.data.total_amount,
          details: data.data.details || [],
        });
      }
      setLoading(false);
      setError(null);
    } catch (error: any) {
      setLoading(false);
      setError("Không thể tải thông tin phiếu nhập. Vui lòng thử lại.");
    }
  };

  const fetchProductDetails = async () => {
    if (!id) return;
    try {
      const response = await detailbyIRId(token, Number(id));
      if (response.data) {
        setProductDetails(response.data || []);
      }
    } catch (error) {
      Alert.alert("Không thể tải chi tiết sản phẩm. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchIRDetails();
  }, [id]);

  const handleUpdate = async () => {
    if (!updatedIR) return;
    try {
      await updateIR(token, irDetails.id, updatedIR);
      fetchIRDetails();
      Alert.alert("Cập nhật phiếu nhập thành công!");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Cập nhật phiếu nhập thất bại. Vui lòng thử lại.");
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
              await deleteIR(token, irDetails.id);
              router.replace("/warehouses/importReceipts/list");
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

  const toggleDetails = () => {
    setIsDetailsExpanded((prevState) => !prevState);
    if (!isDetailsExpanded) {
      fetchProductDetails();
    }
  };

  const handleEditDetails = () => {
    router.push(`/warehouses/importReceipts/importReceiptDetails/${id}`);
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chi Tiết Phiếu Nhập</Text>

      {/* Nút Chỉnh Sửa Ở Góc Phải Phía Trên */}
      <TouchableOpacity style={styles.editButton} onPress={handleEditDetails}>
        <Icon name="pencil" size={24} color="#007bff" />
      </TouchableOpacity>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Mã Phiếu Nhập:</Text>
        <Text style={styles.value}>{irDetails.id}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Nhân viên nhập:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={updatedIR.employee}
            onChangeText={(text) =>
              setUpdatedIR({ ...updatedIR, employee: text })
            }
          />
        ) : (
          <Text style={styles.value}>{irDetails.employee}</Text>
        )}
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Ngày Nhập:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={updatedIR.import_date}
            onChangeText={(text) =>
              setUpdatedIR({ ...updatedIR, import_date: text })
            }
          />
        ) : (
          <Text style={styles.value}>{irDetails.import_date}</Text>
        )}
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Kho:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={updatedIR.warehouse}
            onChangeText={(text) =>
              setUpdatedIR({ ...updatedIR, warehouse: text })
            }
          />
        ) : (
          <Text style={styles.value}>{irDetails.warehouse}</Text>
        )}
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Tổng tiền:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={updatedIR.total_amount.toString()}
            onChangeText={(text) =>
              setUpdatedIR({ ...updatedIR, total_amount: text })
            }
          />
        ) : (
          <Text style={styles.value}>{irDetails.total_amount} đồng</Text>
        )}
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
          {/* Nút Chỉnh Sửa Ở Góc Phải Phía Trên */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditDetails}
          >
            <Icon name="pencil" size={24} color="#007bff" />
          </TouchableOpacity>
          {productDetails.map((detail: any, index: number) => (
            <View key={index} style={styles.productDetail}>
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
        <>
          <MyButton
            title="Cập Nhật"
            onPress={() => setIsEditing(true)}
            buttonStyle={styles.updateButton}
          />
          <MyButton
            title="Xóa"
            onPress={handleDelete}
            buttonStyle={styles.deleteButton}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333333",
  },
  editButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  detailContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "#333333",
  },
  value: {
    fontSize: 16,
    flex: 2,
    color: "#555555",
  },
  input: {
    fontSize: 16,
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 5,
    color: "#555555",
  },
  switchWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: "#555555",
  },
  toggleButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#0069d9",
    borderRadius: 5,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  productDetailsContainer: {
    marginTop: 15,
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 5,
  },
  productDetail: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  productDetailText: {
    fontSize: 14,
    color: "#555555",
  },
  saveButton: {
    backgroundColor: "#28a745",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: "#007bff",
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    marginTop: 10,
  },
});

export default IRDetails;
