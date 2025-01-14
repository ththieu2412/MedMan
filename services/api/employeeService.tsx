import api from "./apiConfig";

export const employeeDetail = async (id: number) => {
  try {
    const response = await api.get(`/accounts/employees/${id}/`);
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
