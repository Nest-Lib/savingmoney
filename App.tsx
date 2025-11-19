
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Transaction, TransactionType, Budgets, ExpenseCategory, Currency, RecurringTransaction } from './types';
import { getTransactions, saveTransactions } from './services/storageService';
import { getBudgets, saveBudgets } from './services/budgetService';
import { getRecurringTransactions, saveRecurringTransactions } from './services/recurringTransactionService';
import Header from './components/Header';
import Footer from './components/Footer';
import SummaryCard from './components/SummaryCard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ExpenseChart from './components/ExpenseChart';
import IncomeExpenseChart from './components/IncomeExpenseChart';
import FinancialTip from './components/FinancialTip';
import ConfirmationModal from './components/ConfirmationModal';
import EditTransactionModal from './components/EditTransactionModal';
import TransactionsPage from './components/TransactionsPage';
import BudgetPage from './components/BudgetPage';
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_ICONS } from './constants';
import SettingsPage from './components/SettingsPage';
import SummaryCardSkeleton from './components/SummaryCardSkeleton';
import Spinner from './components/Spinner';
import Statistics from './components/Statistics';
import RecurringPage from './components/RecurringPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

type Theme = 'light' | 'dark';
type Notification = { message: string; type: 'success' | 'error' };
type AddTransactionPayload = Omit<Transaction, 'id' | 'recurringTransactionId'> & { isRecurring?: boolean; dayOfMonth?: number };


const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [activePage, setActivePage] = useState('Dashboard');
  const [budgets, setBudgets] = useState<Budgets>({});
  const [dashboardCategoryFilter, setDashboardCategoryFilter] = useState<ExpenseCategory | 'all'>('all');
  const [dashboardSearchTerm, setDashboardSearchTerm] = useState('');
  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return (localStorage.getItem('currency') as Currency | null) || 'USD';
    }
    return 'USD';
  });
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedTheme = window.localStorage.getItem('theme') as Theme | null;
        if (storedTheme) return storedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const transactionFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTransactions(getTransactions());
    setRecurringTransactions(getRecurringTransactions());
  }, []);

  useEffect(() => {
    setBudgets(getBudgets(selectedMonth));
  }, [selectedMonth]);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);
  
  useEffect(() => {
    saveRecurringTransactions(recurringTransactions);
  }, [recurringTransactions]);


  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
      setNotification({ message, type });
  }, []);
  
    // Auto-generates recurring transactions for the selected month if they don't exist.
  useEffect(() => {
    if (recurringTransactions.length === 0) return;

    const currentMonth = selectedMonth.getMonth();
    const currentYear = selectedMonth.getFullYear();

    const transactionsToAdd: Transaction[] = [];

    recurringTransactions.forEach(rt => {
      const alreadyExists = transactions.some(t =>
        t.recurringTransactionId === rt.id &&
        new Date(t.date).getFullYear() === currentYear &&
        new Date(t.date).getMonth() === currentMonth
      );

      if (!alreadyExists) {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const day = Math.min(rt.dayOfMonth, daysInMonth);
        // Using UTC to prevent timezone issues from shifting the date
        const transactionDate = new Date(Date.UTC(currentYear, currentMonth, day, 12));

        transactionsToAdd.push({
          id: crypto.randomUUID(),
          description: rt.description,
          amount: rt.amount,
          type: rt.type,
          category: rt.category,
          date: transactionDate.toISOString(),
          recurringTransactionId: rt.id,
        });
      }
    });

    if (transactionsToAdd.length > 0) {
      setTransactions(prev => [...prev, ...transactionsToAdd]);
      showNotification(`${transactionsToAdd.length} recurring transaction(s) added for this month.`);
    }
  }, [selectedMonth, recurringTransactions, transactions, showNotification]);


  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  const changeMonth = useCallback((monthUpdater: (prev: Date) => Date) => {
    setIsLoading(true);
    setTimeout(() => {
        setSelectedMonth(monthUpdater);
        setIsLoading(false);
    }, 500); // Simulate network latency for a better UX
  }, []);

  const handlePreviousMonth = useCallback(() => {
    changeMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, [changeMonth]);

  const handleNextMonth = useCallback(() => {
    changeMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, [changeMonth]);
  
  const handleNavigate = useCallback((page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSaveBudgets = useCallback((newBudgets: Budgets) => {
    saveBudgets(selectedMonth, newBudgets);
    setBudgets(newBudgets);
    showNotification('Budgets saved successfully!');
  }, [selectedMonth, showNotification]);
  
  const handleScrollToForm = useCallback(() => {
    transactionFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleCurrencyChange = useCallback((newCurrency: Currency) => {
    setCurrency(newCurrency);
    showNotification(`Currency changed to ${newCurrency}`);
  }, [showNotification]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === selectedMonth.getFullYear() &&
             transactionDate.getMonth() === selectedMonth.getMonth();
    });
  }, [transactions, selectedMonth]);

  const saveTransaction = useCallback((transactionData: AddTransactionPayload, idToUpdate?: string) => {
    setIsSaving(true);
    setTimeout(() => {
      if (idToUpdate) {
        setTransactions(prev =>
          prev.map(t =>
            t.id === idToUpdate
              ? { ...t, ...transactionData }
              : t
          )
        );
        setTransactionToEdit(null);
        showNotification('Transaction updated successfully!');
      } else {
        const { isRecurring, dayOfMonth, ...newTransactionData } = transactionData;
        if (isRecurring && dayOfMonth && dayOfMonth > 0 && dayOfMonth <= 31) {
            const newRecurringTemplate: RecurringTransaction = {
                id: crypto.randomUUID(),
                description: newTransactionData.description,
                amount: newTransactionData.amount,
                type: newTransactionData.type,
                category: newTransactionData.category,
                dayOfMonth,
            };
            setRecurringTransactions(prev => [...prev, newRecurringTemplate]);

            const currentMonth = selectedMonth.getMonth();
            const currentYear = selectedMonth.getFullYear();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const day = Math.min(dayOfMonth, daysInMonth);
            const transactionDate = new Date(Date.UTC(currentYear, currentMonth, day, 12));

            const newTransaction: Transaction = {
                id: crypto.randomUUID(),
                ...newTransactionData,
                date: transactionDate.toISOString(),
                recurringTransactionId: newRecurringTemplate.id,
            };
            setTransactions(prev => [...prev, newTransaction]);
            showNotification('Recurring transaction created!');
        } else {
             const newTransaction: Transaction = {
                id: crypto.randomUUID(),
                ...newTransactionData,
             };
             setTransactions(prev => [...prev, newTransaction]);
             showNotification('Transaction added successfully!');
        }
      }
      setIsSaving(false);
    }, 500); // Simulate saving delay
  }, [selectedMonth, showNotification]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactionToDelete(id);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (transactionToDelete) {
      setTransactions(prev => prev.filter(t => t.id !== transactionToDelete));
      showNotification('Transaction deleted successfully!');
      setTransactionToDelete(null);
    }
  }, [transactionToDelete, showNotification]);

  const handleCancelDelete = useCallback(() => {
    setTransactionToDelete(null);
  }, []);

  const handleEdit = useCallback((transaction: Transaction) => {
    setTransactionToEdit(transaction);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setTransactionToEdit(null);
  }, []);

  const handleDeleteRecurring = useCallback((id: string) => {
    setRecurringTransactions(prev => prev.filter(rt => rt.id !== id));
    showNotification('Recurring template deleted. Future transactions will not be generated.');
  }, [showNotification]);


  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [filteredTransactions]);
  
  const handleDashboardCategoryFilterChange = useCallback((category: ExpenseCategory | 'all') => {
    setDashboardCategoryFilter(category);
  }, []);
  
  const dashboardTransactions = useMemo(() => {
    let results = filteredTransactions;

    // Apply category filter
    if (dashboardCategoryFilter !== 'all') {
      results = results.filter(t => 
        (t.type === TransactionType.EXPENSE && t.category === dashboardCategoryFilter) || t.type === TransactionType.INCOME
      );
    }
    
    // Apply search filter
    if (dashboardSearchTerm.trim() !== '') {
        results = results.filter(t => 
            t.description.toLowerCase().includes(dashboardSearchTerm.toLowerCase())
        );
    }

    return results;
  }, [filteredTransactions, dashboardCategoryFilter, dashboardSearchTerm]);


  const renderContent = () => {
    if (activePage === 'Dashboard') {
      return (
        <div className="relative">
          {isLoading && (
              <div className="absolute inset-0 bg-slate-50/80 dark:bg-slate-900/80 z-30 flex items-center justify-center rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                      <Spinner size="md" />
                      <span className="font-semibold text-lg">Loading month data...</span>
                  </div>
              </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {isLoading ? (
                  <>
                    <SummaryCardSkeleton />
                    <SummaryCardSkeleton />
                    <SummaryCardSkeleton />
                  </>
                ) : (
                  <>
                    <SummaryCard title="Total Income" amount={totalIncome} type="income" currency={currency} />
                    <SummaryCard title="Total Expense" amount={totalExpense} type="expense" currency={currency} />
                    <SummaryCard title="Balance" amount={balance} type="balance" currency={currency} />
                  </>
                )}
              </div>
               <Statistics 
                  transactions={filteredTransactions}
                  totalIncome={totalIncome}
                  totalExpense={totalExpense}
                  selectedMonth={selectedMonth}
                  currency={currency}
                />
              {/* Transaction Form & List */}
              <div ref={transactionFormRef} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                 <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">Add New Transaction</h2>
                <TransactionForm 
                  onSaveTransaction={(data) => saveTransaction(data)}
                  isSaving={isSaving}
                  onShowNotification={showNotification}
                />
              </div>
               <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Recent Transactions</h2>
                      <div className="flex flex-col sm:flex-row gap-2">
                          <input
                              type="text"
                              placeholder="Search by description..."
                              value={dashboardSearchTerm}
                              onChange={(e) => setDashboardSearchTerm(e.target.value)}
                              className="w-full sm:w-auto px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200 text-sm"
                              aria-label="Search recent transactions"
                          />
                          <select
                              id="category-filter-dashboard"
                              value={dashboardCategoryFilter}
                              onChange={(e) => handleDashboardCategoryFilterChange(e.target.value as ExpenseCategory | 'all')}
                              className="w-full sm:w-auto px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200 text-sm"
                              aria-label="Filter by category"
                          >
                              <option value="all">All Categories</option>
                              {EXPENSE_CATEGORIES.map(cat => (
                                  <option key={cat} value={cat}>{EXPENSE_CATEGORY_ICONS[cat]} {cat}</option>
                              ))}
                          </select>
                      </div>
                  </div>
                <TransactionList 
                  transactions={dashboardTransactions} 
                  allMonthTransactions={filteredTransactions}
                  onDeleteTransaction={deleteTransaction}
                  onEditTransaction={handleEdit}
                  totalIncome={totalIncome}
                  totalExpense={totalExpense}
                  balance={balance}
                  onAddFirstTransaction={handleScrollToForm}
                  currency={currency}
                />
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6 lg:space-y-8">
               {/* Financial Tip */}
               <FinancialTip />

              {/* Charts */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4 text-center">Expense Breakdown</h2>
                <ExpenseChart transactions={filteredTransactions} currency={currency} />
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                 <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4 text-center">Income vs Expense</h2>
                <IncomeExpenseChart income={totalIncome} expense={totalExpense} currency={currency} />
              </div>
            </div>
          </div>
        </div>
      );
    } else if (activePage === 'Transactions') {
      return (
        <TransactionsPage 
          transactions={filteredTransactions}
          onDeleteTransaction={deleteTransaction}
          onEditTransaction={handleEdit}
          selectedMonth={selectedMonth}
          currency={currency}
        />
      );
    } else if (activePage === 'Budget') {
      return (
        <BudgetPage 
          transactions={filteredTransactions}
          budgets={budgets}
          onSaveBudgets={handleSaveBudgets}
          currency={currency}
        />
      );
    } else if (activePage === 'Recurring') {
        return (
            <RecurringPage
                recurringTransactions={recurringTransactions}
                onDelete={handleDeleteRecurring}
                currency={currency}
            />
        );
    } else if (activePage === 'Settings') {
        return (
            <SettingsPage
                currentCurrency={currency}
                onCurrencyChange={handleCurrencyChange}
            />
        );
    } else if (activePage === 'Privacy') {
      return <PrivacyPolicy />;
    } else if (activePage === 'Terms') {
      return <TermsOfService />;
    }
    return (
       <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 text-center">
            <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-200">{activePage}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4">This feature is under construction. Please check back later!</p>
        </div>
    );
  };


  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Header 
        selectedMonth={selectedMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        activePage={activePage}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      
      {notification && (
        <div className={`fixed top-20 right-8 border-l-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 animate-fade-in-down ${
            notification.type === 'success' 
            ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300' 
            : 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
        }`} role="alert">
          <p className="font-bold">{notification.type === 'success' ? 'Success' : 'Error'}</p>
          <p>{notification.message}</p>
        </div>
      )}

      <main className="container mx-auto p-4 md:p-6 lg:p-8 flex-grow">
        {renderContent()}
      </main>

      <Footer onNavigate={handleNavigate} />

      <ConfirmationModal
        isOpen={!!transactionToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
      <EditTransactionModal 
        isOpen={!!transactionToEdit}
        onClose={handleCloseEditModal}
        onSave={saveTransaction}
        transaction={transactionToEdit}
        isSaving={isSaving}
        onShowNotification={showNotification}
      />
      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
