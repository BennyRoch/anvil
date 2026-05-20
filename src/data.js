// Data layer — wraps Supabase calls for workouts, profile, and active program.
// All functions assume the user is authenticated (use after auth check).

import { supabase } from "./supabase";

// ─── PROFILE ─────────────────────────────────────────────────────────────────
export async function loadProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error && error.code !== "PGRST116") { // PGRST116 = no rows
    console.error("loadProfile error:", error);
    return null;
  }
  if (!data) return null;
  return {
    name: data.display_name || "",
    experience: data.experience || "",
    goal: data.goal || "",
    username: data.username || null,
  };
}

export async function saveProfile(profile) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      display_name: profile.name || null,
      experience: profile.experience || null,
      goal: profile.goal || null,
      updated_at: new Date().toISOString(),
    });
  if (error) throw error;
}

// ─── WORKOUTS ────────────────────────────────────────────────────────────────
export async function loadWorkouts() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });
  if (error) {
    console.error("loadWorkouts error:", error);
    return [];
  }
  // Map DB schema → app schema
  return (data || []).map(w => ({
    id: w.id,
    date: w.date,
    name: w.name,
    tag: w.tag,
    exercises: w.exercises,
    totalSets: w.total_sets,
    totalVolume: parseFloat(w.total_volume),
  }));
}

export async function saveWorkout(workout) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const row = {
    user_id: user.id,
    name: workout.name,
    tag: workout.tag,
    date: workout.date,
    exercises: workout.exercises,
    total_sets: workout.totalSets,
    total_volume: workout.totalVolume,
  };
  // If workout has an existing ID (UUID format), update it; otherwise insert.
  // Local-only IDs are numbers (Date.now()) — those need fresh UUIDs from the DB.
  const isUuid = typeof workout.id === "string" && workout.id.length === 36;
  if (isUuid) {
    const { data, error } = await supabase
      .from("workouts")
      .update(row)
      .eq("id", workout.id)
      .eq("user_id", user.id)
      .select()
      .single();
    if (error) throw error;
    return mapWorkoutFromDb(data);
  } else {
    const { data, error } = await supabase
      .from("workouts")
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return mapWorkoutFromDb(data);
  }
}

export async function deleteWorkoutById(id) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw error;
}

export async function deleteAllWorkouts() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("user_id", user.id);
  if (error) throw error;
}

function mapWorkoutFromDb(w) {
  return {
    id: w.id,
    date: w.date,
    name: w.name,
    tag: w.tag,
    exercises: w.exercises,
    totalSets: w.total_sets,
    totalVolume: parseFloat(w.total_volume),
  };
}

// ─── ACTIVE PROGRAM ──────────────────────────────────────────────────────────
export async function loadActiveProgram() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { program: null, logs: {} };
  const { data, error } = await supabase
    .from("active_programs")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) {
    console.error("loadActiveProgram error:", error);
    return { program: null, logs: {} };
  }
  if (!data) return { program: null, logs: {} };
  return {
    program: data.program_data,
    logs: data.program_logs || {},
  };
}

export async function saveActiveProgram(program, logs) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  if (!program) {
    // No program → delete the row
    const { error } = await supabase
      .from("active_programs")
      .delete()
      .eq("user_id", user.id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase
    .from("active_programs")
    .upsert({
      user_id: user.id,
      program_data: program,
      program_logs: logs || {},
      start_date: program.startDate || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  if (error) throw error;
}

// ─── MIGRATION FROM LOCALSTORAGE ─────────────────────────────────────────────
// One-time helper to upload existing localStorage data to a freshly signed-in
// account. Called from the migration prompt.
export async function migrateLocalData() {
  const result = { workouts: 0, profile: false, program: false };

  // Profile
  try {
    const raw = localStorage.getItem("wt_profile2");
    if (raw) {
      const p = JSON.parse(raw);
      await saveProfile(p);
      result.profile = true;
    }
  } catch (e) { console.error("Profile migration failed:", e); }

  // Workouts
  try {
    const raw = localStorage.getItem("wt_workouts2");
    if (raw) {
      const workouts = JSON.parse(raw);
      if (Array.isArray(workouts) && workouts.length) {
        const { data: { user } } = await supabase.auth.getUser();
        const rows = workouts.map(w => ({
          user_id: user.id,
          name: w.name,
          tag: w.tag,
          date: w.date,
          exercises: w.exercises,
          total_sets: w.totalSets || 0,
          total_volume: w.totalVolume || 0,
        }));
        // Batch insert (Supabase handles ~1000 rows per call)
        const { error } = await supabase.from("workouts").insert(rows);
        if (!error) result.workouts = workouts.length;
        else console.error("Workouts migration error:", error);
      }
    }
  } catch (e) { console.error("Workouts migration failed:", e); }

  // Active program
  try {
    const programRaw = localStorage.getItem("wt_activeProgram");
    const logsRaw = localStorage.getItem("wt_programLogs");
    if (programRaw) {
      const program = JSON.parse(programRaw);
      const logs = logsRaw ? JSON.parse(logsRaw) : {};
      await saveActiveProgram(program, logs);
      result.program = true;
    }
  } catch (e) { console.error("Program migration failed:", e); }

  return result;
}

// Clean up localStorage keys after successful migration so we don't migrate again.
export function clearMigratedLocalData() {
  try {
    localStorage.removeItem("wt_workouts2");
    localStorage.removeItem("wt_profile2");
    localStorage.removeItem("wt_activeProgram");
    localStorage.removeItem("wt_programLogs");
  } catch {}
}

// Check whether there's local data worth migrating.
export function hasLocalDataToMigrate() {
  try {
    const w = localStorage.getItem("wt_workouts2");
    const p = localStorage.getItem("wt_profile2");
    const pr = localStorage.getItem("wt_activeProgram");
    const hasWorkouts = w && JSON.parse(w).length > 0;
    return !!(hasWorkouts || p || pr);
  } catch { return false; }
}

// ─── USERNAMES ───────────────────────────────────────────────────────────────
// Check if a username is available (case-insensitive). Returns false for
// invalid formats too, so the UI can treat "unavailable" uniformly.
export async function isUsernameAvailable(username) {
  if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) return false;
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .maybeSingle();
  if (error) { console.error("isUsernameAvailable error:", error); return false; }
  return !data;
}

export async function setUsername(username) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("profiles")
    .update({ username, updated_at: new Date().toISOString() })
    .eq("id", user.id);
  if (error) {
    if (error.code === "23505") throw new Error("That username is taken");
    throw error;
  }
}

// ─── PUBLIC PROFILE LOOKUP ───────────────────────────────────────────────────
export async function getProfileByUsername(username) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .ilike("username", username)
    .maybeSingle();
  if (error) { console.error("getProfileByUsername error:", error); return null; }
  return data;
}

// ─── FOLLOWS ─────────────────────────────────────────────────────────────────
export async function followUser(followeeId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: user.id, followee_id: followeeId });
  // 23505 = duplicate (already following); not actually an error from our POV
  if (error && error.code !== "23505") throw error;
}

export async function unfollowUser(followeeId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("followee_id", followeeId);
  if (error) throw error;
}

export async function getFollowCounts(userId) {
  const [followersRes, followingRes] = await Promise.all([
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("followee_id", userId),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId),
  ]);
  return {
    followers: followersRes.count || 0,
    following: followingRes.count || 0,
  };
}

export async function isFollowing(followeeId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", user.id)
    .eq("followee_id", followeeId)
    .maybeSingle();
  return !!data;
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 3: SOCIAL — posts, feed, likes, comments, discover
// ═══════════════════════════════════════════════════════════════════════════

// ─── IMAGE COMPRESSION (client-side, no deps) ────────────────────────────────
// Resizes large images to fit within MAX_DIM and re-encodes as JPEG at quality
// steps until the result is ≤ MAX_BYTES. Returns a Blob ready for upload.
const MAX_DIM = 1600;       // px — long edge cap
const MAX_BYTES = 1024 * 1024; // 1 MB target

async function compressImage(file) {
  if (!file) return null;
  // Read into an image element
  const dataUrl = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = () => rej(new Error("Could not read image"));
    r.readAsDataURL(file);
  });
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => rej(new Error("Could not decode image"));
    i.src = dataUrl;
  });
  // Compute target dimensions (preserve aspect)
  let { width, height } = img;
  if (width > MAX_DIM || height > MAX_DIM) {
    if (width >= height) {
      height = Math.round(height * (MAX_DIM / width));
      width = MAX_DIM;
    } else {
      width = Math.round(width * (MAX_DIM / height));
      height = MAX_DIM;
    }
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  // Try decreasing JPEG quality until we fit
  const qualities = [0.85, 0.75, 0.65, 0.55, 0.45];
  for (const q of qualities) {
    const blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", q));
    if (blob && blob.size <= MAX_BYTES) return blob;
    if (q === qualities[qualities.length - 1]) return blob; // give up, use smallest
  }
  return null;
}

// Build a public URL for an image stored in the post-images bucket.
export function postImageUrl(imagePath) {
  if (!imagePath) return null;
  const { data } = supabase.storage.from("post-images").getPublicUrl(imagePath);
  return data?.publicUrl || null;
}

// ─── POSTS ───────────────────────────────────────────────────────────────────

// Create a post from a workout. workout is the in-app shape (with totalSets/
// totalVolume), imageFile is an optional File from <input type=file>.
export async function createPost({ workout, caption, imageFile }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Upload image first (if provided). We tolerate upload failure by warning
  // the caller but still creating the post without the image.
  let imagePath = null;
  let imageWarning = null;
  if (imageFile) {
    try {
      const blob = await compressImage(imageFile);
      if (blob) {
        const ext = "jpg";
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("post-images")
          .upload(path, blob, { contentType: "image/jpeg", upsert: false });
        if (upErr) { imageWarning = upErr.message; }
        else { imagePath = path; }
      }
    } catch (err) {
      console.error("Image compression failed:", err);
      imageWarning = err.message || "Image upload failed";
    }
  }

  // Strip in-memory-only fields from snapshot
  const snapshot = {
    name: workout.name,
    tag: workout.tag,
    date: workout.date,
    exercises: workout.exercises,
    totalSets: workout.totalSets,
    totalVolume: workout.totalVolume,
  };

  const isUuid = typeof workout.id === "string" && workout.id.length === 36;
  const row = {
    user_id: user.id,
    workout_id: isUuid ? workout.id : null,
    workout_snapshot: snapshot,
    caption: (caption || "").trim() || null,
    image_path: imagePath,
  };
  const { data, error } = await supabase.from("posts").insert(row).select().single();
  if (error) throw error;
  return { post: data, imageWarning };
}

export async function deletePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  // Read the image path so we can clean up storage afterward (best effort)
  const { data: existing } = await supabase
    .from("posts").select("image_path").eq("id", postId).maybeSingle();
  const { error } = await supabase.from("posts").delete().eq("id", postId).eq("user_id", user.id);
  if (error) throw error;
  if (existing?.image_path) {
    try { await supabase.storage.from("post-images").remove([existing.image_path]); }
    catch (e) { console.warn("Storage cleanup failed:", e); }
  }
}

// Hydrate post rows with author profile + like count + has-liked + comment count.
async function hydratePosts(posts, currentUserId) {
  if (!posts.length) return [];
  const userIds = [...new Set(posts.map(p => p.user_id))];
  const postIds = posts.map(p => p.id);

  const [profilesRes, likeCountsRes, myLikesRes, commentCountsRes] = await Promise.all([
    supabase.from("profiles").select("id, username, display_name").in("id", userIds),
    supabase.from("post_likes").select("post_id").in("post_id", postIds),
    currentUserId
      ? supabase.from("post_likes").select("post_id").eq("user_id", currentUserId).in("post_id", postIds)
      : Promise.resolve({ data: [] }),
    supabase.from("post_comments").select("post_id").in("post_id", postIds),
  ]);

  const profileById = new Map((profilesRes.data || []).map(p => [p.id, p]));
  const likeCount = new Map();
  for (const r of (likeCountsRes.data || [])) likeCount.set(r.post_id, (likeCount.get(r.post_id) || 0) + 1);
  const myLiked = new Set((myLikesRes.data || []).map(r => r.post_id));
  const commentCount = new Map();
  for (const r of (commentCountsRes.data || [])) commentCount.set(r.post_id, (commentCount.get(r.post_id) || 0) + 1);

  return posts.map(p => ({
    ...p,
    author: profileById.get(p.user_id) || { id: p.user_id, username: null, display_name: null },
    like_count: likeCount.get(p.id) || 0,
    liked_by_me: myLiked.has(p.id),
    comment_count: commentCount.get(p.id) || 0,
    image_url: postImageUrl(p.image_path),
  }));
}

// Feed: posts from people I follow + my own, newest first. Paginated by
// passing the created_at of the last item as `before`.
export async function listFeed({ limit = 20, before = null } = {}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  // Who do I follow?
  const { data: follows, error: fErr } = await supabase
    .from("follows").select("followee_id").eq("follower_id", user.id);
  if (fErr) { console.error(fErr); return []; }
  const ids = [...(follows || []).map(f => f.followee_id), user.id];

  let q = supabase.from("posts")
    .select("*")
    .in("user_id", ids)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (before) q = q.lt("created_at", before);

  const { data, error } = await q;
  if (error) { console.error(error); return []; }
  return await hydratePosts(data || [], user.id);
}

// List posts authored by one user (newest first). Used on profile pages.
export async function listPostsByUser(userId, { limit = 20, before = null } = {}) {
  const { data: { user } } = await supabase.auth.getUser();
  const currentId = user?.id || null;
  let q = supabase.from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (before) q = q.lt("created_at", before);
  const { data, error } = await q;
  if (error) { console.error(error); return []; }
  return await hydratePosts(data || [], currentId);
}

// ─── DISCOVER: search & suggestions ──────────────────────────────────────────
export async function searchUsers(query) {
  const q = (query || "").trim();
  if (q.length < 1) return [];
  const like = `%${q}%`;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .or(`username.ilike.${like},display_name.ilike.${like}`)
    .not("username", "is", null)
    .limit(20);
  if (error) { console.error(error); return []; }
  return data || [];
}

// Suggested users: recent posters, excluding self + already-followed.
export async function suggestedUsers(limit = 10) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: follows } = await supabase
    .from("follows").select("followee_id").eq("follower_id", user.id);
  const excludeIds = new Set([user.id, ...((follows || []).map(f => f.followee_id))]);

  // Grab the most recent post per user via a generous slice then dedupe.
  // (For small/medium user bases this is fine; later we can move to a view.)
  const { data: recentPosts, error } = await supabase
    .from("posts")
    .select("user_id, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) { console.error(error); return []; }

  const seen = new Set();
  const userIds = [];
  for (const p of recentPosts || []) {
    if (excludeIds.has(p.user_id) || seen.has(p.user_id)) continue;
    seen.add(p.user_id);
    userIds.push(p.user_id);
    if (userIds.length >= limit) break;
  }
  if (!userIds.length) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .in("id", userIds)
    .not("username", "is", null);
  // Preserve recency order
  const byId = new Map((profiles || []).map(p => [p.id, p]));
  return userIds.map(id => byId.get(id)).filter(Boolean);
}

// ─── LIKES ───────────────────────────────────────────────────────────────────
export async function togglePostLike(postId, currentlyLiked) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  if (currentlyLiked) {
    const { error } = await supabase.from("post_likes")
      .delete().eq("post_id", postId).eq("user_id", user.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("post_likes")
      .insert({ post_id: postId, user_id: user.id });
    if (error && error.code !== "23505") throw error;  // ignore duplicate
  }
}

// ─── COMMENTS ────────────────────────────────────────────────────────────────
export async function listPostComments(postId) {
  const { data, error } = await supabase
    .from("post_comments")
    .select("id, post_id, user_id, body, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) { console.error(error); return []; }
  const comments = data || [];
  if (!comments.length) return [];
  const userIds = [...new Set(comments.map(c => c.user_id))];
  const { data: profiles } = await supabase
    .from("profiles").select("id, username, display_name").in("id", userIds);
  const byId = new Map((profiles || []).map(p => [p.id, p]));
  return comments.map(c => ({
    ...c,
    author: byId.get(c.user_id) || { id: c.user_id, username: null, display_name: null },
  }));
}

export async function createComment(postId, body) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const trimmed = (body || "").trim();
  if (!trimmed) throw new Error("Comment can't be empty");
  if (trimmed.length > 1000) throw new Error("Comment is too long");
  const { data, error } = await supabase
    .from("post_comments")
    .insert({ post_id: postId, user_id: user.id, body: trimmed })
    .select().single();
  if (error) throw error;
  // Attach author shape for immediate UI use
  const { data: prof } = await supabase
    .from("profiles").select("id, username, display_name").eq("id", user.id).maybeSingle();
  return { ...data, author: prof || { id: user.id, username: null, display_name: null } };
}

export async function deleteComment(commentId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase.from("post_comments")
    .delete().eq("id", commentId).eq("user_id", user.id);
  if (error) throw error;
}

// ─── FOLLOWER / FOLLOWING LISTS ──────────────────────────────────────────────
export async function listFollowers(userId) {
  const { data: rows, error } = await supabase
    .from("follows").select("follower_id").eq("followee_id", userId);
  if (error) { console.error(error); return []; }
  const ids = (rows || []).map(r => r.follower_id);
  if (!ids.length) return [];
  const { data: profiles } = await supabase
    .from("profiles").select("id, username, display_name").in("id", ids);
  return profiles || [];
}

export async function listFollowing(userId) {
  const { data: rows, error } = await supabase
    .from("follows").select("followee_id").eq("follower_id", userId);
  if (error) { console.error(error); return []; }
  const ids = (rows || []).map(r => r.followee_id);
  if (!ids.length) return [];
  const { data: profiles } = await supabase
    .from("profiles").select("id, username, display_name").in("id", ids);
  return profiles || [];
}

// ─── COPY POST TO LOG ────────────────────────────────────────────────────────
// Returns a workout-shaped object (sans id) ready to be set as `current`
// in App.jsx. Strips set values so the user logs their own numbers.
export function workoutFromPostSnapshot(snapshot, { blankSets = true } = {}) {
  const exercises = (snapshot.exercises || []).map(ex => ({
    name: ex.name,
    sets: (ex.sets || []).map(s => blankSets ? { reps: "", weight: "" } : { ...s }),
  }));
  return {
    name: snapshot.name || "Workout",
    tag: snapshot.tag || "",
    exercises,
  };
}
