
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum IncomeCategory {
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  BUSINESS = 'Business',
  INVESTMENT = 'Investment',
  RENTAL = 'Rental',
  GIFT = 'Gift',
  BONUS = 'Bonus',
  REFUND = 'Refund',
  OTHER = 'Other',
}

export enum ExpenseCategory {
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  BILLS = 'Bills',
  SHOPPING = 'Shopping',
  ENTERTAINMENT = 'Entertainment',
  HEALTHCARE = 'Healthcare',
  EDUCATION = 'Education',
  HOUSING = 'Housing',
  INSURANCE = 'Insurance',
  GIFTS = 'Gifts',
  TRAVEL = 'Travel',
  PETS = 'Pets',
  PERSONAL_CARE = 'Personal Care',
  SUBSCRIPTIONS = 'Subscriptions',
  OTHER = 'Other',
}

export interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory | null;
  dayOfMonth: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory | null;
  date: string;
  recurringTransactionId?: string;
}

export type Budgets = Partial<Record<ExpenseCategory, number | undefined>>;

export type Currency = 'USD' | 'EUR' | 'GBP' | 'MAD';