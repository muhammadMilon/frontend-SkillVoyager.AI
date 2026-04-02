import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, TrendingUp, Activity, Target, BarChart3, Route } from 'lucide-react';
import { fadeUp, stagger, StatCard } from '../Shared';

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, RadialLinearScale,
  Title, Tooltip, Filler, Legend
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, RadialLinearScale,
  Title, Tooltip, Filler, Legend
);

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const AIAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, roadmapsRes] = await Promise.all([
          fetch(`${API_BASE}/api/user`).then(r => r.json()).catch(() => ({ users: [] })),
          fetch(`${API_BASE}/api/roadmap/all`).then(r => r.json()).catch(() => []),
        ]);
        setAiData({
          totalUsers: usersRes?.users?.length || 0,
          totalRoadmaps: Array.isArray(roadmapsRes) ? roadmapsRes.length : (roadmapsRes?.roadmaps?.length || 0),
        });
      } catch (e) {
        console.error('AI Analytics fetch error:', e);
        setAiData({ totalUsers: 0, totalRoadmaps: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'AI Generations', value: aiData?.totalRoadmaps?.toLocaleString() || '...', grow: '+18%', color: 'purple', icon: <Brain size={16} /> },
    { label: 'Skill Scans', value: String(Math.floor((aiData?.totalUsers || 0) * 1.4)), grow: '+24%', color: 'indigo', icon: <Target size={16} /> },
    { label: 'Avg Latency', value: '320ms', grow: '+Stable', color: 'green', icon: <Activity size={16} /> },
    { label: 'Token Throughput', value: '1.2M', grow: '+8%', color: 'blue', icon: <Zap size={16} /> },
  ];

  const usageChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Roadmap Generations',
        data: [120, 190, 300, 500, 420, 680, 850],
        borderColor: '#818cf8',
        backgroundColor: 'rgba(99,102,241,0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#040810',
        pointBorderColor: '#818cf8',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Skill Gap Analyses',
        data: [80, 150, 220, 350, 310, 500, 620],
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168,85,247,0.06)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#040810',
        pointBorderColor: '#a855f7',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const modelDistribution = {
    labels: ['Roadmap Gen', 'Skill Analysis', 'Quiz Generation', 'Mentor Chat', 'Recommendations'],
    datasets: [{
      data: [35, 25, 20, 12, 8],
      backgroundColor: [
        'rgba(99,102,241,0.8)',
        'rgba(168,85,247,0.8)',
        'rgba(59,130,246,0.8)',
        'rgba(16,185,129,0.8)',
        'rgba(245,200,66,0.8)',
      ],
      borderColor: '#040810',
      borderWidth: 2,
    }],
  };

  const performanceRadar = {
    labels: ['Speed', 'Accuracy', 'Relevance', 'Creativity', 'Depth', 'Clarity'],
    datasets: [{
      label: 'Gemini 2.0 Performance',
      data: [92, 88, 95, 78, 85, 90],
      backgroundColor: 'rgba(99,102,241,0.15)',
      borderColor: '#818cf8',
      borderWidth: 2,
      pointBackgroundColor: '#818cf8',
      pointBorderColor: '#040810',
      pointBorderWidth: 2,
      pointRadius: 4,
    }],
  };

  const weeklyBarData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'API Calls',
      data: [1200, 1900, 1400, 2200, 1800, 900, 600],
      backgroundColor: 'rgba(99,102,241,0.6)',
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(4,8,16,0.95)',
        titleColor: '#818cf8',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: 'rgba(148,163,184,0.4)', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(148,163,184,0.3)', font: { size: 10 } } },
    },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#818cf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <div className="mlabel">Loading AI Analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {stats.map((s, i) => <StatCard key={i} stat={s} />)}
      </div>

      {/* Usage Over Time + Model Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14 }}>
        <motion.div variants={fadeUp} className="acard" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <TrendingUp size={15} color="#818cf8" />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>AI Usage Over Time</span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            {[
              { label: 'Roadmap Generations', color: '#818cf8' },
              { label: 'Skill Gap Analyses', color: '#a855f7' },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.5)', fontWeight: 500 }}>{l.label}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 220 }}>
            <Line data={usageChartData} options={chartDefaults} />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="acard" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <BarChart3 size={15} color="#818cf8" />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Model Usage Distribution</span>
          </div>
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={modelDistribution} options={{
              responsive: true, maintainAspectRatio: false,
              cutout: '65%',
              plugins: {
                legend: { position: 'bottom', labels: { color: 'rgba(148,163,184,0.6)', font: { size: 10 }, padding: 12, boxWidth: 10 } },
                tooltip: { backgroundColor: 'rgba(4,8,16,0.95)', titleColor: '#818cf8', bodyColor: '#e2e8f0' },
              },
            }} />
          </div>
        </motion.div>
      </div>

      {/* Radar + Weekly Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <motion.div variants={fadeUp} className="acard" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Brain size={15} color="#818cf8" />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Gemini Performance Radar</span>
          </div>
          <div style={{ height: 260 }}>
            <Radar data={performanceRadar} options={{
              responsive: true, maintainAspectRatio: false,
              scales: {
                r: {
                  grid: { color: 'rgba(255,255,255,0.06)' },
                  angleLines: { color: 'rgba(255,255,255,0.06)' },
                  pointLabels: { color: 'rgba(148,163,184,0.6)', font: { size: 11 } },
                  ticks: { display: false },
                  suggestedMin: 0, suggestedMax: 100,
                },
              },
              plugins: { legend: { display: false } },
            }} />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="acard" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Activity size={15} color="#818cf8" />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Weekly API Call Volume</span>
          </div>
          <div style={{ height: 260 }}>
            <Bar data={weeklyBarData} options={{
              ...chartDefaults,
              plugins: { ...chartDefaults.plugins, legend: { display: false } },
            }} />
          </div>
        </motion.div>
      </div>

      {/* Insights Cards */}
      <motion.div variants={fadeUp} className="acard" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Zap size={15} color="#facc15" />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>AI Insights</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { title: 'Most Requested Skills', value: 'Generative AI, Cloud, DevOps', icon: <Target size={14} />, color: '#818cf8' },
            { title: 'Peak Usage Hours', value: '7 PM – 11 PM (Local)', icon: <Activity size={14} />, color: '#34d399' },
            { title: 'Avg Roadmap Quality', value: '94.2% Relevance Score', icon: <Route size={14} />, color: '#a855f7' },
          ].map((insight, i) => (
            <div key={i} style={{ padding: '18px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.055)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${insight.color}18`, border: `1px solid ${insight.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: insight.color }}>{insight.icon}</div>
                <span className="mlabel">{insight.title}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white', lineHeight: 1.4 }}>{insight.value}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIAnalytics;
