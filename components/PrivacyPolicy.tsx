
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
        <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>
          At FinanceTracker, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our application.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6">1. Data Collection</h2>
        <p>
          FinanceTracker is designed with privacy in mind. The data you enter (transactions, budgets, recurring items) is stored locally on your device using LocalStorage. We do not transmit your financial data to any external servers for storage.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6">2. AI Features</h2>
        <p>
          To provide features like "Financial Tips," non-personal, contextual data may be processed by our AI provider (Google Gemini). We strive to minimize the data sent and anonymize it where possible.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6">3. Cookies and Local Storage</h2>
        <p>
          We use local storage to persist your preferences (such as theme and currency) and your application data. We do not use tracking cookies for advertising purposes.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6">4. Your Rights</h2>
        <p>
          Since your data is stored on your device, you have full control over it. You can clear your browser data to remove all information associated with FinanceTracker.
        </p>
        
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6">5. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at support@financetracker.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
