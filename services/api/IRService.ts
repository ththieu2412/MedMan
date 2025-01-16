import { ImportReceipt } from "@/constants/types";
import api from "./apiConfig";

export const getIRList = async (token: string) => {
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
// Hàm tìm kiếm phiếu nhập
export const searchImportReceipts = async (
  token: string,
  startDate: string,
  endDate: string,
  employeeName: string,
  warehouseName: string,
  isApproved: string
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
    if (employeeName) {
      params.append("employee_name", employeeName);
    }
    if (warehouseName) {
      params.append("warehouse_name", warehouseName);
    }
    if (isApproved) {
      params.append("is_approved", isApproved);
    }

    // Tạo URL tìm kiếm với các tham số query đã được thêm
    const url = `/warehouses/import-receipts/search/?${params.toString()}`;

    // Gửi yêu cầu GET với token trong header Authorization
    const response = await api.get(url);

    // Log response để kiểm tra (có thể xóa sau khi hoàn thành)
    console.log("Response from API:", response);

    // Trả về dữ liệu nhận được từ API
    return response.data.data;  // Giả sử API trả về data trong trường `data`
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
export const searchEmployeeByRole = async (
  token: string,
  role: string,
) => {
  try {
    // Khởi tạo đối tượng URLSearchParams để xây dựng query string
    const params = new URLSearchParams();

    // Chỉ thêm tham số vào query nếu nó có giá trị
    
    if (role) {
      params.append("role", role);
    }
  

    // Tạo URL tìm kiếm với các tham số query đã được thêm
    const url = `/accounts/employees-by-role/?${params.toString()}`;
    console.log(url)
    // Gửi yêu cầu GET với token trong header Authorization
    const response = await api.get(url);

    // Log response để kiểm tra (có thể xóa sau khi hoàn thành)
    console.log("Response from API:", response);

    // Trả về dữ liệu nhận được từ API
    return response.data.data;  // Giả sử API trả về data trong trường `data`
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

// Hàm tạo phiếu nhập
export const createIR = async (token: string, IRData: ImportReceipt) => {
  try {
    const response = await api.post('/warehouses/import-receipts/',{IRData});
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
export const updateIR = async (
  token: string,
  id: number,
  IRData: ImportReceipt
) => {
  try {
    // Lọc ra chỉ những trường cần thiết
    const dataToUpdate = {
      warehouse: IRData.warehouse,
      is_approved: IRData.is_approved,
    };
    console.log("response cập nhật phiếu nhập 10 ");
    // Gửi API với dữ liệu đã lọc
    const response = await api.put(
      `/warehouses/import-receipts/${id}/`,
      dataToUpdate
    );
    console.log("response cập nhật phiếu nhập 11 ", response);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response:", error.response.data);
     throw new Error(error.response.data);
    }
   else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response from server');
    } else {
      console.error('Error message:', error.message);
      throw new Error(error.message);
    }
    
  }
};
// Hàm tạo phiếu nhập và chi tiết phiếu nhập
// export const createIRAndIRDetail = async (token: string, IRData: ImportReceipt) => {
//   try {
//     const response = await api.post('/warehouses/import-receipts/',{IRData});
//     return response.data;
//   } catch (error: any) {
//     if (error.response) {
//       console.error('Error response:', error.response.data);
//       throw new Error(error.response.data.detail || 'Unknown error');
//     } else if (error.request) {
//       console.error('Error request:', error.request);
//       throw new Error('No response from server');
//     } else {
//       console.error('Error message:', error.message);
//       throw new Error(error.message);
//     }
//   }
// };
export const createImportReceiptAndDetails = async (token: string, IRData: any) => {
  try {
    // Gọi API /ir-create để tạo phiếu nhập và chi tiết phiếu nhập
    const response = await api.post('/ir-create', IRData);

    // Trả về kết quả thành công
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Xử lý lỗi từ server (có response trả về)
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.detail || 'Unknown error');
    } else if (error.request) {
      // Xử lý trường hợp không có phản hồi từ server
      console.error('Error request:', error.request);
      throw new Error('No response from server');
    } else {
      // Xử lý lỗi khác
      console.error('Error message:', error.message);
      throw new Error(error.message);
    }
  }
};
export const detailIR = async (token: string, IRId: number) => {
  try {
    const response = await api.get(`/warehouses/import-receipt-list/${IRId}/`);
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


export const deleteIR = async (token: string, IRId: number) => {
  try {
    const response = await api.delete(`/warehouses/import-receipts/${IRId}/`);
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
