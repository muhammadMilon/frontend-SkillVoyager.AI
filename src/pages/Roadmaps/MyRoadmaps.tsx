import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface RoadmapCard {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  progress: number;
  status: 'Active' | 'In progress';
  statusClass: string;
  barClass: string;
}

const roadmapsData: RoadmapCard[] = [
  {
    id: '1',
    icon: '🗺️',
    title: 'Full Stack Developer',
    subtitle: '6-month journey • 35% complete',
    progress: 35,
    status: 'Active',
    statusClass: 'text-emerald-600 dark:text-emerald-400',
    barClass: 'bg-indigo-600 dark:bg-indigo-500',
  },
  {
    id: '2',
    icon: '📊',
    title: 'Data Science',
    subtitle: '1-year path • 18% complete',
    progress: 18,
    status: 'In progress',
    statusClass: 'text-slate-500 dark:text-slate-400',
    barClass: 'bg-emerald-600 dark:bg-emerald-500',
  },
];

const MyRoadmaps: React.FC = () => {
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
              <div className="hidden md:flex gap-6">
                <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Dashboard
                </Link>
                <Link to="/roadmaps/my-roadmaps" className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  My Roadmaps
                </Link>
                <Link to="/courses" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Courses
                </Link>
                <Link to="/community/leaderboard" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Leaderboard
                </Link>
                <Link to="/account/profile" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Profile
                </Link>
              </div>
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">My Roadmaps</h1>
          <Link
            to="/roadmaps/roadmap-generator"
            className="px-4 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 font-medium transition"
          >
            + New Roadmap
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {roadmapsData.map((roadmap) => (
            <Link
              key={roadmap.id}
              to="/roadmap"
              className="block rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 hover:border-indigo-500 dark:hover:border-indigo-400 transition shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{roadmap.icon}</span>
                <span className={`text-sm font-medium ${roadmap.statusClass}`}>{roadmap.status}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{roadmap.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{roadmap.subtitle}</p>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-2 rounded-full ${roadmap.barClass}`}
                  style={{ width: `${roadmap.progress}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>SkillVoyager.AI – Your AI-Powered Learning Journey</p>
      </footer>
    </div>
  );
};

export default MyRoadmaps;
