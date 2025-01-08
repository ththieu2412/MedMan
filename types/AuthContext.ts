export interface User {
    token: string;
    username: string;
    role: string;
    employee_id: string;
    image: string | null;
}

export interface AuthContextType {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}