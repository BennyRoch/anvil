import { useState, useEffect } from "react";

// ─── EXERCISE LIBRARY ────────────────────────────────────────────────────────
const EXERCISES = {
  Chest: [
    "Barbell Bench Press","Dumbbell Bench Press","Incline Barbell Press","Incline Dumbbell Press",
    "Decline Barbell Press","Decline Dumbbell Press","Close-Grip Bench Press","Reverse-Grip Bench Press",
    "Floor Press","Spoto Press","Larsen Press","Paused Bench Press","Pin Press","Board Press",
    "Push-Up","Wide Push-Up","Diamond Push-Up","Decline Push-Up","Incline Push-Up","Plyometric Push-Up",
    "Clap Push-Up","Archer Push-Up","One-Arm Push-Up","Handstand Push-Up","Pike Push-Up","Ring Push-Up",
    "Deficit Push-Up","T-Push-Up","Spider-Man Push-Up","Hindu Push-Up","Cable Chest Fly","Low-to-High Cable Fly",
    "High-to-Low Cable Fly","Dumbbell Fly","Incline Dumbbell Fly","Decline Dumbbell Fly","Pec Deck Machine",
    "Cable Crossover","Single-Arm Cable Crossover","Chest Dip","Weighted Chest Dip","Ring Dip","Bench Dip",
    "Svend Press","Plate Press","Machine Chest Press","Smith Machine Bench Press","Hammer Strength Press",
    "Landmine Press","Landmine Chest Press","Dumbbell Pullover","Barbell Pullover","Cable Pullover",
    "Guillotine Press","Larsen Floor Press","Dumbbell Squeeze Press",
  ],
  Back: [
    "Conventional Deadlift","Deadlift","Sumo Deadlift","Romanian Deadlift","Stiff-Leg Deadlift","Trap Bar Deadlift",
    "Snatch-Grip Deadlift","Deficit Deadlift","Block Pull","Rack Pull","Pause Deadlift","Single-Leg Deadlift",
    "Barbell Row","Pendlay Row","Yates Row","Dumbbell Row","Chest-Supported Dumbbell Row","Seal Row",
    "Meadows Row","T-Bar Row","Chest-Supported T-Bar Row","Inverted Row","Single-Arm Dumbbell Row",
    "Seated Cable Row","Wide-Grip Cable Row","Single-Arm Cable Row","Standing Cable Row","Kroc Row",
    "Lat Pulldown","Wide-Grip Lat Pulldown","Close-Grip Lat Pulldown","Reverse-Grip Lat Pulldown",
    "Single-Arm Lat Pulldown","Neutral-Grip Pulldown","Straight-Arm Pulldown","Behind-the-Neck Pulldown",
    "Pull-Up","Wide-Grip Pull-Up","Close-Grip Pull-Up","Chin-Up","Neutral-Grip Pull-Up","Weighted Pull-Up",
    "Commando Pull-Up","Archer Pull-Up","L-Sit Pull-Up","Muscle-Up","Kipping Pull-Up","Towel Pull-Up",
    "Face Pull","Rope Face Pull","Reverse Pec Deck","Rear Delt Row","Good Morning","Seated Good Morning",
    "Hyperextension","Reverse Hyperextension","45-Degree Back Extension","Jefferson Curl","Cat Cow",
    "Bird Dog","Superman","Renegade Row","Inverted Row","TRX Row","Pull-Down Machine","Iso-Lateral Row",
  ],
  Shoulders: [
    "Barbell Overhead Press","Standing Military Press","Seated Barbell Press","Push Press","Push Jerk",
    "Behind-the-Neck Press","Z Press","Dumbbell Shoulder Press","Seated Dumbbell Press","Arnold Press",
    "Single-Arm Dumbbell Press","Neutral-Grip DB Press","Landmine Press","Single-Arm Landmine Press",
    "Half-Kneeling Landmine Press","Cuban Press","Bradford Press","Pin Press","Machine Shoulder Press",
    "Smith Machine Press","Bottoms-Up Kettlebell Press","Kettlebell Strict Press","Bus Driver",
    "Lateral Raise","Dumbbell Lateral Raise","Cable Lateral Raise","Machine Lateral Raise","Leaning Lateral Raise",
    "Lying Lateral Raise","Y-Raise","L-Raise","Front Raise","Plate Front Raise","Cable Front Raise",
    "Alternating Front Raise","Rear Delt Fly","Reverse Pec Deck","Bent-Over Reverse Fly","Cable Reverse Fly",
    "Face Pull","Rope Pull-to-Throat","Upright Row","Wide-Grip Upright Row","Cable Upright Row",
    "Barbell Shrug","Dumbbell Shrug","Behind-the-Back Shrug","Trap Bar Shrug","Snatch-Grip High Pull",
    "Power Shrug","Overhead Carry","Bottoms-Up Press","Pike Push-Up","Handstand Hold","Handstand Walk",
    "Wall Walk","Scapular Pull-Up","Band Pull-Apart","Cable Y-Raise","Around-the-World",
  ],
  Biceps: [
    "Barbell Curl","EZ-Bar Curl","Wide-Grip Barbell Curl","Close-Grip Barbell Curl","Reverse Curl",
    "EZ-Bar Reverse Curl","Drag Curl","Cheat Curl","Dumbbell Curl","Alternating Dumbbell Curl",
    "Seated Dumbbell Curl","Hammer Curl","Cross-Body Hammer Curl","Rope Hammer Curl","Incline Dumbbell Curl",
    "Spider Curl","Concentration Curl","Preacher Curl","Dumbbell Preacher Curl","Machine Preacher Curl",
    "Cable Curl","Rope Cable Curl","High Cable Curl","Bayesian Cable Curl","Single-Arm Cable Curl",
    "Overhead Cable Curl","Zottman Curl","21s","Machine Curl","Reverse Preacher Curl","Pinwheel Curl",
    "Waiter Curl","Bodyweight Curl (Inverted)","TRX Curl","Resistance Band Curl","Wrist Curl",
    "Reverse Wrist Curl","Behind-the-Back Cable Curl","Standing Cable Curl","Lying Cable Curl",
    "Concentration Hammer Curl","Plate Pinch Curl","Tempo Curl",
  ],
  Triceps: [
    "Tricep Pushdown","Rope Pushdown","V-Bar Pushdown","Reverse-Grip Pushdown","Single-Arm Pushdown",
    "Straight-Bar Pushdown","Overhead Tricep Extension","Overhead Rope Extension","Single-Arm Overhead Extension",
    "Lying Tricep Extension","Skull Crusher","EZ-Bar Skull Crusher","Dumbbell Skull Crusher","Tate Press",
    "Close-Grip Bench Press","Floor Press","Board Press","JM Press","California Press","Decline Skull Crusher",
    "Tricep Dip","Bench Dip","Weighted Dip","Ring Dip","Bodyweight Skull Crusher","Diamond Push-Up",
    "Close-Grip Push-Up","Tricep Kickback","Cable Kickback","Dumbbell Kickback","Single-Arm Kickback",
    "Cable Overhead Extension","Lying Cable Extension","Cross-Body Cable Extension","Bench Press for Tris",
    "Reverse-Grip Tricep Pushdown","Push-Up to Tricep Extension","Machine Tricep Extension",
    "Resistance Band Pushdown","Plate Tricep Extension",
  ],
  Quads: [
    "Back Squat","Barbell Squat","Barbell Back Squat","High-Bar Squat","Low-Bar Squat","Pause Squat","Tempo Squat",
    "Front Squat","Cross-Arm Front Squat","Zercher Squat","Overhead Squat","Goblet Squat","Cyclist Squat",
    "Box Squat","Pin Squat","Anderson Squat","Hatfield Squat","Safety Bar Squat","Smith Machine Squat",
    "Leg Press","Single-Leg Press","Hack Squat","Reverse Hack Squat","Belt Squat","V-Squat",
    "Bulgarian Split Squat","Split Squat","Walking Lunge","Reverse Lunge","Forward Lunge","Lateral Lunge",
    "Curtsy Lunge","Dumbbell Lunge","Barbell Lunge","Walking Dumbbell Lunge","Deficit Lunge",
    "Step-Up","Dumbbell Step-Up","Barbell Step-Up","Lateral Step-Up","Box Step-Up","Leg Extension",
    "Single-Leg Extension","Sissy Squat","Wall Sit","Pistol Squat","Shrimp Squat","Cossack Squat",
    "Sumo Squat","Plié Squat","Jefferson Squat","Goblet Cossack Squat","Skater Squat","Spanish Squat",
    "Banded Squat","Jump Squat","Tuck Jump","Squat to Press","Thruster",
  ],
  Hamstrings: [
    "Romanian Deadlift","Single-Leg RDL","Dumbbell RDL","Snatch-Grip RDL","Stiff-Leg Deadlift",
    "Leg Curl","Lying Leg Curl","Seated Leg Curl","Single-Leg Curl","Standing Leg Curl",
    "Nordic Curl","Slider Curl","Swiss Ball Curl","Good Morning","Seated Good Morning",
    "Banded Good Morning","Glute-Ham Raise","Razor Curl","Reverse Hyperextension","45-Degree Hyper",
    "Kettlebell Swing","American Kettlebell Swing","Cable Pull-Through","Banded Pull-Through",
    "Hip Hinge","Single-Leg Stiff-Leg Deadlift","Deficit RDL","B-Stance RDL","Stability Ball Bridge Curl",
    "Trap Bar RDL",
  ],
  Glutes: [
    "Barbell Hip Thrust","Dumbbell Hip Thrust","Single-Leg Hip Thrust","B-Stance Hip Thrust","Banded Hip Thrust",
    "Machine Hip Thrust","Glute Bridge","Single-Leg Glute Bridge","Banded Glute Bridge","Frog Pump",
    "Cable Kickback","Single-Leg Cable Kickback","Donkey Kick","Banded Donkey Kick","Fire Hydrant",
    "Clamshell","Banded Clamshell","Side-Lying Hip Abduction","Standing Hip Abduction","Cable Hip Abduction",
    "Machine Hip Abduction","Sumo Deadlift","Sumo Squat","Curtsy Lunge","Reverse Lunge","Step-Up",
    "Bulgarian Split Squat","Hip Thrust March","Romanian Deadlift","Cable Pull-Through","Glute Kickback Machine",
    "Banded Lateral Walk","Banded Monster Walk","Single-Leg Glute Kickback","Stiff-Leg Cable Kickback",
    "Smith Machine Hip Thrust","Pendulum Glute Kick",
  ],
  Calves: [
    "Standing Calf Raise","Seated Calf Raise","Leg Press Calf Raise","Smith Machine Calf Raise",
    "Single-Leg Calf Raise","Donkey Calf Raise","Tibialis Raise","Toe Walking","Heel Walking",
    "Calf Press","Barbell Calf Raise","Dumbbell Calf Raise","Farmer's Calf Raise","Box Jump",
    "Pogo Hop","Jump Rope","Double-Under","Bunny Hop","Hill Sprint","Calf Raise on Step",
    "Eccentric Calf Raise","Banded Calf Raise","Weighted Tibialis Raise",
  ],
  Core: [
    "Plank","Side Plank","Forearm Plank","RKC Plank","Long-Lever Plank","Plank with Shoulder Tap",
    "Plank with Leg Raise","Plank-to-Push-Up","Side Plank with Hip Dip","Bird Dog","Dead Bug",
    "Hollow Hold","Hollow Rock","Arch Hold","Superman","Bear Crawl","Crab Walk","Crunch","Decline Crunch",
    "Reverse Crunch","Bicycle Crunch","Cable Crunch","Kneeling Cable Crunch","Standing Cable Crunch",
    "V-Up","Tuck-Up","Toe Touch","Sit-Up","GHD Sit-Up","Weighted Sit-Up","Russian Twist","Weighted Russian Twist",
    "Medicine Ball Slam","Woodchop","Cable Woodchop","Pallof Press","Half-Kneeling Pallof Press",
    "Anti-Rotation Press","Hanging Leg Raise","Hanging Knee Raise","Toes-to-Bar","Knees-to-Elbows","L-Sit Hold",
    "Dragon Flag","Hollow Body Pull-Up","Ab Wheel Rollout","Stability Ball Rollout","Barbell Rollout",
    "Farmer's Carry","Suitcase Carry","Overhead Carry","Bottoms-Up Carry","Windshield Wiper","Flutter Kick",
    "Scissor Kick","Mountain Climber","Slow Mountain Climber","Cross-Body Mountain Climber","Hollow Hold Flutter",
    "Stir the Pot","Side Bend","Cable Side Bend","Dumbbell Side Bend","Copenhagen Plank","Standing Ab Wheel",
  ],
  Forearms: [
    "Wrist Curl","Reverse Wrist Curl","Behind-the-Back Wrist Curl","Hammer Curl","Reverse Curl",
    "Zottman Curl","Farmer's Walk","Plate Pinch","Towel Pull-Up","Dead Hang","Bar Hang","Fat Grip Curl",
    "Wrist Roller","Finger Curl","Reverse Finger Curl","Gripper Squeeze","Forearm Plank","Rice Bucket",
  ],
  Olympic: [
    "Power Clean","Hang Clean","Clean Pull","Clean from Blocks","Muscle Clean","Squat Clean","Split Clean",
    "Power Snatch","Hang Snatch","Snatch Pull","Snatch Balance","Muscle Snatch","Squat Snatch","Split Snatch",
    "Clean and Jerk","Push Jerk","Split Jerk","Power Jerk","Jerk from Rack","Thruster",
    "Overhead Squat","High Pull","Hang High Pull","Snatch-Grip Deadlift","Clean-Grip Deadlift",
  ],
  Plyometric: [
    "Box Jump","Depth Jump","Broad Jump","Standing Long Jump","Tuck Jump","Squat Jump","Jump Squat",
    "Split Squat Jump","Lateral Bound","Skater Hop","Single-Leg Hop","Pogo Hop","Burpee","Burpee Box Jump",
    "Burpee Pull-Up","Plyo Push-Up","Clap Push-Up","Medicine Ball Slam","Medicine Ball Throw","Wall Ball",
    "Box Drill","Lateral Skip","Bounding","Hurdle Hop","Bunny Hop","High Knees","Butt Kicks",
  ],
  Cardio: [
    "Treadmill Run","Outdoor Run","Sprint","Hill Sprint","Trail Run","Tempo Run","Long Run","Interval Run",
    "Stationary Bike","Spin Class","Cycling","Outdoor Cycling","Mountain Bike","Recumbent Bike","Air Bike",
    "Rowing Machine","Ski Erg","Elliptical","Stair Climber","Stair Stepper","Stair Sprints","Jacob's Ladder",
    "Jump Rope","Double-Under","Boxing Bag Work","Shadow Boxing","Speed Bag","Heavy Bag","Battle Ropes",
    "Sled Push","Sled Pull","Sled Drag","Prowler Push","Tire Flip","Sledgehammer Swing","Farmer's Walk",
    "Burpee","Mountain Climber","High Knees","Jumping Jacks","Squat Jump","Box Jump","Swimming",
    "Pool Run","Hiking","Ruck March","Stairs (Real)","Walking","Power Walking",
  ],
  Mobility: [
    "Couch Stretch","Pigeon Pose","90/90 Stretch","Cossack Stretch","Hip Flexor Stretch","Lizard Pose",
    "Frog Stretch","Wall Slide","Cat Cow","Thread the Needle","World's Greatest Stretch","Bretzel",
    "Childs Pose","Downward Dog","Upward Dog","Cobra Stretch","Hamstring Stretch","Calf Stretch",
    "Shoulder Dislocates","Band Pull-Apart","Scapular Wall Slide","Wrist Circles","Ankle Circles",
    "Hip CARs","Shoulder CARs","Foam Rolling","Lacrosse Ball Release","Banded Distraction",
  ],
};

// Reverse lookup: exercise name → category
const EXERCISE_INDEX = (() => {
  const idx = {};
  for (const cat of Object.keys(EXERCISES)) {
    for (const ex of EXERCISES[cat]) idx[ex] = cat;
  }
  return idx;
})();

// Flat list for search
const ALL_EXERCISES = Object.entries(EXERCISES).flatMap(([cat, list]) =>
  list.map(name => ({ name, category: cat }))
);

// ─── SPLITS ──────────────────────────────────────────────────────────────────
// freqOptions: the allowed day counts. The base `days` array is the pattern —
// it gets cycled to fill whatever frequency the user picks.
const SPLITS = {
  "Push / Pull / Legs": {
    color: "#ff6b35",
    description: "Classic PPL split cycling push, pull, and leg days.",
    experience: ["Intermediate","Advanced"],
    freqOptions: [3,4,5,6,7],
    defaultFreq: 3,
    days: [
      { name:"Push Day", tag:"Push", exercises:["Barbell Bench Press","Barbell Overhead Press","Incline Dumbbell Press","Lateral Raise","Tricep Pushdown","Skull Crusher"] },
      { name:"Pull Day", tag:"Pull", exercises:["Deadlift","Barbell Row","Lat Pulldown","Face Pull","Barbell Curl","Hammer Curl"] },
      { name:"Leg Day", tag:"Legs", exercises:["Barbell Squat","Romanian Deadlift","Leg Press","Leg Curl","Standing Calf Raise","Leg Extension"] },
    ],
  },
  "Bro Split": {
    color: "#fd79a8",
    description: "One muscle group per day. Maximum focus per session.",
    experience: ["Beginner","Intermediate"],
    freqOptions: [4,5,6,7],
    defaultFreq: 5,
    days: [
      { name:"Chest Day",    tag:"Chest",     exercises:["Barbell Bench Press","Incline Dumbbell Press","Cable Crossover","Chest Dip","Pec Deck Machine"] },
      { name:"Back Day",     tag:"Back",      exercises:["Deadlift","Barbell Row","Lat Pulldown","Seated Cable Row","Face Pull"] },
      { name:"Shoulder Day", tag:"Shoulders", exercises:["Barbell Overhead Press","Arnold Press","Lateral Raise","Rear Delt Fly","Shrug"] },
      { name:"Arm Day",      tag:"Arms",      exercises:["Barbell Curl","Preacher Curl","Hammer Curl","Skull Crusher","Tricep Pushdown","Overhead Tricep Extension"] },
      { name:"Leg Day",      tag:"Legs",      exercises:["Barbell Squat","Leg Press","Romanian Deadlift","Leg Curl","Standing Calf Raise"] },
    ],
  },
  "Arnold Split": {
    color: "#fdcb6e",
    description: "Arnold's 6-day chest/back + shoulders/arms + legs. High volume.",
    experience: ["Advanced"],
    freqOptions: [4,6,7],
    defaultFreq: 6,
    days: [
      { name:"Chest & Back A",     tag:"Chest",     exercises:["Barbell Bench Press","Wide-Grip Pull-Up","Incline Dumbbell Press","Barbell Row","Dumbbell Fly","Seated Cable Row"] },
      { name:"Shoulders & Arms A", tag:"Shoulders", exercises:["Barbell Overhead Press","Barbell Curl","Lateral Raise","Skull Crusher","Rear Delt Fly","Hammer Curl"] },
      { name:"Legs A",             tag:"Legs",      exercises:["Barbell Squat","Romanian Deadlift","Leg Press","Leg Curl","Standing Calf Raise"] },
      { name:"Chest & Back B",     tag:"Chest",     exercises:["Incline Barbell Press","T-Bar Row","Cable Crossover","Lat Pulldown","Chest Dip","Dumbbell Row"] },
      { name:"Shoulders & Arms B", tag:"Shoulders", exercises:["Arnold Press","Preacher Curl","Upright Row","Tricep Dip","Cable Lateral Raise","Concentration Curl"] },
      { name:"Legs B",             tag:"Legs",      exercises:["Front Squat","Leg Extension","Bulgarian Split Squat","Seated Leg Curl","Seated Calf Raise"] },
    ],
  },
  "Upper / Lower": {
    color: "#74b9ff",
    description: "Alternates upper and lower body days for balanced strength.",
    experience: ["Beginner","Intermediate"],
    freqOptions: [2,3,4,5,6,7],
    defaultFreq: 4,
    days: [
      { name:"Upper A", tag:"Upper", exercises:["Barbell Bench Press","Barbell Row","Barbell Overhead Press","Lat Pulldown","Barbell Curl","Tricep Pushdown"] },
      { name:"Lower A", tag:"Lower", exercises:["Barbell Squat","Romanian Deadlift","Leg Extension","Leg Curl","Standing Calf Raise"] },
      { name:"Upper B", tag:"Upper", exercises:["Incline Dumbbell Press","Dumbbell Row","Arnold Press","Chin-Up","Hammer Curl","Skull Crusher"] },
      { name:"Lower B", tag:"Lower", exercises:["Romanian Deadlift","Leg Press","Bulgarian Split Squat","Leg Curl","Seated Calf Raise"] },
    ],
  },
  "Anterior / Posterior": {
    color: "#00cec9",
    description: "Front-of-body vs back-of-body. Great for posture and balance.",
    experience: ["Intermediate","Advanced"],
    freqOptions: [2,3,4,5,6,7],
    defaultFreq: 4,
    days: [
      { name:"Anterior", tag:"Anterior", exercises:["Barbell Bench Press","Barbell Overhead Press","Barbell Squat","Leg Press","Barbell Curl","Leg Extension"] },
      { name:"Posterior", tag:"Posterior", exercises:["Deadlift","Barbell Row","Romanian Deadlift","Lat Pulldown","Leg Curl","Rear Delt Fly"] },
    ],
  },
  "Left / Right": {
    color: "#a29bfe",
    description: "Unilateral training to fix imbalances and build symmetry.",
    experience: ["Beginner","Intermediate","Advanced"],
    freqOptions: [2,3,4,5,6,7],
    defaultFreq: 4,
    days: [
      { name:"Left Side",  tag:"Left",  exercises:["Single-Leg RDL","Single-Arm Cable Row","Bulgarian Split Squat","Single-Leg Calf Raise","Concentration Curl","Kickback"] },
      { name:"Right Side", tag:"Right", exercises:["Single-Leg RDL","Single-Arm Cable Row","Bulgarian Split Squat","Single-Leg Calf Raise","Concentration Curl","Kickback"] },
    ],
  },
  "Full Body": {
    color: "#55efc4",
    description: "Hit everything each session. Perfect for beginners.",
    experience: ["Beginner"],
    freqOptions: [2,3,4,5,6,7],
    defaultFreq: 3,
    days: [
      { name:"Full Body A", tag:"Full", exercises:["Barbell Squat","Barbell Bench Press","Barbell Row","Barbell Overhead Press","Plank","Standing Calf Raise"] },
      { name:"Full Body B", tag:"Full", exercises:["Deadlift","Incline Dumbbell Press","Lat Pulldown","Dumbbell Shoulder Press","Hanging Leg Raise","Seated Calf Raise"] },
    ],
  },
};

// Given a split's base days array and a target frequency, cycle through the
// pattern to produce exactly `freq` named workout days for the week.
function buildWeekSchedule(splitDays, freq) {
  const ORDINALS = ["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"];
  const DAY_NAMES = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  return Array.from({ length: freq }, (_, i) => {
    const base = splitDays[i % splitDays.length];
    // If the split has fewer base days than freq, append A/B/C suffixes on repeats
    const cycle = Math.floor(i / splitDays.length);
    const suffix = freq > splitDays.length && cycle > 0 ? ` (${["A","B","C","D"][cycle]})` : "";
    return {
      ...base,
      scheduledDay: DAY_NAMES[i],
      displayName: `${base.name}${suffix}`,
    };
  });
}

const EXPERIENCE_LEVELS = ["Beginner","Intermediate","Advanced"];
const GOALS = ["Build Muscle","Get Strong","Lose Fat","Stay Active"];

const TAG_COLORS = {
  Push:"#ff6b35", Pull:"#4ecdc4", Legs:"#ffe66d", Chest:"#fd79a8",
  Back:"#74b9ff", Shoulders:"#fdcb6e", Arms:"#e17055", Upper:"#6c5ce7",
  Lower:"#00b894", Anterior:"#00cec9", Posterior:"#e84393", Left:"#a29bfe",
  Right:"#ff7675", Full:"#55efc4", Core:"#b2bec3",
};

const FREQ_LABELS = { 2:"2x / week", 3:"3x / week", 4:"4x / week", 5:"5x / week", 6:"6x / week", 7:"Daily" };

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US",{ month:"short", day:"numeric" });
}

// Highlights matched substring in an exercise name. Returns React fragments.
function highlightMatch(name, q) {
  if (!q) return name;
  const lower = name.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return name;
  return (
    <>
      {name.slice(0, idx)}
      <span style={{color:"#ff6b35",fontWeight:800}}>{name.slice(idx, idx+q.length)}</span>
      {name.slice(idx+q.length)}
    </>
  );
}

// Style for the progression quick-fill buttons (+5 lbs, +1 rep, Repeat).
function progBtn(color) {
  return {
    background: `${color}18`,
    border: `1px solid ${color}44`,
    color,
    borderRadius: 7,
    padding: "6px 11px",
    fontFamily: "inherit",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 0.5,
    cursor: "pointer",
    flex: "0 0 auto",
    transition: "all 0.12s",
  };
}

export default function App() {
  const [tab, setTab] = useState("log");
  const [workouts, setWorkouts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wt_workouts2")||"[]"); } catch { return []; }
  });
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wt_profile2")||"null"); } catch { return null; }
  });
  const [current, setCurrent] = useState({ name:"", exercises:[], tag:null });
  const [addEx, setAddEx] = useState({ open:false, category:"All", search:"" });
  // Plans navigation: null = list, string = split detail
  const [selectedSplit, setSelectedSplit] = useState(null);
  // Per-split frequency selections (persist across navigation)
  const [splitFreqs, setSplitFreqs] = useState({});
  const [onboarding, setOnboarding] = useState(false);
  const [draft, setDraft] = useState({ experience:"", name:"", goal:"" });
  // Delete confirmation: id of workout pending delete, or "all" for clear-all
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ─── ACTIVE PROGRAM STATE ────────────────────────────────────────────────────
  // activeProgram: { source: "split"|"ai"|"custom", splitName?, frequency?, days:[{name,tag,exercises}], startDate }
  const [activeProgram, setActiveProgram] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wt_activeProgram")||"null"); } catch { return null; }
  });
  // programLogs: { "weekIndex-dayIndex": { workoutId, completedAt } }
  // Maps each scheduled slot to the workout that fulfilled it.
  const [programLogs, setProgramLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wt_programLogs")||"{}"); } catch { return {}; }
  });
  // Which week the user is currently viewing in the Program tab.
  // null = current week (auto-calculated from startDate).
  const [viewedWeek, setViewedWeek] = useState(null);
  // Tracks which program slot is being edited in the Log tab, so finishing
  // can link the workout back to the schedule.
  const [activeSlot, setActiveSlot] = useState(null); // { weekIndex, dayIndex } or null

  useEffect(() => {
    if (activeProgram) try { localStorage.setItem("wt_activeProgram", JSON.stringify(activeProgram)); } catch {}
    else try { localStorage.removeItem("wt_activeProgram"); } catch {}
  }, [activeProgram]);
  useEffect(() => {
    try { localStorage.setItem("wt_programLogs", JSON.stringify(programLogs)); } catch {}
  }, [programLogs]);

  // ─── AI COACH STATE ──────────────────────────────────────────────────────────
  const [aiState, setAiState] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wt_aiPlan") || "null"); } catch { return null; }
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiForm, setAiForm] = useState({
    daysPerWeek: 4,
    focus: "Balanced",
    sessionLength: "60 min",
    equipment: "Full gym",
    notes: "",
  });

  useEffect(() => {
    if (aiState) try { localStorage.setItem("wt_aiPlan", JSON.stringify(aiState)); } catch {}
  }, [aiState]);

  useEffect(() => { if (!profile) setOnboarding(true); }, []);
  useEffect(() => { try { localStorage.setItem("wt_workouts2", JSON.stringify(workouts)); } catch {} }, [workouts]);
  useEffect(() => { if (profile) try { localStorage.setItem("wt_profile2", JSON.stringify(profile)); } catch {} }, [profile]);

  function getFreq(splitName) {
    return splitFreqs[splitName] ?? SPLITS[splitName].defaultFreq;
  }
  function setFreq(splitName, freq) {
    setSplitFreqs(f => ({ ...f, [splitName]: freq }));
  }

  // ─── PROGRESSIVE OVERLOAD HELPERS ────────────────────────────────────────────
  // Find the most recent set for a given exercise (the top set by weight from
  // the most recent workout that contained it). Returns { reps, weight } or null.
  function findLastPerformance(exerciseName) {
    for (const w of workouts) {
      const ex = w.exercises.find(e => e.name === exerciseName);
      if (!ex) continue;
      // Use the heaviest set as the reference. If tie on weight, use highest reps.
      let best = null;
      for (const s of ex.sets) {
        const wt = parseFloat(s.weight) || 0;
        const rp = parseFloat(s.reps) || 0;
        if (wt === 0 && rp === 0) continue;
        if (!best || wt > best.weight || (wt === best.weight && rp > best.reps)) {
          best = { weight: wt, reps: rp, date: w.date };
        }
      }
      if (best) return best;
    }
    return null;
  }

  // Find the previous identical workout (same name) — used to show "same as last time"
  function findLastSession(workoutName) {
    return workouts.find(w => w.name === workoutName) || null;
  }

  // Build an exercise object with empty sets but a `last` reference attached.
  function buildExerciseEntry(name) {
    const last = findLastPerformance(name);
    return {
      name,
      last,                       // { weight, reps, date } or null
      sets: [{ reps:"", weight:"" }],
    };
  }

  function startDay(day) {
    const exercises = day.exercises.map(buildExerciseEntry);
    setCurrent({
      name: day.displayName || day.name,
      tag: day.tag,
      exercises,
    });
    setSelectedSplit(null);
    setTab("log");
  }

  function addSet(ei) { setCurrent(c=>({ ...c, exercises:c.exercises.map((e,i)=>i===ei?{...e,sets:[...e.sets,{reps:"",weight:""}]}:e) })); }
  function removeSet(ei,si) { setCurrent(c=>({ ...c, exercises:c.exercises.map((e,i)=>i===ei?{...e,sets:e.sets.filter((_,j)=>j!==si)}:e) })); }
  function updateSet(ei,si,field,val) { setCurrent(c=>({ ...c, exercises:c.exercises.map((e,i)=>i===ei?{...e,sets:e.sets.map((s,j)=>j===si?{...s,[field]:val}:s)}:e) })); }
  function removeExercise(ei) { setCurrent(c=>({ ...c, exercises:c.exercises.filter((_,i)=>i!==ei) })); }
  function addExToLog(name) {
    setCurrent(c => ({ ...c, exercises: [...c.exercises, buildExerciseEntry(name)] }));
    setAddEx(a => ({ ...a, open:false, search:"" }));
  }

  // Fill all empty sets of an exercise with values relative to last performance.
  // delta: { reps: 0, weight: 5 } adds 5 lbs to last weight, same reps.
  function applyProgression(ei, delta) {
    setCurrent(c => ({
      ...c,
      exercises: c.exercises.map((e, i) => {
        if (i !== ei || !e.last) return e;
        const targetWeight = e.last.weight + (delta.weight || 0);
        const targetReps = e.last.reps + (delta.reps || 0);
        return {
          ...e,
          sets: e.sets.map(s => ({
            reps: s.reps === "" ? String(targetReps) : s.reps,
            weight: s.weight === "" ? String(targetWeight) : s.weight,
          })),
        };
      }),
    }));
  }

  // Copy last session exactly — fill empty sets with last performance's values.
  function repeatLast(ei) {
    applyProgression(ei, { reps: 0, weight: 0 });
  }

  // ─── AI COACH FUNCTIONS ──────────────────────────────────────────────────────
  // Summarize the user's training history into a compact JSON the AI can analyze.
  function buildHistorySummary() {
    if (!workouts.length) return null;
    const last30 = workouts.filter(w => Date.now() - new Date(w.date).getTime() < 30*86400000);

    // Per-exercise progression: first vs latest top set
    const exerciseTrends = {};
    for (const w of [...workouts].reverse()) { // oldest first
      for (const ex of w.exercises) {
        const topSet = ex.sets.reduce((best, s) => {
          const wt = parseFloat(s.weight)||0, rp = parseFloat(s.reps)||0;
          if (wt===0 && rp===0) return best;
          if (!best || wt > best.weight || (wt===best.weight && rp > best.reps)) return { weight: wt, reps: rp };
          return best;
        }, null);
        if (!topSet) continue;
        if (!exerciseTrends[ex.name]) exerciseTrends[ex.name] = { first: topSet, latest: topSet, count: 1 };
        else { exerciseTrends[ex.name].latest = topSet; exerciseTrends[ex.name].count++; }
      }
    }

    // Identify stalled lifts (3+ sessions, no progression in weight or reps)
    const stalled = [];
    const progressing = [];
    for (const [name, t] of Object.entries(exerciseTrends)) {
      if (t.count < 3) continue;
      const wDelta = t.latest.weight - t.first.weight;
      const rDelta = t.latest.reps - t.first.reps;
      if (wDelta === 0 && rDelta === 0) stalled.push(name);
      else if (wDelta > 0 || rDelta > 0) progressing.push({ name, weightGain: wDelta, repGain: rDelta });
    }

    // Workout frequency tags (which body parts they hit most)
    const tagCounts = {};
    workouts.forEach(w => { if (w.tag) tagCounts[w.tag] = (tagCounts[w.tag]||0) + 1; });

    return {
      totalWorkouts: workouts.length,
      last30Days: last30.length,
      exercisesTrained: Object.keys(exerciseTrends).length,
      topExercises: Object.entries(exerciseTrends)
        .sort((a,b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([name, t]) => ({ name, sessions: t.count, latest: `${t.latest.weight}lb × ${t.latest.reps}` })),
      stalledLifts: stalled.slice(0, 5),
      bestProgress: progressing.sort((a,b) => b.weightGain - a.weightGain).slice(0, 3),
      frequentTags: tagCounts,
    };
  }

  async function generateAIPlan() {
    setAiLoading(true);
    setAiError(null);
    try {
      const summary = buildHistorySummary();
      const exerciseLibrary = Object.entries(EXERCISES)
        .map(([cat, list]) => `${cat}: ${list.slice(0, 30).join(", ")}`).join("\n");

      const userPrompt = `Generate a personalized workout split for this lifter.

PROFILE:
- Experience: ${profile?.experience || "Unknown"}
- Goal: ${profile?.goal || "Build Muscle"}
- Name: ${profile?.name || "Lifter"}

PREFERENCES:
- Days per week: ${aiForm.daysPerWeek}
- Focus: ${aiForm.focus}
- Session length: ${aiForm.sessionLength}
- Equipment: ${aiForm.equipment}
${aiForm.notes ? `- Additional notes: ${aiForm.notes}` : ""}

${summary ? `TRAINING HISTORY:
- Total workouts logged: ${summary.totalWorkouts} (${summary.last30Days} in last 30 days)
- Unique exercises trained: ${summary.exercisesTrained}
- Top exercises: ${summary.topExercises.map(e => `${e.name} (${e.sessions}x, latest: ${e.latest})`).join("; ")}
- Stalled lifts (no progress): ${summary.stalledLifts.length ? summary.stalledLifts.join(", ") : "none"}
- Best progress: ${summary.bestProgress.map(p => `${p.name} (+${p.weightGain}lb, +${p.repGain} reps)`).join("; ") || "none yet"}
` : "TRAINING HISTORY: No workouts logged yet — generate a starter plan."}

EXERCISE LIBRARY (use ONLY these exact names):
${exerciseLibrary}

Generate a JSON plan with this exact structure (no markdown, no explanations, just JSON):
{
  "name": "Plan name (e.g. 'Roger's Hypertrophy Push/Pull/Legs')",
  "description": "1-2 sentence summary explaining your reasoning",
  "rationale": "2-3 sentences on WHY this plan addresses their history/goals",
  "days": [
    { "name": "Day name", "tag": "Push|Pull|Legs|Upper|Lower|Full|Chest|Back|Shoulders|Arms", "exercises": ["Exact Exercise Name From Library", "..."] }
  ]
}

Use 5-7 exercises per day. Address stalled lifts with variations. Be specific and intelligent.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const data = await response.json();
      const textBlock = data.content?.find(b => b.type === "text");
      if (!textBlock) throw new Error("No text in response");

      // Strip any markdown fences and parse
      const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
      const plan = JSON.parse(cleaned);

      // Validate structure
      if (!plan.days || !Array.isArray(plan.days)) throw new Error("Invalid plan structure");

      // Filter exercises to ones that actually exist in our library
      plan.days = plan.days.map(d => ({
        ...d,
        exercises: d.exercises.filter(e => EXERCISE_INDEX[e]),
      }));

      setAiState({ plan, generatedAt: new Date().toISOString() });
    } catch (err) {
      console.error(err);
      setAiError(err.message || "Failed to generate plan. Try again.");
    } finally {
      setAiLoading(false);
    }
  }

  function startAIDay(day) {
    const exercises = day.exercises.map(buildExerciseEntry);
    setCurrent({ name: day.name, tag: day.tag, exercises });
    setTab("log");
  }

  // ─── DELETE WORKOUT FUNCTIONS ────────────────────────────────────────────────
  function deleteWorkout(id) {
    setWorkouts(w => w.filter(workout => workout.id !== id));
    // Unlink any program slots referencing this workout
    setProgramLogs(prev => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (next[key].workoutId === id) delete next[key];
      }
      return next;
    });
    setConfirmDelete(null);
  }

  function clearAllWorkouts() {
    setWorkouts([]);
    setProgramLogs({});
    setConfirmDelete(null);
  }

  // ─── ACTIVE PROGRAM FUNCTIONS ────────────────────────────────────────────────
  // Adopt a split as the active program at a given frequency.
  function adoptSplitAsProgram(splitName, frequency) {
    const split = SPLITS[splitName];
    const days = buildWeekSchedule(split.days, frequency);
    setActiveProgram({
      source: "split",
      splitName,
      frequency,
      color: split.color,
      days: days.map(d => ({ name: d.displayName, tag: d.tag, exercises: d.exercises, scheduledDay: d.scheduledDay })),
      startDate: new Date().toISOString(),
    });
    setProgramLogs({});
    setViewedWeek(null);
    setTab("program");
  }

  // Adopt the AI-generated plan as the active program.
  function adoptAIPlanAsProgram() {
    if (!aiState?.plan) return;
    setActiveProgram({
      source: "ai",
      planName: aiState.plan.name,
      color: "#ff6b35",
      days: aiState.plan.days.map((d, i) => ({
        name: d.name,
        tag: d.tag,
        exercises: d.exercises,
        scheduledDay: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][i] || `Day ${i+1}`,
      })),
      startDate: new Date().toISOString(),
    });
    setProgramLogs({});
    setViewedWeek(null);
    setTab("program");
  }

  function endProgram() {
    setActiveProgram(null);
    setProgramLogs({});
    setViewedWeek(null);
  }

  // Compute the current week index based on startDate.
  function getCurrentWeekIndex() {
    if (!activeProgram?.startDate) return 0;
    const days = Math.floor((Date.now() - new Date(activeProgram.startDate).getTime()) / 86400000);
    return Math.max(0, Math.floor(days / 7));
  }

  // Start logging a specific scheduled day (loads exercises into Log tab).
  function startScheduledDay(weekIndex, dayIndex) {
    const day = activeProgram.days[dayIndex];
    const slotKey = `${weekIndex}-${dayIndex}`;
    const existingLog = programLogs[slotKey];

    // If already completed, load that exact workout for editing
    if (existingLog) {
      const workout = workouts.find(w => w.id === existingLog.workoutId);
      if (workout) {
        const exercises = workout.exercises.map(e => ({
          ...e,
          last: findLastPerformanceExcluding(e.name, workout.id),
        }));
        setCurrent({ name: workout.name, tag: workout.tag, exercises, editingId: workout.id });
        setActiveSlot({ weekIndex, dayIndex });
        setTab("log");
        return;
      }
    }

    // Otherwise start fresh from the program template
    const exercises = day.exercises.map(buildExerciseEntry);
    setCurrent({ name: day.name, tag: day.tag, exercises });
    setActiveSlot({ weekIndex, dayIndex });
    setTab("log");
  }

  // Like findLastPerformance but skips a specific workout id (used when editing).
  function findLastPerformanceExcluding(exerciseName, excludeId) {
    for (const w of workouts) {
      if (w.id === excludeId) continue;
      const ex = w.exercises.find(e => e.name === exerciseName);
      if (!ex) continue;
      let best = null;
      for (const s of ex.sets) {
        const wt = parseFloat(s.weight) || 0, rp = parseFloat(s.reps) || 0;
        if (wt === 0 && rp === 0) continue;
        if (!best || wt > best.weight || (wt === best.weight && rp > best.reps)) {
          best = { weight: wt, reps: rp, date: w.date };
        }
      }
      if (best) return best;
    }
    return null;
  }

  // Manually toggle a day's completion status without logging a full workout.
  function toggleSlotComplete(weekIndex, dayIndex) {
    const slotKey = `${weekIndex}-${dayIndex}`;
    setProgramLogs(prev => {
      const next = { ...prev };
      if (next[slotKey]) {
        // If linked to a real workout, also delete that workout
        if (next[slotKey].workoutId) {
          setWorkouts(ws => ws.filter(w => w.id !== next[slotKey].workoutId));
        }
        delete next[slotKey];
      } else {
        next[slotKey] = { workoutId: null, completedAt: new Date().toISOString(), manual: true };
      }
      return next;
    });
  }

  function finishWorkout() {
    if (!current.exercises.length) return;
    // Strip the `last` reference field — it's only for the live UI, not persistence
    const cleanExercises = current.exercises.map(({ name, sets }) => ({ name, sets }));
    const editingId = current.editingId;
    const id = editingId || Date.now();
    const entry = {
      id,
      date: editingId ? (workouts.find(w => w.id === editingId)?.date || new Date().toISOString()) : new Date().toISOString(),
      name: current.name || "Workout",
      tag: current.tag,
      exercises: cleanExercises,
      totalSets: cleanExercises.reduce((a,e)=>a+e.sets.length,0),
      totalVolume: cleanExercises.reduce((a,e)=>a+e.sets.reduce((b,s)=>b+(parseFloat(s.weight)||0)*(parseFloat(s.reps)||0),0),0),
    };

    if (editingId) {
      // Update existing workout
      setWorkouts(ws => ws.map(w => w.id === editingId ? entry : w));
    } else {
      setWorkouts(w => [entry, ...w]);
    }

    // If this was logged against a program slot, link it
    if (activeSlot) {
      const slotKey = `${activeSlot.weekIndex}-${activeSlot.dayIndex}`;
      setProgramLogs(prev => ({
        ...prev,
        [slotKey]: { workoutId: id, completedAt: new Date().toISOString(), manual: false },
      }));
      setCurrent({ name:"", exercises:[], tag:null });
      setActiveSlot(null);
      setTab("program");
    } else {
      setCurrent({ name:"", exercises:[], tag:null });
      setTab("history");
    }
  }

  const totalVolume = workouts.reduce((a,w)=>a+w.totalVolume,0);
  const totalSessions = workouts.length;
  const streak = (() => {
    if (!workouts.length) return 0;
    let s=0, d=new Date(); d.setHours(0,0,0,0);
    for (let w of workouts) { const wd=new Date(w.date); wd.setHours(0,0,0,0); if(Math.abs(d-wd)<=86400000){s++;d=wd;}else break; }
    return s;
  })();
  const bests = {};
  workouts.forEach(w=>w.exercises.forEach(e=>{
    const best=Math.max(...e.sets.map(s=>parseFloat(s.weight)||0));
    if(best>0&&(!bests[e.name]||bests[e.name]<best)) bests[e.name]=best;
  }));

  const myLevel = profile?.experience;
  const recommended = Object.entries(SPLITS).filter(([,s])=>myLevel&&s.experience.includes(myLevel));
  const others = Object.entries(SPLITS).filter(([,s])=>!myLevel||!s.experience.includes(myLevel));

  // ─── STYLES ─────────────────────────────────────────────────────────────────
  const S = {
    app:{ minHeight:"100vh", background:"#0a0a0f", color:"#f0ede8", fontFamily:"'Barlow Condensed','Arial Narrow',sans-serif", fontSize:16 },
    header:{ background:"#0a0a0f", borderBottom:"1px solid #1e1e2e", padding:"16px 20px 0", position:"sticky", top:0, zIndex:100 },
    logo:{ fontSize:24, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:"#ff6b35" },
    nav:{ display:"flex", marginTop:12 },
    navBtn:(a)=>({ flex:1, padding:"10px 0", border:"none", background:"transparent", color:a?"#ff6b35":"#555", fontFamily:"inherit", fontSize:12, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", borderBottom:a?"2px solid #ff6b35":"2px solid transparent" }),
    section:{ padding:"20px 16px 60px" },
    card:{ background:"#111118", border:"1px solid #1e1e2e", borderRadius:12, padding:16, marginBottom:14 },
    exCard:{ background:"#0e0e18", border:"1px solid #1e1e2e", borderRadius:10, padding:14, marginBottom:12 },
    input:{ flex:1, background:"#1a1a28", border:"1px solid #2a2a3e", borderRadius:7, padding:"7px 10px", color:"#f0ede8", fontFamily:"inherit", fontSize:14, fontWeight:600, textAlign:"center", outline:"none" },
    input2:{ width:"100%", background:"#1a1a28", border:"1px solid #2a2a3e", borderRadius:8, padding:"10px 14px", color:"#f0ede8", fontFamily:"inherit", fontSize:14, outline:"none", boxSizing:"border-box" },
    tag:(t)=>({ background:`${TAG_COLORS[t]||"#ff6b35"}22`, color:TAG_COLORS[t]||"#ff6b35", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", display:"inline-block" }),
    statGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:18 },
    stat:{ background:"#111118", border:"1px solid #1e1e2e", borderRadius:12, padding:"14px 8px", textAlign:"center" },
    statNum:{ fontSize:26, fontWeight:800, color:"#ff6b35", display:"block" },
    statLabel:{ fontSize:10, color:"#555", letterSpacing:1, textTransform:"uppercase", marginTop:2, display:"block" },
    finishBtn:{ width:"100%", background:"linear-gradient(90deg,#ff6b35,#ff8c42)", border:"none", borderRadius:10, padding:14, color:"#fff", fontFamily:"inherit", fontSize:15, fontWeight:800, letterSpacing:2, textTransform:"uppercase", cursor:"pointer", marginTop:8, boxShadow:"0 4px 20px #ff6b3544" },
    emptyState:{ textAlign:"center", color:"#444", padding:"40px 0", fontSize:13, letterSpacing:1 },
    label:{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#555", display:"block", marginBottom:8 },
    primaryBtn:{ background:"#ff6b35", border:"none", borderRadius:8, padding:"10px 18px", color:"#fff", fontFamily:"inherit", fontSize:13, fontWeight:700, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" },
    ghostBtn:{ background:"transparent", border:"1px solid #2a2a3e", borderRadius:8, padding:"10px 18px", color:"#666", fontFamily:"inherit", fontSize:13, fontWeight:700, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" },
    smBtn:{ background:"#1e1e2e", border:"none", borderRadius:7, padding:"6px 14px", color:"#ccc", fontFamily:"inherit", fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" },
    selBtn:(sel)=>({ flex:1, padding:"10px 6px", border:sel?"2px solid #ff6b35":"1px solid #2a2a3e", borderRadius:8, background:sel?"#ff6b3520":"#111118", color:sel?"#ff6b35":"#666", fontFamily:"inherit", fontSize:12, fontWeight:700, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }),
    freqChip:(sel,color)=>({ padding:"7px 0", minWidth:52, border:sel?`2px solid ${color}`:"1px solid #2a2a3e", borderRadius:8, background:sel?`${color}18`:"#111118", color:sel?color:"#555", fontFamily:"inherit", fontSize:12, fontWeight:800, letterSpacing:1, textTransform:"uppercase", cursor:"pointer", textAlign:"center", transition:"all 0.15s" }),
  };

  // ─── ONBOARDING ──────────────────────────────────────────────────────────────
  if (onboarding) return (
    <div style={{...S.app,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28,minHeight:"100vh"}}>
      <div style={{fontSize:36,fontWeight:800,letterSpacing:4,textTransform:"uppercase",color:"#ff6b35",marginBottom:6}}>🔨 Anvil</div>
      <div style={{color:"#444",fontSize:12,letterSpacing:2,marginBottom:40}}>FORGE YOUR STRENGTH.</div>
      <div style={{width:"100%",maxWidth:360}}>
        <span style={{...S.label,marginBottom:10}}>What's your name? (optional)</span>
        <input style={{...S.input2,marginBottom:24}} placeholder="e.g. Roger" value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))}/>
        <span style={{...S.label,marginBottom:10}}>Experience level</span>
        <div style={{display:"flex",gap:8,marginBottom:24}}>
          {EXPERIENCE_LEVELS.map(lvl=>(
            <button key={lvl} style={S.selBtn(draft.experience===lvl)} onClick={()=>setDraft(d=>({...d,experience:lvl}))}>{lvl}</button>
          ))}
        </div>
        <span style={{...S.label,marginBottom:10}}>Primary goal</span>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:36}}>
          {GOALS.map(g=>(
            <button key={g} style={{...S.selBtn(draft.goal===g),flex:"none",padding:"8px 14px"}} onClick={()=>setDraft(d=>({...d,goal:g}))}>{g}</button>
          ))}
        </div>
        <button style={{...S.finishBtn,opacity:draft.experience?1:0.45}} onClick={()=>{ if(draft.experience){ setProfile(draft); setOnboarding(false); }}}>
          {draft.experience?"Let's Go →":"Pick your level to continue"}
        </button>
      </div>
    </div>
  );

  // ─── SPLIT DETAIL VIEW ────────────────────────────────────────────────────────
  function SplitDetail({ name }) {
    const split = SPLITS[name];
    const freq = getFreq(name);
    const schedule = buildWeekSchedule(split.days, freq);
    return (
      <>
        <button style={{...S.ghostBtn,marginBottom:16,padding:"7px 14px",fontSize:12}} onClick={()=>setSelectedSplit(null)}>← All Splits</button>

        {/* Header */}
        <div style={{fontWeight:800,fontSize:22,marginBottom:4}}>{name}</div>
        <div style={{color:"#555",fontSize:13,marginBottom:14}}>{split.description}</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
          {split.experience.map(x=>(
            <span key={x} style={{background:"#1e1e2e",color:"#777",borderRadius:4,padding:"2px 8px",fontSize:10,letterSpacing:1}}>{x}</span>
          ))}
        </div>

        {/* Frequency selector */}
        <div style={{background:"#111118",border:"1px solid #1e1e2e",borderRadius:12,padding:"14px 16px",marginBottom:18}}>
          <div style={{...S.label,marginBottom:12,color:"#ff6b35"}}>How many days per week?</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {split.freqOptions.map(f=>(
              <button key={f} style={S.freqChip(freq===f, split.color)} onClick={()=>setFreq(name,f)}>
                {f === 7 ? "Daily" : `${f}x`}
              </button>
            ))}
          </div>
          <div style={{marginTop:12,color:"#444",fontSize:12,lineHeight:1.6}}>
            {freq===7
              ? "No rest days — maximum frequency. Only recommended if you're very experienced and your body is adapted."
              : freq>=6
              ? "Very high frequency. Make sure you're sleeping and eating enough to recover."
              : freq>=4
              ? "Great balance of frequency and recovery. Each muscle gets hit multiple times per week."
              : `${freq} sessions/week. ${split.days.length > freq ? `Rotating through ${split.days.length} workout types.` : "One cycle through all workout types."}`
            }
          </div>
        </div>

        {/* Adopt as Program CTA */}
        <button
          style={{
            width:"100%",
            background:`linear-gradient(90deg,${split.color},${split.color}cc)`,
            border:"none",
            borderRadius:10,
            padding:"13px",
            color:"#0a0a0f",
            fontFamily:"inherit",
            fontSize:13,
            fontWeight:800,
            letterSpacing:2,
            textTransform:"uppercase",
            cursor:"pointer",
            marginBottom:18,
            boxShadow:`0 4px 20px ${split.color}33`,
          }}
          onClick={()=>adoptSplitAsProgram(name, freq)}
        >
          📅 Start This Program ({freq===7?"Daily":`${freq}x/wk`})
        </button>

        {/* Weekly schedule */}
        <div style={{...S.label,marginBottom:12}}>Preview · {freq}-Day Weekly Schedule</div>
        {schedule.map((day,i)=>(
          <div key={i} style={{
            background:"#111118",
            border:`1px solid ${TAG_COLORS[day.tag]||"#1e1e2e"}22`,
            borderLeft:`3px solid ${TAG_COLORS[day.tag]||split.color}`,
            borderRadius:12,padding:"13px 16px",marginBottom:10,
          }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div>
                <div style={{fontSize:10,color:"#444",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>{day.scheduledDay}</div>
                <div style={{fontWeight:700,fontSize:15}}>{day.displayName}</div>
              </div>
              <span style={S.tag(day.tag)}>{day.tag}</span>
            </div>
            <div style={{color:"#444",fontSize:12,lineHeight:1.7,marginBottom:10}}>{day.exercises.join(" · ")}</div>
            <button style={{...S.primaryBtn,padding:"6px 14px",fontSize:11}} onClick={()=>startDay(day)}>Start →</button>
          </div>
        ))}

        {/* Rest days note */}
        {freq < 7 && (
          <div style={{background:"#0e0e18",border:"1px solid #1a1a28",borderRadius:10,padding:"11px 14px",marginTop:4}}>
            <div style={{color:"#444",fontSize:12}}>
              🛌 <span style={{color:"#555"}}>{7-freq} rest day{7-freq!==1?"s":""}/week</span> — recovery is where growth happens.
            </div>
          </div>
        )}
      </>
    );
  }

  // ─── MAIN APP ────────────────────────────────────────────────────────────────
  return (
    <div style={S.app}>
      <div style={S.header}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={S.logo}>🔨 Anvil</span>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {profile?.experience && <span style={S.tag(myLevel==="Beginner"?"Full":myLevel==="Intermediate"?"Upper":"Chest")}>{profile.experience}</span>}
            <button style={{background:"none",border:"none",color:"#444",fontSize:16,cursor:"pointer"}} onClick={()=>{setDraft(profile||{});setOnboarding(true);}}>⚙</button>
          </div>
        </div>
        <nav style={S.nav}>
          {[["log","Log"],["program","Program"],["plans","Plans"],["coach","Coach"],["history","History"],["stats","Stats"]].map(([id,label])=>(
            <button key={id} style={S.navBtn(tab===id)} onClick={()=>setTab(id)}>
              {id==="coach" ? <span style={{color:tab==="coach"?"#ff6b35":"#888"}}>✨ {label}</span>
                : id==="program" && activeProgram ? <span style={{color:tab==="program"?"#ff6b35":"#888"}}>📅 {label}</span>
                : label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── LOG ─────────────────────────────────────────────────────────────── */}
      {tab==="log" && (
        <div style={S.section}>
          {current.exercises.length===0 ? (
            <>
              <input style={{...S.input2,marginBottom:14}} placeholder="Workout name (e.g. Monday Push)" value={current.name} onChange={e=>setCurrent(c=>({...c,name:e.target.value}))}/>
              <div style={S.emptyState}><div style={{fontSize:36,marginBottom:10}}>🏋️</div><div>Pick a plan from the Plans tab<br/>or add exercises below</div></div>
              <button style={{...S.ghostBtn,width:"100%"}} onClick={()=>setAddEx(a=>({...a,open:true}))}>+ Add Exercise</button>
            </>
          ) : (() => {
            const lastSession = findLastSession(current.name);
            const daysAgo = lastSession ? Math.floor((Date.now() - new Date(lastSession.date).getTime()) / 86400000) : null;
            return (
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:lastSession?10:16}}>
                <div>
                  <div style={{fontWeight:800,fontSize:18,letterSpacing:1}}>{current.name||"Today's Workout"}</div>
                  {current.tag&&<span style={S.tag(current.tag)}>{current.tag}</span>}
                </div>
                <button style={S.ghostBtn} onClick={()=>{setCurrent({name:"",exercises:[],tag:null});setActiveSlot(null);}}>Clear</button>
              </div>

              {/* Program slot banner — shows when logging into the active program */}
              {activeSlot && activeProgram && (
                <div style={{
                  background:"linear-gradient(90deg,#55efc418,transparent)",
                  border:"1px solid #55efc444",
                  borderLeft:"3px solid #55efc4",
                  borderRadius:10,
                  padding:"10px 14px",
                  marginBottom:10,
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"space-between",
                  gap:10,
                }}>
                  <div style={{fontSize:12,lineHeight:1.5}}>
                    <div style={{color:"#55efc4",fontWeight:700,letterSpacing:1,textTransform:"uppercase",fontSize:10,marginBottom:2}}>
                      📅 Program · Week {activeSlot.weekIndex+1}
                    </div>
                    <div style={{color:"#aaa"}}>
                      {current.editingId ? "Editing logged workout" : "Logging into your program schedule"}
                    </div>
                  </div>
                  <button
                    style={{background:"none",border:"none",color:"#55efc4",fontSize:11,fontWeight:700,letterSpacing:1,cursor:"pointer",padding:"4px 8px"}}
                    onClick={()=>{setActiveSlot(null);setCurrent(c=>({...c,editingId:undefined}));setTab("program");}}
                  >
                    ← Back
                  </button>
                </div>
              )}

              {/* Continuity banner — shows when this exact workout has been done before */}
              {lastSession && !activeSlot && (
                <div style={{
                  background:"linear-gradient(90deg,#ff6b3515,#ff6b3505)",
                  border:"1px solid #ff6b3530",
                  borderLeft:"3px solid #ff6b35",
                  borderRadius:10,
                  padding:"10px 14px",
                  marginBottom:16,
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"space-between",
                  gap:10,
                }}>
                  <div style={{fontSize:12,lineHeight:1.5}}>
                    <div style={{color:"#ff6b35",fontWeight:700,letterSpacing:1,textTransform:"uppercase",fontSize:10,marginBottom:2}}>
                      📈 Continuing your progress
                    </div>
                    <div style={{color:"#aaa"}}>
                      Last <span style={{color:"#ddd",fontWeight:700}}>{current.name}</span> was{" "}
                      <span style={{color:"#ff6b35",fontWeight:700}}>
                        {daysAgo === 0 ? "today" : daysAgo === 1 ? "yesterday" : `${daysAgo} days ago`}
                      </span>
                      . Time to push it.
                    </div>
                  </div>
                </div>
              )}
              {current.exercises.map((ex,ei)=>{
                const last = ex.last;
                const placeholderReps = last ? String(last.reps) : "0";
                const placeholderWeight = last ? String(last.weight) : "0";
                return (
                <div key={ei} style={S.exCard}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{ex.name}</div>
                      {last ? (
                        <div style={{fontSize:11,color:"#666",marginTop:3,letterSpacing:0.5}}>
                          Last: <span style={{color:"#ff6b35",fontWeight:700}}>{last.weight} lbs × {last.reps} reps</span>
                          <span style={{color:"#333",marginLeft:6}}>· {formatDate(last.date)}</span>
                        </div>
                      ) : (
                        <div style={{fontSize:11,color:"#3a3a4a",marginTop:3,letterSpacing:0.5,fontStyle:"italic"}}>
                          First time — set your baseline!
                        </div>
                      )}
                    </div>
                    <button style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:15}} onClick={()=>removeExercise(ei)}>✕</button>
                  </div>

                  {/* Progression quick-fill buttons (only show if there's a last performance) */}
                  {last && (
                    <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                      <button
                        style={progBtn("#ff6b35")}
                        onClick={()=>applyProgression(ei,{reps:0,weight:5})}
                        title="Add 5 lbs"
                      >+5 lbs</button>
                      <button
                        style={progBtn("#ff6b35")}
                        onClick={()=>applyProgression(ei,{reps:0,weight:2.5})}
                        title="Add 2.5 lbs"
                      >+2.5 lbs</button>
                      <button
                        style={progBtn("#4ecdc4")}
                        onClick={()=>applyProgression(ei,{reps:1,weight:0})}
                        title="Add 1 rep"
                      >+1 rep</button>
                      <button
                        style={progBtn("#888")}
                        onClick={()=>repeatLast(ei)}
                        title="Same as last time"
                      >= Repeat</button>
                    </div>
                  )}

                  <div style={{display:"grid",gridTemplateColumns:"28px 1fr 10px 1fr 28px 24px",gap:6,alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:9,color:"#555",fontWeight:700}}>SET</span>
                    <span style={{fontSize:9,color:"#555",fontWeight:700,textAlign:"center"}}>REPS</span><span/>
                    <span style={{fontSize:9,color:"#555",fontWeight:700,textAlign:"center"}}>LBS</span><span/><span/>
                  </div>
                  {ex.sets.map((set,si)=>(
                    <div key={si} style={{display:"grid",gridTemplateColumns:"28px 1fr 10px 1fr 28px 24px",gap:6,alignItems:"center",marginBottom:6}}>
                      <span style={{fontSize:11,color:"#555",fontWeight:700}}>{si+1}</span>
                      <input style={S.input} type="number" placeholder={placeholderReps} value={set.reps} onChange={e=>updateSet(ei,si,"reps",e.target.value)}/>
                      <span style={{textAlign:"center",color:"#2a2a3e",fontSize:12}}>×</span>
                      <input style={S.input} type="number" placeholder={placeholderWeight} value={set.weight} onChange={e=>updateSet(ei,si,"weight",e.target.value)}/>
                      <span style={{fontSize:10,color:"#555"}}>lbs</span>
                      {ex.sets.length>1&&<button style={{background:"none",border:"none",color:"#333",cursor:"pointer",fontSize:14}} onClick={()=>removeSet(ei,si)}>−</button>}
                    </div>
                  ))}
                  <button style={{...S.smBtn,marginTop:4}} onClick={()=>addSet(ei)}>+ Set</button>
                </div>
                );
              })}
              <button style={{...S.ghostBtn,width:"100%",marginBottom:10}} onClick={()=>setAddEx(a=>({...a,open:true}))}>+ Add Exercise</button>
              <button style={S.finishBtn} onClick={finishWorkout}>✓ Finish Workout</button>
            </>
            );
          })()}

          {addEx.open&&(() => {
            const q = addEx.search.trim().toLowerCase();
            let results;
            if (q.length > 0) {
              // Search across ALL exercises
              const seen = new Set();
              results = ALL_EXERCISES
                .filter(({name}) => {
                  const lower = name.toLowerCase();
                  if (seen.has(lower)) return false;
                  if (!lower.includes(q)) return false;
                  seen.add(lower);
                  return true;
                })
                .sort((a, b) => {
                  // Prioritize names that start with the query
                  const aStart = a.name.toLowerCase().startsWith(q) ? 0 : 1;
                  const bStart = b.name.toLowerCase().startsWith(q) ? 0 : 1;
                  if (aStart !== bStart) return aStart - bStart;
                  return a.name.localeCompare(b.name);
                });
            } else if (addEx.category === "All") {
              results = ALL_EXERCISES.slice().sort((a, b) => a.name.localeCompare(b.name));
            } else {
              results = (EXERCISES[addEx.category] || []).map(name => ({name, category: addEx.category}));
            }
            return (
            <div style={{position:"fixed",inset:0,background:"#000c",zIndex:200,display:"flex",alignItems:"flex-end"}}>
              <div style={{background:"#111118",borderRadius:"20px 20px 0 0",padding:22,width:"100%",maxHeight:"85vh",display:"flex",flexDirection:"column",boxSizing:"border-box"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontWeight:800,fontSize:14,letterSpacing:2,textTransform:"uppercase"}}>Add Exercise</div>
                  <div style={{color:"#444",fontSize:11,fontWeight:700,letterSpacing:1}}>{ALL_EXERCISES.length} TOTAL</div>
                </div>

                {/* Search Bar */}
                <div style={{position:"relative",marginBottom:12}}>
                  <input
                    autoFocus
                    style={{...S.input2,paddingLeft:36,marginBottom:0,fontSize:15}}
                    placeholder="Search exercises..."
                    value={addEx.search}
                    onChange={e=>setAddEx(a=>({...a,search:e.target.value}))}
                  />
                  <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#555",fontSize:14}}>🔍</span>
                  {addEx.search && (
                    <button
                      style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"#2a2a3e",border:"none",borderRadius:"50%",width:22,height:22,color:"#888",cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}
                      onClick={()=>setAddEx(a=>({...a,search:""}))}
                    >✕</button>
                  )}
                </div>

                {/* Category Chips (only when not searching) */}
                {!q && (
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14,maxHeight:80,overflowY:"auto"}}>
                    <button
                      style={{background:addEx.category==="All"?"#ff6b35":"#1a1a28",border:"none",borderRadius:6,padding:"4px 10px",color:addEx.category==="All"?"#fff":"#666",fontFamily:"inherit",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}
                      onClick={()=>setAddEx(a=>({...a,category:"All"}))}
                    >All</button>
                    {Object.keys(EXERCISES).map(cat=>(
                      <button key={cat} style={{background:addEx.category===cat?"#ff6b35":"#1a1a28",border:"none",borderRadius:6,padding:"4px 10px",color:addEx.category===cat?"#fff":"#666",fontFamily:"inherit",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}} onClick={()=>setAddEx(a=>({...a,category:cat}))}>
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {/* Results count */}
                <div style={{color:"#444",fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:8,fontWeight:700}}>
                  {q ? `${results.length} result${results.length!==1?"s":""}` : addEx.category==="All" ? "All exercises" : `${addEx.category} · ${results.length}`}
                </div>

                {/* Results */}
                <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:6,marginBottom:12,minHeight:200}}>
                  {results.length === 0 ? (
                    <div style={{textAlign:"center",color:"#444",padding:"40px 20px"}}>
                      <div style={{fontSize:32,marginBottom:10}}>🔍</div>
                      <div style={{fontSize:13}}>No exercises found for "{addEx.search}"</div>
                      <div style={{fontSize:11,color:"#333",marginTop:8}}>Try a shorter or different term</div>
                    </div>
                  ) : results.map((ex,i)=>(
                    <button
                      key={ex.name+i}
                      style={{background:"#1a1a28",border:"1px solid #2a2a3e",borderRadius:8,padding:"10px 14px",color:"#f0ede8",fontFamily:"inherit",fontSize:13,fontWeight:600,textAlign:"left",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}
                      onClick={()=>addExToLog(ex.name)}
                    >
                      <span>{q ? highlightMatch(ex.name, q) : ex.name}</span>
                      <span style={{color:"#555",fontSize:10,letterSpacing:1,textTransform:"uppercase",fontWeight:700,marginLeft:8,flexShrink:0}}>{ex.category}</span>
                    </button>
                  ))}
                </div>

                <button style={{...S.ghostBtn,width:"100%"}} onClick={()=>setAddEx(a=>({...a,open:false,search:""}))}>Cancel</button>
              </div>
            </div>
            );
          })()}
        </div>
      )}

      {/* ── PROGRAM ─────────────────────────────────────────────────────────── */}
      {tab==="program" && (
        <div style={S.section}>
          {!activeProgram ? (
            // No active program
            <div style={{textAlign:"center",padding:"40px 20px"}}>
              <div style={{fontSize:42,marginBottom:14}}>📅</div>
              <div style={{fontWeight:800,fontSize:18,letterSpacing:1,marginBottom:8}}>No Active Program</div>
              <div style={{color:"#666",fontSize:13,maxWidth:280,margin:"0 auto",lineHeight:1.6,marginBottom:24}}>
                Pick a split from the Plans tab or generate one with the AI Coach to start your weekly program.
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                <button style={S.primaryBtn} onClick={()=>setTab("plans")}>Browse Plans</button>
                <button style={{...S.ghostBtn,border:"1px solid #ff6b3544",color:"#ff6b35"}} onClick={()=>setTab("coach")}>✨ AI Coach</button>
              </div>
            </div>
          ) : (() => {
            const currentWeek = getCurrentWeekIndex();
            const week = viewedWeek === null ? currentWeek : viewedWeek;
            const isCurrentWeek = week === currentWeek;
            const isPastWeek = week < currentWeek;
            const completedThisWeek = activeProgram.days.filter((_, i) => programLogs[`${week}-${i}`]).length;
            const startDateObj = new Date(activeProgram.startDate);
            const weekStartDate = new Date(startDateObj.getTime() + week * 7 * 86400000);
            const weekEndDate = new Date(weekStartDate.getTime() + 6 * 86400000);

            return (
              <>
                {/* Program header */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{flex:1}}>
                    <div style={{color:activeProgram.color,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",fontSize:10,marginBottom:4}}>
                      {activeProgram.source==="ai" ? "✨ AI Program" : "Active Program"}
                    </div>
                    <div style={{fontWeight:800,fontSize:20,lineHeight:1.2}}>{activeProgram.splitName || activeProgram.planName}</div>
                  </div>
                  <button
                    style={{background:"transparent",border:"1px solid #2a2a3e",borderRadius:7,padding:"5px 11px",color:"#666",fontFamily:"inherit",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}
                    onClick={()=>{ if(confirm("End your current program? Your workout history will be kept.")) endProgram(); }}
                  >
                    End
                  </button>
                </div>

                {/* Week navigator */}
                <div style={{
                  display:"flex",alignItems:"center",justifyContent:"space-between",
                  background:"#111118",border:"1px solid #1e1e2e",borderRadius:12,padding:"10px 14px",marginTop:14,marginBottom:14,
                }}>
                  <button
                    style={{background:"none",border:"none",color:week>0?"#ff6b35":"#333",cursor:week>0?"pointer":"not-allowed",fontSize:18,padding:"4px 10px"}}
                    disabled={week===0}
                    onClick={()=>setViewedWeek(week-1)}
                  >◀</button>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:14,fontWeight:800,letterSpacing:1}}>
                      Week {week+1}
                      {isCurrentWeek && <span style={{color:"#ff6b35",fontSize:10,marginLeft:6,letterSpacing:1}}>· CURRENT</span>}
                      {isPastWeek && <span style={{color:"#555",fontSize:10,marginLeft:6,letterSpacing:1}}>· PAST</span>}
                    </div>
                    <div style={{fontSize:10,color:"#555",marginTop:2,letterSpacing:0.5}}>
                      {formatDate(weekStartDate)} – {formatDate(weekEndDate)}
                    </div>
                  </div>
                  <button
                    style={{background:"none",border:"none",color:week<currentWeek?"#ff6b35":"#333",cursor:week<currentWeek?"pointer":"not-allowed",fontSize:18,padding:"4px 10px"}}
                    disabled={week>=currentWeek}
                    onClick={()=>setViewedWeek(week+1)}
                  >▶</button>
                </div>

                {/* Progress bar */}
                <div style={{marginBottom:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"#666"}}>
                      Progress
                    </span>
                    <span style={{fontSize:11,fontWeight:700,color:"#ff6b35"}}>
                      {completedThisWeek}/{activeProgram.days.length}
                    </span>
                  </div>
                  <div style={{height:6,background:"#1a1a28",borderRadius:3,overflow:"hidden"}}>
                    <div style={{
                      height:"100%",
                      width:`${(completedThisWeek/activeProgram.days.length)*100}%`,
                      background:`linear-gradient(90deg,${activeProgram.color||"#ff6b35"},#ff8c42)`,
                      borderRadius:3,
                      transition:"width 0.3s",
                    }}/>
                  </div>
                </div>

                {/* Scheduled days */}
                {activeProgram.days.map((day, i) => {
                  const slotKey = `${week}-${i}`;
                  const log = programLogs[slotKey];
                  const isDone = !!log;
                  const linkedWorkout = log?.workoutId ? workouts.find(w => w.id === log.workoutId) : null;
                  return (
                    <div key={i} style={{
                      background: isDone ? "#0e1812" : "#111118",
                      border: `1px solid ${isDone ? "#55efc433" : (TAG_COLORS[day.tag]||"#1e1e2e")+"22"}`,
                      borderLeft: `3px solid ${isDone ? "#55efc4" : (TAG_COLORS[day.tag]||activeProgram.color||"#ff6b35")}`,
                      borderRadius:12,
                      padding:"13px 16px",
                      marginBottom:10,
                      opacity: isDone ? 0.92 : 1,
                    }}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                            <span style={{fontSize:10,color:"#444",fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{day.scheduledDay || `Day ${i+1}`}</span>
                            {isDone && <span style={{fontSize:10,color:"#55efc4",fontWeight:700,letterSpacing:1}}>✓ COMPLETE</span>}
                          </div>
                          <div style={{fontWeight:700,fontSize:15,color:isDone?"#aaa":"#f0ede8",textDecoration:isDone?"line-through":"none",textDecorationColor:"#55efc466"}}>
                            {day.name}
                          </div>
                        </div>
                        <span style={S.tag(day.tag)}>{day.tag}</span>
                      </div>

                      {linkedWorkout ? (
                        <div style={{color:"#666",fontSize:12,marginBottom:10}}>
                          <span style={{color:"#55efc4",fontWeight:700}}>{linkedWorkout.totalSets} sets</span>
                          {" · "}
                          <span style={{color:"#55efc4",fontWeight:700}}>{Math.round(linkedWorkout.totalVolume).toLocaleString()} lbs vol</span>
                          {" · "}
                          {formatDate(linkedWorkout.date)}
                        </div>
                      ) : (
                        <div style={{color:"#444",fontSize:12,lineHeight:1.7,marginBottom:10}}>
                          {day.exercises.slice(0,4).join(" · ")}{day.exercises.length>4 ? ` · +${day.exercises.length-4} more` : ""}
                        </div>
                      )}

                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <button
                          style={{
                            background: isDone ? "transparent" : "#ff6b35",
                            border: isDone ? "1px solid #2a2a3e" : "none",
                            borderRadius:7,
                            padding:"6px 12px",
                            color: isDone ? "#888" : "#fff",
                            fontFamily:"inherit",
                            fontSize:11,
                            fontWeight:700,
                            letterSpacing:1,
                            textTransform:"uppercase",
                            cursor:"pointer",
                          }}
                          onClick={()=>startScheduledDay(week, i)}
                        >
                          {isDone ? "✎ Edit" : "Start →"}
                        </button>
                        <button
                          style={{
                            background:"transparent",
                            border:`1px solid ${isDone?"#55efc466":"#2a2a3e"}`,
                            borderRadius:7,
                            padding:"6px 12px",
                            color: isDone ? "#55efc4" : "#666",
                            fontFamily:"inherit",
                            fontSize:11,
                            fontWeight:700,
                            letterSpacing:1,
                            textTransform:"uppercase",
                            cursor:"pointer",
                          }}
                          onClick={()=>toggleSlotComplete(week, i)}
                        >
                          {isDone ? "↺ Undo" : "✓ Mark Done"}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Week complete message */}
                {completedThisWeek === activeProgram.days.length && (
                  <div style={{
                    background:"linear-gradient(90deg,#55efc418,transparent)",
                    border:"1px solid #55efc444",
                    borderLeft:"3px solid #55efc4",
                    borderRadius:10,
                    padding:"12px 14px",
                    marginTop:10,
                  }}>
                    <div style={{color:"#55efc4",fontWeight:700,letterSpacing:1,textTransform:"uppercase",fontSize:10,marginBottom:4}}>
                      🎉 Week Complete!
                    </div>
                    <div style={{color:"#aaa",fontSize:12,lineHeight:1.6}}>
                      Great work hitting all {activeProgram.days.length} sessions. {isCurrentWeek ? "Next week starts automatically." : "Browse to other weeks with ◀ ▶ above."}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* ── PLANS ───────────────────────────────────────────────────────────── */}
      {tab==="plans" && (
        <div style={S.section}>
          {selectedSplit ? (
            <SplitDetail name={selectedSplit}/>
          ) : (
            <>
              {recommended.length>0&&(
                <>
                  <div style={{...S.label,marginBottom:4}}>Recommended for you</div>
                  <div style={{color:"#444",fontSize:12,marginBottom:14}}>
                    Based on your {myLevel} level ·{" "}
                    <button style={{background:"none",border:"none",color:"#ff6b35",fontFamily:"inherit",fontSize:12,cursor:"pointer",padding:0}} onClick={()=>{setDraft(profile);setOnboarding(true);}}>change</button>
                  </div>
                  {recommended.map(([name,split])=>(
                    <SplitCard key={name} name={name} split={split} freq={getFreq(name)} onSelect={()=>setSelectedSplit(name)} S={S} dimmed={false}/>
                  ))}
                  {others.length>0&&<div style={{...S.label,marginTop:22,marginBottom:12}}>Other splits</div>}
                </>
              )}
              {others.map(([name,split])=>(
                <SplitCard key={name} name={name} split={split} freq={getFreq(name)} onSelect={()=>setSelectedSplit(name)} S={S} dimmed={true}/>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── AI COACH ────────────────────────────────────────────────────────── */}
      {tab==="coach" && (
        <div style={S.section}>
          {aiLoading ? (
            <div style={{textAlign:"center",padding:"60px 20px"}}>
              <div style={{fontSize:42,marginBottom:16,animation:"pulse 1.5s ease-in-out infinite"}}>✨</div>
              <div style={{fontWeight:800,fontSize:16,letterSpacing:2,textTransform:"uppercase",color:"#ff6b35",marginBottom:8}}>
                Analyzing your training...
              </div>
              <div style={{color:"#555",fontSize:13,maxWidth:280,margin:"0 auto",lineHeight:1.6}}>
                Reading your history, checking for stalled lifts, and designing a plan around your goals.
              </div>
              <style>{`@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.9); } }`}</style>
            </div>
          ) : aiState?.plan ? (
            // ─── GENERATED PLAN VIEW ─────────────────────────────────────────
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div style={{...S.label,color:"#ff6b35",marginBottom:0}}>✨ Your AI-Generated Plan</div>
                <button style={{...S.smBtn,padding:"5px 10px",fontSize:10}} onClick={()=>{setAiState(null);try{localStorage.removeItem("wt_aiPlan");}catch{}}}>↻ New Plan</button>
              </div>
              <div style={{fontWeight:800,fontSize:20,marginTop:8,marginBottom:6}}>{aiState.plan.name}</div>
              <div style={{color:"#888",fontSize:13,marginBottom:14,lineHeight:1.6}}>{aiState.plan.description}</div>

              {aiState.plan.rationale && (
                <div style={{
                  background:"linear-gradient(90deg,#ff6b3515,transparent)",
                  border:"1px solid #ff6b3530",
                  borderLeft:"3px solid #ff6b35",
                  borderRadius:10,
                  padding:"12px 14px",
                  marginBottom:18,
                }}>
                  <div style={{color:"#ff6b35",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",fontSize:10,marginBottom:6}}>
                    Coach's Notes
                  </div>
                  <div style={{color:"#bbb",fontSize:12,lineHeight:1.6}}>{aiState.plan.rationale}</div>
                </div>
              )}

              <button
                style={{
                  width:"100%",
                  background:"linear-gradient(90deg,#ff6b35,#ff8c42)",
                  border:"none",
                  borderRadius:10,
                  padding:"13px",
                  color:"#fff",
                  fontFamily:"inherit",
                  fontSize:13,
                  fontWeight:800,
                  letterSpacing:2,
                  textTransform:"uppercase",
                  cursor:"pointer",
                  marginBottom:18,
                  boxShadow:"0 4px 20px #ff6b3544",
                }}
                onClick={adoptAIPlanAsProgram}
              >
                📅 Start This Program ({aiState.plan.days.length}x/wk)
              </button>

              <div style={{...S.label,marginBottom:10}}>Preview · {aiState.plan.days.length}-Day Schedule</div>
              {aiState.plan.days.map((day, i) => (
                <div key={i} style={{
                  background:"#111118",
                  border:`1px solid ${TAG_COLORS[day.tag]||"#ff6b35"}22`,
                  borderLeft:`3px solid ${TAG_COLORS[day.tag]||"#ff6b35"}`,
                  borderRadius:12,
                  padding:"13px 16px",
                  marginBottom:10,
                }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{fontWeight:700,fontSize:15}}>{day.name}</div>
                    {day.tag && <span style={S.tag(day.tag)}>{day.tag}</span>}
                  </div>
                  <div style={{color:"#555",fontSize:12,lineHeight:1.7,marginBottom:10}}>
                    {day.exercises.join(" · ")}
                  </div>
                  <button style={{...S.primaryBtn,padding:"6px 14px",fontSize:11}} onClick={()=>startAIDay(day)}>Start →</button>
                </div>
              ))}

              <div style={{color:"#333",fontSize:11,textAlign:"center",marginTop:18,letterSpacing:1}}>
                Generated {formatDate(aiState.generatedAt)} · Plan saved locally
              </div>
            </>
          ) : (
            // ─── GENERATION FORM ─────────────────────────────────────────────
            <>
              <div style={{textAlign:"center",marginBottom:24,marginTop:8}}>
                <div style={{fontSize:42,marginBottom:10}}>✨</div>
                <div style={{fontWeight:800,fontSize:20,letterSpacing:1,marginBottom:6}}>AI Coach</div>
                <div style={{color:"#666",fontSize:13,maxWidth:300,margin:"0 auto",lineHeight:1.6}}>
                  Get a custom split designed around your history, goals, and preferences.
                </div>
              </div>

              {workouts.length > 0 && (() => {
                const summary = buildHistorySummary();
                return (
                  <div style={{...S.card,marginBottom:18,borderLeft:"3px solid #ff6b35"}}>
                    <div style={{color:"#ff6b35",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",fontSize:10,marginBottom:8}}>
                      What I know about you
                    </div>
                    <div style={{color:"#bbb",fontSize:12,lineHeight:1.8}}>
                      <div>📊 <span style={{color:"#888"}}>{summary.totalWorkouts} workouts logged ({summary.last30Days} this month)</span></div>
                      <div>💪 <span style={{color:"#888"}}>{summary.exercisesTrained} unique exercises trained</span></div>
                      {summary.stalledLifts.length > 0 && (
                        <div>⚠️ <span style={{color:"#888"}}>{summary.stalledLifts.length} stalled lift{summary.stalledLifts.length!==1?"s":""}: <span style={{color:"#fdcb6e"}}>{summary.stalledLifts.slice(0,2).join(", ")}{summary.stalledLifts.length>2?"...":""}</span></span></div>
                      )}
                      {summary.bestProgress.length > 0 && (
                        <div>🚀 <span style={{color:"#888"}}>Best progress: <span style={{color:"#55efc4"}}>{summary.bestProgress[0].name}</span> (+{summary.bestProgress[0].weightGain}lb)</span></div>
                      )}
                    </div>
                  </div>
                );
              })()}

              <div style={{...S.label,marginBottom:8}}>Days per week</div>
              <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
                {[3,4,5,6].map(n=>(
                  <button key={n} style={S.selBtn(aiForm.daysPerWeek===n)} onClick={()=>setAiForm(f=>({...f,daysPerWeek:n}))}>
                    {n}x
                  </button>
                ))}
              </div>

              <div style={{...S.label,marginBottom:8}}>Focus</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
                {["Balanced","Strength","Hypertrophy","Athletic","Aesthetics"].map(f=>(
                  <button key={f} style={{...S.selBtn(aiForm.focus===f),flex:"none",padding:"8px 14px"}} onClick={()=>setAiForm(fr=>({...fr,focus:f}))}>
                    {f}
                  </button>
                ))}
              </div>

              <div style={{...S.label,marginBottom:8}}>Session length</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
                {["30 min","45 min","60 min","90 min"].map(l=>(
                  <button key={l} style={{...S.selBtn(aiForm.sessionLength===l),flex:"none",padding:"8px 14px"}} onClick={()=>setAiForm(f=>({...f,sessionLength:l}))}>
                    {l}
                  </button>
                ))}
              </div>

              <div style={{...S.label,marginBottom:8}}>Equipment available</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
                {["Full gym","Home gym","Dumbbells only","Bodyweight"].map(e=>(
                  <button key={e} style={{...S.selBtn(aiForm.equipment===e),flex:"none",padding:"8px 14px"}} onClick={()=>setAiForm(f=>({...f,equipment:e}))}>
                    {e}
                  </button>
                ))}
              </div>

              <div style={{...S.label,marginBottom:8}}>Anything else? (optional)</div>
              <textarea
                style={{...S.input2,minHeight:60,resize:"vertical",fontFamily:"inherit",marginBottom:20}}
                placeholder="e.g. bad shoulder, want to focus on glutes, prefer free weights..."
                value={aiForm.notes}
                onChange={e=>setAiForm(f=>({...f,notes:e.target.value}))}
              />

              {aiError && (
                <div style={{background:"#ff667722",border:"1px solid #ff667744",borderRadius:8,padding:"10px 14px",marginBottom:14,color:"#ff8c8c",fontSize:12}}>
                  ⚠ {aiError}
                </div>
              )}

              <button style={S.finishBtn} onClick={generateAIPlan} disabled={aiLoading}>
                ✨ Generate My Plan
              </button>
              <div style={{color:"#333",fontSize:11,textAlign:"center",marginTop:12,letterSpacing:1}}>
                Powered by Claude · Plans are personalized to your history
              </div>
            </>
          )}
        </div>
      )}


      {tab==="history" && (
        <div style={S.section}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{...S.label,marginBottom:0}}>Workout History {workouts.length>0 && <span style={{color:"#444"}}>· {workouts.length}</span>}</div>
            {workouts.length > 0 && (
              <button
                style={{background:"transparent",border:"1px solid #2a2a3e",borderRadius:7,padding:"5px 11px",color:"#666",fontFamily:"inherit",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}
                onClick={()=>setConfirmDelete("all")}
              >
                🗑 Clear All
              </button>
            )}
          </div>
          {workouts.length===0
            ? <div style={S.emptyState}><div style={{fontSize:36,marginBottom:10}}>📋</div><div>No workouts yet.</div></div>
            : workouts.map(w=>(
              <div key={w.id} style={S.card}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div><div style={{fontWeight:700,fontSize:16}}>{w.name}</div><div style={{color:"#555",fontSize:12,marginTop:2}}>{formatDate(w.date)}</div></div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    {w.tag&&<span style={S.tag(w.tag)}>{w.tag}</span>}
                    <button
                      style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:14,padding:"2px 6px",borderRadius:5,transition:"color 0.15s"}}
                      onMouseOver={e=>e.currentTarget.style.color="#ff6677"}
                      onMouseOut={e=>e.currentTarget.style.color="#444"}
                      onClick={()=>setConfirmDelete(w.id)}
                      title="Delete this workout"
                    >🗑</button>
                  </div>
                </div>
                <div style={{display:"flex",gap:16}}>
                  <div><span style={{color:"#ff6b35",fontWeight:700}}>{w.exercises.length}</span> <span style={{color:"#555",fontSize:12}}>exercises</span></div>
                  <div><span style={{color:"#ff6b35",fontWeight:700}}>{w.totalSets}</span> <span style={{color:"#555",fontSize:12}}>sets</span></div>
                  {w.totalVolume>0&&<div><span style={{color:"#ff6b35",fontWeight:700}}>{Math.round(w.totalVolume).toLocaleString()}</span> <span style={{color:"#555",fontSize:12}}>lbs</span></div>}
                </div>
                <div style={{marginTop:8,color:"#444",fontSize:12}}>{w.exercises.map(e=>e.name).join(" · ")}</div>
              </div>
            ))
          }

          {/* Delete confirmation modal */}
          {confirmDelete && (() => {
            const isAll = confirmDelete === "all";
            const workout = !isAll ? workouts.find(w => w.id === confirmDelete) : null;
            return (
              <div style={{position:"fixed",inset:0,background:"#000c",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
                <div style={{background:"#111118",border:"1px solid #2a2a3e",borderRadius:14,padding:24,maxWidth:340,width:"100%",boxSizing:"border-box"}}>
                  <div style={{fontSize:32,marginBottom:10,textAlign:"center"}}>⚠️</div>
                  <div style={{fontWeight:800,fontSize:16,letterSpacing:1,textTransform:"uppercase",textAlign:"center",marginBottom:10,color:"#ff6677"}}>
                    {isAll ? "Clear All History?" : "Delete This Workout?"}
                  </div>
                  <div style={{color:"#888",fontSize:13,textAlign:"center",lineHeight:1.6,marginBottom:20}}>
                    {isAll
                      ? <>This will permanently delete all <span style={{color:"#fff",fontWeight:700}}>{workouts.length}</span> logged workouts. Your stats and personal records will reset.</>
                      : <>You're about to delete <span style={{color:"#fff",fontWeight:700}}>{workout?.name}</span> from {workout && formatDate(workout.date)}. This cannot be undone.</>
                    }
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button
                      style={{flex:1,background:"transparent",border:"1px solid #2a2a3e",borderRadius:8,padding:"11px 14px",color:"#888",fontFamily:"inherit",fontSize:12,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}
                      onClick={()=>setConfirmDelete(null)}
                    >Cancel</button>
                    <button
                      style={{flex:1,background:"#ff6677",border:"none",borderRadius:8,padding:"11px 14px",color:"#fff",fontFamily:"inherit",fontSize:12,fontWeight:800,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}
                      onClick={()=>isAll ? clearAllWorkouts() : deleteWorkout(confirmDelete)}
                    >Delete</button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── STATS ───────────────────────────────────────────────────────────── */}
      {tab==="stats" && (
        <div style={S.section}>
          {profile?.name&&<div style={{fontWeight:800,fontSize:20,marginBottom:16}}>Hey, {profile.name} 👋</div>}
          <div style={S.label}>Overview</div>
          <div style={S.statGrid}>
            <div style={S.stat}><span style={S.statNum}>{totalSessions}</span><span style={S.statLabel}>Sessions</span></div>
            <div style={S.stat}><span style={S.statNum}>{streak}</span><span style={S.statLabel}>Streak</span></div>
            <div style={S.stat}><span style={{...S.statNum,fontSize:totalVolume>9999?18:26}}>{totalVolume>1000?`${Math.round(totalVolume/1000)}k`:Math.round(totalVolume)}</span><span style={S.statLabel}>Lbs Lifted</span></div>
          </div>
          {profile&&(
            <div style={{...S.card,borderLeft:"3px solid #ff6b35",marginBottom:18}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:8}}>Your Profile</div>
              <div style={{color:"#666",fontSize:13,lineHeight:2}}>
                Level: <span style={{color:"#ff6b35",fontWeight:700}}>{profile.experience}</span><br/>
                {profile.goal&&<>Goal: <span style={{color:"#ff6b35",fontWeight:700}}>{profile.goal}</span></>}
              </div>
            </div>
          )}
          {Object.keys(bests).length>0&&(
            <div style={S.card}>
              <div style={{fontWeight:800,fontSize:12,letterSpacing:2,textTransform:"uppercase",color:"#ff6b35",marginBottom:12}}>Personal Records</div>
              {Object.entries(bests).map(([name,weight])=>(
                <div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #1a1a28"}}>
                  <span style={{fontSize:14,fontWeight:600}}>{name}</span>
                  <span style={{color:"#ff6b35",fontWeight:800,fontSize:16}}>{weight} lbs</span>
                </div>
              ))}
            </div>
          )}
          {workouts.length===0&&<div style={S.emptyState}><div style={{fontSize:36,marginBottom:10}}>📊</div><div>Log workouts to see your stats</div></div>}
          <button style={{...S.ghostBtn,width:"100%",marginTop:8}} onClick={()=>{setDraft(profile||{});setOnboarding(true);}}>⚙ Update Profile</button>
        </div>
      )}
    </div>
  );
}

function SplitCard({ name, split, freq, onSelect, S, dimmed }) {
  return (
    <div onClick={onSelect} style={{background:dimmed?"#0e0e18":"#111118", border:`1px solid ${dimmed?"#1a1a28":split.color+"33"}`, borderLeft:`3px solid ${dimmed?"#222":split.color}`, borderRadius:12, padding:"13px 16px", marginBottom:10, cursor:"pointer", opacity:dimmed?0.55:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{name}</div>
          <div style={{color:"#555",fontSize:12,marginBottom:8}}>{split.description}</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {split.experience.map(x=><span key={x} style={{background:"#1a1a28",color:"#666",borderRadius:4,padding:"1px 7px",fontSize:10,letterSpacing:1}}>{x}</span>)}
            <span style={{background:`${split.color}18`,color:split.color,borderRadius:4,padding:"1px 8px",fontSize:10,fontWeight:700}}>
              {freq===7?"Daily":`${freq}x/wk`}
            </span>
          </div>
        </div>
        <span style={{color:split.color,fontSize:18,marginLeft:10,flexShrink:0}}>→</span>
      </div>
    </div>
  );
}
