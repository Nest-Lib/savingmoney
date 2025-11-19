import React from 'react';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    message: string;
    actionText?: string;
    onActionClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, actionText, onActionClick }) => {
    return (
        <div className="text-center py-10 px-6">
            <div className="mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{message}</p>
            {actionText && onActionClick && (
                <div className="mt-6">
                    <button
                        onClick={onActionClick}
                        className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                    >
                        {actionText}
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmptyState;
