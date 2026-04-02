import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
    CheckCircle, Sparkles, Zap, Users, ArrowRight,
    Clock, MessageCircle, Shield, Gift, Crown, Lock, X, RefreshCw
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

const BACKEND_URL = 'https://backend-skill-voyager-ai.vercel.app';

// ── Lazy Stripe init with locale ───────────────────────────────────────────
let _stripePromise = null;
const getStripePromise = () => {
    if (!_stripePromise) {
        const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        if (!key) {
            console.error('❌ VITE_STRIPE_PUBLISHABLE_KEY is not set in .env');
            return null;
        }
        // locale: 'en' suppresses some non-critical network warnings on localhost
        _stripePromise = loadStripe(key, { locale: 'en' });
    }
    return _stripePromise;
};

// ─── PARTICLES ────────────────────────────────────────────────────────────────
const Particle = ({ x, y, size, colorIdx, duration, delay }) => {
    const colors = ['rgba(23,182,168,0.65)', 'rgba(15,212,196,0.55)', 'rgba(245,200,66,0.50)'];
    return (
        <div style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            width: size, height: size, borderRadius: '50%',
            background: colors[colorIdx % 3],
            pointerEvents: 'none', zIndex: 1,
            animation: `particleFloat ${duration}s ${delay}s ease-in-out infinite`,
        }} />
    );
};

const PARTICLES = [
    { x: 8,  y: 15, size: 4, colorIdx: 0, duration: 5, delay: 0   },
    { x: 22, y: 72, size: 3, colorIdx: 1, duration: 7, delay: 1.2 },
    { x: 38, y: 9,  size: 5, colorIdx: 2, duration: 6, delay: 0.5 },
    { x: 55, y: 88, size: 3, colorIdx: 0, duration: 8, delay: 2   },
    { x: 70, y: 35, size: 4, colorIdx: 1, duration: 5, delay: 0.8 },
    { x: 85, y: 60, size: 5, colorIdx: 2, duration: 7, delay: 1.8 },
    { x: 92, y: 18, size: 3, colorIdx: 0, duration: 6, delay: 3   },
    { x: 14, y: 50, size: 4, colorIdx: 2, duration: 9, delay: 0.3 },
    { x: 47, y: 55, size: 3, colorIdx: 1, duration: 6, delay: 2.5 },
    { x: 63, y: 80, size: 5, colorIdx: 0, duration: 8, delay: 1   },
    { x: 79, y: 12, size: 3, colorIdx: 2, duration: 5, delay: 3.5 },
    { x: 31, y: 40, size: 4, colorIdx: 1, duration: 7, delay: 1.5 },
];

// ─── TILT CARD ────────────────────────────────────────────────────────────────
const TiltCard = ({ children, style }) => {
    const ref = useRef(null);
    const rx = useMotionValue(0); const ry = useMotionValue(0);
    const sRx = useSpring(rx, { stiffness: 180, damping: 22 });
    const sRy = useSpring(ry, { stiffness: 180, damping: 22 });
    const rotateX = useTransform(sRx, v => `${v}deg`);
    const rotateY = useTransform(sRy, v => `${v}deg`);
    return (
        <motion.div ref={ref}
            onMouseMove={(e) => {
                const r = ref.current.getBoundingClientRect();
                rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
                ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
            }}
            onMouseLeave={() => { rx.set(0); ry.set(0); }}
            style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d' }}
        >
            {children}
        </motion.div>
    );
};

// ─── COUNTER ──────────────────────────────────────────────────────────────────
const Counter = ({ value }) => {
    const num = parseInt(value.replace(/\D/g, ''), 10) || 0;
    const prefix = value.startsWith('$') ? '$' : '';
    const [display, setDisplay] = useState(num);
    useEffect(() => {
        if (num === 0) { setDisplay(0); return; }
        let cur = 0; const step = num / 28;
        const t = setInterval(() => {
            cur += step;
            if (cur >= num) { setDisplay(num); clearInterval(t); }
            else setDisplay(Math.floor(cur));
        }, 18);
        return () => clearInterval(t);
    }, [num]);
    return <>{prefix}{display}</>;
};

// ─── CARD ELEMENT STYLES (shared) ────────────────────────────────────────────
const cardStyle = {
    style: {
        base: {
            color: '#f1f5f9',
            fontSize: '15px',
            fontFamily: 'system-ui, sans-serif',
            fontSmoothing: 'antialiased',
            '::placeholder': { color: 'rgba(255,255,255,0.28)' },
        },
        invalid: { color: '#f87171', iconColor: '#f87171' },
    },
};

const CardField = ({ label, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}>
            {label}
        </label>
        <div style={{ background: '#060f1a', border: '1px solid rgba(23,182,168,0.25)', borderRadius: 10, padding: '12px 14px', transition: 'border-color 0.2s' }}>
            {children}
        </div>
    </div>
);

// ─── STRIPE CHECKOUT FORM ────────────────────────────────────────────────────
const StripeCheckoutForm = ({ planName, clientSecret, priceLabel, onSuccess, onClose }) => {
    const stripe   = useStripe();
    const elements = useElements();
    const [loading,   setLoading]   = useState(false);
    const [error,     setError]     = useState(null);
    const [succeeded, setSucceeded] = useState(false);

    const handleSubmit = async () => {
        if (!stripe || !elements) return;
        setLoading(true);
        setError(null);

        // Use confirmCardPayment with CardNumberElement — works on http/localhost
        const cardNumber = elements.getElement(CardNumberElement);
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            { payment_method: { card: cardNumber } }
        );

        if (confirmError) {
            setError(confirmError.message);
            setLoading(false);
        } else if (paymentIntent?.status === 'succeeded') {
            setSucceeded(true);
        } else {
            setError('Payment could not be completed. Please try again.');
            setLoading(false);
        }
    };

    if (succeeded) return (
        <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#17B6A8,#0fd4c4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(23,182,168,0.4)' }}>
                <CheckCircle style={{ width: 36, height: 36, color: '#fff' }} />
            </motion.div>
            <div>
                <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 22, margin: '0 0 8px', fontFamily: 'system-ui, sans-serif' }}>Payment Successful!</h3>
                <p style={{ color: 'rgba(23,182,168,0.8)', fontSize: 14, margin: 0, fontFamily: 'system-ui, sans-serif' }}>
                    Welcome to <span style={{ color: '#17B6A8', fontWeight: 700 }}>{planName}</span> plan!
                </p>
            </div>
            <button onClick={() => { onSuccess(); onClose(); }}
                style={{ marginTop: 8, padding: '14px 40px', borderRadius: 14, background: 'linear-gradient(135deg,#17B6A8,#0d9e92)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: '0 8px 28px rgba(23,182,168,0.4)', fontFamily: 'system-ui, sans-serif' }}>
                Get Started →
            </button>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Security badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(23,182,168,0.08)', border: '1px solid rgba(23,182,168,0.25)', borderRadius: 12, padding: '10px 14px', color: '#17B6A8', fontSize: 12, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>
                <Shield style={{ width: 13, height: 13, flexShrink: 0 }} />
                256-bit SSL encrypted · Powered by Stripe
            </div>

            {/* Card fields — CardElement works on http, PaymentElement needs https */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'rgba(7,19,32,0.8)', border: '1px solid rgba(23,182,168,0.20)', borderRadius: 14, padding: 16 }}>
                <CardField label="Card Number">
                    <CardNumberElement options={cardStyle} />
                </CardField>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <CardField label="Expiration Date">
                        <CardExpiryElement options={cardStyle} />
                    </CardField>
                    <CardField label="Security Code">
                        <CardCvcElement options={cardStyle} />
                    </CardField>
                </div>
            </div>

            {/* Error display */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.30)', borderRadius: 12, padding: '12px 16px', color: '#F87171', fontSize: 13, fontFamily: 'system-ui, sans-serif' }}>
                        ⚠️ {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submit button */}
            <button
                onClick={handleSubmit}
                disabled={!stripe || !elements || loading}
                style={{
                    padding: '14px 0', borderRadius: 14, border: 'none',
                    cursor: (!stripe || loading) ? 'not-allowed' : 'pointer',
                    background: loading ? 'rgba(23,182,168,0.4)' : 'linear-gradient(135deg,#17B6A8,#0d9e92)',
                    color: '#fff', fontWeight: 700, fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 8px 28px rgba(23,182,168,0.35)',
                    transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1,
                    fontFamily: 'system-ui, sans-serif',
                }}>
                {loading ? (
                    <>
                        <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spinLoader 0.7s linear infinite' }} />
                        Processing...
                    </>
                ) : (
                    <>
                        <Lock style={{ width: 14, height: 14 }} />
                        Pay {priceLabel} Securely
                    </>
                )}
            </button>

            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: 0, fontFamily: 'system-ui, sans-serif' }}>
                By continuing you agree to our Terms of Service
            </p>
        </div>
    );
};

// ─── PAYMENT MODAL ───────────────────────────────────────────────────────────
const PaymentModal = ({ plan, billingCycle, onClose, onSuccess }) => {
    const [clientSecret, setClientSecret] = useState(null);
    const [fetchError,   setFetchError]   = useState(null);
    const [fetching,     setFetching]     = useState(false);

    // ── FIX 3: price correctly read from plan.price object ────────────────
    const priceLabel   = plan.price[billingCycle];              // e.g. "$12"
    const amountCents  = (parseInt(priceLabel.replace(/\D/g, ''), 10) || 0) * 100;
    const isFree       = amountCents === 0;
    const periodLabel  = billingCycle === 'monthly' ? 'month' : 'year';

    const fetchIntent = useCallback(async () => {
        if (isFree) return;
        setFetching(true);
        setFetchError(null);
        setClientSecret(null);
        try {
            const res = await fetch(`${BACKEND_URL}/api/create-payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount:      amountCents,
                    currency:    'usd',
                    planName:    plan.name,
                    billingCycle,
                }),
            });
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(`Server responded with ${res.status}${text ? `: ${text}` : ''}`);
            }
            const data = await res.json();
            if (!data.clientSecret) throw new Error('No clientSecret returned from server');
            setClientSecret(data.clientSecret);
        } catch (err) {
            console.error('PaymentIntent fetch error:', err);
            setFetchError(err.message || 'Payment server এ connect করা যাচ্ছে না।');
        } finally {
            setFetching(false);
        }
    }, [amountCents, billingCycle, isFree, plan.name]);

    useEffect(() => { fetchIntent(); }, [fetchIntent]);

    // ── FIX 4: Stripe appearance options ──────────────────────────────────
    const appearance = {
        theme: 'night',
        variables: {
            colorPrimary:    '#17B6A8',
            colorBackground: '#071320',
            colorText:       '#f1f5f9',
            colorDanger:     '#f87171',
            fontFamily:      'system-ui, sans-serif',
            borderRadius:    '10px',
            spacingUnit:     '4px',
        },
        rules: {
            '.Input':        { border: '1px solid rgba(23,182,168,0.25)', backgroundColor: '#060f1a' },
            '.Input:focus':  { border: '1px solid #17B6A8', boxShadow: '0 0 0 3px rgba(23,182,168,0.15)' },
            '.Label':        { color: 'rgba(255,255,255,0.50)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' },
            '.Tab':          { border: '1px solid rgba(23,182,168,0.20)', backgroundColor: '#060f1a' },
            '.Tab--selected':{ border: '1px solid #17B6A8', backgroundColor: '#0b1d2e' },
            '.Error':        { color: '#f87171' },
        },
    };

    return (
        <div
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: 460,
                    background: '#071320',
                    border: `1px solid ${plan.border}`,
                    borderRadius: 24, overflow: 'hidden',
                    boxShadow: `0 0 60px ${plan.glow}, 0 30px 80px rgba(0,0,0,0.6)`,
                    maxHeight: '90vh', overflowY: 'auto',
                }}
            >
                {/* Modal Header */}
                <div style={{ background: `linear-gradient(135deg, ${plan.accent}25, ${plan.accent}08)`, borderBottom: `1px solid ${plan.border}`, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)' }}>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px', fontFamily: 'system-ui, sans-serif' }}>
                            Secure Checkout · Stripe
                        </p>
                        <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: '0 0 16px', fontFamily: 'system-ui, sans-serif' }}>
                            {plan.name} Plan
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                            <span style={{ color: plan.accent, fontWeight: 900, fontSize: 36, fontFamily: 'system-ui, sans-serif' }}>{priceLabel}</span>
                            <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: 13, fontFamily: 'system-ui, sans-serif' }}>/{periodLabel}</span>
                        </div>
                    </div>
                    <button onClick={onClose}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(23,182,168,0.18)', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>
                        <X style={{ width: 16, height: 16 }} />
                    </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '24px 28px' }}>
                    {/* ── Error state with retry ── */}
                    {fetchError ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.30)', borderRadius: 12, padding: '14px 16px', color: '#F87171', fontSize: 13, fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
                                ⚠️ {fetchError}
                            </div>
                            <button onClick={fetchIntent}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px 0', borderRadius: 12, background: 'linear-gradient(135deg,#17B6A8,#0d9e92)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui, sans-serif' }}>
                                <RefreshCw style={{ width: 14, height: 14 }} /> Retry
                            </button>
                            <button onClick={onClose}
                                style={{ width: '100%', padding: '12px 0', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui, sans-serif' }}>
                                Close
                            </button>
                        </div>

                    /* ── Free plan ── */
                    ) : isFree ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '30px 0', textAlign: 'center' }}>
                            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#17B6A8,#0fd4c4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(23,182,168,0.35)' }}>
                                <CheckCircle style={{ width: 32, height: 32, color: '#fff' }} />
                            </div>
                            <div>
                                <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 20, margin: '0 0 8px', fontFamily: 'system-ui, sans-serif' }}>You're all set!</h3>
                                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0, fontFamily: 'system-ui, sans-serif' }}>Free plan — no payment required</p>
                            </div>
                            <button onClick={() => { onSuccess(); onClose(); }}
                                style={{ padding: '14px 40px', borderRadius: 14, background: 'linear-gradient(135deg,#17B6A8,#0d9e92)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(23,182,168,0.35)', fontFamily: 'system-ui, sans-serif' }}>
                                Start for Free →
                            </button>
                        </div>

                    /* ── Loading intent ── */
                    ) : fetching || !clientSecret ? (
                        <div style={{ padding: '50px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(23,182,168,0.2)', borderTopColor: '#17B6A8', animation: 'spinLoader 0.7s linear infinite' }} />
                            <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: 13, margin: 0, fontFamily: 'system-ui, sans-serif' }}>Preparing secure checkout...</p>
                        </div>

                    /* ── Stripe form ── */
                    ) : (
                        <Elements
                            key={clientSecret}
                            stripe={getStripePromise()}
                            options={{ clientSecret, appearance, locale: 'en' }}
                        >
                            <StripeCheckoutForm
                                planName={plan.name}
                                clientSecret={clientSecret}
                                priceLabel={priceLabel}
                                onSuccess={onSuccess}
                                onClose={onClose}
                            />
                        </Elements>
                    )}
                </div>
            </motion.div>

            <style>{`
                @keyframes spinLoader { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

// ─── MAIN PRICING PAGE ───────────────────────────────────────────────────────
export default function PricingPreview() {
    const [billingCycle,    setBillingCycle]    = useState('monthly');
    const [hoveredPlan,     setHoveredPlan]     = useState(null);
    const [activePlan,      setActivePlan]      = useState(null);
    const [subscribedPlans, setSubscribedPlans] = useState({});

    const plans = [
        {
            name: 'Free',
            price: { monthly: '$0', yearly: '$0' },
            description: 'Perfect for getting started',
            icon: <Sparkles style={{ width: 20, height: 20 }} />,
            accent: '#94A3B8',
            glow: 'rgba(148,163,184,0.18)',
            border: 'rgba(148,163,184,0.25)',
            bg: 'linear-gradient(145deg, rgba(7,19,32,0.90) 0%, rgba(11,29,46,0.82) 100%)',
            features: ['1 AI-generated roadmap', 'Basic skill analysis', 'Community support', '7-day history', 'Email updates'],
            btn: 'Start Free',
            btnBg: 'rgba(148,163,184,0.12)',
            btnColor: '#CBD5E1',
            btnBorder: '1px solid rgba(148,163,184,0.28)',
            popular: false,
            delay: 0.1,
        },
        {
            name: 'Pro',
            price: { monthly: '$12', yearly: '$99' },
            description: 'For serious learners',
            icon: <Zap style={{ width: 20, height: 20 }} />,
            accent: '#17B6A8',
            glow: 'rgba(23,182,168,0.28)',
            border: 'rgba(23,182,168,0.55)',
            bg: 'linear-gradient(145deg, rgba(7,26,32,0.92) 0%, rgba(11,42,48,0.88) 100%)',
            features: ['Unlimited roadmaps', 'Advanced AI analysis', 'Priority support', 'Unlimited history', 'Progress tracking', 'Project recommendations', 'Certificate of completion'],
            btn: 'Get Started',
            btnBg: 'linear-gradient(135deg, #17B6A8, #0d9e92)',
            btnColor: '#fff',
            btnShadow: '0 8px 28px rgba(23,182,168,0.45)',
            popular: true,
            delay: 0.2,
        },
        {
            name: 'Team',
            price: { monthly: '$49', yearly: '$399' },
            description: 'For groups & organizations',
            icon: <Users style={{ width: 20, height: 20 }} />,
            accent: '#F5C842',
            glow: 'rgba(245,200,66,0.18)',
            border: 'rgba(245,200,66,0.28)',
            bg: 'linear-gradient(145deg, rgba(21,16,6,0.90) 0%, rgba(32,26,8,0.82) 100%)',
            features: ['Everything in Pro', 'Team management', 'Analytics dashboard', 'API access', 'Custom integrations', 'Dedicated account manager', 'Bulk user management'],
            btn: 'Contact Sales',
            btnBg: 'rgba(245,200,66,0.10)',
            btnColor: '#F5C842',
            btnBorder: '1px solid rgba(245,200,66,0.30)',
            popular: false,
            delay: 0.3,
        },
    ];

    return (
        <section style={{ position: 'relative', padding: '90px 24px 100px', overflow: 'hidden', fontFamily: 'system-ui, sans-serif', background: 'linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)' }}>
            <style>{`
                @keyframes particleFloat { 0%,100%{transform:translateY(0) scale(0.6);opacity:0} 30%{opacity:0.8} 50%{transform:translateY(-55px) scale(1.2);opacity:0.65} 70%{opacity:0.4} }
                @keyframes pulseDot { 0%,100%{box-shadow:0 0 6px #17B6A8;opacity:1} 50%{box-shadow:0 0 16px #17B6A8;opacity:0.35} }
                @keyframes floatBadge { 0%,100%{transform:translateX(-50%) translateY(0px)} 50%{transform:translateX(-50%) translateY(-5px)} }
                @keyframes arrowBounce { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
                @keyframes blobBreath1 { 0%,100%{transform:scale(1);opacity:0.3} 50%{transform:scale(1.1);opacity:0.45} }
                @keyframes blobBreath2 { 0%,100%{transform:scale(1);opacity:0.22} 50%{transform:scale(1.12);opacity:0.35} }
            `}</style>

            {/* BG grid */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(23,182,168,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(23,182,168,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            {/* Blobs */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', zIndex: 1, width: 700, height: 700, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(23,182,168,0.15) 0%, transparent 65%)', animation: 'blobBreath1 8s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', bottom: '-8%', right: '-8%', zIndex: 1, width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(245,200,66,0.07) 0%, transparent 65%)', animation: 'blobBreath2 10s ease-in-out 2.5s infinite' }} />
            {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

            <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 5 }}>

                {/* ── HEADER ── */}
                <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} style={{ textAlign: 'center', marginBottom: 64 }}>
                    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ width: '28px', height: '2px', background: '#17B6A8' }} />
                        <span style={{ color: '#17B6A8', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}>Simple &amp; Transparent Pricing</span>
                        <div style={{ width: '28px', height: '2px', background: '#17B6A8' }} />
                    </motion.div>

                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ fontSize: 'clamp(34px, 4.5vw, 54px)', fontWeight: '800', letterSpacing: '-1px', lineHeight: 1.1, color: '#fff', fontFamily: 'system-ui, sans-serif', margin: '0 0 32px' }}>
                        Choose <span style={{ color: '#17B6A8' }}>Your</span> Plan
                    </motion.h2>

                    {/* Billing toggle */}
                    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }}
                        style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(23,182,168,0.18)', borderRadius: 16, padding: 5, gap: 4, backdropFilter: 'blur(8px)' }}>
                        {['monthly', 'yearly'].map(cycle => (
                            <motion.button key={cycle} onClick={() => setBillingCycle(cycle)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                                style={{ padding: '10px 26px', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.3s, color 0.3s, box-shadow 0.3s',
                                    background: billingCycle === cycle ? 'linear-gradient(135deg, #17B6A8, #0d9e92)' : 'transparent',
                                    color: billingCycle === cycle ? '#fff' : 'rgba(255,255,255,0.40)',
                                    boxShadow: billingCycle === cycle ? '0 4px 20px rgba(23,182,168,0.35)' : 'none',
                                }}>
                                {cycle === 'monthly' ? 'Monthly' : (
                                    <>Yearly <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(245,200,66,0.15)', color: '#F5C842', border: '1px solid rgba(245,200,66,0.30)', padding: '2px 8px', borderRadius: 999 }}>−30%</span></>
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                </motion.div>

                {/* PLAN CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 26, alignItems: 'stretch' }}>
                    {plans.map((plan, index) => {
                        const isSubscribed = subscribedPlans[plan.name];
                        return (
                            <motion.div key={index} initial={{ opacity: 0, y: 56, scale: 0.94 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: plan.delay, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                {plan.popular && (
                                    <div style={{ position: 'absolute', top: -17, left: '50%', zIndex: 10, animation: 'floatBadge 3s ease-in-out infinite', background: 'linear-gradient(135deg, #17B6A8, #0d9e92)', color: '#fff', padding: '6px 22px', borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: '0.09em', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 6px 28px rgba(23,182,168,0.55)', whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif' }}>
                                        <Crown style={{ width: 11, height: 11 }} /> MOST POPULAR
                                    </div>
                                )}
                                <TiltCard style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <motion.div
                                        onHoverStart={() => setHoveredPlan(index)}
                                        onHoverEnd={() => setHoveredPlan(null)}
                                        animate={{ boxShadow: hoveredPlan === index ? `0 0 70px ${plan.glow}, 0 28px 70px rgba(0,0,0,0.5)` : plan.popular ? `0 0 40px ${plan.glow}, 0 14px 44px rgba(0,0,0,0.4)` : '0 4px 28px rgba(0,0,0,0.35)' }}
                                        transition={{ duration: 0.35 }}
                                        style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 26, padding: 32, background: plan.bg, border: `1px solid ${plan.border}`, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', position: 'relative', overflow: 'hidden' }}>

                                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${plan.accent}80, ${plan.accent}, transparent)`, opacity: plan.popular ? 1 : 0.4 }} />

                                        <motion.div whileHover={{ rotate: 12, scale: 1.15 }} transition={{ type: 'spring', stiffness: 280 }}
                                            style={{ width: 54, height: 54, borderRadius: 17, background: `${plan.accent}15`, border: `1px solid ${plan.accent}38`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: plan.accent, marginBottom: 26, boxShadow: `0 4px 20px ${plan.glow}` }}>
                                            {plan.icon}
                                        </motion.div>

                                        <div style={{ marginBottom: 22 }}>
                                            <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 10px', fontFamily: 'system-ui, sans-serif' }}>{plan.name}</h3>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 6 }}>
                                                <AnimatePresence mode="wait">
                                                    <motion.span key={billingCycle + plan.name} initial={{ opacity: 0, y: -20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.8 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                                                        style={{ fontSize: 46, fontWeight: 900, lineHeight: 1, color: plan.accent, display: 'block', fontFamily: 'system-ui, sans-serif' }}>
                                                        <Counter value={plan.price[billingCycle]} />
                                                    </motion.span>
                                                </AnimatePresence>
                                                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'system-ui, sans-serif' }}>{billingCycle === 'monthly' ? '/month' : '/year'}</span>
                                            </div>
                                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0, fontFamily: 'system-ui, sans-serif' }}>{plan.description}</p>
                                            <AnimatePresence>
                                                {billingCycle === 'yearly' && plan.name !== 'Free' && (
                                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10, background: 'rgba(245,200,66,0.10)', border: '1px solid rgba(245,200,66,0.25)', color: '#F5C842', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, fontFamily: 'system-ui, sans-serif' }}>
                                                        <Gift style={{ width: 10, height: 10 }} /> Save 30% yearly
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: plan.delay + 0.3 }}
                                            style={{ height: 1, marginBottom: 22, transformOrigin: 'left', background: `linear-gradient(90deg, transparent, ${plan.accent}55, transparent)` }} />

                                        <ul style={{ listStyle: 'none', margin: '0 0 28px', padding: 0, flexGrow: 1 }}>
                                            {plan.features.map((feature, idx) => (
                                                <motion.li key={idx} initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: plan.delay + idx * 0.06 }}
                                                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 11 }}>
                                                    <motion.div whileHover={{ scale: 1.25, rotate: 10 }}
                                                        style={{ width: 18, height: 18, borderRadius: '50%', background: `${plan.accent}18`, border: `1px solid ${plan.accent}38`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                                                        <CheckCircle style={{ width: 10, height: 10, color: plan.accent }} />
                                                    </motion.div>
                                                    <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13.5, lineHeight: 1.55, fontFamily: 'system-ui, sans-serif' }}>{feature}</span>
                                                </motion.li>
                                            ))}
                                        </ul>

                                        <div style={{ marginTop: 'auto' }}>
                                            <motion.button
                                                onClick={() => setActivePlan(plan)}
                                                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px 0', borderRadius: 14, cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.03em', border: isSubscribed ? '1px solid rgba(23,182,168,0.28)' : (plan.btnBorder || 'none'),
                                                    background: isSubscribed ? 'rgba(23,182,168,0.12)' : plan.btnBg,
                                                    color: isSubscribed ? '#17B6A8' : plan.btnColor,
                                                    boxShadow: isSubscribed ? 'none' : (plan.btnShadow || 'none'),
                                                }}>
                                                {isSubscribed ? (
                                                    <><CheckCircle style={{ width: 15, height: 15 }} /> Subscribed</>
                                                ) : (
                                                    <>{plan.btn}<span style={{ animation: 'arrowBounce 1.6s ease-in-out infinite' }}><ArrowRight style={{ width: 15, height: 15 }} /></span></>
                                                )}
                                            </motion.button>
                                            {plan.name !== 'Free' && (
                                                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: '10px 0 0', fontFamily: 'system-ui, sans-serif' }}>🔒 30-day money-back guarantee</p>
                                            )}
                                        </div>
                                    </motion.div>
                                </TiltCard>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Trust row */}
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.45 }}
                    style={{ display: 'flex', justifyContent: 'center', gap: 44, flexWrap: 'wrap', marginTop: 64, paddingTop: 42, borderTop: '1px solid rgba(23,182,168,0.12)' }}>
                    {[
                        { icon: <Shield style={{ width: 14, height: 14 }} />, text: 'Secure payments' },
                        { icon: <Clock style={{ width: 14, height: 14 }} />, text: 'Cancel anytime' },
                        { icon: <span style={{ fontSize: 16, lineHeight: 1 }}>∞</span>, text: 'No hidden fees' },
                        { icon: <MessageCircle style={{ width: 14, height: 14 }} />, text: '24/7 support' },
                    ].map((item, i) => (
                        <motion.div key={i} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.40)', fontSize: 13, fontWeight: 500, cursor: 'default', fontFamily: 'system-ui, sans-serif' }}>
                            <span style={{ color: '#17B6A8' }}>{item.icon}</span>{item.text}
                        </motion.div>
                    ))}
                </motion.div>

                <div style={{ textAlign: 'center', marginTop: 38 }}>
                    <motion.a href="#pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#17B6A8', fontSize: 14, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.03em', fontFamily: 'system-ui, sans-serif' }}>
                        View full pricing details <ArrowRight style={{ width: 14, height: 14 }} />
                    </motion.a>
                </div>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {activePlan && (
                    <PaymentModal
                        plan={activePlan}
                        billingCycle={billingCycle}
                        onClose={() => setActivePlan(null)}
                        onSuccess={() => {
                            setSubscribedPlans(prev => ({ ...prev, [activePlan.name]: true }));
                            setActivePlan(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}