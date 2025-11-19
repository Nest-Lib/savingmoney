
import { ExpenseCategory, IncomeCategory, Currency } from './types';

export const INCOME_CATEGORY_ICONS: Record<IncomeCategory, string> = {
  [IncomeCategory.SALARY]: '💼',
  [IncomeCategory.FREELANCE]: '💻',
  [IncomeCategory.BUSINESS]: '📈',
  [IncomeCategory.INVESTMENT]: '💰',
  [IncomeCategory.RENTAL]: '🏘️',
  [IncomeCategory.GIFT]: '🎁',
  [IncomeCategory.BONUS]: '🎉',
  [IncomeCategory.REFUND]: '↩️',
  [IncomeCategory.OTHER]: '💵',
};

export const EXPENSE_CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD]: '🍔',
  [ExpenseCategory.TRANSPORT]: '🚗',
  [ExpenseCategory.BILLS]: '🧾',
  [ExpenseCategory.SHOPPING]: '🛍️',
  [ExpenseCategory.ENTERTAINMENT]: '🎬',
  [ExpenseCategory.HEALTHCARE]: '⚕️',
  [ExpenseCategory.EDUCATION]: '🎓',
  [ExpenseCategory.HOUSING]: '🏠',
  [ExpenseCategory.INSURANCE]: '🛡️',
  [ExpenseCategory.GIFTS]: '🎁',
  [ExpenseCategory.TRAVEL]: '✈️',
  [ExpenseCategory.PETS]: '🐾',
  [ExpenseCategory.PERSONAL_CARE]: '🧴',
  [ExpenseCategory.SUBSCRIPTIONS]: '🔁',
  [ExpenseCategory.OTHER]: '📎',
};

export const INCOME_CATEGORIES: IncomeCategory[] = [
  IncomeCategory.SALARY,
  IncomeCategory.FREELANCE,
  IncomeCategory.BUSINESS,
  IncomeCategory.INVESTMENT,
  IncomeCategory.RENTAL,
  IncomeCategory.GIFT,
  IncomeCategory.BONUS,
  IncomeCategory.REFUND,
  IncomeCategory.OTHER,
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  ExpenseCategory.FOOD,
  ExpenseCategory.TRANSPORT,
  ExpenseCategory.BILLS,
  ExpenseCategory.SHOPPING,
  ExpenseCategory.ENTERTAINMENT,
  ExpenseCategory.HEALTHCARE,
  ExpenseCategory.EDUCATION,
  ExpenseCategory.HOUSING,
  ExpenseCategory.INSURANCE,
  ExpenseCategory.GIFTS,
  ExpenseCategory.TRAVEL,
  ExpenseCategory.PETS,
  ExpenseCategory.PERSONAL_CARE,
  ExpenseCategory.SUBSCRIPTIONS,
  ExpenseCategory.OTHER,
];

export const SUPPORTED_CURRENCIES: { code: Currency, name: string, symbol: string }[] = [
    { code: 'USD', name: 'United States Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH' },
];