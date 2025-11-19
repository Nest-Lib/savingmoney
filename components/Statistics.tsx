
import React, { useMemo } from 'react';
import { Transaction, TransactionType, ExpenseCategory, Currency } from '../types';
import { formatCurrency } from '../utils/formatters';
import StatCard from './StatCard';
import { EXPENSE_CATEGORY_ICONS } from '../constants';

// Icons for StatCards
const AvgDailyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LargestExpenseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const TopCategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16v4m-2-2h4m5 11v4m-2-2h4M12 3v18" /></svg>;
const SavingsRateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

interface StatisticsProps {
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  selectedMonth: Date;
  currency: Currency;
}

const Statistics: React.FC<StatisticsProps> = ({ transactions, totalIncome, totalExpense, selectedMonth, currency }) => {

  const stats = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);

    // 1. Average Daily Spending
    const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
    const averageDailySpending = totalExpense > 0 ? totalExpense / daysInMonth : 0;

    // 2. Largest Expense
    const largestExpense = expenseTransactions.length > 0
      ? expenseTransactions.reduce((max, t) => t.amount > max.amount ? t : max)
      : null;

    // 3. Top Spending Category
    let topCategory: { name: string; amount: number } = { name: 'N/A', amount: 0 };
    if (expenseTransactions.length > 0) {
        const categoryTotals: Partial<Record<ExpenseCategory, number>> = {};
        expenseTransactions.forEach((t) => {
            if (t.category && t.type === TransactionType.EXPENSE) {
                categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
            }
        });

        if (Object.keys(categoryTotals).length > 0) {
            const topCatEntry = Object.entries(categoryTotals).reduce((a, b) => ((a[1] || 0) > (b[1] || 0)) ? a : b);
            if (topCatEntry) {
                topCategory = { name: topCatEntry[0], amount: topCatEntry[1] || 0 };
            }
        }
    }

    // 4. Savings Rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return { averageDailySpending, largestExpense, topCategory, savingsRate };
  }, [transactions, totalIncome, totalExpense, selectedMonth]);

  const topCategoryDisplay = stats.topCategory.name !== 'N/A' 
    ? (
        <span className="flex items-center gap-2">
            <span>{EXPENSE_CATEGORY_ICONS[stats.topCategory.name as ExpenseCategory]}</span>
            <span className="truncate">{stats.topCategory.name}</span>
        </span>
      )
    : 'N/A';

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20">
      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">Monthly Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard 
            icon={<AvgDailyIcon />}
            title="Avg. Daily Spend"
            value={formatCurrency(stats.averageDailySpending, currency)}
        />
        <StatCard 
            icon={<LargestExpenseIcon />}
            title="Largest Expense"
            value={stats.largestExpense ? formatCurrency(stats.largestExpense.amount, currency) : 'N/A'}
            subValue={stats.largestExpense ? stats.largestExpense.description : undefined}
        />
        <StatCard 
            icon={<TopCategoryIcon />}
            title="Top Category"
            value={topCategoryDisplay}
            subValue={stats.topCategory.name !== 'N/A' ? formatCurrency(stats.topCategory.amount, currency) : undefined}
        />
        <StatCard 
            icon={<SavingsRateIcon />}
            title="Savings Rate"
            value={`${stats.savingsRate.toFixed(1)}%`}
            subValue={totalIncome > 0 ? `Saved ${formatCurrency(totalIncome - totalExpense, currency)}` : undefined}
        />
      </div>
    </div>
  );
};

export default Statistics;
