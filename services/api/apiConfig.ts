import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "@/context/AuthContext"; // Import useAuth từ AuthContext của bạn


const BASE_URL = 'http://192.168.1.18:8000/api';




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
      if (error.response) {
        // Thông báo lỗi từ server
        console.log('API Error Response:', error.response.data);
        return Promise.reject(error.response.data); 
      } else if (error.request) {
        // Lỗi yêu cầu không nhận được phản hồi
        console.log('API Error Request:', error.request);
        return Promise.reject('Không nhận được phản hồi từ server');
      } else {
        // Lỗi khác
        console.log('API Error Message:', error.message);
        return Promise.reject(error.message);
      }
    }
  );
  

export default api;
