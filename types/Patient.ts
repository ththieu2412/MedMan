import { Gender } from "@/utils/genderTypes";
import { formatDate } from "@/utils/formatDate";

export interface Patient{
    id: number;
    full_name: string;
    date_of_birth: string;
    gender: boolean;
    id_card: string;
    phone_number: string;
    address: string;
    email: string;
    registration_date: string;
    employee_id: Int16Array;
    insurance: number;
}