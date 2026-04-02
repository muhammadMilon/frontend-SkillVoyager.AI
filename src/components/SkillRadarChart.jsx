// src/components/Dashboard/SkillRadarChart.jsx
import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Brain } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const SkillRadarChart = ({ skillsData }) => {
  // skillsData example format (backend থেকে আসবে):
  // { "React": 85, "Node.js": 60, "Python": 40, "UI/UX": 25, "Git": 90 }

  const data = {
    labels: Object.keys(skillsData || {}),
    datasets: [
      {
        label: 'Your Skill Strength',
        data: Object.values(skillsData || {}),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
      },
      {
        label: 'Target Level',
        data: Array(Object.keys(skillsData || {}).length).fill(80), // target 80%
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.6)',
        borderDash: [5, 5],
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#e2e8f0', font: { size: 14 } },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: '#c084fc',
        bodyColor: '#e2e8f0',
      },
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(226, 232, 240, 0.1)' },
        grid: { color: 'rgba(226, 232, 240, 0.1)' },
        pointLabels: { color: '#cbd5e1', font: { size: 12 } },
        ticks: { color: '#94a3b8', backdropColor: 'transparent' },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="w-full h-[400px] sm:h-[500px] lg:h-[550px] bg-slate-900/40 backdrop-blur-md rounded-2xl border border-indigo-500/20 p-4 sm:p-6 pb-14 sm:pb-20 shadow-xl relative">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-4 flex items-center gap-2">
        <Brain size={18} className="text-indigo-400" /> Skill Strength Radar
      </h3>
      <div className="relative h-[220px] sm:h-[320px]">
        <Radar data={data} options={{
          ...options,
          scales: {
            r: {
              ...options.scales.r,
              pointLabels: {
                ...options.scales.r.pointLabels,
                font: { size: window.innerWidth < 640 ? 10 : 12 }
              }
            }
          }
        }} />
      </div>
     
    </div>
  );
};

export default SkillRadarChart;