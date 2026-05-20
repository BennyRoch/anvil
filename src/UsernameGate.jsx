// UsernameGate — shown after signup before the app loads if the user has no
// username yet. Validates format + availability in real-time and writes to
// the profiles table on submit.

import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import * as DB from "./data";

const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;

export default function UsernameGate({ session, onDone }) {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("idle");
    // idle | checking | available | taken | invalid
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  // Debounced availability check
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setError(null);

    const u = username.trim();
    if (!u) { setStatus("idle"); return; }
    if (!USERNAME_RE.test(u)) { setStatus("invalid"); return; }

    setStatus("checking");
    debounceRef.current = setTimeout(async () => {
      const ok = await DB.isUsernameAvailable(u);
      setStatus(ok ? "available" : "taken");
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [username]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (status !== "available") return;
    setSubmitting(true);
    setError(null);
    try {
      // Ensure a profile row exists first (signup may not have created one).
      // upsert is safe — won't clobber existing fields because we only set id.
      await supabase.from("profiles").upsert({ id: session.user.id }, { onConflict: "id" });
      await DB.setUsername(username.trim());
      onDone?.();
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not save username");
    } finally {
      setSubmitting(false);
    }
  }

  const hint = (() => {
    if (status === "idle") return "3–20 characters · letters, numbers, underscore";
    if (status === "invalid") return "Letters, numbers, and underscores only (3–20 characters)";
    if (status === "checking") return "Checking availability…";
    if (status === "taken") return "That username is taken";
    if (status === "available") return "Available";
    return "";
  })();

  const hintColor =
    status === "taken" || status === "invalid" ? "#ff6b35" :
    status === "available" ? "#5cd28b" :
    "#888";

  return (
    <div style={S.wrap}>
      <form onSubmit={handleSubmit} style={S.card}>
        <div style={S.logo}>🔨</div>
        <div style={S.title}>PICK A USERNAME</div>
        <div style={S.subtitle}>
          This is how other lifters will find and follow you. You can change it later in settings.
        </div>

        <label style={S.label}>Username</label>
        <div style={S.inputWrap}>
          <span style={S.atSign}>@</span>
          <input
            type="text"
            style={S.input}
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="rogerb"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            maxLength={20}
            autoFocus
          />
        </div>
        <div style={{...S.hint, color: hintColor}}>{hint}</div>

        {error && <div style={S.error}>{error}</div>}

        <button
          type="submit"
          style={{
            ...S.submit,
            opacity: status === "available" && !submitting ? 1 : 0.5,
            cursor: status === "available" && !submitting ? "pointer" : "not-allowed",
          }}
          disabled={status !== "available" || submitting}
        >
          {submitting ? "SAVING…" : "CONTINUE"}
        </button>
      </form>
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
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#13131c",
    border: "1px solid #1f1f2e",
    borderRadius: 12,
    padding: 28,
  },
  logo: { fontSize: 36, textAlign: "center", marginBottom: 4 },
  title: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: 2,
    color: "#ff6b35",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    lineHeight: 1.5,
    marginBottom: 22,
  },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: "#888",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    background: "#0a0a0f",
    border: "1px solid #1f1f2e",
    borderRadius: 8,
    padding: "0 12px",
  },
  atSign: { color: "#666", fontSize: 16, marginRight: 6 },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#f0ede8",
    fontSize: 16,
    fontFamily: "inherit",
    padding: "12px 0",
  },
  hint: { fontSize: 12, marginTop: 6, minHeight: 18 },
  error: {
    marginTop: 12,
    padding: "8px 12px",
    background: "rgba(255, 107, 53, 0.1)",
    border: "1px solid rgba(255, 107, 53, 0.3)",
    borderRadius: 6,
    color: "#ff6b35",
    fontSize: 13,
  },
  submit: {
    width: "100%",
    marginTop: 20,
    padding: "14px",
    background: "#ff6b35",
    border: "none",
    borderRadius: 8,
    color: "#0a0a0f",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: 2,
  },
};
