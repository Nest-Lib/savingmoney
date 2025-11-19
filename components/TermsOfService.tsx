
import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">Terms of Service</h1>
      <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
        <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

        <p>
          Welcome to FinanceTracker. By accessing or using our website and application, you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6">1. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or software) on FinanceTracker's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6">2. Disclaimer</h2>
        <p>
          The materials on FinanceTracker's website are provided on an 'as is' basis. FinanceTracker makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6">3. Limitations</h2>
        <p>
          In no event shall FinanceTracker or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FinanceTracker's website.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6">4. Accuracy of Materials</h2>
        <p>
          The materials appearing on FinanceTracker's website could include technical, typographical, or photographic errors. FinanceTracker does not warrant that any of the materials on its website are accurate, complete, or current.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6">5. Modifications</h2>
        <p>
          FinanceTracker may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
