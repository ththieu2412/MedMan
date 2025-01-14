import { AuthContextType, User } from "@/types";
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🧩 Tạo context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🧩 Tạo provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🧩 Load user từ AsyncStorage khi app khởi động
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUserState(JSON.parse(storedUser));
        } else {
          console.warn("No user found in AsyncStorage.");
        }
      } catch (error) {
        console.warn("Error loading user from AsyncStorage:", error);
      }
    };
    loadUser();
  }, []);

  // 🧩 Hàm để lưu user vào state và AsyncStorage
  const setUser = async (user: User) => {
    setUserState(user);
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.warn("Error saving user to AsyncStorage:", error);
    }
  };

  // 🧩 Hàm logout để xóa user khỏi state và AsyncStorage
  const logout = async () => {
    setUserState(null);
    try {
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.warn("Error removing user from AsyncStorage:", error);
    }
  };

  // 🧩 Hàm kiểm tra trạng thái đăng nhập
  const isLoggedIn = (): boolean => {
    return user !== null;
  };

  const getToken = (): string | null => {
    const token = user?.token || null;
    console.log("GetToken:", token); // In ra token để kiểm tra
    return token;
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, isLoggedIn, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🧩 Custom hook để sử dụng AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
