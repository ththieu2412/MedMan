import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity, FlatList } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useToken } from "@/hooks/useToken";
import { updatebyIRId, deleteIRD, createIRD, detailbyIRId } from "@/services/api/IRdetailService";
import { getMedicineList } from "@/services/api/medicineService";

const IRDetailEdit = () => {
  const { id } = useLocalSearchParams();
  const token = useToken();
  const router = useRouter();

  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [medicineOptions, setMedicineOptions] = useState<any[]>([]); // Danh sách thuốc
  const [newProduct, setNewProduct] = useState({ import_receipt: 0, medicine: "", quantity: 0, price: 0 });

  const fetchProductDetails = async () => {
    if (!id) return;
    try {
      const response = await detailbyIRId(token, id);
      const dataWithIds = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      setProductDetails(dataWithIds);
    } catch (error) {
      Alert.alert("Không thể tải chi tiết sản phẩm. Vui lòng thử lại.");
    }
  };

const fetchMedicineOptions = async () => {
  try {
    const response = await getMedicineList(token);
    console.log("Danh sách thuốc từ API:", response.data); // In dữ liệu trả về để kiểm tra

    // Kiểm tra xem dữ liệu trả về có đúng không
    
    if (response.data && Array.isArray(response.data)) {
      console.log("Dữ liệu thuốc:", response.data); // In dữ liệu để kiểm tra
      const options = response.data.map((medicine) => ({
        label: medicine.medicine_name, // Đảm bảo lấy đúng tên thuốc
        value: medicine.id, // Lấy ID làm giá trị cho mỗi item
      }));
      console.log("Dữ liệu options:", options); // In options để kiểm tra
      setMedicineOptions(options); // Cập nhật state
    } else {
      console.log("Không có dữ liệu thuốc hoặc dữ liệu không đúng định dạng.");
    }
  } catch (error) {
    console.error("Lỗi khi tải danh sách thuốc:", error);
    Alert.alert("Không thể tải danh sách thuốc. Vui lòng thử lại.");
  }
};



  const handleAddProduct = async () => {
    if (!newProduct.medicine || !newProduct.quantity || !newProduct.price) {
      Alert.alert("Vui lòng nhập đầy đủ thông tin sản phẩm.");
      return;
    }

    try {
      const response = await createIRD(token, id, newProduct);
      setProductDetails([...productDetails, { ...response.data, id: productDetails.length + 1 }]);
      setNewProduct({ import_receipt: 0, medicine: "", quantity: 0, price: 0 });
    } catch (error) {
      Alert.alert("Thêm sản phẩm thất bại. Vui lòng thử lại.");
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await Promise.all(
        productDetails.map((product) =>
          updatebyIRId(token, id, product.id, {
            medicine: product.medicine,
            quantity: product.quantity,
            price: product.price,
          })
        )
      );
      Alert.alert("Cập nhật tất cả sản phẩm thành công!");
    } catch (error) {
      Alert.alert("Cập nhật sản phẩm thất bại. Vui lòng thử lại.");
    }
  };

  const handleRemoveProduct = (productId: number) => {
    const updatedList = productDetails.filter((product) => product.id !== productId);
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
        value={item.medicine}
        onChangeText={(text) =>
          setProductDetails((prevDetails) =>
            prevDetails.map((product) =>
              product.id === item.id ? { ...product, medicine: text } : product
            )
          )
        }
        placeholder="Tên sản phẩm"
      />
      <TextInput
        style={styles.input}
        value={item.quantity.toString()}
        onChangeText={(text) =>
          setProductDetails((prevDetails) =>
            prevDetails.map((product) =>
              product.id === item.id ? { ...product, quantity: Number(text) } : product
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
              product.id === item.id ? { ...product, price: Number(text) } : product
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
      <FlatList data={productDetails} renderItem={renderProductItem} keyExtractor={(item) => item.id.toString()} />
      
      <Text style={styles.label}>Thêm Sản Phẩm Mới:</Text>
     <RNPickerSelect
  onValueChange={(value) => {
    // Kiểm tra và chọn đúng medicine từ value
    const selectedMedicine = medicineOptions.find(option => option.value === value);
    if (selectedMedicine) {
      setNewProduct({
        ...newProduct,
        medicine: {
          id: selectedMedicine.value,
          name: selectedMedicine.label,
        },
      });
    }
  }}
  items={medicineOptions}  // Dữ liệu từ API
  style={pickerSelectStyles}
  placeholder={{ label: "Chọn thuốc", value: null }}
/>


      <TextInput
        style={styles.input}
        value={newProduct.quantity.toString()}
        onChangeText={(text) => setNewProduct({ ...newProduct, quantity: Number(text) })}
        placeholder="Số lượng"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={newProduct.price.toString()}
        onChangeText={(text) => setNewProduct({ ...newProduct, price: Number(text) })}
        placeholder="Giá"
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
