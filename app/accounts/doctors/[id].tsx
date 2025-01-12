import { StyleSheet, Text, View, Image, ScrollView, Alert, TextInput } from 'react-native';
import React, { useState } from 'react';
import MyButton from '@/components/MyButton'; // Import component MyButton
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState({
    id: 3,
    full_name: 'Lê Minh C',
    date_of_birth: '1988-05-15',
    gender: 'Nam',
    id_card: '345678901234',
    phone_number: '567-890-1234',
    address: '789 Pham Ngoc Thach St, Hanoi, Vietnam',
    email: 'leminhc@example.com',
    image: null,
    role: 'Staff',
    isActive: true,
  });

  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState({ ...employee });

  const handleEditPress = () => {
    if (isEditing) {
      // Save the edited information
      setEmployee({ ...editedEmployee });
    }
    setIsEditing(!isEditing);
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${employee.full_name}?`,
      [
        {
          text: 'Cancel',
          onPress: () => {
            Alert.alert('Delete canceled', 'You have canceled the delete action.');
          },
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            console.log(`Employee ${employee.full_name} has been deleted.`);
            router.push(`/accounts/list?role=${employee.role}`);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleInputChange = (field, value) => {
    setEditedEmployee(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={employee.image ? { uri: employee.image } : require('@/assets/images/avatar/default.png')}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Icon chỉnh sửa ảnh nằm lòng vào avatar */}
        <TouchableOpacity style={styles.editIcon} onPress={() => console.log('Edit Avatar')}>
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        {renderDetailItem('🧑 Full Name', isEditing ? (
          <TextInput
            style={styles.input}
            value={editedEmployee.full_name}
            onChangeText={(value) => handleInputChange('full_name', value)}
          />
        ) : (
          <Text>{employee.full_name}</Text>
        ))}
        {renderDetailItem('📅 Date of Birth', isEditing ? (
          <TextInput
            style={styles.input}
            value={editedEmployee.date_of_birth}
            onChangeText={(value) => handleInputChange('date_of_birth', value)}
          />
        ) : (
          <Text>{employee.date_of_birth}</Text>
        ))}
        {renderDetailItem('🧑 Gender', isEditing ? (
          <TextInput
            style={styles.input}
            value={editedEmployee.gender}
            onChangeText={(value) => handleInputChange('gender', value)}
          />
        ) : (
          <Text>{employee.gender}</Text>
        ))}
        {renderDetailItem('🆔 ID Card', isEditing ? (
          <TextInput
            style={styles.input}
            value={editedEmployee.id_card}
            onChangeText={(value) => handleInputChange('id_card', value)}
          />
        ) : (
          <Text>{employee.gender}</Text>
        ))}
        {renderDetailItem('📞 Phone', isEditing ? (
          <TextInput
            style={styles.input}
            value={editedEmployee.phone_number}
            onChangeText={(value) => handleInputChange('phone_number', value)}
          />
        ) : (
          <Text>{employee.phone_number}</Text>
        ))}
        {renderDetailItem('🏠 Address', isEditing ? (
          <TextInput
            style={styles.input}
            value={editedEmployee.address}
            onChangeText={(value) => handleInputChange('address', value)}
          />
        ) : (
          <Text>{employee.address}</Text>
        ))}
        {renderDetailItem('📧 Email', isEditing ? (
          <TextInput
            style={styles.input}
            value={editedEmployee.email}
            onChangeText={(value) => handleInputChange('email', value)}
          />
        ) : (
          <Text>{employee.email}</Text>
        ))}
        {renderDetailItem('💼 Role', employee.role)} {/* Role không thể chỉnh sửa */}
      </View>

      <View style={styles.buttonContainer}>
        {/* Nút Edit */}
        <MyButton
          title={isEditing ? 'Save' : 'Edit'}
          onPress={handleEditPress}
          buttonStyle={{ backgroundColor: '#4CAF50', width: '400' }}
        />

        {/* Nút Delete */}
        <MyButton
          title="Delete"
          onPress={handleDeletePress}
          buttonStyle={{ backgroundColor: '#F44336', width: '400' }}
        />
      </View>
    </ScrollView>
  );
};

const renderDetailItem = (title, value) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailTitle}>{title}</Text>
    <Text style={styles.detailText}>{value}</Text>
  </View>
);

export default EmployeeDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  editIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#007bff',
    borderRadius: 15,
    padding: 5,
  },
  infoContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 20,
    marginHorizontal: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    flex: 2,
  },
  inputWrapper: {
    flex: 2,
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',  // Thêm màu cho đường gạch dưới
  },
  input: {
    fontSize: 16,
    color: '#555',
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 5,
  },
  editing: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff', // Dễ dàng thay đổi màu khi đang chỉnh sửa
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
});

