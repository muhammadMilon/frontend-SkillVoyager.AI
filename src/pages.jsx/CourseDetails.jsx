import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import courses from "../../data/coursesData";

// ── getCourseColor (same as CoursesPage) ──────────────────────────────────────
const getCourseColor = (course) => {
  const map = {
    "AI/ML":                    "from-violet-600 to-purple-800",
    "TypeScript":               "from-blue-600 to-indigo-800",
    "React":                    "from-indigo-500 to-violet-700",
    "Backend Development":      "from-orange-600 to-red-800",
    "Web Development":          "from-cyan-600 to-blue-800",
    "Microservices":            "from-emerald-600 to-teal-800",
    "API Design":               "from-pink-600 to-rose-800",
    "Authorization":            "from-red-700 to-rose-900",
    "Design System":            "from-teal-600 to-cyan-800",
    "Performance Optimization": "from-amber-600 to-orange-800",
  };
  return map[course?.category] || "from-zinc-600 to-zinc-800";
};

// ── Icons ──────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, className = "" }) => {
  const icons = {
    check:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    close:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    lock:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    credit:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    play:    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    back:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
    clock:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    bar:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    book:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    star:    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    sparkle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
    shield:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    infinite:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z"/><path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/></svg>,
  };
  return <span className={`inline-flex ${className}`}>{icons[name] || null}</span>;
};

// ── Payment Modal ─────────────────────────────────────────────────────────────
const PaymentModal = ({ course, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1=form 2=processing 3=success
  const [form, setForm] = useState({ card: "", expiry: "", cvv: "", name: "" });
  const [errors, setErrors] = useState({});
  const color = getCourseColor(course);

  const fmtCard   = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExpiry = v => { const d = v.replace(/\D/g,"").slice(0,4); return d.length > 2 ? d.slice(0,2)+"/"+d.slice(2) : d; };

  const validate = () => {
    const e = {};
    if (form.card.replace(/\s/g,"").length < 16) e.card   = "Invalid card number";
    if (form.expiry.length < 5)                  e.expiry = "Invalid expiry date";
    if (form.cvv.length < 3)                     e.cvv    = "Invalid CVV";
    if (!form.name.trim())                       e.name   = "Name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setStep(2);
    setTimeout(() => setStep(3), 2400);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.88)" }}>
      <div className="relative w-full max-w-md bg-[#0d1117] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">

        {/* Gradient header */}
        <div className={`bg-gradient-to-r ${color} p-6`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-1">Secure Checkout</p>
              <h3 className="text-white font-bold text-lg leading-snug line-clamp-2">{course.title}</h3>
            </div>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors ml-4 flex-shrink-0">
              <Icon name="close" size={20}/>
            </button>
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-white/60 text-xs">Total Amount</p>
              <p className="text-white font-black text-3xl mt-0.5">৳{course.price || 499}</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-xs">One-time · Lifetime access</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1 — Form */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-400/8 border border-emerald-400/20 rounded-xl px-3 py-2.5 mb-5">
                <Icon name="shield" size={14}/> 256-bit SSL encrypted · Your data is safe
              </div>

              {/* Card number */}
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1.5 block">Card Number</label>
                <div className="relative">
                  <input
                    value={form.card}
                    onChange={e => setForm(f => ({ ...f, card: fmtCard(e.target.value) }))}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full bg-[#161b27] border ${errors.card ? "border-red-500/70" : "border-zinc-700/60"} rounded-xl py-3 px-4 pr-12 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-700`}
                  />
                  <Icon name="credit" size={16} className="absolute right-4 top-3.5 text-gray-600"/>
                </div>
                {errors.card && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><Icon name="close" size={10}/>{errors.card}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 font-semibold mb-1.5 block">Expiry Date</label>
                  <input
                    value={form.expiry}
                    onChange={e => setForm(f => ({ ...f, expiry: fmtExpiry(e.target.value) }))}
                    placeholder="MM/YY"
                    className={`w-full bg-[#161b27] border ${errors.expiry ? "border-red-500/70" : "border-zinc-700/60"} rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-700`}
                  />
                  {errors.expiry && <p className="text-red-400 text-xs mt-1.5">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold mb-1.5 block">CVV</label>
                  <input
                    value={form.cvv}
                    onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g,"").slice(0,4) }))}
                    placeholder="•••"
                    type="password"
                    className={`w-full bg-[#161b27] border ${errors.cvv ? "border-red-500/70" : "border-zinc-700/60"} rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-700`}
                  />
                  {errors.cvv && <p className="text-red-400 text-xs mt-1.5">{errors.cvv}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1.5 block">Cardholder Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Rahim Uddin"
                  className={`w-full bg-[#161b27] border ${errors.name ? "border-red-500/70" : "border-zinc-700/60"} rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-700`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
              </div>

              <button
                onClick={handlePay}
                className={`w-full mt-2 py-3.5 rounded-xl font-bold text-white text-sm bg-gradient-to-r ${color} hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2`}
              >
                <Icon name="lock" size={15}/> Pay ৳{course.price || 499} Securely
              </button>

              <p className="text-center text-xs text-gray-700 leading-relaxed">
                By completing this purchase you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          )}

          {/* Step 2 — Processing */}
          {step === 2 && (
            <div className="py-14 flex flex-col items-center gap-5">
              <div className={`w-16 h-16 rounded-full border-2 border-t-transparent animate-spin`}
                style={{ borderColor: "rgba(99,102,241,0.3)", borderTopColor: "transparent" }}
              />
              <div className="text-center">
                <p className="text-white font-bold text-lg">Processing payment...</p>
                <p className="text-gray-500 text-sm mt-1">Please don't close this window</p>
              </div>
            </div>
          )}

          {/* Step 3 — Success */}
          {step === 3 && (
            <div className="py-12 flex flex-col items-center gap-5 text-center">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <Icon name="check" size={32} className="text-white"/>
              </div>
              <div>
                <h3 className="text-white font-black text-2xl mb-2">Payment Successful!</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  You're now enrolled in<br/>
                  <span className="text-white font-semibold">{course.title}</span>
                </p>
              </div>
              <button
                onClick={() => { onSuccess(); onClose(); }}
                className={`mt-2 px-10 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r ${color} hover:opacity-90 transition-opacity`}
              >
                Start Learning →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── CourseDetails Page ─────────────────────────────────────────────────────────
export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find(c => c.id.toString() === id.toString());

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#07090f] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Course not found.</p>
          <button onClick={() => navigate("/courses")} className="text-indigo-400 hover:text-indigo-300 text-sm">
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const color = getCourseColor(course);
  const isFree = !course.price || course.price === 0;

  const handleEnroll = () => {
    if (isFree) {
      setIsEnrolled(true);
    } else {
      setShowPayment(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090f] text-white">
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-900/8 rounded-full blur-3xl"/>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-[160px] pb-20">

        {/* Back button */}
        <button
          onClick={() => navigate("/courses")}
          className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors mb-10 group"
        >
          <Icon name="back" size={16} className="group-hover:-translate-x-0.5 transition-transform"/>
          Back to Courses
        </button>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left — video + learn */}
          <div className="lg:col-span-2">

            {/* Video area */}
            <div className="rounded-2xl overflow-hidden mb-8 border border-zinc-800/60">
              {isEnrolled && course.videoId ? (
                <div className="aspect-video">
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${course.videoId}`}
                    controls
                    width="100%"
                    height="100%"
                    config={{ youtube: { playerVars: { showinfo: 1 } } }}
                  />
                </div>
              ) : (
                <div className={`aspect-video bg-gradient-to-br ${color} flex flex-col items-center justify-center gap-4 relative overflow-hidden`}>
                  {/* blurred preview thumbnail if available */}
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm scale-105"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center">
                      <Icon name="lock" size={24} className="text-white/70"/>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold text-lg">Enroll to Access</p>
                      <p className="text-white/50 text-sm mt-1">
                        {isFree ? "This course is free — enroll now!" : "Purchase this course to unlock all content"}
                      </p>
                    </div>
                    <button
                      onClick={handleEnroll}
                      className="bg-white text-gray-900 font-bold text-sm px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      {isFree ? "Enroll Free" : `Enroll Now — ৳${course.price || 499}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Title + tags */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[11px] font-bold uppercase tracking-widest ${isFree ? 'text-emerald-400' : 'text-orange-400'}`}>
                  {isFree ? 'FREE' : 'PREMIUM'}
                </span>
                {isEnrolled && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                    <Icon name="check" size={11}/> Enrolled
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black leading-tight mb-4">{course.title}</h1>
              <p className="text-gray-400 leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-[11px] bg-zinc-800/80 text-gray-400 px-3 py-1.5 rounded-lg border border-zinc-700/40">
                  {course.category}
                </span>
              </div>
            </div>

            {/* What You'll Learn */}
            {course.learn && course.learn.length > 0 && (
              <div className="bg-[#11141b] border border-zinc-800/50 rounded-2xl p-6">
                <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                  <Icon name="sparkle" size={18} className="text-indigo-400"/> What You'll Learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.learn.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon name="check" size={11} className="text-white"/>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — course info sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Main card */}
              <div className="bg-[#11141b] border border-zinc-800/60 rounded-2xl overflow-hidden">
                {/* Thumbnail strip */}
                <div className={`h-36 bg-gradient-to-br ${color} relative overflow-hidden`}>
                  {course.thumbnail && (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-60"/>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center">
                      <Icon name="play" size={18} className="text-white ml-0.5"/>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {/* Price */}
                  <div className="flex items-end gap-2 mb-5">
                    <span className={`font-black text-3xl ${isFree ? "text-emerald-400" : "text-white"}`}>
                      {isFree ? "Free" : `৳${course.price || 499}`}
                    </span>
                    {!isFree && <span className="text-gray-600 text-sm line-through mb-1">৳999</span>}
                  </div>

                  {/* Enroll button */}
                  {isEnrolled ? (
                    <div className="w-full py-3.5 rounded-xl font-bold text-emerald-400 text-sm bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center gap-2">
                      <Icon name="check" size={16}/> You're Enrolled!
                    </div>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className={`w-full py-3.5 rounded-xl font-bold text-white text-sm bg-gradient-to-r ${color} hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2`}
                    >
                      {isFree ? (
                        <><Icon name="play" size={15}/> Enroll for Free</>
                      ) : (
                        <><Icon name="lock" size={15}/> Enroll Now</>
                      )}
                    </button>
                  )}

                  {/* Guarantees */}
                  <div className="mt-4 space-y-2">
                    {[
                      { icon: "infinite", text: "Lifetime access" },
                      { icon: "shield",   text: "Secure payment" },
                      { icon: "star",     text: "Certificate on completion" },
                    ].map(item => (
                      <div key={item.text} className="flex items-center gap-2.5 text-xs text-gray-600">
                        <Icon name={item.icon} size={13} className="text-gray-600"/>
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-[#11141b] border border-zinc-800/60 rounded-2xl p-5">
                <h3 className="text-white font-bold text-sm mb-4">Course Info</h3>
                <div className="space-y-3">
                  {[
                    { icon: "bar",   label: "Level",    value: course.level    || "Intermediate" },
                    { icon: "book",  label: "Category", value: course.category || "—" },
                    { icon: "clock", label: "Duration", value: course.duration || "N/A" },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Icon name={s.icon} size={14}/>
                        {s.label}
                      </div>
                      <span className="text-white text-sm font-medium">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          course={course}
          onClose={() => setShowPayment(false)}
          onSuccess={() => setIsEnrolled(true)}
        />
      )}
    </div>
  );
}