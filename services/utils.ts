// src/utils.ts

/**
 * Hàm định dạng ngày theo kiểu DD/MM/YYYY
 * @param date - Chuỗi ngày hoặc đối tượng Date
 * @returns Chuỗi định dạng DD/MM/YYYY
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
