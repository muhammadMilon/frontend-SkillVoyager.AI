import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Zap, 
  BookOpen, 
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Star,
  MessageCircle,
  Shield,
  Clock
} from "lucide-react";
import bg1 from "../../assets/ai7.png";
import { Link } from "react-router-dom";

const faqs = [
  {
    id: 1,
    question: "How does AI roadmap work?",
    answer:
      "We use advanced Gemini API to analyze your skills and career goals to generate a personalized path. Our AI considers your experience level, learning pace, and industry trends to create the most efficient learning journey.",
    icon: Sparkles,
    color: "from-teal-500 to-cyan-500",
    gradient: "rgba(23, 182, 168, 0.15)",
    stats: "Real-time AI analysis"
  },
  {
    id: 2,
    question: "Is there a free plan?",
    answer:
      "Yes! Our free tier includes one complete AI-generated roadmap and community support. You'll get access to basic features, progress tracking, and can upgrade anytime for premium features like mentorship and advanced analytics.",
    icon: Zap,
    color: "from-yellow-400 to-amber-500",
    gradient: "rgba(245, 200, 66, 0.12)",
    stats: "100+ free users"
  },
  {
    id: 3,
    question: "Can I update my roadmap?",
    answer:
      "Absolutely! Your roadmap is dynamic and can be regenerated anytime as you grow. As you complete milestones or your goals evolve, our AI adapts your path to ensure you're always on the most effective track.",
    icon: BookOpen,
    color: "from-teal-400 to-emerald-500",
    gradient: "rgba(15, 212, 196, 0.12)",
    stats: "Dynamic updates"
  },
  {
    id: 4,
    question: "How do I track progress?",
    answer:
      "Each roadmap includes interactive checkpoints where you can track learning time and completed topics. Get detailed analytics, personalized recommendations, and celebrate achievements with milestone badges.",
    icon: HelpCircle,
    color: "from-cyan-400 to-teal-500",
    gradient: "rgba(23, 182, 168, 0.15)",
    stats: "Progress analytics"
  },
];

const stats = [
  { icon: Star,          label: "98% Satisfaction", value: "2.5k+",  color: "text-yellow-400" },
  { icon: MessageCircle, label: "Active Users",      value: "10k+",   color: "text-teal-400"   },
  { icon: Shield,        label: "AI Accuracy",       value: "99.9%",  color: "text-cyan-400"   },
  { icon: Clock,         label: "Avg. Response",     value: "< 2min", color: "text-teal-300"   }
];

const FAQ = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [hoveredFaq, setHoveredFaq] = useState(null);

  return (
    <section
  id="faq"
  className="relative min-h-screen text-white py-32 px-6 overflow-hidden"
  style={{ background: "linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)" }}
>

      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 -right-20 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "rgba(23,182,168,0.18)" }}
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "rgba(245,200,66,0.10)" }}
        />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at top, rgba(23,182,168,0.08) 0%, transparent 60%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at bottom, rgba(11,29,46,0.6) 0%, transparent 60%)"
        }} />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1440), y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 900), scale: 0 }}
              animate={{ y: [null, -30, 30, -30], opacity: [0, 0.5, 0], scale: [0, 1, 0] }}
              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 2 === 0 ? "#17B6A8" : "#F5C842",
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(23,182,168,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(23,182,168,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl mb-8"
            style={{
              background: "linear-gradient(90deg, rgba(23,182,168,0.12), rgba(15,212,196,0.08))",
              border: "1px solid rgba(23,182,168,0.3)",
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: "#17B6A8" }} />
            <span className="text-sm font-medium" style={{ color: "#17B6A8" }}>
              AI-Powered Support 24/7
            </span>
          </motion.div>

          <h2
            className="font-bold mb-6"
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "clamp(34px, 4.5vw, 54px)",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              fontWeight: 800,
              color: "#fff",
            }}
          >
            Frequently{" "}
            <span style={{ color: "#17B6A8" }}>Asked</span>{" "}
            Questions
          </h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg relative"
            style={{ color: "rgba(255,255,255,0.50)" }}
          >
            <span className="relative inline-block">
              Everything you need to know about our AI-powered platform
              <motion.span 
                animate={{ width: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute bottom-0 left-0 h-[1px]"
                style={{ background: "linear-gradient(90deg, transparent, #17B6A8, transparent)" }}
              />
            </span>
          </motion.p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} className="relative group">
              <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(135deg, rgba(23,182,168,0.2), rgba(15,212,196,0.1))" }} />
              <div className="relative backdrop-blur-xl rounded-2xl p-4 border text-center transition-all duration-300 group-hover:border-teal-500/30"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(23,182,168,0.15)" }}>
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main FAQ Grid */}
        <div className="grid lg:grid-cols-2 gap-8" style={{ alignItems: "stretch" }}>

          {/* Left Column - FAQ List */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* cards wrapper — space-between so last card aligns with Live Chat bottom */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredFaq(faq.id)}
                  onHoverEnd={() => setHoveredFaq(null)}
                  className="relative"
                >
                  <AnimatePresence>
                    {hoveredFaq === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 rounded-3xl blur-2xl"
                        style={{ background: "linear-gradient(135deg, rgba(23,182,168,0.18), rgba(15,212,196,0.12))" }}
                      />
                    )}
                  </AnimatePresence>

                  {/* FAQ Card — bigger padding */}
                  <motion.div
                    onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                    className="relative rounded-3xl cursor-pointer backdrop-blur-xl border transition-all duration-500 group"
                    style={{
                      padding: "28px 32px",           /* ← increased from p-8 (32px) to 28px 32px */
                      background: activeFaq === faq.id ? faq.gradient : "rgba(255,255,255,0.03)",
                      border: activeFaq === faq.id
                        ? "1px solid rgba(23,182,168,0.45)"
                        : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: activeFaq === faq.id ? "0 8px 32px rgba(23,182,168,0.15)" : "none",
                    }}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl"
                      style={{ background: "linear-gradient(135deg, rgba(23,182,168,0.06), transparent)" }} />

                    <motion.div
                      animate={{ rotate: activeFaq === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute -top-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center transition-opacity duration-300 bg-gradient-to-br ${faq.color}
                        ${activeFaq === faq.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </motion.div>

                    <div className="flex items-start gap-5">
                      <div className="relative flex-shrink-0">
                        <div className={`absolute inset-0 bg-gradient-to-br ${faq.color} rounded-2xl blur-xl opacity-50
                          ${activeFaq === faq.id ? 'opacity-100' : 'group-hover:opacity-75'}`} />
                        <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${faq.color}
                          group-hover:scale-110 transition-transform duration-300`}>
                          <faq.icon size={24} className="text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h4 className={`text-xl font-semibold mb-3 transition-all duration-300
                          ${activeFaq === faq.id ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>
                          {faq.question}
                        </h4>

                        <div className="flex items-center gap-2">
                          <span className="text-xs px-3 py-1 rounded-full border"
                            style={{ background: "rgba(23,182,168,0.08)", border: "1px solid rgba(23,182,168,0.2)", color: "rgba(255,255,255,0.50)" }}>
                            {faq.stats}
                          </span>
                        </div>

                        <AnimatePresence>
                          {activeFaq === faq.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <p className="mt-4 text-sm leading-relaxed pt-4 border-t"
                                style={{ color: "rgba(255,255,255,0.65)", borderColor: "rgba(23,182,168,0.2)" }}>
                                {faq.answer}
                              </p>
                              <motion.a
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                href="#"
                                className="inline-flex items-center gap-2 mt-4 text-sm font-semibold transition-colors group/link"
                                style={{ color: "#17B6A8" }}
                              >
                                Learn more
                                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                              </motion.a>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <motion.div 
                      className="absolute bottom-0 left-0 h-1 rounded-b-3xl"
                      style={{ background: "linear-gradient(90deg, #17B6A8, #0fd4c4)" }}
                      initial={{ width: "0%" }}
                      animate={{ width: activeFaq === faq.id ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Image with Floating Elements */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Main Image Card */}
            <div className="relative rounded-[2rem] overflow-hidden group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <img
                  src={bg1}
                  alt="AI Support"
                  className="w-full h-[500px] object-cover rounded-[2rem]"
                />
                <div className="absolute inset-0 rounded-[2rem]"
                  style={{ background: "linear-gradient(to top, #071320 0%, transparent 60%)" }} />
              </motion.div>

              <motion.div
                animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-8 left-8 backdrop-blur-xl rounded-2xl p-4 border"
                style={{ background: "rgba(11,29,46,0.75)", border: "1px solid rgba(23,182,168,0.3)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #17B6A8, #0fd4c4)" }}>
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">AI Assistant</div>
                    <div className="text-xs" style={{ color: "#17B6A8" }}>Online · Ready to help</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute bottom-8 right-8 rounded-2xl p-4 shadow-2xl text-center"
                style={{
                  background: "linear-gradient(135deg, #17B6A8, #0d9e92)",
                  boxShadow: "0 0 32px rgba(23,182,168,0.5)",
                }}
              >
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-white/80">Support</div>
              </motion.div>

              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-8 left-8 backdrop-blur-xl rounded-xl p-3 border"
                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(23,182,168,0.2)" }}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" style={{ color: "#F5C842" }} />
                  <span className="text-sm text-white">Instant responses</span>
                </div>
              </motion.div>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MessageCircle, label: "Live Chat",     time: "< 30s", color: "#17B6A8" },
                { icon: Clock,         label: "Email Support", time: "< 2hr", color: "#F5C842" }
              ].map((item, index) => (
                <motion.div key={index} whileHover={{ y: -5 }} className="relative group">
                  <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "rgba(23,182,168,0.15)" }} />
                  <div className="relative backdrop-blur-xl rounded-2xl p-4 border text-center cursor-pointer transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(23,182,168,0.15)" }}>
                    <item.icon className="w-6 h-6 mx-auto mb-2" style={{ color: item.color }} />
                    <div className="font-semibold text-sm text-white">{item.label}</div>
                    <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>{item.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Trust Badge — outside grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mt-6"
        >
          <div className="inline-flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>
            <Shield size={12} />
            <span>Trusted by 10,000+ professionals worldwide</span>
          </div>
        </motion.div>

        {/* Bottom CTA */}
       <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-24 text-center"
        >
          <div className="relative inline-block group">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"
              style={{ background: "linear-gradient(135deg, #17B6A8, #0d9e92)" }} />
            
            <Link to="/contact-support">   {/* ← Link যোগ করা হয়েছে */}
              <button 
                className="relative px-12 py-5 rounded-full text-white font-semibold text-lg flex items-center gap-3 group-hover:gap-5 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #17B6A8, #0d9e92)",
                  boxShadow: "0 0 40px rgba(23,182,168,0.4)",
                }}
              >
                <span>Still Have Questions?</span>
                <ArrowRight 
                  size={20} 
                  className="group-hover:translate-x-1 transition-transform" 
                />
              </button>
            </Link>
          </div>

          <p className="text-sm mt-4" style={{ color: "rgba(255,255,255,0.30)" }}>
            Our AI support team is available 24/7 to help you
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;