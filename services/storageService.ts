
import { Transaction } from '../types';

const TRANSACTIONS_KEY = 'financial_tracker_transactions';

export const getTransactions = (): Transaction[] => {
  try {
    const transactionsJson = localStorage.getItem(TRANSACTIONS_KEY);
    return transactionsJson ? JSON.parse(transactionsJson) : [];
  } catch (error) {
    console.error('Failed to parse transactions from localStorage', error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions to localStorage', error);
  }
};
