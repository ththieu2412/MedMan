import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useToken } from "@/hooks/useToken";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import {
  updatebyIRId,
  deleteIRD,
  createIRD,
  detailbyIRId,
} from "@/services/api/IRdetailService";
import { getMedicineList } from "@/services/api/medicineService";

const IRDetailEdit = () => {
  const { id } = useLocalSearchParams();
  const token = useToken();
  const router = useRouter();

  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [medicineOptions, setMedicineOptions] = useState<any[]>([]); // Danh sách thuốc
  const [newProduct, setNewProduct] = useState({
    import_receipt: id ? parseInt(id, 10) : 0,
    medicine_id: 0, // ID thuốc
    medicine_name: "",
    quantity: 0,
    price: 0,
  });

  const [isCollapsed, setIsCollapsed] = useState(false); // Trạng thái thu gọn/mở rộng

  // Hàm fetch lại chi tiết sản phẩm
  const fetchProductDetails = async () => {
    if (!id) return;
    try {
      const response = await detailbyIRId(token, id);
      const dataWithIds = response.data.map((item, index) => ({
        ...item,
        id: index + 1, // Tạo ID tạm thời cho sản phẩm
      }));
      setProductDetails(dataWithIds); // Cập nhật
    } catch (error) {
      Alert.alert(
        "Thông báo lỗi",
        "Không thể tải chi tiết sản phẩm. Vui lòng thử lại."
      );
    }
  };

  // Hàm fetch danh sách thuốc
  const fetchMedicineOptions = async () => {
    try {
      const response = await getMedicineList(token);
      if (response.data && Array.isArray(response.data)) {
        const options = response.data.map((medicine) => ({
          label: medicine.medicine_name, // Đảm bảo lấy đúng tên thuốc
          value: medicine.id, // Lấy ID làm giá trị cho mỗi item
          price: medicine.sale_price,
        }));
        setMedicineOptions(options); // Cập nhật state
      } else {
        console.log(
          "Không có dữ liệu thuốc hoặc dữ liệu không đúng định dạng."
        );
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách thuốc:", error);
      Alert.alert(
        "Thông báo lỗi",
        "Không thể tải danh sách thuốc. Vui lòng thử lại."
      );
    }
  };

  // Gọi lại dữ liệu khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      fetchProductDetails();
      fetchMedicineOptions(); // Gọi khi component render hoặc màn hình focus
    }, [id]) // useEffect sẽ trigger khi id thay đổi
  );

  const handleAddProduct = () => {
    // Check if the new product details are valid
    if (
      !newProduct.medicine_name ||
      !newProduct.quantity ||
      !newProduct.price
    ) {
      Alert.alert("Thông báo lỗi", "Vui lòng nhập đầy đủ thông tin sản phẩm.");
      return;
    }

    // Check if the medicine is already in the productDetails list
    const isMedicineExist = productDetails.filter(
      (product) => product.medicine_name === newProduct.medicine_name
    );
    if (isMedicineExist.length > 0) {
      Alert.alert("Thông báo lỗi", "Sản phẩm này đã có trong danh sách.");
      return;
    }

    // Add the new product to the productDetails list
    const newProductWithId = {
      ...newProduct,
    };

    setProductDetails((prevDetails) => [...prevDetails, newProductWithId]); // Update the list of products

    // Reset the new product fields
    setNewProduct({
      import_receipt: 0,
      medicine_name: "",
      medicine_id: 0,
      quantity: 0,
      price: 0,
    });

    Alert.alert("Thông báo thành công", "Sản phẩm đã được thêm vào danh sách.");
  };

  const handleUpdateProduct = async () => {
    try {
      // Chuẩn hóa productDetails để chuyển đổi medicine_name thành medicine_id
      const updatedProducts = productDetails.map((product) => {
        // Tìm medicine_id dựa trên medicine_name
        const matchingMedicine = medicineOptions.find(
          (medicine) => medicine.label === product.medicine
        );

        // Gán medicine_id hoặc giữ nguyên nếu không tìm thấy
        return {
          medicine: matchingMedicine
            ? matchingMedicine.value
            : product.medicine_id, // Gán ID thuốc hoặc giữ nguyên
          quantity: product.quantity,
          price: product.price,
        };
      });
      console.log("updatedProducts", updatedProducts);

      // Gọi API một lần để cập nhật tất cả sản phẩm
      const response = await updatebyIRId(token, id, updatedProducts);
      console.log("Chi tiết phản hồi:", response);

      if (response.status === "success") {
        Alert.alert("Cập nhật tất cả sản phẩm thành công!");
      } else {
        Alert.alert("Đã xảy ra lỗi khi cập nhật sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      Alert.alert("Cập nhật sản phẩm thất bại. Vui lòng thử lại.");
    }
  };

  const handleRemoveProduct = (productId: number) => {
    const updatedList = productDetails.filter(
      (product) => product.id !== productId
    );
    setProductDetails(updatedList);
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <TouchableOpacity
        onPress={() => handleRemoveProduct(item.id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>X</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={item.medicine_name || item.medicine || "Không có tên"}
        editable={false}
        placeholder="Tên sản phẩm"
      />

      <TextInput
        style={styles.input}
        value={item.quantity.toString()}
        onChangeText={(text) =>
          setProductDetails((prevDetails) =>
            prevDetails.map((product) =>
              product.id === item.id
                ? { ...product, quantity: Number(text) }
                : product
            )
          )
        }
        placeholder="Số lượng"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={item.price.toString()}
        onChangeText={(text) =>
          setProductDetails((prevDetails) =>
            prevDetails.map((product) =>
              product.id === item.id
                ? { ...product, price: Number(text) }
                : product
            )
          )
        }
        placeholder="Giá"
        keyboardType="numeric"
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Chỉnh Sửa Chi Tiết Sản Phẩm</Text>
          <FlatList
            data={productDetails}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text>Không có sản phẩm nào để hiển thị.</Text>}
          />

          <Text style={styles.label}>Thêm Sản Phẩm Mới:</Text>
          <TouchableOpacity
            onPress={() => setIsCollapsed(!isCollapsed)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleButtonText}>
              {isCollapsed ? "Mở rộng" : "Thu gọn"}
            </Text>
          </TouchableOpacity>

          {!isCollapsed && (
            <View>
              <RNPickerSelect
                onValueChange={(value) => {
                  const selectedMedicine = medicineOptions.find(
                    (option) => option.value === parseInt(value, 10)
                  );
                  if (selectedMedicine) {
                    setNewProduct({
                      ...newProduct,
                      medicine_id: selectedMedicine.value,
                      medicine_name: selectedMedicine.label,
                      price: selectedMedicine.price,
                    });
                  }
                }}
                items={medicineOptions}
                style={pickerSelectStyles}
                value={
                  newProduct.medicine_id
                    ? newProduct.medicine_id.toString()
                    : null
                }
                placeholder={{ label: "Chọn thuốc", value: null }}
              />

              <TextInput
                style={styles.input}
                value={newProduct.price.toString()}
                editable={false}
                placeholder="Giá"
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                value={newProduct.quantity.toString()}
                onChangeText={(text) =>
                  setNewProduct({ ...newProduct, quantity: Number(text) })
                }
                placeholder="Số lượng"
                keyboardType="numeric"
              />

              <TouchableOpacity
                onPress={handleAddProduct}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Thêm Sản Phẩm</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            onPress={handleUpdateProduct}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Lưu Tất Cả</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    padding: 10,
  },
  saveButton: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  addProductContainer: {
    marginBottom: 20,
  },
  productItem: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButton: {
    backgroundColor: "#1E88E5",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    color: "black",
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    marginBottom: 10,
  },
});

export default IRDetailEdit;
