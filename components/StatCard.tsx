
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | React.ReactNode;
  subValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subValue }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex items-start space-x-3 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{title}</p>
        <p className="text-lg font-bold text-slate-800 dark:text-slate-200 truncate">{value}</p>
        {subValue && <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{subValue}</p>}
      </div>
    </div>
  );
};

export default StatCard;
