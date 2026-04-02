import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Route, CheckCircle2, Clock, Lock, Users, TrendingUp, Edit, Eye } from 'lucide-react';
import { fadeUp, stagger, StatCard } from '../Shared';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const RoadmapControl = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/roadmap/all`);
        const data = await res.json();
        setRoadmaps(Array.isArray(data) ? data : (data.roadmaps || []));
      } catch (e) {
        console.error('Roadmaps fetch error:', e);
        setRoadmaps([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const totalMilestones = roadmaps.reduce((s, r) => s + (r.milestones?.length || 0), 0);
  const completedMilestones = roadmaps.reduce((s, r) => s + (r.milestones?.filter(m => m.status === 'completed').length || 0), 0);

  const stats = [
    { label: 'Total Roadmaps', value: String(roadmaps.length), grow: '+22%', color: 'purple', icon: <Route size={16} /> },
    { label: 'Total Milestones', value: String(totalMilestones), grow: '+18%', color: 'indigo', icon: <CheckCircle2 size={16} /> },
    { label: 'Completed', value: String(completedMilestones), grow: '+32%', color: 'green', icon: <TrendingUp size={16} /> },
    { label: 'Unique Users', value: String(new Set(roadmaps.map(r => r.uid || r.userId)).size), grow: '+14%', color: 'blue', icon: <Users size={16} /> },
  ];

  const statusDistribution = {
    labels: ['Completed', 'In Progress', 'Upcoming'],
    datasets: [{
      data: [
        completedMilestones,
        roadmaps.reduce((s, r) => s + (r.milestones?.filter(m => m.status === 'current').length || 0), 0),
        roadmaps.reduce((s, r) => s + (r.milestones?.filter(m => m.status === 'upcoming').length || 0), 0),
      ],
      backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(99,102,241,0.8)', 'rgba(148,163,184,0.4)'],
      borderColor: '#040810',
      borderWidth: 2,
    }],
  };

  const monthlyGenData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Roadmaps Created',
      data: [45, 62, 88, 120, 95, 142],
      backgroundColor: 'rgba(168,85,247,0.6)',
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  if (loading) {
    return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:400 }}><div style={{ textAlign:'center' }}><div style={{ width:32, height:32, border:'3px solid rgba(255,255,255,0.1)', borderTopColor:'#818cf8', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} /><div className="mlabel">Loading Roadmaps...</div></div></div>;
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        {stats.map((s, i) => <StatCard key={i} stat={s} />)}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:14 }}>
        <motion.div variants={fadeUp} className="acard" style={{ padding:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <TrendingUp size={15} color="#a855f7" />
            <span style={{ fontSize:14, fontWeight:700, color:'white' }}>Monthly Roadmap Generation</span>
          </div>
          <div style={{ height:220 }}>
            <Bar data={monthlyGenData} options={{
              responsive:true, maintainAspectRatio:false,
              plugins: { legend:{display:false}, tooltip:{ backgroundColor:'rgba(4,8,16,0.95)', bodyColor:'#e2e8f0' } },
              scales: { x:{ grid:{display:false}, ticks:{color:'rgba(148,163,184,0.4)', font:{size:10}} }, y:{ grid:{color:'rgba(255,255,255,0.04)'}, ticks:{color:'rgba(148,163,184,0.3)', font:{size:10}} } },
            }} />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="acard" style={{ padding:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <Route size={15} color="#818cf8" />
            <span style={{ fontSize:14, fontWeight:700, color:'white' }}>Milestone Status</span>
          </div>
          <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Doughnut data={statusDistribution} options={{
              responsive:true, maintainAspectRatio:false, cutout:'65%',
              plugins: { legend:{ position:'bottom', labels:{color:'rgba(148,163,184,0.6)', font:{size:10}, padding:12, boxWidth:10} } },
            }} />
          </div>
        </motion.div>
      </div>

      {/* Roadmap List */}
      <motion.div variants={fadeUp} className="acard" style={{ padding:'24px 28px 0' }}>
        <div className="sect-title" style={{ marginBottom:18 }}>Generated Roadmaps</div>
        <div style={{ overflowX:'auto' }}>
          <table className="atbl">
            <thead>
              <tr>
                <th>Roadmap</th>
                <th>User</th>
                <th>Milestones</th>
                <th>Progress</th>
                <th style={{ textAlign:'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roadmaps.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:'40px 0', color:'rgba(148,163,184,0.3)' }}>No roadmaps generated yet</td></tr>
              ) : roadmaps.slice(0, 15).map((r, i) => {
                const total = r.milestones?.length || 0;
                const done = r.milestones?.filter(m => m.status === 'completed').length || 0;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <motion.tr key={r._id || i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:Math.min(i*0.03,0.3)}}>
                    <td>
                      <div style={{ fontSize:13, fontWeight:600, color:'white' }}>{r.targetRole || r.title || 'AI-Generated Roadmap'}</div>
                      <div className="mlabel" style={{ fontSize:9, marginTop:2 }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}</div>
                    </td>
                    <td style={{ fontSize:12, color:'rgba(203,213,225,0.7)' }}>{r.uid?.substring(0,12) || 'Unknown'}...</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:12, fontWeight:600, color:'white' }}>{done}/{total}</span>
                        <div style={{ display:'flex', gap:3 }}>
                          {(r.milestones || []).slice(0,5).map((m,j) => (
                            <div key={j} style={{ width:14, height:14, borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center',
                              background: m.status==='completed'?'rgba(16,185,129,0.2)':m.status==='current'?'rgba(99,102,241,0.2)':'rgba(255,255,255,0.05)',
                              border:`1px solid ${m.status==='completed'?'rgba(16,185,129,0.3)':m.status==='current'?'rgba(99,102,241,0.3)':'rgba(255,255,255,0.08)'}` }}>
                              {m.status==='completed'?<CheckCircle2 size={8} color="#34d399"/>:m.status==='current'?<Clock size={8} color="#818cf8"/>:<Lock size={7} color="rgba(148,163,184,0.3)"/>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:80, height:4, borderRadius:99, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                          <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8}}
                            style={{ height:'100%', borderRadius:99, background:pct>70?'linear-gradient(90deg,#10b981,#34d399)':pct>30?'linear-gradient(90deg,#4f46e5,#818cf8)':'linear-gradient(90deg,#374151,#6b7280)' }} />
                        </div>
                        <span style={{ fontSize:11, fontWeight:600, color:'rgba(148,163,184,0.5)' }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ textAlign:'right' }}>
                      <div style={{ display:'flex', justifyContent:'flex-end', gap:6 }}>
                        <button style={{ width:28, height:28, borderRadius:7, background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.18)', color:'#818cf8', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><Eye size={11}/></button>
                        <button style={{ width:28, height:28, borderRadius:7, background:'rgba(168,85,247,0.08)', border:'1px solid rgba(168,85,247,0.18)', color:'#c084fc', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><Edit size={11}/></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ height:1 }} />
      </motion.div>
    </motion.div>
  );
};

export default RoadmapControl;
