import { Gender } from "@/utils/genderTypes";
import { Role } from "@/utils/Role";

export interface Employee {
    id: number;
    full_name: string;
    date_of_birth: string;
    gender: boolean;
    id_card: string;
    phone_number: string;
    address: string;
    email: string;
    image: string;
    is_active: 0 | 1;
    role: Role;
}