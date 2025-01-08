import { Warehouse, ApiResponse, ImportReceipt,ImportReceiptDetail,Medicine ,Patient} from "@/constants/types"; 


const BASE_URL = 'http://10.251.1.58:8000/api'; 

export const getWarehouseListsapi = async (): Promise<ApiResponse<Warehouse[]>> => {
  console.log('getWarehousesapi')
  try {
    console.log('start')
    const response = await fetch(BASE_URL+"/warehouses/warehouse-list/");
    const data = await response.json();
    console.log(data)
    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: [],
      errorMessage: error.message || "Internal server error",
    };
  }
};

export const getWarehouseDetailapi = async (
  id: string
): Promise<ApiResponse<Warehouse>> => {
  console.log('getWarehouseDetailapi');
  try {
    console.log('Fetching warehouse with ID:', id);

    // Gọi API lấy thông tin chi tiết của kho
    const response = await fetch(`${BASE_URL}/warehouses/warehouse-list/${id}/`);
    const data = await response.json();

    // Trả về dữ liệu nếu thành công
    console.log(data);
    return {
      statuscode: 200,
      status: "success",
      data: data,
      errorMessage: null,
    };
  } catch (error: any) {
    // Xử lý lỗi và trả về response lỗi
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};

export const addWarehouseapi = async (
  newWarehouse: Warehouse
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL + "/warehouses/warehouses/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Đảm bảo Content-Type là application/json
      },
      body: JSON.stringify(newWarehouse), // Gửi dữ liệu dưới dạng JSON
    });

    // Kiểm tra nếu phản hồi có mã trạng thái 2xx (thành công)
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json(); // Chuyển phản hồi sang JSON
    return data; // Trả về dữ liệu phản hồi
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};



export const updateWarehouseapi = async (
  id: string,
  updatedWarehouse: Warehouse
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL+`/warehouses/warehouses/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedWarehouse),
    });

    const data = await response.json();

    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};



export const deleteWarehouseapi = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL+`/warehouses/warehouses/${id}/`, {
      method: "DELETE",
    });

    const data = await response.json();
    console.log("delete"+data)
    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};


// ImportReceipt fetch API

export const getImportReceiptListsapi = async (): Promise<ApiResponse<ImportReceipt[]>> => {
  try {
    const response = await fetch(BASE_URL+"/warehouses/import-receipt-list/");
    const data = await response.json();
    console.log(data)
    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: [],
      errorMessage: error.message || "Internal server error",
    };
  }
};

export const getImportReceiptapi = async (
  id: string
): Promise<ApiResponse<ImportReceipt>> => {
  try {

    // Gọi API lấy thông tin chi tiết của kho
    const response = await fetch(`${BASE_URL}/warehouses/import-receipt-list/${id}/`);
    const data = await response.json();

    // Trả về dữ liệu nếu thành công
    console.log(data);
    return {
      statuscode: 200,
      status: "success",
      data: data,
      errorMessage: null,
    };
  } catch (error: any) {
    // Xử lý lỗi và trả về response lỗi
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};

export const addImportReceiptapi = async (
  newImportReceipt: ImportReceipt
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL + "/warehouses/import-receipts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Đảm bảo Content-Type là application/json
      },
      body: JSON.stringify(newImportReceipt), // Gửi dữ liệu dưới dạng JSON
    });

    // Kiểm tra nếu phản hồi có mã trạng thái 2xx (thành công)
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json(); // Chuyển phản hồi sang JSON
    return data; // Trả về dữ liệu phản hồi
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};



export const updateImportReceiptapi = async (
  id: string,
  updatedImportReceipt: ImportReceipt
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL+`/warehouses/import-receipts/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedImportReceipt),
    });

    const data = await response.json();

    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};



export const deleteImportReceiptapi = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL+`/warehouses/import-receipts/${id}/`, {
      method: "DELETE",
    });

    const data = await response.json();
    console.log("delete"+data)
    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};




// ImportReceiptDetail fetch API

export const getImportReceiptDetailListsapi = async (): Promise<ApiResponse<ImportReceiptDetail[]>> => {
  try {
    const response = await fetch(BASE_URL+"/warehouses/import-receipt-detail-list/");
    const data = await response.json();
    console.log(data)
    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: [],
      errorMessage: error.message || "Internal server error",
    };
  }
};

export const getImportReceiptDetailapi = async (
  id: string
): Promise<ApiResponse<ImportReceiptDetail>> => {
  try {

    // Gọi API lấy thông tin chi tiết của kho
    const response = await fetch(`${BASE_URL}/warehouses/import-receipt-detail-list/${id}/`);
    const data = await response.json();

    // Trả về dữ liệu nếu thành công
    console.log(data);
    return {
      statuscode: 200,
      status: "success",
      data: data,
      errorMessage: null,
    };
  } catch (error: any) {
    // Xử lý lỗi và trả về response lỗi
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};

export const addImportReceiptDetailapi = async (
  newImportReceiptDetail: ImportReceiptDetail
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL + "/warehouses/import-receipt-details/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Đảm bảo Content-Type là application/json
      },
      body: JSON.stringify(newImportReceiptDetail), // Gửi dữ liệu dưới dạng JSON
    });

    // Kiểm tra nếu phản hồi có mã trạng thái 2xx (thành công)
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json(); // Chuyển phản hồi sang JSON
    return data; // Trả về dữ liệu phản hồi
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};



export const updateImportReceiptDetailapi = async (
  id: string,
  updatedImportReceiptDetail: ImportReceiptDetail
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL+`/warehouses/import-receipt-details/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedImportReceiptDetail),
    });

    const data = await response.json();

    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};



export const deleteImportReceiptDetailapi = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL+`/warehouses/import-receipt-details/${id}/`, {
      method: "DELETE",
    });

    const data = await response.json();
    console.log("delete"+data)
    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};


// Medicine fetch API

export const getMedicineListsapi = async (): Promise<ApiResponse<Medicine[]>> => {
  try {
    const response = await fetch(BASE_URL+"/warehouses/medicine-list/");
    const data = await response.json();
    console.log(data)
    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: [],
      errorMessage: error.message || "Internal server error",
    };
  }
};

export const getMedicineDetailapi = async (
  id: string
): Promise<ApiResponse<Medicine>> => {
  try {

    // Gọi API lấy thông tin chi tiết của kho
    const response = await fetch(`${BASE_URL}/warehouses/medicine-list/${id}/`);
    const data = await response.json();

    // Trả về dữ liệu nếu thành công
    console.log(data);
    return {
      statuscode: 200,
      status: "success",
      data: data,
      errorMessage: null,
    };
  } catch (error: any) {
    // Xử lý lỗi và trả về response lỗi
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};

export const addMedicineapi = async (
  newMedicine: Medicine
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL + "/warehouses/medicines/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Đảm bảo Content-Type là application/json
      },
      body: JSON.stringify(newMedicine), // Gửi dữ liệu dưới dạng JSON
    });

    // Kiểm tra nếu phản hồi có mã trạng thái 2xx (thành công)
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json(); // Chuyển phản hồi sang JSON
    return data; // Trả về dữ liệu phản hồi
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};



export const updateMedicineapi = async (
  id: string,
  updatedMedicine: Medicine
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL+`/warehouses/medicines/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMedicine),
    });

    const data = await response.json();

    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};



export const deleteMedicineapi = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL+`/warehouses/medicines/${id}/`, {
      method: "DELETE",
    });

    const data = await response.json();
    console.log("delete"+data)
    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};



// Patient fetch API

export const getPatientListsapi = async (): Promise<ApiResponse<Patient[]>> => {
  try {
    const response = await fetch(BASE_URL+"/prescriptions/patient-list/");
    const data = await response.json();
    console.log(data)
    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: [],
      errorMessage: error.message || "Internal server error",
    };
  }
};

export const getPatientDetailapi = async (
  id: string
): Promise<ApiResponse<Patient>> => {
  try {

    // Gọi API lấy thông tin chi tiết của kho
    const response = await fetch(`${BASE_URL}/prescriptions/patient-list/${id}/`);
    const data = await response.json();

    // Trả về dữ liệu nếu thành công
    console.log(data);
    return {
      statuscode: 200,
      status: "success",
      data: data,
      errorMessage: null,
    };
  } catch (error: any) {
    // Xử lý lỗi và trả về response lỗi
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};

export const addPatientapi = async (
  newPatient: Patient
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL + "/prescriptions/patients/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Đảm bảo Content-Type là application/json
      },
      body: JSON.stringify(newPatient), // Gửi dữ liệu dưới dạng JSON
    });

    // Kiểm tra nếu phản hồi có mã trạng thái 2xx (thành công)
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json(); // Chuyển phản hồi sang JSON
    return data; // Trả về dữ liệu phản hồi
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};



export const updatePatientapi = async (
  id: string,
  updatedPatient: Patient
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL+`/prescriptions/patients/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPatient),
    });

    const data = await response.json();

    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};



export const deletePatientapi = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(BASE_URL+`/prescriptions/patients/${id}/`, {
      method: "DELETE",
    });

    const data = await response.json();
    console.log("delete"+data)
    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};