import { ExportReceipt, ImportReceipt } from "@/constants/types";
import api from "./apiConfig";

export const getERList = async () => {
  try {
    const response = await api.get('/warehouses/export-list/');
    console.log("response",response)
    
    return { success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
    }
    return { success: false, data: "Có lỗi xảy ra"};
  }
};

export const getPrescriptionNoER = async () => {
  try {
    const response = await api.get('/warehouses/unexportedprescription-list/');
    console.log("response",response)
    return { success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
    }
    return { success: false, data: "Có lỗi xảy ra"};
  }
};
// Hàm tìm kiếm phiếu nhập
export const searchExportReceipts = async (
  export_date: string,
  prescription: string,
  warehouse: string,
  is_approved: string
) => {
  try {
    // Khởi tạo đối tượng URLSearchParams để xây dựng query string
    const params = new URLSearchParams();

    // Chỉ thêm tham số vào query nếu nó có giá trị
    
    if (export_date) {
      params.append("export_date", export_date);
    }
    if (prescription) {
      params.append("prescription", prescription);
    }
    if (warehouse) {
      params.append("warehouse", warehouse);
    }
    // if (is_approved) {
    //   params.append("is_approved", is_approved);
    // }

    // Tạo URL tìm kiếm với các tham số query đã được thêm
    const url = `/warehouses/export-search/?${params.toString()}`;

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

// Hàm tạo phiếu nhập
export const createER = async (ERData: any) => {
  try {
    
    const response = await api.post('/warehouses/warehouse/',ERData);
    console.log("datadfsdfsff",ERData);
    console.log("datadfsdfsff",response.data.id);
    if (response?.data) {
      console.log("Cập nhật thành công:", response.data);
      return { success: true, data: response.data };
    }
    else {
      return { success: false, data: response.data };
    }
  } catch (error: any) {
    if (error.response) {
      const { data, status } = error.response;
      console.log("Lỗi từ API:", data);
      return { success: false, errorMessage: data || "Có lỗi xảy ra", status };
    }
    // Lỗi không phải từ API (ví dụ: lỗi mạng)
    return { success: false, errorMessage: "Lỗi không xác định xảy ra", error };
  }
};

export const updateERAndDetails = async (id: number, ERData: any) => {
  try {
    // Lọc ra chỉ những trường cần thiết
      const dataToUpdate = {
      id: ERData.id,
      employee: ERData.employee,
      prescription: ERData.prescription,
      is_approved: ERData.is_approved,
      warehouse: ERData.warehouse,
      // Đảm bảo details là mảng và giữ nguyên cấu trúc
      details: ERData.details.map((detail: any) => ({
        export_receipt: detail.export_receipt,
        medicine: detail.medicine,
        quantity: detail.quantity,
      })),
    };

    console.log("toàn bộ dữ liệu gửi đi:", dataToUpdate);

    // Gửi API với dữ liệu đã lọc
    const response = await api.put(`/warehouses/warehouse/${id}/`, dataToUpdate);

    // Kiểm tra phản hồi từ server
    if (response?.data?.id) {
      console.log("Cập nhật thành công:", response.data);
      return { success: true, data: response.data };
    } else {
      return { success: false, data: response.data };
    }
  } catch (error: any) {
    // Kiểm tra xem lỗi có phải từ response của API
    if (error.response) {
      const { data, status } = error.response;
      console.log("Lỗi từ API:", data);
      return { success: false, errorMessage: data || "Có lỗi xảy ra", status };
    }

    // Lỗi không phải từ API (ví dụ: lỗi mạng)
    return { success: false, errorMessage: "Lỗi không xác định xảy ra", error };
  }
};


export const detailER = async ( ERId: number) => {
  try {
    const response = await api.get(`/warehouses/warehouse/${ERId}/`);
    if (response?.data?.id) {
      console.log("Cập nhật thành công:", response.data);
      return { success: true, data: response.data };
    } else {
      return { success: false, data: response.data };
    }
  } catch (error: any) {
    if (error.response) {
      const { data, status } = error.response;
      console.log("Lỗi từ API:", data);
      return { success: false, errorMessage: data || "Có lỗi xảy ra", status };
    }

    // Lỗi không phải từ API (ví dụ: lỗi mạng)
    return { success: false, errorMessage: "Lỗi không xác định xảy ra", error };
  }
};


export const deleteER = async (ERId: number) => {
  try {
    const response = await api.delete(`/warehouses/warehouse/${ERId}/`);
    if (!response?.data) {
      console.log("Cập nhật thành công:", response.data);
      return { success: true, data: response.data };
    } else {
      return { success: false, data: response.data };
    }
  } catch (error: any) {
    if (error.response) {
      const { data, status } = error.response;
      console.log("Lỗi từ API:", data);
      return { success: false, errorMessage: data || "Có lỗi xảy ra", status };
    }

    // Lỗi không phải từ API (ví dụ: lỗi mạng)
    return { success: false, errorMessage: "Lỗi không xác định xảy ra", error };
  }
};
