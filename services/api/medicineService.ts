import api from "./apiConfig";

export const getMedicineList = async (token: string) => {
  try {
    const response = await api.get('/warehouses/medicines/', {
      headers: {
        Authorization: `Token ${token}`, // Thêm token vào header
      },
    });
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

export const createMedicine = async (token: string, medicineData: object) => {
  try {
    const response = await api.post('/warehouses/medicines/', medicineData, {
      headers: {
        Authorization: `Token ${token}`, 
        'Content-Type': 'multipart/form-data', 
      },
    });
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

export const detailMedicine = async (token: string, medicineId: number) => {
  try {
    const response = await api.get(`/warehouses/medicines/${medicineId}/`, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
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


export const deleteMedicine = async (token: string, medicineId: number) => {
  try {
    const response = await api.delete(`/warehouses/medicines/${medicineId}/`, {
      headers: {
        Authorization: `Token ${token}`, 
        'Content-Type': 'application/json', 
      },
    });
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
