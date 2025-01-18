import { Patient } from "@/types";
import api from "./apiConfig";

export const getPatients = async () => {
  try {
    const response = await api.get(`/prescriptions/patients/`);
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage };
    }
    return {
      success: false,
      errorMessage: "Có lỗi xảy ra khi load danh sách bệnh nhân.",
    };
  }
};

export const createPatient = async (patient: Patient) => {
  try {
    console.log("Patient truyền qua API: ", patient);
    const response = await api.post(`/prescriptions/patients/`, patient);

    return { success: true, data: response.data };
  } catch (error: any) {
    console.log(error);
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage };
    }
    return {
      success: false,
      errorMessage: "Có lỗi xảy ra khi thêm bệnh nhân.",
    };
  }
};

export const PatientDetail = async (id: number) => {
  try {
    const response = await api.get(`/prescriptions/patients/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage };
    }
    return {
      success: false,
      errorMessage: "Có lỗi xảy ra khi lấy chi tiết bệnh nhân.",
    };
  }
};

export const UpdatePatient = async (id: number, data: Patient) => {
  try {
    const response = await api.put(`/prescriptions/patients/${id}/`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage };
    }
    return {
      success: false,
      errorMessage: "Có lỗi xảy ra khi cập nhật bệnh nhân.",
    };
  }
};

export const DeletePatient = async (id: number) => {
  try {
    const response = await api.delete(`/prescriptions/patients/${id}/`);
    console.log("TEst response:  ", response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage };
    }
    return {
      success: false,
      errorMessage: "Có lỗi xảy ra khi xóa bệnh nhân.",
    };
  }
};
