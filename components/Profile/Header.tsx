import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ProfileInfo from '@/components/setting/ProfileInfo';
import LanguageSelector from '@/components/setting/LanguageSelector';
import LogoutButton from '@/components/setting/LogoutButton';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Home/Header';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { iconSize } from '@/constants/dimensions';

export default function SettingScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Ionicons name={"arrow-back"} size={iconSize.md} color="black"/>
      </TouchableOpacity>
      <TouchableOpacity>
        <Octicons name={"gear"} size={iconSize.md} color="black"/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
