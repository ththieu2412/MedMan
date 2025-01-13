import { useAuth } from '@/context/AuthContext';

export const useToken = (): string | null => {
  const { user } = useAuth();
  return user?.token || null;
};
