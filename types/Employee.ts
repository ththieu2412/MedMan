import { Gender } from "@/utils/genderTypes";

export interface Employee {
    id: number;
    full_name: string;
    date_of_birth: string;
    gender: Gender;
    id_card: string;
    phone_number: string;
    address: string;
    email: string;
    image: string;
    is_active: 0 | 1;
}