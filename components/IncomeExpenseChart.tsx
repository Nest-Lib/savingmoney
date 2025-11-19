import React from 'react';
import EmptyState from './EmptyState';
import { Currency } from '../types';
import { formatCurrency } from '../utils/formatters';

interface IncomeExpenseChartProps {
  income: number;
  expense: number;
  currency: Currency;
}

const ChartIcon = () => (
    <svg className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);


const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ income, expense, currency }) => {
  const total = Math.max(income, expense, 1); // Avoid division by zero and ensure there's a bar even for 0
  const incomeHeight = income > 0 ? Math.max((income / total) * 100, 5) : 0; // Minimum height of 5% if > 0
  const expenseHeight = expense > 0 ? Math.max((expense / total) * 100, 5) : 0;

  if (income === 0 && expense === 0) {
      return (
        <EmptyState 
            icon={<ChartIcon />}
            title="No Data to Compare"
            message="Add income and expense transactions to see a comparison."
        />
      );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full h-56 flex justify-around items-end gap-4 sm:gap-8 pt-8" aria-label="Income vs Expense bar chart">
          {/* Income Bar */}
          <div className="flex flex-col items-center flex-1 max-w-[6rem] relative h-full">
              <div 
                className="absolute -top-1 text-center transition-opacity duration-500 ease-out"
                style={{ opacity: income > 0 ? 1 : 0 }}
              >
                  <p className="font-bold text-green-600 dark:text-green-400 text-sm">{formatCurrency(income, currency)}</p>
              </div>
              <div className="h-full w-full flex items-end">
                <div 
                  className="w-full bg-green-200 dark:bg-green-500/30 rounded-t-lg transition-all duration-500 ease-out"
                  style={{ height: `${incomeHeight}%` }}
                  aria-label={`Income bar, value ${income}`}
                 ></div>
              </div>
              <p className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400">Income</p>
          </div>
          {/* Expense Bar */}
          <div className="flex flex-col items-center flex-1 max-w-[6rem] relative h-full">
              <div 
                className="absolute -top-1 text-center transition-opacity duration-500 ease-out"
                style={{ opacity: expense > 0 ? 1 : 0 }}
               >
                  <p className="font-bold text-red-600 dark:text-red-400 text-sm">{formatCurrency(expense, currency)}</p>
              </div>
              <div className="h-full w-full flex items-end">
                  <div 
                    className="w-full bg-red-200 dark:bg-red-500/30 rounded-t-lg transition-all duration-500 ease-out"
                    style={{ height: `${expenseHeight}%` }}
                    aria-label={`Expense bar, value ${expense}`}
                  ></div>
              </div>
              <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">Expense</p>
          </div>
      </div>
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center px-4">
          A visual comparison of your total income and expenses for the selected month.
      </div>
    </div>
  );
};

export default IncomeExpenseChart;