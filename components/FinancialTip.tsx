
import React, { useState, useEffect, useCallback } from 'react';
import { getFinancialTip } from '../services/geminiService';

const FinancialTip: React.FC = () => {
  const [tip, setTip] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTip = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTip = await getFinancialTip();
      setTip(fetchedTip);
    } catch (err) {
      setError('Failed to fetch a new tip.');
      setTip("Remember to review your subscriptions regularly. Unsubscribe from services you no longer use to save money each month!");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTip();
  }, [fetchTip]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Daily Financial Tip</h2>
        <span className="text-3xl" role="img" aria-label="light bulb">💡</span>
      </div>

      <div className="min-h-[6rem] flex items-center">
        {isLoading ? (
          <div className="space-y-3 animate-pulse w-full">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 dark:text-red-400">{error}</p>
        ) : (
          <p className="text-slate-600 dark:text-slate-300 italic">"{tip}"</p>
        )}
      </div>

      <button
        onClick={fetchTip}
        disabled={isLoading}
        className="mt-6 w-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Getting Tip...' : 'Get New Tip'}
      </button>
    </div>
  );
};

export default FinancialTip;