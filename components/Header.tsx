
import React, { useState, useEffect } from 'react';

const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}>
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>
);

const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}>
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41zM18 10.5h3v2h-3v-2zm-1.41 7.45l1.79 1.79 1.41-1.41-1.79-1.79zM20 18.5h-2V21h2v-2.5zm-8.5-1.45c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zM12 5.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm-5.24 11.24l1.79-1.79 1.41 1.41-1.79 1.79z" />
    </svg>
);

const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}>
        <g><rect fill="none" height="24" width="24"/></g>
        <g><path d="M11.1,12.08C8.77,7.57,10.6,3.6,11.63,2.01C6.27,2.2,1.98,6.59,1.98,12c0,5.52,4.48,10,10,10c5.52,0,10-4.48,10-10 c0-4.51-2.98-8.31-7.07-9.54C14.15,3.97,13.62,7.74,11.1,12.08z"/></g>
    </svg>
);

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);


interface HeaderProps {
    selectedMonth: Date;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    activePage: string;
    onNavigate: (page: string) => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

const NAV_LINKS = ['Dashboard', 'Transactions', 'Budget', 'Recurring', 'Settings'];

const Header: React.FC<HeaderProps> = ({ selectedMonth, onPreviousMonth, onNextMonth, activePage, onNavigate, theme, onToggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const monthName = selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const isCurrentMonth = () => {
      const today = new Date();
      return selectedMonth.getFullYear() === today.getFullYear() && selectedMonth.getMonth() === today.getMonth();
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavLinkClick = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <>
        <header className="bg-white dark:bg-slate-800 shadow-md shadow-slate-200/50 dark:shadow-black/20 sticky top-0 z-40">
          <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('Dashboard')}>
                  <LogoIcon className="h-8 w-8 text-indigo-600" />
                  <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight whitespace-nowrap">
                    FinanceTracker
                  </h1>
              </div>
              <nav className="hidden md:flex items-center space-x-2">
                {NAV_LINKS.map(link => (
                    <button
                        key={link}
                        onClick={() => onNavigate(link)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                            activePage === link
                            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        {link}
                    </button>
                ))}
              </nav>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
                 {/* Month Selector - Redesigned for prominence */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-700/50 rounded-xl p-1.5 border border-slate-200 dark:border-slate-600 shadow-sm">
                    <button 
                        onClick={onPreviousMonth}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all border border-slate-100 dark:border-slate-700"
                        aria-label="Previous month"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    
                    <div className="px-4 flex items-center justify-center min-w-[160px] group cursor-default">
                        <span className="text-lg font-bold text-slate-900 dark:text-white capitalize tracking-tight">
                            {monthName}
                        </span>
                        <ChevronDownIcon className="h-4 w-4 ml-2 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                    </div>

                    <button 
                        onClick={onNextMonth}
                        disabled={isCurrentMonth()}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all border border-slate-100 dark:border-slate-700 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:shadow-none"
                        aria-label="Next month"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block"></div>

                <button
                    onClick={onToggleTheme}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    aria-label="Toggle dark mode"
                >
                    {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                </button>
            </div>

            <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Open menu">
                    <MenuIcon className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            <div
              className={`absolute top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-xl text-slate-800 dark:text-slate-200">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Close menu">
                  <CloseIcon className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                </button>
              </div>

              <nav className="flex flex-col space-y-2">
                {NAV_LINKS.map(link => (
                  <button
                    key={link}
                    onClick={() => handleNavLinkClick(link)}
                    className={`px-4 py-3 rounded-xl text-base font-semibold text-left transition-all duration-200 ${
                        activePage === link
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {link}
                  </button>
                ))}
              </nav>

              <div className="mt-auto space-y-6">
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <button onClick={onPreviousMonth} className="p-2 rounded-lg bg-white dark:bg-slate-600 shadow-sm text-slate-600 dark:text-slate-200" aria-label="Previous month">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{monthName}</span>
                    <button onClick={onNextMonth} disabled={isCurrentMonth()} className="p-2 rounded-lg bg-white dark:bg-slate-600 shadow-sm text-slate-600 dark:text-slate-200 disabled:opacity-50" aria-label="Next month">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
                
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="text-sm font-semibold ml-2 text-slate-700 dark:text-slate-300">Dark Mode</span>
                    <button
                        onClick={onToggleTheme}
                        className="p-2 rounded-lg bg-white dark:bg-slate-600 shadow-sm text-slate-600 dark:text-slate-200"
                        aria-label="Toggle dark mode"
                    >
                        {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                    </button>
                </div>
              </div>
            </div>
        </div>
    </>
  );
};

export default Header;
