import React from 'react';
import { RecurringTransaction, TransactionType, ExpenseCategory, IncomeCategory, Currency } from '../types';
import { EXPENSE_CATEGORY_ICONS, INCOME_CATEGORY_ICONS } from '../constants';
import { formatCurrency } from '../utils/formatters';
import EmptyState from './EmptyState';

interface RecurringPageProps {
  recurringTransactions: RecurringTransaction[];
  onDelete: (id: string) => void;
  currency: Currency;
}

const RecurringEmptyStateIcon = () => (
    <svg className="mx-auto h-20 w-20 text-slate-300 dark:text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691v4.992h-4.992" />
    </svg>
);

const getDayWithSuffix = (day: number) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
        case 1: return `${day}st`;
        case 2: return `${day}nd`;
        case 3: return `${day}rd`;
        default: return `${day}th`;
    }
};

const RecurringPage: React.FC<RecurringPageProps> = ({ recurringTransactions, onDelete, currency }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-6">Recurring Transactions</h2>
        {recurringTransactions.length > 0 ? (
            <div className="space-y-4">
                {recurringTransactions.map(rt => (
                    <div key={rt.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{rt.description}</p>
                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-3">
                                <span className={`font-bold ${rt.type === TransactionType.INCOME ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {formatCurrency(rt.amount, currency)}
                                </span>
                                {rt.category && <span className="hidden sm:inline">•</span>}
                                {rt.category && (
                                    <span className="hidden sm:flex items-center space-x-1">
                                        <span>{rt.type === TransactionType.INCOME ? INCOME_CATEGORY_ICONS[rt.category as IncomeCategory] : EXPENSE_CATEGORY_ICONS[rt.category as ExpenseCategory]}</span>
                                        <span>{rt.category}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center mt-3 sm:mt-0 sm:ml-4">
                            <div className="text-center sm:text-right mr-4">
                                <p className="font-semibold text-slate-700 dark:text-slate-300">
                                    Every month on the
                                </p>
                                <p className="font-bold text-indigo-600 dark:text-indigo-400">{getDayWithSuffix(rt.dayOfMonth)}</p>
                            </div>
                            <button
                                onClick={() => onDelete(rt.id)}
                                className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full p-3 transition-colors"
                                aria-label={`Delete recurring transaction ${rt.description}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
             <div className="py-12">
                <EmptyState
                    icon={<RecurringEmptyStateIcon />}
                    title="No Recurring Transactions"
                    message="Create recurring transactions for things like rent, subscriptions, or your monthly salary to automate your tracking."
                />
            </div>
        )}
    </div>
  );
};

export default RecurringPage;
