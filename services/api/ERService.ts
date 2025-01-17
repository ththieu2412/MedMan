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
// Hàm tìm kiếm phiếu nhập
export const searchExportReceipts = async (
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
    return { success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
    }
    return { success: false, data: "Có lỗi xảy ra"};
  }
};
// export const searchEmployeeByRole = async (
//   role: string,
// ) => {
//   try {
//     // Khởi tạo đối tượng URLSearchParams để xây dựng query string
//     const params = new URLSearchParams();

//     // Chỉ thêm tham số vào query nếu nó có giá trị
    
//     if (role) {
//       params.append("role", role);
//     }
  

//     // Tạo URL tìm kiếm với các tham số query đã được thêm
//     const url = `/accounts/employees-by-role/?${params.toString()}`;
//     console.log(url)
//     // Gửi yêu cầu GET với token trong header Authorization
//     const response = await api.get(url);

//     // Log response để kiểm tra (có thể xóa sau khi hoàn thành)
//     console.log("Response from API:", response);

//     // Trả về dữ liệu nhận được từ API
//    return { success: true, data: response.data};
//   } catch (error: any) {
//     if (error.errorMessage) {
//       const errorMessage = error.errorMessage;
//       return { success: false, errorMessage};
//     }
//     return { success: false, data: "Có lỗi xảy ra"};
//   }
// };

// Hàm tạo phiếu nhập
export const createER = async (ERData: any) => {
  try {
    const response = await api.post(' /warehouses/warehouse/',{ERData});
    console.log("datadfsdfsff",ERData)
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
export const updateERAndDetails = async (
  id: number,
  ERData: any
) => {
  try {
    // Lọc ra chỉ những trường cần thiết
    const dataToUpdate = {
      id:ERData.id,
      employee:ERData.employee,
      prescription: ERData.prescription,
      is_approved: ERData.is_approved,
      warehouse_id:ERData.warehouse_id,
      details:{
        id:ERData.details.id,
        medicine:ERData.details.medicine,
        quantity: ERData.detail.quantity
      }
    };
    console.log("toàn bộ sữ liêu",dataToUpdate)
    console.log("response cập nhật phiếu nhập 10 ");
    // Gửi API với dữ liệu đã lọc
    const response = await api.put(
      `/warehouses/warehouse/${id}/`,
      dataToUpdate
    );
    console.log("response cập nhật phiếu nhập 11 ", response);
    return { success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
    }
    return { success: false, data: "Có lỗi xảy ra"};
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
// export const createImportReceiptAndDetails = async ( IRData: any) => {
//   try {
//     // Gọi API /ir-create để tạo phiếu nhập và chi tiết phiếu nhập
//     const response = await api.post('/ir-create', IRData);

//     // Trả về kết quả thành công
//     return { success: true, data: response.data};
//   } catch (error: any) {
//     if (error.errorMessage) {
//       const errorMessage = error.errorMessage;
//       return { success: false, errorMessage};
//     }
//     return { success: false, data: "Có lỗi xảy ra"};
//   }
// };
export const detailER = async ( ERId: number) => {
  try {
    const response = await api.get(`/warehouses/warehouse/${ERId}/`);
    return { success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
    }
    return { success: false, data: "Có lỗi xảy ra"};
  }
};


export const deleteER = async (ERId: number) => {
  try {
    const response = await api.delete(`/warehouses/warehouse/${ERId}/`);
    return { success: true, data: response.data};
  } catch (error: any) {
    if (error.errorMessage) {
      const errorMessage = error.errorMessage;
      return { success: false, errorMessage};
    }
    return { success: false, data: "Có lỗi xảy ra"};
  }
};
