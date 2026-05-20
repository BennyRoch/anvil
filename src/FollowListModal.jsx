// FollowListModal — opened when tapping the followers/following counts on a profile.

import { useState, useEffect } from "react";
import * as DB from "./data";

export default function FollowListModal({ userId, mode, onClose, onOpenProfile }) {
  // mode: "followers" | "following"
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const fn = mode === "followers" ? DB.listFollowers : DB.listFollowing;
      const list = await fn(userId);
      if (!cancelled) {
        setUsers(list);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId, mode]);

  return (
    <div style={S.backdrop} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.header}>
          <div style={S.title}>{mode === "followers" ? "FOLLOWERS" : "FOLLOWING"}</div>
          <button onClick={onClose} style={S.closeBtn} aria-label="Close">×</button>
        </div>
        {loading ? (
          <div style={S.empty}>Loading…</div>
        ) : users.length === 0 ? (
          <div style={S.empty}>
            {mode === "followers" ? "No followers yet." : "Not following anyone yet."}
          </div>
        ) : (
          <div style={S.list}>
            {users.map(u => (
              <button key={u.id} style={S.row} onClick={() => {
                onClose?.();
                if (u.username) onOpenProfile?.(u.username);
              }}>
                <div style={S.avatar}>{(u.display_name || u.username || "?")[0].toUpperCase()}</div>
                <div style={S.userMeta}>
                  <div style={S.userName}>{u.display_name || u.username}</div>
                  {u.username && <div style={S.userHandle}>@{u.username}</div>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  backdrop: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: 16,
  },
  modal: {
    width: "100%", maxWidth: 420, maxHeight: "80vh",
    background: "#13131c", border: "1px solid #1f1f2e", borderRadius: 12,
    color: "#f0ede8", fontFamily: "'Barlow Condensed', sans-serif",
    display: "flex", flexDirection: "column",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 18px", borderBottom: "1px solid #1f1f2e",
  },
  title: { fontSize: 16, fontWeight: 800, letterSpacing: 2, color: "#ff6b35" },
  closeBtn: {
    background: "transparent", border: "none", color: "#888",
    fontSize: 28, cursor: "pointer", padding: 0, lineHeight: 1,
  },
  list: { overflowY: "auto", padding: 8 },
  empty: { color: "#888", padding: "32px 18px", textAlign: "center", fontSize: 14 },
  row: {
    display: "flex", alignItems: "center", gap: 12,
    width: "100%", padding: 10, marginBottom: 4,
    background: "transparent", border: "none",
    color: "#f0ede8", fontFamily: "inherit",
    cursor: "pointer", textAlign: "left", borderRadius: 8,
  },
  avatar: {
    width: 38, height: 38, borderRadius: "50%",
    background: "#ff6b35", color: "#0a0a0f",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, fontWeight: 800, flexShrink: 0,
  },
  userMeta: { display: "flex", flexDirection: "column", minWidth: 0 },
  userName: { fontSize: 15, fontWeight: 700 },
  userHandle: { fontSize: 12, color: "#888" },
};
