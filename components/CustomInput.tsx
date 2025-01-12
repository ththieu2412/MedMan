import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { fontSize, spacing } from '@/constants/dimensions'
import Fontisto from '@expo/vector-icons/Fontisto';
import { CustomInputProps } from '@/types/CustomInputProps';
import { Feather, Ionicons } from '@expo/vector-icons';

const CustomInput: React.FC<CustomInputProps> = ({label, icon, placeholder, type, onChangeText}) => {
    const [secureTextEntery, setSecureTextEntery] = useState(true)
    return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputFieldContainer}>
        {icon}
        {/* <Fontisto name="email" size={24} color="#ABABAB" style={styles.icon}/> */}
        <TextInput placeholder={placeholder} 
        style={styles.textInput}
        secureTextEntry={ type === "password" && secureTextEntery}
        onChangeText={onChangeText}
        />
        {
            type === "password" && (
                <TouchableOpacity onPress={() => setSecureTextEntery(!secureTextEntery)}>
                    <Feather
                        name={secureTextEntery ? 'eye-off' : 'eye'}
                        size={24}
                        color="#7B7B8B"
                    />
                </TouchableOpacity>
            )
        }
      </View>
    </View>
  )
}

export default CustomInput

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.sm,
    },
    inputLabel: {
        fontSize: fontSize.md,
        fontWeight: 'bold',
        color: "black",
        marginVertical: spacing.sm,
    },
    inputFieldContainer: {
        borderWidth: 1,
        borderColor: "#cccccc",
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: "center",
        padding: spacing.sm,
    },
    textInput:{
         flex: 1,
         fontSize: fontSize.md,
         paddingLeft: 20,
    },
})