// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { createIR } from "@/services/api/IRService"; // API call
// import { useToken } from "@/hooks/useToken"; // Token hook

// const AddIRScreen = () => {
//   const [irName, setIrName] = useState("");
//   const [date, setDate] = useState("");
//   const token = useToken();
//   const router = useRouter();

//   const handleAddIR = async () => {
//     if (!irName || !date) {
//       Alert.alert("Error", "Please fill all fields.");
//       return;
//     }

//     try {
//       await createIR(token, { ir_name: irName, date });
//       Alert.alert("Success", "IR added successfully.");
//       router.push("/warehouses/importReceipts/list"); // Navigate back to the list
//     } catch (error: any) {
//       console.error("Error adding IR:", error);
//       Alert.alert("Error", "Unable to add IR.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Add New IR</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="IR Name"
//         value={irName}
//         onChangeText={setIrName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Date (YYYY-MM-DD)"
//         value={date}
//         onChangeText={setDate}
//       />
//       <TouchableOpacity style={styles.button} onPress={handleAddIR}>
//         <Text style={styles.buttonText}>Add IR</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: "#1E88E5",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default AddIRScreen;
