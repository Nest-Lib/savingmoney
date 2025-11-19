import React from 'react';
import { Transaction, TransactionType, ExpenseCategory, IncomeCategory, Currency } from '../types';
import EmptyState from './EmptyState';
import { formatCurrency } from '../utils/formatters';
import { EXPENSE_CATEGORY_ICONS, INCOME_CATEGORY_ICONS } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  allMonthTransactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  onAddFirstTransaction: () => void;
  currency: Currency;
}

const CategoryIcon = ({ category, type }: { category: ExpenseCategory | IncomeCategory | null, type: TransactionType }) => {
  if (type === TransactionType.INCOME) {
    if (category && (category in INCOME_CATEGORY_ICONS)) {
      return <span className="text-2xl" role="img" aria-label={category}>{INCOME_CATEGORY_ICONS[category as IncomeCategory]}</span>;
    }
    return <span className="text-2xl" role="img" aria-label="income">💵</span>; // Fallback for old data or uncategorized income
  }

  // Handle Expense
  if (category && (category in EXPENSE_CATEGORY_ICONS)) {
    return <span className="text-2xl" role="img" aria-label={category}>{EXPENSE_CATEGORY_ICONS[category as ExpenseCategory]}</span>;
  }
  return <span className="text-2xl" role="img" aria-label="other">📎</span>; // Fallback for uncategorized expense
};


const FirstTransactionEmptyStateIcon = () => (
    <svg className="mx-auto h-20 w-20 text-slate-300 dark:text-slate-600" width="80" height="80" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
      <path d="M12 11h-1v4h1" />
      <path d="M12 11v-1a1 1 0 0 1 1 -1h1" />
      <path d="M12 11a1 1 0 0 1 -1 1h-1" />
      <path d="M14 15l-2 -2" />
    </svg>
);
const NoResultsEmptyStateIcon = () => (
     <svg className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);


const TransactionList: React.FC<TransactionListProps> = ({ transactions, allMonthTransactions, onDeleteTransaction, onEditTransaction, totalIncome, totalExpense, balance, onAddFirstTransaction, currency }) => {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (allMonthTransactions.length === 0) {
    return (
        <EmptyState 
            icon={<FirstTransactionEmptyStateIcon />}
            title="Start tracking your finances!"
            message="Add your first transaction to see it appear here. Get a clear view of your spending and saving habits from day one."
            actionText="Add Your First Transaction"
            onActionClick={onAddFirstTransaction}
        />
    );
  }
  
  const visibleTransactions = sortedTransactions.slice(0, 10);

  return (
    <>
      {visibleTransactions.length > 0 ? (
        <ul className="space-y-3">
          {visibleTransactions.map((transaction) => (
            <li
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.01] hover:bg-slate-100 dark:hover:bg-slate-700/50"
              aria-label={`Transaction: ${transaction.description}, amount ${transaction.amount}`}
            >
              {/* Left side: Icon, Description, Meta */}
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <CategoryIcon category={transaction.category} type={transaction.type} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{transaction.description}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    {transaction.category && <span className="mx-1">•</span>}
                    {transaction.category && (
                      <span>
                        {transaction.type === TransactionType.INCOME
                          ? INCOME_CATEGORY_ICONS[transaction.category as IncomeCategory]
                          : EXPENSE_CATEGORY_ICONS[transaction.category as ExpenseCategory]}{' '}
                        {transaction.category}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Right side: Amount, Type, Actions */}
              <div className="flex items-center space-x-4 ml-4">
                <div className="text-right">
                  <p className={`font-bold text-lg ${transaction.type === TransactionType.INCOME ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {transaction.type === TransactionType.INCOME ? '+' : '-'}
                    {formatCurrency(transaction.amount, currency)}
                  </p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize mt-1 ${
                      transaction.type === TransactionType.INCOME ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                    }`}>
                    {transaction.type}
                  </span>
                </div>
                <div className="flex items-center text-slate-400 dark:text-slate-500">
                  <button
                    onClick={() => onEditTransaction(transaction)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-3 transition-colors"
                    aria-label={`Edit transaction ${transaction.description}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full p-3 transition-colors"
                    aria-label={`Delete transaction ${transaction.description}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState 
            icon={<NoResultsEmptyStateIcon />}
            title="No Matching Transactions"
            message="Try adjusting your search or category filter to find what you're looking for."
        />
      )}
      {allMonthTransactions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 text-md font-bold">
            <div className="flex items-center space-x-4">
                <span className="text-slate-600 dark:text-slate-300">Monthly Totals:</span>
                <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Income: </span>
                    <span className="text-green-600 dark:text-green-400">{formatCurrency(totalIncome, currency)}</span>
                </div>
                <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Expense: </span>
                    <span className="text-red-600 dark:text-red-400">{formatCurrency(totalExpense, currency)}</span>
                </div>
            </div>
            <div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Net Balance: </span>
                <span className={balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}>{formatCurrency(balance, currency)}</span>
            </div>
        </div>
      )}
    </>
  );
};

export default TransactionList;