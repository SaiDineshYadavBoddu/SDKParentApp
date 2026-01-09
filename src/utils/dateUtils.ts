/**
 * Formats a date string to MM/DD/YYYY
 * @param dateString Date string in formats like YYYY-MM-DD or YYYY-MM-DD HH:mm:ss
 * @returns Formatted date string or original if invalid
 */
export const formatToMMDDYYYY = (dateString: string | undefined | null): string => {
  if (!dateString) return '-';
  
  try {
    // Check if it's already in a valid date format
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  } catch (error) {
    return dateString;
  }
};
