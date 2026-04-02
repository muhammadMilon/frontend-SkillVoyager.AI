import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Target, Zap, CloudLightning, Brain, Users, Route } from 'lucide-react';
import { fadeUp, stagger, StatCard } from '../Shared';
import { useAdminService } from '../../../api/adminService';

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Filler, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const OverviewDashboard = () => {
  const { getDashboardStats } = useAdminService();
  const [stats, setStats] = useState([
    { label:'Total Voyagers', value:'...', grow:'+0%', color:'blue', icon:<Users size={16}/> },
    { label:'Roadmaps Built', value:'...', grow:'+0%', color:'purple', icon:<Route size={16}/> },
    { label:'Skill Gaps Found', value:'...', grow:'+0%', color:'indigo', icon:<Brain size={16}/> },
    { label:'AI Tokens Used', value:'...', grow:'Stable', color:'green', icon:<Zap size={16}/> },
  ]);

  useEffect(() => {
    // In a real scenario, fetch these from getDashboardStats()
    // For now, simulate real data loading to replace the dots
    setTimeout(() => {
      setStats([
        { label:'Total Voyagers', value:'2,482', grow:'+12%', color:'blue', icon:<Users size={16}/> },
        { label:'Roadmaps Built', value:'1,142', grow:'+32%', color:'purple', icon:<Route size={16}/> },
        { label:'Skill Gaps Found', value:'892', grow:'+24%', color:'indigo', icon:<Brain size={16}/> },
        { label:'AI Tokens Used', value:'1.2M', grow:'Stable', color:'green', icon:<Zap size={16}/> },
      ]);
    }, 800);
  }, []);

  const aiStatus = [
    { name:'Gemini 2.0 Flash', status:'Optimal', latency:'120ms', icon:<CloudLightning size={13}/> },
    { name:'Roadmap Generator', status:'Online', latency:'850ms', icon:<Route size={13}/> },
    { name:'Skill Analyzer', status:'Stable', latency:'320ms', icon:<Brain size={13}/> },
  ];

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        fill: true,
        label: 'Roadmap Velocity',
        data: [112, 72, 64, 32, 16, 50, 40],
        borderColor: '#818cf8',
        backgroundColor: 'rgba(99,102,241,0.1)',
        tension: 0.4,
        pointBackgroundColor: '#040810',
        pointBorderColor: '#818cf8',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(4,8,16,0.9)',
        titleColor: '#818cf8',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: 'rgba(148,163,184,0.5)', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { display: false } },
    },
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        {stats.map((s,i) => <StatCard key={i} stat={s} />)}
      </div>

      {/* Chart + AI Engine */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:14 }}>
        {/* Chart */}
        <motion.div variants={fadeUp} className="acard" style={{ padding:'28px 28px', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <TrendingUp size={15} color="#818cf8" />
                <span style={{ fontSize:14, fontWeight:700, color:'white' }}>Roadmap Velocity</span>
              </div>
              <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                <span style={{ fontSize:28, fontWeight:800, color:'white', letterSpacing:'-0.03em', lineHeight:1 }}>1,142</span>
                <span style={{ fontSize:11, fontWeight:600, color:'#34d399', display:'flex', alignItems:'center', gap:3 }}>
                  <TrendingUp size={10} /> +32% this week
                </span>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              {['1D','1W','1M'].map((t,i) => (
                <button key={t} style={{ padding:'4px 10px', borderRadius:7, border:'1px solid', fontSize:10, fontWeight:600, cursor:'pointer', transition:'all 0.15s', background: i===1 ? 'rgba(99,102,241,0.15)' : 'transparent', borderColor: i===1 ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.07)', color: i===1 ? '#a5b4fc' : 'rgba(148,163,184,0.4)' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ position:'relative', height: '100%', minHeight: '160px', flex: 1 }}>
            <Line options={chartOptions} data={chartData} />
          </div>
        </motion.div>

        {/* AI Engine */}
        <motion.div variants={fadeUp} className="acard" style={{ padding:'28px 24px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:22 }}>
            <Activity size={16} color="#818cf8" />
            <span style={{ fontSize:14, fontWeight:700, color:'white' }}>AI Engine Core</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {aiStatus.map((ai,i) => (
              <div key={i}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:7 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <span style={{ color:'rgba(148,163,184,0.5)' }}>{ai.icon}</span>
                    <span style={{ fontSize:11, fontWeight:600, color:'rgba(203,213,225,0.7)' }}>{ai.name}</span>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, color: ai.status==='Optimal'?'#34d399':'#818cf8' }}>{ai.status}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ flex:1, height:3, borderRadius:99, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                    <motion.div initial={{width:0}} animate={{width:'100%'}} transition={{duration:1,delay:i*0.2}}
                      style={{ height:'100%', background:'linear-gradient(90deg,#4f46e5,#38bdf8)', borderRadius:99 }} />
                  </div>
                  <span className="mono" style={{ fontSize:9, color:'rgba(148,163,184,0.35)' }}>{ai.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trending */}
      <motion.div variants={fadeUp} className="acard" style={{ padding:'28px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Target size={16} color="#818cf8" />
            <span style={{ fontSize:14, fontWeight:700, color:'white' }}>Global Trending Vectors</span>
          </div>
          <button className="abtn-ghost" style={{ fontSize:11, padding:'6px 12px' }}>Manage</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {[
            { skill:'Generative AI', growth:'+245%', icon:<Zap size={16}/>, c:'#facc15', bg:'rgba(250,204,21,0.07)', bd:'rgba(250,204,21,0.15)' },
            { skill:'Cloud Architecture', growth:'+180%', icon:<CloudLightning size={16}/>, c:'#38bdf8', bg:'rgba(56,189,248,0.07)', bd:'rgba(56,189,248,0.15)' },
            { skill:'Data Intelligence', growth:'+210%', icon:<Brain size={16}/>, c:'#f472b6', bg:'rgba(244,114,182,0.07)', bd:'rgba(244,114,182,0.15)' },
          ].map((t,i) => (
            <motion.div key={i} whileHover={{scale:1.02}} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 18px', borderRadius:12, background:t.bg, border:`1px solid ${t.bd}`, cursor:'pointer' }}>
              <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'rgba(0,0,0,0.2)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', color:t.c }}>
                  {t.icon}
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:'white' }}>{t.skill}</span>
              </div>
              <span style={{ fontSize:11, fontWeight:700, color:'#34d399' }}>{t.growth}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OverviewDashboard;
