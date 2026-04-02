import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight, Github, Shield } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const { user, signInUser, signInWithGoogle, signInWithGithub } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(user.email === "admin@skillvoyager.ai" ? "/admin-dashboard" : "/dashboard");
        }
    }, [user, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        signInUser(email, password)
            .then((result) => {
                const userName = result.user?.displayName || "User";
                toast.success(`Welcome back, ${userName}! 🚀`, {
                    style: {
                        fontWeight: 'bold', borderRadius: '16px',
                        background: '#071320', color: '#ffffff',
                        border: '1px solid #17B6A8'
                    },
                    progressStyle: { background: 'linear-gradient(90deg, #17B6A8, #0fd4c4)' }
                });
                const targetPath = email === "admin@skillvoyager.ai" ? "/admin-dashboard" : "/dashboard";
                setTimeout(() => navigate(targetPath), 1000);
            })
            .catch(() => {
                toast.error("Invalid Email or Password!", {
                    style: { fontWeight: 'bold', borderRadius: '16px' }
                });
            });
    };

    const handleGithubLogin = () => {
        signInWithGithub()
            .then(() => {
                toast.success("Welcome back! 🚀", {
                    style: {
                        fontWeight: 'bold', borderRadius: '16px',
                        background: '#071320', color: '#ffffff',
                        border: '1px solid #17B6A8'
                    },
                    progressStyle: { background: 'linear-gradient(90deg, #17B6A8, #0fd4c4)' }
                });
            })
            .catch(error => {
                toast.error(error.message || "GitHub login failed!", {
                    style: { fontWeight: 'bold', borderRadius: '16px' }
                });
            });
    };

    const handleAdminDemoView = async () => {
        try {
            await signInUser("admin@skillvoyager.ai", "CodeCatalysts");
            toast.success("Admin demo login successful!");
            setTimeout(() => {
                navigate("/admin-dashboard");
            }, 500);
        } catch (error) {
            toast.error("Admin demo login failed!");
            console.log(error);
        }
    };
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '160px 16px 48px',
            background: 'linear-gradient(150deg, #040d18 0%, #071525 55%, #030c14 100%)',
            position: 'relative', overflow: 'hidden',
        }}>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            {/* Background Effects */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                {/* dot grid */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(23,182,168,0.04) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
                {/* orbs */}
                <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,182,168,0.10) 0%, transparent 65%)', filter: 'blur(80px)' }} />
                <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,212,196,0.07) 0%, transparent 65%)', filter: 'blur(80px)' }} />
                {/* top accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #17B6A8, #0fd4c4, transparent)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ maxWidth: 460, width: '100%', position: 'relative', zIndex: 10 }}
            >
                {/* Card */}
                <div style={{
                    borderRadius: 32, padding: '40px',
                    background: 'rgba(7,19,32,0.88)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(23,182,168,0.18)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(23,182,168,0.08)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* fix browser autofill white bg */}
                    <style>{`
                      input:-webkit-autofill,
                      input:-webkit-autofill:hover,
                      input:-webkit-autofill:focus {
                        -webkit-box-shadow: 0 0 0 1000px #071320 inset !important;
                        -webkit-text-fill-color: rgba(255,255,255,0.9) !important;
                        caret-color: white;
                        border-color: rgba(23,182,168,0.35) !important;
                        transition: background-color 9999s ease-in-out 0s;
                      }
                    `}</style>
                    {/* card top line */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #17B6A8, #0fd4c4, transparent)', borderRadius: '32px 32px 0 0' }} />
                    {/* corner glow */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(23,182,168,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 36, position: 'relative', zIndex: 1 }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(23,182,168,0.10)', border: '1px solid rgba(23,182,168,0.25)', padding: '8px 18px', borderRadius: 99, marginBottom: 16 }}
                        >
                            <Sparkles style={{ width: 14, height: 14, color: '#17B6A8' }} />
                            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: '#17B6A8' }}>Welcome Back</span>
                        </motion.div>

                        <h2 style={{
                            fontSize: 38, fontWeight: 900, margin: '0 0 8px', letterSpacing: '-1px',
                            background: 'linear-gradient(90deg, #e0fff8, #17B6A8, #0fd4c4, #F5C842, #17B6A8)',
                            backgroundSize: '200% auto', WebkitBackgroundClip: 'text', backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            SkillVoyager.AI
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.50)', fontWeight: 500, margin: 0, fontSize: 14 }}>Continue your learning journey</p>
                    </div>

                    {/* admin button  */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAdminDemoView}
                        type="button"
                        style={{
                            width: '100%',
                            padding: '14px 16px',
                            borderRadius: 16,
                            border: '1px solid rgba(245,200,66,0.35)',
                            background: 'linear-gradient(135deg, rgba(245,200,66,0.16), rgba(23,182,168,0.10))',
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            marginBottom: 20
                        }}
                    >
                        <Shield style={{ width: 18, height: 18, color: '#F5C842' }} />
                        View Admin Demo
                    </motion.button>
                    <p style={{ marginTop: -8, marginBottom: 18, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                        Demo Admin: admin@skillvoyager.ai / CodeCatalysts
                    </p>
                    {/* admin button  */}

                    {/* Form */}
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'relative', zIndex: 1 }}>
                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.45)', marginBottom: 8, letterSpacing: '2px', textTransform: 'uppercase' }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }} className="input-group">
                                <Mail style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'rgba(255,255,255,0.30)', pointerEvents: 'none' }} />
                                <input name="email" type="email" placeholder="your@email.com" required
                                    style={{ width: '100%', paddingLeft: 48, paddingRight: 16, paddingTop: 15, paddingBottom: 15, borderRadius: 16, border: '1px solid rgba(23,182,168,0.18)', background: 'rgba(23,182,168,0.06)', color: 'white', fontSize: 14, fontWeight: 500, outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                                    onFocus={e => { e.target.style.borderColor='#17B6A8'; e.target.style.boxShadow='0 0 0 3px rgba(23,182,168,0.12)'; }}
                                    onBlur={e  => { e.target.style.borderColor='rgba(23,182,168,0.18)'; e.target.style.boxShadow='none'; }} />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.45)', marginBottom: 8, letterSpacing: '2px', textTransform: 'uppercase' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'rgba(255,255,255,0.30)', pointerEvents: 'none' }} />
                                <input name="password" type="password" placeholder="••••••••" required
                                    style={{ width: '100%', paddingLeft: 48, paddingRight: 16, paddingTop: 15, paddingBottom: 15, borderRadius: 16, border: '1px solid rgba(23,182,168,0.18)', background: 'rgba(23,182,168,0.06)', color: 'white', fontSize: 14, fontWeight: 500, outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                                    onFocus={e => { e.target.style.borderColor='#17B6A8'; e.target.style.boxShadow='0 0 0 3px rgba(23,182,168,0.12)'; }}
                                    onBlur={e  => { e.target.style.borderColor='rgba(23,182,168,0.18)'; e.target.style.boxShadow='none'; }} />
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                                <input type="checkbox" style={{ width: 15, height: 15, accentColor: '#17B6A8' }} />
                                Remember me
                            </label>
                            <Link to="/forgot-password" style={{ color: '#17B6A8', fontWeight: 700, textDecoration: 'none', fontSize: 13 }}>
                                Forgot password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            style={{
                                width: '100%', padding: '15px 0', borderRadius: 16, border: '1px solid rgba(23,182,168,0.35)',
                                background: 'linear-gradient(135deg, #0e2e2a, #0a2020)',
                                color: 'white', fontSize: 15, fontWeight: 800, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                boxShadow: '0 4px 20px rgba(23,182,168,0.22)', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow='0 6px 28px rgba(23,182,168,0.38)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow='0 4px 20px rgba(23,182,168,0.22)'}
                        >
                            <span style={{ color: '#17B6A8' }}>Sign In</span>
                            <ArrowRight style={{ width: 18, height: 18, color: '#17B6A8' }} />
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div style={{ margin: '28px 0', position: 'relative', zIndex: 1 }}>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '100%', height: 1, background: 'rgba(23,182,168,0.14)' }} />
                        </div>
                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                            <span style={{ padding: '0 16px', background: 'rgba(7,19,32,0.88)', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.28)', letterSpacing: '2px', textTransform: 'uppercase' }}>Or continue with</span>
                        </div>
                    </div>

                    {/* Google Login */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => signInWithGoogle()}
                        type="button"
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                            background: 'rgba(23,182,168,0.06)', border: '1px solid rgba(23,182,168,0.18)',
                            padding: '14px 0', borderRadius: 16, cursor: 'pointer',
                            transition: 'all 0.2s', position: 'relative', zIndex: 1,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(23,182,168,0.12)'; e.currentTarget.style.borderColor='rgba(23,182,168,0.35)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='rgba(23,182,168,0.06)'; e.currentTarget.style.borderColor='rgba(23,182,168,0.18)'; }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ width: 22, height: 22 }}>
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                        </svg>
                        <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 800, fontSize: 14 }}>Continue with Google</span>
                    </motion.button>

                    {/* GitHub Login */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGithubLogin}
                        type="button"
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                            background: 'rgba(23,182,168,0.06)', border: '1px solid rgba(23,182,168,0.18)',
                            padding: '14px 0', borderRadius: 16, cursor: 'pointer', marginTop: 10,
                            transition: 'all 0.2s', position: 'relative', zIndex: 1,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(23,182,168,0.12)'; e.currentTarget.style.borderColor='rgba(23,182,168,0.35)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='rgba(23,182,168,0.06)'; e.currentTarget.style.borderColor='rgba(23,182,168,0.18)'; }}
                    >
                        <Github style={{ width: 22, height: 22, color: 'rgba(255,255,255,0.85)' }} />
                        <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 800, fontSize: 14 }}>Continue with GitHub</span>
                    </motion.button>

                    {/* Sign Up Link */}
                    <p style={{ marginTop: 28, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.40)', position: 'relative', zIndex: 1 }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#17B6A8', fontWeight: 800, textDecoration: 'none' }}>
                            Create Account
                        </Link>
                    </p>
                </div>

                {/* Bottom Text */}
                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.22)', fontWeight: 500 }}>
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </motion.div>
        </div>
    );
};

export default Login;