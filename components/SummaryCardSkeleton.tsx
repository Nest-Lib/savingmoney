
import React from 'react';

const SummaryCardSkeleton: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 flex items-center space-x-4 bg-white dark:bg-slate-800 animate-pulse">
      <div className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 h-12 w-12"></div>
      <div className="w-full space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default SummaryCardSkeleton;
