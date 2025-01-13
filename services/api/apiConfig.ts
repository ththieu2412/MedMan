import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "@/context/AuthContext"; // Import useAuth từ AuthContext của bạn

const BASE_URL = 'http://192.168.1.45:8000/api';

// 🌐 Thiết lập URL gốc của API
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 🛡️ Interceptor để thêm token vào header
api.interceptors.request.use(
    async (config) => {
        // Lấy token từ AsyncStorage
        const token = await AsyncStorage.getItem("user");
        if (token) {
            // Lấy token từ AsyncStorage hoặc AuthContext
            const parsedUser = JSON.parse(token);
            config.headers.Authorization = `Token ${parsedUser?.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 🧩 Interceptor để xử lý lỗi
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API error', error);
        return Promise.reject(error);
    }
);

export default api;
