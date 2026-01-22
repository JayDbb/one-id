import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a TRN (Tax Registration Number) with dashes
 * Example: "123456789" -> "123-456-789"
 */
export function formatTRN(trn: string | number | undefined | null): string {
  if (!trn) return "";
  
  // Convert to string and remove any existing dashes or spaces
  const cleaned = String(trn).replace(/[-\s]/g, "");
  
  // If it's not a valid number string, return as is
  if (!/^\d+$/.test(cleaned)) {
    return String(trn);
  }
  
  // Format as 123-123-123 (groups of 3)
  return cleaned.match(/.{1,3}/g)?.join("-") || cleaned;
}