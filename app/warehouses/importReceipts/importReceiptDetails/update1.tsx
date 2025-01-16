import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useToken } from "@/hooks/useToken";
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

  const fetchProductDetails = async () => {
    if (!id) return;
    try {
      const response = await detailbyIRId(token, id);
      const dataWithIds = response.data.map((item, index) => ({
        ...item,
        id: index + 1, // Tạo ID tạm thời cho sản phẩm
      }));
      setProductDetails(dataWithIds); // Cập nhật
      // productDetails
      console.log("nhiều thucoocs", response.data);
    } catch (error) {
      Alert.alert(
        "Thông báo lỗi",
        "Không thể tải chi tiết sản phẩm. Vui lòng thử lại."
      );
    }
  };

  const fetchMedicineOptions = async () => {
    try {
      const response = await getMedicineList(token);
      console.log("Danh sách thuốc từ API:", response.data); // In dữ liệu trả về để kiểm tra
      console.log("Kiểu dữ liệu:", Array.isArray(response.data));

      // Kiểm tra xem dữ liệu trả về có đúng không

      if (response.data && Array.isArray(response.data)) {
        console.log("Dữ liệu thuốc:", response.data); // In dữ liệu để kiểm tra
        const options = response.data.map((medicine) => ({
          label: medicine.medicine_name, // Đảm bảo lấy đúng tên thuốc
          value: medicine.id, // Lấy ID làm giá trị cho mỗi item
          price: medicine.sale_price,
        }));
        console.log("Dữ liệu options:", options); // In options để kiểm tra
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

  const handleAddProduct = () => {
    console.log("newProduct", newProduct);

    // Check if the new product details are valid
    if (
      !newProduct.medicine_name ||
      !newProduct.quantity ||
      !newProduct.price
    ) {
      console.log("Vui lòng nhập đầy đủ thông tin sản phẩm.");
      Alert.alert("Thông báo lỗi", "Vui lòng nhập đầy đủ thông tin sản phẩm.");
      return;
    }

    // Check if the medicine is already in the productDetails list
    const isMedicineExist = productDetails.filter(
      (product) => product.medicine_name === newProduct.medicine_name
    );
    console.log("isMedicineExist", isMedicineExist);

    if (isMedicineExist) {
      console.log("Sản phẩm này đã có trong danh sách.");
      Alert.alert("Thông báo lỗi", "Sản phẩm này đã có trong danh sách.");
      return;
    }

    console.log("new product");

    // Add the new product to the productDetails list
    const newProductWithId = {
      ...newProduct,
    };

    console.log("newProductWithId", newProductWithId);

    setProductDetails((prevDetails) => [...prevDetails, newProductWithId]); // Update the list of products

    // Reset the new product fields
    setNewProduct({
      import_receipt: 0,
      medicine_name: "",
      medicine_id: 0,
      quantity: 0,
      price: 0,
    });

    console.log("newProduct detail", productDetails);

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
    setProductDetails(updatedList); // Xóa sản phẩm khỏi danh sách
  };

  useEffect(() => {
    fetchProductDetails();
    fetchMedicineOptions(); // Đảm bảo hàm này được gọi khi component render
  }, [id]);

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
        value={item.medicine_name || item.medicine || "Không có tên"} // Hiển thị tên thuốc
        editable={false} // Không cho phép chỉnh sửa tên thuốc
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
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh Sửa Chi Tiết Sản Phẩm</Text>
      <FlatList
        data={productDetails} // Dữ liệu từ state
        renderItem={renderProductItem} // Hàm render cho từng mục
        keyExtractor={(item) => item.id} // Khóa duy nhất cho mỗi mục
        ListEmptyComponent={<Text>Không có sản phẩm nào để hiển thị.</Text>} // Hiển thị khi danh sách rỗng
      />

      <Text style={styles.label}>Thêm Sản Phẩm Mới:</Text>
      <RNPickerSelect
        onValueChange={(value) => {
          console.log("medicineOptions", medicineOptions);
          const selectedMedicine = medicineOptions.find(
            (option) => option.value === parseInt(value, 10)
          );

          console.log("selected", selectedMedicine);
          if (selectedMedicine) {
            setNewProduct({
              ...newProduct,
              medicine_id: selectedMedicine.value, // Lưu ID thuốc
              medicine_name: selectedMedicine.label, // Lưu tên thuốc
              price: selectedMedicine.price, // Gán giá thuốc vào price
            });
          }
        }}
        items={medicineOptions} // Dữ liệu từ API
        style={pickerSelectStyles}
        placeholder={{ label: "Chọn thuốc", value: null }}
      />

      <TextInput
        style={styles.input}
        value={newProduct.price.toString()} // Hiển thị giá trị của price
        editable={false} // Không cho phép người dùng chỉnh sửa giá trực tiếp
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

      <TouchableOpacity onPress={handleAddProduct} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Thêm Sản Phẩm</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleUpdateProduct} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Lưu Tất Cả</Text>
      </TouchableOpacity>
    </View>
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
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
