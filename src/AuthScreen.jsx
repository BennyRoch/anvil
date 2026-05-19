// AuthScreen — login + signup UI shown when user is not authenticated.
// Shares the visual style with the rest of Anvil (Barlow Condensed, orange accent).

import { useState } from "react";
import { supabase } from "./supabase";

export default function AuthScreen({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");  // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  async function handleSubmit(e) {
    e?.preventDefault?.();
    setError(null);
    setInfo(null);
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (err) throw err;
        // If email confirmation is OFF in Supabase settings, user is signed in immediately.
        // If ON, they'll need to verify email first.
        if (data.session) {
          onAuthSuccess?.(data.session);
        } else {
          setInfo("Check your email for a confirmation link, then come back and log in.");
          setMode("login");
        }
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
        onAuthSuccess?.(data.session);
      }
    } catch (err) {
      console.error(err);
      // Make common errors friendlier
      const msg = err.message || "Something went wrong";
      if (msg.toLowerCase().includes("invalid")) {
        setError("Invalid email or password");
      } else if (msg.toLowerCase().includes("already")) {
        setError("An account with this email already exists. Try logging in.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email above, then tap Forgot Password");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email);
      if (err) throw err;
      setInfo("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(err.message || "Could not send reset email");
    } finally {
      setLoading(false);
    }
  }

  const S = {
    page: {
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#f0ede8",
      fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 28,
      boxSizing: "border-box",
    },
    logo: {
      fontSize: 36, fontWeight: 800, letterSpacing: 4,
      textTransform: "uppercase", color: "#ff6b35", marginBottom: 6,
    },
    tagline: {
      color: "#444", fontSize: 12, letterSpacing: 2, marginBottom: 36,
    },
    card: {
      width: "100%", maxWidth: 360,
    },
    label: {
      fontSize: 11, fontWeight: 700, letterSpacing: 2,
      textTransform: "uppercase", color: "#666",
      display: "block", marginBottom: 8,
    },
    input: {
      width: "100%", background: "#1a1a28", border: "1px solid #2a2a3e",
      borderRadius: 8, padding: "11px 14px", color: "#f0ede8",
      fontFamily: "inherit", fontSize: 15, outline: "none", boxSizing: "border-box",
      marginBottom: 14,
    },
    submit: {
      width: "100%", background: "linear-gradient(90deg,#ff6b35,#ff8c42)",
      border: "none", borderRadius: 10, padding: 14, color: "#fff",
      fontFamily: "inherit", fontSize: 15, fontWeight: 800,
      letterSpacing: 2, textTransform: "uppercase",
      cursor: loading ? "wait" : "pointer", marginTop: 8,
      boxShadow: "0 4px 20px #ff6b3544",
      opacity: loading ? 0.7 : 1,
    },
    toggle: {
      width: "100%", marginTop: 18, background: "transparent",
      border: "none", color: "#888", fontFamily: "inherit",
      fontSize: 13, cursor: "pointer", textAlign: "center",
    },
    toggleEm: { color: "#ff6b35", fontWeight: 700 },
    err: {
      background: "#ff667722", border: "1px solid #ff667744",
      borderRadius: 8, padding: "10px 14px", color: "#ff8c8c",
      fontSize: 12, marginBottom: 14, lineHeight: 1.5,
    },
    info: {
      background: "#55efc418", border: "1px solid #55efc444",
      borderRadius: 8, padding: "10px 14px", color: "#55efc4",
      fontSize: 12, marginBottom: 14, lineHeight: 1.5,
    },
    forgot: {
      background: "transparent", border: "none", color: "#666",
      fontFamily: "inherit", fontSize: 12, cursor: "pointer",
      padding: "8px 0", marginTop: 4,
    },
  };

  return (
    <div style={S.page}>
      <div style={S.logo}>🔨 Anvil</div>
      <div style={S.tagline}>FORGE YOUR STRENGTH.</div>

      <form style={S.card} onSubmit={handleSubmit}>
        <div style={{...S.label, color:"#ff6b35", marginBottom:14, fontSize:13}}>
          {mode === "login" ? "Log In" : "Create Account"}
        </div>

        {error && <div style={S.err}>⚠ {error}</div>}
        {info && <div style={S.info}>✓ {info}</div>}

        {mode === "signup" && (
          <>
            <label style={S.label}>Display name (optional)</label>
            <input
              style={S.input}
              type="text"
              placeholder="e.g. Roger"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              autoComplete="name"
            />
          </>
        )}

        <label style={S.label}>Email</label>
        <input
          style={S.input}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label style={S.label}>Password</label>
        <input
          style={S.input}
          type="password"
          placeholder={mode === "signup" ? "Min 6 characters" : "••••••••"}
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
        />

        <button type="submit" style={S.submit} disabled={loading}>
          {loading ? "..." : mode === "login" ? "Log In →" : "Create Account →"}
        </button>

        {mode === "login" && (
          <button type="button" style={S.forgot} onClick={handleForgotPassword}>
            Forgot password?
          </button>
        )}

        <button
          type="button"
          style={S.toggle}
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setInfo(null); }}
        >
          {mode === "login"
            ? <>New to Anvil? <span style={S.toggleEm}>Create an account</span></>
            : <>Already have an account? <span style={S.toggleEm}>Log in</span></>
          }
        </button>
      </form>
    </div>
  );
}
