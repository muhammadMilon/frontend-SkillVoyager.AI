import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Milestone {
  id: number;
  phase: string;
  title: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'locked';
  tasks?: string[];
  linkTo?: string;
}

const milestones: Milestone[] = [
  {
    id: 1,
    phase: 'Phase 1',
    title: 'Foundations',
    duration: 'Weeks 1–4 • Completed',
    status: 'completed',
    tasks: ['✓ HTML & CSS Mastery', '✓ JavaScript Fundamentals', '✓ Git & GitHub'],
  },
  {
    id: 2,
    phase: 'Phase 2',
    title: 'Frontend',
    duration: 'Weeks 5–12 • In progress',
    status: 'in-progress',
    linkTo: '/roadmaps/milestone-detail',
  },
  {
    id: 3,
    phase: 'Phase 3',
    title: 'Backend',
    duration: 'Weeks 13–20 • Locked',
    status: 'locked',
  },
];

const Roadmap: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
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

  const getMilestoneStyles = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-emerald-500',
          border: 'border-emerald-200 dark:border-emerald-800',
          bg: 'bg-emerald-50/50 dark:bg-emerald-900/20',
        };
      case 'in-progress':
        return {
          circle: 'bg-indigo-500',
          border: 'border-slate-200 dark:border-slate-700',
          bg: '',
        };
      case 'locked':
        return {
          circle: 'bg-slate-300 dark:bg-slate-600',
          border: 'border-slate-200 dark:border-slate-700',
          bg: '',
          opacity: 'opacity-75',
        };
      default:
        return {
          circle: '',
          border: '',
          bg: '',
        };
    }
  };

  return (
    <div className="min-h-screen  bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              SkillVoyager.AI
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/roadmaps/my-roadmaps"
                className="text-indigo-600 dark:text-indigo-400 font-semibold"
              >
                My Roadmaps
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header Card */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-700 dark:to-indigo-900 text-white p-8 mb-8">
          <h2 className="text-3xl font-bold mb-2">Full Stack Developer Roadmap</h2>
          <p className="text-indigo-100 mb-4">6-month journey</p>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-sm opacity-90">Progress</span>
              <div className="flex items-center gap-2">
                <div className="w-40 h-2 bg-white/30 rounded-full">
                  <div className="h-2 rounded-full bg-white" style={{ width: '35%' }} />
                </div>
                <span className="font-semibold">35%</span>
              </div>
            </div>
            <div>
              <span className="text-sm opacity-90">Milestones</span>
              <p className="font-semibold">8 / 24 completed</p>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6">
          <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-100">Learning Path</h3>
          <div className="space-y-6">
            {milestones.map((milestone) => {
              const styles = getMilestoneStyles(milestone.status);
              return (
                <div key={milestone.id} className="flex gap-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full ${styles.circle} flex items-center justify-center text-white font-bold`}
                  >
                    {milestone.status === 'completed' ? '✓' : milestone.id}
                  </div>
                  <div
                    className={`flex-1 rounded-lg border ${styles.border} ${styles.bg} ${styles.opacity || ''} p-4`}
                  >
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">
                      {milestone.phase}: {milestone.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{milestone.duration}</p>
                    {milestone.tasks && (
                      <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                        {milestone.tasks.map((task, index) => (
                          <li key={index}>{task}</li>
                        ))}
                      </ul>
                    )}
                    {milestone.linkTo && (
                      <Link
                        to={milestone.linkTo}
                        className="text-indigo-600 dark:text-indigo-400 text-sm font-medium"
                      >
                        View milestone →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
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

export default Roadmap;
