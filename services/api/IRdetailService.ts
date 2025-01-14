import api from "./apiConfig";

export const getIRDList = async (token: string) => {
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

export const createIRD = async (token: string, IRDData: object) => {
  try {
    const response = await api.post('/warehouses/import-receipt-details/');
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
//Hàm lấy chi tiết phiếu nhập theo id phiếu nhập
export const detailbyIRId = async (token: string, IRId: number) => {
  try {
    const response = await api.get(`/warehouses/import-receipt-details-by-id/${IRId}/`);
    console.log("response.data:", response.data);
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
export const updatebyIRId = async (
  token: string,
  IRId: number,
  details: Array<{ medicine: number; quantity: number; price: number }>
) => {
  try {
    const response = await api.put(
      `/warehouses/import-receipt-details-by-id/${IRId}/`,
      { details }
    );
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

export const deleteIRD = async (token: string, IRDId: number) => {
  try {
    const response = await api.delete(`/warehouses/import-receipt-details/${IRDId}/`);
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
