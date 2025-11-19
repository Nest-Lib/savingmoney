import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, ExpenseCategory, Currency, IncomeCategory } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, EXPENSE_CATEGORY_ICONS, INCOME_CATEGORY_ICONS } from '../constants';
import EmptyState from './EmptyState';
import { formatCurrency } from '../utils/formatters';

interface TransactionsPageProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
  selectedMonth: Date;
  currency: Currency;
}

const ITEMS_PER_PAGE = 10;

const NoResultsIcon = () => (
    <svg className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
   </svg>
);


const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, onDeleteTransaction, onEditTransaction, selectedMonth, currency }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleTypeFilterChange = (newType: string) => {
    setTypeFilter(newType);
    setCategoryFilter('all');
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm.trim()) {
      result = result.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (typeFilter !== 'all') {
      result = result.filter(t => t.type === typeFilter);
    }
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'date-desc':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return result;
  }, [transactions, searchTerm, typeFilter, categoryFilter, sortBy]);
  
  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, categoryFilter, sortBy]);
  
  const { totalIncome, totalExpense, netBalance } = useMemo(() => {
    const income = filteredAndSortedTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredAndSortedTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
    };
  }, [filteredAndSortedTransactions]);


  const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedTransactions.length);

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }

    const monthName = selectedMonth.toLocaleString('default', { month: 'long' }).toLowerCase();
    const year = selectedMonth.getFullYear();
    const fileName = `transactions_${monthName}_${year}.csv`;

    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const csvRows = [headers.join(',')];

    transactions.forEach(t => {
      const date = new Date(t.date).toISOString().split('T')[0];
      const type = t.type;
      const category = t.category || 'N/A';
      const description = `"${t.description.replace(/"/g, '""')}"`; // Handle quotes
      const amount = t.amount;
      csvRows.push([date, type, category, description, amount].join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2 sm:mb-0">Monthly Transactions</h2>
        <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors text-sm flex items-center space-x-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>Export CSV</span>
        </button>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-end">
        <div>
            <label htmlFor="search" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Search</label>
            <input
                id="search"
                type="text"
                placeholder="Filter by description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
            />
        </div>
        <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Type</label>
            <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => handleTypeFilterChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
            >
                <option value="all">All Types</option>
                <option value={TransactionType.INCOME}>Income</option>
                <option value={TransactionType.EXPENSE}>Expense</option>
            </select>
        </div>
         <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Category</label>
            <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                disabled={typeFilter === 'all'}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200 disabled:bg-slate-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed"
            >
                {typeFilter === 'all' && <option value="all">Select a type first</option>}
                {typeFilter === 'income' && (
                    <>
                        <option value="all">All Categories</option>
                        {INCOME_CATEGORIES.map(cat => <option key={cat} value={cat}>{INCOME_CATEGORY_ICONS[cat]} {cat}</option>)}
                    </>
                )}
                {typeFilter === 'expense' && (
                    <>
                        <option value="all">All Categories</option>
                        {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{EXPENSE_CATEGORY_ICONS[cat]} {cat}</option>)}
                    </>
                )}
            </select>
        </div>
        <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Sort By</label>
            <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
            >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="amount-desc">Amount (High-Low)</option>
                <option value="amount-asc">Amount (Low-High)</option>
            </select>
        </div>
      </div>

      {filteredAndSortedTransactions.length > 0 ? (
        <>
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Description</th>
                    <th scope="col" className="px-6 py-3">Category</th>
                    <th scope="col" className="px-6 py-3">Type</th>
                    <th scope="col" className="px-6 py-3 text-right">Amount</th>
                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedTransactions.map(t => (
                    <tr key={t.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{t.description}</td>
                        <td className="px-6 py-4">
                          {t.category ? (
                            <span>
                              {t.type === TransactionType.INCOME
                                ? INCOME_CATEGORY_ICONS[t.category as IncomeCategory]
                                : EXPENSE_CATEGORY_ICONS[t.category as ExpenseCategory]}{' '}
                              {t.category}
                            </span>
                          ) : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            t.type === TransactionType.INCOME ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                        }`}>
                            {t.type}
                        </span>
                        </td>
                        <td className={`px-6 py-4 font-bold text-right ${t.type === TransactionType.INCOME ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatCurrency(t.amount, currency)}
                        </td>
                        <td className="px-6 py-4 text-center">
                            <button onClick={() => onEditTransaction(t)} className="font-medium text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 p-2 rounded-full transition-colors duration-200" aria-label={`Edit ${t.description}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg></button>
                            <button onClick={() => onDeleteTransaction(t.id)} className="font-medium text-red-600 hover:text-red-800 dark:hover:text-red-400 p-2 ml-1 rounded-full transition-colors duration-200" aria-label={`Delete ${t.description}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* Filtered Totals Summary */}
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex flex-col sm:flex-row justify-end items-center sm:space-x-6 text-base font-semibold space-y-2 sm:space-y-0">
                <div className="text-slate-600 dark:text-slate-300 font-bold">
                    Filtered Totals:
                </div>
                <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Income: </span>
                    <span className="text-green-600 dark:text-green-400">{formatCurrency(totalIncome, currency)}</span>
                </div>
                <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Expense: </span>
                    <span className="text-red-600 dark:text-red-400">{formatCurrency(totalExpense, currency)}</span>
                </div>
                <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Balance: </span>
                    <span className={netBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}>
                        {formatCurrency(netBalance, currency)}
                    </span>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm gap-4">
                <p className="text-slate-600 dark:text-slate-400">
                    Showing <span className="font-semibold">{startItem}</span> to <span className="font-semibold">{endItem}</span> of <span className="font-semibold">{filteredAndSortedTransactions.length}</span> results
                </p>
                <div className="flex space-x-2">
                    <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    Previous
                    </button>
                    <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    Next
                    </button>
                </div>
                </div>
            )}
        </>
      ) : (
        <div className="py-12">
            <EmptyState 
                icon={<NoResultsIcon />}
                title="No Transactions Found"
                message="Try adjusting your search or filter criteria to find what you're looking for."
            />
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;