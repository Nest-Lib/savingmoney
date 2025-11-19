
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, ExpenseCategory, IncomeCategory } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, EXPENSE_CATEGORY_ICONS, INCOME_CATEGORY_ICONS } from '../constants';
import Spinner from './Spinner';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>, id: string) => void;
  transaction: Transaction | null;
  isSaving: boolean;
  onShowNotification: (message: string, type: 'error') => void;
}

const formatDateForInput = (isoDate: string) => new Date(isoDate).toISOString().split('T')[0];

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ isOpen, onClose, onSave, transaction, isSaving, onShowNotification }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<ExpenseCategory | IncomeCategory>(ExpenseCategory.FOOD);

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setDate(formatDateForInput(transaction.date));
      if (transaction.category) {
        setCategory(transaction.category);
      } else {
        // Fallback for older data that might not have a category for income
        if (transaction.type === TransactionType.INCOME) {
          setCategory(IncomeCategory.SALARY);
        } else {
          setCategory(ExpenseCategory.FOOD);
        }
      }
    }
  }, [transaction]);
  
  const { isFormInvalid, tooltipMessage } = useMemo(() => {
    const numericAmount = parseFloat(amount);
    if (!description.trim() || isNaN(numericAmount) || numericAmount <= 0 || !date) {
        return { 
            isFormInvalid: true, 
            tooltipMessage: "Please fill out all required fields with valid values." 
        };
    }
    return { isFormInvalid: false, tooltipMessage: "" };
  }, [description, amount, date]);


  if (!isOpen || !transaction) return null;
  
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === TransactionType.INCOME) {
      setCategory(IncomeCategory.SALARY);
    } else {
      setCategory(ExpenseCategory.FOOD);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) {
        onShowNotification(tooltipMessage, 'error');
        return;
    }
    const numericAmount = parseFloat(amount);

    onSave({
      description,
      amount: numericAmount,
      type,
      category,
      date: new Date(date + 'T12:00:00Z').toISOString(),
    }, transaction.id);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-70 z-50 flex justify-center items-center transition-opacity duration-300" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <h2 id="modal-title" className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Edit Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Description</label>
            <input
              type="text"
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Groceries, Paycheck"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-amount" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Amount</label>
              <input
                type="number"
                id="edit-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="edit-date" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Date</label>
              <input
                  type="date"
                  id="edit-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-type" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Type</label>
              <select
                id="edit-type"
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
                  <label htmlFor="edit-category" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Category</label>
                  <select
                    id="edit-category"
                    value={category || ''}
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
                <label htmlFor="edit-category" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Category</label>
                <select
                  id="edit-category"
                  value={category || ''}
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
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors"
            >
              Cancel
            </button>
            <div className="relative group">
                {isFormInvalid && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 text-xs font-medium text-white bg-slate-700 dark:bg-slate-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        {tooltipMessage}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-700 dark:border-t-slate-900"></div>
                    </div>
                )}
                <button
                  type="submit"
                  disabled={isSaving || isFormInvalid}
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex justify-center items-center min-w-[130px] transform transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                >
                  {isSaving ? <Spinner /> : 'Save Changes'}
                </button>
            </div>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EditTransactionModal;
