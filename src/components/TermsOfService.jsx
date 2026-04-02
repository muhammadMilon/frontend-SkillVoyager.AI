import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Shield, Scale, Clock, Users, AlertTriangle } from "lucide-react";

const TermsOfService = () => {
  const sections = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Use of Platform",
      color: "from-teal-400 to-cyan-400",
      content: "Users must use SkillVoyager responsibly and in compliance with all applicable laws and regulations. You agree not to misuse, overload, or attempt to gain unauthorized access to any part of the platform."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Account Responsibility",
      color: "from-cyan-400 to-teal-500",
      content: "You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately if you suspect any unauthorized use."
    },
    {
      icon: <Scale className="w-8 h-8" />,
      title: "Intellectual Property",
      color: "from-teal-500 to-emerald-400",
      content: "All content, logos, AI-generated roadmaps, and materials on SkillVoyager are protected by copyright and intellectual property laws. You may not copy, modify, distribute, or create derivative works without our explicit permission."
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Prohibited Activities",
      color: "from-amber-400 to-orange-500",
      content: "You agree not to: upload harmful content, attempt to reverse engineer our AI systems, spam other users, or use the platform for any illegal or unethical purposes."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Changes to Terms",
      color: "from-cyan-400 to-sky-400",
      content: "We may update these Terms of Service from time to time. We will notify you of significant changes. Your continued use of the platform after changes constitutes acceptance of the new terms."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Limitation of Liability",
      color: "from-teal-400 to-cyan-500",
      content: "SkillVoyager and its team are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid us in the past 12 months."
    }
  ];

  return (
    <section
      className="relative min-h-screen text-white overflow-hidden py-28 px-6"
      style={{
        background: "linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)",
      }}
    >
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 right-10 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "rgba(23,182,168,0.15)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full blur-[110px]"
          style={{ background: "rgba(15,212,196,0.10)" }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header - Font Size Reduced */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl mb-6"
               style={{
                 background: "linear-gradient(90deg, rgba(23,182,168,0.12), rgba(15,212,196,0.08))",
                 border: "1px solid rgba(23,182,168,0.25)"
               }}>
            <Sparkles className="w-5 h-5" style={{ color: "#17B6A8" }} />
            <span className="text-sm font-semibold tracking-widest" style={{ color: "#17B6A8" }}>
              LEGAL
            </span>
          </div>

          <h1 
            className="font-black tracking-tighter mb-6"
            style={{
              fontSize: 'clamp(36px, 5vw, 48px)',   // ← Reduced font size (previously 5xl-6xl)
              lineHeight: 1.05,
              color: "#fff"
            }}
          >
            Terms of <span style={{ color: "#17B6A8" }}>Service</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Please read these terms carefully before using SkillVoyager AI. 
            By accessing our platform, you agree to be bound by these terms.
          </p>
        </motion.div>

        {/* Last Updated */}
        <div className="flex justify-center mb-12">
          <div className="px-6 py-2 rounded-full text-sm bg-white/5 border border-white/10 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" />
            <span className="text-gray-400">Last updated: March 27, 2026</span>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-3xl p-8 md:p-10 backdrop-blur-xl border transition-all duration-500 hover:border-teal-500/30"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(23,182,168,0.15)"
              }}
            >
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-teal-500/20`}>
                  {section.icon}
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-[17px]">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 text-center"
        >
          <p className="text-gray-400 text-sm leading-relaxed">
            If you have any questions about these Terms of Service, please contact us at{' '}
            <span className="text-teal-400 font-medium">support@skillvoyager.ai</span>
          </p>
          <p className="text-xs text-gray-500 mt-6">
            © 2026 SkillVoyager AI. All rights reserved.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TermsOfService;