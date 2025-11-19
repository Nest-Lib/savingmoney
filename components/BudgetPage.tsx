import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, Budgets, ExpenseCategory, TransactionType, Currency } from '../types';
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_ICONS } from '../constants';
import { formatCurrency } from '../utils/formatters';

interface BudgetPageProps {
  transactions: Transaction[];
  budgets: Budgets;
  onSaveBudgets: (newBudgets: Budgets) => void;
  currency: Currency;
}

const BudgetProgressBar: React.FC<{ spent: number, budget: number }> = ({ spent, budget }) => {
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    
    let colorClass = 'bg-green-500';
    if (percentage > 100) {
        colorClass = 'bg-red-500';
    } else if (percentage >= 80) {
        colorClass = 'bg-yellow-500';
    }

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 my-1">
            <div 
                className={`h-3 rounded-full ${colorClass} transition-all duration-500`} 
                style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
        </div>
    );
};


const BudgetPage: React.FC<BudgetPageProps> = ({ transactions, budgets, onSaveBudgets, currency }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableBudgets, setEditableBudgets] = useState<Budgets>(budgets);

    useEffect(() => {
        setEditableBudgets(budgets);
    }, [budgets]);

    const categorySpending = useMemo(() => {
        const spending: Partial<Record<ExpenseCategory, number>> = {};
        transactions
            .filter(t => t.type === TransactionType.EXPENSE && t.category)
            .forEach(t => {
                if(t.category) {
                    spending[t.category] = (spending[t.category] || 0) + t.amount;
                }
            });
        return spending;
    }, [transactions]);

    const totalBudgeted = useMemo(() => Object.values(budgets).reduce((sum: number, budget) => sum + (Number(budget) || 0), 0), [budgets]);
    const totalSpent = useMemo(() => Object.values(categorySpending).reduce((sum: number, spent) => sum + (Number(spent) || 0), 0), [categorySpending]);

    const handleBudgetChange = (category: ExpenseCategory, value: string) => {
        const numericValue = parseFloat(value);
        setEditableBudgets(prev => ({
            ...prev,
            [category]: isNaN(numericValue) ? 0 : numericValue
        }));
    };

    const handleSave = () => {
        onSaveBudgets(editableBudgets);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditableBudgets(budgets);
        setIsEditing(false);
    };
    
    const formattedCurrency = (value: number) => formatCurrency(value, currency);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2 sm:mb-0">Monthly Budget</h2>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                        Edit Budgets
                    </button>
                ) : (
                    <div className="flex space-x-2">
                        <button onClick={handleCancel} className="px-4 py-2 bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                            Save Budgets
                        </button>
                    </div>
                )}
            </div>

            {/* Overall Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Budget</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formattedCurrency(totalBudgeted)}</p>
                </div>
                 <div className="text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Spent</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formattedCurrency(totalSpent)}</p>
                </div>
                 <div className="text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Remaining</p>
                    <p className={`text-2xl font-bold ${totalBudgeted - totalSpent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formattedCurrency(totalBudgeted - totalSpent)}
                    </p>
                </div>
            </div>

            {/* Category Budgets */}
            <div className="space-y-6">
                {EXPENSE_CATEGORIES.map(category => {
                    const spent = categorySpending[category] || 0;
                    const budget = isEditing ? (editableBudgets[category] || 0) : (budgets[category] || 0);
                    const remaining = budget - spent;
                    
                    return (
                        <div key={category} className="border-b border-slate-100 dark:border-slate-700 pb-4 last:border-b-0">
                            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-2">
                                {EXPENSE_CATEGORY_ICONS[category]} {category}
                            </h3>
                            {isEditing ? (
                                <div>
                                    <label htmlFor={`budget-${category}`} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Set Budget</label>
                                    <input
                                        id={`budget-${category}`}
                                        type="number"
                                        value={editableBudgets[category] || ''}
                                        onChange={(e) => handleBudgetChange(category, e.target.value)}
                                        placeholder="0.00"
                                        className="w-full md:w-1/3 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
                                        step="0.01"
                                    />
                                </div>
                            ) : (
                                <div>
                                    {budget > 0 ? (
                                        <>
                                            <BudgetProgressBar spent={spent} budget={budget} />
                                            <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                <span>{formattedCurrency(spent)} of {formattedCurrency(budget)}</span>
                                                <span className={remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                                    {formattedCurrency(remaining)} {remaining >= 0 ? 'left' : 'over'}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">No budget set for this category.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BudgetPage;