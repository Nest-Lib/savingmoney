
import React from 'react';
import { Currency } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  currency: Currency;
}

const typeStyles = {
  income: {
    bg: 'bg-green-100 dark:bg-green-900/50',
    text: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-200 dark:bg-green-800/60',
  },
  expense: {
    bg: 'bg-red-100 dark:bg-red-900/50',
    text: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-200 dark:bg-red-800/60',
  },
  balance: {
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    text: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-200 dark:bg-blue-800/60',
  },
};

const Icons: Record<SummaryCardProps['type'], React.ReactNode> = {
    income: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 6v1m6-3h-1m-10 0H7" /></svg>
    ),
    expense: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 6v1m6-3h-1m-10 0H7" /></svg>
    ),
    balance: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 6h12l3-6H3zM5 9l-2 5h18l-2-5" /></svg>
    ),
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type, currency }) => {
  const styles = typeStyles[type];
  const formattedAmount = formatCurrency(amount, currency);

  return (
    <div className={`p-5 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 flex items-center space-x-4 ${styles.bg} transition-transform duration-200 hover:-translate-y-1`}>
      <div className={`p-3 rounded-full ${styles.iconBg} ${styles.text}`}>
        {Icons[type]}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className={`text-2xl font-bold ${styles.text}`}>{formattedAmount}</p>
      </div>
    </div>
  );
};

export default SummaryCard;