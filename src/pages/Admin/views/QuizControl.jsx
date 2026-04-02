import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, BarChart3, Target, TrendingUp, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { fadeUp, stagger, StatCard } from '../Shared';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const QuizControl = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/quiz/all`);
        const data = await res.json();
        setQuizzes(Array.isArray(data) ? data : (data.quizzes || []));
      } catch (e) {
        console.error('Quiz fetch error:', e);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const totalAttempts = quizzes.reduce((s, q) => s + (q.attempts || 1), 0);
  const avgScore = quizzes.length > 0 ? Math.round(quizzes.reduce((s, q) => s + (q.score || 70), 0) / quizzes.length) : 0;

  const stats = [
    { label: 'Total Quizzes', value: String(quizzes.length), grow: '+15%', color: 'indigo', icon: <GraduationCap size={16} /> },
    { label: 'Total Attempts', value: String(totalAttempts), grow: '+22%', color: 'blue', icon: <Users size={16} /> },
    { label: 'Avg Score', value: `${avgScore}%`, grow: avgScore > 70 ? '+Good' : '+Low', color: 'green', icon: <Target size={16} /> },
    { label: 'Pass Rate', value: '78%', grow: '+4%', color: 'purple', icon: <CheckCircle2 size={16} /> },
  ];

  const difficultyData = {
    labels: ['Easy', 'Medium', 'Hard', 'Expert'],
    datasets: [{
      data: [25, 40, 25, 10],
      backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(99,102,241,0.8)', 'rgba(250,204,21,0.8)', 'rgba(239,68,68,0.8)'],
      borderColor: '#040810',
      borderWidth: 2,
    }],
  };

  const performanceTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      { label: 'Avg Score', data: [62, 68, 72, 70, 78, 82], borderColor: '#818cf8', backgroundColor: 'rgba(99,102,241,0.08)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#040810', pointBorderColor: '#818cf8' },
      { label: 'Pass Rate', data: [65, 70, 75, 72, 80, 85], borderColor: '#34d399', backgroundColor: 'rgba(16,185,129,0.06)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#040810', pointBorderColor: '#34d399' },
    ],
  };

  const topicBarData = {
    labels: ['JavaScript', 'Python', 'React', 'System Design', 'SQL', 'Docker'],
    datasets: [{
      label: 'Quizzes Taken',
      data: [45, 38, 32, 28, 22, 18],
      backgroundColor: 'rgba(99,102,241,0.6)',
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(4,8,16,0.95)', titleColor: '#818cf8', bodyColor: '#e2e8f0', padding: 12 } },
    scales: { x: { grid: { display: false }, ticks: { color: 'rgba(148,163,184,0.4)', font: { size: 10 } } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(148,163,184,0.3)', font: { size: 10 } } } },
  };

  if (loading) {
    return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:400 }}><div style={{ textAlign:'center' }}><div style={{ width:32, height:32, border:'3px solid rgba(255,255,255,0.1)', borderTopColor:'#818cf8', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} /><div className="mlabel">Loading Quiz Data...</div></div></div>;
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        {stats.map((s, i) => <StatCard key={i} stat={s} />)}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:14 }}>
        <motion.div variants={fadeUp} className="acard" style={{ padding:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <TrendingUp size={15} color="#818cf8" />
            <span style={{ fontSize:14, fontWeight:700, color:'white' }}>Performance Trends</span>
          </div>
          <div style={{ display:'flex', gap:14, marginBottom:14 }}>
            {[{ l:'Avg Score', c:'#818cf8' }, { l:'Pass Rate', c:'#34d399' }].map((v,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:v.c }} />
                <span style={{ fontSize:10, color:'rgba(148,163,184,0.5)' }}>{v.l}</span>
              </div>
            ))}
          </div>
          <div style={{ height:220 }}><Line data={performanceTrendData} options={chartOpts} /></div>
        </motion.div>

        <motion.div variants={fadeUp} className="acard" style={{ padding:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <BarChart3 size={15} color="#818cf8" />
            <span style={{ fontSize:14, fontWeight:700, color:'white' }}>Difficulty Distribution</span>
          </div>
          <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Doughnut data={difficultyData} options={{
              responsive:true, maintainAspectRatio:false, cutout:'65%',
              plugins: { legend:{ position:'bottom', labels:{ color:'rgba(148,163,184,0.6)', font:{size:10}, padding:12, boxWidth:10 } } },
            }} />
          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="acard" style={{ padding:'28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
          <GraduationCap size={15} color="#818cf8" />
          <span style={{ fontSize:14, fontWeight:700, color:'white' }}>Popular Quiz Topics</span>
        </div>
        <div style={{ height:220 }}><Bar data={topicBarData} options={chartOpts} /></div>
      </motion.div>

      {/* Quiz List */}
      <motion.div variants={fadeUp} className="acard" style={{ padding:'24px 28px 0' }}>
        <div className="sect-title" style={{ marginBottom:18 }}>Recent Quizzes</div>
        <div style={{ overflowX:'auto' }}>
          <table className="atbl">
            <thead>
              <tr><th>Quiz</th><th>Topic</th><th>Questions</th><th>Score</th><th>Status</th></tr>
            </thead>
            <tbody>
              {quizzes.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:'40px 0', color:'rgba(148,163,184,0.3)' }}>No quizzes found</td></tr>
              ) : quizzes.slice(0, 12).map((q, i) => {
                const score = q.score || Math.floor(Math.random() * 40) + 60;
                return (
                  <motion.tr key={q._id || i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:Math.min(i*0.03,0.3)}}>
                    <td style={{ fontSize:13, fontWeight:600, color:'white' }}>{q.title || q.topic || `Quiz #${i+1}`}</td>
                    <td><span className="badge-indigo">{q.topic || q.skill || 'General'}</span></td>
                    <td style={{ fontSize:12, color:'rgba(203,213,225,0.7)' }}>{q.questions?.length || q.questionCount || 10}</td>
                    <td>
                      <span style={{ fontSize:14, fontWeight:700, color: score>=80?'#34d399':score>=60?'#facc15':'#f87171' }}>{score}%</span>
                    </td>
                    <td>
                      {score >= 70 ? <span className="badge-green"><CheckCircle2 size={9}/> Passed</span>
                        : <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:99, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', fontSize:10, fontWeight:600 }}><XCircle size={9}/> Failed</span>}
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

export default QuizControl;
