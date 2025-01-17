import { ImportReceipt } from "@/constants/types";
import api from "./apiConfig";

// Hàm lấy báo cáo nhập hàng
export const ReportImportReceipt = async (
  token: string,
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
    return response.data;  // Giả sử API trả về data trong trường `data`
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
    return response.data;  // Giả sử API trả về data trong trường `data`
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
    return response.data;  // Giả sử API trả về data trong trường `data`
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

export const ReportPatient = async (start_date: string, end_date: string) => {
  try {
    const response = await api.get(`/reports/patient-report/?start_date=${start_date}&end_date=${end_date}`); // Gọi API với URL đã được sửa
    return { success: true, data: response.data };  
  } catch (error: any) {
    console.log("Looixxxxx", error)
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage };
    }
    return { success: false, errorMessage: "Có lỗi xảy ra khi lấy dữ liệu." };
  }
};

