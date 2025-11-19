
import React from 'react';
import { Currency } from '../types';
import { SUPPORTED_CURRENCIES } from '../constants';

interface SettingsPageProps {
    currentCurrency: Currency;
    onCurrencyChange: (newCurrency: Currency) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentCurrency, onCurrencyChange }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-6">Settings</h2>

            <div className="space-y-6">
                {/* Currency Setting */}
                <div>
                    <label htmlFor="currency-select" className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        Currency
                    </label>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                        Choose the currency to be displayed throughout the application.
                    </p>
                    <select
                        id="currency-select"
                        value={currentCurrency}
                        onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                        className="w-full md:w-1/2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
                    >
                        {SUPPORTED_CURRENCIES.map(currency => (
                            <option key={currency.code} value={currency.code}>
                                {currency.code} - {currency.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Add more settings sections here in the future */}

            </div>
        </div>
    );
};

export default SettingsPage;
