import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../providers/AuthProvider";

const API_BASE = import.meta.env.VITE_API_URL || "https://backend-skill-voyager-ai.vercel.app";

const dayKey = (d = new Date()) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().split("T")[0];

const lsKey = (day) => `sv_active_seconds_${day}`;

const bumpLocal = (day, addSeconds) => {
  try {
    const k = lsKey(day);
    const cur = Number(localStorage.getItem(k) || "0");
    localStorage.setItem(k, String(cur + addSeconds));
  } catch (_) {
    // non-critical
  }
};

export default function ActivityTracker() {
  const { user } = useContext(AuthContext) || {};
  const lastTickRef = useRef(null);
  const inFlightRef = useRef(false);
  const lastDayRef = useRef(dayKey());

  // ✅ 1. LOCAL → SERVER SYNC (separate useEffect)
  useEffect(() => {
    if (!user?.uid) return;

    const dk = dayKey();
    const sec = Number(localStorage.getItem(lsKey(dk)) || "0");

    if (sec > 0) {
      fetch(`${API_BASE}/api/dashboard/watch-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, seconds: sec }),
      })
        .then(() => {
          // localStorage.removeItem(lsKey(dk));
        })
        .catch(() => {});
    }
  }, [user?.uid]);

  // ✅ 2. MAIN TRACKING LOGIC
  useEffect(() => {
    if (!user?.uid) return;

    const resetTick = () => {
      lastTickRef.current = Date.now();
      lastDayRef.current = dayKey();
    };

    const flush = async () => {
      if (inFlightRef.current) return;

      const last = lastTickRef.current;
      if (!last) {
        resetTick();
        return;
      }

      const now = Date.now();

      const dk = dayKey();
      if (dk !== lastDayRef.current) {
        resetTick();
        return;
      }

      const deltaSec = Math.floor((now - last) / 1000);

      // ✅ FIXED CONDITION
      if (deltaSec < 5) {
        lastTickRef.current = now;
        return;
      }

      inFlightRef.current = true;
      lastTickRef.current = now;

      try {
        bumpLocal(dk, deltaSec);

        await fetch(`${API_BASE}/api/dashboard/watch-history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, seconds: deltaSec }),
          keepalive: true,
        });
      } catch (_) {
      } finally {
        inFlightRef.current = false;
      }
    };

    resetTick();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") flush();
    }, 30000);

    const onVisibility = () => {
      if (document.visibilityState === "visible") resetTick();
      else flush();
    };

   const onBeforeUnload = () => {
  const dk = dayKey();
  const sec = Number(localStorage.getItem(lsKey(dk)) || "0");

  if (sec > 0 && user?.uid) {
    const data = JSON.stringify({
      uid: user.uid,
      seconds: sec,
    });

    navigator.sendBeacon(
      `${API_BASE}/api/dashboard/watch-history`,
      new Blob([data], { type: "application/json" })
    );
  }
};
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [user?.uid]);

  return null;
}
