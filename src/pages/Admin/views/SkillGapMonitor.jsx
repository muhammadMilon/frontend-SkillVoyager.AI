import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, TrendingUp, TrendingDown, BarChart3, Users } from 'lucide-react';
import { fadeUp, stagger, StatCard } from '../Shared';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Filler, Legend);

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const SkillGapMonitor = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/user`);
        const data = await res.json();
        setUsers(data.users || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const topGaps = [
    { skill: 'System Design', users: 842, trend: '+12%', severity: 'high' },
    { skill: 'Cloud Architecture', users: 756, trend: '+8%', severity: 'high' },
    { skill: 'Machine Learning Ops', users: 621, trend: '+15%', severity: 'medium' },
    { skill: 'DevOps & CI/CD', users: 534, trend: '-3%', severity: 'medium' },
    { skill: 'Data Engineering', users: 489, trend: '+5%', severity: 'low' },
    { skill: 'Cybersecurity', users: 412, trend: '+22%', severity: 'high' },
    { skill: 'Blockchain Dev', users: 287, trend: '-8%', severity: 'low' },
  ];

  const stats = [
    { label: 'Users Analyzed', value: String(users.length || 0), grow: '+12%', color: 'blue', icon: <Users size={16} /> },
    { label: 'Top Skill Gap', value: 'Sys Design', grow: '+Critical', color: 'purple', icon: <Brain size={16} /> },
    { label: 'Avg Gap Score', value: '34%', grow: '+Improving', color: 'indigo', icon: <Target size={16} /> },
    { label: 'Accuracy Rate', value: '94.2%', grow: '+Stable', color: 'green', icon: <BarChart3 size={16} /> },
  ];

  const trendChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'System Design', data: [65, 72, 68, 80, 85, 84], borderColor: '#818cf8', backgroundColor: 'rgba(99,102,241,0.05)', fill: true, tension: 0.4, pointRadius: 3 },
      { label: 'Cloud Arch', data: [55, 58, 65, 70, 72, 76], borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.05)', fill: true, tension: 0.4, pointRadius: 3 },
      { label: 'ML Ops', data: [40, 45, 50, 55, 58, 62], borderColor: '#f472b6', backgroundColor: 'rgba(244,114,182,0.05)', fill: true, tension: 0.4, pointRadius: 3 },
    ],
  };

  const gapRadar = {
    labels: ['Frontend', 'Backend', 'DevOps', 'AI/ML', 'Data', 'Security'],
    datasets: [
      { label: 'Market Demand', data: [85, 90, 78, 95, 82, 88], backgroundColor: 'rgba(99,102,241,0.15)', borderColor: '#818cf8', borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#818cf8' },
      { label: 'User Skill Level', data: [72, 65, 45, 55, 50, 35], backgroundColor: 'rgba(239,68,68,0.1)', borderColor: '#f87171', borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#f87171' },
    ],
  };

  const gapBarData = {
    labels: topGaps.map(g => g.skill),
    datasets: [{ label: 'Users with Gap', data: topGaps.map(g => g.users), backgroundColor: topGaps.map(g => g.severity === 'high' ? 'rgba(239,68,68,0.6)' : g.severity === 'medium' ? 'rgba(250,204,21,0.6)' : 'rgba(99,102,241,0.6)'), borderRadius: 8, borderSkipped: false }],
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(4,8,16,0.95)', titleColor: '#818cf8', bodyColor: '#e2e8f0', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, padding: 12 } },
    scales: { x: { grid: { display: false }, ticks: { color: 'rgba(148,163,184,0.4)', font: { size: 10 } } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(148,163,184,0.3)', font: { size: 10 } } } },
  };

  if (loading) {
    return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:400 }}><div style={{ textAlign:'center' }}><div style={{ width:32, height:32, border:'3px solid rgba(255,255,255,0.1)', borderTopColor:'#818cf8', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} /><div className="mlabel">Analyzing Skill Gaps...</div></div></div>;
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        {stats.map((s, i) => <StatCard key={i} stat={s} />)}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <motion.div variants={fadeUp} className="acard" style={{ padding:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <TrendingUp size={15} color="#818cf8" />
            <span style={{ fontSize:14, fontWeight:700, color:'white' }}>Skill Gap Trends Over Time</span>
          </div>
          <div style={{ display:'flex', gap:14, marginBottom:14 }}>
            {[{ l:'System Design', c:'#818cf8' }, { l:'Cloud Arch', c:'#a855f7' }, { l:'ML Ops', c:'#f472b6' }].map((v,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:v.c }} />
                <span style={{ fontSize:10, color:'rgba(148,163,184,0.5)' }}>{v.l}</span>
              </div>
            ))}
          </div>
          <div style={{ height:220 }}><Line data={trendChartData} options={chartOpts} /></div>
        </motion.div>

        <motion.div variants={fadeUp} className="acard" style={{ padding:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <Target size={15} color="#818cf8" />
            <span style={{ fontSize:14, fontWeight:700, color:'white' }}>Demand vs Skill Level</span>
          </div>
          <div style={{ height:260 }}>
            <Radar data={gapRadar} options={{
              responsive:true, maintainAspectRatio:false,
              scales: { r: { grid:{ color:'rgba(255,255,255,0.06)' }, angleLines:{ color:'rgba(255,255,255,0.06)' }, pointLabels:{ color:'rgba(148,163,184,0.6)', font:{size:11} }, ticks:{display:false}, suggestedMin:0, suggestedMax:100 } },
              plugins: { legend:{ position:'bottom', labels:{ color:'rgba(148,163,184,0.6)', font:{size:10}, padding:12, boxWidth:10 } } },
            }} />
          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="acard" style={{ padding:'28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
          <BarChart3 size={15} color="#818cf8" />
          <span style={{ fontSize:14, fontWeight:700, color:'white' }}>Top Skill Gaps by Users Affected</span>
        </div>
        <div style={{ height:250 }}><Bar data={gapBarData} options={{ ...chartOpts, indexAxis:'y' }} /></div>
      </motion.div>

      <motion.div variants={fadeUp} className="acard" style={{ padding:'28px' }}>
        <div className="sect-title" style={{ marginBottom:16 }}>Gap Details</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {topGaps.map((g, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderRadius:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.055)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:8, height:8, borderRadius:2, background: g.severity==='high'?'#f87171':g.severity==='medium'?'#facc15':'#818cf8' }} />
                <span style={{ fontSize:13, fontWeight:600, color:'white' }}>{g.skill}</span>
                <span className="badge-slate" style={{ textTransform:'capitalize' }}>{g.severity}</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <span style={{ fontSize:12, color:'rgba(148,163,184,0.5)' }}>{g.users} users</span>
                <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:11, fontWeight:600, color: g.trend.startsWith('+')?'#f87171':'#34d399' }}>
                  {g.trend.startsWith('+') ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {g.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SkillGapMonitor;
