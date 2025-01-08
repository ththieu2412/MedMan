import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const Categories = () => {
    const router = useRouter();

    const categoriesList = [
        { name: 'Staff', id: 1, image: require('@/assets/images/categories/doctor.png') },
        { name: 'Doctor', id: 2, image: require('@/assets/images/categories/doctor.png') },
        { name: 'Pharmacist', id: 3, image: require('@/assets/images/categories/doctor.png') },
        { name: 'Patient', id: 4, image: require('@/assets/images/categories/patient.png') },
        { name: 'Medicine', id: 5, image: require('@/assets/images/categories/medicine.png') },
        { name: 'Prescription', id: 6, image: require('@/assets/images/categories/Prescription.png') },
        { name: 'Warehouse', id: 7, image: require('@/assets/images/categories/report.png') },
        { name: 'Import', id: 8, image: require('@/assets/images/categories/import.png') },
        { name: 'Export', id: 9, image: require('@/assets/images/categories/export.png') },
        { name: 'Report', id: 10, image: require('@/assets/images/categories/report.png') },
    ];

    const handleCategoryPress = (categoryName: string) => {
        console.log(`Selected category: ${categoryName}`);
        switch (categoryName) {
            case 'Doctor':
                router.push('/accounts/list?role=Doctor');
                break;
            case 'Pharmacist':
                router.push('/accounts/list?role=Pharmacist');
                break;
            case 'Staff':
                router.push('/accounts/list?role=Staff');
                break;
            case 'Patient':
                router.push('')
            default:
                break;
        }
    };
    

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Management Options</Text>
                <Text style={styles.seeAll}>See all</Text>
            </View>

            {/* FlatList Horizontal */}
            <FlatList
                data={categoriesList}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.categoryItem}
                        onPress={() => handleCategoryPress(item.name)}
                    >
                        <View style={styles.iconContainer}>
                            <Image source={item.image} style={styles.icon} />
                        </View>
                        <Text style={styles.categoryText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

export default Categories;

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontFamily: 'appfont-semi',
    },
    seeAll: {
        fontFamily: 'appfont',
        color: 'blue',
        fontSize: 16,
    },
    list: {
        marginTop: 10,
    },
    listContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: 20,
    },
    iconContainer: {
        backgroundColor: '#dbeafe',
        padding: 20,
        borderRadius: 99,
    },
    icon: {
        width: 35,
        height: 35,
    },
    categoryText: {
        fontSize: 15,
        fontFamily: 'appfont-semi',
        marginTop: 8,
    },
});