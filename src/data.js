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
