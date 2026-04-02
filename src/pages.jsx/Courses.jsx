import { useCallback, useEffect, useRef, useState } from "react";
import _courses from "../../data/coursesData";
import AllTopicsPage from "./AllTopicsPage";

// ── BACKEND URL ───────────────────────────────────────────────────────────────
const BACKEND_URL =
  import.meta.env.VITE_API_URL || "https://backend-skill-voyager-ai.vercel.app";

const PRICE_MAP = { 1: 799, 2: 999, 5: 599 };

// local hardcoded course data, merged with backend courses in component
const hardcodedCourses = _courses.map((course) => ({
  ...course,
  price: PRICE_MAP[course.id] ?? course.price ?? 0,
}));

// ── localStorage helpers ──────────────────────────────────────────────────────
const PURCHASED_KEY = "sv_purchased_courses";

const getPurchasedCourses = () => {
  try {
    return JSON.parse(localStorage.getItem(PURCHASED_KEY) || "[]");
  } catch {
    return [];
  }
};

const markCourseAsPurchased = (courseId) => {
  const id = String(courseId).trim();
  if (!id) return;
  const existing = getPurchasedCourses();
  if (!existing.includes(id)) {
    const updated = [...existing, id];
    localStorage.setItem(PURCHASED_KEY, JSON.stringify(updated));
    console.log("✅ Purchased:", id, "| All:", updated);
  }
};

// ── Theme tokens ──────────────────────────────────────────────────────────────
const T = {
  bg: "linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)",
  card: "#0a1828",
  cardHover: "#0c1e30",
  border: "rgba(23,182,168,0.14)",
  borderHov: "rgba(23,182,168,0.35)",
  teal: "#17B6A8",
  tealDim: "rgba(23,182,168,0.08)",
  tealMid: "rgba(23,182,168,0.18)",
  cyan: "#0fd4c4",
  gold: "#F5C842",
  text: "rgba(255,255,255,0.72)",
  textDim: "rgba(255,255,255,0.38)",
  pill: "rgba(23,182,168,0.10)",
  pillBdr: "rgba(23,182,168,0.22)",
};

const Icon = ({ name, size = 16, className = "" }) => {
  const icons = {
    search: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    clock: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    bar: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    book: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    chevL: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    ),
    chevR: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    ),
    filter: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
    ),
    sparkle: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    ),
    bookmark: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
    close: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    check: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    lock: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    unlock: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </svg>
    ),
    play: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    shield: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    infinite: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z" />
        <path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" />
      </svg>
    ),
    star: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    grid: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    arrow: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
  };
  return (
    <span className={`inline-flex ${className}`}>{icons[name] || null}</span>
  );
};

const getCourseColor = (course) => {
  const map = {
    "AI/ML": "from-[#17B6A8] to-[#0a8c82]",
    Frontend: "from-[#0fd4c4] to-[#0a9e96]",
    Programming: "from-[#F5C842] to-[#c9a030]",
    "E-commerce": "from-[#17B6A8] to-[#0d7a73]",
    Design: "from-[#0fd4c4] to-[#17B6A8]",
    Data: "from-[#4fc3f7] to-[#0288d1]",
  };
  return map[course?.category] || "from-[#17B6A8] to-[#0a8c82]";
};
const getCourseGlow = (course) => {
  const map = {
    "AI/ML": "#17B6A8",
    Frontend: "#0fd4c4",
    Programming: "#F5C842",
    "E-commerce": "#17B6A8",
    Design: "#0fd4c4",
    Data: "#4fc3f7",
  };
  return map[course?.category] || "#17B6A8";
};

const useCarousel = (total, interval = 4500) => {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    if (total > 0)
      timerRef.current = setInterval(
        () => setIdx((i) => (i + 1) % total),
        interval,
      );
  }, [total, interval]);
  useEffect(() => {
    reset();
    return () => clearInterval(timerRef.current);
  }, [reset]);
  return {
    idx,
    next: () => {
      setIdx((i) => (i + 1) % total);
      reset();
    },
    prev: () => {
      setIdx((i) => (i - 1 + total) % total);
      reset();
    },
    goTo: (i) => {
      setIdx(i);
      reset();
    },
  };
};

// ─── VIDEO MODAL ──────────────────────────────────────────────────────────────
const VideoModal = ({ course, onClose }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const videoId =
    course.videoId ||
    (course.videoUrl?.includes("v=")
      ? course.videoUrl.split("v=")[1]?.split("&")[0]
      : null);
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10"
      style={{ background: "rgba(0,0,0,0.97)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 flex items-center gap-2 text-gray-400 hover:text-white text-sm"
        >
          <Icon name="close" size={18} /> Close (Esc)
        </button>
        <div
          className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black"
          style={{ border: `1px solid ${T.border}` }}
        >
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              allow="autoplay; fullscreen"
              allowFullScreen
              className="w-full h-full"
              title={course.title}
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${getCourseColor(course)} flex items-center justify-center`}
            >
              <Icon name="lock" size={44} className="text-white/30" />
            </div>
          )}
        </div>
        <p className="text-white font-bold text-lg mt-4">{course.title}</p>
      </div>
    </div>
  );
};

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────
const PaymentModal = ({ course, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      // ✅ KEY FIX: courseId কে URL এ explicitly pass করছি
      // {CHECKOUT_SESSION_ID} Stripe নিজে replace করবে
      const successUrl = `${window.location.origin}/course-payment-success?session_id={CHECKOUT_SESSION_ID}&purchased=${encodeURIComponent(String(course.id))}`;
      console.log("🛒 successUrl:", successUrl);

      const res = await fetch(
        `${BACKEND_URL}/api/create-course-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: String(course.id),
            courseTitle: course.title,
            amount: course.price * 100,
            currency: "bdt",
            userEmail: "",
            successUrl, // backend এ এটা use করবে
          }),
        },
      );
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (!data.url) throw new Error("No checkout URL");
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Payment server এ connect করা যাচ্ছে না। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  const color = getCourseColor(course);
  const glow = getCourseGlow(course);

  return (
    <div
      className="fixed inset-0 z-[1800] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "#071320",
          border: `1px solid ${T.border}`,
          boxShadow: `0 32px 80px rgba(0,0,0,0.7)`,
        }}
      >
        <div
          style={{
            padding: "28px 28px 22px",
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div className="flex justify-between items-start mb-5">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: T.tealDim,
                  border: `1px solid ${T.pillBdr}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="lock" size={13} />
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: T.textDim,
                }}
              >
                Secure Checkout · Stripe
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: T.tealDim,
                border: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: T.textDim,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.textDim)}
            >
              <Icon name="close" size={13} />
            </button>
          </div>
          <h3
            style={{
              color: "white",
              fontWeight: 700,
              fontSize: "1.1rem",
              lineHeight: 1.45,
              marginBottom: 20,
              maxWidth: 380,
            }}
          >
            {course.title}
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  color: T.textDim,
                  fontSize: 12,
                  marginBottom: 5,
                  fontWeight: 600,
                }}
              >
                Total due
              </p>
              <p
                style={{
                  color: "white",
                  fontWeight: 800,
                  fontSize: "2.4rem",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                ৳{course.price}
              </p>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: T.textDim,
                background: T.tealDim,
                border: `1px solid ${T.border}`,
                borderRadius: 9,
                padding: "6px 12px",
              }}
            >
              <Icon name="infinite" size={12} /> One-time · Lifetime access
            </span>
          </div>
        </div>
        <div style={{ padding: "24px 28px 28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: T.teal,
              background: T.tealDim,
              border: `1px solid ${T.pillBdr}`,
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            <Icon name="shield" size={15} /> 256-bit SSL encrypted · Powered by
            Stripe
          </div>
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.18)",
                borderRadius: 12,
                padding: "12px 14px",
                marginBottom: 16,
              }}
            >
              <svg
                width={15}
                height={15}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f87171"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: 1 }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span
                style={{
                  color: "rgba(248,113,113,0.9)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                {error}
              </span>
            </div>
          )}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${color} flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90`}
            style={{ fontSize: "0.975rem", boxShadow: `0 6px 20px ${glow}40` }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spinAnim 0.8s linear infinite",
                  }}
                />{" "}
                Stripe এ redirect হচ্ছে...
              </>
            ) : (
              <>
                <Icon name="lock" size={15} /> Pay ৳{course.price} — Proceed to
                Stripe
              </>
            )}
          </button>
          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: T.textDim,
              marginTop: 14,
            }}
          >
            আপনাকে Stripe-এর secure checkout page এ নিয়ে যাওয়া হবে
          </p>
        </div>
      </div>
      <style>{`@keyframes spinAnim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── PAYMENT SUCCESS TOAST ────────────────────────────────────────────────────
const PaymentSuccessToast = ({ courseName, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "linear-gradient(135deg, #071320, #0b1d2e)",
        border: `1px solid ${T.teal}55`,
        borderRadius: 16,
        padding: "16px 22px",
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${T.teal}22`,
        animation: "toastIn 0.4s cubic-bezier(0.16,1,0.3,1)",
        maxWidth: "90vw",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          flexShrink: 0,
          background: `linear-gradient(135deg, ${T.teal}, ${T.cyan})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 20px ${T.teal}66`,
        }}
      >
        <Icon name="check" size={22} className="text-white" />
      </div>
      <div>
        <p
          style={{
            color: "white",
            fontWeight: 700,
            fontSize: 15,
            marginBottom: 2,
          }}
        >
          🎉 Payment Successful!
        </p>
        <p style={{ color: T.text, fontSize: 13 }}>
          <span style={{ color: T.teal, fontWeight: 600 }}>{courseName}</span>{" "}
          এখন unlock হয়েছে
        </p>
      </div>
      <button
        onClick={onClose}
        style={{
          marginLeft: 8,
          color: T.textDim,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 4,
        }}
      >
        <Icon name="close" size={14} />
      </button>
      <style>{`@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
};

// ─── LOCKED OVERLAY ───────────────────────────────────────────────────────────
const LockedOverlay = ({ course, onUnlock }) => {
  const glow = getCourseGlow(course);
  return (
    <div
      onClick={onUnlock}
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        background: "rgba(4,10,18,0.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        cursor: "pointer",
        zIndex: 10,
        transition: "all 0.22s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(4,10,18,0.82)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(4,10,18,0.72)";
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${glow}22, ${glow}0a)`,
          border: `2px solid ${glow}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 24px ${glow}44`,
        }}
      >
        <Icon name="lock" size={22} className="text-white" />
      </div>
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            color: "white",
            fontWeight: 700,
            fontSize: 13,
            marginBottom: 2,
          }}
        >
          Premium Course
        </p>
        <p style={{ color: T.textDim, fontSize: 12 }}>
          Click to unlock · ৳{course.price}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          fontWeight: 700,
          color: glow,
          background: `${glow}18`,
          border: `1px solid ${glow}35`,
          borderRadius: 8,
          padding: "5px 12px",
          marginTop: 2,
        }}
      >
        <Icon name="unlock" size={11} /> Enroll Now
      </div>
    </div>
  );
};

// ─── COURSE DRAWER ────────────────────────────────────────────────────────────
const NAVBAR_HEIGHT = 72;

const CourseDrawer = ({ course, onClose, isPurchased }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [freeEnrolled, setFreeEnrolled] = useState(false);

  const color = getCourseColor(course);
  const glow = getCourseGlow(course);
  const isFree = !course.price || course.price === 0;
  const isAccessible = isFree || isPurchased || freeEnrolled;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !showVideo && !showPayment) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, showVideo, showPayment]);

  const handleEnroll = () => {
    isFree ? setFreeEnrolled(true) : setShowPayment(true);
  };

  // ─── SUCCESS SCREEN ───────────────────────────────────────────────
  if (freeEnrolled) {
    return (
      <>
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            top: NAVBAR_HEIGHT,
            left: 0,
            right: "50%",
            bottom: 0,
            zIndex: 1099,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
          }}
        />
        <div
          style={{
            position: "fixed",
            top: NAVBAR_HEIGHT,
            right: 0,
            bottom: 0,
            width: "50%",
            minWidth: 420,
            zIndex: 1100,
            background: "#071320",
            borderLeft: `1px solid ${T.border}`,
            animation: "drawerIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            overflowY: "auto",
          }}
          className="flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 flex flex-col items-center justify-center p-10 relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: T.tealDim,
                border: `1px solid ${T.border}`,
                color: T.textDim,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.textDim)}
            >
              <Icon name="close" size={18} />
            </button>
            <div
              className="relative mb-8"
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${glow}, ${T.cyan})`,
                boxShadow: `0 0 60px ${glow}70, 0 0 100px ${glow}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 68,
                  height: 68,
                  background: "#071320",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="check" size={48} className="text-white" />
              </div>
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: T.teal,
                background: T.tealDim,
                border: `1px solid ${T.pillBdr}`,
                padding: "8px 20px",
                borderRadius: 999,
                marginBottom: 12,
              }}
            >
              {isFree ? "Enrollment Successful" : "Payment Successful ✓"}
            </span>
            <h2 className="text-white font-black text-3xl text-center leading-tight mb-3">
              You're now enrolled!
            </h2>
            <p
              style={{
                color: T.text,
                fontSize: 16.5,
                textAlign: "center",
                maxWidth: 320,
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              Welcome to{" "}
              <span style={{ color: "white", fontWeight: 600 }}>
                {course.title}
              </span>
            </p>
            <div
              style={{
                background: T.tealDim,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: "16px 20px",
                width: "100%",
                maxWidth: 340,
                marginBottom: 32,
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon name="book" size={22} className="text-white" />
                </div>
                <div>
                  <p style={{ color: T.textDim, fontSize: 13 }}>Course</p>
                  <p style={{ color: "white", fontWeight: 600, fontSize: 15 }}>
                    {course.title}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full max-w-xs space-y-3 mb-10">
              {[
                { icon: "infinite", label: "Lifetime Access" },
                { icon: "star", label: "Certificate on Completion" },
                { icon: "shield", label: "Learn at Your Own Pace" },
                { icon: "play", label: "Instant Access to All Modules" },
              ].map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl px-5 py-4"
                  style={{
                    background: T.tealDim,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon name={p.icon} size={18} className="text-white" />
                  </div>
                  <span
                    style={{ color: T.text, fontSize: 15, fontWeight: 500 }}
                  >
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-full max-w-xs py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95"
              style={{
                background: `linear-gradient(to right, ${glow}, ${T.cyan})`,
                color: "white",
                boxShadow: `0 12px 40px ${glow}60`,
              }}
            >
              <Icon name="play" size={22} /> Start Learning Now
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: NAVBAR_HEIGHT,
          left: 0,
          right: "50%",
          bottom: 0,
          zIndex: 1099,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: NAVBAR_HEIGHT,
          right: 0,
          bottom: 0,
          width: "50%",
          minWidth: 400,
          zIndex: 1100,
          background: "#071320",
          borderLeft: `1px solid ${T.border}`,
          animation: "drawerIn 0.28s cubic-bezier(.16,1,.3,1)",
        }}
        className="overflow-y-auto flex flex-col shadow-2xl"
      >
        <div
          className="relative w-full flex-shrink-0 cursor-pointer group"
          style={{ aspectRatio: "16/9" }}
          onClick={() => isAccessible && setShowVideo(true)}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: isAccessible ? "none" : "blur(3px) brightness(0.5)",
              }}
            />
          )}
          {!isAccessible ? (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              style={{ background: "rgba(4,10,18,0.75)" }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: `${glow}18`,
                  border: `2px solid ${glow}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 30px ${glow}33`,
                }}
              >
                <Icon name="lock" size={26} className="text-white" />
              </div>
              <p style={{ color: "white", fontWeight: 700, fontSize: 14 }}>
                Purchase to Access
              </p>
              <p style={{ color: T.textDim, fontSize: 12 }}>
                Full course unlocks after payment
              </p>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/45 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/25 flex items-center justify-center group-hover:scale-110 transition-all shadow-2xl">
                  <Icon name="play" size={20} className="text-white ml-1" />
                </div>
                <span className="text-white/70 text-xs bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  Click to watch preview
                </span>
              </div>
            </>
          )}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-3 z-10">
            <div>
              {course.isNew && (
                <span
                  className="flex items-center gap-1 text-[10px] font-bold bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg"
                  style={{ color: T.teal }}
                >
                  <Icon name="sparkle" size={9} /> NEW
                </span>
              )}
            </div>
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="w-8 h-8 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
                <Icon name="bookmark" size={13} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-8 h-8 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: isFree
                      ? "rgba(23,182,168,0.12)"
                      : "rgba(245,200,66,0.12)",
                    color: isFree ? T.teal : T.gold,
                    border: `1px solid ${isFree ? T.pillBdr : "rgba(245,200,66,0.25)"}`,
                  }}
                >
                  {isFree
                    ? "✦ Free Course"
                    : isPurchased
                      ? "★ Purchased"
                      : "★ Premium"}
                </span>
                {!isFree && isPurchased && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "rgba(23,182,168,0.12)",
                      color: T.teal,
                      border: `1px solid ${T.pillBdr}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Icon name="unlock" size={10} /> Unlocked
                  </span>
                )}
              </div>
              <h2 className="text-white font-black text-xl leading-snug">
                {course.title}
              </h2>
            </div>
            {isAccessible ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.teal,
                  background: T.tealDim,
                  border: `1px solid ${T.pillBdr}`,
                  padding: "8px 12px",
                  borderRadius: 12,
                  whiteSpace: "nowrap",
                }}
              >
                <Icon name="check" size={12} />{" "}
                {isFree ? "Enrolled" : "Purchased"}
              </span>
            ) : (
              <button
                onClick={handleEnroll}
                className={`bg-gradient-to-r ${color} hover:opacity-90 active:scale-95 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all whitespace-nowrap flex-shrink-0`}
                style={{ boxShadow: `0 6px 20px ${glow}44` }}
              >
                Enroll · ৳{course.price}
              </button>
            )}
          </div>

          {course.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {course.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 12,
                    padding: "4px 10px",
                    borderRadius: 8,
                    background: T.tealDim,
                    color: T.text,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          {course.description && (
            <p
              style={{
                color: T.text,
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 20,
                background: T.tealDim,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: "12px 16px",
              }}
            >
              {course.description}
            </p>
          )}

          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {[
              {
                label: "Difficulty",
                value: course.level || "Intermediate",
                icon: "bar",
              },
              {
                label: "Duration",
                value: course.duration || "N/A",
                icon: "clock",
              },
              {
                label: "Category",
                value: course.category || "General",
                icon: "book",
              },
              { label: "Lectures", value: course.lectures || 0, icon: "play" },
              {
                label: "Projects",
                value: course.projects || 0,
                icon: "filter",
              },
              { label: "Quizzes", value: course.quizzes || 0, icon: "sparkle" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: T.tealDim,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div
                  className={`w-6 h-6 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-2`}
                >
                  <Icon name={s.icon} size={11} className="text-white" />
                </div>
                <p
                  style={{
                    color: T.textDim,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 2,
                  }}
                >
                  {s.label}
                </p>
                <p style={{ color: "white", fontWeight: 700, fontSize: 14 }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {course.learn?.length > 0 && (
            <div className="mb-5 relative">
              <h3
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: 15,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Icon name="sparkle" size={15} style={{ color: T.teal }} /> What
                You'll Learn
              </h3>
              <div
                className="space-y-2"
                style={{
                  filter: isAccessible ? "none" : "blur(4px)",
                  userSelect: isAccessible ? "auto" : "none",
                  pointerEvents: isAccessible ? "auto" : "none",
                }}
              >
                {course.learn.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5"
                    style={{
                      background: T.tealDim,
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon name="check" size={9} className="text-white" />
                    </div>
                    <p
                      style={{ color: T.text, fontSize: 14, lineHeight: 1.65 }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
              {!isAccessible && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 12,
                    background: "rgba(7,19,32,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: T.textDim,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Icon name="lock" size={13} /> Purchase to see full
                    curriculum
                  </span>
                </div>
              )}
            </div>
          )}

          {!isAccessible && (
            <div
              className="mt-auto p-4 rounded-2xl flex items-center justify-between gap-4"
              style={{ background: T.tealDim, border: `1px solid ${T.border}` }}
            >
              <div>
                <p style={{ fontWeight: 900, fontSize: 22, color: "white" }}>
                  ৳{course.price}
                </p>
                <p style={{ color: T.textDim, fontSize: 12, marginTop: 2 }}>
                  One-time · Lifetime access
                </p>
              </div>
              <button
                onClick={handleEnroll}
                className={`bg-gradient-to-r ${color} hover:opacity-90 active:scale-95 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all flex items-center gap-2`}
                style={{ boxShadow: `0 6px 20px ${glow}44` }}
              >
                <Icon name="lock" size={13} /> Enroll Now
              </button>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-4 justify-center pb-2">
            {[
              { icon: "infinite", text: "Lifetime access" },
              { icon: "shield", text: "Secure payment" },
              { icon: "star", text: "Certificate included" },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: T.textDim,
                }}
              >
                <Icon name={item.icon} size={12} />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showVideo && (
        <VideoModal course={course} onClose={() => setShowVideo(false)} />
      )}
      {showPayment && (
        <PaymentModal course={course} onClose={() => setShowPayment(false)} />
      )}
    </>
  );
};

// ─── FEATURED CAROUSEL ────────────────────────────────────────────────────────
const FeaturedCarousel = ({ items, onSelect, purchasedCourses }) => {
  const { idx, next, prev, goTo } = useCarousel(Math.max(items.length, 1));
  const visible = Array.from(
    { length: 3 },
    (_, i) => items[(idx + i) % items.length],
  );
  return (
    <div style={{ marginBottom: 56 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ width: 28, height: 2, background: T.teal }} />
            <span
              style={{
                color: T.teal,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              HANDPICKED FOR YOU
            </span>
            <div style={{ width: 28, height: 2, background: T.teal }} />
          </div>
          <h2
            style={{
              color: "white",
              fontWeight: 800,
              fontSize: "1.6rem",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Featured <span style={{ color: T.teal }}>Courses</span>
          </h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { fn: prev, icon: "chevL" },
            { fn: next, icon: "chevR" },
          ].map(({ fn, icon }) => (
            <button
              key={icon}
              onClick={fn}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: T.tealDim,
                border: `1px solid ${T.border}`,
                color: T.textDim,
                cursor: "pointer",
                transition: "all 0.16s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.tealMid;
                e.currentTarget.style.borderColor = T.teal;
                e.currentTarget.style.color = T.teal;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.tealDim;
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.color = T.textDim;
              }}
            >
              <Icon name={icon} size={16} />
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
        }}
      >
        {visible.map((course, i) => {
          const color = getCourseColor(course);
          const glow = getCourseGlow(course);
          const isFree = !course.price || course.price === 0;
          const isPurchased = purchasedCourses.includes(String(course.id));
          const isAccessible = isFree || isPurchased;
          return (
            <button
              key={`${course.id}-${i}`}
              onClick={() => onSelect(course)}
              style={{
                textAlign: "left",
                cursor: "pointer",
                borderRadius: 20,
                overflow: "hidden",
                background: T.card,
                border: `1px solid ${T.border}`,
                transition: "all 0.22s cubic-bezier(.16,1,.3,1)",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.border = `1px solid ${glow}55`;
                e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px ${glow}18`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.border = `1px solid ${T.border}`;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  position: "relative",
                  aspectRatio: "16/9",
                  overflow: "hidden",
                }}
              >
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: isAccessible
                        ? "none"
                        : "blur(2px) brightness(0.6)",
                      transition: "transform 0.5s",
                    }}
                    onMouseEnter={(e) => {
                      if (isAccessible)
                        e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(135deg, ${color})`,
                    }}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "55%",
                    background:
                      "linear-gradient(to top, rgba(7,19,32,0.95) 0%, transparent 100%)",
                  }}
                />
                <div style={{ position: "absolute", top: 12, left: 12 }}>
                  {isAccessible ? (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "4px 10px",
                        borderRadius: 8,
                        background: "rgba(23,182,168,0.85)",
                        color: "white",
                        letterSpacing: "0.04em",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      {isFree ? (
                        "FREE"
                      ) : (
                        <>
                          <Icon name="unlock" size={9} /> Purchased
                        </>
                      )}
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "4px 10px",
                        borderRadius: 8,
                        background: "rgba(245,200,66,0.85)",
                        color: "white",
                        letterSpacing: "0.04em",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Icon name="lock" size={9} /> ৳{course.price}
                    </span>
                  )}
                </div>
                {!isAccessible && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.55)",
                        border: `1px solid ${glow}44`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name="lock" size={17} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
              <div style={{ padding: "16px 18px 18px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: glow,
                    background: `${glow}14`,
                    border: `1px solid ${glow}25`,
                    padding: "3px 9px",
                    borderRadius: 6,
                    marginBottom: 10,
                    letterSpacing: "0.06em",
                  }}
                >
                  {course.category}
                </span>
                <h3
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.975rem",
                    lineHeight: 1.45,
                    margin: "0 0 10px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {course.title}
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    {course.level && (
                      <span
                        style={{
                          fontSize: 11,
                          color: T.textDim,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Icon name="bar" size={11} /> {course.level}
                      </span>
                    )}
                    {course.duration && (
                      <span
                        style={{
                          fontSize: 11,
                          color: T.textDim,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Icon name="clock" size={11} /> {course.duration}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: isAccessible ? T.teal : T.textDim,
                      fontWeight: 600,
                    }}
                  >
                    {isAccessible ? "Start →" : "Unlock →"}
                  </span>
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "10%",
                  right: "10%",
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${glow}50, transparent)`,
                }}
              />
            </button>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
          marginTop: 24,
        }}
      >
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              height: 4,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              transition: "all 0.22s",
              width: i === idx ? 24 : 6,
              background: i === idx ? T.teal : "rgba(255,255,255,0.12)",
              boxShadow: i === idx ? `0 0 10px ${T.teal}88` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  // ✅ lazy init — component mount এ localStorage থেকেই নেয়
  const [purchasedCourses, setPurchasedCourses] = useState(() =>
    getPurchasedCourses(),
  );
  const [successToast, setSuccessToast] = useState(null);
  const [backendCourses, setBackendCourses] = useState([]);
  const [backendLoading, setBackendLoading] = useState(true);
  const PER_PAGE = 12;

  // ✅ CORE FIX: URL params process করা
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const purchasedId = params.get("purchased");
    const sessionId = params.get("session_id");

    if (purchasedId) {
      // 1️⃣ localStorage এ save করো
      markCourseAsPurchased(purchasedId);

      // 2️⃣ State fresh copy দিয়ে update করো
      const fresh = getPurchasedCourses();
      setPurchasedCourses([...fresh]); // spread করে নতুন array reference তৈরি করো

      // 3️⃣ Toast দেখাও
      const found = courses.find((c) => String(c.id) === String(purchasedId));
      setSuccessToast({
        courseId: purchasedId,
        courseName: found?.title || "Course",
      });

      // 4️⃣ URL clean করো (state set এর পরে)
      window.history.replaceState({}, document.title, window.location.pathname);

      // 5️⃣ Backend verify (optional — DB এ save করার জন্য)
      if (sessionId) {
        fetch(
          `${BACKEND_URL}/api/course-payment-success?session_id=${sessionId}&courseId=${purchasedId}`,
        )
          .then((r) => r.json())
          .then((d) => console.log("Backend verified:", d))
          .catch((e) => console.warn("Backend verify failed (ok):", e.message));
      }
    }
  }, []);

  // Fetch backend (admin-added) courses
  useEffect(() => {
    const fetchBackendCourses = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/courses`);
        const data = await res.json();
        if (data.success && Array.isArray(data.courses)) {
          setBackendCourses(data.courses);
        }
      } catch (err) {
        console.error("Failed to fetch backend courses:", err);
      } finally {
        setBackendLoading(false);
      }
    };
    fetchBackendCourses();
  }, []);

  // Merge: hardcoded courses + backend courses (backend courses appear first as "new")
  const courses = [
    ...backendCourses.map((c) => ({
      ...c,
      id: c._id, // use MongoDB _id as id
      isNew: true, // mark as dynamically added
    })),

    ...hardcodedCourses,
  ];

  useEffect(() => {
    const onScroll = () => setShowScrollArrow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const allTopics = [
    ...new Set(courses.map((c) => c.category).filter(Boolean)),
  ];
  const topicCounts = allTopics.reduce(
    (acc, t) => ({
      ...acc,
      [t]: courses.filter((c) => c.category === t).length,
    }),
    {},
  );
  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    return (
      (!search ||
        c.title.toLowerCase().includes(q) ||
        (c.category || "").toLowerCase().includes(q)) &&
      (selectedTopics.length === 0 || selectedTopics.includes(c.category))
    );
  });
  const toggleTopic = (t) => {
    setSelectedTopics((s) =>
      s.includes(t) ? s.filter((x) => x !== t) : [...s, t],
    );
    setVisibleCount(12);
  };

  if (showAllTopics)
    return (
      <AllTopicsPage
        onBack={(t) => {
          setShowAllTopics(false);
          if (t) setSelectedTopics([t]);
        }}
        onSelectTopic={(t) => {
          setShowAllTopics(false);
          if (t) setSelectedTopics([t]);
        }}
      />
    );

  const topicColors = {
    "AI/ML": { from: T.teal, to: "#0a8c82" },
    Frontend: { from: T.cyan, to: "#0a9e96" },
    Programming: { from: T.gold, to: "#c9a030" },
    "E-commerce": { from: T.teal, to: "#0d7a73" },
    Design: { from: T.cyan, to: T.teal },
    Data: { from: "#4fc3f7", to: "#0288d1" },
    Backend: { from: T.teal, to: "#0a8c82" },
    DevOps: { from: T.gold, to: "#c9a030" },
    Architecture: { from: T.cyan, to: T.teal },
    Database: { from: "#4fc3f7", to: "#0288d1" },
    Security: { from: "#f87171", to: "#ef4444" },
    AI: { from: T.cyan, to: T.teal },
    DevTools: { from: T.teal, to: T.cyan },
    Development: { from: T.gold, to: "#c9a030" },
    "Web Development": { from: T.teal, to: T.cyan },
    Automation: { from: T.cyan, to: T.teal },
    Marketing: { from: "#fb7185", to: "#f43f5e" },
  };

  return (
    <div className="min-h-screen text-white" style={{ background: T.bg }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-60px",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(23,182,168,0.10) 0%, transparent 70%)`,
            filter: "blur(50px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "5%",
            right: "10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(15,212,196,0.07) 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(23,182,168,0.06) 0%, transparent 70%)`,
            filter: "blur(50px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle, rgba(23,182,168,0.035) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative max-w-[1900px] mx-auto px-6 md:px-8 pt-[160px] pb-16">
        {/* ── HEADER ── */}
        <div className="mb-14">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div style={{ width: 28, height: 2, background: T.teal }} />
            <span
              style={{
                color: T.teal,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              PLATFORM
            </span>
            <div style={{ width: 28, height: 2, background: T.teal }} />
          </div>
          <h1
            style={{
              fontSize: "clamp(34px,4.5vw,54px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.1,
              color: "#fff",
              fontFamily: "system-ui,sans-serif",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Learning <span style={{ color: T.teal }}>Resources</span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.50)",
              fontSize: 16,
              lineHeight: 1.7,
              textAlign: "center",
              maxWidth: 520,
              margin: "0 auto 48px",
            }}
          >
            Expand your skills, advance your career, and build your future with
            our curated learning materials.
          </p>
          <div
            className="relative max-w-lg"
            style={{ filter: `drop-shadow(0 8px 32px rgba(23,182,168,0.15))` }}
          >
            <div
              style={{
                position: "relative",
                borderRadius: 18,
                padding: 1.5,
                background: `linear-gradient(135deg, rgba(23,182,168,0.35), rgba(15,212,196,0.2), rgba(23,182,168,0.35))`,
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  borderRadius: 17,
                  background:
                    "linear-gradient(135deg, #071320 0%, #0a1828 50%, #071320 100%)",
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    paddingLeft: 18,
                    paddingRight: 4,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <svg
                    width={17}
                    height={17}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={search ? T.teal : "rgba(255,255,255,0.25)"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: "stroke 0.2s" }}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setVisibleCount(12);
                  }}
                  type="text"
                  placeholder="Search courses, topics..."
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    padding: "15px 12px",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: "white",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.parentElement.parentElement.style.background = `linear-gradient(135deg, ${T.teal}, ${T.cyan}, ${T.teal})`;
                  }}
                  onBlur={(e) => {
                    if (!search)
                      e.currentTarget.parentElement.parentElement.style.background = `linear-gradient(135deg, rgba(23,182,168,0.35), rgba(15,212,196,0.2), rgba(23,182,168,0.35))`;
                  }}
                />
                {!search && (
                  <div style={{ marginRight: 12, flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.18)",
                        background: "rgba(255,255,255,0.05)",
                        border: `1px solid ${T.border}`,
                        borderRadius: 6,
                        padding: "2px 7px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      ⌘K
                    </span>
                  </div>
                )}
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    style={{
                      marginRight: 10,
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: T.tealDim,
                      border: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: T.textDim,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                      e.currentTarget.style.color = "#f87171";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = T.tealDim;
                      e.currentTarget.style.color = T.textDim;
                    }}
                  >
                    <Icon name="close" size={11} />
                  </button>
                )}
              </div>
            </div>
            {search && (
              <p
                style={{
                  position: "absolute",
                  bottom: -22,
                  left: 4,
                  fontSize: 11,
                  color: T.textDim,
                  fontWeight: 500,
                }}
              >
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>
        </div>

        {courses.length >= 3 && (
          <FeaturedCarousel
            items={courses.slice(0, 6)}
            onSelect={setActiveCourse}
            purchasedCourses={purchasedCourses}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-[300px] flex-shrink-0">
            <div
              className="sticky top-24 rounded-2xl p-6"
              style={{ background: T.card, border: `1px solid ${T.border}` }}
            >
              <div
                className="flex justify-between items-center mb-5 pb-4"
                style={{ borderBottom: `1px solid ${T.border}` }}
              >
                <h3
                  style={{
                    fontWeight: 700,
                    color: "white",
                    fontSize: 17,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Icon name="filter" size={16} style={{ color: T.teal }} />{" "}
                  Filters
                </h3>
              </div>
              <p style={{ color: T.textDim, fontSize: 13.5, marginBottom: 20 }}>
                Sorted by:{" "}
                <span style={{ color: "white", fontWeight: 600 }}>Newest</span>
              </p>
              {selectedTopics.length > 0 && (
                <div className="mb-5">
                  <p
                    style={{
                      color: T.textDim,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 10,
                    }}
                  >
                    Selected
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopics.map((t) => (
                      <button
                        key={t}
                        onClick={() => toggleTopic(t)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          background: T.tealMid,
                          color: "white",
                          padding: "6px 12px",
                          borderRadius: 9,
                          border: `1px solid ${T.pillBdr}`,
                          cursor: "pointer",
                        }}
                      >
                        {t}{" "}
                        <span style={{ color: T.textDim, fontSize: 16 }}>
                          ×
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setSelectedTopics([]);
                        setSearch("");
                      }}
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.teal,
                        padding: "6px 8px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              )}
              <p
                style={{
                  color: T.textDim,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                Topics
              </p>
              <nav className="space-y-1">
                {allTopics.map((topic) => {
                  const c = topicColors[topic] || { from: T.teal, to: T.cyan };
                  const isSel = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 12px",
                        borderRadius: 10,
                        cursor: "pointer",
                        transition: "all 0.16s",
                        background: isSel
                          ? `linear-gradient(120deg, ${c.from}16, ${c.to}0a)`
                          : "transparent",
                        border: isSel
                          ? `1px solid ${c.from}35`
                          : "1px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSel) {
                          e.currentTarget.style.background = `${c.from}0e`;
                          e.currentTarget.style.border = `1px solid ${c.from}22`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSel) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.border =
                            "1px solid transparent";
                        }
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
                            boxShadow: isSel ? `0 0 8px ${c.from}80` : "none",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: isSel ? 700 : 500,
                            color: isSel ? c.from : "rgba(255,255,255,0.55)",
                          }}
                        >
                          {topic}
                        </span>
                      </span>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 6,
                          flexShrink: 0,
                          background: isSel ? `${c.from}20` : T.tealDim,
                          color: isSel ? c.from : T.textDim,
                          border: isSel
                            ? `1px solid ${c.from}30`
                            : "1px solid transparent",
                        }}
                      >
                        {topicCounts[topic] || 0}
                      </span>
                    </button>
                  );
                })}
              </nav>
              <button
                onClick={() => setShowAllTopics(true)}
                style={{
                  marginTop: 16,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  color: T.textDim,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.18s",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = T.teal;
                  e.currentTarget.style.borderColor = T.teal;
                  e.currentTarget.style.background = T.tealDim;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = T.textDim;
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon name="grid" size={14} /> Show all topics{" "}
                <Icon name="arrow" size={12} />
              </button>
            </div>
          </aside>

          <main className="flex-1 space-y-4 min-w-0">
            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <p style={{ color: T.textDim, fontSize: 15 }}>
                  No courses found.
                </p>
              </div>
            ) : (
              filtered.slice(0, visibleCount).map((course) => {
                const color = getCourseColor(course);
                const glow = getCourseGlow(course);
                const isFree = !course.price || course.price === 0;
                const isPurchased = purchasedCourses.includes(
                  String(course.id),
                );
                const isAccessible = isFree || isPurchased;
                return (
                  <div
                    key={course.id}
                    className="rounded-2xl p-5 flex flex-col md:flex-row gap-6 transition-all group"
                    style={{
                      background: T.card,
                      border: `1px solid ${T.border}`,
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = T.cardHover;
                      e.currentTarget.style.borderColor = isAccessible
                        ? T.borderHov
                        : `${glow}44`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = T.card;
                      e.currentTarget.style.borderColor = T.border;
                    }}
                  >
                    <div
                      className="w-full md:w-64 h-40 rounded-xl flex-shrink-0 relative overflow-hidden cursor-pointer"
                      onClick={() => setActiveCourse(course)}
                    >
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500"
                          style={{
                            filter: isAccessible
                              ? "none"
                              : "blur(3px) brightness(0.5)",
                          }}
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${color}`}
                        />
                      )}
                      {!isAccessible && (
                        <LockedOverlay
                          course={course}
                          onUnlock={() => setActiveCourse(course)}
                        />
                      )}
                      {isAccessible && (
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/35 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-all scale-90 hover:scale-100">
                            <Icon
                              name="play"
                              size={18}
                              className="text-white ml-1"
                            />
                          </div>
                        </div>
                      )}
                      <div
                        className="absolute top-3 left-3"
                        style={{ zIndex: 20 }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: isFree
                              ? "rgba(23,182,168,0.85)"
                              : isPurchased
                                ? "rgba(23,182,168,0.85)"
                                : "rgba(245,200,66,0.85)",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          {isFree ? (
                            "FREE"
                          ) : isPurchased ? (
                            <>
                              <Icon name="unlock" size={9} /> Purchased
                            </>
                          ) : (
                            <>
                              <Icon name="lock" size={9} /> ৳{course.price}
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: isFree
                              ? T.teal
                              : isPurchased
                                ? T.teal
                                : T.gold,
                          }}
                        >
                          {isFree
                            ? "FREE COURSE"
                            : isPurchased
                              ? "✓ PURCHASED"
                              : "PREMIUM"}
                        </span>
                        <h3
                          style={{
                            color: "white",
                            fontWeight: 700,
                            fontSize: 17,
                            lineHeight: 1.4,
                            marginBottom: 8,
                            marginTop: 4,
                            cursor: "pointer",
                          }}
                          onClick={() => setActiveCourse(course)}
                        >
                          {course.title}
                        </h3>
                        {course.description && (
                          <p
                            style={{
                              color: T.text,
                              fontSize: 13.5,
                              lineHeight: 1.65,
                              marginBottom: 12,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {course.description}
                          </p>
                        )}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          {[
                            course.category,
                            course.level,
                            course.duration && `⏱ ${course.duration}`,
                          ]
                            .filter(Boolean)
                            .map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  fontSize: 12,
                                  padding: "5px 12px",
                                  borderRadius: 8,
                                  background: T.tealDim,
                                  color: T.text,
                                  border: `1px solid ${T.border}`,
                                  fontWeight: 500,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                    <div className="md:self-center flex flex-row md:flex-col items-center gap-3 flex-shrink-0 md:min-w-[130px]">
                      <p
                        style={{
                          fontWeight: 900,
                          fontSize: 20,
                          color: isFree
                            ? T.teal
                            : isPurchased
                              ? T.teal
                              : "white",
                        }}
                      >
                        {isFree
                          ? "Free"
                          : isPurchased
                            ? "Owned"
                            : `৳${course.price}`}
                      </p>
                      <button
                        onClick={() => setActiveCourse(course)}
                        style={{
                          width: "100%",
                          padding: "10px 20px",
                          borderRadius: 12,
                          border: `1px solid ${isAccessible ? T.border : `${glow}44`}`,
                          background: isAccessible ? T.tealDim : `${glow}10`,
                          color: "white",
                          fontSize: 13.5,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.16s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = T.tealMid;
                          e.currentTarget.style.borderColor = T.teal;
                          e.currentTarget.style.color = T.teal;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isAccessible
                            ? T.tealDim
                            : `${glow}10`;
                          e.currentTarget.style.borderColor = isAccessible
                            ? T.border
                            : `${glow}44`;
                          e.currentTarget.style.color = "white";
                        }}
                      >
                        {isAccessible ? (
                          <>
                            <Icon name="play" size={13} />{" "}
                            {isFree ? "Start Free" : "Continue"}
                          </>
                        ) : (
                          <>
                            <Icon name="lock" size={13} /> Unlock
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {visibleCount < filtered.length && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  paddingTop: 16,
                  paddingBottom: 8,
                }}
              >
                <p
                  style={{
                    color: T.textDim,
                    fontSize: "0.8rem",
                    fontWeight: 500,
                  }}
                >
                  Showing{" "}
                  <span style={{ color: T.text, fontWeight: 700 }}>
                    {Math.min(visibleCount, filtered.length)}
                  </span>{" "}
                  of{" "}
                  <span style={{ color: T.text, fontWeight: 700 }}>
                    {filtered.length}
                  </span>{" "}
                  courses
                </p>
                <button
                  onClick={() => setVisibleCount((v) => v + PER_PAGE)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "13px 28px",
                    borderRadius: 14,
                    background: T.tealDim,
                    border: `1px solid ${T.border}`,
                    color: T.teal,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = T.tealMid;
                    e.currentTarget.style.borderColor = T.teal;
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = T.tealDim;
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.color = T.teal;
                  }}
                >
                  Load more courses
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      marginTop: 1,
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <svg
                        key={i}
                        width={13}
                        height={7}
                        viewBox="0 0 24 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          animation: `chevFade 1.2s ease-in-out ${i * 0.16}s infinite`,
                          display: "block",
                        }}
                      >
                        <polyline points="2 2 12 10 22 2" />
                      </svg>
                    ))}
                  </span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {activeCourse && (
        <CourseDrawer
          course={activeCourse}
          isPurchased={purchasedCourses.includes(String(activeCourse.id))}
          onClose={() => {
            setActiveCourse(null);
            // drawer বন্ধ হলে fresh copy নাও
            setPurchasedCourses([...getPurchasedCourses()]);
          }}
        />
      )}

      {successToast && (
        <PaymentSuccessToast
          courseName={successToast.courseName}
          onClose={() => setSuccessToast(null)}
        />
      )}

      {showScrollArrow && visibleCount < filtered.length && (
        <div
          onClick={() => setVisibleCount((v) => v + PER_PAGE)}
          style={{
            position: "fixed",
            bottom: 40,
            right: 44,
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            opacity: 0.7,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
        >
          {[0, 1, 2].map((i) => (
            <svg
              key={i}
              width={18}
              height={11}
              viewBox="0 0 24 14"
              fill="none"
              stroke={T.teal}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: `chevFade 1.4s ease-in-out ${i * 0.18}s infinite`,
                display: "block",
              }}
            >
              <polyline points="2 2 12 12 22 2" />
            </svg>
          ))}
        </div>
      )}

      <style>{`
        @keyframes drawerIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes chevFade { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        @keyframes spinAnim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes toastIn  { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>
    </div>
  );
}
