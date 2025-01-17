import { Employee } from "@/types";
import api from "./apiConfig";

export const employeeDetail = async (id: number) => {
  try {
    const response = await api.get(`/accounts/employees/${id}/`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error };
  }
};

export const getEmployees = async () => {
  try {
    const response = await api.get("accounts/employee-list/");
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage };
    }
    // Trả về lỗi mặc định nếu không có thông tin lỗi cụ thể
    return {
      success: false,
      errorMessage: "Có lỗi xảy ra khi load danh sách nhân viên.",
    };
  }
};

export const createEmployees = async (employee: Employee) => {
  try {
    const response = await api.post("accounts/employees/", employee);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.log(error);
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage };
    }
    return {
      success: false,
      errorMessage: "Có lỗi xảy ra khi tạo nhân viên.",
    };
  }
};

export const UpdateEmployee = async (id: Number, employee: Employee) => {
  try {
    const response = await api.put(`/accounts/employees/${id}/`, employee);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.log("Có lỗi xảy ra khi gửi dữ liệu cập nhật");
    return { success: false, error };
  }
};

export const DeleteEmployee = async (id: Number) => {
  try {
    const response = await api.delete(`/accounts/employees/${id}/`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.log("Có lỗi xảy ra khi gửi dữ liệu cập nhật");
    return { success: false, error };
  }
};
