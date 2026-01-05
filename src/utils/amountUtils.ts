/**
 * Formats a string or number amount into integer and decimal parts.
 * @param amount The amount to format.
 * @returns An object containing the integer and decimal parts.
 */
export const formatAmount = (amount: string | number) => {
  const [integer, decimal] = String(amount).split('.');
  return { integer, decimal: decimal ? `.${decimal}` : '' };
};
