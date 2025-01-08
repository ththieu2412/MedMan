import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Employee } from '@/types';
import { Link } from 'expo-router';

interface ListItemProps {
  item: Employee;
  fadeAnim: Animated.Value;
}

const ListItem = ({ item, fadeAnim }: ListItemProps) => {
  return (
    <Animated.View style={[styles.itemContainer, { opacity: fadeAnim }]}>
      <Link href={`/accounts/${item.role}s/${item.id}`} params={{ item }}>
        <Image
          source={item.image ? { uri: item.image } : require('@/assets/images/avatar/default.png')}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.full_name}</Text>
          <Text style={styles.info}>{item.gender}</Text>
          <Text style={styles.info}>{item.phone_number}</Text>
          <Text style={styles.info}>{item.email}</Text>
        </View>
      </Link>
    </Animated.View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
  },
  textContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
});
