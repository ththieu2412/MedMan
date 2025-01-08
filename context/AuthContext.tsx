import { AuthContextType, User } from "@/types";
import React, { createContext, ReactNode, useContext, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<User | null>(null);

    const setUser = async (user: User) => {
        setUserState(user);
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user)); // Lưu vào AsyncStorage
        } catch (error) {
            console.error('Error saving user to AsyncStorage:', error);
        }
    }

    const logout = async () => {
        setUserState(null);
        try {
            await AsyncStorage.removeItem('user'); // Xóa người dùng trong AsyncStorage
        } catch (error) {
            console.error('Error removing user from AsyncStorage:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
