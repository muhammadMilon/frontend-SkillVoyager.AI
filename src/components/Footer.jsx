import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "../assets/logo.png";

/* ── Design tokens ── */
const T = {
  heading:  { fontSize: 14, fontWeight: 700, color: "#14b8a6", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 20px" },
  link:     { fontSize: 15.5, fontWeight: 500, color: "rgba(255,255,255,0.72)", textDecoration: "none", transition: "color 0.2s", display: "block", lineHeight: 1 },
  linkGap:  10,
  contactText: { fontSize: 15.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.6 },
  iconSize: 16,
};

const Footer = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap');
      @keyframes footerTealShimmer {
        0%   { background-position: -200% center; }
        100% { background-position:  200% center; }
      }
      .footer-logo-shimmer {
        background: linear-gradient(105deg, #0d9488 0%, #14b8a6 20%, #2dd4bf 35%, #99f6e4 50%, #2dd4bf 65%, #14b8a6 80%, #0d9488 100%);
        background-size: 200% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: footerTealShimmer 3.5s linear infinite;
      }
      .f-link:hover { color: #14b8a6 !important; }
      .f-social:hover {
        background: #14b8a6 !important;
        color: #fff !important;
        border-color: #14b8a6 !important;
        box-shadow: 0 4px 16px rgba(20,184,166,0.35) !important;
        transform: translateY(-2px);
      }
      .f-bottom-link:hover { color: #14b8a6 !important; }
      @media (max-width: 968px) {
        .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
      }
      @media (max-width: 640px) {
        .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        .footer-bottom { flex-direction: column !important; text-align: center !important; }
      }
    `}</style>

    <footer style={{
      background: "linear-gradient(160deg, #040d18 0%, #061524 40%, #081a2d 65%, #040d18 100%)",
      borderTop: "1px solid rgba(20,184,166,0.15)",
      padding: "60px 40px 32px",
      fontFamily: "system-ui, sans-serif",
      position: "relative", overflow: "hidden",
    }}>

      {/* BG effects */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(20,184,166,0.1) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.5 }} />
      <div style={{ position: "absolute", top: -100, left: -100, width: 480, height: 480, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(20,184,166,0.05) 0%, transparent 65%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: -60, right: -60, width: 360, height: 360, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Main grid ── */}
        <div className="footer-grid" style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr 1.1fr",
          gap: 48,
          marginBottom: 52,
          alignItems: "start",
        }}>

          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginTop: -6 }}>
              <img src={logo} alt="SkillVoyager Logo" style={{ width: 52, height: 52, objectFit: "contain", marginRight: -8 }} />
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "0.06em", whiteSpace: "nowrap", textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}>
                <span style={{ color: "#fff" }}>〈</span>
                Skill<span className="footer-logo-shimmer">Voyager</span>
                <span style={{ color: "#14b8a6", opacity: 0.7 }}>〉</span>
                <span style={{ color: "#14b8a6", fontSize: "0.65em", fontWeight: 700, marginLeft: 1, verticalAlign: "middle", opacity: 0.9 }}>.AI</span>
              </span>
            </Link>

            <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, margin: 0 }}>
              Empowering learners with AI-driven personalized roadmaps, career
              alignment, and adaptive learning experiences.
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              {[FaFacebook, FaXTwitter, FaLinkedin, FaGithub, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="f-social" style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: "rgba(20,184,166,0.08)",
                  border: "1px solid rgba(20,184,166,0.20)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.72)",
                  transition: "all 0.25s ease", textDecoration: "none",
                }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 style={T.heading}>Explore</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 13 }}>
              {[
                { name: "About Us", path: "/about" },
                { name: "AI Navigator", path: "/ai-mentor" },
                { name: "Dynamic Roadmaps", path: "/roadmap/generate" },
                { name: "Trending Skills", path: "/trending" },
                { name: "Leaderboard", path: "/leaderboard" }
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className="f-link" style={T.link}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
 
          {/* Support */}
          <div>
            <h4 style={T.heading}>Support</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 13 }}>
              {[
                { name: "Help Center", path: "/helpdesk" },
                { name: "Privacy Policy", path: "#" },
                { name: "Terms of Service", path: "#" },
                { name: "Contact Support", path: "/contact" },
                { name: "FAQ", path: "/" }
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className="f-link" style={T.link}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={T.heading}>Get in Touch</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <MapPin style={{ width: 18, height: 18, color: "#14b8a6", marginTop: 2, flexShrink: 0 }} />
                <span style={T.contactText}>123 AI Street, Digital Ocean,<br />Innovation City, IC 56789</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Mail style={{ width: 18, height: 18, color: "#14b8a6", flexShrink: 0 }} />
                <span style={T.contactText}>support@skillvoyager.ai</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Phone style={{ width: 18, height: 18, color: "#14b8a6", flexShrink: 0 }} />
                <span style={T.contactText}>+1 (234) 567-890</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.30), rgba(20,184,166,0.10), rgba(20,184,166,0.30), transparent)", marginBottom: 24 }} />

        {/* Bottom bar */}
        <div className="footer-bottom" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0, fontWeight: 500 }}>
            © {new Date().getFullYear()} SkillVoyager.AI. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Cookies"].map(item => (
              <a key={item} href="#" className="f-bottom-link" style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}>
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  </>
);

export default Footer;
