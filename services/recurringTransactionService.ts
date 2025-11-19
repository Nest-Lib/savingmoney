import { RecurringTransaction } from '../types';

const RECURRING_TRANSACTIONS_KEY = 'financial_tracker_recurring_transactions';

export const getRecurringTransactions = (): RecurringTransaction[] => {
  try {
    const transactionsJson = localStorage.getItem(RECURRING_TRANSACTIONS_KEY);
    return transactionsJson ? JSON.parse(transactionsJson) : [];
  } catch (error) {
    console.error('Failed to parse recurring transactions from localStorage', error);
    return [];
  }
};

export const saveRecurringTransactions = (transactions: RecurringTransaction[]): void => {
  try {
    localStorage.setItem(RECURRING_TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save recurring transactions to localStorage', error);
  }
};
