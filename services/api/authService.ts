import api from "./apiConfig";

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/accounts/accounts/login/', { username, password });
    console.log('Data', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Lỗi từ server
      if (error.response.status === 401) {
        // Lỗi 401: Sai thông tin đăng nhập
        throw new Error('Sai thông tin đăng nhập. Vui lòng kiểm tra lại!');
      } else {
        // Lỗi khác từ server
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Đã xảy ra lỗi từ server.');
      }
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      console.error('Error request:', error.request);
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    } else {
      // Lỗi khi cấu hình request
      console.error('Error message:', error.message);
      throw new Error(error.message);
    }
  }
};

export const register = async (userData: any) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Đã xảy ra lỗi trong quá trình đăng ký.');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    } else {
      console.error('Error message:', error.message);
      throw new Error(error.message);
    }
  }
};
