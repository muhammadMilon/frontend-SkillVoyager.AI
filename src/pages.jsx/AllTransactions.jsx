import React, { useEffect, useState } from "react";
import useAxiosSecure from "../api/axios";

// ── Theme tokens (same as CoursesPage) ─────────────────────────────────────
const T = {
  bg:        "linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)",
  card:      "#0a1828",
  cardHover: "#0c1e30",
  border:    "rgba(23,182,168,0.14)",
  borderHov: "rgba(23,182,168,0.35)",
  teal:      "#17B6A8",
  tealDim:   "rgba(23,182,168,0.08)",
  tealMid:   "rgba(23,182,168,0.18)",
  cyan:      "#0fd4c4",
  gold:      "#F5C842",
  text:      "rgba(255,255,255,0.72)",
  textDim:   "rgba(255,255,255,0.38)",
  pill:      "rgba(23,182,168,0.10)",
  pillBdr:   "rgba(23,182,168,0.22)",
};

const Icon = ({ name, size = 16, className = "" }) => {
  const icons = {
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  };
  return <span className={`inline-flex ${className}`}>{icons[name] || null}</span>;
};

const AllTransactions = () => {
  const axiosSecure = useAxiosSecure();

  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axiosSecure
      .get("/api/transactions")
      .then(res => setTransactions(res.data))
      .catch(err => console.log(err));
  }, [axiosSecure]);

  const filtered = transactions.filter(t =>
    t.userEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = transactions.reduce(
    (sum, t) => sum + (t.amountPaid || 0),
    0
  );

  const successfulPayments = transactions.filter(t => t.paymentStatus === "paid").length;

  return (
    <div className="min-h-screen text-white" style={{ background: T.bg }}>
      {/* Background glows (same as CoursesPage) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ position: "absolute", top: "-80px", left: "-60px", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(23,182,168,0.10) 0%, transparent 70%)`, filter: "blur(50px)" }} />
        <div style={{ position: "absolute", top: "5%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(15,212,196,0.07) 0%, transparent 70%)`, filter: "blur(60px)" }} />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8 pt-12 pb-16">

        {/* HEADER */}
        <div className="mb-14">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: T.teal }} />
            <span style={{ color: T.teal, fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>ADMIN</span>
            <div style={{ width: 28, height: 2, background: T.teal }} />
          </div>
          <h1 style={{ fontSize: "clamp(34px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, color: "#fff", textAlign: "center", marginBottom: 8 }}>
            All <span style={{ color: T.teal }}>Transactions</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 16, lineHeight: 1.7, textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
            Monitor all course purchases and revenue
          </p>
        </div>

        {/* STATS CARDS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
          marginBottom: 40
        }}>
          <div style={{
            padding: 28,
            borderRadius: 20,
            background: T.card,
            border: `1px solid ${T.border}`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: T.tealDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="shield" size={22} />
              </div>
              <p style={{ fontSize: 13.5, color: T.textDim, fontWeight: 600 }}>TOTAL TRANSACTIONS</p>
            </div>
            <h3 style={{ fontSize: 42, fontWeight: 800, color: "white", margin: 0 }}>{transactions.length}</h3>
          </div>

          <div style={{
            padding: 28,
            borderRadius: 20,
            background: T.card,
            border: `1px solid ${T.border}`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: T.tealDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: T.teal, fontSize: 24 }}>৳</span>
              </div>
              <p style={{ fontSize: 13.5, color: T.textDim, fontWeight: 600 }}>TOTAL REVENUE</p>
            </div>
            <h3 style={{ fontSize: 42, fontWeight: 800, color: T.teal, margin: 0 }}>৳{totalRevenue}</h3>
          </div>

          <div style={{
            padding: 28,
            borderRadius: 20,
            background: T.card,
            border: `1px solid ${T.border}`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: T.tealDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#22c55e", fontSize: 22 }}>✓</span>
              </div>
              <p style={{ fontSize: 13.5, color: T.textDim, fontWeight: 600 }}>SUCCESSFUL PAYMENTS</p>
            </div>
            <h3 style={{ fontSize: 42, fontWeight: 800, color: "#22c55e", margin: 0 }}>{successfulPayments}</h3>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative max-w-md mb-8" style={{ filter: `drop-shadow(0 8px 32px rgba(23,182,168,0.15))` }}>
          <div style={{
            borderRadius: 18,
            padding: 1.5,
            background: `linear-gradient(135deg, rgba(23,182,168,0.35), rgba(15,212,196,0.2), rgba(23,182,168,0.35))`
          }}>
            <div style={{
              borderRadius: 17,
              background: "linear-gradient(135deg, #071320 0%, #0a1828 50%, #071320 100%)",
              display: "flex",
              alignItems: "center",
              padding: "4px 8px"
            }}>
              <div style={{ padding: "0 16px", color: search ? T.teal : "rgba(255,255,255,0.3)" }}>
                <Icon name="search" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search by user email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  padding: "14px 8px",
                  fontSize: "0.95rem",
                  color: "white"
                }}
              />
            </div>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div style={{
          borderRadius: 20,
          overflow: "hidden",
          background: T.card,
          border: `1px solid ${T.border}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#071320", borderBottom: `1px solid ${T.border}` }}>
              <tr>
                <th style={{ padding: "18px 24px", textAlign: "left", color: T.textDim, fontWeight: 600, fontSize: 13.5 }}>USER EMAIL</th>
                <th style={{ padding: "18px 24px", textAlign: "left", color: T.textDim, fontWeight: 600, fontSize: 13.5 }}>COURSE</th>
                <th style={{ padding: "18px 24px", textAlign: "left", color: T.textDim, fontWeight: 600, fontSize: 13.5 }}>AMOUNT</th>
                <th style={{ padding: "18px 24px", textAlign: "left", color: T.textDim, fontWeight: 600, fontSize: 13.5 }}>DATE</th>
                <th style={{ padding: "18px 24px", textAlign: "left", color: T.textDim, fontWeight: 600, fontSize: 13.5 }}>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: "60px 20px", textAlign: "center", color: T.textDim }}>
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t._id} style={{ borderTop: `1px solid ${T.border}` }}>
                    <td style={{ padding: "18px 24px", color: T.text }}>{t.userEmail}</td>
                    <td style={{ padding: "18px 24px", color: "white", fontWeight: 500 }}>{t.courseTitle}</td>
                    <td style={{ padding: "18px 24px", color: T.teal, fontWeight: 700 }}>৳{t.amountPaid}</td>
                    <td style={{ padding: "18px 24px", color: T.textDim }}>
                      {new Date(t.enrolledAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td style={{ padding: "18px 24px" }}>
                      <span style={{
                        padding: "6px 16px",
                        borderRadius: 999,
                        fontSize: 12.5,
                        fontWeight: 600,
                        background: t.paymentStatus === "paid" 
                          ? "rgba(34,197,94,0.15)" 
                          : "rgba(234,179,8,0.15)",
                        color: t.paymentStatus === "paid" ? "#4ade80" : "#fde047",
                        border: t.paymentStatus === "paid" 
                          ? "1px solid rgba(74,222,128,0.3)" 
                          : "1px solid rgba(253,224,71,0.3)"
                      }}>
                        {t.paymentStatus?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <p style={{ textAlign: "center", marginTop: 20, color: T.textDim, fontSize: 13.5 }}>
            Showing {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <style>{`
        @keyframes chevFade { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default AllTransactions;