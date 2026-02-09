/**
 * Formats a string or number amount into integer and decimal parts.
 * @param amount The amount to format.
 * @returns An object containing the integer and decimal parts.
 */
export const formatAmount = (amount: string | number) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return { integer: '0', decimal: '.00' };

  const [integerPart, decimalPart] = numAmount.toFixed(2).split('.');

  // Add commas to integer part
  const integer = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimal = decimalPart ? `.${decimalPart}` : '.00';

  return { integer, decimal };
};
