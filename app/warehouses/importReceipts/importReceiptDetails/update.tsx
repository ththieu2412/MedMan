import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { updateImportReceiptDetailapi } from '@/services/apiServices';  // Import the specific fetch function
import { ImportReceiptDetail } from '@/constants/types';  // Import the types

const UpdateImportReceiptDetails = ({ receiptId }: { receiptId: number }) => {
  const [details, setDetails] = useState<ImportReceiptDetail[]>([
    { import_receipt: receiptId, medicine: 1, quantity: 10, price: 100 },
    { import_receipt: receiptId, medicine: 2, quantity: 5, price: 150 }
  ]);

  const updateReceiptDetails = async () => {
    const body = { details };  // Pass the details array in the body

    try {
      const responseData = await updateImportReceiptDetailapi(receiptId, body);
      if (responseData.statuscode === 200) {
        Alert.alert("Success", "Updated receipt details successfully!");
      } else {
        Alert.alert("Error", responseData.errorMessage || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter medicine ID"
        keyboardType="numeric"
        value={details[0].medicine.toString()}
        onChangeText={(text) => {
          const updatedDetails = [...details];
          updatedDetails[0].medicine = parseInt(text, 10);
          setDetails(updatedDetails);
        }}
      />
      <TextInput
        placeholder="Enter quantity"
        keyboardType="numeric"
        value={details[0].quantity.toString()}
        onChangeText={(text) => {
          const updatedDetails = [...details];
          updatedDetails[0].quantity = parseInt(text, 10);
          setDetails(updatedDetails);
        }}
      />
      <TextInput
        placeholder="Enter price"
        keyboardType="numeric"
        value={details[0].price.toString()}
        onChangeText={(text) => {
          const updatedDetails = [...details];
          updatedDetails[0].price = parseFloat(text);
          setDetails(updatedDetails);
        }}
      />

      <Button title="Update Receipt Details" onPress={updateReceiptDetails} />
    </View>
  );
};

export default UpdateImportReceiptDetails;
