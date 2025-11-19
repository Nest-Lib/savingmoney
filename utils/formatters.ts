
import { Currency } from '../types';

export const formatCurrency = (amount: number, currency: Currency): string => {
  return new Intl.NumberFormat(undefined, { // Use user's locale for number formatting
    style: 'currency',
    currency: currency,
  }).format(amount);
};
