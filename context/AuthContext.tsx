import { AuthContextType, User } from "@/types";
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api/apiConfig";
import { Alert } from "react-native";
import { router } from "expo-router";

// 🧩 Tạo context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🧩 Tạo provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🧩 Load user từ AsyncStorage khi app khởi động
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUserState(JSON.parse(storedUser));
          router.replace("/(tabs)");
        } else {
          console.log("Người dùng chưa đăng nhập");
        }
      } catch (error) {
        console.warn("Error loading user from AsyncStorage:", error);
      }
    };
    loadUser();
  }, []);

  // Hàm login
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/accounts/accounts/login/", {
        username,
        password,
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.status === 401
          ? "Sai thông tin đăng nhập. Vui lòng kiểm tra lại!"
          : error.response?.data.message || "Đã xảy ra lỗi từ server.";
      return { data: null, error: message };
    } finally {
      setIsLoading(false);
    }
  };

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
    try {
      Alert.alert("Xác nhận", "Bạn có chắc muốn đăng xuất?", [
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("user");
              setUserState(null);
              router.replace("/sign-in");
            } catch (error) {
              console.warn("Error removing user from AsyncStorage:", error);
            }
          },
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.warn("Error:", error);
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
      value={{ isLoading, user, setUser, logout, isLoggedIn, getToken, login }}
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
