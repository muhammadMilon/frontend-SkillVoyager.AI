import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MilestoneDetail: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check localStorage or system preference
    if (localStorage.getItem('theme') === 'dark') return true;
    if (localStorage.getItem('theme') === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = (): void => {
    setIsDark(!isDark);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              SkillVoyager.AI
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                to="/roadmap" 
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                ← Back to Roadmap
              </Link>
              <button 
                id="themeToggle" 
                type="button" 
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition" 
                aria-label="Toggle theme"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl">
              📐
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Phase 2: Frontend Development
              </h1>
              <p className="text-slate-600 dark:text-slate-400">Weeks 5–12 • In progress</p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Objectives
            </h3>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 mb-6">
              <li>React fundamentals and hooks</li>
              <li>State management (Context API / Redux)</li>
              <li>API integration and data fetching</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Recommended resources
            </h3>
            <div className="space-y-3">
              <Link 
                to="/courses/course-detail" 
                className="block rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:border-indigo-500 dark:hover:border-indigo-400 transition"
              >
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  Advanced React Patterns
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 text-sm ml-2">
                  → View course
                </span>
              </Link>
              <Link 
                to="/courses/course-detail" 
                className="block rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:border-indigo-500 dark:hover:border-indigo-400 transition"
              >
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  REST APIs with React
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 text-sm ml-2">
                  → View course
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex gap-4">
            <button 
              type="button" 
              className="px-6 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 font-semibold transition"
            >
              Mark as complete
            </button>
            <Link 
              to="/skills/quiz" 
              className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
            >
              Take assessment
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>SkillVoyager.AI – Your AI-Powered Learning Journey</p>
      </footer>
    </div>
  );
};

export default MilestoneDetail;
