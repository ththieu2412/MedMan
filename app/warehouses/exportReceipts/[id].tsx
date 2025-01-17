import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
  Switch,
} from "react-native";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import {
  detailER,
  deleteER,
  updateERAndDetails,
  getMedicineList,
  detailWarehouse,
  employeeDetail,
} from "@/services/api/index";
import { useToken } from "@/hooks/useToken";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; // Import RNPicker
import { fontSize } from "@/constants/dimensions";

const ExportReceiptDetails = () => {
  const [exportDetails, setExportDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isProductEditable, setIsProductEditable] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newMedicine, setNewMedicine] = useState<string>("");
  const [newStatus, setNewStatus] = useState<boolean>(false);
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [employeeName, setEmployeeName] = useState<string | null>(null);
  const [warehouseName, setWarehouseName] = useState<string | null>(null);
  const { id } = useLocalSearchParams();
  const token = useToken();
  const router = useRouter();
  const [medicines, setMedicines] = useState<any[]>([]);

  // Fetch export details
  const fetchExportDetails = async () => {
    if (!Number(id)) {
      setError("Không tìm thấy mã phiếu xuất.");
      setLoading(false);
      return;
    }
    try {
      const data = await detailER(Number(id));
      if (data?.data?.id) {
        setExportDetails(data.data);
        setError(null);
        setNewStatus(data.data.is_approved);
        // Gọi fetchAdditionalDetails ngay sau khi exportDetails được cập nhật
        await fetchAdditionalDetails(data.data);
      } else {
        setError("Dữ liệu phiếu xuất không hợp lệ.");
      }
    } catch (err: any) {
      setError("Không thể tải thông tin phiếu xuất. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  const handleDiscardChanges = () => {
    setIsEditing(false); // Exit edit mode
    fetchExportDetails();
  };
  const fetchAdditionalDetails = async (exportData: any) => {
    try {
      // Lấy thông tin nhân viên
      if (exportData.employee) {
        const employeeData = await employeeDetail(exportData.employee);
        if (employeeData?.full_name) {
          setEmployeeName(employeeData.full_name);
        } else {
          setEmployeeName("Không xác định");
        }
      }

      // Lấy thông tin kho
      if (exportData?.warehouse) {
        const warehouseData = await detailWarehouse(exportData.warehouse);
        if (warehouseData?.data?.data?.warehouse_name) {
          setWarehouseName(warehouseData.data.data.warehouse_name);
        } else {
          setWarehouseName("Không xác định");
        }
      }
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.message ||
          "Không thể tải thông tin nhân viên hoặc kho. Vui lòng thử lại."
      );
    }
  };

  // Fetch medicines list
  const fetchMedicines = async () => {
    try {
      const response = await getMedicineList();
      if (response?.data && Array.isArray(response.data)) {
        const availableMedicines = response.data.filter((medicine: any) => {
          return !exportDetails?.details?.some(
            (detail: any) => detail.medicine === medicine.id
          );
        });

        const options = availableMedicines.map((medicine: any) => ({
          label: medicine.medicine_name,
          value: medicine.id,
          sale_price: medicine.sale_price,
          stock_quantity: medicine.stock_quantity,
        }));
        setMedicines(options);
      } else {
        Alert.alert("Lỗi", "Dữ liệu thuốc không đúng định dạng.");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải danh sách thuốc.");
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setLoading(true);
    await fetchExportDetails();

    setLoading(false);
  };
  const toggleApproveStatus = async (value: boolean) => {
    try {
      const updatedData = {
        ...exportDetails,
        is_approved: value,
      };
      // Giả sử đây là API updateERAndDetails
      await updateERAndDetails(Number(id), updatedData); // Gọi API để cập nhật trạng thái
      setExportDetails(updatedData);
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.message || "Không thể cập nhật trạng thái. Vui lòng thử lại."
      );
    }
  };

  // Add product to export receipt
  // const handleAddProduct = () => {
  //   if (!newMedicine) {
  //     Alert.alert("Lỗi", "Vui lòng chọn thuốc.");
  //     return;
  //   }
  //   const selectedMedicine = medicines.find(
  //     (medicine) => medicine.value === newMedicine
  //   );
  //   const newProduct = {
  //     medicine: selectedMedicine?.value || 0,
  //     quantity: newQuantity,
  //     export_receipt: Number(id),
  //   };

  //   setExportDetails((prevDetails: any) => ({
  //     ...prevDetails,
  //     details: [...prevDetails.details, newProduct],
  //   }));
  //   console.log("dữ liệu đyà đủ", exportDetails);
  //   setModalVisible(false);
  // };

  const handleAddProduct = () => {
    if (!newMedicine) {
      Alert.alert("Lỗi", "Vui lòng chọn thuốc.");
      return;
    }
    console.log("thuốc nè", newMedicine);
    // Tìm thông tin thuốc đã chọn
    const selectedMedicine = medicines.find(
      (medicine) => medicine.value === newMedicine
    );
    console.log("thuốc nè bro ", selectedMedicine);
    if (!selectedMedicine) {
      Alert.alert("Lỗi", "Thuốc được chọn không tồn tại.");
      return;
    }

    // Kiểm tra nếu số lượng nhập vào lớn hơn số lượng tồn kho

    const newProduct = {
      medicine: selectedMedicine.value,
      quantity: newQuantity,
      export_receipt: Number(id),
    };

    // Cập nhật danh sách chi tiết
    setExportDetails((prevDetails: any) => {
      const updatedDetails = {
        ...prevDetails,
        details: [...prevDetails.details, newProduct],
      };

      // Kiểm tra sau khi cập nhật
      console.log("Danh sách sau khi thêm sản phẩm:", updatedDetails);

      return updatedDetails;
    });

    // Đóng modal
    setModalVisible(false);
  };

  const handleDelete = async () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa phiếu xuất này?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteER(Number(id)); // Giả sử deleteER là API xóa phiếu xuất
              Alert.alert("Thành công", "Phiếu xuất đã được xóa.");
              router.replace("/warehouses/exportReceipts/list"); // Điều hướng người dùng sau khi xóa
            } catch (error: any) {
              Alert.alert(
                "Lỗi",
                error.message || "Không thể xóa phiếu xuất. Vui lòng thử lại."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  // Fetch data when component is mounted
  useEffect(() => {
    fetchExportDetails();
    // if (exportDetails) {
    //   fetchAdditionalDetails();
    // }
  }, []);

  useEffect(() => {
    if (exportDetails) {
      fetchMedicines();
    }
  }, [exportDetails]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{error}</Text>
      </View>
    );
  }
  if (!exportDetails || !exportDetails.details) {
    return <Text>Không có dữ liệu chi tiết phiếu xuất.</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Chi Tiết Phiếu Xuất</Text>
        {!newStatus && (
          <TouchableOpacity
            style={styles.editApproveButton}
            onPress={() => {
              if (isEditing) {
                // Show alert to confirm discarding changes
                Alert.alert(
                  "Discard Changes",
                  "Bạn chưa lưu, bạn có muốn thoát không?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Discard",
                      onPress: handleDiscardChanges, // Exit edit mode
                    },
                  ]
                );
              } else {
                // Directly enable editing mode
                setIsEditing(true);
              }
            }}
          >
            <Ionicons
              name={isEditing ? "checkmark-done-circle" : "create"}
              size={24}
              color="#1a73e8"
            />
          </TouchableOpacity>
        )}
        // Thay đổi trong phần JSX
        {exportDetails && (
          <>
            {/* Hiển thị thông tin mã phiếu */}
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Mã Phiếu Xuất:</Text>
              <Text style={styles.value}>{exportDetails.id}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Đơn Thuốc:</Text>
              <Text style={styles.value}>{exportDetails.prescription}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Kho:</Text>
              <Text style={styles.value}>{warehouseName}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Tổng Tiền:</Text>
              <Text style={styles.value}>{exportDetails.total_amount}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Ngày Xuất:</Text>
              <Text style={styles.value}>
                {new Date(exportDetails.export_date).toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Nhân Viên:</Text>
              <Text style={styles.value}>
                {employeeName || "Không xác định"}
              </Text>
            </View>

            {/* Hiển thị trạng thái phiếu */}
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Trạng thái:</Text>
              {isEditing ? (
                <Switch
                  value={exportDetails.is_approved}
                  onValueChange={(value) =>
                    setExportDetails((prev) => ({
                      ...prev,
                      is_approved: value,
                    }))
                  }
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={exportDetails.is_approved ? "#f5dd4b" : "#f4f3f4"}
                />
              ) : (
                <Text style={styles.value}>
                  {exportDetails.is_approved ? "Duyệt" : "Chưa duyệt"}
                </Text>
              )}
            </View>

            {isEditing && (
              <TouchableOpacity
                style={styles.addProductButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={{ fontSize: 16 }}>Thêm chi tiết</Text>
                <Ionicons name="add-circle" size={30} color="#1a73e8" />
              </TouchableOpacity>
            )}

            {/* Hiển thị danh sách sản phẩm */}
            <View>
              {exportDetails.details.map((detail: any, index: number) => (
                <View key={index} style={styles.productDetail}>
                  <Text style={styles.productDetailText}>
                    Thuốc: {detail.medicine_name}
                  </Text>
                  <Text style={styles.productDetailText}>
                    Gía: {detail.price}
                  </Text>
                  <Text style={styles.productDetailText}>
                    Bảo hiểm hỗ trợ: {detail.insurance_covered}
                  </Text>
                  <Text style={styles.productDetailText}>
                    Bảo hiểm trả: {detail.ins_amount}
                  </Text>
                  <Text style={styles.productDetailText}>
                    Bệnh nhân trả: {detail.patient_pay}
                  </Text>
                  <View style={styles.detailContainer}>
                    <Text style={styles.label}>Số lượng:</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.input}
                        value={String(detail.quantity)}
                        onChangeText={(text) => {
                          // Chuyển đổi giá trị nhập vào thành số
                          const enteredQuantity = Number(text);

                          // Lấy thông tin tồn kho của thuốc từ mảng 'medicines'
                          const medicine = medicines.find(
                            (med) => med.id === detail.medicineId
                          );

                          if (medicine) {
                            const availableStock = medicine.stock_quantity; // Số lượng tồn kho của thuốc

                            // Kiểm tra nếu giá trị nhập vào lớn hơn stock_quantity
                            if (enteredQuantity > availableStock) {
                              // Nếu nhập vào lớn hơn tồn kho, set giá trị bằng tồn kho và thông báo
                              Alert.alert(
                                "Thông báo",
                                `Số lượng nhập không thể lớn hơn tồn kho. Tồn kho hiện tại: ${availableStock}`
                              );
                              const updatedDetails = [...exportDetails.details];
                              updatedDetails[index].quantity = availableStock; // Gán số lượng = tồn kho
                              setExportDetails((prev) => ({
                                ...prev,
                                details: updatedDetails,
                              }));
                            } else {
                              // Nếu giá trị nhập hợp lệ, cập nhật bình thường
                              const updatedDetails = [...exportDetails.details];
                              updatedDetails[index].quantity = enteredQuantity;
                              setExportDetails((prev) => ({
                                ...prev,
                                details: updatedDetails,
                              }));
                            }
                          } else {
                            console.log("Thuốc không tồn tại trong danh sách.");
                          }
                        }}
                        keyboardType="numeric"
                      />
                    ) : (
                      <Text style={styles.value}>{detail.quantity}</Text>
                    )}
                  </View>

                  {/* Delete button to remove the product from the export receipt */}
                  {isEditing && (
                    <TouchableOpacity
                      style={styles.deleteProductButton}
                      onPress={() => {
                        const updatedDetails = exportDetails.details.filter(
                          (item, idx) => idx !== index
                        );
                        setExportDetails((prev) => ({
                          ...prev,
                          details: updatedDetails,
                        }));
                      }}
                    >
                      <Ionicons name="trash" size={24} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* Nút lưu thông tin */}
            {isEditing && (
              <MyButton
                title="Lưu Thay Đổi"
                onPress={async () => {
                  try {
                    const response = await updateERAndDetails(
                      Number(id),
                      exportDetails
                    );
                    console.log("thay đổi danh sách cuối cùng", exportDetails);
                    if (response.success) {
                      console.log("thay đổi", exportDetails);
                      Alert.alert("Thành công", "Phiếu xuất đã được cập nhật.");
                    } else {
                      Alert.alert(
                        `Lỗi: ${
                          response.errorMessage || "Không thể cập nhật phiếu."
                        }`
                      );
                    }
                    // console.log("thay đổi", exportDetails);
                    // console.log("thay đổi blalaa", exportDetails.id);
                    // Alert.alert("Thành công", "Phiếu xuất đã được cập nhật.");
                    setIsEditing(false); // Thoát chế độ chỉnh sửa
                    console.log("thay đổi blalaa");
                  } catch (err: any) {
                    // Alert.alert(
                    //   "Lỗi",
                    //   err.message || "Không thể lưu thay đổi."
                    // );
                    console.log("lỗi");
                  }
                }}
                buttonStyle={styles.updateButton}
              />
            )}
          </>
        )}
      </ScrollView>

      {/* Add Product Button */}
      <View style={styles.footer}>
        {/* Delete Button */}
        {!newStatus && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Xóa Phiếu Xuất</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal to Add Product */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm Sản Phẩm</Text>
            <Picker
              selectedValue={newMedicine}
              onValueChange={(itemValue) => setNewMedicine(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Chọn thuốc" value="" />
              {medicines.map((medicine) => (
                <Picker.Item
                  key={medicine.value}
                  label={medicine.label}
                  value={medicine.value}
                />
              ))}
            </Picker>
            <TextInput
              style={styles.input}
              value={String(newQuantity)}
              onChangeText={(text) => {
                // Chuyển đổi giá trị nhập vào thành số
                const enteredQuantity = Number(text);

                // Kiểm tra nếu giá trị nhập vào là một số hợp lệ
                if (isNaN(enteredQuantity)) {
                  return; // Nếu không phải số hợp lệ, không làm gì
                }

                // Lấy số lượng tồn kho của thuốc đã chọn
                const selectedMedicine = medicines.find(
                  (medicine) => medicine.value === newMedicine
                );

                if (selectedMedicine) {
                  const availableStock = selectedMedicine.stock_quantity;

                  // Kiểm tra nếu số lượng nhập vào lớn hơn số tồn kho
                  if (enteredQuantity > availableStock) {
                    // Gán số lượng nhập vào bằng số tồn kho
                    setNewQuantity(availableStock);

                    // Hiển thị thông báo về số lượng tồn kho
                    Alert.alert(
                      "Thông báo",
                      `Số lượng nhập không thể lớn hơn tồn kho. Tồn kho hiện tại: ${availableStock}. Số lượng đã được điều chỉnh về ${availableStock}.`
                    );
                  } else {
                    // Nếu số lượng hợp lệ, cập nhật giá trị
                    setNewQuantity(enteredQuantity);
                  }
                }
              }}
              keyboardType="numeric"
              placeholder="Nhập số lượng"
            />

            <MyButton
              title="Thêm"
              onPress={handleAddProduct}
              buttonStyle={styles.addButton}
            />
            <TouchableOpacity
              onPress={() => {
                setNewMedicine("");
                setNewQuantity(0);
                setModalVisible(false); // Đóng modal sau khi thông báo
              }}
            >
              <Text style={styles.closeModal}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   padding: 20,
  //   backgroundColor: "#f9f9f9",
  // },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1a73e8",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  // input: {
  //   padding: 8,
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   borderRadius: 5,
  //   marginTop: 5,
  //   fontSize: 16,
  // },
  detailContainer: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
  },
  toggleButton: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#1a73e8",
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  productDetailsContainer: {
    marginTop: 10,
  },
  productDetail: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
  },
  productDetailText: {
    fontSize: 14,
  },
  // updateButton: {
  //   backgroundColor: "#4caf50",
  //   marginTop: 20,
  // },
  // deleteButton: {
  //   backgroundColor: "#d32f2f",
  //   marginTop: 20,
  //   paddingVertical: 15,
  //   paddingHorizontal: 25,
  //   borderRadius: 10,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // deleteButtonText: {
  //   color: "#fff",
  //   fontWeight: "600",
  //   fontSize: 16,
  // },
  editButton: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  // addProductButton: {
  //   position: "absolute",
  //   right: -10,
  //   bottom: -150,
  // },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4caf50",
    marginTop: 10,
  },
  closeModal: {
    marginTop: 20,
    textAlign: "center",
    color: "#1a73e8",
    fontWeight: "600",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#d32f2f",
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  addProductButton: {
    alignSelf: "center",
    // marginBottom: 10,
    marginLeft: 160,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  deleteProductButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#f8d7da", // light red background
    padding: 5,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  // editApproveButton: {
  //   position: "absolute",
  //   top: 20,
  //   right: 20,
  //   padding: 10,
  //   backgroundColor: "#f0f0f0",
  //   borderRadius: 5,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 2,
  // },
  editApproveButton: {
    position: "absolute",
    top: -10,
    right: -10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  input: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 5,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});

export default ExportReceiptDetails;
