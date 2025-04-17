
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '-';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-';
  
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  
  return format(dateObject, 'dd/MM/yyyy');
}
