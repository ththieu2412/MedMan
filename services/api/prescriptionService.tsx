import api from "./apiConfig";

export const getPrescriptionList = async () => {
  try {
    const response = await api.get("/prescriptions/prescriptions/");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.detail || "Unknown error");
    } else if (error.request) {
      console.error("Error request:", error.request);
      throw new Error("No response from server");
    } else {
      console.error("Error message:", error.message);
      throw new Error(error.message);
    }
  }
};

export const createPrescription = async (requestBody: object) => {
  try {
    const response = await api.post(
      "/prescriptions/prescriptions/",
      requestBody
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage };
    }
    // Trả về lỗi mặc định nếu không có thông tin lỗi cụ thể
    return {
      success: false,
      errorMessage: "Có lỗi xảy ra khi thêm đơn thuốc.",
    };
  }
};
