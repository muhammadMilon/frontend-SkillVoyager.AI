import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Bug, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { fadeUp, stagger, StatCard } from '../Shared';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const ReportsFeedback = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/tickets`);
        const data = await res.json();
        setTickets(Array.isArray(data) ? data : (data.tickets || []));
      } catch (e) {
        console.error('Tickets fetch error:', e);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const feedbackCount = tickets.filter(t => t.type === 'feedback' || !t.type).length;
  const bugCount = tickets.filter(t => t.type === 'bug').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const avgRating = tickets.length > 0 ? (tickets.reduce((s, t) => s + (t.rating || 4), 0) / tickets.length).toFixed(1) : '0';

  const stats = [
    { label: 'Total Feedback', value: String(feedbackCount), grow: '+8%', color: 'blue', icon: <MessageSquare size={16} /> },
    { label: 'Bug Reports', value: String(bugCount), grow: bugCount > 5 ? '+Alert' : 'Stable', color: 'purple', icon: <Bug size={16} /> },
    { label: 'Resolved', value: String(resolvedCount), grow: '+14%', color: 'green', icon: <CheckCircle2 size={16} /> },
    { label: 'Avg Rating', value: `${avgRating}/5`, grow: '+Stable', color: 'indigo', icon: <Star size={16} /> },
  ];

  const filtered = filter === 'all' ? tickets : tickets.filter(t => (t.type || 'feedback') === filter);

  const ratingDistribution = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [{
      data: [
        tickets.filter(t => (t.rating || 4) === 5).length,
        tickets.filter(t => (t.rating || 4) === 4).length,
        tickets.filter(t => (t.rating || 4) === 3).length,
        tickets.filter(t => (t.rating || 4) === 2).length,
        tickets.filter(t => (t.rating || 4) === 1).length,
      ],
      backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(99,102,241,0.8)', 'rgba(250,204,21,0.8)', 'rgba(249,115,22,0.8)', 'rgba(239,68,68,0.8)'],
      borderColor: '#040810',
      borderWidth: 2,
    }],
  };

  const categoryBarData = {
    labels: ['UI/UX', 'Performance', 'Features', 'AI Quality', 'Other'],
    datasets: [{
      label: 'Reports',
      data: [12, 8, 15, 6, 4],
      backgroundColor: 'rgba(99,102,241,0.6)',
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const statusColor = (status) => {
    if (status === 'resolved' || status === 'closed') return { bg: 'rgba(16,185,129,0.1)', bd: 'rgba(16,185,129,0.2)', tx: '#34d399' };
    if (status === 'in-progress') return { bg: 'rgba(250,204,21,0.1)', bd: 'rgba(250,204,21,0.2)', tx: '#facc15' };
    return { bg: 'rgba(99,102,241,0.1)', bd: 'rgba(99,102,241,0.2)', tx: '#818cf8' };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#818cf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <div className="mlabel">Loading Reports...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {stats.map((s, i) => <StatCard key={i} stat={s} />)}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <motion.div variants={fadeUp} className="acard" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Star size={15} color="#facc15" />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Rating Distribution</span>
          </div>
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={ratingDistribution} options={{
              responsive: true, maintainAspectRatio: false, cutout: '60%',
              plugins: { legend: { position: 'right', labels: { color: 'rgba(148,163,184,0.6)', font: { size: 10 }, padding: 10, boxWidth: 10 } }, tooltip: { backgroundColor: 'rgba(4,8,16,0.95)', bodyColor: '#e2e8f0' } },
            }} />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="acard" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Bug size={15} color="#f87171" />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Reports by Category</span>
          </div>
          <div style={{ height: 220 }}>
            <Bar data={categoryBarData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(4,8,16,0.95)', bodyColor: '#e2e8f0' } },
              scales: { x: { grid: { display: false }, ticks: { color: 'rgba(148,163,184,0.4)', font: { size: 10 } } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(148,163,184,0.3)', font: { size: 10 } } } },
            }} />
          </div>
        </motion.div>
      </div>

      {/* Feedback List */}
      <motion.div variants={fadeUp} className="acard" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div className="sect-title">Feedback & Reports</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'feedback', 'bug'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: '1px solid',
                background: filter === f ? 'rgba(99,102,241,0.15)' : 'transparent',
                borderColor: filter === f ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.07)',
                color: filter === f ? '#a5b4fc' : 'rgba(148,163,184,0.4)',
                fontFamily: 'Inter, sans-serif', textTransform: 'capitalize',
              }}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(148,163,184,0.3)', fontSize: 13 }}>No reports found</div>
          ) : filtered.slice(0, 15).map((ticket, i) => {
            const sc = statusColor(ticket.status);
            return (
              <motion.div key={ticket._id || i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.055)', transition: 'border-color 0.2s' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: ticket.type === 'bug' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)', border: `1px solid ${ticket.type === 'bug' ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {ticket.type === 'bug' ? <Bug size={14} color="#f87171" /> : <MessageSquare size={14} color="#818cf8" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{ticket.subject || ticket.title || 'Untitled'}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 99, background: sc.bg, border: `1px solid ${sc.bd}`, fontSize: 9, fontWeight: 600, color: sc.tx, textTransform: 'capitalize' }}>{ticket.status || 'open'}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)', lineHeight: 1.6, marginBottom: 6 }}>{ticket.message?.substring(0, 120) || ticket.description?.substring(0, 120) || 'No details provided.'}{(ticket.message?.length > 120 || ticket.description?.length > 120) ? '...' : ''}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="mlabel" style={{ fontSize: 9 }}>{ticket.userEmail || ticket.email || 'Anonymous'}</span>
                    <span className="mlabel" style={{ fontSize: 9 }}>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Recent'}</span>
                    {ticket.rating && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#facc15' }}>
                        <Star size={10} fill="#facc15" /> {ticket.rating}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportsFeedback;
