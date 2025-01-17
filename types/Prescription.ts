type PrescriptionDetail = {
  id: number;
  prescription: number;
  medicine: number;
  medicine_name: string;
  quantity: number;
  usage_instruction: string;
};

type Prescription = {
  id: number;
  patient: number;
  doctor: number;
  diagnosis: string;
  prescription_date: string; 
  instruction: string;
  details: PrescriptionDetail[]; // Array of PrescriptionDetail objects
};
