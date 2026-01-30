/**
 * Formats a string or number amount into integer and decimal parts.
 * @param amount The amount to format.
 * @returns An object containing the integer and decimal parts.
 */
export const formatAmount = (amount: string | number) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const [integer, decimal] = (isNaN(numAmount) ? '0.00' : numAmount.toFixed(2)).split('.');
  return { integer, decimal: decimal ? `.${decimal}` : '.00' };
};
