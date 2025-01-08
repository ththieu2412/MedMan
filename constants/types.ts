import { Float } from "react-native/Libraries/Types/CodegenTypes";

export interface ApiResponse<T> {
  statuscode: number;
  data: T |null;
  status: string;
  errorMessage?: string | null;
}

export interface Medicine {
  id: number;
  medicine_name: string;
  unit: string;
  sale_price: number;
  description?: string | null;
  stock_quantity: number;
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

// ExportReceipt interface
export interface Prescription {
  id: string;
  patient_id: string;
  medication_name: string;
  dosage: string;
  instructions: string;
  patient?: Patient; // Thêm thông tin bệnh nhân nếu cần (tuỳ chọn)
}
interface PrescriptionDetail {
  id: number; 
  quantity: number;
  usage_instruction: string | null; 
  medicine_id: number; 
  prescription_id: number; 
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

export interface ExportReceipt {
  id: number; 
  total_amount: number; 
  export_date: string; 
  employee_id: number; 
  prescription_id: number;
  warehouse_id: number; 
  is_approved: boolean; 
}

interface ExportReceiptDetail {
  id: number;
  quantity: number; 
  price: number; 
  insurance_covered: boolean;
  ins_amount: number; 
  patient_pay: number; 
  export_receipt_id: number;
  medicine_id: number; 
}


interface Account {
  id: number; 
  password: string; 
  username: string; 
  is_active: boolean; 
  role: string; 
  employee_id: number | null; 
}


