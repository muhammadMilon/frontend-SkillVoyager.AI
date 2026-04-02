import React, { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  Eye,
  Sparkles,
  Zap,
  Trophy,
  Clock,
  Megaphone,
  Layout,
  Settings,
} from "lucide-react";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';


const NotificationBell = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const panelRef = useRef(null);

  const userId = user?.uid || "demo-user";

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/api/notifications/${userId}`
      );
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => ((n.id === notificationId || n._id === notificationId) ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/notifications/${userId}/read-all`,
        { method: "PUT" }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("All caught up!");
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        `${API_BASE}/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setNotifications((prev) => prev.filter((n) => (n.id !== notificationId && n._id !== notificationId)));
        if (!notifications.find((n) => (n.id === notificationId || n._id === notificationId))?.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    const id = notification.id || notification._id;
    if (!notification.read) markAsRead(id);
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleActionClick = (e, notification) => {
    e.stopPropagation();
    if (notification.link) {
      if (notification.link.startsWith('http')) {
        window.open(notification.link, '_blank');
      } else {
        navigate(notification.link);
      }
      setIsOpen(false);
    }
  };

  const getNotificationStyles = (type) => {
    const styles = {
      milestone_complete: {
        icon: <Trophy className="w-4 h-4" />,
        color: "text-[#f5d060]",
        bg: "bg-[#d4a017]/15",
        border: "border-[#d4a017]/30",
      },
      new_course: {
        icon: <Layout className="w-4 h-4" />,
        color: "text-sky-400",
        bg: "bg-sky-400/10",
        border: "border-sky-400/20",
      },
      roadmap_update: {
        icon: <Zap className="w-4 h-4" />,
        color: "text-[#f5d060]",
        bg: "bg-[#d4a017]/15",
        border: "border-[#d4a017]/30",
      },
      achievement: {
        icon: <Sparkles className="w-4 h-4" />,
        color: "text-[#f5d060]",
        bg: "bg-[#d4a017]/15",
        border: "border-[#d4a017]/30",
      },
      reminder: {
        icon: <Clock className="w-4 h-4" />,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/20",
      },
      system: {
        icon: <Settings className="w-4 h-4" />,
        color: "text-slate-400",
        bg: "bg-slate-400/10",
        border: "border-slate-400/20",
      },
      default: {
        icon: <Megaphone className="w-4 h-4" />,
        color: "text-[#f5d060]",
        bg: "bg-[#d4a017]/15",
        border: "border-[#d4a017]/30",
      },
    };
    return styles[type] || styles.default;
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <style>{`
        @keyframes bellSwing {
          0%, 100% { transform: rotate(0deg); }
          20%       { transform: rotate(15deg); }
          40%       { transform: rotate(-12deg); }
          60%       { transform: rotate(8deg); }
          80%       { transform: rotate(-5deg); }
        }
        .bell-swing { animation: bellSwing 2.5s ease-in-out infinite; }

        @keyframes goldenPulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(212,160,23,0.5); }
          70%  { box-shadow: 0 0 0 7px rgba(212,160,23,0); }
          100% { box-shadow: 0 0 0 0 rgba(212,160,23,0); }
        }
        .badge-pulse { animation: goldenPulseRing 2s ease-out infinite; }

        .notif-scrollbar::-webkit-scrollbar { width: 4px; }
        .notif-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .notif-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212,160,23,0.3);
          border-radius: 4px;
        }
        .notif-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212,160,23,0.6);
        }

        @keyframes shimmerSweep {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .golden-text-shimmer {
          background: linear-gradient(105deg, #b8860b, #d4a017, #f5d060, #fff0a0, #f5d060, #d4a017, #b8860b);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerSweep 3.5s linear infinite;
        }
      `}</style>

      <div className="relative" ref={panelRef}>

        {/* ── Bell Button ── */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2.5 rounded-xl transition-all duration-300"
          style={{
            background: isOpen
              ? "rgba(212,160,23,0.15)"
              : "rgba(212,160,23,0.08)",
            border: isOpen
              ? "1px solid rgba(212,160,23,0.5)"
              : "1px solid rgba(212,160,23,0.25)",
            boxShadow: isOpen ? "0 0 14px rgba(212,160,23,0.2)" : "none",
          }}
        >
          <Bell
            className={`w-5 h-5 text-[#d4a017] ${isOpen ? "" : "bell-swing"}`}
          />

          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="badge-pulse absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 text-[10px] font-black rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #b8860b, #f5d060)",
                  color: "#0a0f1a",
                  border: "2px solid #0a1628",
                }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* ── Dropdown Panel ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-3 w-[calc(100vw-32px)] sm:w-[390px] max-w-[390px] z-[1002]"
            >
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  background: "linear-gradient(160deg, #08111f 0%, #0c1a30 60%, #0f2040 100%)",
                  border: "1px solid rgba(212,160,23,0.25)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(212,160,23,0.07)",
                }}
              >
                {/* Top golden accent line */}
                <div
                  className="absolute top-0 left-0 w-full h-[1.5px]"
                  style={{
                    background: "linear-gradient(90deg, transparent, #d4a017 30%, #f5d060 50%, #d4a017 70%, transparent)",
                  }}
                />

                {/* ── Header ── */}
                <div
                  className="px-5 py-4 flex items-center justify-between"
                  style={{ borderBottom: "1px solid rgba(212,160,23,0.15)" }}
                >
                  <div>
                    <h3 className="text-[17px] font-black tracking-wide flex items-center gap-2">
                      <span className="golden-text-shimmer">Notifications</span>
                      <Sparkles className="w-4 h-4 text-[#d4a017]" />
                    </h3>
                    <p className="text-[11px] font-semibold text-[#d4a017]/60 mt-0.5 tracking-widest uppercase">
                      {unreadCount} unread
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={markAllAsRead}
                      title="Mark all as read"
                      className="p-2 rounded-lg transition-all"
                      style={{
                        background: "rgba(212,160,23,0.08)",
                        border: "1px solid rgba(212,160,23,0.2)",
                        color: "#d4a017",
                      }}
                    >
                      <CheckCheck className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-lg transition-all"
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        color: "#f87171",
                      }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* ── Body ── */}
                <div className="max-h-[460px] overflow-y-auto notif-scrollbar p-2">
                  {loading && notifications.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="relative w-10 h-10 mx-auto mb-4">
                        <div className="absolute inset-0 border-2 border-[#d4a017]/20 rounded-full" />
                        <div className="absolute inset-0 border-2 border-[#d4a017] border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="text-[11px] font-bold text-[#d4a017]/50 uppercase tracking-widest">
                        Loading...
                      </p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-16 text-center px-8">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                        style={{ background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)" }}
                      >
                        <Bell className="w-7 h-7 text-[#d4a017]/40" />
                      </div>
                      <h4 className="text-[15px] font-black text-slate-300 mb-2 tracking-tight">
                        All Clear
                      </h4>
                      <p className="text-[12px] text-slate-500 leading-relaxed">
                        No new notifications. We'll alert you when something arrives.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {notifications.map((n) => {
                        const { icon, color, bg, border } = getNotificationStyles(n.type);
                        return (
                          <motion.div
                            key={n.id}
                            layout
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(n);
                            }}
                            className="p-3.5 rounded-xl cursor-pointer transition-all duration-300 relative group"
                            style={{
                              background: !n.read
                                ? "rgba(212,160,23,0.06)"
                                : "transparent",
                              border: !n.read
                                ? "1px solid rgba(212,160,23,0.15)"
                                : "1px solid transparent",
                            }}
                            onMouseEnter={(e) => {
                              if (n.read) e.currentTarget.style.background = "rgba(212,160,23,0.05)";
                            }}
                            onMouseLeave={(e) => {
                              if (n.read) e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <div className="flex items-start gap-3.5">
                              {/* Icon */}
                              <div
                                className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${bg} ${color}`}
                                style={{ border: `1px solid`, borderColor: border?.replace("border-", "") }}
                              >
                                {icon}
                              </div>

                              {/* Content */}
                              <div className="flex-grow min-w-0 pr-6">
                                <div className="flex items-center justify-between mb-1">
                                  <h5
                                    className={`text-[13px] font-bold truncate tracking-tight transition-colors ${
                                      !n.read ? "text-[#f5d060]" : "text-slate-400"
                                    } group-hover:text-[#f5d060]`}
                                  >
                                    {n.title}
                                  </h5>
                                  {!n.read && (
                                    <div
                                      className="w-2 h-2 rounded-full shrink-0 ml-2"
                                      style={{
                                        background: "#d4a017",
                                        boxShadow: "0 0 6px rgba(212,160,23,0.8)",
                                      }}
                                    />
                                  )}
                                </div>
                                <p className={`text-[12px] text-slate-400 leading-relaxed transition-all duration-300 ${expandedId === (n.id || n._id) ? "" : "line-clamp-2"}`}>
                                  {n.message}
                                </p>
                                {expandedId === (n.id || n._id) && n.link && (
                                  <motion.button
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={(e) => handleActionClick(e, n)}
                                    className="mt-3 w-full py-2 px-4 rounded-xl bg-indigo-600/20 text-indigo-400 text-[11px] font-black uppercase tracking-widest border border-indigo-500/30 hover:bg-indigo-600/30 transition-all flex items-center justify-center gap-2"
                                  >
                                    Take Action <ExternalLink size={12} />
                                  </motion.button>
                                )}
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {timeAgo(n.createdAt)}
                                  </span>
                                  <span className="text-[10px] font-bold text-[#d4a017] flex items-center gap-1">
                                    {n.link ? <ExternalLink className="w-3 h-3" /> : <Eye className="w-3 h-3" />} 
                                    {expandedId === (n.id || n._id) ? "Collapse" : "View"}
                                  </span>
                                </div>
                              </div>

                              {/* Delete */}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(e, n.id || n._id);
                                }}
                                className="absolute top-3.5 right-3.5 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{
                                  background: "rgba(239,68,68,0.1)",
                                  color: "#f87171",
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── Footer ── */}
                {notifications.length > 0 && (
                  <div
                    className="px-5 py-3 text-center"
                    style={{ borderTop: "1px solid rgba(212,160,23,0.15)" }}
                  >
                    <button
                      onClick={() => { navigate("/notifications"); setIsOpen(false); }}
                      className="text-[11px] font-black uppercase tracking-widest transition-all hover:tracking-[0.18em]"
                      style={{ color: "#d4a017" }}
                    >
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NotificationBell;