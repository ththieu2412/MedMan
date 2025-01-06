import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import ProfileInfo from '@/components/setting/ProfileInfo';
import LanguageSelector from '@/components/setting/LanguageSelector';
import LogoutButton from '@/components/setting/LogoutButton';

export default function SettingScreen() {
  return (
    <ScrollView style={styles.container}>
      <ProfileInfo />
      {/* <LanguageSelector /> */}
      <LogoutButton />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
});
