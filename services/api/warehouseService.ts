import { Warehouse } from "@//types";
import api from "./apiConfig";

export const getWarehouseList = async (token: string) => {
  try {
    const response = await api.get('/warehouses/warehouse-list/');
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

export const createWarehouse = async (token: string, warehouseData: Warehouse) => {
  
  try {
    console.log( "warehouseData", warehouseData);
    const response = await api.post('/warehouses/warehouses/', warehouseData );
    console.log("Respone quản lý kho: ", response)
    return response;
  } catch (error: any) {
    if (error.response) {
      console.error('Error response:', error.response);
      return error.response
     
    }
  }
};

export const detailWarehouse = async (token: string, warehouseId: number) => {
  try {
    const response = await api.get(`/warehouses/warehouse-list/${warehouseId}/`);
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

// Hàm cập nhật chi tiết phiếu nhập theo id phiếu nhập
export const updateWarehouse = async (
  token: string,
  id: number,
  warehouseData: Warehouse
) => {
  try {
    // Lọc ra chỉ những trường cần thiết
    const dataToUpdate = {
      address: warehouseData.address,
      is_active: warehouseData.is_active,
    };

    // Gửi API với dữ liệu đã lọc
    const response = await api.put(
      `/warehouses/warehouses/${id}/`,
      dataToUpdate
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.log("lỗi:", response.errMessage);
      throw new Error(error.response.data.detail || 'Unknown error');
    } else if (error.request) {
      console.log("lỗi:", response.errMessage);
      console.error('Error request:', error.request);
      throw new Error('No response from server');
    } else {
      console.log("lỗi:", response.errMessage);
      console.error('Error message:', error.message);
      throw new Error(error.message);
    }
    
  }
};

export const deleteWarehouse = async (token: string, warehouseId: number) => {
  const response = null;
  try {
    response = await api.delete(`/warehouses/warehouses/${warehouseId}/`);
    console.log(`Đã xóa kho: ${warehouseId}`, response);

    
  } catch (error: any) {
    console.log(`Đã xóa kho: ${warehouseId}`, response);
    console.error('Error response:', response.errorMessage);
    // if (error.response) {
    //   console.error('Error response:', error.response.data);
    //   throw new Error(error.response.data.detail || 'Unknown error');
    // } else if (error.request) {
    //   console.error('Error request:', error.request);
    //   throw new Error('No response from server');
    // } else {
    //   console.error('Error message:', error.message);
    //   throw new Error(error.message);
    // }
  }
    return response;

};
