import { Float } from "react-native/Libraries/Types/CodegenTypes";

// types.ts
// export interface ApiError {
//   message: string; // Thông báo lỗi
//   status: number | null; // Mã trạng thái HTTP, null nếu không có
// }

// export interface ApiResponse<T> {
//   data: T | null; // Dữ liệu trả về từ API
//   error: ApiError | null; // Thông tin về lỗi, null nếu không có lỗi
// }

export interface ApiResponse<T> {
  statuscode: number;
  data: T;
  status: string;
  errorMessage?: string;
}


export interface Patient {
  id: number;
  full_name: string;
  date_of_birth: Date;
  email:string;
  gender:boolean;
  address:string;
  phone_number:string;
  registration_date:Date;
  id_card:string;
  employee:number;
}
export interface Prescription {
  id: string;
  patient_id: string;
  medication_name: string;
  dosage: string;
  instructions: string;
  patient?: Patient; // Thêm thông tin bệnh nhân nếu cần (tuỳ chọn)
}



// Warehouse interface
export interface Warehouse {
  id: number; 
  warehouse_name: string;
  address: string; 
  is_active: boolean;
}

// ImportReceipt interface
export interface ImportReceipt {
  id: number; 
  import_date: string; 
  warehouse: number
  total_amount: number; 
  employee: number;
  is_approved: boolean; 
}

// ImportReceiptDetail interface
export interface ImportReceiptDetail {
  import_receipt: number;
  medicine: number; 
  quantity: number; 
  price: Float;
}

// Employee interface
export interface Employee {
  id: number;
  full_name: string;
  date_of_birth: Date;
  gender:boolean;
  id_card:string;
  phone_number:string;
  address:string;
  email:string;
  image:string;
  is_active:boolean;
}