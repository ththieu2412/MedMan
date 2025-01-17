import { ImportReceipt } from "@/constants/types";
import api from "./apiConfig";

// Hàm lấy báo cáo nhập hàng
export const ReportImportReceipt = async (
  startDate: string,
  endDate: string,
) => {
  try {
    // Khởi tạo đối tượng URLSearchParams để xây dựng query string
    const params = new URLSearchParams();

    // Chỉ thêm tham số vào query nếu nó có giá trị
    if (startDate) {
      params.append("start_date", startDate);
    }
    if (endDate) {
      params.append("end_date", endDate);
    }

    // Tạo URL tìm kiếm với các tham số query đã được thêm
    const url = `/reports/import-receipt/?${params.toString()}`;

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
export const ReportEmployeeActivity = async (
  token: string,
  limit: string,
) => {
  try {
    // Khởi tạo đối tượng URLSearchParams để xây dựng query string
    const params = new URLSearchParams();

    // Chỉ thêm tham số vào query nếu nó có giá trị
    if (limit) {
      params.append("limit", limit);
    }

    // Tạo URL tìm kiếm với các tham số query đã được thêm
    const url = `/reports/employee-activity/?${params.toString()}`;

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
export const ReportInventory = async (
  token: string
) => {
  try {
  

    // Tạo URL tìm kiếm với các tham số query đã được thêm
    const url = "/reports/inventory/";

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

export const ReportPatient = async (year: number, month: number) => {
  try {
    const response = await api.get(`/reports/patient-report/?year=${year}&month=${month}`); // Gọi API với URL đã được sửa
    return { success: true, data: response.data };  
  } catch (error: any) {
    if (error.response && error.response.data) {
      // Xử lý lỗi trả về từ API
      const errorMessage = error.response.data.errorMessage || "Unknown error occurred.";
      return { success: false, errorMessage };
    }
    // Trả về lỗi mặc định nếu không có thông tin lỗi cụ thể
    return { success: false, errorMessage: "Có lỗi xảy ra khi thêm thuốc." };
  }
};

