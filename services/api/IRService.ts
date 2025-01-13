import { ImportReceipt } from "@/constants/types";
import api from "./apiConfig";

export const getIRList = async (token: string) => {
  try {
    const response = await api.get('/warehouses/import-receipt-list/');
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
// Hàm tạo phiếu nhập
export const createIR = async (token: string, IRData: ImportReceipt) => {
  try {
    const response = await api.post('/warehouses/import-receipts/',{IRData});
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

// Hàm tạo phiếu nhập và chi tiết phiếu nhập
export const createIRAndIRDetail = async (token: string, IRData: ImportReceipt) => {
  try {
    const response = await api.post('/warehouses/import-receipts/',{IRData});
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

export const detailIR = async (token: string, IRId: number) => {
  try {
    const response = await api.get(`/warehouses/import-receipt-list/${IRId}/`);
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


export const deleteIR = async (token: string, IRId: number) => {
  try {
    const response = await api.delete(`/warehouses/import-receipts/${IRId}/`);
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
