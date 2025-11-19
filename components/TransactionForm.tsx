
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, ExpenseCategory, IncomeCategory } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, EXPENSE_CATEGORY_ICONS, INCOME_CATEGORY_ICONS } from '../constants';
import Spinner from './Spinner';

interface TransactionFormProps {
  onSaveTransaction: (transaction: Omit<Transaction, 'id' | 'recurringTransactionId'> & { isRecurring: boolean; dayOfMonth: number; }) => void;
  isSaving: boolean;
  onShowNotification: (message: string, type: 'error') => void;
}

const formatDateForInput = (isoDate: string) => new Date(isoDate).toISOString().split('T')[0];

const TransactionForm: React.FC<TransactionFormProps> = ({ onSaveTransaction, isSaving, onShowNotification }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(formatDateForInput(new Date().toISOString()));
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<ExpenseCategory | IncomeCategory>(ExpenseCategory.FOOD);
  const [isRecurring, setIsRecurring] = useState(false);
  const [dayOfMonth, setDayOfMonth] = useState('15');
  
  const resetForm = () => {
    setDescription('');
    setAmount('');
    setDate(formatDateForInput(new Date().toISOString()));
    setType(TransactionType.EXPENSE);
    setCategory(ExpenseCategory.FOOD);
    setIsRecurring(false);
    setDayOfMonth('15');
  }
  
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === TransactionType.INCOME) {
      setCategory(IncomeCategory.SALARY);
    } else {
      setCategory(ExpenseCategory.FOOD);
    }
  };

  const { isFormInvalid, tooltipMessage } = useMemo(() => {
    const numericAmount = parseFloat(amount);
    const numericDay = parseInt(dayOfMonth, 10);
    if (!description.trim() || isNaN(numericAmount) || numericAmount <= 0 || !date || (isRecurring && (isNaN(numericDay) || numericDay < 1 || numericDay > 31))) {
        return { 
            isFormInvalid: true, 
            tooltipMessage: "Please fill out all required fields with valid values." 
        };
    }
    return { isFormInvalid: false, tooltipMessage: "" };
  }, [description, amount, date, isRecurring, dayOfMonth]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) {
        onShowNotification(tooltipMessage, 'error');
        return;
    }
    const numericAmount = parseFloat(amount);
    const numericDay = parseInt(dayOfMonth, 10);

    onSaveTransaction({
      description,
      amount: numericAmount,
      type,
      category,
      // Store date as UTC to avoid timezone issues
      date: new Date(date + 'T12:00:00Z').toISOString(),
      isRecurring,
      dayOfMonth: numericDay,
    });

    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Groceries, Paycheck"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
          />
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
            step="0.01"
          />
        </div>
        <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Date</label>
            <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
            />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as TransactionType)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
          >
            <option value={TransactionType.INCOME}>Income</option>
            <option value={TransactionType.EXPENSE}>Expense</option>
          </select>
        </div>
        {type === TransactionType.INCOME && (
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as IncomeCategory)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
            >
              {INCOME_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{INCOME_CATEGORY_ICONS[cat]} {cat}</option>
              ))}
            </select>
          </div>
        )}
        {type === TransactionType.EXPENSE && (
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
            >
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{EXPENSE_CATEGORY_ICONS[cat]} {cat}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="pt-2">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Make this a recurring transaction (monthly)
          </span>
        </label>
      </div>

      {isRecurring && (
        <div className="pt-2 animate-fade-in-down">
          <label htmlFor="dayOfMonth" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            Day of Month to Occur
          </label>
          <input
            type="number"
            id="dayOfMonth"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            min="1"
            max="31"
            className="w-full md:w-1/2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
            />
        </div>
        )}

      <div className="pt-2">
          <div className="relative group w-full">
            {isFormInvalid && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 text-xs font-medium text-white bg-slate-700 dark:bg-slate-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                {tooltipMessage}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-700 dark:border-t-slate-900"></div>
              </div>
            )}
            <button
              type="submit"
              disabled={isSaving || isFormInvalid}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex justify-center items-center gap-2 transform transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
            >
              {isSaving ? (
                <Spinner />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  <span>Add Transaction</span>
                </>
              )}
            </button>
          </div>
      </div>
    </form>
  );
};

export default TransactionForm;
