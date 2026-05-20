// ComposePostModal — shown when the user taps "Share to feed" on a workout.
// Lets them add a caption and an optional image, then posts to the feed.

import { useState, useRef, useEffect } from "react";
import * as DB from "./data";

const MAX_CAPTION = 500;

export default function ComposePostModal({ workout, onClose, onPosted }) {
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!imageFile) { setImagePreview(null); return; }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  function pickImage(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please pick an image file");
      return;
    }
    setError(null);
    setImageFile(f);
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const { imageWarning } = await DB.createPost({ workout, caption, imageFile });
      onPosted?.({ imageWarning });
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not post");
      setSubmitting(false);
    }
  }

  const setCount = (workout?.exercises || []).reduce(
    (sum, ex) => sum + (ex.sets?.length || 0), 0
  );

  return (
    <div style={S.backdrop} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.header}>
          <div style={S.title}>SHARE TO FEED</div>
          <button onClick={onClose} style={S.closeBtn} aria-label="Close">×</button>
        </div>

        {/* Workout summary card */}
        <div style={S.workoutCard}>
          <div style={S.workoutName}>{workout?.name || "Workout"}</div>
          <div style={S.workoutMeta}>
            {workout?.tag ? <span style={S.tag}>{workout.tag}</span> : null}
            <span style={S.metaText}>
              {(workout?.exercises || []).length} exercises · {setCount} sets
            </span>
          </div>
        </div>

        <label style={S.label}>Caption (optional)</label>
        <textarea
          style={S.textarea}
          value={caption}
          onChange={e => setCaption(e.target.value.slice(0, MAX_CAPTION))}
          placeholder="Pumped after that session…"
          rows={3}
          maxLength={MAX_CAPTION}
        />
        <div style={S.charCount}>{caption.length}/{MAX_CAPTION}</div>

        <label style={S.label}>Photo (optional)</label>
        {imagePreview ? (
          <div style={S.previewWrap}>
            <img src={imagePreview} alt="Preview" style={S.preview} />
            <button onClick={() => { setImageFile(null); if (fileRef.current) fileRef.current.value = ""; }} style={S.removeImageBtn}>
              Remove
            </button>
          </div>
        ) : (
          <button onClick={() => fileRef.current?.click()} style={S.pickBtn}>
            <span style={{fontSize: 18, marginRight: 6}}>📷</span> Add photo
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={pickImage} style={{display: "none"}} />

        {error && <div style={S.error}>{error}</div>}

        <div style={S.actions}>
          <button onClick={onClose} style={S.cancelBtn} disabled={submitting}>CANCEL</button>
          <button onClick={submit} style={S.submitBtn} disabled={submitting}>
            {submitting ? "POSTING…" : "POST"}
          </button>
        </div>
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
    width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto",
    background: "#13131c", border: "1px solid #1f1f2e", borderRadius: 12,
    padding: 20, color: "#f0ede8",
    fontFamily: "'Barlow Condensed', sans-serif",
  },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  title: { fontSize: 18, fontWeight: 800, letterSpacing: 2, color: "#ff6b35" },
  closeBtn: {
    background: "transparent", border: "none", color: "#888",
    fontSize: 28, cursor: "pointer", padding: 0, lineHeight: 1,
  },
  workoutCard: {
    background: "#0a0a0f", border: "1px solid #1f1f2e", borderRadius: 8,
    padding: 12, marginBottom: 16,
  },
  workoutName: { fontSize: 16, fontWeight: 700, marginBottom: 4 },
  workoutMeta: { display: "flex", alignItems: "center", gap: 8 },
  tag: {
    fontSize: 10, padding: "2px 8px", borderRadius: 4,
    background: "rgba(255,107,53,0.12)", color: "#ff6b35",
    letterSpacing: 1, fontWeight: 700,
  },
  metaText: { fontSize: 12, color: "#888" },
  label: {
    display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
    color: "#888", marginBottom: 6, textTransform: "uppercase", marginTop: 4,
  },
  textarea: {
    width: "100%", boxSizing: "border-box",
    background: "#0a0a0f", border: "1px solid #1f1f2e", borderRadius: 8,
    color: "#f0ede8", fontFamily: "inherit", fontSize: 14,
    padding: 10, outline: "none", resize: "vertical",
  },
  charCount: { fontSize: 11, color: "#666", textAlign: "right", marginTop: 4, marginBottom: 12 },
  pickBtn: {
    width: "100%", padding: 14,
    background: "transparent", border: "1px dashed #1f1f2e", borderRadius: 8,
    color: "#888", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
    letterSpacing: 1.5, cursor: "pointer",
  },
  previewWrap: { position: "relative", borderRadius: 8, overflow: "hidden" },
  preview: { width: "100%", display: "block", maxHeight: 280, objectFit: "cover" },
  removeImageBtn: {
    position: "absolute", top: 8, right: 8,
    background: "rgba(10,10,15,0.85)", border: "1px solid #1f1f2e", borderRadius: 6,
    color: "#f0ede8", padding: "4px 10px", fontSize: 11, fontWeight: 700,
    letterSpacing: 1, cursor: "pointer", fontFamily: "inherit",
  },
  error: {
    marginTop: 12, padding: "8px 12px",
    background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)",
    borderRadius: 6, color: "#ff6b35", fontSize: 13,
  },
  actions: { display: "flex", gap: 10, marginTop: 18 },
  cancelBtn: {
    flex: 1, padding: 12,
    background: "transparent", border: "1px solid #1f1f2e", borderRadius: 8,
    color: "#888", fontFamily: "inherit", fontSize: 13, fontWeight: 800,
    letterSpacing: 2, cursor: "pointer",
  },
  submitBtn: {
    flex: 2, padding: 12,
    background: "#ff6b35", border: "none", borderRadius: 8,
    color: "#0a0a0f", fontFamily: "inherit", fontSize: 13, fontWeight: 800,
    letterSpacing: 2, cursor: "pointer",
  },
};
