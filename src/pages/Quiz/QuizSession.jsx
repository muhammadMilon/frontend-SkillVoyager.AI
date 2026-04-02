import React, { useState, useContext } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const QuizSession = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const quiz = location.state?.quiz;
  
  const [answers, setAnswers] = useState(Array(quiz?.questions?.length || 0).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Session Not Found</h2>
          <Link to="/quiz/generate" className="text-indigo-300 hover:text-indigo-200 hover:underline">
            Go generate a new quiz
          </Link>
        </div>
      </div>
    );
  }

  const handleOptionChange = (questionIndex, option) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (answers.includes('')) {
      toast.warning('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user?.email || 'anonymous',
          uid: user?.uid,
          quizId,
          answers
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit quiz');

      toast.success('Quiz submitted successfully!');
      navigate(`/quiz/result`, { state: { result, quizInfo: { topic: quiz.topic, skillLevel: quiz.skillLevel } } });
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Error submitting quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-12">
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

      <nav className="sticky top-0 z-50 bg-slate-950/40 backdrop-blur-md border-b border-slate-800/60 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-300">
            {quiz.topic} Quiz
          </h1>
          <span className="bg-slate-900/50 border border-slate-800/70 px-3 py-1 rounded-full text-sm font-medium text-slate-200">
            {quiz.skillLevel}
          </span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {quiz.questions.map((q, index) => (
          <div key={index} className="bg-slate-900/40 border border-slate-800/70 rounded-2xl shadow-2xl p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-4 text-slate-200">
              <span className="text-indigo-300 mr-2">Q{index + 1}.</span>
              {q.question}
            </h3>
            <div className="space-y-3">
              {q.options.map((opt, oIndex) => {
                const isSelected = answers[index] === opt;
                return (
                  <label 
                    key={oIndex} 
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md ${
                      isSelected 
                        ? 'border-indigo-400/70 bg-indigo-500/10 scale-[1.01] shadow-indigo-500/10' 
                        : 'border-slate-800/70 bg-slate-950/20 hover:bg-slate-900/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleOptionChange(index, opt)}
                      className="w-5 h-5 text-indigo-400 border-slate-700 bg-slate-900 focus:ring-indigo-500 ring-offset-slate-950"
                    />
                    <span className="text-base text-slate-200">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`py-3 px-8 rounded-xl font-bold text-lg text-white shadow-xl transition-all ${
              isSubmitting
                ? 'bg-indigo-500/50 cursor-not-allowed border border-indigo-400/20'
                : 'bg-indigo-500 hover:bg-indigo-400 hover:-translate-y-1 border border-indigo-400/20'
            }`}
          >
            {isSubmitting ? 'Evaluating...' : 'Submit Answers'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default QuizSession;
