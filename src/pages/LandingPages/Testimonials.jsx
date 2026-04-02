import { useState, useEffect } from "react";

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Full Stack Developer",
    university: "MIT Graduate",
    quote: "SkillVoyager helped me understand exactly what skills I was missing and build a clear roadmap to get hired. The structured learning path completely changed my career direction.",
    rating: 5,
    tag: "Career Changer",
    images: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=600&fit=crop&crop=faces,center",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=600&fit=crop&crop=faces,center",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&h=600&fit=crop&crop=faces,center",
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "AI Engineer",
    university: "Stanford Alumnus",
    quote: "The AI skill gap analysis is incredible. It showed me exactly what to learn next and saved me months of confusion. I landed my dream job within 6 months.",
    rating: 5,
    tag: "Top Achiever",
    images: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=600&fit=crop&crop=faces,center",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=600&fit=crop&crop=faces,center",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&crop=faces,center",
    ],
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "UX Designer",
    university: "RISD Graduate",
    quote: "This platform structured my learning journey and helped me build a strong portfolio. Every recruiter I spoke with was genuinely impressed by the depth of my work.",
    rating: 5,
    tag: "Portfolio Pro",
    images: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=600&fit=crop&crop=faces,center",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&h=600&fit=crop&crop=faces,center",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop&crop=faces,center",
    ],
  },
];

// Image grid dimensions — single source of truth
const ROW1 = 380;
const ROW2 = 270;
const GGAP = 14;
const GRID_H = ROW1 + ROW2 + GGAP; // 664px

const Star = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24"
    fill={filled ? "#F5C518" : "none"}
    stroke={filled ? "#F5C518" : "rgba(255,255,255,0.15)"}
    strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(true);

  const goTo = (i) => {
    if (i === active) return;
    setFade(false);
    setTimeout(() => { setActive(i); setFade(true); }, 280);
  };

  useEffect(() => {
    const t = setInterval(() => goTo((active + 1) % reviews.length), 6000);
    return () => clearInterval(t);
  }, [active]);

  const r = reviews[active];

  return (
    <section style={{
      background: "linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)",
      padding: "110px 64px 120px",
      fontFamily: "system-ui, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Ambient glows */}
      <div style={{ position:"absolute", top:"-200px", left:"-100px", width:"700px", height:"700px",
        background:"radial-gradient(circle, rgba(23,182,168,0.07) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-100px", right:"-60px", width:"600px", height:"600px",
        background:"radial-gradient(circle, rgba(23,182,168,0.05) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div style={{ maxWidth:"1360px", margin:"0 auto", width:"100%" }}>

        {/* ── HEADER — centered ── */}
        <div style={{ textAlign:"center", marginBottom:"88px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"12px", marginBottom:"22px" }}>
            <div style={{ width:"28px", height:"2px", background:"#17B6A8" }} />
            <span style={{ color:"#17B6A8", fontSize:"12px", fontWeight:"700",
              letterSpacing:"3px", textTransform:"uppercase" }}>
              Testimonials
            </span>
            <div style={{ width:"28px", height:"2px", background:"#17B6A8" }} />
          </div>
          <h2 style={{
            fontSize:"clamp(38px,5vw,62px)", fontWeight:"800",
            color:"#fff", margin:0, lineHeight:"1.1", letterSpacing:"-1.5px",
          }}>
            What Our <span style={{ color:"#17B6A8" }}>Learners</span> Say
          </h2>
          <p style={{ color:"rgba(255,255,255,0.70)", fontSize:"18px",
            lineHeight:"1.7", maxWidth:"500px", margin:"20px auto 0" }}>
            Real stories from people who transformed their careers with ScholarStream.
          </p>
        </div>

        {/* ── MAIN 2-COL ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          gap:"88px",
          alignItems:"start",
        }}>

          {/* ── LEFT: exact same height as image grid ── */}
          <div style={{
            display:"flex",
            flexDirection:"column",
            justifyContent:"space-between",
            height:`${GRID_H}px`,
          }}>

            {/* Animated review block */}
            <div style={{
              opacity: fade ? 1 : 0,
              transform: fade ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.28s ease, transform 0.28s ease",
            }}>
              {/* Big quote mark */}
              <div style={{
                fontSize:"90px", lineHeight:"0.65",
                color:"rgba(23,182,168,0.2)",
                fontFamily:"Georgia,serif",
                marginBottom:"28px",
                userSelect:"none",
              }}>
                "
              </div>

              {/* Quote text */}
              <p style={{
                fontSize:"clamp(18px,1.9vw,24px)",
                lineHeight:"1.85",
                color:"rgba(255,255,255,0.90)",
                margin:"0 0 28px",
                fontStyle:"italic",
              }}>
                {r.quote}
              </p>

              {/* Stars */}
              <div style={{ display:"flex", gap:"4px", marginBottom:"28px" }}>
                {[...Array(5)].map((_, i) => <Star key={i} filled={i < r.rating} />)}
              </div>

              {/* Reviewer */}
              <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
                <div style={{
                  width:"54px", height:"54px", borderRadius:"50%", flexShrink:0,
                  background:"linear-gradient(135deg,rgba(23,182,168,0.3),rgba(23,182,168,0.08))",
                  border:"2px solid rgba(23,182,168,0.4)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"20px", fontWeight:"800", color:"#17B6A8",
                }}>
                  {r.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight:"700", color:"#fff", fontSize:"17px" }}>{r.name}</div>
                  <div style={{ color:"#17B6A8", fontSize:"14px", marginTop:"3px" }}>{r.role} · {r.university}</div>
                </div>
                <span style={{
                  marginLeft:"auto",
                  background:"rgba(23,182,168,0.1)", border:"1px solid rgba(23,182,168,0.25)",
                  color:"#17B6A8", borderRadius:"100px", padding:"6px 16px",
                  fontSize:"12px", fontWeight:"700", letterSpacing:"0.3px", whiteSpace:"nowrap",
                }}>
                  {r.tag}
                </span>
              </div>
            </div>

            {/* Switcher — pinned to bottom */}
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
              {reviews.map((rev, i) => (
                <button key={rev.id} onClick={() => goTo(i)} style={{
                  display:"flex", alignItems:"center", gap:"16px",
                  width:"100%", padding:"20px 0 20px 20px",
                  background:"transparent", border:"none",
                  borderBottom:"1px solid rgba(255,255,255,0.07)",
                  borderLeft: i === active ? "3px solid #17B6A8" : "3px solid transparent",
                  cursor:"pointer", textAlign:"left",
                  transition:"border-color 0.25s",
                }}>
                  <div style={{
                    width:"10px", height:"10px", borderRadius:"50%", flexShrink:0,
                    background: i === active ? "#17B6A8" : "rgba(255,255,255,0.35)",
                    transition:"background 0.25s",
                  }} />
                  <div style={{ flex:1 }}>
                    <div style={{
                      fontWeight:"600", fontSize:"16px",
                      color: i === active ? "#fff" : "rgba(255,255,255,0.60)",
                      transition:"color 0.25s",
                    }}>{rev.name}</div>
                    <div style={{
                      fontSize:"13px", marginTop:"3px",
                      color: i === active ? "#17B6A8" : "rgba(255,255,255,0.40)",
                      transition:"color 0.25s",
                    }}>{rev.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: 2×2 image grid ── */}
          <div style={{
            display:"grid",
            gridTemplateColumns:"1fr 1fr",
            gridTemplateRows:`${ROW1}px ${ROW2}px`,
            gap:`${GGAP}px`,
            opacity: fade ? 1 : 0,
            transform: fade ? "scale(1)" : "scale(0.97)",
            transition:"opacity 0.35s ease, transform 0.35s ease",
          }}>

            {/* Big image — left col spans both rows */}
            <div style={{
              gridColumn:"1", gridRow:"1 / 3",
              borderRadius:"22px", overflow:"hidden",
              background:"#0d1a28", position:"relative",
            }}>
              <img src={r.images[0]} alt="" style={{
                width:"100%", height:"100%",
                objectFit:"cover", objectPosition:"center 10%",
                display:"block", transition:"transform 0.5s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.03)"}
                onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
                onError={e => e.target.src=`https://ui-avatars.com/api/?name=${r.name}&background=17B6A8&color=fff&size=400`}
              />
              <div style={{ position:"absolute", inset:0,
                background:"linear-gradient(to top, rgba(6,15,26,0.4) 0%, transparent 50%)",
                pointerEvents:"none" }} />
              <div style={{ position:"absolute", inset:0, borderRadius:"22px",
                boxShadow:"inset 0 0 0 1.5px rgba(23,182,168,0.3)", pointerEvents:"none" }} />
            </div>

            {/* 2 smaller images — right col */}
            {r.images.slice(1, 3).map((src, i) => (
              <div key={src + i} style={{
                gridColumn:"2",
                borderRadius:"18px", overflow:"hidden",
                background:"#0d1a28", position:"relative",
              }}>
                <img src={src} alt="" style={{
                  width:"100%", height:"100%",
                  objectFit:"cover", objectPosition:"center 10%",
                  display:"block", transition:"transform 0.5s ease",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
                  onError={e => e.target.src=`https://ui-avatars.com/api/?name=${r.name}&background=17B6A8&color=fff&size=400`}
                />
                <div style={{ position:"absolute", inset:0,
                  background:"linear-gradient(to top, rgba(6,15,26,0.4) 0%, transparent 55%)",
                  pointerEvents:"none" }} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}