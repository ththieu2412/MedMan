import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// 🧩 Interceptor để xử lý lỗi
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API error', error);
        return Promise.reject(error);
    }
);

export default api;