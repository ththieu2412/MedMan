import api from "./apiConfig";

export const login = async (username: string, password: string) => {
    try {
      console.log('Username test' ,username)
      console.log('Password test' ,password)
      const response = await api.post('/accounts/accounts/login/', { username, password });
      console.log('Data', response.data)
      return response.data;
    } catch (error: any) {
      // Xử lý lỗi tại đây
      if (error.response) {
        // Lỗi từ server (ví dụ 4xx hoặc 5xx)
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Unknown error');
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        console.error('Error request:', error.request);
        throw new Error('No response from server');
      } else {
        // Lỗi khi cấu hình request
        console.error('Error message:', error.message);
        throw new Error(error.message);
      }
    }
  }

export const register = async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
}