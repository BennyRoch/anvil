// SocialScreen — the new "Social" tab content. Contains two sub-views:
//   Feed     — posts from people you follow + your own
//   Discover — search + suggested users
//
// Post cards support: like, comment, copy-to-log, and delete (own posts).

import { useState, useEffect, useRef, useCallback } from "react";
import * as DB from "./data";

export default function SocialScreen({ currentUserId, onCopyToLog, onOpenProfile }) {
  const [view, setView] = useState("feed"); // "feed" | "discover"

  return (
    <div style={S.wrap}>
      <div style={S.subnav}>
        <button
          style={S.subBtn(view === "feed")}
          onClick={() => setView("feed")}
        >FEED</button>
        <button
          style={S.subBtn(view === "discover")}
          onClick={() => setView("discover")}
        >DISCOVER</button>
      </div>

      {view === "feed" && (
        <FeedView
          currentUserId={currentUserId}
          onCopyToLog={onCopyToLog}
          onOpenProfile={onOpenProfile}
        />
      )}
      {view === "discover" && (
        <DiscoverView onOpenProfile={onOpenProfile} />
      )}
    </div>
  );
}

// ─── FEED ────────────────────────────────────────────────────────────────────
function FeedView({ currentUserId, onCopyToLog, onOpenProfile }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [done, setDone] = useState(false);

  const load = useCallback(async (before = null) => {
    const list = await DB.listFeed({ limit: 20, before });
    return list;
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    load(null).then(list => {
      if (cancelled) return;
      setPosts(list);
      setDone(list.length < 20);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [load]);

  async function loadMore() {
    if (loadingMore || done || !posts.length) return;
    setLoadingMore(true);
    const last = posts[posts.length - 1];
    const more = await load(last.created_at);
    setPosts(p => [...p, ...more]);
    if (more.length < 20) setDone(true);
    setLoadingMore(false);
  }

  function handlePostDeleted(postId) {
    setPosts(ps => ps.filter(p => p.id !== postId));
  }

  if (loading) {
    return <div style={S.empty}>Loading feed…</div>;
  }
  if (posts.length === 0) {
    return (
      <div style={S.emptyState}>
        <div style={{fontSize: 42, marginBottom: 10}}>🌱</div>
        <div style={S.emptyTitle}>NOTHING IN YOUR FEED YET</div>
        <div style={S.emptyText}>
          Follow other lifters in Discover, or share one of your own workouts
          from the History tab to get started.
        </div>
      </div>
    );
  }

  return (
    <div style={S.feed}>
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onCopyToLog={onCopyToLog}
          onOpenProfile={onOpenProfile}
          onDeleted={handlePostDeleted}
        />
      ))}
      {!done && (
        <button style={S.moreBtn} onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? "LOADING…" : "LOAD MORE"}
        </button>
      )}
      {done && posts.length > 0 && (
        <div style={S.endNote}>You've reached the end.</div>
      )}
    </div>
  );
}

// ─── POST CARD ───────────────────────────────────────────────────────────────
function PostCard({ post, currentUserId, onCopyToLog, onOpenProfile, onDeleted }) {
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [busy, setBusy] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState(null);
  const [commentBody, setCommentBody] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comment_count);
  const [deleting, setDeleting] = useState(false);

  async function toggleLike() {
    if (busy) return;
    setBusy(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount(c => c + (wasLiked ? -1 : 1));
    try {
      await DB.togglePostLike(post.id, wasLiked);
    } catch (err) {
      console.error(err);
      setLiked(wasLiked);
      setLikeCount(c => c + (wasLiked ? 1 : -1));
    } finally {
      setBusy(false);
    }
  }

  async function openComments() {
    setCommentsOpen(true);
    if (comments === null) {
      const list = await DB.listPostComments(post.id);
      setComments(list);
    }
  }

  async function submitComment() {
    const body = commentBody.trim();
    if (!body || commentBusy) return;
    setCommentBusy(true);
    try {
      const c = await DB.createComment(post.id, body);
      setComments(cs => [...(cs || []), c]);
      setCommentCount(n => n + 1);
      setCommentBody("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not post comment");
    } finally {
      setCommentBusy(false);
    }
  }

  async function removeComment(commentId) {
    try {
      await DB.deleteComment(commentId);
      setComments(cs => (cs || []).filter(c => c.id !== commentId));
      setCommentCount(n => Math.max(0, n - 1));
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not delete");
    }
  }

  async function handleDelete() {
    if (deleting) return;
    if (!confirm("Delete this post? This can't be undone.")) return;
    setDeleting(true);
    try {
      await DB.deletePost(post.id);
      onDeleted?.(post.id);
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not delete");
      setDeleting(false);
    }
  }

  function handleCopyToLog() {
    const w = DB.workoutFromPostSnapshot(post.workout_snapshot);
    onCopyToLog?.(w);
  }

  const w = post.workout_snapshot || {};
  const exercises = w.exercises || [];
  const setCount = exercises.reduce((sum, ex) => sum + (ex.sets?.length || 0), 0);
  const isMine = post.user_id === currentUserId;
  const handle = post.author?.username;
  const displayName = post.author?.display_name || handle || "Lifter";

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <button
          style={S.authorBtn}
          onClick={() => handle && onOpenProfile?.(handle)}
          disabled={!handle}
        >
          <div style={S.avatar}>{displayName[0].toUpperCase()}</div>
          <div style={S.authorMeta}>
            <div style={S.authorName}>{displayName}</div>
            {handle && <div style={S.authorHandle}>@{handle}</div>}
          </div>
        </button>
        <div style={S.dateText}>{formatDate(post.created_at)}</div>
      </div>

      {post.image_url && (
        <img src={post.image_url} alt="" style={S.postImage} />
      )}

      {post.caption && (
        <div style={S.caption}>{post.caption}</div>
      )}

      <div style={S.workoutBlock}>
        <div style={S.workoutHeader}>
          <div style={S.workoutTitle}>{w.name || "Workout"}</div>
          {w.tag && <span style={S.tag}>{w.tag}</span>}
        </div>
        <div style={S.workoutMeta}>
          {exercises.length} exercises · {setCount} sets
          {w.totalVolume ? ` · ${Math.round(w.totalVolume).toLocaleString()} lb total` : ""}
        </div>
        {exercises.length > 0 && (
          <ul style={S.exList}>
            {exercises.slice(0, 6).map((ex, i) => (
              <li key={i} style={S.exItem}>
                <span style={S.exName}>{ex.name}</span>
                <span style={S.exSets}>{(ex.sets || []).length} sets</span>
              </li>
            ))}
            {exercises.length > 6 && (
              <li style={S.exMore}>+ {exercises.length - 6} more</li>
            )}
          </ul>
        )}
        <button style={S.copyBtn} onClick={handleCopyToLog}>
          ⬇ COPY TO MY LOG
        </button>
      </div>

      <div style={S.actions}>
        <button style={S.actionBtn} onClick={toggleLike} disabled={busy}>
          <span style={{color: liked ? "#ff6b35" : "#888", fontSize: 16}}>
            {liked ? "♥" : "♡"}
          </span>
          <span style={{...S.actionLabel, color: liked ? "#ff6b35" : "#888"}}>
            {likeCount}
          </span>
        </button>
        <button style={S.actionBtn} onClick={() => commentsOpen ? setCommentsOpen(false) : openComments()}>
          <span style={{color: "#888", fontSize: 14}}>💬</span>
          <span style={S.actionLabel}>{commentCount}</span>
        </button>
        {isMine && (
          <button style={{...S.actionBtn, marginLeft: "auto"}} onClick={handleDelete} disabled={deleting}>
            <span style={{...S.actionLabel, color: "#666"}}>{deleting ? "…" : "Delete"}</span>
          </button>
        )}
      </div>

      {commentsOpen && (
        <div style={S.comments}>
          {comments === null ? (
            <div style={S.commentEmpty}>Loading…</div>
          ) : comments.length === 0 ? (
            <div style={S.commentEmpty}>Be the first to comment.</div>
          ) : (
            comments.map(c => (
              <div key={c.id} style={S.commentRow}>
                <button
                  style={S.commentAuthor}
                  onClick={() => c.author?.username && onOpenProfile?.(c.author.username)}
                  disabled={!c.author?.username}
                >
                  {c.author?.display_name || c.author?.username || "Lifter"}
                </button>
                <span style={S.commentBody}>{c.body}</span>
                {c.user_id === currentUserId && (
                  <button style={S.commentDel} onClick={() => removeComment(c.id)}>×</button>
                )}
              </div>
            ))
          )}
          <div style={S.commentInputRow}>
            <input
              style={S.commentInput}
              value={commentBody}
              onChange={e => setCommentBody(e.target.value.slice(0, 1000))}
              placeholder="Add a comment…"
              onKeyDown={e => { if (e.key === "Enter") submitComment(); }}
            />
            <button
              style={S.commentSendBtn}
              onClick={submitComment}
              disabled={commentBusy || !commentBody.trim()}
            >
              SEND
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DISCOVER ────────────────────────────────────────────────────────────────
function DiscoverView({ onOpenProfile }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSugg, setLoadingSugg] = useState(true);
  const debounceRef = useRef(null);

  useEffect(() => {
    DB.suggestedUsers(10).then(list => {
      setSuggestions(list);
      setLoadingSugg(false);
    });
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (!q) { setResults([]); setSearching(false); return; }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      const list = await DB.searchUsers(q);
      setResults(list);
      setSearching(false);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const showingSearch = query.trim().length > 0;

  return (
    <div style={S.discover}>
      <input
        style={S.searchInput}
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search users by name or @username"
        autoCapitalize="none"
        autoCorrect="off"
      />

      {showingSearch ? (
        <div style={S.userList}>
          {searching && <div style={S.empty}>Searching…</div>}
          {!searching && results.length === 0 && <div style={S.empty}>No users found.</div>}
          {results.map(u => (
            <UserRow key={u.id} user={u} onOpenProfile={onOpenProfile} />
          ))}
        </div>
      ) : (
        <>
          <div style={S.sectionLabel}>SUGGESTED</div>
          <div style={S.userList}>
            {loadingSugg && <div style={S.empty}>Loading suggestions…</div>}
            {!loadingSugg && suggestions.length === 0 && (
              <div style={S.empty}>No suggestions right now. Try searching!</div>
            )}
            {suggestions.map(u => (
              <UserRow key={u.id} user={u} onOpenProfile={onOpenProfile} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function UserRow({ user, onOpenProfile }) {
  const name = user.display_name || user.username || "Lifter";
  return (
    <button
      style={S.userRow}
      onClick={() => user.username && onOpenProfile?.(user.username)}
      disabled={!user.username}
    >
      <div style={S.avatar}>{name[0].toUpperCase()}</div>
      <div style={S.authorMeta}>
        <div style={S.authorName}>{name}</div>
        {user.username && <div style={S.authorHandle}>@{user.username}</div>}
      </div>
    </button>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff/86400)}d ago`;
  return d.toLocaleDateString();
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  wrap: { padding: "0 0 80px 0" },
  subnav: {
    display: "flex", gap: 0, marginBottom: 16,
    borderBottom: "1px solid #1f1f2e",
  },
  subBtn: (active) => ({
    flex: 1, padding: "10px 0",
    background: "transparent", border: "none",
    color: active ? "#ff6b35" : "#555",
    fontFamily: "inherit", fontSize: 12, fontWeight: 700, letterSpacing: 1.5,
    textTransform: "uppercase", cursor: "pointer",
    borderBottom: active ? "2px solid #ff6b35" : "2px solid transparent",
    marginBottom: -1,
  }),
  feed: { display: "flex", flexDirection: "column", gap: 16 },
  card: {
    background: "#13131c", border: "1px solid #1f1f2e", borderRadius: 12,
    padding: 14,
  },
  cardHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  authorBtn: {
    display: "flex", alignItems: "center", gap: 10,
    background: "transparent", border: "none", padding: 0,
    color: "#f0ede8", fontFamily: "inherit", cursor: "pointer", textAlign: "left",
  },
  avatar: {
    width: 38, height: 38, borderRadius: "50%",
    background: "#ff6b35", color: "#0a0a0f",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, fontWeight: 800, flexShrink: 0,
  },
  authorMeta: { display: "flex", flexDirection: "column" },
  authorName: { fontSize: 14, fontWeight: 700 },
  authorHandle: { fontSize: 12, color: "#888" },
  dateText: { fontSize: 12, color: "#666" },
  postImage: {
    width: "100%", display: "block", maxHeight: 480, objectFit: "cover",
    borderRadius: 8, marginBottom: 10,
  },
  caption: { fontSize: 14, lineHeight: 1.5, marginBottom: 12, color: "#d8d4cc", whiteSpace: "pre-wrap" },
  workoutBlock: {
    background: "#0a0a0f", border: "1px solid #1f1f2e", borderRadius: 8,
    padding: 12, marginBottom: 10,
  },
  workoutHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 },
  workoutTitle: { fontSize: 15, fontWeight: 700 },
  tag: {
    fontSize: 10, padding: "2px 8px", borderRadius: 4,
    background: "rgba(255,107,53,0.12)", color: "#ff6b35",
    letterSpacing: 1, fontWeight: 700,
  },
  workoutMeta: { fontSize: 12, color: "#888", marginBottom: 10 },
  exList: { listStyle: "none", padding: 0, margin: "0 0 10px 0" },
  exItem: {
    display: "flex", justifyContent: "space-between",
    fontSize: 13, padding: "4px 0",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
  },
  exName: { color: "#d8d4cc" },
  exSets: { color: "#666" },
  exMore: { fontSize: 12, color: "#666", paddingTop: 4, fontStyle: "italic" },
  copyBtn: {
    width: "100%", padding: "10px",
    background: "transparent", border: "1px solid #ff6b35", borderRadius: 6,
    color: "#ff6b35", fontFamily: "inherit", fontSize: 12, fontWeight: 800,
    letterSpacing: 1.5, cursor: "pointer",
  },
  actions: {
    display: "flex", gap: 14, alignItems: "center",
    paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.04)",
  },
  actionBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "transparent", border: "none", padding: "6px 0",
    cursor: "pointer", color: "#888", fontFamily: "inherit",
  },
  actionLabel: { fontSize: 13, color: "#888", fontWeight: 600 },
  comments: { marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.04)" },
  commentEmpty: { color: "#666", fontSize: 13, padding: "6px 0" },
  commentRow: {
    display: "flex", alignItems: "baseline", gap: 6,
    fontSize: 13, lineHeight: 1.4, padding: "4px 0",
  },
  commentAuthor: {
    background: "transparent", border: "none", padding: 0,
    color: "#ff6b35", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
    cursor: "pointer", flexShrink: 0,
  },
  commentBody: { color: "#d8d4cc", flex: 1, wordBreak: "break-word" },
  commentDel: {
    background: "transparent", border: "none", color: "#555",
    fontSize: 16, cursor: "pointer", padding: "0 4px",
  },
  commentInputRow: { display: "flex", gap: 6, marginTop: 8 },
  commentInput: {
    flex: 1, background: "#0a0a0f", border: "1px solid #1f1f2e", borderRadius: 6,
    color: "#f0ede8", fontFamily: "inherit", fontSize: 13,
    padding: "8px 10px", outline: "none",
  },
  commentSendBtn: {
    background: "#ff6b35", border: "none", borderRadius: 6,
    color: "#0a0a0f", fontFamily: "inherit", fontSize: 11, fontWeight: 800,
    letterSpacing: 1, padding: "0 12px", cursor: "pointer",
  },
  empty: { color: "#666", fontSize: 13, padding: "20px 0", textAlign: "center" },
  emptyState: {
    background: "#13131c", border: "1px solid #1f1f2e", borderRadius: 12,
    padding: "40px 20px", textAlign: "center",
  },
  emptyTitle: { fontSize: 14, fontWeight: 800, letterSpacing: 2, color: "#ff6b35", marginBottom: 8 },
  emptyText: { color: "#888", fontSize: 13, lineHeight: 1.5, maxWidth: 320, margin: "0 auto" },
  moreBtn: {
    width: "100%", padding: 12, marginTop: 4,
    background: "transparent", border: "1px solid #1f1f2e", borderRadius: 8,
    color: "#888", fontFamily: "inherit", fontSize: 12, fontWeight: 800,
    letterSpacing: 1.5, cursor: "pointer",
  },
  endNote: { color: "#555", fontSize: 12, textAlign: "center", padding: 10 },
  discover: { display: "flex", flexDirection: "column", gap: 12 },
  searchInput: {
    width: "100%", boxSizing: "border-box",
    background: "#13131c", border: "1px solid #1f1f2e", borderRadius: 8,
    color: "#f0ede8", fontFamily: "inherit", fontSize: 14,
    padding: "10px 14px", outline: "none",
  },
  sectionLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#666",
    textTransform: "uppercase", padding: "8px 4px 4px",
  },
  userList: { display: "flex", flexDirection: "column", gap: 4 },
  userRow: {
    display: "flex", alignItems: "center", gap: 12,
    padding: 10, background: "#13131c",
    border: "1px solid #1f1f2e", borderRadius: 8,
    cursor: "pointer", color: "#f0ede8", fontFamily: "inherit", textAlign: "left",
  },
};
