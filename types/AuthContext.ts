import { isLoading } from "expo-font";

export interface User {
    token: string;
    username: string;
    role: string;
    employee_id: string;
    image: string | null;
}

export interface AuthContextType {
    user: User | null;
    setUser: (user: User) => Promise<void>;
    logout: () => Promise<void>;
    isLoggedIn: () => boolean; 
    getToken: () => string | null;
    login: (username: string, password: string) => Promise<{ data: any; error: string | null }>;
    isLoading: boolean;
}
