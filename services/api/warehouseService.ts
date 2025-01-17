import { Warehouse } from "@//types";
import api from "./apiConfig";

export const getWarehouseList = async () => {
  try {
    const response = await api.get('/warehouses/warehouse-list/');
    console.log("response tesst ", response.data);
    return {success:true,data:response.data};
  } catch (error: any) {
   if (error.errorMessage){
    const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
   }
      return { success: false, data: "Có lỗi xảy ra"};
    
  }
};
// hàm tìm kiếm kho
export const searchWarehouses = async (
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
    const response = await api.get(url);

    // Log response để kiểm tra (có thể xóa sau khi hoàn thành)
    console.log("Response from API:", response);

    // Trả về dữ liệu nhận được từ API
    return { success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
    }
    return { success: false, data: "Có lỗi xảy ra"};
  }
};

export const createWarehouse = async (warehouseData: Warehouse) => {

  try {
    console.log( "warehouseData", warehouseData);
    const response = await api.post('/warehouses/warehouses/', warehouseData );
    console.log("Respone quản lý kho: ", response)
    return { success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
    }
    return { success: false, data: "Có lỗi xảy ra"};
  }
};

export const detailWarehouse = async (warehouseId: number) => {
  try {
    const response = await api.get(`/warehouses/warehouse-list/${warehouseId}/`);
    return { success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
    }
    return { success: false, data: "Có lỗi xảy ra"};
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

    return { success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
    }
    return { success: false, data: "Có lỗi xảy ra"};
    
  }
};

export const deleteWarehouse = async (token: string, warehouseId: number) => {
  try {
    const response = await api.delete(`/warehouses/warehouses/${warehouseId}/`);
    console.log(`Đã xóa kho: ${warehouseId}`, response);
    return { success: true, data: response.data};
    
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
    }
    return { success: false, data: "Có lỗi xảy ra"};
  }
    

};
