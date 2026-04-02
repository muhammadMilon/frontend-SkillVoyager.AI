import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, DollarSign, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { fadeUp, stagger, StatCard } from '../Shared';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Filler, Legend);

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const TransactionsView = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/transactions`);
        const data = await res.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Transactions fetch error:', e);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.amountPaid || 0), 0);
  const successCount = transactions.filter(t => t.paymentStatus === 'paid').length;
  const failedCount = transactions.filter(t => t.paymentStatus === 'failed').length;

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, grow: '+18%', color: 'green', icon: <DollarSign size={16} /> },
    { label: 'Transactions', value: String(transactions.length), grow: '+12%', color: 'blue', icon: <CreditCard size={16} /> },
    { label: 'Success Rate', value: transactions.length > 0 ? `${Math.round((successCount / transactions.length) * 100)}%` : '0%', grow: '+Stable', color: 'indigo', icon: <CheckCircle2 size={16} /> },
    { label: 'Avg. Order', value: transactions.length > 0 ? `$${Math.round(totalRevenue / transactions.length)}` : '$0', grow: '+5%', color: 'purple', icon: <TrendingUp size={16} /> },
  ];

  const monthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = new Array(12).fill(0);
    transactions.forEach(t => {
      if (t.enrolledAt) {
        const m = new Date(t.enrolledAt).getMonth();
        data[m] += t.amountPaid || 0;
      }
    });
    return { labels: months, datasets: [{ label: 'Revenue', data, borderColor: '#34d399', backgroundColor: 'rgba(16,185,129,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#040810', pointBorderColor: '#34d399', pointRadius: 4 }] };
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(4,8,16,0.95)', titleColor: '#34d399', bodyColor: '#e2e8f0', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, padding: 12 } },
    scales: { x: { grid: { display: false }, ticks: { color: 'rgba(148,163,184,0.4)', font: { size: 10 } } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(148,163,184,0.3)', font: { size: 10 } } } },
  };

  const statusBadge = (status) => {
    if (status === 'paid') return <span className="badge-green"><CheckCircle2 size={9} /> Paid</span>;
    if (status === 'failed') return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:99, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', fontSize:10, fontWeight:600 }}><XCircle size={9} /> Failed</span>;
    return <span className="badge-slate"><Clock size={9} /> Pending</span>;
  };

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:400 }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:32, height:32, border:'3px solid rgba(255,255,255,0.1)', borderTopColor:'#818cf8', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
          <div className="mlabel">Loading Transactions...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        {stats.map((s, i) => <StatCard key={i} stat={s} />)}
      </div>

      {/* Revenue Chart */}
      <motion.div variants={fadeUp} className="acard" style={{ padding:'28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
          <TrendingUp size={15} color="#34d399" />
          <span style={{ fontSize:14, fontWeight:700, color:'white' }}>Revenue Trends</span>
        </div>
        <div style={{ height:220 }}>
          <Line data={monthlyData()} options={chartOptions} />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeUp} className="acard" style={{ padding:'24px 28px 0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <div>
            <div className="sect-title">Payment History</div>
            <div className="sect-sub">{transactions.length} transactions recorded</div>
          </div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="atbl">
            <thead>
              <tr>
                <th>Course</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:'40px 0', color:'rgba(148,163,184,0.3)' }}>No transactions found</td></tr>
              ) : transactions.slice(0, 20).map((t, i) => (
                <motion.tr key={t._id || i} initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay: Math.min(i*0.03, 0.3)}}>
                  <td>
                    <div style={{ fontSize:13, fontWeight:600, color:'white' }}>{t.courseTitle || 'Unknown Course'}</div>
                    <div style={{ fontSize:10, color:'rgba(148,163,184,0.4)', marginTop:2 }}>ID: {t.courseId?.substring(0, 8) || 'N/A'}</div>
                  </td>
                  <td style={{ fontSize:12, color:'rgba(203,213,225,0.7)' }}>{t.userEmail || 'guest'}</td>
                  <td style={{ fontSize:14, fontWeight:700, color:'#34d399' }}>${t.amountPaid || 0}</td>
                  <td>{statusBadge(t.paymentStatus)}</td>
                  <td style={{ fontSize:11, color:'rgba(148,163,184,0.5)' }}>{t.enrolledAt ? new Date(t.enrolledAt).toLocaleDateString() : 'N/A'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ height:1 }} />
      </motion.div>
    </motion.div>
  );
};

export default TransactionsView;
