import { Warehouse } from "@//types";
import api from "./apiConfig";

export const getWarehouseList = async (token: string) => {
  try {
    const response = await api.get('/warehouses/warehouse-list/');
    console.log("response tesst ", response);
    return {sucess:true,data:response.data};
  } catch (error: any) {
   if (error.errorMessage){
      return error.errorMessage;
   }
      
    
  }
};
// hàm tìm kiếm kho
export const searchWarehouses = async (
  token: string,
  address: string,
  isActive: string
) => {
  try {
    // Khởi tạo đối tượng URLSearchParams để xây dựng query string
    const params = new URLSearchParams();

    // Chỉ thêm tham số vào query nếu nó có giá trị
    if (address) {
      params.append("address", address);
    }
    if (isActive) {
      params.append("is_active", isActive);
    }

    // Tạo URL tìm kiếm với các tham số query đã được thêm
    const url = `/warehouses/warehouses/search/?${params.toString()}`;

    // Gửi yêu cầu GET với token trong header Authorization
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Log response để kiểm tra (có thể xóa sau khi hoàn thành)
    console.log("Response from API:", response);

    // Trả về dữ liệu nhận được từ API
    return response.data.data;  // Giả sử API trả về data trong trường `data`
  } catch (error: any) {
    // Nếu có lỗi từ phản hồi, log và trả về lỗi
    if (error.response) {
      console.error("Error response:", error.response.data);
      return error.response.data;  // Trả về thông tin lỗi từ server
    } else {
      // Nếu không có phản hồi từ server, log và trả về lỗi chung
      console.error("Error:", error.message);
      return { errorMessage: error.message };
    }
  }
};

export const createWarehouse = async (token: string, warehouseData: Warehouse) => {

  try {
    console.log( "warehouseData", warehouseData);
    const response = await api.post('/warehouses/warehouses/', warehouseData );
    console.log("Respone quản lý kho: ", response)
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      return error.response.data;
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
    // if (error.response) {
    //   console.error('Error response:', error.response.data);
    //   console.log("lỗi:", response.errMessage);
    //   throw new Error(error.response.data.detail || 'Unknown error');
    // } else if (error.request) {
    //   console.log("lỗi:", response.errMessage);
    //   console.error('Error request:', error.request);
    //   throw new Error('No response from server');
    // } else {
    //   console.log("lỗi:", response.errMessage);
    //   console.error('Error message:', error.message);
    //   throw new Error(error.message);
    // }
    
  }
};

export const deleteWarehouse = async (token: string, warehouseId: number) => {
  try {
    const response = await api.delete(`/warehouses/warehouses/${warehouseId}/`);
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
