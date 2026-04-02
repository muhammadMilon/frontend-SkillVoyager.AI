import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state?.result;
  const quizInfo = location.state?.quizInfo;

  if (!resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Result Found</h2>
          <Link to="/quiz/generate" className="text-indigo-300 hover:text-indigo-200 hover:underline">
            Go generate a new quiz
          </Link>
        </div>
      </div>
    );
  }

  const { score, totalQuestions, pointsEarned, evaluation } = resultData;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-16">
      {/* subtle background accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-12%] right-[-12%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-12%] left-[-12%] w-[45%] h-[45%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <nav className="sticky top-0 z-50 bg-slate-950/40 backdrop-blur-md border-b border-slate-800/60 mb-8 py-4">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-300">
            Quiz Results
          </h1>
          <Link to="/dashboard" className="text-slate-400 hover:text-indigo-200 transition">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 relative z-10">
        {/* Score Header */}
        <div className="bg-slate-900/40 rounded-3xl p-8 text-center shadow-2xl border border-slate-800/70 mb-8 transition-transform hover:scale-[1.01]">
          <h2 className="text-3xl font-extrabold mb-2">{quizInfo?.topic}</h2>
          <p className="text-slate-400 mb-6 font-medium">{quizInfo?.skillLevel} Level</p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-800" />
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  fill="transparent" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  strokeDasharray="439.8" 
                  strokeDashoffset={439.8 - (439.8 * percentage) / 100} 
                  className={`${percentage >= 80 ? 'text-emerald-400' : percentage >= 50 ? 'text-amber-400' : 'text-rose-400'} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold">{score}/{totalQuestions}</span>
              </div>
            </div>
            
            <div className="text-left bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/25">
              <p className="text-lg text-indigo-200 font-semibold mb-1">Points Earned</p>
              <p className="text-4xl font-black text-indigo-300">
                +{pointsEarned} <span className="text-2xl">XP</span>
              </p>
            </div>
          </div>
        </div>

        {/* Evaluation Review */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-200 mb-6">Detailed Review</h3>
          {evaluation.map((item, index) => (
            <div 
              key={index} 
              className={`rounded-2xl border-2 p-6 transition-all ${
                item.isCorrect 
                  ? 'border-emerald-500/25 bg-emerald-500/5' 
                  : 'border-rose-500/25 bg-rose-500/5'
              }`}
            >
              <div className="flex gap-4">
                <div className="mt-1">
                  {item.isCorrect ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-300 border border-emerald-500/25">
                      ✓
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-300 border border-rose-500/25">
                      ✗
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-slate-100 mb-3">
                    {index + 1}. {item.question}
                  </h4>
                  
                  <div className="space-y-2 mb-4">
                    {!item.isCorrect && (
                      <p className="text-sm">
                        <span className="font-semibold text-rose-300">Your Answer:</span>{' '}
                        <span className="text-slate-300">{item.userAnswer || '(Skipped)'}</span>
                      </p>
                    )}
                    <p className="text-sm">
                      <span className="font-semibold text-emerald-300">Correct Answer:</span>{' '}
                      <span className="text-slate-300">{item.correctAnswer}</span>
                    </p>
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 text-sm text-slate-300 border border-slate-800/70">
                    <strong className="block text-slate-100 mb-1">💡 Explanation:</strong>
                    {item.explanation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/quiz/generate')}
            className="px-8 py-3 rounded-xl font-bold bg-indigo-500 hover:bg-indigo-400 text-white transition-colors border border-indigo-400/20"
          >
            Take Another Quiz
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="px-8 py-3 rounded-xl font-bold bg-slate-900/40 hover:bg-slate-900/70 text-slate-100 transition-colors border border-slate-800/70"
          >
            View Leaderboard
          </button>
        </div>
      </main>
    </div>
  );
};

export default QuizResult;
