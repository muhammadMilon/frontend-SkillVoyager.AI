import React, { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const { sendPasswordReset } = useContext(AuthContext); 
    const navigate = useNavigate();

    const handleResetPassword = (e) => {
        e.preventDefault();
        const email = e.target.email.value;

        sendPasswordReset(email)
            .then(() => {
                toast.success("Reset link sent to your email! Check your inbox.", {
                    style: { fontWeight: 'bold', background: '#0f172a', color: '#fff', border: '1px solid #615fff' },
                    progressStyle: { background: '#615fff' }
                });
                e.target.reset();
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            })
            .catch(error => {
                toast.error(error.message, { style: { fontWeight: 'bold' } });
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-24 px-4 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Reset Password</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">Enter your email to receive a reset link.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                        <input name="email" type="email" required
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 font-bold shadow-lg transition transform active:scale-95">
                        Send Reset Link
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    Back to <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;