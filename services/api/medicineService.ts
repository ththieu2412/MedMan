import { Medicine } from "@/types";
import api from "./apiConfig";

export const getMedicineList = async () => {
  try {
    const response = await api.get('/warehouses/medicines/');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.detail || 'Unknown error');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response from server');
    } else {
      console.error('Error message:', error.message);
      throw new Error(error.message);
    }
  }
};

export const searchMedicine = async (query: string) => {
  try {
    const response = await api.get(`/warehouses/medicines/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching medicines:", error);
    throw error;
  }
};

export const createMedicine = async (medicineData: object) => {
  try {
    const response = await api.post('/warehouses/medicines/', medicineData);
    return { success: true, data: response.data }; 
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage };
    }
    // Trả về lỗi mặc định nếu không có thông tin lỗi cụ thể
    return { success: false, errorMessage: "Có lỗi xảy ra khi thêm thuốc." };
  }
};



export const detailMedicine = async (medicineId: number) => {
  try {
    const response = await api.get(`/warehouses/medicines/${medicineId}/`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.detail || 'Unknown error');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response from server');
    } else {
      console.error('Error message:', error.message);
      throw new Error(error.message);
    }
  }
};

export const updateMedicine = async (medicineId: number, updateMedicine: Medicine) => {
  try {
    const response = await api.put(`/warehouses/medicines/${medicineId}/`, updateMedicine);
    console.log("Response trước khi update thành công: ", response)
    return { success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      console.log("Error khi có lỗi: ", error)
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage };
    }
    // Trả về lỗi mặc định nếu không có thông tin lỗi cụ thể
    return { success: false, errorMessage: "Có lỗi xảy ra khi thêm thuốc." };
  }
};

export const deleteMedicine = async (medicineId: number) => {
  try {
    const response = await api.delete(`/warehouses/medicines/${medicineId}/`);
    return {success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage };
    }
    // Trả về lỗi mặc định nếu không có thông tin lỗi cụ thể
    return { success: false, errorMessage: "Có lỗi xảy ra khi thêm thuốc." };
  }

};
