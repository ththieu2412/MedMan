import { ExportReceipt } from "@/constants/types";
import api from "./apiConfig";

// Hàm lấy danh sách phiếu xuất
export const getERList = async (token: string) => {
  try {
    const response = await api.get('/warehouses/export-receipt-list/');
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

// Hàm tìm kiếm phiếu xuất
export const searchExportReceipts = async (
  token: string,
  startDate: string,
  endDate: string,
  employeeName: string,
  warehouseName: string,
  isApproved: string
) => {
  try {
    const params = new URLSearchParams();

    if (startDate) {
      params.append("start_date", startDate);
    }
    if (endDate) {
      params.append("end_date", endDate);
    }
    if (employeeName) {
      params.append("employee_name", employeeName);
    }
    if (warehouseName) {
      params.append("warehouse_name", warehouseName);
    }
    if (isApproved) {
      params.append("is_approved", isApproved);
    }

    const url = `/warehouses/export-receipts/search/?${params.toString()}`;
    const response = await api.get(url);

    return response.data.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      return error.response.data;
    } else {
      console.error("Error:", error.message);
      return { errorMessage: error.message };
    }
  }
};

// Hàm tạo phiếu xuất
export const createER = async (token: string, ERData: ExportReceipt) => {
  try {
    const response = await api.post('/warehouses/export-receipts/', { ERData });
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

// Hàm cập nhật phiếu xuất theo ID
export const updateER = async (
  token: string,
  id: number,
  ERData: ExportReceipt
) => {
  try {
    const dataToUpdate = {
      warehouse: ERData.warehouse,
      is_approved: ERData.is_approved,
    };

    const response = await api.put(
      `/warehouses/export-receipts/${id}/`,
      dataToUpdate
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data);
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response from server');
    } else {
      console.error('Error message:', error.message);
      throw new Error(error.message);
    }
  }
};

// Hàm tạo phiếu xuất và chi tiết phiếu xuất
export const createERAndERDetail = async (token: string, ERData: ExportReceipt) => {
  try {
    const response = await api.post('/warehouses/export-receipts/', { ERData });
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

// Hàm lấy chi tiết phiếu xuất theo ID
export const detailER = async (token: string, ERId: number) => {
  try {
    const response = await api.get(`/warehouses/export-receipt-list/${ERId}/`);
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

// Hàm xóa phiếu xuất theo ID
export const deleteER = async (token: string, ERId: number) => {
  try {
    const response = await api.delete(`/warehouses/export-receipts/${ERId}/`);
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
