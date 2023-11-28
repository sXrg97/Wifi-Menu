import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(restaurantName: string) {
  const sanitizedString = restaurantName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters (except spaces and hyphens)
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-{2,}/g, '-')    // Replace consecutive hyphens with a single hyphen
    .trim();

  return sanitizedString;
}

export function jsonify(data: any) {
  return JSON.parse(JSON.stringify(data));
}