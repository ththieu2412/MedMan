// // Thay đổi trong phần JSX
// {
//   exportDetails && (
//     <>
//       {/* Hiển thị thông tin mã phiếu */}
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>Mã Phiếu Xuất:</Text>
//         <Text style={styles.value}>{exportDetails.id}</Text>
//       </View>
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>Đơn Thuốc:</Text>
//         <Text style={styles.value}>{exportDetails.prescription}</Text>
//       </View>
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>Kho:</Text>
//         <Text style={styles.value}>{warehouseName}</Text>
//       </View>
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>Tổng Tiền:</Text>
//         <Text style={styles.value}>{exportDetails.total_amount}</Text>
//       </View>
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>Ngày Xuất:</Text>
//         <Text style={styles.value}>
//           {new Date(exportDetails.export_date).toLocaleString()}
//         </Text>
//       </View>
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>Nhân Viên:</Text>
//         <Text style={styles.value}>{employeeName || "Không xác định"}</Text>
//       </View>

//       {/* Hiển thị trạng thái phiếu */}
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>Trạng thái:</Text>
//         {isEditing ? (
//           <Switch
//             value={exportDetails.is_approved}
//             onValueChange={(value) =>
//               setExportDetails((prev) => ({ ...prev, is_approved: value }))
//             }
//             trackColor={{ false: "#767577", true: "#81b0ff" }}
//             thumbColor={exportDetails.is_approved ? "#f5dd4b" : "#f4f3f4"}
//           />
//         ) : (
//           <Text style={styles.value}>
//             {exportDetails.is_approved ? "Duyệt" : "Chưa duyệt"}
//           </Text>
//         )}
//       </View>

//       {/* Hiển thị danh sách sản phẩm */}
//       <View>
//         {exportDetails.details.map((detail: any, index: number) => (
//           <View key={index} style={styles.productDetail}>
//             <Text style={styles.productDetailText}>
//               Thuốc: {detail.medicine_name}
//             </Text>
//             <View style={styles.detailContainer}>
//               <Text style={styles.label}>Số lượng:</Text>
//               {isEditing ? (
//                 <TextInput
//                   style={styles.input}
//                   value={String(detail.quantity)}
//                   onChangeText={(text) => {
//                     const updatedDetails = [...exportDetails.details];
//                     updatedDetails[index].quantity = Number(text);
//                     setExportDetails((prev) => ({
//                       ...prev,
//                       details: updatedDetails,
//                     }));
//                   }}
//                   keyboardType="numeric"
//                 />
//               ) : (
//                 <Text style={styles.value}>{detail.quantity}</Text>
//               )}
//             </View>
//           </View>
//         ))}
//       </View>

//       {/* Nút lưu thông tin */}
//       {isEditing && (
//         <MyButton
//           title="Lưu Thay Đổi"
//           onPress={async () => {
//             try {
//               await updateERAndDetails(id, exportDetails);
//               Alert.alert("Thành công", "Phiếu xuất đã được cập nhật.");
//               setIsEditing(false); // Thoát chế độ chỉnh sửa
//             } catch (err: any) {
//               Alert.alert("Lỗi", err.message || "Không thể lưu thay đổi.");
//             }
//           }}
//           buttonStyle={styles.updateButton}
//         />
//       )}
//     </>
//   );
// }
