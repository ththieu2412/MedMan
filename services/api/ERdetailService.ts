import api from "./apiConfig";

export const getERDList = async () => {
  try {
    const response = await api.get('/warehouses/import-receipt-list/');
    return { success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
    }
    return { success: false, data: "Có lỗi xảy ra"};
  }
};

export const createIRD = async (IRDData: object) => {
  try {
    const response = await api.post('/warehouses/import-receipt-details/');
    return { success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
    }
    return { success: false, data: "Có lỗi xảy ra"};
  }
};
//Hàm lấy chi tiết phiếu nhập theo id phiếu nhập
export const detailbyIRId = async (IRId: number) => {
  try {
    const response = await api.get(`/warehouses/import-receipt-details-by-id/${IRId}/`);
    console.log("response.data:", response.data);
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
export const updatebyIRId = async (
  IRId: number,
  details: Array<{ medicine: number; quantity: number; price: number }>
) => {
  try {
    const response = await api.put(
      `/warehouses/import-receipt-details-by-id/${IRId}/`,
      { details }
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

export const deleteERD = async (ERDId: number) => {
  try {
    const response = await api.delete(`/warehouses/warehouse/${ERDId}/`);
    return { success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
    }
    return { success: false, data: "Có lỗi xảy ra"};
  }
};
