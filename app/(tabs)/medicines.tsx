import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import Header from "@/components/Home/Header";
import SearchText from "@/components/SearchText";
import MedicineList from "../warehouses/medicines/list";
import * as Animatable from "react-native-animatable";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { getMedicineList } from "@/services/api";
import { Medicine } from "@/types";
import { useAuth } from "@/context/AuthContext";

const Medicines = () => {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("sale_price");
  const [sortOrder, setSortOrder] = useState("asc");
  const { user } = useAuth();
  const shouldShowButton = user?.role === "staff";

  const fetchData = async () => {
    try {
      const response = await getMedicineList();
      setMedicines(response.data);
    } catch (error: any) {
      console.log("Error fetching medicine list:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.medicine_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortMedicines = (list: Medicine[]) => {
    let sortedList = [...list];

    if (sortBy === "sale_price" || sortBy === "stock_quantity") {
      // Sắp xếp theo giá hoặc số lượng tồn
      sortedList = sortedList.sort((a, b) => {
        const fieldA =
          sortBy === "sale_price" ? a.sale_price : a.stock_quantity;
        const fieldB =
          sortBy === "sale_price" ? b.sale_price : b.stock_quantity;

        return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
      });
    }

    // Sắp xếp theo tên thuốc
    if (sortBy === "name") {
      sortedList = sortedList.sort((a, b) => {
        const nameA = a.medicine_name.toLowerCase();
        const nameB = b.medicine_name.toLowerCase();

        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    }

    return sortedList;
  };

  const displayedMedicines = sortMedicines(filteredMedicines);

  // Chuyển hướng đến trang thêm thuốc
  const handleAdd = () => {
    router.push("/warehouses/medicines/add");
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* Search Text với Animatable */}
      <Animatable.View
        animation="fadeInDown"
        duration={1000}
        style={styles.searchContainer}
      >
        <SearchText
          placeholder="Nhập tên thuốc"
          setSearchText={setSearchText}
        />
      </Animatable.View>

      {/* Bộ lọc sắp xếp */}
      <View style={styles.filterContainer}>
        {/* <Text style={styles.filterLabel}>Sắp xếp theo:</Text> */}
        <Picker
          selectedValue={sortBy}
          style={styles.picker}
          onValueChange={(value) => setSortBy(value)}
        >
          <Picker.Item label="Giá" value="sale_price" />
          <Picker.Item label="Số lượng tồn" value="stock_quantity" />
          <Picker.Item label="Tên thuốc" value="name" />
        </Picker>

        <Picker
          selectedValue={sortOrder}
          style={styles.picker}
          onValueChange={(value) => setSortOrder(value)}
        >
          <Picker.Item label="Tăng dần" value="asc" />
          <Picker.Item label="Giảm dần" value="desc" />
        </Picker>
      </View>

      {/* Tiêu đề Danh Mục Thuốc */}
      <Animatable.Text
        animation="bounceIn"
        duration={1500}
        style={styles.title}
      >
        DANH MỤC THUỐC
      </Animatable.Text>

      {/* Hiển thị danh sách thuốc đã lọc và sắp xếp */}
      <Animatable.View
        animation="fadeInUpBig"
        duration={1000}
        style={styles.medicineListContainer}
      >
        {displayedMedicines.length > 0 ? (
          <MedicineList
            medicines={displayedMedicines}
            isEdit={shouldShowButton}
          />
        ) : (
          <Text style={styles.noResultText}>Không tìm thấy thuốc phù hợp</Text>
        )}
      </Animatable.View>

      {/* Nút Thêm Thuốc */}
      {shouldShowButton && (
        <MyButton
          title={"Thêm thuốc"}
          onPress={handleAdd}
          buttonStyle={{ margrinBottom: -10 }}
        />
      )}
    </View>
  );
};

export default Medicines;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    justifyContent: "space-around",
  },
  searchContainer: {
    marginVertical: 15,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  picker: {
    width: "45%", // Thay đổi từ 150 thành phần trăm để phù hợp mọi màn hình
    height: 65, // Tăng chiều cao để dễ nhấn hơn
    backgroundColor: "#FFF", // Thêm màu nền để dễ phân biệt
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    letterSpacing: 1.5,
    marginVertical: 5,
  },
  medicineListContainer: {
    flex: 1,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    position: "absolute",
    bottom: 30,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  noResultText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});
