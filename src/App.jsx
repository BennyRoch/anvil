import { useState, useEffect, useRef } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import AuthScreen from "./AuthScreen";
import UsernameGate from "./UsernameGate";
import ProfileScreen from "./ProfileScreen";
import SocialScreen from "./SocialScreen";
import ComposePostModal from "./ComposePostModal";
import * as DB from "./data";

// ─── EXERCISE LIBRARY ────────────────────────────────────────────────────────
const EXERCISES = {
  Chest: [
    "Barbell Bench Press","Dumbbell Bench Press","Incline Barbell Press","Incline Dumbbell Press",
    "Decline Barbell Press","Decline Dumbbell Press","Close-Grip Bench Press","Reverse-Grip Bench Press",
    "Floor Press","Spoto Press","Larsen Press","Paused Bench Press","Pin Press","Board Press",
    "Push-Up","Wide Push-Up","Diamond Push-Up","Decline Push-Up","Incline Push-Up","Plyometric Push-Up",
    "Clap Push-Up","Archer Push-Up","One-Arm Push-Up","Handstand Push-Up","Pike Push-Up","Ring Push-Up",
    "Deficit Push-Up","T-Push-Up","Spider-Man Push-Up","Hindu Push-Up","Banded Push-Up","Weighted Push-Up",
    "Cable Chest Fly","Low-to-High Cable Fly","High-to-Low Cable Fly","Mid Cable Fly","Single-Arm Cable Fly",
    "Incline Cable Fly","Decline Cable Fly","Cable Bench Press","Cable Crossover","Single-Arm Cable Crossover",
    "Standing Cable Press","Kneeling Cable Press","Dumbbell Fly","Incline Dumbbell Fly","Decline Dumbbell Fly",
    "Neutral-Grip Dumbbell Press","Neutral-Grip Incline DB Press","Squeeze Press","Dumbbell Squeeze Press",
    "Pec Deck Machine","Reverse Pec Deck (Chest)","Machine Chest Press","Hammer Strength Chest Press",
    "Hammer Strength Incline Press","Hammer Strength Decline Press","Iso-Lateral Chest Press",
    "Smith Machine Bench Press","Smith Machine Incline Press","Smith Machine Decline Press",
    "Smith Machine Close-Grip Press","Chest Dip","Weighted Chest Dip","Ring Dip","Bench Dip","Machine Dip",
    "Svend Press","Plate Press","Plate Squeeze Press","Landmine Press","Landmine Chest Press",
    "Landmine Single-Arm Press","Dumbbell Pullover","Barbell Pullover","Cable Pullover","Machine Pullover",
    "Guillotine Press","Larsen Floor Press","Banded Bench Press","Chain Bench Press","Slingshot Bench Press",
  ],
  Back: [
    "Conventional Deadlift","Deadlift","Sumo Deadlift","Romanian Deadlift","Stiff-Leg Deadlift","Trap Bar Deadlift",
    "Snatch-Grip Deadlift","Deficit Deadlift","Block Pull","Rack Pull","Pause Deadlift","Single-Leg Deadlift",
    "Banded Deadlift","Chain Deadlift","Paused Rack Pull","Hex Bar Deadlift","Snatch-Grip Block Pull",
    "Barbell Row","Pendlay Row","Yates Row","Underhand Barbell Row","Dumbbell Row","Chest-Supported Dumbbell Row",
    "Seal Row","Meadows Row","T-Bar Row","Chest-Supported T-Bar Row","Landmine Row","Landmine T-Bar Row",
    "Inverted Row","Single-Arm Dumbbell Row","Single-Arm Landmine Row","Kroc Row","Helms Row","Banded Row",
    "Seated Cable Row","Wide-Grip Cable Row","Close-Grip Cable Row","Single-Arm Cable Row","Standing Cable Row",
    "Bent-Over Cable Row","Low Cable Row","High Cable Row","Chest-Supported Cable Row","Smith Machine Row",
    "Smith Machine Inverted Row","Hammer Strength Row","Iso-Lateral Row","Plate-Loaded Row","Machine Row",
    "Lat Pulldown","Wide-Grip Lat Pulldown","Close-Grip Lat Pulldown","Reverse-Grip Lat Pulldown",
    "Single-Arm Lat Pulldown","Neutral-Grip Pulldown","Behind-the-Neck Pulldown","Kneeling Lat Pulldown",
    "Straight-Arm Pulldown","V-Bar Pulldown","Banded Pulldown","Pull-Down Machine",
    "Pull-Up","Wide-Grip Pull-Up","Close-Grip Pull-Up","Chin-Up","Neutral-Grip Pull-Up","Weighted Pull-Up",
    "Banded Pull-Up","Commando Pull-Up","Archer Pull-Up","L-Sit Pull-Up","Muscle-Up","Kipping Pull-Up",
    "Towel Pull-Up","Sternum Pull-Up","Assisted Pull-Up Machine","Negative Pull-Up",
    "Face Pull","Rope Face Pull","Cable Pull-Apart","Reverse Pec Deck","Rear Delt Row","Bent-Over Reverse Fly",
    "Good Morning","Seated Good Morning","Banded Good Morning","Hyperextension","Reverse Hyperextension",
    "45-Degree Back Extension","Weighted Back Extension","Jefferson Curl","Cat Cow","Bird Dog","Superman",
    "Renegade Row","TRX Row","Pendlay Row Variations","Smith Machine Bent-Over Row",
  ],
  Shoulders: [
    "Barbell Overhead Press","Standing Military Press","Seated Barbell Press","Push Press","Push Jerk",
    "Behind-the-Neck Press","Z Press","Dumbbell Shoulder Press","Seated Dumbbell Press","Arnold Press",
    "Single-Arm Dumbbell Press","Neutral-Grip DB Press","Landmine Press","Single-Arm Landmine Press",
    "Half-Kneeling Landmine Press","Cuban Press","Bradford Press","Pin Press","Machine Shoulder Press",
    "Hammer Strength Shoulder Press","Iso-Lateral Shoulder Press","Smith Machine Shoulder Press",
    "Smith Machine Behind-the-Neck Press","Smith Machine Seated Press","Bottoms-Up Kettlebell Press",
    "Kettlebell Strict Press","Kettlebell Bottoms-Up Press","Single-Arm Kettlebell Press","Bus Driver",
    "Pike Push-Up","Handstand Push-Up","Wall Walk","Handstand Hold","Handstand Walk",
    "Lateral Raise","Dumbbell Lateral Raise","Cable Lateral Raise","Single-Arm Cable Lateral Raise",
    "Machine Lateral Raise","Leaning Lateral Raise","Lying Lateral Raise","Y-Raise","L-Raise",
    "Egyptian Lateral Raise","Bent-Over Lateral Raise","Front Raise","Plate Front Raise","Cable Front Raise",
    "Single-Arm Cable Front Raise","Alternating Front Raise","Barbell Front Raise","Rear Delt Fly",
    "Reverse Pec Deck","Bent-Over Reverse Fly","Cable Reverse Fly","Single-Arm Cable Reverse Fly",
    "Rope Face Pull","Cable Face Pull","Face Pull","Rope Pull-to-Throat","Upright Row","Wide-Grip Upright Row",
    "Cable Upright Row","Dumbbell Upright Row","Smith Machine Upright Row","Barbell Shrug","Dumbbell Shrug",
    "Behind-the-Back Shrug","Trap Bar Shrug","Smith Machine Shrug","Cable Shrug","Snatch-Grip High Pull",
    "Power Shrug","Overhead Carry","Scapular Pull-Up","Band Pull-Apart","Cable Y-Raise","Around-the-World",
  ],
  Biceps: [
    "Barbell Curl","EZ-Bar Curl","Wide-Grip Barbell Curl","Close-Grip Barbell Curl","Reverse Curl",
    "EZ-Bar Reverse Curl","Drag Curl","Cheat Curl","Strict Curl","Standing Barbell Curl","Seated Barbell Curl",
    "Dumbbell Curl","Alternating Dumbbell Curl","Seated Dumbbell Curl","Standing Dumbbell Curl",
    "Hammer Curl","Cross-Body Hammer Curl","Rope Hammer Curl","Seated Hammer Curl","Incline Hammer Curl",
    "Incline Dumbbell Curl","Spider Curl","Concentration Curl","Preacher Curl","Dumbbell Preacher Curl",
    "Single-Arm Preacher Curl","Machine Preacher Curl","Smith Machine Drag Curl","Reverse Preacher Curl",
    "Cable Curl","Rope Cable Curl","High Cable Curl","Bayesian Cable Curl","Single-Arm Cable Curl",
    "Overhead Cable Curl","Lying Cable Curl","Behind-the-Back Cable Curl","Standing Cable Curl",
    "Wide-Grip Cable Curl","Close-Grip Cable Curl","Cross-Body Cable Curl","EZ-Bar Cable Curl",
    "Zottman Curl","21s","Machine Curl","Iso-Lateral Curl","Hammer Curl Machine","Pinwheel Curl",
    "Waiter Curl","Bodyweight Curl (Inverted)","TRX Curl","Resistance Band Curl","Wrist Curl",
    "Reverse Wrist Curl","Concentration Hammer Curl","Plate Pinch Curl","Tempo Curl","Eccentric Curl",
    "Banded Bicep Curl","Chin-Up","Wide-Grip Chin-Up","Towel Chin-Up",
  ],
  Triceps: [
    "Tricep Pushdown","Rope Pushdown","V-Bar Pushdown","Reverse-Grip Pushdown","Single-Arm Pushdown",
    "Straight-Bar Pushdown","Cross-Body Pushdown","Banded Pushdown","Resistance Band Pushdown",
    "Overhead Tricep Extension","Overhead Rope Extension","Overhead Cable Extension",
    "Single-Arm Overhead Extension","Seated Overhead Extension","Lying Tricep Extension","French Press",
    "Skull Crusher","EZ-Bar Skull Crusher","Dumbbell Skull Crusher","Decline Skull Crusher","Tate Press",
    "Close-Grip Bench Press","Floor Press","Board Press","JM Press","California Press","Smith Machine Close-Grip Press",
    "Tricep Dip","Bench Dip","Weighted Dip","Ring Dip","Machine Dip","Assisted Dip Machine",
    "Bodyweight Skull Crusher","Diamond Push-Up","Close-Grip Push-Up","Tricep Push-Up","Tricep Kickback",
    "Cable Kickback","Dumbbell Kickback","Single-Arm Kickback","Cable Overhead Extension","Lying Cable Extension",
    "Cross-Body Cable Extension","Bench Press for Tris","Reverse-Grip Tricep Pushdown","Push-Up to Tricep Extension",
    "Machine Tricep Extension","Plate Tricep Extension","Iso-Lateral Tricep Extension","Smith Machine Skull Crusher",
    "Single-Arm Cable Pushdown (Reverse)","High Cable Tricep Extension",
  ],
  Quads: [
    "Back Squat","Barbell Squat","Barbell Back Squat","High-Bar Squat","Low-Bar Squat","Pause Squat","Tempo Squat",
    "Front Squat","Cross-Arm Front Squat","Zercher Squat","Overhead Squat","Goblet Squat","Cyclist Squat",
    "Box Squat","Pin Squat","Anderson Squat","Hatfield Squat","Safety Bar Squat","SSB Squat","Smith Machine Squat",
    "Smith Machine Front Squat","Smith Machine Hack Squat","Banded Squat","Chain Squat",
    "Leg Press","Single-Leg Press","45-Degree Leg Press","Horizontal Leg Press","Vertical Leg Press",
    "Hack Squat","Reverse Hack Squat","Pendulum Squat","Belt Squat","V-Squat","Pit Shark Squat","Machine Squat",
    "Bulgarian Split Squat","Split Squat","Heel-Elevated Split Squat","Walking Lunge","Reverse Lunge","Forward Lunge",
    "Lateral Lunge","Curtsy Lunge","Dumbbell Lunge","Barbell Lunge","Walking Dumbbell Lunge","Deficit Lunge",
    "Smith Machine Lunge","Smith Machine Bulgarian Split Squat",
    "Step-Up","Dumbbell Step-Up","Barbell Step-Up","Lateral Step-Up","Box Step-Up","High Box Step-Up",
    "Leg Extension","Single-Leg Extension","Sissy Squat","Wall Sit","Pistol Squat","Shrimp Squat","Cossack Squat",
    "Sumo Squat","Plié Squat","Jefferson Squat","Goblet Cossack Squat","Skater Squat","Spanish Squat",
    "Jump Squat","Tuck Jump","Squat to Press","Thruster","Heel-Elevated Goblet Squat","Heel-Elevated Back Squat",
  ],
  Hamstrings: [
    "Romanian Deadlift","Single-Leg RDL","Dumbbell RDL","Snatch-Grip RDL","Stiff-Leg Deadlift",
    "Smith Machine RDL","B-Stance RDL","Deficit RDL","Trap Bar RDL","Banded RDL",
    "Leg Curl","Lying Leg Curl","Seated Leg Curl","Single-Leg Curl","Standing Leg Curl",
    "Hamstring Curl Machine","Nordic Curl","Slider Curl","Swiss Ball Curl","Eccentric Nordic Curl",
    "Good Morning","Seated Good Morning","Banded Good Morning","Glute-Ham Raise","Razor Curl",
    "Reverse Hyperextension","45-Degree Hyper","Cable Pull-Through","Banded Pull-Through","Hip Hinge",
    "Single-Leg Stiff-Leg Deadlift","Stability Ball Bridge Curl","Kettlebell Swing","American Kettlebell Swing",
    "Romanian Deadlift Machine","TKE (Terminal Knee Extension)",
  ],
  Glutes: [
    "Barbell Hip Thrust","Dumbbell Hip Thrust","Single-Leg Hip Thrust","B-Stance Hip Thrust","Banded Hip Thrust",
    "Machine Hip Thrust","Smith Machine Hip Thrust","Glute Drive Machine","Hip Thrust March",
    "Glute Bridge","Single-Leg Glute Bridge","Banded Glute Bridge","Barbell Glute Bridge","Frog Pump","Frog Bridge",
    "Cable Kickback","Single-Leg Cable Kickback","Stiff-Leg Cable Kickback","Cable Glute Kickback (Cuff)",
    "Donkey Kick","Banded Donkey Kick","Fire Hydrant","Banded Fire Hydrant",
    "Clamshell","Banded Clamshell","Side-Lying Hip Abduction","Standing Hip Abduction","Cable Hip Abduction",
    "Machine Hip Abduction","Seated Hip Abduction","Cable Hip Adduction","Machine Hip Adduction",
    "Sumo Deadlift","Sumo Squat","Curtsy Lunge","Reverse Lunge","Step-Up","Bulgarian Split Squat",
    "Romanian Deadlift","Cable Pull-Through","Glute Kickback Machine","Pendulum Glute Kick",
    "Banded Lateral Walk","Banded Monster Walk","Banded Crab Walk","Single-Leg Glute Kickback",
    "Glute Bridge Walkout","45-Degree Hyper (Glute Focus)","Cossack Squat","Smith Machine Glute Kickback",
  ],
  Calves: [
    "Standing Calf Raise","Seated Calf Raise","Leg Press Calf Raise","Smith Machine Calf Raise",
    "Single-Leg Calf Raise","Donkey Calf Raise","Tibialis Raise","Banded Tibialis Raise",
    "Weighted Tibialis Raise","Toe Walking","Heel Walking","Calf Press","Barbell Calf Raise",
    "Dumbbell Calf Raise","Farmer's Calf Raise","Hack Squat Calf Raise","Box Jump","Pogo Hop",
    "Jump Rope","Double-Under","Bunny Hop","Hill Sprint","Calf Raise on Step","Eccentric Calf Raise",
    "Banded Calf Raise","Seated Tibialis Raise","Single-Leg Tibialis Raise","Smith Machine Seated Calf Raise",
  ],
  Core: [
    "Plank","Side Plank","Forearm Plank","RKC Plank","Long-Lever Plank","Plank with Shoulder Tap",
    "Plank with Leg Raise","Plank-to-Push-Up","Side Plank with Hip Dip","Weighted Plank","Bird Dog","Dead Bug",
    "Hollow Hold","Hollow Rock","Arch Hold","Superman","Bear Crawl","Crab Walk","Crunch","Decline Crunch",
    "Reverse Crunch","Bicycle Crunch","Cable Crunch","Kneeling Cable Crunch","Standing Cable Crunch",
    "V-Up","Tuck-Up","Toe Touch","Sit-Up","Weighted Sit-Up","GHD Sit-Up","Russian Twist","Weighted Russian Twist",
    "Medicine Ball Slam","Woodchop","Cable Woodchop","Pallof Press","Half-Kneeling Pallof Press",
    "Standing Pallof Press","Anti-Rotation Press","Hanging Leg Raise","Hanging Knee Raise","Toes-to-Bar",
    "Knees-to-Elbows","L-Sit Hold","Dragon Flag","Hollow Body Pull-Up","Ab Wheel Rollout","Standing Ab Wheel",
    "Stability Ball Rollout","Barbell Rollout","Farmer's Carry","Suitcase Carry","Overhead Carry",
    "Bottoms-Up Carry","Windshield Wiper","Flutter Kick","Scissor Kick","Mountain Climber","Slow Mountain Climber",
    "Cross-Body Mountain Climber","Hollow Hold Flutter","Stir the Pot","Side Bend","Cable Side Bend",
    "Dumbbell Side Bend","Copenhagen Plank","Banded Anti-Rotation","Suitcase Hold","Landmine 180","Landmine Twist",
    "Bear Plank","Spider-Man Crunch","Captain's Chair Knee Raise","Captain's Chair Leg Raise",
  ],
  Forearms: [
    "Wrist Curl","Reverse Wrist Curl","Behind-the-Back Wrist Curl","Cable Wrist Curl","Dumbbell Wrist Curl",
    "Barbell Wrist Curl","Hammer Curl","Reverse Curl","Zottman Curl","Farmer's Walk","Suitcase Carry",
    "Plate Pinch","Towel Pull-Up","Dead Hang","Bar Hang","One-Arm Hang","Fat Grip Curl","Fat Grip Pull-Up",
    "Wrist Roller","Finger Curl","Reverse Finger Curl","Gripper Squeeze","Captains of Crush",
    "Forearm Plank","Rice Bucket","Sledgehammer Levering","Wrist Pronation","Wrist Supination",
    "Banded Wrist Extension","Banded Wrist Flexion",
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
// A "pattern" is a slot in the weekly cycle (e.g. "Push", "Pull", "Legs").
// Each pattern has 1+ "variations" — different exercise selections that hit the
// same movement pattern. In rotate mode, we cycle through variations A, B, C...
// In repeat mode, we always use variation A.
const SPLITS = {
  "Push / Pull / Legs": {
    color: "#ff6b35",
    description: "Classic PPL split cycling push, pull, and leg days.",
    experience: ["Intermediate","Advanced"],
    freqOptions: [3,4,5,6,7],
    defaultFreq: 3,
    patterns: [
      { name:"Push Day", tag:"Push", variations: [
        ["Barbell Bench Press","Barbell Overhead Press","Incline Dumbbell Press","Lateral Raise","Tricep Pushdown","Skull Crusher"],
        ["Incline Barbell Press","Seated Dumbbell Press","Cable Chest Fly","Cable Lateral Raise","Overhead Tricep Extension","Tricep Dip"],
        ["Close-Grip Bench Press","Arnold Press","Decline Dumbbell Press","Front Raise","Rope Pushdown","JM Press"],
      ]},
      { name:"Pull Day", tag:"Pull", variations: [
        ["Deadlift","Barbell Row","Lat Pulldown","Face Pull","Barbell Curl","Hammer Curl"],
        ["Romanian Deadlift","T-Bar Row","Wide-Grip Pull-Up","Reverse Pec Deck","Preacher Curl","Cable Curl"],
        ["Rack Pull","Seated Cable Row","Chin-Up","Rear Delt Fly","Incline Dumbbell Curl","Concentration Curl"],
      ]},
      { name:"Leg Day", tag:"Legs", variations: [
        ["Barbell Squat","Romanian Deadlift","Leg Press","Leg Curl","Standing Calf Raise","Leg Extension"],
        ["Front Squat","Bulgarian Split Squat","Hack Squat","Seated Leg Curl","Seated Calf Raise","Walking Lunge"],
        ["Goblet Squat","Stiff-Leg Deadlift","Lunge","Nordic Curl","Donkey Calf Raise","Sissy Squat"],
      ]},
    ],
  },
  "Bro Split": {
    color: "#fd79a8",
    description: "One muscle group per day. Maximum focus per session.",
    experience: ["Beginner","Intermediate"],
    freqOptions: [4,5,6,7],
    defaultFreq: 5,
    patterns: [
      { name:"Chest Day", tag:"Chest", variations: [
        ["Barbell Bench Press","Incline Dumbbell Press","Cable Crossover","Chest Dip","Pec Deck Machine"],
        ["Incline Barbell Press","Dumbbell Bench Press","Cable Chest Fly","Decline Bench Press","Push-Up"],
        ["Close-Grip Bench Press","Dumbbell Fly","Incline Cable Fly","Weighted Chest Dip","Smith Machine Bench Press"],
      ]},
      { name:"Back Day", tag:"Back", variations: [
        ["Deadlift","Barbell Row","Lat Pulldown","Seated Cable Row","Face Pull"],
        ["Romanian Deadlift","T-Bar Row","Pull-Up","Single-Arm Dumbbell Row","Straight-Arm Pulldown"],
        ["Rack Pull","Pendlay Row","Wide-Grip Pull-Up","Chest-Supported Dumbbell Row","Reverse Pec Deck"],
      ]},
      { name:"Shoulder Day", tag:"Shoulders", variations: [
        ["Barbell Overhead Press","Arnold Press","Lateral Raise","Rear Delt Fly","Shrug"],
        ["Seated Dumbbell Press","Cable Lateral Raise","Face Pull","Upright Row","Front Raise"],
        ["Smith Machine Shoulder Press","Machine Lateral Raise","Reverse Pec Deck","Z Press","Cable Y-Raise"],
      ]},
      { name:"Arm Day", tag:"Arms", variations: [
        ["Barbell Curl","Preacher Curl","Hammer Curl","Skull Crusher","Tricep Pushdown","Overhead Tricep Extension"],
        ["EZ-Bar Curl","Incline Dumbbell Curl","Cable Curl","Tricep Dip","Rope Pushdown","Close-Grip Bench Press"],
        ["Spider Curl","Concentration Curl","Zottman Curl","JM Press","Cable Kickback","Diamond Push-Up"],
      ]},
      { name:"Leg Day", tag:"Legs", variations: [
        ["Barbell Squat","Leg Press","Romanian Deadlift","Leg Curl","Standing Calf Raise"],
        ["Front Squat","Hack Squat","Stiff-Leg Deadlift","Seated Leg Curl","Seated Calf Raise"],
        ["Bulgarian Split Squat","Walking Lunge","Nordic Curl","Leg Extension","Donkey Calf Raise"],
      ]},
    ],
  },
  "Arnold Split": {
    color: "#fdcb6e",
    description: "Arnold's 6-day chest/back + shoulders/arms + legs. High volume.",
    experience: ["Advanced"],
    freqOptions: [3,4,6,7],
    defaultFreq: 6,
    patterns: [
      { name:"Chest & Back", tag:"Chest", variations: [
        ["Barbell Bench Press","Wide-Grip Pull-Up","Incline Dumbbell Press","Barbell Row","Dumbbell Fly","Seated Cable Row"],
        ["Incline Barbell Press","T-Bar Row","Cable Crossover","Lat Pulldown","Chest Dip","Dumbbell Row"],
        ["Decline Bench Press","Pendlay Row","Dumbbell Bench Press","Chin-Up","Pec Deck Machine","Single-Arm Cable Row"],
      ]},
      { name:"Shoulders & Arms", tag:"Shoulders", variations: [
        ["Barbell Overhead Press","Barbell Curl","Lateral Raise","Skull Crusher","Rear Delt Fly","Hammer Curl"],
        ["Arnold Press","Preacher Curl","Upright Row","Tricep Dip","Cable Lateral Raise","Concentration Curl"],
        ["Seated Dumbbell Press","Incline Dumbbell Curl","Face Pull","Overhead Tricep Extension","Cable Curl","Rope Pushdown"],
      ]},
      { name:"Legs", tag:"Legs", variations: [
        ["Barbell Squat","Romanian Deadlift","Leg Press","Leg Curl","Standing Calf Raise"],
        ["Front Squat","Leg Extension","Bulgarian Split Squat","Seated Leg Curl","Seated Calf Raise"],
        ["Hack Squat","Stiff-Leg Deadlift","Walking Lunge","Nordic Curl","Donkey Calf Raise"],
      ]},
    ],
  },
  "Upper / Lower": {
    color: "#74b9ff",
    description: "Alternates upper and lower body days for balanced strength.",
    experience: ["Beginner","Intermediate"],
    freqOptions: [2,3,4,5,6,7],
    defaultFreq: 4,
    patterns: [
      { name:"Upper", tag:"Upper", variations: [
        ["Barbell Bench Press","Barbell Row","Barbell Overhead Press","Lat Pulldown","Barbell Curl","Tricep Pushdown"],
        ["Incline Dumbbell Press","Dumbbell Row","Arnold Press","Chin-Up","Hammer Curl","Skull Crusher"],
        ["Close-Grip Bench Press","T-Bar Row","Seated Dumbbell Press","Pull-Up","Preacher Curl","Overhead Tricep Extension"],
      ]},
      { name:"Lower", tag:"Lower", variations: [
        ["Barbell Squat","Romanian Deadlift","Leg Extension","Leg Curl","Standing Calf Raise"],
        ["Front Squat","Leg Press","Bulgarian Split Squat","Seated Leg Curl","Seated Calf Raise"],
        ["Deadlift","Hack Squat","Walking Lunge","Nordic Curl","Donkey Calf Raise"],
      ]},
    ],
  },
  "Anterior / Posterior": {
    color: "#00cec9",
    description: "Front-of-body vs back-of-body. Great for posture and balance.",
    experience: ["Intermediate","Advanced"],
    freqOptions: [2,3,4,5,6,7],
    defaultFreq: 4,
    patterns: [
      { name:"Anterior", tag:"Anterior", variations: [
        ["Barbell Bench Press","Barbell Overhead Press","Barbell Squat","Leg Press","Barbell Curl","Leg Extension"],
        ["Incline Dumbbell Press","Seated Dumbbell Press","Front Squat","Walking Lunge","Preacher Curl","Sissy Squat"],
        ["Close-Grip Bench Press","Arnold Press","Goblet Squat","Bulgarian Split Squat","Cable Curl","Step-Up"],
      ]},
      { name:"Posterior", tag:"Posterior", variations: [
        ["Deadlift","Barbell Row","Romanian Deadlift","Lat Pulldown","Leg Curl","Rear Delt Fly"],
        ["Rack Pull","T-Bar Row","Stiff-Leg Deadlift","Wide-Grip Pull-Up","Seated Leg Curl","Face Pull"],
        ["Trap Bar Deadlift","Pendlay Row","Single-Leg RDL","Chin-Up","Nordic Curl","Reverse Pec Deck"],
      ]},
    ],
  },
  "Left / Right": {
    color: "#a29bfe",
    description: "Unilateral training to fix imbalances and build symmetry.",
    experience: ["Beginner","Intermediate","Advanced"],
    freqOptions: [2,3,4,5,6,7],
    defaultFreq: 4,
    patterns: [
      { name:"Left Side", tag:"Left", variations: [
        ["Single-Leg RDL","Single-Arm Cable Row","Bulgarian Split Squat","Single-Leg Calf Raise","Concentration Curl","Tricep Kickback"],
        ["Single-Leg Press","Single-Arm Dumbbell Row","Pistol Squat","Single-Leg Hip Thrust","Hammer Curl","Single-Arm Pushdown"],
      ]},
      { name:"Right Side", tag:"Right", variations: [
        ["Single-Leg RDL","Single-Arm Cable Row","Bulgarian Split Squat","Single-Leg Calf Raise","Concentration Curl","Tricep Kickback"],
        ["Single-Leg Press","Single-Arm Dumbbell Row","Pistol Squat","Single-Leg Hip Thrust","Hammer Curl","Single-Arm Pushdown"],
      ]},
    ],
  },
  "Full Body": {
    color: "#55efc4",
    description: "Hit everything each session. Perfect for beginners.",
    experience: ["Beginner"],
    freqOptions: [2,3,4,5,6,7],
    defaultFreq: 3,
    patterns: [
      { name:"Full Body", tag:"Full", variations: [
        ["Barbell Squat","Barbell Bench Press","Barbell Row","Barbell Overhead Press","Plank","Standing Calf Raise"],
        ["Deadlift","Incline Dumbbell Press","Lat Pulldown","Dumbbell Shoulder Press","Hanging Leg Raise","Seated Calf Raise"],
        ["Front Squat","Dumbbell Bench Press","T-Bar Row","Arnold Press","Ab Wheel Rollout","Donkey Calf Raise"],
      ]},
    ],
  },
};

// Given a split's base days array and a target frequency, cycle through the
// pattern to produce exactly `freq` named workout days for the week.
// Builds a weekly schedule from a list of split day templates.
// mode: "rotate" (cycle A/B/C through unique days — current behavior)
//       "repeat-named" (use only the first day, repeat with same name)
//       "repeat-numbered" (use only the first day, number each session)
// dayIndex (for repeat modes): which day from the split to repeat (default 0)
// Builds a weekly schedule from a split's patterns.
// mode: "repeat" — always use variation A (same exercises each cycle)
//                  e.g. Anterior/Posterior 6x → Anterior, Posterior, Anterior, Posterior, Anterior, Posterior
//                  (all Anteriors = same; all Posteriors = same)
//       "rotate" — cycle through variations A, B, C... per pattern independently
//                  e.g. Anterior/Posterior 6x → Anterior A, Posterior A, Anterior B, Posterior B, Anterior C, Posterior C
//                  (each pattern gets variation suffix; exercises differ)
function buildWeekSchedule(patterns, freq, mode = "repeat") {
  const DAY_NAMES = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const VARIATION_LETTERS = ["A","B","C","D","E","F"];

  // Track how many times we've used each pattern so far (for variation indexing)
  const patternUseCount = patterns.map(() => 0);

  return Array.from({ length: freq }, (_, i) => {
    const patternIdx = i % patterns.length;
    const pattern = patterns[patternIdx];
    const useIdx = patternUseCount[patternIdx];
    patternUseCount[patternIdx] += 1;

    let variationIdx, displayName;
    if (mode === "rotate") {
      // Cycle through available variations for this pattern
      variationIdx = useIdx % pattern.variations.length;
      // Only show variation letter if there's more than one use of this pattern
      const totalUses = Math.ceil((freq - patternIdx) / patterns.length);
      displayName = totalUses > 1 ? `${pattern.name} ${VARIATION_LETTERS[variationIdx]}` : pattern.name;
    } else {
      // Repeat: always variation A
      variationIdx = 0;
      displayName = pattern.name;
    }

    return {
      name: pattern.name,
      tag: pattern.tag,
      exercises: pattern.variations[variationIdx],
      scheduledDay: DAY_NAMES[i],
      displayName,
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

// ─── CALENDAR HELPERS ────────────────────────────────────────────────────────
// All dates in the active-program system are CALENDAR dates ("YYYY-MM-DD"),
// not full timestamps. This keeps the schedule timezone-agnostic — if you
// schedule a Saturday workout, it stays on Saturday regardless of when in
// the day you started the program.

const WEEKDAY_NAMES_FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WEEKDAY_NAMES_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
// Order shown to the user when picking days: Mon → Sun
const WEEKDAY_PICKER_ORDER = [1,2,3,4,5,6,0];

// Returns today's date in the user's local timezone as "YYYY-MM-DD".
function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Parse "YYYY-MM-DD" into a Date at local midnight. Avoids the UTC drift
// you get from `new Date("2026-05-20")` which is interpreted as UTC.
function parseISODate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

// Inverse of parseISODate: turn a Date object into "YYYY-MM-DD" using local time.
function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Add `n` days to an ISO date (n can be negative).
function addDays(iso, n) {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

// Number of full days from `a` to `b` (positive if b is later).
function daysBetween(aISO, bISO) {
  const a = parseISODate(aISO).getTime();
  const b = parseISODate(bISO).getTime();
  return Math.round((b - a) / 86400000);
}

// Format an ISO date for display. Uses locale's "Mon, May 20" style.
function formatISODate(iso) {
  const d = parseISODate(iso);
  if (!d) return "";
  return d.toLocaleDateString("en-US",{ weekday:"short", month:"short", day:"numeric" });
}

// Given a list of weekday numbers the user trains on (e.g. [6,0,1,2,3,4] for
// Sat–Thu) and a program start date, return an array of ISO date strings —
// one for each upcoming session, in chronological order — covering enough
// sessions for `weeksAhead` weeks. The returned dates are >= startDate AND
// fall on one of the chosen weekdays.
//
// Example: weekdays = [6,0,1,2,3,4], startDate = "2026-05-20" (a Wednesday)
//   First session: the Wed (in weekdays? yes → 2026-05-20)
//   Next: Thu (2026-05-21), then Sat (2026-05-23), Sun, Mon, Tue, Wed, Thu, ...
function generateSessionDates(weekdays, startDate, weeksAhead = 2) {
  if (!weekdays?.length || !startDate) return [];
  const set = new Set(weekdays);
  const sessionsPerWeek = weekdays.length;
  const wanted = sessionsPerWeek * weeksAhead + sessionsPerWeek; // a buffer
  const dates = [];
  let cursor = startDate;
  // Cap the loop so a bad input can't hang the UI.
  for (let i = 0; i < 365 && dates.length < wanted; i++) {
    const d = parseISODate(cursor);
    if (set.has(d.getDay())) dates.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return dates;
}

// Returns the ISO date of the FIRST day of the program's calendar week
// containing `referenceDate`. The "first day" is the weekday that follows
// the longest contiguous block of REST days — i.e. the natural week-start
// for this schedule. This matches user intuition:
//   • Sat-Thu (off Fri)           → anchor = Sat (one rest day, week starts after)
//   • Mon/Wed/Fri (off T,Th,S,Su) → anchor = Mon (longest gap is Sat+Sun)
//   • Mon-Fri (off Sat+Sun)        → anchor = Mon
//   • Tue-Sun (off Mon)            → anchor = Tue
function findAnchorWeekday(weekdays) {
  if (!weekdays?.length) return 0;
  if (weekdays.length === 7) return 1; // 7-day: arbitrary; pick Monday
  const set = new Set(weekdays);
  // For each TRAINING day, measure the number of preceding contiguous REST
  // days (looking backwards through the week, wrapping around).
  let bestDay = weekdays[0];
  let bestGap = -1;
  for (const day of weekdays) {
    let gap = 0;
    for (let i = 1; i <= 7; i++) {
      const prev = (day - i + 7) % 7;
      if (set.has(prev)) break;
      gap++;
    }
    if (gap > bestGap) { bestGap = gap; bestDay = day; }
  }
  return bestDay;
}

// Returns the ISO date of the first calendar day of the program's week
// containing `referenceDate`. Anchored to findAnchorWeekday.
function weekAnchorFor(weekdays, referenceDate) {
  if (!weekdays?.length || !referenceDate) return referenceDate;
  const anchor = findAnchorWeekday(weekdays);
  const ref = parseISODate(referenceDate);
  const refDow = ref.getDay();
  const back = (refDow - anchor + 7) % 7;
  return addDays(referenceDate, -back);
}

// Compute the list of session ISO dates for ONE viewed week.
// Weeks are CALENDAR weeks anchored to the user's earliest chosen weekday.
// Week 0 = the calendar week containing startDate.
// Week N = the week starting 7*N days after Week 0's anchor.
//
// All session dates within a week are returned (even dates before startDate
// in Week 0 — those will be rendered as "missed" by the UI).
function sessionDatesForWeek(weekdays, startDate, weekIndex) {
  if (!weekdays?.length || !startDate) return [];
  const set = new Set(weekdays);
  const week0Anchor = weekAnchorFor(weekdays, startDate);
  const windowStart = addDays(week0Anchor, weekIndex * 7);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const cursor = addDays(windowStart, i);
    const d = parseISODate(cursor);
    if (set.has(d.getDay())) dates.push(cursor);
  }
  return dates;
}

// Given a program's start date and weekday list, figure out which "pattern
// index" (i.e. which entry from activeProgram.days) corresponds to a given
// session date. Patterns cycle in stable order from the WEEK-0 ANCHOR (the
// earliest chosen weekday in the calendar week containing startDate), NOT
// from startDate itself. This keeps the schedule consistent even when the
// user starts mid-week: a Saturday session is always pattern 0 (or whatever
// the first slot is), regardless of which weekday the user adopted on.
function patternIndexForDate(weekdays, startDate, daysLen, targetDate) {
  if (!weekdays?.length || !startDate || !daysLen) return 0;
  const set = new Set(weekdays);
  const anchor = weekAnchorFor(weekdays, startDate);
  // If targetDate is before the anchor (shouldn't normally happen but is safe),
  // walk backwards by counting sessions in the opposite direction.
  if (targetDate < anchor) return 0;
  let count = 0;
  let cursor = anchor;
  for (let i = 0; i < 365; i++) {
    const d = parseISODate(cursor);
    if (set.has(d.getDay())) {
      if (cursor === targetDate) return count % daysLen;
      count++;
    }
    cursor = addDays(cursor, 1);
  }
  return 0;
}

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

// AnvilApp — the main application, rendered only when user is authenticated.
function AnvilApp({ session, onLogout }) {
  const [tab, setTab] = useState("log");
  // Data loaded from Supabase on mount; empty until then
  const [workouts, setWorkouts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeProgram, setActiveProgram] = useState(null);
  const [programLogs, setProgramLogs] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  // When non-null, opens the ComposePostModal with this workout pre-loaded.
  const [composePost, setComposePost] = useState(null);
  // Tracks whether the next save should fire — we don't want to overwrite cloud
  // data with an empty initial state before load completes.
  const initialLoadDone = useRef(false);

  // In-progress workout draft (stays in localStorage — device-specific, expires fast)
  const [current, setCurrent] = useState(() => {
    try {
      const raw = localStorage.getItem("wt_currentDraft");
      if (!raw) return { name:"", exercises:[], tag:null };
      const draft = JSON.parse(raw);
      const age = Date.now() - (draft.savedAt || 0);
      if (age > 24 * 60 * 60 * 1000) {
        localStorage.removeItem("wt_currentDraft");
        return { name:"", exercises:[], tag:null };
      }
      const { savedAt, ...state } = draft;
      return state;
    } catch {
      return { name:"", exercises:[], tag:null };
    }
  });
  // Active program slot (also device-specific draft state)
  const [activeSlot, setActiveSlot] = useState(() => {
    try {
      const hasDraft = !!localStorage.getItem("wt_currentDraft");
      if (!hasDraft) {
        localStorage.removeItem("wt_activeSlot");
        return null;
      }
      const parsed = JSON.parse(localStorage.getItem("wt_activeSlot")||"null");
      // Reject legacy shape ({weekIndex, dayIndex}) — only accept {sessionDate}.
      if (parsed && typeof parsed === "object" && typeof parsed.sessionDate === "string") {
        return parsed;
      }
      localStorage.removeItem("wt_activeSlot");
      return null;
    } catch { return null; }
  });
  const [addEx, setAddEx] = useState({ open:false, category:"All", search:"" });
  const [selectedSplit, setSelectedSplit] = useState(null);
  const [splitFreqs, setSplitFreqs] = useState({});
  const [onboarding, setOnboarding] = useState(false);
  const [draft, setDraft] = useState({ experience:"", name:"", goal:"" });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [adoptModal, setAdoptModal] = useState(null);
  // Migration prompt state — shown once if user has local data to migrate
  const [migrationPrompt, setMigrationPrompt] = useState(false);
  const [migrating, setMigrating] = useState(false);

  // ─── LOAD ALL DATA FROM SUPABASE ON MOUNT ────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [p, ws, ap] = await Promise.all([
          DB.loadProfile(),
          DB.loadWorkouts(),
          DB.loadActiveProgram(),
        ]);
        if (cancelled) return;
        setProfile(p);
        setWorkouts(ws);
        // Reset legacy programs that pre-date the calendar refactor.
        // The new schema requires `weekdays` (array of JS day numbers) and
        // a date-keyed `programLogs`. Anything else is from the old slot-
        // keyed model and can't be safely migrated, so we drop it.
        const isLegacy = ap.program && !Array.isArray(ap.program.weekdays);
        if (isLegacy) {
          setActiveProgram(null);
          setProgramLogs({});
          // Persist the reset so it doesn't show up on next load either.
          try { await DB.saveActiveProgram(null, {}); } catch {}
        } else {
          setActiveProgram(ap.program);
          setProgramLogs(ap.logs);
        }
        setDataLoaded(true);
        initialLoadDone.current = true;

        // After load, check if there's local data worth migrating.
        if (DB.hasLocalDataToMigrate()) {
          setMigrationPrompt(true);
        } else if (!p) {
          // No profile? Show onboarding.
          setOnboarding(true);
        }
      } catch (err) {
        console.error("Failed to load cloud data:", err);
        setDataLoaded(true);
        initialLoadDone.current = true;
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // ─── VIEWED WEEK (PROGRAM TAB) ───────────────────────────────────────────────
  const [viewedWeek, setViewedWeek] = useState(null);

  // ─── SAVE TO SUPABASE WHEN STATE CHANGES ─────────────────────────────────────
  // Profile
  useEffect(() => {
    if (!initialLoadDone.current || !profile) return;
    DB.saveProfile(profile).catch(e => console.error("saveProfile failed:", e));
  }, [profile]);

  // Active program + logs (saved together)
  useEffect(() => {
    if (!initialLoadDone.current) return;
    DB.saveActiveProgram(activeProgram, programLogs).catch(e =>
      console.error("saveActiveProgram failed:", e)
    );
  }, [activeProgram, programLogs]);

  // ─── AI COACH STATE (still local-only; small + ephemeral) ────────────────────
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

  // ─── AUTO-SAVE IN-PROGRESS WORKOUT (still local — device specific) ───────────
  useEffect(() => {
    try {
      if (current.exercises.length > 0) {
        localStorage.setItem("wt_currentDraft", JSON.stringify({
          ...current,
          savedAt: Date.now(),
        }));
      } else {
        localStorage.removeItem("wt_currentDraft");
      }
    } catch {}
  }, [current]);

  useEffect(() => {
    try {
      if (activeSlot) localStorage.setItem("wt_activeSlot", JSON.stringify(activeSlot));
      else localStorage.removeItem("wt_activeSlot");
    } catch {}
  }, [activeSlot]);

  // On mount, if a draft was restored, force the user into the Log tab so they
  // see their unfinished workout immediately (not whatever tab they last had open).
  useEffect(() => {
    if (current.exercises.length > 0) setTab("log");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Find the last N sessions where this exercise was performed.
  // Returns an array of { weight, reps, date }, most recent first.
  function findRecentSessions(exerciseName, n = 3) {
    const sessions = [];
    for (const w of workouts) {
      const ex = w.exercises.find(e => e.name === exerciseName);
      if (!ex) continue;
      let best = null;
      for (const s of ex.sets) {
        const wt = parseFloat(s.weight) || 0;
        const rp = parseFloat(s.reps) || 0;
        if (wt === 0 && rp === 0) continue;
        if (!best || wt > best.weight || (wt === best.weight && rp > best.reps)) {
          best = { weight: wt, reps: rp, date: w.date };
        }
      }
      if (best) sessions.push(best);
      if (sessions.length >= n) break;
    }
    return sessions;
  }

  // Find the previous identical workout (same name) — used to show "same as last time"
  function findLastSession(workoutName) {
    return workouts.find(w => w.name === workoutName) || null;
  }

  // Build an exercise object with empty sets but a `last` reference attached.
  function buildExerciseEntry(name) {
    const recent = findRecentSessions(name, 3);
    return {
      name,
      last: recent[0] || null,    // { weight, reps, date } or null
      recent,                     // up to 3 most recent sessions
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

      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error("Daily AI plan limit reached. Try again tomorrow!");
        }
        throw new Error(errData.error || `Server returned ${response.status}`);
      }
      const data = await response.json();
      if (!data.text) throw new Error("No text in response");

      // Strip any markdown fences and parse
      const cleaned = data.text.replace(/```json|```/g, "").trim();
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
  async function deleteWorkout(id) {
    setConfirmDelete(null);
    try {
      await DB.deleteWorkoutById(id);
    } catch (err) {
      console.error("Cloud delete failed:", err);
      alert("Could not delete the workout. Check your connection and try again.");
      return;
    }
    setWorkouts(w => w.filter(workout => workout.id !== id));
    setProgramLogs(prev => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (next[key].workoutId === id) delete next[key];
      }
      return next;
    });
  }

  async function clearAllWorkouts() {
    setConfirmDelete(null);
    try {
      await DB.deleteAllWorkouts();
    } catch (err) {
      console.error("Cloud delete-all failed:", err);
      alert("Could not clear workouts. Check your connection and try again.");
      return;
    }
    setWorkouts([]);
    setProgramLogs({});
  }

  // ─── ACTIVE PROGRAM FUNCTIONS ────────────────────────────────────────────────
  // Adopt a split as the active program.
  //   frequency: how many sessions per week
  //   mode:      "repeat" (variation A every cycle) | "rotate" (cycle A/B/C…)
  //   weekdays:  array of JS day numbers (0=Sun..6=Sat) the user trains on;
  //              must have exactly `frequency` entries.
  //   startDate: ISO date "YYYY-MM-DD" the program begins on. The user's
  //              first session is the first weekday on/after this date that's
  //              in `weekdays`.
  function adoptSplitAsProgram(splitName, frequency, mode = "repeat", weekdays, startDate) {
    const split = SPLITS[splitName];
    const days = buildWeekSchedule(split.patterns, frequency, mode);
    setActiveProgram({
      source: "split",
      splitName,
      frequency,
      mode,
      color: split.color,
      days: days.map(d => ({ name: d.displayName, tag: d.tag, exercises: d.exercises })),
      weekdays: [...weekdays].sort((a,b)=>a-b),  // store ascending for stable display
      startDate: startDate || todayISO(),
    });
    setProgramLogs({});
    setViewedWeek(null);
    setTab("program");
  }

  // Adopt the AI-generated plan as the active program.
  // Same weekday/startDate concept as adoptSplitAsProgram.
  function adoptAIPlanAsProgram(weekdays, startDate) {
    if (!aiState?.plan) return;
    const planDays = aiState.plan.days;
    // If caller didn't supply weekdays, fall back to a sensible default:
    // first N weekdays starting Monday. (Should always be supplied via modal.)
    const wd = weekdays && weekdays.length === planDays.length
      ? [...weekdays].sort((a,b)=>a-b)
      : WEEKDAY_PICKER_ORDER.slice(0, planDays.length).sort((a,b)=>a-b);
    setActiveProgram({
      source: "ai",
      planName: aiState.plan.name,
      color: "#ff6b35",
      days: planDays.map(d => ({
        name: d.name,
        tag: d.tag,
        exercises: d.exercises,
      })),
      weekdays: wd,
      startDate: startDate || todayISO(),
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

  // Compute the current week index based on startDate. Weeks are CALENDAR-
  // aligned: anchored to the user's earliest chosen weekday in the week
  // containing startDate. So if you start a Sat-Thu program on a Wednesday,
  // Week 0's anchor is the prior Saturday; Week 1 starts the following Saturday.
  function getCurrentWeekIndex() {
    if (!activeProgram?.startDate || !activeProgram?.weekdays) return 0;
    const anchor = weekAnchorFor(activeProgram.weekdays, activeProgram.startDate);
    const diff = daysBetween(anchor, todayISO());
    return Math.max(0, Math.floor(diff / 7));
  }

  // Start logging a specific scheduled day. `sessionDate` is the ISO calendar
  // date this session falls on; that date is the key for completion tracking.
  function startScheduledDay(sessionDate) {
    if (!activeProgram) return;
    const patternIdx = patternIndexForDate(
      activeProgram.weekdays,
      activeProgram.startDate,
      activeProgram.days.length,
      sessionDate
    );
    const day = activeProgram.days[patternIdx];
    const existingLog = programLogs[sessionDate];

    // If already completed, load that exact workout for editing
    if (existingLog?.workoutId) {
      const workout = workouts.find(w => w.id === existingLog.workoutId);
      if (workout) {
        const exercises = workout.exercises.map(e => {
          const recent = findRecentSessionsExcluding(e.name, workout.id, 3);
          return {
            ...e,
            last: recent[0] || null,
            recent,
          };
        });
        setCurrent({ name: workout.name, tag: workout.tag, exercises, editingId: workout.id });
        setActiveSlot({ sessionDate });
        setTab("log");
        return;
      }
    }

    // Otherwise start fresh from the program template
    const exercises = day.exercises.map(buildExerciseEntry);
    setCurrent({ name: day.name, tag: day.tag, exercises });
    setActiveSlot({ sessionDate });
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

  // Recent sessions excluding a specific workout id (used when editing).
  function findRecentSessionsExcluding(exerciseName, excludeId, n = 3) {
    const sessions = [];
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
      if (best) sessions.push(best);
      if (sessions.length >= n) break;
    }
    return sessions;
  }

  // Manually toggle a session's completion status without logging a full
  // workout. `sessionDate` is the ISO calendar date of the session.
  async function toggleSlotComplete(sessionDate) {
    const existing = programLogs[sessionDate];
    if (existing) {
      // If linked to a real workout, also delete that workout from the cloud
      if (existing.workoutId) {
        try { await DB.deleteWorkoutById(existing.workoutId); } catch (err) {
          console.error("Failed to delete linked workout:", err);
        }
        setWorkouts(ws => ws.filter(w => w.id !== existing.workoutId));
      }
      setProgramLogs(prev => {
        const next = { ...prev };
        delete next[sessionDate];
        return next;
      });
    } else {
      setProgramLogs(prev => ({
        ...prev,
        [sessionDate]: { workoutId: null, completedAt: new Date().toISOString(), manual: true },
      }));
    }
  }

  async function finishWorkout() {
    if (!current.exercises.length) return;
    // Strip the `last` reference field — it's only for the live UI, not persistence
    const cleanExercises = current.exercises.map(({ name, sets }) => ({ name, sets }));
    const editingId = current.editingId;
    const entry = {
      id: editingId, // undefined for new, UUID for edit
      date: editingId ? (workouts.find(w => w.id === editingId)?.date || new Date().toISOString()) : new Date().toISOString(),
      name: current.name || "Workout",
      tag: current.tag,
      exercises: cleanExercises,
      totalSets: cleanExercises.reduce((a,e)=>a+e.sets.length,0),
      totalVolume: cleanExercises.reduce((a,e)=>a+e.sets.reduce((b,s)=>b+(parseFloat(s.weight)||0)*(parseFloat(s.reps)||0),0),0),
    };

    let saved;
    try {
      saved = await DB.saveWorkout(entry);
    } catch (err) {
      console.error("Failed to save workout to cloud:", err);
      alert("Could not save your workout. Check your internet connection and try again.");
      return;
    }

    if (editingId) {
      setWorkouts(ws => ws.map(w => w.id === editingId ? saved : w));
    } else {
      setWorkouts(w => [saved, ...w]);
    }

    // After a fresh save (not an edit), offer to share to the social feed.
    const shouldOfferShare = !editingId;

    // If this was logged against a program slot, link it (use the cloud-assigned ID)
    if (activeSlot) {
      const key = activeSlot.sessionDate;
      setProgramLogs(prev => ({
        ...prev,
        [key]: { workoutId: saved.id, completedAt: new Date().toISOString(), manual: false },
      }));
      setCurrent({ name:"", exercises:[], tag:null });
      setActiveSlot(null);
      setTab("program");
    } else {
      setCurrent({ name:"", exercises:[], tag:null });
      setTab("history");
    }

    if (shouldOfferShare && confirm("Workout saved! Share it to your feed?")) {
      setComposePost(saved);
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

  // ─── LOADING (data still syncing from cloud) ─────────────────────────────────
  if (!dataLoaded) return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed', sans-serif"}}>
      <div style={{fontSize:32,marginBottom:14,animation:"pulse 1.5s ease-in-out infinite"}}>🔨</div>
      <div style={{color:"#ff6b35",fontSize:13,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Loading your data...</div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );

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
    const schedule = buildWeekSchedule(split.patterns, freq, "repeat");
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
              : `${freq} sessions/week. ${split.patterns.length > freq ? `Rotating through ${split.patterns.length} workout types.` : "One cycle through all workout types."}`
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
          onClick={()=>setAdoptModal({ splitName: name, frequency: freq, splitColor: split.color, splitPatterns: split.patterns })}
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
                <div style={{fontSize:10,color:"#444",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>Day {i+1}</div>
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
          {[["log","Log"],["program","Program"],["plans","Plans"],["coach","Coach"],["social","Social"],["history","History"],["stats","Stats"]].map(([id,label])=>(
            <button key={id} style={S.navBtn(tab===id)} onClick={()=>setTab(id)}>
              {id==="coach" ? <span style={{color:tab==="coach"?"#ff6b35":"#888"}}>✨ {label}</span>
                : id==="social" ? <span style={{color:tab==="social"?"#ff6b35":"#888"}}>👥 {label}</span>
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
                  <div style={{display:"flex",alignItems:"center",gap:8,marginTop:3}}>
                    {current.tag&&<span style={S.tag(current.tag)}>{current.tag}</span>}
                    <span style={{fontSize:10,color:"#3a5a3a",letterSpacing:1,fontWeight:700}} title="Your workout is auto-saved. Close the app and come back anytime within 24 hours.">
                      ● AUTO-SAVED
                    </span>
                  </div>
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
                      📅 Program · {formatISODate(activeSlot.sessionDate)}
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
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{ex.name}</div>
                      {last ? (
                        <>
                          <div style={{fontSize:11,color:"#666",marginTop:3,letterSpacing:0.5}}>
                            Last: <span style={{color:"#ff6b35",fontWeight:700}}>{last.weight} lbs × {last.reps} reps</span>
                            <span style={{color:"#333",marginLeft:6}}>· {formatDate(last.date)}</span>
                          </div>
                          {/* Show recent trend if there are 2+ sessions */}
                          {ex.recent && ex.recent.length > 1 && (
                            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:5,flexWrap:"wrap"}}>
                              <span style={{fontSize:9,color:"#444",letterSpacing:1,textTransform:"uppercase",fontWeight:700}}>Trend</span>
                              {[...ex.recent].reverse().map((s, idx) => {
                                const prevIdx = idx > 0 ? idx - 1 : null;
                                const prev = prevIdx !== null ? [...ex.recent].reverse()[prevIdx] : null;
                                const delta = prev ? (s.weight * s.reps) - (prev.weight * prev.reps) : 0;
                                const trendColor = !prev ? "#666" : delta > 0 ? "#55efc4" : delta < 0 ? "#ff7675" : "#888";
                                return (
                                  <span key={idx} style={{
                                    display:"inline-flex",alignItems:"center",gap:3,
                                    background:"#1a1a28",borderRadius:5,padding:"2px 7px",
                                    fontSize:10,fontWeight:700,color:trendColor,
                                  }}>
                                    {s.weight}×{s.reps}
                                  </span>
                                );
                              })}
                              <span style={{fontSize:9,color:"#333"}}>oldest → newest</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div style={{fontSize:11,color:"#3a3a4a",marginTop:3,letterSpacing:0.5,fontStyle:"italic"}}>
                          First time — set your baseline!
                        </div>
                      )}
                    </div>
                    <button style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:15,marginLeft:8,flexShrink:0}} onClick={()=>removeExercise(ei)}>✕</button>
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

                  <div style={{display:"grid",gridTemplateColumns:"28px 1fr 10px 1fr 28px 32px",gap:6,alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:9,color:"#555",fontWeight:700}}>SET</span>
                    <span style={{fontSize:9,color:"#555",fontWeight:700,textAlign:"center"}}>REPS</span><span/>
                    <span style={{fontSize:9,color:"#555",fontWeight:700,textAlign:"center"}}>LBS</span><span/><span/>
                  </div>
                  {ex.sets.map((set,si)=>(
                    <div key={si} style={{display:"grid",gridTemplateColumns:"28px 1fr 10px 1fr 28px 32px",gap:6,alignItems:"center",marginBottom:6}}>
                      <span style={{fontSize:11,color:"#555",fontWeight:700}}>{si+1}</span>
                      <input style={S.input} type="number" placeholder={placeholderReps} value={set.reps} onChange={e=>updateSet(ei,si,"reps",e.target.value)}/>
                      <span style={{textAlign:"center",color:"#2a2a3e",fontSize:12}}>×</span>
                      <input style={S.input} type="number" placeholder={placeholderWeight} value={set.weight} onChange={e=>updateSet(ei,si,"weight",e.target.value)}/>
                      <span style={{fontSize:10,color:"#555"}}>lbs</span>
                      {ex.sets.length > 1 ? (
                        <button
                          style={{
                            background: "#2a1a1e",
                            border: "1px solid #4a2a30",
                            borderRadius: 6,
                            color: "#ff6677",
                            cursor: "pointer",
                            fontSize: 14,
                            height: 28,
                            width: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                            fontFamily: "inherit",
                            transition: "all 0.12s",
                          }}
                          onClick={()=>removeSet(ei,si)}
                          aria-label={`Remove set ${si+1}`}
                          title="Remove this set"
                        >🗑</button>
                      ) : <span/>}
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
          {!activeProgram || !Array.isArray(activeProgram.weekdays) || !parseISODate(activeProgram.startDate) ? (
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
            // Calendar dates for the sessions in this viewed week.
            const sessionDates = sessionDatesForWeek(
              activeProgram.weekdays,
              activeProgram.startDate,
              week
            );
            const completedThisWeek = sessionDates.filter(d => programLogs[d]).length;
            const week0Anchor = weekAnchorFor(activeProgram.weekdays, activeProgram.startDate);
            const weekStartISO = addDays(week0Anchor, week * 7);
            const weekEndISO   = addDays(week0Anchor, week * 7 + 6);
            const weekStartDate = parseISODate(weekStartISO);
            const weekEndDate   = parseISODate(weekEndISO);
            const today = todayISO();

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
                    style={{background:"none",border:"none",color:"#ff6b35",cursor:"pointer",fontSize:18,padding:"4px 10px"}}
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
                      {completedThisWeek}/{sessionDates.length}
                    </span>
                  </div>
                  <div style={{height:6,background:"#1a1a28",borderRadius:3,overflow:"hidden"}}>
                    <div style={{
                      height:"100%",
                      width:`${sessionDates.length ? (completedThisWeek/sessionDates.length)*100 : 0}%`,
                      background:`linear-gradient(90deg,${activeProgram.color||"#ff6b35"},#ff8c42)`,
                      borderRadius:3,
                      transition:"width 0.3s",
                    }}/>
                  </div>
                </div>

                {/* Scheduled days */}
                {sessionDates.map((sessionDate) => {
                  // Pattern index for this date — which entry of activeProgram.days?
                  const patternIdx = patternIndexForDate(
                    activeProgram.weekdays,
                    activeProgram.startDate,
                    activeProgram.days.length,
                    sessionDate
                  );
                  const day = activeProgram.days[patternIdx];
                  const log = programLogs[sessionDate];
                  const isDone = !!log;
                  const linkedWorkout = log?.workoutId ? workouts.find(w => w.id === log.workoutId) : null;
                  // A session is "missed" if its date is in the past AND it
                  // wasn't completed. We don't auto-mark anything in storage —
                  // missed status is derived from the calendar at render time.
                  const isMissed = !isDone && sessionDate < today;
                  const isToday  = sessionDate === today;
                  return (
                    <div key={sessionDate} style={{
                      background: isDone ? "#0e1812" : (isMissed ? "#150f10" : "#111118"),
                      border: `1px solid ${
                        isDone ? "#55efc433"
                        : isMissed ? "#5a2a2a44"
                        : isToday  ? (TAG_COLORS[day.tag]||"#ff6b35")+"66"
                        : (TAG_COLORS[day.tag]||"#1e1e2e")+"22"
                      }`,
                      borderLeft: `3px solid ${
                        isDone ? "#55efc4"
                        : isMissed ? "#7a4646"
                        : (TAG_COLORS[day.tag]||activeProgram.color||"#ff6b35")
                      }`,
                      borderRadius:12,
                      padding:"13px 16px",
                      marginBottom:10,
                      opacity: isMissed && !isDone ? 0.7 : (isDone ? 0.92 : 1),
                    }}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                            <span style={{fontSize:10,color:"#666",fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>
                              {formatISODate(sessionDate)}
                            </span>
                            {isToday && !isDone && <span style={{fontSize:10,color:"#ff6b35",fontWeight:700,letterSpacing:1}}>· TODAY</span>}
                            {isDone && <span style={{fontSize:10,color:"#55efc4",fontWeight:700,letterSpacing:1}}>✓ COMPLETE</span>}
                            {isMissed && <span style={{fontSize:10,color:"#a85a5a",fontWeight:700,letterSpacing:1}}>· MISSED</span>}
                          </div>
                          <div style={{fontWeight:700,fontSize:15,color:isDone?"#aaa":(isMissed?"#777":"#f0ede8"),textDecoration:isDone?"line-through":"none",textDecorationColor:"#55efc466"}}>
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
                          onClick={()=>startScheduledDay(sessionDate)}
                        >
                          {isDone ? "✎ Edit" : (isMissed ? "Log anyway" : "Start →")}
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
                          onClick={()=>toggleSlotComplete(sessionDate)}
                        >
                          {isDone ? "↺ Undo" : "✓ Mark Done"}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Week complete message */}
                {sessionDates.length > 0 && completedThisWeek === sessionDates.length && (
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
                      Great work hitting all {sessionDates.length} sessions. {isCurrentWeek ? "Next week starts automatically." : "Browse to other weeks with ◀ ▶ above."}
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
                onClick={()=>setAdoptModal({
                  kind: "ai",
                  frequency: aiState.plan.days.length,
                  splitColor: "#ff6b35",
                  // Make a faux splitPatterns array so AdoptModal can render
                  // a preview without branching: each AI day becomes a "pattern"
                  // with one variation (variation A = its exercise list).
                  splitPatterns: aiState.plan.days.map(d => ({
                    name: d.name,
                    tag: d.tag,
                    variations: [d.exercises],
                  })),
                  splitName: aiState.plan.name,
                  isAI: true,
                })}
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
                Powered by Claude · Up to 10 plans per day
              </div>
            </>
          )}
        </div>
      )}


      {tab==="social" && (
        <div style={S.section}>
          <SocialScreen
            currentUserId={session.user.id}
            onCopyToLog={(w) => {
              // w is workout-shaped: { name, tag, exercises (with blank sets) }
              setCurrent({ name: w.name, tag: w.tag, exercises: w.exercises });
              setTab("log");
            }}
            onOpenProfile={(username) => { window.location.hash = `#/u/${username}`; }}
          />
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
                      style={{background:"none",border:"none",color:"#ff6b35",cursor:"pointer",fontSize:12,padding:"2px 8px",borderRadius:5,fontWeight:700,letterSpacing:1,textTransform:"uppercase",fontFamily:"inherit"}}
                      onClick={()=>setComposePost(w)}
                      title="Share this workout to your feed"
                    >Share</button>
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

          {/* Account section */}
          <div style={{marginTop:32,paddingTop:18,borderTop:"1px solid #1a1a28"}}>
            <div style={{...S.label,marginBottom:10}}>Account</div>
            <div style={{...S.card,marginBottom:10}}>
              <div style={{color:"#888",fontSize:11,letterSpacing:1,textTransform:"uppercase",fontWeight:700,marginBottom:6}}>
                Signed in as
              </div>
              <div style={{color:"#f0ede8",fontSize:14,fontWeight:600,wordBreak:"break-all"}}>
                {session?.user?.email}
              </div>
              <div style={{color:"#3a5a3a",fontSize:10,letterSpacing:1,marginTop:8,fontWeight:700}}>
                ● SYNCED TO CLOUD
              </div>
            </div>
            <button
              style={{
                width:"100%",
                background:"transparent",
                border:"1px solid #2a2a3e",
                borderRadius:8,
                padding:"10px 14px",
                color:"#ff6677",
                fontFamily:"inherit",
                fontSize:12,
                fontWeight:700,
                letterSpacing:1,
                textTransform:"uppercase",
                cursor:"pointer",
              }}
              onClick={async () => {
                if (!confirm("Log out? Your data stays safe in the cloud.")) return;
                await supabase.auth.signOut();
                onLogout?.();
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* ─── MIGRATION PROMPT ────────────────────────────────────────────────── */}
      {migrationPrompt && (
        <div style={{position:"fixed",inset:0,background:"#000d",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#111118",border:"1px solid #2a2a3e",borderRadius:14,padding:24,maxWidth:380,width:"100%",boxSizing:"border-box"}}>
            <div style={{fontSize:36,textAlign:"center",marginBottom:10}}>☁️</div>
            <div style={{fontWeight:800,fontSize:16,letterSpacing:1,textTransform:"uppercase",textAlign:"center",marginBottom:10,color:"#ff6b35"}}>
              Move Your Data to the Cloud?
            </div>
            <div style={{color:"#888",fontSize:13,lineHeight:1.6,marginBottom:18}}>
              We found local workout data from before you signed up. Want to copy it to your account so it syncs across devices?
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <button
                style={{
                  background:"linear-gradient(90deg,#ff6b35,#ff8c42)",
                  border:"none",borderRadius:8,padding:"11px 14px",color:"#fff",
                  fontFamily:"inherit",fontSize:13,fontWeight:800,letterSpacing:1,
                  textTransform:"uppercase",cursor:migrating?"wait":"pointer",
                  opacity:migrating?0.7:1,
                }}
                disabled={migrating}
                onClick={async () => {
                  setMigrating(true);
                  try {
                    const result = await DB.migrateLocalData();
                    DB.clearMigratedLocalData();
                    // Reload data from cloud
                    const [p, ws, ap] = await Promise.all([
                      DB.loadProfile(),
                      DB.loadWorkouts(),
                      DB.loadActiveProgram(),
                    ]);
                    setProfile(p);
                    setWorkouts(ws);
                    setActiveProgram(ap.program);
                    setProgramLogs(ap.logs);
                    setMigrationPrompt(false);
                    if (!p) setOnboarding(true);
                    alert(`Migrated ${result.workouts} workouts${result.profile?" + profile":""}${result.program?" + active program":""}. Your data is now in the cloud!`);
                  } catch (err) {
                    console.error("Migration failed:", err);
                    alert("Migration failed. Your local data is still safe — try again or contact support.");
                  } finally {
                    setMigrating(false);
                  }
                }}
              >
                {migrating ? "Moving..." : "☁️ Move to Cloud"}
              </button>
              <button
                style={{
                  background:"transparent",border:"1px solid #2a2a3e",borderRadius:8,
                  padding:"11px 14px",color:"#666",fontFamily:"inherit",fontSize:12,
                  fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer",
                }}
                disabled={migrating}
                onClick={() => {
                  if (confirm("Discard the local data? It will be deleted from this device.")) {
                    DB.clearMigratedLocalData();
                    setMigrationPrompt(false);
                    if (!profile) setOnboarding(true);
                  }
                }}
              >
                Discard Local Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADOPTION MODAL ─────────────────────────────────────────────────── */}
      {adoptModal && (
        <AdoptModal
          modal={adoptModal}
          onClose={()=>setAdoptModal(null)}
          onConfirm={({ mode, weekdays, startDate })=>{
            if (adoptModal.kind === "ai") {
              adoptAIPlanAsProgram(weekdays, startDate);
            } else {
              adoptSplitAsProgram(adoptModal.splitName, adoptModal.frequency, mode, weekdays, startDate);
            }
            setAdoptModal(null);
          }}
          S={S}
        />
      )}
      {composePost && (
        <ComposePostModal
          workout={composePost}
          onClose={() => setComposePost(null)}
          onPosted={({ imageWarning } = {}) => {
            setComposePost(null);
            if (imageWarning) {
              alert("Your post was created, but the image couldn't be uploaded: " + imageWarning);
            }
            setTab("social");
          }}
        />
      )}
    </div>
  );
}

// ─── ADOPT PROGRAM MODAL ─────────────────────────────────────────────────────
function AdoptModal({ modal, onClose, onConfirm, S }) {
  const [mode, setMode] = useState("repeat");
  const { splitName, frequency, splitColor, splitPatterns, isAI } = modal;

  // Check if any pattern has more than 1 variation — if not, rotate is meaningless
  const hasVariations = !isAI && splitPatterns.some(p => p.variations.length > 1);

  // Default weekdays: spread the frequency across the week starting Monday,
  // skipping Sunday when possible. The user can change this.
  const defaultWeekdays = (() => {
    // Pick `frequency` weekdays from WEEKDAY_PICKER_ORDER (Mon..Sun)
    return WEEKDAY_PICKER_ORDER.slice(0, frequency).sort((a,b)=>a-b);
  })();
  const [weekdays, setWeekdays] = useState(defaultWeekdays);
  const [startDate, setStartDate] = useState(todayISO());

  const dayCountOk = weekdays.length === frequency;
  const startDateValid = !!parseISODate(startDate);
  const canConfirm = dayCountOk && startDateValid;

  // Preview the resulting week
  const preview = isAI
    ? splitPatterns.map((p, i) => ({
        name: p.name,
        tag: p.tag,
        exercises: p.variations[0],
        displayName: p.name,
      }))
    : buildWeekSchedule(splitPatterns, frequency, mode);

  // Preview Week 0: the calendar week containing startDate. Days before
  // startDate within that week will be auto-marked MISSED in the live app,
  // so we surface that visually here too.
  const previewDates = dayCountOk
    ? sessionDatesForWeek(weekdays, startDate, 0)
    : [];

  function toggleWeekday(d) {
    setWeekdays(prev => {
      if (prev.includes(d)) {
        return prev.filter(x => x !== d);
      }
      // Don't allow more than `frequency` selected
      if (prev.length >= frequency) return prev;
      return [...prev, d].sort((a,b)=>a-b);
    });
  }

  return (
    <div style={{position:"fixed",inset:0,background:"#000d",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{
        background:"#111118",borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:520,
        maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box",
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
          <div>
            <div style={{color:splitColor,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",fontSize:10,marginBottom:4}}>
              {isAI ? "Start AI Program" : "Start Program"}
            </div>
            <div style={{fontWeight:800,fontSize:20,lineHeight:1.2}}>{splitName}</div>
            <div style={{color:"#666",fontSize:12,marginTop:3}}>{frequency===7?"Daily":`${frequency}x per week`}</div>
          </div>
          <button style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:18,padding:"2px 8px"}} onClick={onClose}>✕</button>
        </div>

        {hasVariations && (
          <>
            <div style={{...S.label,marginTop:24,marginBottom:10}}>How should the week be structured?</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
              <ModeOption
                selected={mode==="repeat"}
                color={splitColor}
                title="Repeat Exact Same"
                desc={`Use the same exercises every session. ${splitPatterns.length > 1 ? `${splitPatterns.map(p=>p.name).join(", ")} alternate, but each repeats identically.` : "Same workout, every time."} Progress carries across all days.`}
                onClick={()=>setMode("repeat")}
              />
              <ModeOption
                selected={mode==="rotate"}
                color={splitColor}
                title="Rotate with A/B/C Variations"
                desc={`Different exercises each cycle. ${splitPatterns[0].variations.length} variations${splitPatterns[0].variations.length===3?" (A, B, C)":""} hit the same movement patterns differently for variety.`}
                onClick={()=>setMode("rotate")}
              />
            </div>
          </>
        )}

        {/* ── WEEKDAY PICKER ──────────────────────────────────────────────── */}
        <div style={{...S.label,marginTop:hasVariations?0:24,marginBottom:10}}>
          Which days do you lift? <span style={{color:dayCountOk?"#55efc4":"#ff6b35",fontWeight:800}}>({weekdays.length}/{frequency})</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:6}}>
          {WEEKDAY_PICKER_ORDER.map(d => {
            const selected = weekdays.includes(d);
            const atCap = weekdays.length >= frequency && !selected;
            return (
              <button
                key={d}
                onClick={()=>toggleWeekday(d)}
                disabled={atCap}
                style={{
                  padding:"10px 0",
                  border: selected ? `1.5px solid ${splitColor}` : "1px solid #2a2a3e",
                  borderRadius:8,
                  background: selected ? `${splitColor}22` : (atCap ? "#0a0a14" : "#1a1a28"),
                  color: selected ? splitColor : (atCap ? "#333" : "#888"),
                  fontFamily:"inherit",
                  fontSize:11,
                  fontWeight:800,
                  letterSpacing:1,
                  textTransform:"uppercase",
                  cursor: atCap ? "not-allowed" : "pointer",
                  transition:"all 0.15s",
                }}
              >
                {WEEKDAY_NAMES_SHORT[d]}
              </button>
            );
          })}
        </div>
        <div style={{fontSize:11,color:"#555",marginBottom:18,lineHeight:1.5}}>
          {dayCountOk
            ? `Patterns will cycle through these days in order each week.`
            : `Pick ${frequency - weekdays.length} more day${frequency-weekdays.length===1?"":"s"} to continue.`}
        </div>

        {/* ── START DATE ───────────────────────────────────────────────────── */}
        <div style={{...S.label,marginBottom:10}}>Start date</div>
        <input
          type="date"
          value={startDate}
          min={todayISO()}
          onChange={e => setStartDate(e.target.value)}
          style={{
            width:"100%",
            background:"#1a1a28",
            border:"1px solid #2a2a3e",
            borderRadius:8,
            padding:"10px 14px",
            color:"#f0ede8",
            fontFamily:"inherit",
            fontSize:14,
            outline:"none",
            boxSizing:"border-box",
            colorScheme:"dark",
            marginBottom:6,
          }}
        />
        <div style={{fontSize:11,color:"#555",marginBottom:18,lineHeight:1.5}}>
          Defaults to today. Your first session is the first chosen weekday on or after this date.
        </div>

        {/* ── PREVIEW ─────────────────────────────────────────────────────── */}
        <div style={{...S.label,marginBottom:10}}>Preview · First Week</div>
        <div style={{background:"#0e0e18",border:"1px solid #1e1e2e",borderRadius:10,padding:12,marginBottom:18}}>
          {!dayCountOk ? (
            <div style={{color:"#666",fontSize:12,padding:"8px 4px"}}>
              Pick {frequency} day{frequency===1?"":"s"} above to see your schedule.
            </div>
          ) : previewDates.length === 0 ? (
            <div style={{color:"#666",fontSize:12,padding:"8px 4px"}}>
              No sessions found. Check the start date and weekday selection.
            </div>
          ) : (
            previewDates.map((iso, i) => {
              // In the live app, patterns count from the week-0 anchor, so the
              // preview here should match that ordering exactly: index `i` in
              // sessionDatesForWeek(...,0) corresponds to pattern i % patterns.
              const day = preview[i % preview.length];
              const isPreMissed = iso < startDate;
              return (
                <div key={iso} style={{
                  padding:"6px 0",borderBottom: i<previewDates.length-1 ? "1px solid #1a1a28" : "none",
                  opacity: isPreMissed ? 0.55 : 1,
                }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                      <span style={{fontSize:10,color:"#666",fontWeight:700,letterSpacing:1,minWidth:64,flexShrink:0}}>
                        {formatISODate(iso)}
                      </span>
                      <span style={{fontSize:13,color:isPreMissed?"#777":"#ddd",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {day.displayName || day.name}
                      </span>
                      {isPreMissed && (
                        <span style={{fontSize:9,color:"#a85a5a",fontWeight:700,letterSpacing:1,flexShrink:0}}>· MISSED</span>
                      )}
                    </div>
                    <span style={{fontSize:10,color:TAG_COLORS[day.tag]||"#666",fontWeight:700,letterSpacing:1,textTransform:"uppercase",flexShrink:0,marginLeft:6}}>{day.tag}</span>
                  </div>
                  {!isAI && mode === "rotate" && !isPreMissed && (
                    <div style={{fontSize:10,color:"#444",marginTop:3,marginLeft:72,lineHeight:1.4}}>
                      {day.exercises.slice(0,3).join(" · ")}{day.exercises.length>3?` · +${day.exercises.length-3}`:""}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <button
          disabled={!canConfirm}
          style={{
            width:"100%",
            background: canConfirm ? `linear-gradient(90deg,${splitColor},${splitColor}cc)` : "#1a1a28",
            border:"none",borderRadius:10,padding:"13px",
            color: canConfirm ? "#0a0a0f" : "#444",
            fontFamily:"inherit",fontSize:13,fontWeight:800,letterSpacing:2,textTransform:"uppercase",
            cursor: canConfirm ? "pointer" : "not-allowed",
            boxShadow: canConfirm ? `0 4px 20px ${splitColor}33` : "none",
          }}
          onClick={()=>canConfirm && onConfirm({ mode, weekdays, startDate })}
        >
          📅 Confirm & Start
        </button>
      </div>
    </div>
  );
}

function ModeOption({ selected, color, title, desc, onClick }) {
  return (
    <button
      style={{
        background: selected ? `${color}18` : "#1a1a28",
        border: selected ? `1.5px solid ${color}` : "1px solid #2a2a3e",
        borderRadius:10,padding:"12px 14px",textAlign:"left",cursor:"pointer",
        fontFamily:"inherit",transition:"all 0.15s",
      }}
      onClick={onClick}
    >
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <div style={{fontWeight:700,fontSize:13,color:selected?color:"#ddd"}}>{title}</div>
        {selected && <div style={{color,fontSize:14}}>✓</div>}
      </div>
      <div style={{color:"#666",fontSize:11,lineHeight:1.5}}>{desc}</div>
    </button>
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


// ─── TOP-LEVEL APP: AUTH WRAPPER ─────────────────────────────────────────────
// Listens for auth state changes from Supabase and renders the right screen.
export default function App() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  // Profile completeness gate: null = not yet checked, true/false once known.
  const [hasUsername, setHasUsername] = useState(null);
  // Hash route, e.g. "" or "#/u/rogerb"
  const [route, setRoute] = useState(typeof window !== "undefined" ? window.location.hash : "");

  // Listen for hash changes so back/forward and profile links work
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    // If Supabase isn't configured, show a setup screen
    if (!isSupabaseConfigured) {
      setCheckingAuth(false);
      return;
    }

    // Get current session on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingAuth(false);
    });

    // Listen for sign-in / sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      // Reset username check on auth change so the new user gets re-evaluated
      setHasUsername(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Whenever we have a session but haven't checked the username yet, check it.
  useEffect(() => {
    if (!session || hasUsername !== null) return;
    let cancelled = false;
    (async () => {
      const profile = await DB.loadProfile();
      if (cancelled) return;
      setHasUsername(!!(profile && profile.username));
    })();
    return () => { cancelled = true; };
  }, [session, hasUsername]);

  // Setup error: Supabase env vars not set
  if (!isSupabaseConfigured) {
    return (
      <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#f0ede8",fontFamily:"'Barlow Condensed', sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28,textAlign:"center"}}>
        <div style={{fontSize:42,marginBottom:14}}>⚠️</div>
        <div style={{fontSize:18,fontWeight:800,letterSpacing:1,color:"#ff6b35",marginBottom:10}}>Configuration Required</div>
        <div style={{color:"#888",fontSize:13,maxWidth:400,lineHeight:1.6}}>
          Supabase environment variables are not set. Add <code style={{background:"#1a1a28",padding:"2px 6px",borderRadius:4,color:"#fdcb6e"}}>VITE_SUPABASE_URL</code> and <code style={{background:"#1a1a28",padding:"2px 6px",borderRadius:4,color:"#fdcb6e"}}>VITE_SUPABASE_ANON_KEY</code> to your <code style={{background:"#1a1a28",padding:"2px 6px",borderRadius:4,color:"#fdcb6e"}}>.env.local</code> file (local) or Vercel environment variables (production), then restart the dev server.
        </div>
      </div>
    );
  }

  // Checking auth state
  if (checkingAuth) {
    return (
      <div style={{minHeight:"100vh",background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{color:"#ff6b35",fontSize:32,animation:"pulse 1.5s ease-in-out infinite"}}>🔨</div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  // Not authenticated → show login/signup
  if (!session) {
    return <AuthScreen onAuthSuccess={(s) => setSession(s)} />;
  }

  // Authenticated but profile not yet checked → loading state
  if (hasUsername === null) {
    return (
      <div style={{minHeight:"100vh",background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{color:"#ff6b35",fontSize:32,animation:"pulse 1.5s ease-in-out infinite"}}>🔨</div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  // No username yet → block the app and force them to pick one
  if (!hasUsername) {
    return <UsernameGate session={session} onDone={() => setHasUsername(true)} />;
  }

  // Hash route: #/u/<username> → profile page (rendered above AnvilApp so it
  // works whether or not AnvilApp has finished mounting)
  const profileMatch = route.match(/^#\/u\/([A-Za-z0-9_]{3,20})$/);
  if (profileMatch) {
    return (
      <ProfileScreen
        username={profileMatch[1]}
        currentUserId={session.user.id}
        onBack={() => { window.location.hash = ""; }}
      />
    );
  }

  // Authenticated + has username + no special route → main app
  return <AnvilApp key={session.user.id} session={session} onLogout={() => setSession(null)} />;
}
