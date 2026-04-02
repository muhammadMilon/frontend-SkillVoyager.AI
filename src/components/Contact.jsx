import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock, 
  Sparkles, 
  MessageSquare,
  Zap 
} from 'lucide-react';
import Navbar from './Navbar';

// EmailJS Config
const EMAILJS_SERVICE_ID          = 'service_nytyq8e';
const EMAILJS_CONTACT_TEMPLATE_ID = 'template_4mc5q7c';
const EMAILJS_PUBLIC_KEY          = 'duQ-tfdMtaYPR4VHR';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill all fields');
      return;
    }

    setSending(true);
    emailjs.init('_bxyo9TWn-uTDIski');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CONTACT_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY
      );

      toast.success("Message sent successfully! We'll get back to you soon 🚀");
      
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSent(true);
      setTimeout(() => setSent(false), 5000);

    } catch (error) {
      console.error('EmailJS error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const contactCards = [
    {
      icon: <MapPin className="w-7 h-7" />,
      title: 'Our Location',
      content: 'Kishorganj, Dhaka',
      description: 'Bangladesh',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: <Phone className="w-7 h-7" />,
      title: 'Phone',
      content: '+880 1712 345678',
      description: '10:00 AM - 8:00 PM',
      color: 'from-amber-400 to-yellow-500'
    },
    {
      icon: <Mail className="w-7 h-7" />,
      title: 'Email',
      content: 'support@skillvoyager.ai',
      description: 'Reply within 24 hours',
      color: 'from-cyan-400 to-teal-500'
    }
  ];

  return (
    <div className="relative min-h-screen text-white overflow-hidden"
         style={{ background: "linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)" }}>

      {/* Animated Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute top-20 -right-32 w-[700px] h-[700px] rounded-full blur-[140px]"
          style={{ background: "rgba(23,182,168,0.18)" }}
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 22, repeat: Infinity }}
          className="absolute -bottom-20 -left-32 w-[700px] h-[700px] rounded-full blur-[140px]"
          style={{ background: "rgba(245,200,66,0.10)" }}
        />
      </div>

      <Navbar />

      <div className="relative z-10 pt-[160px] pb-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">

        {/* Hero Section - Smaller Header Font */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl mb-8"
            style={{
              background: "linear-gradient(90deg, rgba(23,182,168,0.12), rgba(15,212,196,0.08))",
              border: "1px solid rgba(23,182,168,0.3)",
            }}
          >
            <Sparkles className="w-5 h-5" style={{ color: "#17B6A8" }} />
            <span className="text-sm font-medium tracking-wide" style={{ color: "#17B6A8" }}>
              24/7 SUPPORT
            </span>
          </motion.div>

          <h1 
            className="font-black tracking-tighter mb-6"
            style={{
              fontSize: 'clamp(36px, 4.8vw, 52px)',   // ← Smaller & balanced font size
              lineHeight: 1.05,
              color: "#fff"
            }}
          >
            Let's Start a{' '}
            <span style={{ color: "#17B6A8" }}>Conversation</span>
          </h1>

          <p className="text-xl max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            Have questions about SkillVoyager, your AI roadmap, or just want to say hi? 
            We're here for you — 24/7.
          </p>
        </motion.div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {contactCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="group relative rounded-3xl p-8 backdrop-blur-xl border transition-all duration-500 hover:-translate-y-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(23,182,168,0.15)"
              }}
            >
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{ background: `linear-gradient(135deg, rgba(23,182,168,0.08), transparent)` }} />

              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6 text-white shadow-xl shadow-teal-500/30`}>
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
                <p className="text-teal-300 font-semibold text-lg mb-1">{card.content}</p>
                <p className="text-slate-400 text-sm">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Form + Sidebar */}
        <div className="grid lg:grid-cols-5 gap-8">

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-3 rounded-3xl p-8 lg:p-12 backdrop-blur-xl border"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(23,182,168,0.2)"
            }}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Send Us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: "rgba(255,255,255,0.7)"}}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all outline-none"
                    placeholder="Alex Rahman"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: "rgba(255,255,255,0.7)"}}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{color: "rgba(255,255,255,0.7)"}}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all outline-none"
                  placeholder="Roadmap help / Feature request / General inquiry"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{color: "rgba(255,255,255,0.7)"}}>
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={7}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all outline-none resize-none"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              {/* Button - Roadmap Generator Style */}
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={!sending ? { scale: 1.02 } : {}}
                whileTap={!sending ? { scale: 0.98 } : {}}
                className="w-full py-5 px-8 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
                style={{
                  background: 'linear-gradient(to right, #17B6A8, #0fd4c4, #14b8a6)',
                  boxShadow: '0 0 40px rgba(23, 182, 168, 0.5)',
                  color: '#fff'
                }}
              >
                {sending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Message...
                  </>
                ) : sent ? (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Message Sent Successfully ✅
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="lg:col-span-2 rounded-3xl p-8 lg:p-12 backdrop-blur-xl border flex flex-col"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(23,182,168,0.2)"
            }}
          >
            <h3 className="text-3xl font-bold mb-10">Quick Info</h3>

            <div className="space-y-10 flex-1">
              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Response Time</h4>
                  <p className="text-slate-400 leading-relaxed">Usually within 24 hours on business days.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <Zap className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">We're Here For</h4>
                  <p className="text-slate-400 leading-relaxed">Learning doubts, roadmap issues, feature requests, partnerships, or feedback.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs text-emerald-400 font-medium text-center">
                ⚡ Powered by EmailJS — Instant & Secure
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                Every message is read personally by the SkillVoyager team ❤️
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;