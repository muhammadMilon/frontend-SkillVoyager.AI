import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Award,
  Bookmark,
  BookOpen,
  Brain,
  BrainCircuit,
  ChevronDown,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Map,
  Megaphone,
  Menu,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Trophy,
  User,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";
import { AuthContext } from "../providers/AuthProvider";
import { useTheme } from "../providers/ThemeProvider";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, dbUser, loading, logOut } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [roadmapDropdownOpen, setRoadmapDropdownOpen] = useState(false);
  const [mobileRoadmapOpen, setMobileRoadmapOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [hasLiveSession, setHasLiveSession] = useState(false);
  const [hasNewNews, setHasNewNews] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [mobileView, setMobileView] = useState("nav"); // 'nav' or 'profile'

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const API_BASE =
          import.meta.env.VITE_API_URL ||
          "https://backend-skill-voyager-ai.vercel.app";

        // Check live sessions
        const sessionRes = await axios.get(`${API_BASE}/api/sessions`);
        if (sessionRes.data.success) {
          setHasLiveSession(
            sessionRes.data.sessions.some((s) => s.status === "live"),
          );
        }

        // Check latest news
        const newsRes = await axios.get(`${API_BASE}/api/announcements/latest`);
        if (newsRes.data.success && newsRes.data.announcement) {
          const lastRead = localStorage.getItem("last_read_news");
          if (lastRead !== newsRes.data.announcement._id) {
            setHasNewNews(true);
          }
        }

        // Check bookmarks
        if (user?.uid) {
          const bmRes = await axios.get(
            `${API_BASE}/api/user/bookmarks/${user.uid}`,
          );
          if (bmRes.data.success) {
            const count =
              (bmRes.data.data.tips?.length || 0) +
              (bmRes.data.data.resources?.length || 0);
            setBookmarkCount(count);
          }
        }
      } catch (err) {
        console.error("Status check fail:", err);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every 1m
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setRoadmapDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const roadmapSubLinks = [
    {
      name: "AI Quiz",
      path: "/quiz/generate",
      icon: <BrainCircuit className="w-4 h-4" />,
      desc: "Test your knowledge",
    },
    {
      name: "Skill Gap",
      path: "/skill-gap",
      icon: <Brain className="w-4 h-4" />,
      desc: "Identify missing skills",
    },
  ];

  const isRoadmapActive =
    location.pathname === "/roadmap/generate" ||
    roadmapSubLinks.some((l) => location.pathname === l.path);

  const isAdmin = dbUser?.role === "admin";

  const mainNavLinks = user
    ? [
        {
          name: "Courses",
          path: "/courses",
          icon: <GraduationCap className="w-[26px] h-[26px]" />,
        },
        {
          name: "Leaderboard",
          path: "/leaderboard",
          icon: <Award className="w-[26px] h-[26px]" />,
        },
        {
          name: isAdmin ? "Admin Panel" : "Dashboard",
          path: isAdmin ? "/admin-dashboard" : "/dashboard",
          icon: isAdmin ? (
            <ShieldCheck className="w-[26px] h-[26px]" />
          ) : (
            <LayoutDashboard className="w-[26px] h-[26px]" />
          ),
        },
      ]
    : [
        {
          name: "Home",
          path: "/",
          icon: <Home className="w-[26px] h-[26px]" />,
        },
        {
          name: "About Us",
          path: "/about",
          icon: <Users className="w-[26px] h-[26px]" />,
        },
        {
          name: "Contact",
          path: "/contact",
          icon: <Mail className="w-[26px] h-[26px]" />,
        },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&display=swap');

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-flow { background-size: 300% 300%; animation: gradientFlow 5s ease infinite; }

        @keyframes goldenShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .golden-shimmer {
          background: linear-gradient(105deg, #b8860b 0%, #d4a017 20%, #f5d060 35%, #fff0a0 50%, #f5d060 65%, #d4a017 80%, #b8860b 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: goldenShimmer 3.5s linear infinite;
        }

        @keyframes activeUnderlineFlow {
          0%   { background-position: 0% 50%;   box-shadow: 0 0 8px rgba(212,160,23,0.5); }
          50%  { background-position: 100% 50%; box-shadow: 0 0 14px rgba(245,208,96,0.8); }
          100% { background-position: 0% 50%;   box-shadow: 0 0 8px rgba(212,160,23,0.5); }
        }
        .active-link-underline::after {
          content: '';
          position: absolute; bottom: -4px; left: 0;
          width: 100%; height: 2px;
          background: linear-gradient(90deg, #b8860b, #f5d060, #fff0a0, #f5d060, #b8860b);
          background-size: 200% 100%; border-radius: 2px;
          animation: activeUnderlineFlow 3s ease-in-out infinite;
        }
        .hover-link-underline::after {
          content: ''; position: absolute; bottom: -4px; left: 0;
          width: 0; height: 2px;
          background: linear-gradient(90deg, #d4a017, #f5d060);
          border-radius: 2px; transition: width 0.3s ease;
          box-shadow: 0 0 8px rgba(245,208,96,0.6);
        }
        .hover-link-underline:hover::after { width: 100%; }

        @keyframes iconGoldenPulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(212,160,23,0.5)); }
          50%       { filter: drop-shadow(0 0 10px rgba(245,208,96,0.9)); }
        }
        .active-icon-pulse { animation: iconGoldenPulse 2s ease-in-out infinite; }

        @keyframes goldenRingPulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(212,160,23,0.3), 0 0 6px rgba(212,160,23,0.1); }
          50%       { box-shadow: 0 0 0 1px rgba(245,208,96,0.5), 0 0 10px rgba(245,208,96,0.2); }
        }
        .golden-avatar-ring {
          border: 1px solid transparent;
          background: linear-gradient(#102f42, #102f42) padding-box,
                      linear-gradient(135deg, #b8860b, #f5d060, #b8860b) border-box;
          animation: goldenRingPulse 2.5s ease-in-out infinite;
        }

        .golden-dropdown-item:hover {
          background: linear-gradient(90deg, rgba(212,160,23,0.12), rgba(245,208,96,0.06));
          color: #f5d060;
        }

        /* ── UPDATED BG — matches hero dark teal-navy ── */
        .navbar-bg-scrolled {
          background: linear-gradient(135deg, #0d2d3f 0%, #102f42 50%, #123348 100%);
          box-shadow: 0 4px 30px rgba(0,0,0,0.5), 0 1px 0 rgba(212,160,23,0.15);
        }
        .navbar-bg-top {
          background: linear-gradient(135deg, #0d2d3f 0%, #102f42 55%, #123348 100%);
          box-shadow: 0 10px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(212,160,23,0.1);
        }

        .golden-join-btn {
          background: linear-gradient(135deg, #b8860b 0%, #d4a017 30%, #f5d060 55%, #d4a017 80%, #b8860b 100%);
          background-size: 200% auto;
          color: #0a0f1a; font-weight: 800; letter-spacing: 0.03em;
          transition: all 0.3s ease;
          animation: goldenShimmer 4s linear infinite;
        }
        .golden-join-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(212,160,23,0.5), 0 2px 8px rgba(0,0,0,0.4);
        }

        .logo-text { font-family: 'Cinzel', serif; }

        .mobile-active-item {
          background: linear-gradient(90deg, rgba(212,160,23,0.12), rgba(212,160,23,0.04));
          border-left: 3px solid #d4a017; color: #f5d060;
          box-shadow: inset 0 0 20px rgba(212,160,23,0.08);
        }

        .roadmap-dropdown {
          background: linear-gradient(160deg, #0d2d3f 0%, #102f42 100%);
          border: 1px solid rgba(212,160,23,0.25);
          box-shadow: 0 16px 48px rgba(0,0,0,0.6), 0 0 24px rgba(212,160,23,0.06);
        }
        .roadmap-sub-item {
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .roadmap-sub-item:hover {
          background: linear-gradient(135deg, rgba(212,160,23,0.1), rgba(212,160,23,0.04));
          border-color: rgba(212,160,23,0.2);
          transform: translateX(3px);
        }
        .roadmap-sub-item:hover .sub-icon { color: #f5d060; }

        .chevron-transition { transition: transform 0.25s ease; }
      `}</style>

      <nav
        className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 backdrop-blur-xl ${scrolled ? "navbar-bg-scrolled" : "navbar-bg-top"}`}
      >
        <div className="max-w-[1350px] mx-auto px-4 md:px-10 lg:px-[70px] py-[14px]">
          <div className="flex items-center justify-between">
            {/* ── Logo ── */}
            <Link to="/" className="flex items-center group cursor-pointer">
              <img
                src={logoImg}
                alt="Logo"
                className="w-[60px] h-[60px] md:w-[72px] md:h-[72px] object-contain -mr-3"
              />
              <span className="logo-text text-[1.2rem] md:text-[1.45rem] font-black text-white tracking-[0.06em] whitespace-nowrap [text-shadow:0_2px_20px_rgba(0,0,0,0.6)] group-hover:tracking-[0.1em] transition-all duration-500">
                <span
                  style={{
                    color: "#d4a017",
                    fontSize: "0.8em",
                    opacity: 0.7,
                    fontWeight: 400,
                  }}
                >
                  〈
                </span>
                Skill<span className="golden-shimmer">Voyager</span>
                <span
                  style={{
                    color: "#d4a017",
                    fontSize: "0.8em",
                    opacity: 0.7,
                    fontWeight: 400,
                  }}
                >
                  〉
                </span>
                <span
                  style={{
                    color: "#f5d060",
                    fontSize: "0.65em",
                    letterSpacing: "0.08em",
                    fontWeight: 700,
                    marginLeft: "1px",
                    verticalAlign: "middle",
                    opacity: 0.9,
                  }}
                >
                  .AI
                </span>
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden lg:flex items-center gap-8">
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setRoadmapDropdownOpen((p) => !p)}
                    className={`relative flex items-center gap-2.5 text-[0.94rem] font-semibold tracking-wide transition-all duration-300 ${
                      isRoadmapActive
                        ? "text-[#f5d060] [text-shadow:0_0_12px_rgba(245,208,96,0.5)] active-link-underline"
                        : "text-slate-300 hover:text-[#f5d060] hover:[text-shadow:0_0_8px_rgba(212,160,23,0.4)] hover-link-underline"
                    }`}
                  >
                    <span
                      className={
                        isRoadmapActive
                          ? "text-[#f5d060] active-icon-pulse"
                          : "text-slate-400"
                      }
                    >
                      <Map className="w-[26px] h-[26px]" />
                    </span>
                    Roadmap
                    <ChevronDown
                      className={`w-5 h-5 chevron-transition ${roadmapDropdownOpen ? "rotate-180 text-[#f5d060]" : "text-slate-400"}`}
                    />
                  </button>

                  <AnimatePresence>
                    {roadmapDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 w-[320px] rounded-2xl overflow-hidden roadmap-dropdown z-[1002]"
                      >
                        <div
                          className="h-[2px] w-full"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, #d4a017, #f5d060, #d4a017, transparent)",
                          }}
                        />
                        <div className="p-4 space-y-2">
                          <Link
                            to="/roadmap/generate"
                            onClick={() => setRoadmapDropdownOpen(false)}
                            className="roadmap-sub-item flex items-center gap-3 px-4 py-3.5 rounded-xl group/item"
                          >
                            <span
                              className="sub-icon flex items-center justify-center w-10 h-10 rounded-lg text-[#d4a017] transition-colors duration-200"
                              style={{
                                background: "rgba(212,160,23,0.1)",
                                border: "1px solid rgba(212,160,23,0.15)",
                              }}
                            >
                              <Map className="w-5 h-5" />
                            </span>
                            <div>
                              <div className="text-[15px] font-bold text-slate-200 group-hover/item:text-[#f5d060] transition-colors">
                                Generate Roadmap
                              </div>
                              <div className="text-[12.5px] text-slate-400">
                                Build your learning path
                              </div>
                            </div>
                          </Link>
                          <div
                            className="mx-2 my-1 h-[1px]"
                            style={{ background: "rgba(212,160,23,0.12)" }}
                          />
                          {roadmapSubLinks.map((sub) => (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              onClick={() => setRoadmapDropdownOpen(false)}
                              className="roadmap-sub-item flex items-center gap-3 px-4 py-3.5 rounded-xl group/item"
                            >
                              <span
                                className={`sub-icon flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 ${isActive(sub.path) ? "text-[#f5d060]" : "text-[#d4a017]"}`}
                                style={{
                                  background: "rgba(212,160,23,0.1)",
                                  border: `1px solid ${isActive(sub.path) ? "rgba(245,208,96,0.3)" : "rgba(212,160,23,0.15)"}`,
                                }}
                              >
                                {sub.icon}
                              </span>
                              <div>
                                <div
                                  className={`text-[15px] font-bold transition-colors ${isActive(sub.path) ? "text-[#f5d060]" : "text-slate-200 group-hover/item:text-[#f5d060]"}`}
                                >
                                  {sub.name}
                                </div>
                                <div className="text-[12.5px] text-slate-400">
                                  {sub.desc}
                                </div>
                              </div>
                              {isActive(sub.path) && (
                                <span
                                  className="ml-auto w-1.5 h-1.5 rounded-full bg-[#f5d060]"
                                  style={{ boxShadow: "0 0 6px #f5d060" }}
                                />
                              )}
                            </Link>
                          ))}
                        </div>
                        <div
                          className="h-[1px] w-full"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {mainNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-2.5 text-[0.94rem] font-semibold tracking-wide transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-[#f5d060] [text-shadow:0_0_12px_rgba(245,208,96,0.5)] active-link-underline"
                      : "text-slate-300 hover:text-[#f5d060] hover:[text-shadow:0_0_8px_rgba(212,160,23,0.4)] hover-link-underline"
                  }`}
                >
                  <span
                    className={
                      isActive(link.path)
                        ? "text-[#f5d060] active-icon-pulse"
                        : "text-slate-400"
                    }
                  >
                    {link.icon}
                  </span>
                  {link.name}
                </Link>
              ))}
            </div>

            {/* ── User Actions ── */}
            <div className="hidden lg:flex items-center gap-4">
              {loading ? (
                <div className="w-10 h-10 rounded-full border-2 border-[#d4a017] border-t-transparent animate-spin"></div>
              ) : user ? (
                <>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full border border-slate-700/50 hover:bg-slate-800/50 transition-colors mr-1"
                    data-theme-ignore
                    title="Toggle Theme"
                  >
                    {theme === "dark" ? (
                      <Sun className="w-[20px] h-[20px] text-yellow-500" />
                    ) : (
                      <Moon className="w-[20px] h-[20px] text-slate-800" />
                    )}
                  </button>
                  <NotificationBell />
                  {!isAdmin && (
                    <div className="relative group/user flex items-center">
                      <Link
                        to={
                          dbUser?.role === "admin"
                            ? "/admin-dashboard"
                            : "/dashboard"
                        }
                        className="flex items-center gap-2.5 p-1 rounded-full golden-avatar-ring hover:bg-[#d4a017]/10 transition-all group-hover/user:pr-4"
                      >
                        <img
                          src={
                            user.photoURL ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=b8860b&color=fff`
                          }
                          alt="User"
                          className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=b8860b&color=fff`;
                          }}
                        />
                        <span className="hidden group-hover/user:block text-sm font-bold text-[#f5d060] whitespace-nowrap tracking-wide">
                          {user.displayName?.split(" ")[0] || "Profile"}
                        </span>
                      </Link>

                      <div
                        className="absolute top-[calc(100%+14px)] right-0 w-[400px] border rounded-2xl overflow-hidden opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 transform origin-top-right group-hover/user:scale-100 scale-95 z-[1001]"
                        style={{
                          background:
                            "linear-gradient(165deg, #071320 0%, #0d2d3f 100%)",
                          borderColor: "rgba(212,160,23,0.3)",
                          boxShadow:
                            "0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(212,160,23,0.06)",
                        }}
                      >
                        {/* Minimal Header */}
                        <div
                          className="px-5 py-3.5 border-b flex items-center gap-3 relative overflow-hidden"
                          style={{ borderColor: "rgba(212,160,23,0.15)" }}
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4a017]/5 rounded-full -mr-8 -mt-8 blur-2xl" />
                          <div className="w-11 h-11 rounded-full p-0.5 golden-avatar-ring flex-shrink-0">
                            <img
                              src={
                                user.photoURL ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=b8860b&color=fff`
                              }
                              alt="User"
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[15px] font-bold text-white truncate leading-tight flex items-center gap-2">
                              {user.displayName || "Learner"}
                              {isAdmin && (
                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-[#d4a017]/15 text-[#f5d060] border border-[#d4a017]/25 uppercase tracking-wider">
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-bold text-[#f5d060]/60 uppercase tracking-tight mt-0.5">
                              {isAdmin
                                ? "System Administrator"
                                : `ID: ${dbUser?.studentId || (dbUser?.uid ? `WEB12-${dbUser.uid.substring(0, 4).toUpperCase()}` : "PENDING")}`}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate("/settings");
                            }}
                            className="relative z-[2000] cursor-pointer text-[10px] font-black px-3 py-1.5 rounded-lg bg-[#d4a017]/10 text-[#f5d060] border border-[#d4a017]/20 hover:bg-[#d4a017]/20 transition-all uppercase tracking-wider hover:shadow-[0_0_12px_rgba(212,160,23,0.4)]"
                          >
                            EDIT
                          </button>
                        </div>

                        {/* Compact Stats */}
                        <div
                          className="px-5 py-2.5 bg-white/[0.01] border-b flex items-center justify-between gap-2"
                          style={{ borderColor: "rgba(212,160,23,0.1)" }}
                        >
                          <div className="flex flex-col items-center gap-0.5 flex-1">
                            <span className="text-[9px] font-black text-orange-500/80 flex items-center gap-1 uppercase tracking-tight">
                              <Activity size={10} /> Streak
                            </span>
                            <span className="text-[14px] font-black text-white">
                              {dbUser?.streak || 0}d
                            </span>
                          </div>
                          <div className="h-6 w-[1px] bg-white/5" />
                          <div className="flex flex-col items-center gap-0.5 flex-1">
                            <span className="text-[9px] font-black text-[#f5d060]/80 flex items-center gap-1 uppercase tracking-tight">
                              <Trophy size={10} /> Points
                            </span>
                            <span className="text-[14px] font-black text-white">
                              {dbUser?.points || 0}
                            </span>
                          </div>
                          <div className="h-6 w-[1px] bg-white/5" />
                          <div className="flex flex-col items-center gap-0.5 flex-1">
                            <span className="text-[9px] font-black text-[#a855f7]/80 flex items-center gap-1 uppercase tracking-tight">
                              <Award size={10} /> Rank
                            </span>
                            <span className="text-[12px] font-black text-white truncate w-full text-center leading-none mt-0.5 uppercase">
                              {dbUser?.rank?.split(" ")[0] || "Voyager"}
                            </span>
                          </div>
                        </div>

                        {/* Grid Items */}
                        <div className="p-2 grid grid-cols-2 gap-1.5">
                          {dbUser?.role === "admin" && (
                            <Link
                              to="/admin-dashboard"
                              className="col-span-2 golden-dropdown-item flex items-center gap-2.5 px-3 py-2 text-[#f5d060] font-bold bg-[#d4a017]/5 rounded-xl border border-[#d4a017]/10 transition-all"
                            >
                              <ShieldCheck size={14} />{" "}
                              <span className="text-[12px]">Admin Center</span>
                            </Link>
                          )}
                          {[
                            {
                              label: "My Courses",
                              icon: <BookOpen size={20} />,
                              path: "/courses",
                            },
                            {
                              label: "Actionable Dashboard",
                              icon: <Zap size={20} />,
                              path: "/actionable",
                            },
                            {
                              label: "Roadmap",
                              icon: <Sparkles size={20} />,
                              path: "/onboarding",
                            },
                            {
                              label: "AI Mentor",
                              icon: <Brain size={20} />,
                              path: "/ai-mentor",
                              badge: "New*",
                            },
                            {
                              label: "Sessions",
                              icon: <Video size={20} />,
                              path: "/sessions",
                              isLive: hasLiveSession,
                            },
                            {
                              label: "Leaderboard",
                              icon: <Trophy size={20} />,
                              path: "/leaderboard",
                            },
                            {
                              label: "News",
                              icon: <Megaphone size={20} />,
                              path: "/announcements",
                              isNew: hasNewNews,
                            },
                            {
                              label: "Bookmarks",
                              icon: <Bookmark size={20} />,
                              path: "/bookmarks",
                              count: bookmarkCount,
                            },
                            {
                              label: "Helpdesk",
                              icon: <HelpCircle size={20} />,
                              path: "/helpdesk",
                            },
                            {
                              label: "Settings",
                              icon: <User size={20} />,
                              path: "/settings",
                            },
                          ].map((item, idx) => (
                            <Link
                              key={idx}
                              to={item.path}
                              className="golden-dropdown-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 transition-all"
                            >
                              <span className="text-[#d4a017] opacity-80 flex-shrink-0">
                                {item.icon}
                              </span>
                              <span className="text-[14px] font-bold truncate flex-1 flex items-center gap-1.5">
                                {item.label}
                                {item.isLive && (
                                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[7px] font-black text-red-500 animate-pulse">
                                    <span className="w-1 h-1 rounded-full bg-red-500"></span>{" "}
                                    LIVE
                                  </span>
                                )}
                                {item.isNew && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                                )}
                                {item.count > 0 && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-[#d4a017]/10 text-[#f5d060] text-[8px] font-bold border border-[#d4a017]/20">
                                    {item.count}
                                  </span>
                                )}
                              </span>
                              {item.badge && (
                                <span className="text-[8px] font-bold text-[#a855f7] italic flex-shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>

                        {/* Compact Footer */}
                        <div
                          className="bg-black/20 border-t"
                          style={{ borderColor: "rgba(212,160,23,0.1)" }}
                        >
                          <button
                            onClick={handleLogout}
                            className="flex items-center justify-between w-full px-5 py-3 text-left text-red-500/80 hover:text-red-400 font-bold text-[12px] transition-all hover:bg-red-500/5"
                          >
                            Logout <LogOut size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full border border-slate-700/50 hover:bg-slate-800/50 transition-colors"
                    data-theme-ignore
                    title="Toggle Theme"
                  >
                    {theme === "dark" ? (
                      <Sun className="w-[20px] h-[20px] text-yellow-500" />
                    ) : (
                      <Moon className="w-[20px] h-[20px] text-slate-800" />
                    )}
                  </button>
                  <Link
                    to="/login"
                    className="text-[#d4a017] font-semibold text-[0.92rem] py-2 px-4 rounded-lg border border-[#d4a017]/30 hover:bg-[#d4a017]/10 hover:text-[#f5d060] hover:border-[#d4a017]/60 transition-all tracking-wide"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="golden-join-btn py-2.5 px-6 rounded-xl text-sm shadow-lg active:scale-95"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-full border border-slate-700/50 transition-colors"
                data-theme-ignore
              >
                {theme === "dark" ? (
                  <Sun className="w-[20px] h-[20px] text-yellow-500" />
                ) : (
                  <Moon className="w-[20px] h-[20px] text-slate-800" />
                )}
              </button>
              {user && (
                <>
                  <NotificationBell />
                  <button
                    onClick={() => {
                      if (isOpen && mobileView === "profile") setIsOpen(false);
                      else {
                        setMobileView("profile");
                        setIsOpen(true);
                      }
                    }}
                    className={`p-0.5 rounded-full transition-all ${isOpen && mobileView === "profile" ? "ring-2 ring-[#d4a017]" : "golden-avatar-ring"}`}
                  >
                    <img
                      src={
                        user.photoURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=b8860b&color=fff`
                      }
                      alt="User"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  if (isOpen && mobileView === "nav") setIsOpen(false);
                  else {
                    setMobileView("nav");
                    setIsOpen(true);
                  }
                }}
                className="p-2.5 rounded-xl border transition-all"
                style={{
                  background: "rgba(212,160,23,0.08)",
                  borderColor: "rgba(212,160,23,0.3)",
                  color: "#d4a017",
                }}
              >
                {isOpen && mobileView === "nav" ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #0d2d3f 0%, #102f42 100%)",
                borderColor: "rgba(212,160,23,0.2)",
              }}
            >
              <div className="px-4 py-6 space-y-2">
                {user && mobileView === "profile" && (
                  <>
                    {/* ══ MOBILE PROFILE VIEW ══ */}
                    <div
                      className="mb-4 rounded-2xl overflow-hidden border"
                      style={{
                        background: "rgba(7,19,32,0.4)",
                        borderColor: "rgba(212,160,23,0.2)",
                      }}
                    >
                      <div
                        className="px-5 py-4 flex items-center gap-4 border-b"
                        style={{ borderColor: "rgba(212,160,23,0.15)" }}
                      >
                        <div className="w-12 h-12 rounded-full p-0.5 golden-avatar-ring flex-shrink-0">
                          <img
                            src={
                              user.photoURL ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=b8860b&color=fff`
                            }
                            alt="User"
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[17px] font-bold text-white truncate flex items-center gap-2">
                            {user.displayName || "Learner"}
                            {isAdmin && (
                              <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-[#d4a017]/15 text-[#f5d060] border border-[#d4a017]/25 uppercase tracking-wider">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-black text-[#f5d060]/60 uppercase tracking-wider">
                            {isAdmin
                              ? "System Administrator"
                              : `ID: ${dbUser?.studentId || (dbUser?.uid ? `WEB12-${dbUser.uid.substring(0, 4).toUpperCase()}` : "PENDING")}`}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            navigate("/settings");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#d4a017]/10 text-[#f5d060] border border-[#d4a017]/20 text-[10px] font-black uppercase tracking-widest hover:bg-[#d4a017]/20 transition-all"
                        >
                          EDIT
                        </button>
                      </div>

                      <div className="px-5 py-3 flex items-center justify-between gap-2">
                        <div className="flex flex-col items-center gap-0.5 flex-1">
                          <span className="text-[9px] font-black text-orange-500/80 uppercase tracking-tighter flex items-center gap-1">
                            <Activity size={10} /> Streak
                          </span>
                          <span className="text-[15px] font-black text-white">
                            {dbUser?.streak || 0}d
                          </span>
                        </div>
                        <div className="h-6 w-[1px] bg-white/5" />
                        <div className="flex flex-col items-center gap-0.5 flex-1">
                          <span className="text-[9px] font-black text-[#f5d060]/80 uppercase tracking-tighter flex items-center gap-1">
                            <Trophy size={10} /> Points
                          </span>
                          <span className="text-[15px] font-black text-white">
                            {dbUser?.points || 0}
                          </span>
                        </div>
                        <div className="h-6 w-[1px] bg-white/5" />
                        <div className="flex flex-col items-center gap-0.5 flex-1">
                          <span className="text-[9px] font-black text-[#a855f7]/80 uppercase tracking-tighter flex items-center gap-1">
                            <Award size={10} /> Rank
                          </span>
                          <span className="text-[12px] font-black text-white truncate text-center leading-none mt-0.5 uppercase">
                            {dbUser?.rank?.split(" ")[0] || "Voyager"}
                          </span>
                        </div>
                      </div>

                      {/* full parity with desktop dropdown list */}
                      <div
                        className="grid grid-cols-2 gap-1 p-2 bg-black/10 border-t"
                        style={{ borderColor: "rgba(212,160,23,0.1)" }}
                      >
                        {isAdmin && (
                          <Link
                            to="/admin-dashboard"
                            onClick={() => setIsOpen(false)}
                            className="col-span-2 flex items-center gap-3 px-3 py-3 rounded-xl bg-[#d4a017]/5 border border-[#d4a017]/10 transition-all"
                          >
                            <span className="text-[#f5d060]">
                              <ShieldCheck size={16} />
                            </span>
                            <span className="text-[13px] font-bold text-[#f5d060] truncate flex-1">
                              Admin Dashboard
                            </span>
                          </Link>
                        )}
                        {[
                          {
                            label: "My Courses",
                            icon: <BookOpen size={16} />,
                            path: "/courses",
                          },
                          {
                            label: "Actionable",
                            icon: <Zap size={16} />,
                            path: "/actionable",
                          },
                          {
                            label: "Roadmap",
                            icon: <Sparkles size={16} />,
                            path: "/onboarding",
                          },
                          {
                            label: "AI Mentor",
                            icon: <Brain size={16} />,
                            path: "/ai-mentor",
                            badge: "New*",
                          },
                          {
                            label: "Sessions",
                            icon: <Video size={16} />,
                            path: "/sessions",
                            isLive: hasLiveSession,
                          },
                          {
                            label: "Leaderboard",
                            icon: <Trophy size={16} />,
                            path: "/leaderboard",
                          },
                          {
                            label: "News",
                            icon: <Megaphone size={16} />,
                            path: "/announcements",
                            isNew: hasNewNews,
                          },
                          {
                            label: "Bookmarks",
                            icon: <Bookmark size={16} />,
                            path: "/bookmarks",
                            count: bookmarkCount,
                          },
                          {
                            label: "Helpdesk",
                            icon: <HelpCircle size={16} />,
                            path: "/helpdesk",
                          },
                          {
                            label: "Settings",
                            icon: <User size={16} />,
                            path: "/settings",
                          },
                        ].map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#d4a017]/5 transition-all"
                          >
                            <span className="text-[#d4a017] opacity-80">
                              {item.icon}
                            </span>
                            <span className="text-[13px] font-bold text-slate-300 truncate flex-1">
                              {item.label}
                            </span>
                            {item.isLive && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[7px] font-black text-red-500 animate-pulse">
                                LIVE
                              </span>
                            )}
                            {item.isNew && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                            )}
                            {item.count > 0 && (
                              <span className="px-1 py-0.5 rounded-full bg-[#d4a017]/10 text-[#f5d060] text-[8px] font-bold">
                                {item.count}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {user && mobileView === "nav" && (
                  <>
                    {/* ══ MOBILE NAVIGATION VIEW ══ */}
                    {mainNavLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[0.98rem] font-bold transition-all ${isActive(link.path) ? "mobile-active-item" : "text-slate-400 hover:text-[#d4a017] hover:bg-[#d4a017]/5"}`}
                      >
                        <span
                          className={
                            isActive(link.path)
                              ? "text-[#f5d060] active-icon-pulse"
                              : "text-slate-500"
                          }
                        >
                          {link.icon}
                        </span>
                        {link.name}
                      </Link>
                    ))}

                    {/* Roadmap Tools (Collapsible for sub-links) */}
                    <button
                      onClick={() => setMobileRoadmapOpen((p) => !p)}
                      className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-[0.98rem] font-bold text-slate-400 hover:text-[#d4a017] hover:bg-[#d4a017]/5 transition-all"
                    >
                      <span className="text-slate-500">
                        <Map className="w-[26px] h-[26px]" />
                      </span>
                      <span className="flex-1 text-left">Roadmap Tools</span>
                      <ChevronDown
                        className={`w-5 h-5 chevron-transition ${mobileRoadmapOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileRoadmapOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden ml-4 pl-3 space-y-1"
                          style={{
                            borderLeft: "1px solid rgba(212,160,23,0.2)",
                          }}
                        >
                          <Link
                            to="/roadmap/generate"
                            onClick={() => {
                              setIsOpen(false);
                              setMobileRoadmapOpen(false);
                            }}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[0.95rem] font-semibold transition-all ${isActive("/roadmap/generate") ? "text-[#f5d060]" : "text-slate-400 hover:text-[#d4a017]"}`}
                          >
                            <Map className="w-5 h-5" /> Generate Roadmap
                          </Link>
                          {roadmapSubLinks.map((sub) => (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              onClick={() => {
                                setIsOpen(false);
                                setMobileRoadmapOpen(false);
                              }}
                              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[0.95rem] font-semibold transition-all ${isActive(sub.path) ? "text-[#f5d060]" : "text-slate-400 hover:text-[#d4a017]"}`}
                            >
                              <span
                                className={
                                  isActive(sub.path)
                                    ? "text-[#f5d060]"
                                    : "text-slate-500"
                                }
                              >
                                {sub.icon}
                              </span>
                              {sub.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
                {!user && (
                  <>
                    {mainNavLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[0.98rem] font-bold transition-all ${isActive(link.path) ? "mobile-active-item" : "text-slate-400 hover:text-[#d4a017] hover:bg-[#d4a017]/5"}`}
                      >
                        <span
                          className={
                            isActive(link.path)
                              ? "text-[#f5d060] active-icon-pulse"
                              : "text-slate-500"
                          }
                        >
                          {link.icon}
                        </span>
                        {link.name}
                      </Link>
                    ))}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex justify-center items-center py-3 rounded-xl font-bold transition-all"
                        style={{
                          border: "1px solid rgba(212,160,23,0.4)",
                          color: "#d4a017",
                        }}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="flex justify-center items-center py-3 rounded-xl font-bold golden-join-btn shadow-lg"
                      >
                        Register
                      </Link>
                    </div>
                  </>
                )}
                {user && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-4 mt-6 rounded-xl font-bold text-red-400 transition-all"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                    }}
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
