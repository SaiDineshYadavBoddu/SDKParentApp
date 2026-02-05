export const formatPhoneNumber = (phone?: string) => {
    if (!phone) return '';
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    // Take the last 9 digits
    const last9 = cleaned.slice(-9);
    
    // Check if we have at least 9 digits to format
    if (last9.length === 9) {
      // Format as +971-XXX-XXX-XXX
      // Group 1: 3 digits (e.g. 567)
      // Group 2: 3 digits (e.g. 334)
      // Group 3: 3 digits (e.g. 000)
      return `+971-${last9.slice(0, 3)}-${last9.slice(3, 6)}-${last9.slice(6)}`;
    }
    
    return phone;
  };