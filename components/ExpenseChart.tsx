import React, { useState } from 'react';
import { Transaction, TransactionType, ExpenseCategory, Currency } from '../types';
import { EXPENSE_CATEGORIES } from '../constants';
import EmptyState from './EmptyState';
import { formatCurrency } from '../utils/formatters';

interface ExpenseChartProps {
  transactions: Transaction[];
  currency: Currency;
}

const COLORS = [
  '#4f46e5', // indigo-600
  '#0ea5e9', // sky-500
  '#10b981', // emerald-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
];

const getPath = (startAngle: number, endAngle: number, radius: number, innerRadius: number) => {
    // To prevent the arc from closing on itself when it's a full circle
    if (endAngle - startAngle >= 2 * Math.PI - 0.001) {
        endAngle = startAngle + 2 * Math.PI - 0.001;
    }

    const startOuter = {
        x: radius * Math.cos(startAngle),
        y: radius * Math.sin(startAngle),
    };
    const endOuter = {
        x: radius * Math.cos(endAngle),
        y: radius * Math.sin(endAngle),
    };
    const startInner = {
        x: innerRadius * Math.cos(endAngle),
        y: innerRadius * Math.sin(endAngle),
    };
    const endInner = {
        x: innerRadius * Math.cos(startAngle),
        y: innerRadius * Math.sin(startAngle),
    };
    const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';
    
    const d = [
        `M ${startOuter.x} ${startOuter.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
        `L ${startInner.x} ${startInner.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
        'Z'
    ].join(' ');
    
    return d;
}

const ChartIcon = () => (
    <svg className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </svg>
);


const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions, currency }) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
  
  // FIX: Use forEach to build categoryTotals. This avoids potential issues with
  // type inference in the reduce accumulator and ensures that `categoryTotals`
  // and `totalExpense` have the correct numeric types, resolving subsequent type errors.
  const categoryTotals: Partial<Record<ExpenseCategory, number>> = {};
  expenseTransactions.forEach((t) => {
    if (t.category) {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    }
  });

  const totalExpense = Object.values(categoryTotals).reduce((sum, amount) => sum + (amount || 0), 0);

  const chartData = EXPENSE_CATEGORIES.map((category, index) => ({
    name: category,
    value: categoryTotals[category] || 0,
    color: COLORS[index % COLORS.length],
    percentage: totalExpense > 0 ? ((categoryTotals[category] || 0) / totalExpense) * 100 : 0,
  }))
  .filter(item => item.value > 0)
  .sort((a, b) => b.value - a.value);
  
  if (chartData.length === 0) {
     return (
        <EmptyState
            icon={<ChartIcon />}
            title="No Expense Data"
            message="Add some expense transactions to see your breakdown."
        />
     );
  }

  let cumulativeAngle = -Math.PI / 2;
  const activeSegmentData = hoveredSegment ? chartData.find(d => d.name === hoveredSegment) : null;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[200px] mx-auto">
        <svg viewBox="-100 -100 200 200" aria-label="Expense breakdown doughnut chart" className="w-full h-auto">
          {chartData.map((segment) => {
            if (segment.value === 0 || totalExpense === 0) return null;
            const angle = (segment.value / totalExpense) * 2 * Math.PI;
            const isHovered = hoveredSegment === segment.name;
            
            const path = getPath(
              cumulativeAngle, 
              cumulativeAngle + angle,
              isHovered ? 95 : 90, // Outer radius
              isHovered ? 55 : 50  // Inner radius
            );
            cumulativeAngle += angle;

            return (
              <path 
                key={segment.name} 
                d={path} 
                fill={segment.color}
                onMouseEnter={() => setHoveredSegment(segment.name)}
                onMouseLeave={() => setHoveredSegment(null)}
                className="transition-all duration-200 ease-in-out cursor-pointer"
              >
                <title>{`${segment.name}: ${formatCurrency(segment.value, currency)} (${segment.percentage.toFixed(1)}%)`}</title>
              </path>
            );
          })}
          <text textAnchor="middle" dominantBaseline="middle" className="pointer-events-none fill-current">
            {activeSegmentData ? (
              <>
                <tspan x="0" dy="-0.6em" className="text-sm font-semibold text-slate-700 dark:text-slate-300">{activeSegmentData.name}</tspan>
                <tspan x="0" dy="1.3em" className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {activeSegmentData.percentage.toFixed(1)}%
                </tspan>
                 <tspan x="0" dy="1.3em" className="text-xs text-slate-500 dark:text-slate-400">
                  {formatCurrency(activeSegmentData.value, currency)}
                </tspan>
              </>
            ) : (
              <>
                <tspan x="0" dy="-0.5em" className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Expenses</tspan>
                <tspan x="0" dy="1.3em" className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {formatCurrency(totalExpense, currency)}
                </tspan>
              </>
            )}
          </text>
        </svg>
      </div>
      <div className="mt-6 w-full">
        <ul className="space-y-1">
          {chartData.map(item => (
            <li 
              key={item.name} 
              className="flex items-center justify-between text-sm p-1.5 rounded-md transition-colors duration-200"
              onMouseEnter={() => setHoveredSegment(item.name)}
              onMouseLeave={() => setHoveredSegment(null)}
              style={{ backgroundColor: hoveredSegment === item.name ? (document.documentElement.classList.contains('dark') ? '#334155' : '#f1f5f9') : 'transparent' }}
              aria-label={`Legend item for ${item.name}`}
            >
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2.5" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-700 dark:text-slate-200 block">
                  {formatCurrency(item.value, currency)}
                </span>
                 <span className="text-slate-500 dark:text-slate-400 text-xs">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseChart;