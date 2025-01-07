export interface Prescription {
    id: number;
    diagnosis: string;
    prescription_date: string;
    instruction: string;
    doctor: {
        id: number;
        full_name: string;
    }
    patient: {
        id: number;
        full_name: string;
    }
}