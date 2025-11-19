import { Budgets } from '../types';

const BUDGETS_KEY_PREFIX = 'financial_tracker_budgets_';

const getMonthKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() is 0-indexed
    return `${BUDGETS_KEY_PREFIX}${year}-${month.toString().padStart(2, '0')}`;
}

export const getBudgets = (date: Date): Budgets => {
  try {
    const key = getMonthKey(date);
    const budgetsJson = localStorage.getItem(key);
    return budgetsJson ? JSON.parse(budgetsJson) : {};
  } catch (error) {
    console.error('Failed to parse budgets from localStorage', error);
    return {};
  }
};

export const saveBudgets = (date: Date, budgets: Budgets): void => {
  try {
    const key = getMonthKey(date);
    localStorage.setItem(key, JSON.stringify(budgets));
  } catch (error) {
    console.error('Failed to save budgets to localStorage', error);
  }
};
