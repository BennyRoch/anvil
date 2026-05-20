// ProfileScreen — public profile page reached via hash route #/u/<username>.
// Shows display name, follower/following counts, and a Follow/Unfollow button.
// Bio + avatar will be added in a later phase.

import { useState, useEffect } from "react";
import * as DB from "./data";

export default function ProfileScreen({ username, currentUserId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const p = await DB.getProfileByUsername(username);
      if (cancelled) return;
      if (!p) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const [c, isFol] = await Promise.all([
        DB.getFollowCounts(p.id),
        p.id === currentUserId ? Promise.resolve(false) : DB.isFollowing(p.id),
      ]);
      if (cancelled) return;
      setProfile(p);
      setCounts(c);
      setFollowing(isFol);
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [username, currentUserId]);

  async function toggleFollow() {
    if (!profile || busy) return;
    setBusy(true);
    // Optimistic update
    const wasFollowing = following;
    setFollowing(!wasFollowing);
    setCounts(c => ({ ...c, followers: c.followers + (wasFollowing ? -1 : 1) }));
    try {
      if (wasFollowing) await DB.unfollowUser(profile.id);
      else await DB.followUser(profile.id);
    } catch (err) {
      console.error(err);
      // Roll back on failure
      setFollowing(wasFollowing);
      setCounts(c => ({ ...c, followers: c.followers + (wasFollowing ? 1 : -1) }));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div style={S.wrap}>
        <div style={S.loading}>🔨</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={S.wrap}>
        <div style={S.card}>
          <button onClick={onBack} style={S.backBtn}>← Back</button>
          <div style={S.notFound}>
            <div style={{fontSize: 48, marginBottom: 8}}>👻</div>
            <div style={S.notFoundText}>No user found at @{username}</div>
          </div>
        </div>
      </div>
    );
  }

  const isMe = profile.id === currentUserId;

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <button onClick={onBack} style={S.backBtn}>← Back</button>

        <div style={S.header}>
          <div style={S.avatar}>{(profile.display_name || profile.username || "?")[0].toUpperCase()}</div>
          <div style={S.displayName}>{profile.display_name || profile.username}</div>
          <div style={S.handle}>@{profile.username}</div>
        </div>

        <div style={S.stats}>
          <div style={S.stat}>
            <div style={S.statNum}>{counts.followers}</div>
            <div style={S.statLabel}>FOLLOWERS</div>
          </div>
          <div style={S.statDivider} />
          <div style={S.stat}>
            <div style={S.statNum}>{counts.following}</div>
            <div style={S.statLabel}>FOLLOWING</div>
          </div>
        </div>

        {!isMe && (
          <button
            onClick={toggleFollow}
            disabled={busy}
            style={following ? S.unfollowBtn : S.followBtn}
          >
            {following ? "FOLLOWING" : "FOLLOW"}
          </button>
        )}
        {isMe && (
          <div style={S.youBadge}>This is you</div>
        )}
      </div>
    </div>
  );
}

const S = {
  wrap: {
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#f0ede8",
    fontFamily: "'Barlow Condensed', sans-serif",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 20,
    paddingTop: 40,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    background: "#13131c",
    border: "1px solid #1f1f2e",
    borderRadius: 12,
    padding: 24,
  },
  loading: { fontSize: 32, color: "#ff6b35", marginTop: 80, animation: "pulse 1.5s ease-in-out infinite" },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#888",
    fontFamily: "inherit",
    fontSize: 14,
    cursor: "pointer",
    padding: 0,
    marginBottom: 16,
  },
  header: { textAlign: "center", marginBottom: 24 },
  avatar: {
    width: 80, height: 80,
    margin: "0 auto 12px",
    borderRadius: "50%",
    background: "#ff6b35",
    color: "#0a0a0f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
    fontWeight: 800,
  },
  displayName: { fontSize: 24, fontWeight: 800, letterSpacing: 0.5 },
  handle: { fontSize: 14, color: "#888", marginTop: 2 },
  stats: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0f",
    border: "1px solid #1f1f2e",
    borderRadius: 8,
    padding: "16px",
    marginBottom: 16,
  },
  stat: { flex: 1, textAlign: "center" },
  statDivider: { width: 1, height: 32, background: "#1f1f2e" },
  statNum: { fontSize: 22, fontWeight: 800, color: "#ff6b35" },
  statLabel: { fontSize: 10, letterSpacing: 1.5, color: "#888", marginTop: 2 },
  followBtn: {
    width: "100%", padding: "12px",
    background: "#ff6b35", border: "none", borderRadius: 8,
    color: "#0a0a0f", fontFamily: "inherit", fontSize: 13, fontWeight: 800, letterSpacing: 2,
    cursor: "pointer",
  },
  unfollowBtn: {
    width: "100%", padding: "12px",
    background: "transparent", border: "1px solid #1f1f2e", borderRadius: 8,
    color: "#f0ede8", fontFamily: "inherit", fontSize: 13, fontWeight: 800, letterSpacing: 2,
    cursor: "pointer",
  },
  youBadge: {
    textAlign: "center",
    color: "#888",
    fontSize: 12,
    letterSpacing: 1.5,
    padding: "10px",
  },
  notFound: { textAlign: "center", padding: "40px 20px" },
  notFoundText: { color: "#888", fontSize: 15 },
};
