import { format } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'dd/MM/yyyy');
};
