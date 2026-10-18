import { projects, certificates, skills } from "./data.js";

// ==========================================
// 1️⃣ INTERACTIVE COSMIC STARFIELD & WARP DRIVE
// ==========================================
const canvas = document.getElementById("cosmic-canvas");
const ctx = canvas.getContext("2d");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Star properties
const STAR_COUNT = 240;
let stars = [];
let isWarping = false;
let warpSpeedMultiplier = 1;
let targetWarpMultiplier = 1;

// Mouse Parallax
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

window.addEventListener("mousemove", (e) => {
  targetMouseX = (e.clientX - width / 2) * 0.05;
  targetMouseY = (e.clientY - height / 2) * 0.05;
});

function initStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      prevZ: 0,
      size: Math.random() * 1.5 + 0.5,
      hue: Math.random() > 0.8 ? (Math.random() > 0.5 ? 185 : 270) : 0, // cyan, violet, or pure starlight
      alpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
    });
    stars[i].prevZ = stars[i].z;
  }
}
initStars();

// Shooting Meteor Engine
let meteors = [];
function spawnMeteor() {
  if (isWarping) return;
  const startX = Math.random() * width;
  const startY = Math.random() * (height * 0.4);
  const length = Math.random() * 120 + 80;
  const speed = Math.random() * 8 + 10;
  const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.2; // ~45 degrees

  meteors.push({
    x: startX,
    y: startY,
    length,
    speed,
    angle,
    alpha: 1,
  });
}

setInterval(() => {
  if (Math.random() > 0.35 && meteors.length < 3) {
    spawnMeteor();
  }
}, 3800);

// ==========================================
// 🌌 CINEMATIC 3D TRAVELING CELESTIAL PLANETARY SYSTEM
// ==========================================
let celestialBodies = [];

// 5 Radically Distinct Planetary Specifications
const PLANET_DEFINITIONS = [
  {
    name: "Aurelia Prime",
    type: "gas_giant",
    baseRadius: 30,
    minRadius: 7,
    maxRadius: 36,
  },
  {
    name: "Verdant-X",
    type: "oceanic_ice",
    baseRadius: 23,
    minRadius: 6,
    maxRadius: 28,
  },
  {
    name: "Nyx Void",
    type: "eclipse_moon",
    baseRadius: 15,
    minRadius: 4,
    maxRadius: 18,
  },
  {
    name: "Ignis-Inferno",
    type: "magma_world",
    baseRadius: 21,
    minRadius: 5,
    maxRadius: 25,
  },
  {
    name: "Glacies-Prime",
    type: "glacial_ice",
    baseRadius: 21,
    minRadius: 5,
    maxRadius: 25,
  },
];

function getRandomSectorTarget(sectorIndex) {
  // Broadly distributed screen perimeter sectors framing the cockpit UI
  let targetPx, targetPy;
  switch (sectorIndex % 5) {
    case 0: // Sector 0: Upper-Right quadrant (below warp drive button)
      targetPx = width * (0.82 + Math.random() * 0.10);
      targetPy = height * (0.18 + Math.random() * 0.16);
      break;
    case 1: // Sector 1: Upper-Left quadrant (below logo & nav)
      targetPx = width * (0.10 + Math.random() * 0.12);
      targetPy = height * (0.20 + Math.random() * 0.16);
      break;
    case 2: // Sector 2: Mid/Lower-Left quadrant (outer margin)
      targetPx = width * (0.07 + Math.random() * 0.10);
      targetPy = height * (0.52 + Math.random() * 0.22);
      break;
    case 3: // Sector 3: Mid/Lower-Right quadrant (outer margin)
      targetPx = width * (0.83 + Math.random() * 0.10);
      targetPy = height * (0.52 + Math.random() * 0.22);
      break;
    case 4: // Sector 4: Bottom quadrant (spread below main telemetry)
      targetPx = width * (0.30 + Math.random() * 0.40);
      targetPy = height * (0.84 + Math.random() * 0.10);
      break;
  }
  return { targetPx, targetPy };
}

function initCelestialBodies() {
  const shuffledSectors = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);

  celestialBodies = PLANET_DEFINITIONS.map((def, i) => {
    const sector = shuffledSectors[i];
    const { targetPx, targetPy } = getRandomSectorTarget(sector);

    // Target closest approach depth where planet reaches peak framing clarity
    const zClosest = 380 + Math.random() * 80;
    const kClosest = 260 / zClosest;

    // 3D coordinates aligned with the perspective flight vector towards (targetPx, targetPy)
    const x = (targetPx - width / 2) / kClosest;
    const y = (targetPy - height / 2) / kClosest;

    // Stagger initial depths across the cosmos:
    // One close (350), one approaching (650), one mid (950), one far (1250), one deep (1550)
    const z = 350 + i * 300 + (Math.random() - 0.5) * 60;

    return {
      name: def.name,
      type: def.type,
      sectorIndex: sector,
      x: x,
      y: y,
      z: z,
      baseRadius: def.baseRadius,
      minRadius: def.minRadius,
      maxRadius: def.maxRadius,
      speedFactor: 0.85 + Math.random() * 0.25,
      rotation: def.type === "gas_giant" ? -0.40 : (def.type === "oceanic_ice" ? 0.95 : 0),
    };
  });
}
initCelestialBodies();

function respawnCelestial(obj) {
  // Cycle to a non-overlapping screen sector
  obj.sectorIndex = (obj.sectorIndex + 1 + Math.floor(Math.random() * 2)) % 5;
  const { targetPx, targetPy } = getRandomSectorTarget(obj.sectorIndex);

  const zClosest = 380 + Math.random() * 80;
  const kClosest = 260 / zClosest;

  obj.x = (targetPx - width / 2) / kClosest;
  obj.y = (targetPy - height / 2) / kClosest;

  // Respawn deep in the cosmic void so it emerges and travels towards the camera
  obj.z = 1550 + Math.random() * 350;
  obj.speedFactor = 0.85 + Math.random() * 0.25;
}

function drawGasGiant(cx, cy, r, alpha, ringTilt = -0.40) {
  if (alpha <= 0.01 || r < 4) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  const ringFlatten = 0.28;
  const innerR = r * 1.34;
  const outerR = r * 2.36;

  // 1️⃣ DRAW BACK HALF OF PLANETARY RINGS (Behind the Planet Body)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(ringTilt);
  ctx.scale(1, ringFlatten);

  const ringGrad = ctx.createRadialGradient(0, 0, innerR, 0, 0, outerR);
  ringGrad.addColorStop(0.0, "rgba(56, 189, 248, 0)");
  ringGrad.addColorStop(0.08, "rgba(125, 211, 252, 0.12)");
  ringGrad.addColorStop(0.2, "rgba(147, 197, 253, 0.32)");
  ringGrad.addColorStop(0.52, "rgba(192, 132, 252, 0.38)");
  ringGrad.addColorStop(0.60, "rgba(3, 0, 10, 0.02)");
  ringGrad.addColorStop(0.68, "rgba(56, 189, 248, 0.30)");
  ringGrad.addColorStop(0.9, "rgba(168, 85, 247, 0.18)");
  ringGrad.addColorStop(1.0, "rgba(56, 189, 248, 0)");

  ctx.beginPath();
  ctx.arc(0, 0, outerR, Math.PI, 2 * Math.PI);
  ctx.arc(0, 0, innerR, 2 * Math.PI, Math.PI, true);
  ctx.closePath();
  ctx.fillStyle = ringGrad;
  ctx.fill();

  // Shadow cast by planet onto the back ring
  ctx.beginPath();
  ctx.arc(0, 0, outerR, Math.PI * 1.62, Math.PI * 2.05);
  ctx.arc(0, 0, innerR, Math.PI * 2.05, Math.PI * 1.62, true);
  ctx.closePath();
  const shadowGrad = ctx.createLinearGradient(0, 0, outerR * 0.8, -outerR * 0.4);
  shadowGrad.addColorStop(0, "rgba(3, 0, 10, 0.96)");
  shadowGrad.addColorStop(1, "rgba(3, 0, 10, 0)");
  ctx.fillStyle = shadowGrad;
  ctx.fill();

  ctx.restore();

  // 2️⃣ DRAW PLANET BODY
  ctx.save();
  // Atmospheric outer Rayleigh scattering haze
  const coronaGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.75, cx, cy, r * 1.25);
  coronaGrad.addColorStop(0, "rgba(56, 189, 248, 0.22)");
  coronaGrad.addColorStop(0.5, "rgba(147, 197, 253, 0.07)");
  coronaGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
  ctx.fillStyle = coronaGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
  ctx.fill();

  // Planet sphere with directional terminator gradient
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  const sphereGrad = ctx.createRadialGradient(
    cx - r * 0.42,
    cy - r * 0.38,
    r * 0.06,
    cx + r * 0.15,
    cy + r * 0.15,
    r * 1.15
  );
  sphereGrad.addColorStop(0.0, "#e0f2fe");
  sphereGrad.addColorStop(0.12, "#38bdf8");
  sphereGrad.addColorStop(0.28, "#0284c7");
  sphereGrad.addColorStop(0.48, "#4f46e5");
  sphereGrad.addColorStop(0.68, "#1e1b4b");
  sphereGrad.addColorStop(0.88, "#090514");
  sphereGrad.addColorStop(1.0, "#03000a");
  ctx.fillStyle = sphereGrad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  // Atmospheric cloud bands
  const bandOffsets = [-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6];
  for (let i = 0; i < bandOffsets.length; i++) {
    const bandY = cy + bandOffsets[i] * r;
    const bandH = r * 0.13;
    const bandGrad = ctx.createLinearGradient(cx - r, bandY, cx + r, bandY);
    const alphaBand = 0.06 + (i % 2 === 0 ? 0.05 : 0.01);
    bandGrad.addColorStop(0, `rgba(56, 189, 248, ${alphaBand * 1.4})`);
    bandGrad.addColorStop(0.5, `rgba(168, 85, 247, ${alphaBand})`);
    bandGrad.addColorStop(1, `rgba(2, 6, 23, ${alphaBand * 0.5})`);

    ctx.fillStyle = bandGrad;
    ctx.fillRect(cx - r, bandY - bandH / 2, r * 2, bandH);
  }

  // Ring shadow across planet body
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(ringTilt);
  ctx.scale(1, ringFlatten);
  ctx.fillStyle = "rgba(3, 0, 10, 0.40)";
  ctx.fillRect(-r, -r * 0.08, r * 2, r * 0.15);
  ctx.restore();

  ctx.restore(); // end clip

  // 3️⃣ ATMOSPHERIC LIMB CRESCENT GLOW
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI * 0.68, Math.PI * 1.62);
  ctx.strokeStyle = "rgba(125, 211, 252, 0.65)";
  ctx.lineWidth = Math.max(1.2, r * 0.035);
  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = Math.max(4, r * 0.1);
  ctx.stroke();
  ctx.restore();

  // 4️⃣ FRONT HALF OF PLANETARY RINGS (In front of Planet Body)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(ringTilt);
  ctx.scale(1, ringFlatten);

  ctx.beginPath();
  ctx.arc(0, 0, outerR, 0, Math.PI);
  ctx.arc(0, 0, innerR, Math.PI, 0, true);
  ctx.closePath();
  ctx.fillStyle = ringGrad;
  ctx.fill();

  ctx.restore();

  ctx.restore();
}

function drawEclipsePlanet(cx, cy, r, alpha) {
  if (alpha <= 0.01 || r < 3) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  // Eerie neon magenta & purple corona (Completely distinct purple/magenta glow)
  const corona = ctx.createRadialGradient(cx + r * 0.35, cy - r * 0.35, r * 0.70, cx, cy, r * 1.45);
  corona.addColorStop(0, "rgba(217, 70, 239, 0.40)");
  corona.addColorStop(0.5, "rgba(168, 85, 247, 0.15)");
  corona.addColorStop(1, "rgba(147, 51, 234, 0)");
  ctx.fillStyle = corona;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.45, 0, Math.PI * 2);
  ctx.fill();

  // Planet body
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  // 95% void obsidian black
  const sphereGrad = ctx.createRadialGradient(
    cx + r * 0.60,
    cy - r * 0.55,
    r * 0.04,
    cx - r * 0.1,
    cy + r * 0.1,
    r * 1.05
  );
  sphereGrad.addColorStop(0.0, "#ffffff"); // Needle flare
  sphereGrad.addColorStop(0.12, "#e879f9"); // Magenta corona
  sphereGrad.addColorStop(0.28, "#c084fc"); // Purple twilight
  sphereGrad.addColorStop(0.50, "#1e1b4b"); // Midnight dusk
  sphereGrad.addColorStop(0.75, "#0b0816"); // Eclipse umbra
  sphereGrad.addColorStop(1.0, "#020617"); // Void
  ctx.fillStyle = sphereGrad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  // Lunar crater maria
  ctx.fillStyle = "rgba(30, 27, 75, 0.5)";
  ctx.beginPath();
  ctx.arc(cx - r * 0.25, cy + r * 0.1, r * 0.25, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.1, cy + r * 0.3, r * 0.18, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore(); // end clip

  // Sharp Electric Magenta crescent stroke
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI * 0.45, Math.PI * 0.2);
  ctx.strokeStyle = "#e879f9";
  ctx.lineWidth = Math.max(2.0, r * 0.045);
  ctx.shadowColor = "#d946ef";
  ctx.shadowBlur = Math.max(8, r * 0.15);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawGlacialPlanet(cx, cy, r, alpha) {
  if (alpha <= 0.01 || r < 3) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  // Diamond frost glacial corona / mist halo
  const coronaGrad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.65, cx, cy, r * 1.45);
  coronaGrad.addColorStop(0, "rgba(224, 242, 254, 0.45)"); // Frost white
  coronaGrad.addColorStop(0.4, "rgba(56, 189, 248, 0.20)"); // Electric ice cyan
  coronaGrad.addColorStop(1, "rgba(2, 132, 199, 0)");
  ctx.fillStyle = coronaGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.45, 0, Math.PI * 2);
  ctx.fill();

  // Planet body
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  // Pure Brilliant Arctic White & Glacial Ice Blue sphere
  const sphereGrad = ctx.createRadialGradient(
    cx - r * 0.45,
    cy - r * 0.40,
    r * 0.05,
    cx + r * 0.15,
    cy + r * 0.15,
    r * 1.15
  );
  sphereGrad.addColorStop(0.0, "#ffffff"); // Pure blinding sunlit ice
  sphereGrad.addColorStop(0.18, "#f0f9ff"); // Glacial snow
  sphereGrad.addColorStop(0.38, "#bae6fd"); // Compacted blue ice
  sphereGrad.addColorStop(0.62, "#38bdf8"); // Polar cyan
  sphereGrad.addColorStop(0.82, "#0284c7"); // Deep abyss
  sphereGrad.addColorStop(1.0, "#031525"); // Arctic nightside
  ctx.fillStyle = sphereGrad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  // Crystalline ice shelf sheets
  ctx.fillStyle = "rgba(255, 255, 255, 0.60)";
  ctx.beginPath();
  ctx.arc(cx - r * 0.2, cy - r * 0.15, r * 0.38, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.22, cy + r * 0.2, r * 0.26, 0, Math.PI * 2);
  ctx.fill();

  // Tectonic ice fracture rifts (sharp crystalline cracks)
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = Math.max(1.8, r * 0.032);
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.65, cy - r * 0.2);
  ctx.lineTo(cx - r * 0.3, cy + r * 0.05);
  ctx.lineTo(cx + r * 0.05, cy - r * 0.1);
  ctx.lineTo(cx + r * 0.45, cy + r * 0.25);
  ctx.stroke();

  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = Math.max(1.2, r * 0.022);
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.15, cy - r * 0.55);
  ctx.lineTo(cx + r * 0.1, cy - r * 0.2);
  ctx.lineTo(cx + r * 0.35, cy - r * 0.35);
  ctx.stroke();

  // Subsurface geothermal hydrothermal vents (glowing cyan dots through the ice)
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = Math.max(8, r * 0.15);
  ctx.beginPath();
  ctx.arc(cx - r * 0.25, cy + r * 0.1, r * 0.055, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.15, cy - r * 0.08, r * 0.045, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.3, cy + r * 0.3, r * 0.065, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore(); // end clip

  // Radiant diamond-white crescent rim
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI * 0.68, Math.PI * 1.62);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(2.2, r * 0.045);
  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = Math.max(10, r * 0.18);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawOceanicIcePlanet(cx, cy, r, alpha, ringTilt = 0.95) {
  if (alpha <= 0.01 || r < 3) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  const ringFlatten = 0.22;
  const innerR = r * 1.30;
  const outerR = r * 2.10;

  // 1️⃣ BACK HALF OF VERTICAL CRYSTALLINE ICE RING
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(ringTilt);
  ctx.scale(1, ringFlatten);

  const ringGrad = ctx.createRadialGradient(0, 0, innerR, 0, 0, outerR);
  ringGrad.addColorStop(0.0, "rgba(52, 211, 153, 0)");
  ringGrad.addColorStop(0.3, "rgba(52, 211, 153, 0.45)");
  ringGrad.addColorStop(0.7, "rgba(167, 243, 208, 0.60)");
  ringGrad.addColorStop(1.0, "rgba(52, 211, 153, 0)");

  ctx.beginPath();
  ctx.arc(0, 0, outerR, Math.PI, 2 * Math.PI);
  ctx.arc(0, 0, innerR, 2 * Math.PI, Math.PI, true);
  ctx.closePath();
  ctx.fillStyle = ringGrad;
  ctx.fill();
  ctx.restore();

  // 2️⃣ EMERALD PLANET BODY (100% Vibrant Green & Teal)
  ctx.save();
  const coronaGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.70, cx, cy, r * 1.35);
  coronaGrad.addColorStop(0, "rgba(16, 185, 129, 0.32)");
  coronaGrad.addColorStop(0.5, "rgba(5, 150, 105, 0.12)");
  coronaGrad.addColorStop(1, "rgba(16, 185, 129, 0)");
  ctx.fillStyle = coronaGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  const sphereGrad = ctx.createRadialGradient(
    cx - r * 0.45,
    cy - r * 0.40,
    r * 0.06,
    cx + r * 0.15,
    cy + r * 0.15,
    r * 1.15
  );
  sphereGrad.addColorStop(0.0, "#ecfdf5"); // Mint starlight
  sphereGrad.addColorStop(0.18, "#10b981"); // Vivid emerald ocean
  sphereGrad.addColorStop(0.40, "#047857"); // Deep jade sea
  sphereGrad.addColorStop(0.65, "#064e3b"); // Twilight abyss
  sphereGrad.addColorStop(0.85, "#022c22"); // Nightside
  sphereGrad.addColorStop(1.0, "#03000a");
  ctx.fillStyle = sphereGrad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  // Swirling mint continents
  ctx.fillStyle = "rgba(110, 231, 183, 0.35)";
  ctx.beginPath();
  ctx.arc(cx - r * 0.2, cy - r * 0.1, r * 0.32, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.25, cy + r * 0.15, r * 0.26, 0, Math.PI * 2);
  ctx.fill();

  // Polar Aurora Borealis Crown
  const auroraGrad = ctx.createRadialGradient(cx, cy - r * 0.85, r * 0.05, cx, cy - r * 0.85, r * 0.50);
  auroraGrad.addColorStop(0, "rgba(52, 211, 153, 0.65)");
  auroraGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.30)");
  auroraGrad.addColorStop(1, "rgba(52, 211, 153, 0)");
  ctx.fillStyle = auroraGrad;
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.85, r * 0.50, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore(); // end clip

  // Emerald crescent rim
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI * 0.68, Math.PI * 1.62);
  ctx.strokeStyle = "#34d399";
  ctx.lineWidth = Math.max(2.0, r * 0.04);
  ctx.shadowColor = "#10b981";
  ctx.shadowBlur = Math.max(8, r * 0.14);
  ctx.stroke();
  ctx.restore();

  // 3️⃣ FRONT HALF OF VERTICAL RING
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(ringTilt);
  ctx.scale(1, ringFlatten);

  ctx.beginPath();
  ctx.arc(0, 0, outerR, 0, Math.PI);
  ctx.arc(0, 0, innerR, Math.PI, 0, true);
  ctx.closePath();
  ctx.fillStyle = ringGrad;
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

function drawMagmaPlanet(cx, cy, r, alpha) {
  if (alpha <= 0.01 || r < 3) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  // Intense fiery volcanic solar flare corona
  const coronaGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.70, cx, cy, r * 1.45);
  coronaGrad.addColorStop(0, "rgba(239, 68, 68, 0.40)");
  coronaGrad.addColorStop(0.45, "rgba(245, 158, 11, 0.22)");
  coronaGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
  ctx.fillStyle = coronaGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.45, 0, Math.PI * 2);
  ctx.fill();

  // Planet body
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  // Pitch-black volcanic basalt crust with deep crimson dusk
  const sphereGrad = ctx.createRadialGradient(
    cx - r * 0.45,
    cy - r * 0.40,
    r * 0.05,
    cx + r * 0.15,
    cy + r * 0.15,
    r * 1.15
  );
  sphereGrad.addColorStop(0.0, "#fdba74"); // Hot crust highlight
  sphereGrad.addColorStop(0.18, "#991b1b"); // Molten dark stone
  sphereGrad.addColorStop(0.45, "#450a0a"); // Dark volcanic basalt
  sphereGrad.addColorStop(0.75, "#1c1917"); // Cooled basalt rock
  sphereGrad.addColorStop(1.0, "#0c0a09"); // Pitch-black void
  ctx.fillStyle = sphereGrad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  // 🔥 INCANDESCENT GLOWING MAGMA RIVERS & VOLCANIC FISSURES
  ctx.shadowColor = "#f97316";
  ctx.shadowBlur = Math.max(6, r * 0.14);

  // River 1: Major equatorial rift
  ctx.strokeStyle = "#fef08a";
  ctx.lineWidth = Math.max(2.0, r * 0.038);
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.7, cy - r * 0.1);
  ctx.bezierCurveTo(cx - r * 0.2, cy + r * 0.2, cx + r * 0.1, cy - r * 0.15, cx + r * 0.65, cy + r * 0.35);
  ctx.stroke();

  // River 2: Northern volcanic tributary
  ctx.strokeStyle = "#fb923c";
  ctx.lineWidth = Math.max(1.5, r * 0.028);
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.4, cy - r * 0.6);
  ctx.quadraticCurveTo(cx - r * 0.15, cy - r * 0.25, cx + r * 0.2, cy - r * 0.45);
  ctx.stroke();

  // River 3: Southern rift
  ctx.strokeStyle = "#fef08a";
  ctx.lineWidth = Math.max(1.8, r * 0.032);
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.15, cy + r * 0.15);
  ctx.quadraticCurveTo(cx + r * 0.3, cy + r * 0.4, cx + r * 0.5, cy + r * 0.6);
  ctx.stroke();

  // Glowing volcanic calderas (hotspots)
  ctx.fillStyle = "#ffedd5";
  ctx.shadowColor = "#ef4444";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(cx - r * 0.25, cy + r * 0.08, r * 0.065, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.15, cy - r * 0.12, r * 0.055, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.35, cy + r * 0.25, r * 0.075, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore(); // end clip

  // Fiery incandescent crescent rim
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI * 0.68, Math.PI * 1.62);
  ctx.strokeStyle = "#f97316";
  ctx.lineWidth = Math.max(2.0, r * 0.04);
  ctx.shadowColor = "#ef4444";
  ctx.shadowBlur = Math.max(8, r * 0.15);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function updateAndRenderCelestialBodies(cx, cy, currentSpeed, isWarping) {
  for (let i = 0; i < celestialBodies.length; i++) {
    const obj = celestialBodies[i];

    // Travel forward in 3D space with the starfield (moving towards the viewer)
    obj.z -= currentSpeed * obj.speedFactor;

    // Pure 3D perspective projection
    const k = 260 / obj.z;
    const px = obj.x * k + cx;
    const py = obj.y * k + cy;

    // True perspective size growth as celestial body travels towards you:
    const perspectiveGrowth = Math.pow(Math.max(0.12, k / 0.60), 0.85);
    const r = Math.max(obj.minRadius, Math.min(obj.maxRadius, obj.baseRadius * perspectiveGrowth));

    // If passed camera or traveled past screen margins, respawn in deep cosmos
    if (
      obj.z <= 90 ||
      px < -r * 3 ||
      px > width + r * 3 ||
      py < -r * 3 ||
      py > height + r * 3
    ) {
      respawnCelestial(obj);
      continue;
    }

    // Smooth fade-in from deep cosmic void (1600 down to 1200) & fade-out near camera (260 down to 90)
    let alpha = isWarping ? 0.35 : 1.0;
    if (obj.z > 1200) {
      alpha *= Math.max(0, 1 - (obj.z - 1200) / 400);
    } else if (obj.z < 260) {
      alpha *= Math.max(0, (obj.z - 90) / 170);
    }

    // Edge boundary softness
    const margin = r * 1.2;
    if (px < margin || px > width - margin || py < margin || py > height - margin) {
      const edgeDist = Math.min(px, width - px, py, height - py);
      alpha *= Math.max(0, Math.min(1, edgeDist / margin));
    }

    if (alpha <= 0.01) continue;

    if (obj.type === "gas_giant") {
      drawGasGiant(px, py, r, alpha, obj.rotation);
    } else if (obj.type === "eclipse_moon") {
      drawEclipsePlanet(px, py, r, alpha);
    } else if (obj.type === "glacial_ice") {
      drawGlacialPlanet(px, py, r, alpha);
    } else if (obj.type === "oceanic_ice") {
      drawOceanicIcePlanet(px, py, r, alpha, obj.rotation);
    } else if (obj.type === "magma_world") {
      drawMagmaPlanet(px, py, r, alpha);
    }
  }
}

// ==========================================
// 🚀 DUAL 3D & 2D LIGHT-SPEED SPACESHIP ENGINE
// ==========================================
let lightSpeedShips = [];
let flybyCounter = 0;

function spawnLightSpeedShip(forcedMode = null) {
  flybyCounter++;
  const mode = forcedMode || (flybyCounter % 2 === 1 ? "3D" : "2D");

  if (mode === "3D") {
    // 🌌 3D DEEP-SPACE HYPERSPACE FLYBY: Zooms from deep cosmos towards & past camera
    const startZ = width * 1.5 + 400;
    const angle = Math.random() * Math.PI * 2;
    const offset = 80 + Math.random() * 260;

    lightSpeedShips.push({
      is3D: true,
      x: Math.cos(angle) * offset,
      y: Math.sin(angle) * offset,
      z: startZ,
      vz: -72 - Math.random() * 24, // Blistering light-speed forward velocity
      vx: Math.cos(angle) * (12 + Math.random() * 14),
      vy: Math.sin(angle) * (9 + Math.random() * 12),
    });
  } else {
    // 🌠 2D HORIZON HYPERSPACE FLYBY: Blasts across the screen plane
    const trajectoryMode = Math.floor(Math.random() * 4);
    let startX, startY, angle;
    const speed = 44 + Math.random() * 12; // Light-speed velocity (~2700 - 3500 px/sec)
    const trailLength = 340 + Math.random() * 140;

    if (trajectoryMode === 0) {
      // Left to Right
      startX = -trailLength - 50;
      startY = height * (0.15 + Math.random() * 0.70);
      angle = (Math.random() - 0.5) * 0.35;
    } else if (trajectoryMode === 1) {
      // Top-Left to Bottom-Right
      startX = -trailLength - 50;
      startY = height * (0.05 + Math.random() * 0.35);
      angle = (Math.PI / 6) + (Math.random() - 0.5) * 0.2;
    } else if (trajectoryMode === 2) {
      // Bottom-Left to Top-Right
      startX = -trailLength - 50;
      startY = height * (0.65 + Math.random() * 0.30);
      angle = -(Math.PI / 6) + (Math.random() - 0.5) * 0.2;
    } else {
      // Right to Left
      startX = width + trailLength + 50;
      startY = height * (0.15 + Math.random() * 0.70);
      angle = Math.PI + (Math.random() - 0.5) * 0.35;
    }

    lightSpeedShips.push({
      is3D: false,
      x: startX,
      y: startY,
      speed: speed,
      angle: angle,
      trailLength: trailLength,
      scale: 0.95 + Math.random() * 0.35,
      alpha: 1.0,
    });
  }
}
window.spawnLightSpeedShip = spawnLightSpeedShip;

// First flyby triggered at around 20 seconds as requested!
setTimeout(() => {
  spawnLightSpeedShip();
}, 20000);

// Continues periodically every ~22 to 28 seconds (alternating 3D and 2D)
setInterval(() => {
  if (Math.random() > 0.15) {
    spawnLightSpeedShip();
  }
}, 24000);

function draw3DHyperspaceShip(ship, px, py, scale) {
  ctx.save();
  ctx.translate(px, py);
  ctx.scale(scale, scale);

  const angle = Math.atan2(ship.vy, ship.vx);
  ctx.rotate(angle);

  // 1. Perspective 3D Ion Warp Trail stretching back into deep space
  const trailLen = Math.min(160, 1600 / (ship.z * 0.04 + 10));
  const trailGrad = ctx.createLinearGradient(-trailLen, 0, 0, 0);
  trailGrad.addColorStop(0, "rgba(6, 182, 212, 0)");
  trailGrad.addColorStop(0.4, "rgba(168, 85, 247, 0.45)");
  trailGrad.addColorStop(0.8, "rgba(6, 182, 212, 0.85)");
  trailGrad.addColorStop(1, "rgba(255, 255, 255, 1)");

  ctx.beginPath();
  ctx.moveTo(-trailLen, 0);
  ctx.lineTo(0, 0);
  ctx.strokeStyle = trailGrad;
  ctx.lineWidth = 4;
  ctx.shadowColor = "#00f2fe";
  ctx.shadowBlur = 18;
  ctx.stroke();

  // Twin wingtip vortex trails
  ctx.beginPath();
  ctx.moveTo(-trailLen * 0.75, -12);
  ctx.lineTo(-6, -12);
  ctx.moveTo(-trailLen * 0.75, 12);
  ctx.lineTo(-6, 12);
  ctx.strokeStyle = "rgba(168, 85, 247, 0.7)";
  ctx.lineWidth = 2.2;
  ctx.shadowColor = "#a855f7";
  ctx.shadowBlur = 12;
  ctx.stroke();

  // 2. 3D Delta Ship Body
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.moveTo(24, 0);      // Forward needle nose
  ctx.lineTo(-12, -18);  // Port wingtip
  ctx.lineTo(-6, -5);
  ctx.lineTo(-16, 0);    // Engine housing
  ctx.lineTo(-6, 5);
  ctx.lineTo(-12, 18);   // Starboard wingtip
  ctx.closePath();
  ctx.fill();

  // Cyan Avionics Panel Accents
  ctx.fillStyle = "#0284c7";
  ctx.beginPath();
  ctx.moveTo(12, 0);
  ctx.lineTo(-8, -9);
  ctx.lineTo(-8, 9);
  ctx.closePath();
  ctx.fill();

  // Cockpit Canopy (glowing cyan visor)
  ctx.fillStyle = "#38bdf8";
  ctx.shadowColor = "#00f2fe";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.ellipse(4, 0, 5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Plasma Thruster Blooms
  ctx.fillStyle = "#00f2fe";
  ctx.shadowColor = "#00f2fe";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(-10, -8, 3.2, 0, Math.PI * 2);
  ctx.arc(-10, 8, 3.2, 0, Math.PI * 2);
  ctx.fill();

  // 3. Nose Hyperspace Lens Flare
  ctx.beginPath();
  ctx.arc(24, 0, 5.5, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#00f2fe";
  ctx.shadowBlur = 24;
  ctx.fill();

  // Starburst cross flares
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(40, 0);
  ctx.moveTo(24, -15);
  ctx.lineTo(24, 15);
  ctx.stroke();

  // 4. Expanding Hyperspace Sonic Shockwave Ring when close
  if (ship.z < 700) {
    const ringRadius = (700 - ship.z) * 0.16;
    const ringAlpha = (700 - ship.z) / 700;
    ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha * 0.75})`;
    ctx.lineWidth = 2.4;
    ctx.shadowColor = "#00f2fe";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawLightSpeedShip(ship) {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);
  ctx.scale(ship.scale, ship.scale);
  ctx.globalAlpha = ship.alpha;

  const trailLen = ship.trailLength;

  // 1️⃣ Luminous Hyperspace Warp Trail (stretched photon exhaust)
  const trailGrad = ctx.createLinearGradient(-trailLen, 0, 0, 0);
  trailGrad.addColorStop(0, "rgba(6, 182, 212, 0)");
  trailGrad.addColorStop(0.35, "rgba(168, 85, 247, 0.35)");
  trailGrad.addColorStop(0.75, "rgba(6, 182, 212, 0.85)");
  trailGrad.addColorStop(1, "rgba(255, 255, 255, 1)");

  // Main hyperspace streak
  ctx.beginPath();
  ctx.moveTo(-trailLen, 0);
  ctx.lineTo(0, 0);
  ctx.strokeStyle = trailGrad;
  ctx.lineWidth = 3.8;
  ctx.shadowColor = "#00f2fe";
  ctx.shadowBlur = 16;
  ctx.stroke();

  // Secondary dual ion booster trails
  ctx.beginPath();
  ctx.moveTo(-trailLen * 0.7, -6);
  ctx.lineTo(-4, -6);
  ctx.moveTo(-trailLen * 0.7, 6);
  ctx.lineTo(-4, 6);
  ctx.strokeStyle = "rgba(168, 85, 247, 0.65)";
  ctx.lineWidth = 2.0;
  ctx.shadowColor = "#a855f7";
  ctx.shadowBlur = 10;
  ctx.stroke();

  // 2️⃣ Sleek Interstellar Delta Spaceship Body
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  // Outer Aerodynamic Titanium Hull
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.moveTo(22, 0); // Sharp nose cone
  ctx.lineTo(-14, -8); // Port wingtip
  ctx.lineTo(-10, -2);
  ctx.lineTo(-16, 0); // Rear thruster bay
  ctx.lineTo(-10, 2);
  ctx.lineTo(-14, 8); // Starboard wingtip
  ctx.closePath();
  ctx.fill();

  // Cyan Avionics Panel Accents
  ctx.fillStyle = "#0284c7";
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(-8, -4.5);
  ctx.lineTo(-8, 4.5);
  ctx.closePath();
  ctx.fill();

  // Cockpit Canopy (glowing cyan shield visor)
  ctx.fillStyle = "#38bdf8";
  ctx.shadowColor = "#00f2fe";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.ellipse(4, 0, 4.5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3️⃣ Dual Engine Plasma Thruster Flames
  const flameLen = 16 + Math.random() * 10;
  const flameGrad = ctx.createLinearGradient(-flameLen, 0, 0, 0);
  flameGrad.addColorStop(0, "rgba(0, 242, 254, 0)");
  flameGrad.addColorStop(0.5, "#a855f7");
  flameGrad.addColorStop(1, "#ffffff");

  ctx.strokeStyle = flameGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-16, 0);
  ctx.lineTo(-16 - flameLen, 0);
  ctx.stroke();

  // Booster exhaust nodes
  ctx.fillStyle = "#00f2fe";
  ctx.shadowColor = "#00f2fe";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(-12, -4.5, 2.2, 0, Math.PI * 2);
  ctx.arc(-12, 4.5, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // 4️⃣ Hyperspace Lens Flare / Sonic Shockwave at the Nose
  ctx.beginPath();
  ctx.arc(22, 0, 5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.shadowColor = "#00f2fe";
  ctx.shadowBlur = 22;
  ctx.fill();

  // Cross light-beam spike
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(36, 0);
  ctx.moveTo(22, -12);
  ctx.lineTo(22, 12);
  ctx.stroke();

  ctx.restore();
}

// Starfield Render Loop
function renderSpace() {
  // Smooth ease into warp multiplier
  warpSpeedMultiplier += (targetWarpMultiplier - warpSpeedMultiplier) * 0.08;
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;

  // Background clear with subtle fade trail in warp mode
  if (isWarping) {
    ctx.fillStyle = "rgba(3, 0, 10, 0.35)";
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  const cx = width / 2 + mouseX;
  const cy = height / 2 + mouseY;
  const baseSpeed = isWarping ? 32 : 1.2;
  const currentSpeed = baseSpeed * warpSpeedMultiplier;

  // Update and render traveling 3D celestial planets along with space movement
  updateAndRenderCelestialBodies(cx, cy, currentSpeed, isWarping);

  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    star.prevZ = star.z;
    star.z -= currentSpeed;

    if (star.z <= 0) {
      star.z = width;
      star.prevZ = width;
      star.x = (Math.random() - 0.5) * width * 2;
      star.y = (Math.random() - 0.5) * height * 2;
    }

    const k = 250 / star.z;
    const px = star.x * k + cx;
    const py = star.y * k + cy;

    if (px < -50 || px > width + 50 || py < -50 || py > height + 50) continue;

    const prevK = 250 / star.prevZ;
    const prevPx = star.x * prevK + cx;
    const prevPy = star.y * prevK + cy;

    star.alpha += Math.sin(Date.now() * star.twinkleSpeed) * 0.015;
    const clampedAlpha = Math.max(0.2, Math.min(1, star.alpha));

    if (isWarping || warpSpeedMultiplier > 1.5) {
      // Draw warp streak lines
      ctx.beginPath();
      ctx.moveTo(prevPx, prevPy);
      ctx.lineTo(px, py);
      ctx.lineWidth = Math.min(3, (1 - star.z / width) * 3);
      if (star.hue === 185) {
        ctx.strokeStyle = `rgba(6, 182, 212, ${clampedAlpha})`;
      } else if (star.hue === 270) {
        ctx.strokeStyle = `rgba(168, 85, 247, ${clampedAlpha})`;
      } else {
        ctx.strokeStyle = `rgba(248, 250, 252, ${clampedAlpha})`;
      }
      ctx.stroke();
    } else {
      // Normal star orbs
      const radius = Math.max(0.6, (1 - star.z / width) * star.size * 2);
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);

      if (star.hue === 185) {
        ctx.fillStyle = `rgba(6, 182, 212, ${clampedAlpha})`;
        ctx.shadowColor = "#06b6d4";
        ctx.shadowBlur = radius * 3;
      } else if (star.hue === 270) {
        ctx.fillStyle = `rgba(168, 85, 247, ${clampedAlpha})`;
        ctx.shadowColor = "#a855f7";
        ctx.shadowBlur = radius * 3;
      } else {
        ctx.fillStyle = `rgba(248, 250, 252, ${clampedAlpha})`;
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    }
  }

  // Draw Shooting Meteors
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    m.x += Math.cos(m.angle) * m.speed;
    m.y += Math.sin(m.angle) * m.speed;
    m.alpha -= 0.015;

    if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
      meteors.splice(i, 1);
      continue;
    }

    const tailX = m.x - Math.cos(m.angle) * m.length;
    const tailY = m.y - Math.sin(m.angle) * m.length;

    const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
    grad.addColorStop(0, "rgba(6, 182, 212, 0)");
    grad.addColorStop(0.7, `rgba(124, 58, 237, ${m.alpha * 0.6})`);
    grad.addColorStop(1, `rgba(255, 255, 255, ${m.alpha})`);

    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(m.x, m.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Meteor head glow
    ctx.beginPath();
    ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
    ctx.shadowColor = "#00eaff";
    ctx.shadowBlur = 10;
    ctx.fill();
  }

  // Draw Light-Speed Spaceship / Rocket Flyby (BOTH 3D & 2D)
  for (let i = lightSpeedShips.length - 1; i >= 0; i--) {
    const ship = lightSpeedShips[i];

    if (ship.is3D) {
      // 🌌 3D Motion (zooming from deep space toward and past camera)
      ship.z += ship.vz;
      ship.x += ship.vx;
      ship.y += ship.vy;

      if (ship.z <= 15) {
        // Rocket has roared past camera into foreground
        lightSpeedShips.splice(i, 1);
        continue;
      }

      const k = 260 / Math.max(18, ship.z);
      const px = ship.x * k + cx;
      const py = ship.y * k + cy;
      const scale = Math.max(0.08, Math.min(6.5, 42 / Math.max(8, ship.z * 0.05)));

      draw3DHyperspaceShip(ship, px, py, scale);
    } else {
      // 🌠 2D Motion (cutting across screen plane)
      ship.x += Math.cos(ship.angle) * ship.speed;
      ship.y += Math.sin(ship.angle) * ship.speed;

      drawLightSpeedShip(ship);

      const maxBound = ship.trailLength + 250;
      if (
        ship.x < -maxBound ||
        ship.x > width + maxBound ||
        ship.y < -maxBound ||
        ship.y > height + maxBound
      ) {
        lightSpeedShips.splice(i, 1);
      }
    }
  }

  requestAnimationFrame(renderSpace);
}
renderSpace();

// Warp Speed Button Controller
const warpBtn = document.getElementById("warp-btn");
if (warpBtn) {
  warpBtn.addEventListener("click", () => {
    isWarping = !isWarping;
    targetWarpMultiplier = isWarping ? 2.5 : 1;
    warpBtn.classList.toggle("warping", isWarping);

    // Launch BOTH 3D and 2D light-speed ships when hyperdrive is engaged!
    if (isWarping) {
      spawnLightSpeedShip("3D");
      setTimeout(() => spawnLightSpeedShip("2D"), 350);
    }

    const btnText = warpBtn.querySelector(".warp-btn-text");
    const icon = warpBtn.querySelector("i");

    if (isWarping) {
      if (btnText) btnText.textContent = "HYPERDRIVE ACTIVE";
      if (icon) icon.className = "fas fa-fire fa-beat";
    } else {
      if (btnText) btnText.textContent = "WARP DRIVE";
      if (icon) icon.className = "fas fa-meteor";
    }
  });
}

// ==========================================
// 2️⃣ REUSABLE HORIZONTAL CAROUSEL CONTROLLER
// ==========================================
function setupHorizontalScroll(
  wrapperSelector,
  scrollContainerSelector,
  leftBtnSelector,
  rightBtnSelector,
  scrollStep = 380
) {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) return;

  const scrollContainer = wrapper.querySelector(scrollContainerSelector);
  const leftBtn = wrapper.querySelector(leftBtnSelector);
  const rightBtn = wrapper.querySelector(rightBtnSelector);

  if (!scrollContainer || !leftBtn || !rightBtn) return;

  leftBtn.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: -scrollStep, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: scrollStep, behavior: "smooth" });
  });
}

// ==========================================
// 3️⃣ DEEP SPACE EXPEDITIONS (PROJECTS)
// ==========================================
function getProjectMockupHtml(project) {
  if (project.type === "ecommerce") {
    return `
      <div class="mockup-screen mockup-ecommerce">
        <div class="mock-browser-header">
          <span class="mock-browser-brand"><i class="fas fa-shopping-bag"></i> TheStore // MERN</span>
          <span class="mock-browser-badge"><i class="fas fa-cart-arrow-down"></i> 02 ITEMS</span>
        </div>
        <div class="mock-shop-grid">
          <div class="mock-product-pod">
            <div class="pod-icon"><i class="fas fa-headphones"></i></div>
            <div class="pod-text">
              <span class="pod-title">Spatial Audio Pro</span>
              <span class="pod-price">$189.00</span>
            </div>
            <span class="pod-status in-cart"><i class="fas fa-check"></i> Added</span>
          </div>
          <div class="mock-product-pod">
            <div class="pod-icon"><i class="fas fa-stopwatch-20"></i></div>
            <div class="pod-text">
              <span class="pod-title">Chronos Watch</span>
              <span class="pod-price">$249.00</span>
            </div>
            <span class="pod-status"><i class="fas fa-plus"></i> Cart</span>
          </div>
        </div>
        <div class="mock-telemetry-status">
          <span class="status-pulse-dot"></span>
          <span>CATALOG SYNCED // AUTH VERIFIED</span>
        </div>
      </div>`;
  } else if (project.type === "game") {
    return `
      <div class="mockup-screen mockup-game">
        <div class="mock-game-hud">
          <span class="hud-item"><i class="fas fa-stopwatch"></i> 00:18s</span>
          <span class="hud-item mode"><i class="fas fa-gamepad"></i> 8 PAIRS</span>
          <span class="hud-item"><i class="fas fa-bullseye"></i> 06 MOVES</span>
        </div>
        <div class="mock-game-matrix">
          <div class="matrix-card matched"><i class="fas fa-brain"></i></div>
          <div class="matrix-card matched"><i class="fas fa-brain"></i></div>
          <div class="matrix-card active"><i class="fas fa-rocket"></i></div>
          <div class="matrix-card face-down"><i class="fas fa-satellite"></i></div>
          <div class="matrix-card face-down"><i class="fas fa-atom"></i></div>
          <div class="matrix-card matched"><i class="fas fa-bolt"></i></div>
          <div class="matrix-card matched"><i class="fas fa-bolt"></i></div>
          <div class="matrix-card face-down"><i class="fas fa-gem"></i></div>
        </div>
        <div class="mock-telemetry-status">
          <span class="status-pulse-dot"></span>
          <span>NEURAL LOGIC // REALTIME FLIP STATE</span>
        </div>
      </div>`;
  } else if (project.type === "analytics" || project.type === "ml") {
    return `
      <div class="mockup-screen mockup-analytics">
        <div class="mock-analytics-header">
          <span class="analytics-portal-brand"><i class="fas fa-chart-line"></i> OmniAnalytics // ML</span>
          <span class="analytics-ml-badge"><i class="fas fa-brain"></i> SCIKIT-LEARN</span>
        </div>
        <div class="mock-analytics-bars">
          <div class="mock-bar" style="height: 45%;"></div>
          <div class="mock-bar" style="height: 75%;"></div>
          <div class="mock-bar" style="height: 55%;"></div>
          <div class="mock-bar" style="height: 95%;"></div>
          <div class="mock-bar" style="height: 80%;"></div>
          <div class="mock-bar" style="height: 100%;"></div>
          <div class="mock-bar" style="height: 65%;"></div>
        </div>
        <div class="mock-analytics-chips">
          <span class="h-chip"><i class="fas fa-database"></i> 99.4K Records</span>
          <span class="h-chip"><i class="fas fa-bolt"></i> &lt;100ms Cache</span>
          <span class="h-chip active"><i class="fas fa-robot"></i> Delay Risk ML</span>
        </div>
      </div>`;
  } else {
    return `
      <div class="mockup-screen mockup-health">
        <div class="mock-health-header">
          <span class="health-portal-brand"><i class="fas fa-heartbeat"></i> 2Care Health Vault</span>
          <span class="health-enc-badge"><i class="fas fa-shield-alt"></i> ENCRYPTED</span>
        </div>
        <div class="mock-ecg-monitor">
          <svg class="ecg-line-svg" viewBox="0 0 240 36" preserveAspectRatio="none">
            <path d="M0,18 L35,18 L42,6 L50,30 L56,4 L64,32 L70,18 L120,18 L127,6 L135,30 L141,4 L149,32 L155,18 L240,18" />
          </svg>
          <div class="ecg-telemetry-value">
            <span class="rate-num">72</span>
            <span class="rate-unit">BPM</span>
          </div>
        </div>
        <div class="mock-health-chips">
          <span class="h-chip"><i class="fas fa-file-medical"></i> 14 Records</span>
          <span class="h-chip"><i class="fas fa-user-shield"></i> Biometrics</span>
          <span class="h-chip active"><i class="fas fa-check-circle"></i> Local Vault</span>
        </div>
      </div>`;
  }
}

const projectsContainer = document.querySelector(".projects-scroll");
if (projectsContainer) {
  projectsContainer.innerHTML = projects
    .map(
      (project) => `
      <div class="project-card theme-${project.themeColor || "cyan"}">
        <div class="card-glow-overlay"></div>
        <div class="observatory-bar">
          <div class="observatory-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          <div class="observatory-url-bar">
            <i class="fas fa-lock"></i>
            <span>${project.urlDisplay || "mission.vercel.app"}</span>
          </div>
          <div class="mission-callout">${project.missionId || "EXPEDITION"}</div>
        </div>
        
        <a href="${project.demoLink}" target="_blank" rel="noopener noreferrer" class="project-preview-wrap" title="Launch ${project.name} Live">
          ${getProjectMockupHtml(project)}
          <div class="preview-hover-curtain">
            <span class="curtain-btn">
              <span>Launch Mission</span>
              <i class="fas fa-external-link-alt"></i>
            </span>
          </div>
        </a>

        <div class="project-content">
          <div class="project-header">
            <h3>${project.name}</h3>
            ${project.tagline ? `<span class="project-tagline">${project.tagline}</span>` : ""}
          </div>
          <p class="project-desc">${project.description}</p>
          
          ${
            project.tags
              ? `<div class="project-tags">${project.tags
                  .map((tag) => `<span class="project-tag">${tag}</span>`)
                  .join("")}</div>`
              : ""
          }

          <div class="project-buttons">
            <a href="${project.codeLink}" class="btn-card primary" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-github"></i>
              <span>Codebase</span>
            </a>
            <a href="${project.demoLink}" class="btn-card secondary" target="_blank" rel="noopener noreferrer">
              <i class="fas fa-rocket"></i>
              <span>Launch Demo</span>
            </a>
          </div>
        </div>
      </div>`
    )
    .join("");
}

setupHorizontalScroll(
  ".projects-wrapper",
  ".projects-scroll",
  "#projects-left-btn",
  "#projects-right-btn",
  380
);

// ==========================================
// 4️⃣ FLIGHT CREDENTIALS (CERTIFICATES) & LIGHTBOX MODAL
// ==========================================
const certContainer = document.getElementById("certificates-container");
const certModal = document.getElementById("cert-lightbox-modal");
const modalBackdrop = document.getElementById("cert-modal-backdrop");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalPrevBtn = document.getElementById("modal-prev-btn");
const modalNextBtn = document.getElementById("modal-next-btn");
const modalCertTitle = document.getElementById("modal-cert-title");
const modalCertImg = document.getElementById("modal-cert-img");
const modalCertIssuer = document.getElementById("modal-cert-issuer");
const modalCertDomain = document.getElementById("modal-cert-domain");
const modalCounterBadge = document.getElementById("modal-counter-badge");
const modalExternalLink = document.getElementById("modal-external-link");

let currentModalIndex = 0;

function renderModalCert(idx) {
  if (!certificates || !certificates.length) return;
  currentModalIndex = (idx + certificates.length) % certificates.length;
  const cert = certificates[currentModalIndex];

  if (modalCertTitle) modalCertTitle.textContent = cert.title;
  if (modalCertImg) {
    modalCertImg.src = cert.img;
    modalCertImg.alt = `${cert.title} Certificate Document`;
  }
  if (modalCertIssuer) {
    modalCertIssuer.innerHTML = `<i class="fas fa-shield-alt"></i> ${cert.issuer || "NxtWave • NASSCOM Accredited"}`;
  }
  if (modalCertDomain) {
    modalCertDomain.textContent = cert.domain || "ACCREDITED";
  }
  if (modalCounterBadge) {
    modalCounterBadge.textContent = `${String(currentModalIndex + 1).padStart(2, "0")} / ${String(certificates.length).padStart(2, "0")}`;
  }
  if (modalExternalLink) {
    modalExternalLink.href = cert.img;
  }
}

function openCertModal(idx) {
  if (!certModal) return;
  renderModalCert(idx);
  certModal.classList.add("active");
  certModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeCertModal() {
  if (!certModal) return;
  certModal.classList.remove("active");
  certModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeCertModal);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeCertModal);
if (modalPrevBtn) modalPrevBtn.addEventListener("click", () => renderModalCert(currentModalIndex - 1));
if (modalNextBtn) modalNextBtn.addEventListener("click", () => renderModalCert(currentModalIndex + 1));

document.addEventListener("keydown", (e) => {
  if (!certModal || !certModal.classList.contains("active")) return;
  if (e.key === "Escape") {
    closeCertModal();
  } else if (e.key === "ArrowLeft") {
    renderModalCert(currentModalIndex - 1);
  } else if (e.key === "ArrowRight") {
    renderModalCert(currentModalIndex + 1);
  }
});

if (certContainer) {
  certContainer.innerHTML = "";
  certificates.forEach((cert, idx) => {
    const card = document.createElement("div");
    card.classList.add("certificate-card");
    const certNum = String(idx + 1).padStart(2, "0");

    card.innerHTML = `
      <div class="card-corner-bracket corner-tl"></div>
      <div class="card-corner-bracket corner-tr"></div>
      <div class="card-corner-bracket corner-bl"></div>
      <div class="card-corner-bracket corner-br"></div>
      <div class="cert-glow"></div>

      <!-- Cybernetic Cockpit Header Bar (No overlapping over certificate document) -->
      <div class="cert-card-header">
        <div class="cert-card-id-wrap">
          <span class="cert-num">#${certNum}</span>
          <span class="cert-domain">${cert.domain || "ACCREDITED"}</span>
        </div>
        <div class="cert-status-badge">
          <span class="cert-pulse-dot"></span>
          <i class="fas fa-check-circle"></i>
          <span>VERIFIED</span>
        </div>
      </div>

      <!-- High-Tech Matting Frame & Certificate Document -->
      <div class="cert-preview-frame">
        <img src="${cert.img}" alt="${cert.title} Certificate" loading="lazy" />
        <div class="cert-scanline"></div>
        <div class="cert-inspect-overlay">
          <span class="inspect-pill">
            <i class="fas fa-search-plus"></i>
            <span>INSPECT CREDENTIAL</span>
          </span>
        </div>
      </div>

      <!-- Clean 2-Line Footer with Metadata & Actions -->
      <div class="cert-card-footer">
        <div class="cert-title-wrap">
          <h4 class="cert-title" title="${cert.title}">${cert.title}</h4>
          <span class="cert-issuer-label">
            <i class="fas fa-award"></i>
            <span>${cert.issuer || "NxtWave • NASSCOM Accredited"}</span>
          </span>
        </div>
        <div class="cert-actions">
          <button class="cert-action-btn inspect-trigger-btn" title="Inspect Fullscreen Lightbox" aria-label="Inspect ${cert.title}">
            <i class="fas fa-expand-alt"></i>
          </button>
          <a href="${cert.img}" target="_blank" rel="noopener noreferrer" class="cert-action-btn link-trigger-btn" title="Open Cloudinary Original" aria-label="Open original image in new tab">
            <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>`;

    // Click anywhere on card (except direct external link) opens fullscreen modal
    card.addEventListener("click", (e) => {
      if (e.target.closest(".link-trigger-btn")) {
        return;
      }
      openCertModal(idx);
    });

    certContainer.appendChild(card);
  });

  // Track scroll position to update progress bar and dock counter
  const progressFill = document.getElementById("cert-progress-fill");
  const dockCounter = document.getElementById("cert-counter-current");
  const cardStep = 376; // 350px card + 26px gap

  certContainer.addEventListener("scroll", () => {
    const maxScroll = certContainer.scrollWidth - certContainer.clientWidth;
    if (maxScroll > 0) {
      const scrollPct = certContainer.scrollLeft / maxScroll;
      if (progressFill) {
        progressFill.style.width = `${Math.min(100, Math.max(10, scrollPct * 100))}%`;
      }
      if (dockCounter) {
        const activeCard = Math.min(
          certificates.length,
          Math.max(1, Math.round(certContainer.scrollLeft / cardStep) + 1)
        );
        dockCounter.textContent = String(activeCard).padStart(2, "0");
      }
    }
  }, { passive: true });
}

// Reusable scroll setup for Rocket Carousel Buttons
setupHorizontalScroll(
  ".certificates-wrapper",
  "#certificates-container",
  "#certificates-left-btn",
  "#certificates-right-btn",
  380
);

// Cockpit Dock Navigation Buttons
const dockPrev = document.getElementById("cert-dock-prev");
const dockNext = document.getElementById("cert-dock-next");
if (dockPrev && certContainer) {
  dockPrev.addEventListener("click", () => {
    certContainer.scrollBy({ left: -380, behavior: "smooth" });
  });
}
if (dockNext && certContainer) {
  dockNext.addEventListener("click", () => {
    certContainer.scrollBy({ left: 380, behavior: "smooth" });
  });
}

// ==========================================
// 5️⃣ AVIONICS & CAPABILITIES (SKILLS)
// ==========================================
const skillsContainer = document.querySelector(".skills-main-container");
if (skillsContainer) {
  skillsContainer.innerHTML = skills
    .map(
      (cat) => `
      <div class="skills-category-container theme-${cat.themeColor}">
        <div class="card-corner-bracket corner-tl"></div>
        <div class="card-corner-bracket corner-tr"></div>
        <div class="card-corner-bracket corner-bl"></div>
        <div class="card-corner-bracket corner-br"></div>
        <div class="card-top-accent"></div>

        <div class="category-header">
          <div class="header-main-info">
            <span class="category-code">${cat.systemId}</span>
            <h3>${cat.category}</h3>
            <span class="category-subtag">// ${cat.subtag}</span>
          </div>
          <div class="category-icon-orb">
            ${cat.icon}
          </div>
        </div>

        <div class="category-telemetry-strip">
          <span class="telemetry-pill-mini">
            <span class="status-pulse-dot"></span>
            <span>SYSTEM ONLINE</span>
          </span>
          <span class="telemetry-count">${cat.items.length} MODULES READY</span>
        </div>

        <div class="skills-grid">
          ${cat.items
            .map(
              (item) => `
              <div class="skill-card" style="--brand-color: ${item.brandColor}">
                <div class="skill-icon-wrap" style="color: ${item.brandColor}">
                  ${item.icon}
                </div>
                <div class="skill-info">
                  <span class="skill-name">${item.name}</span>
                  <span class="skill-level">${item.level}</span>
                </div>
                <div class="skill-signal-indicator">
                  <span class="signal-bar"></span>
                  <span class="signal-bar"></span>
                  <span class="signal-bar"></span>
                </div>
              </div>`
            )
            .join("")}
        </div>
      </div>`
    )
    .join("");
}

// ==========================================
// 6️⃣ COCKPIT NAVIGATION & MOBILE DRAWER
// ==========================================
const mobileToggle = document.getElementById("mobile-nav-toggle");
const navLinks = document.getElementById("nav-links");

if (mobileToggle && navLinks) {
  mobileToggle.addEventListener("click", () => {
    const isActive = navLinks.classList.toggle("active");
    mobileToggle.setAttribute("aria-expanded", String(isActive));
    const icon = mobileToggle.querySelector("i");
    if (icon) {
      icon.className = isActive ? "fas fa-times" : "fas fa-bars";
    }
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      mobileToggle.setAttribute("aria-expanded", "false");
      const icon = mobileToggle.querySelector("i");
      if (icon) icon.className = "fas fa-bars";
    });
  });
}

// Navbar Active Scrollspy
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener(
  "scroll",
  () => {
    let currentId = "home";
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${currentId}`) {
        item.classList.add("active");
      }
    });
  },
  { passive: true }
);

// ==========================================
// 7️⃣ FULL-HEIGHT EDGE ROCKET SCROLLBAR
// ==========================================
const rocketScrollbar = document.getElementById("rocket-scrollbar");
const rocketTrack = document.getElementById("rocket-track");
const rocketThumb = document.getElementById("rocket-thumb");
const trackTrail = document.getElementById("track-trail");
const telemetryTag = document.getElementById("rocket-telemetry-tag");
const tagPercent = telemetryTag?.querySelector(".tag-percent");
const tagSector = telemetryTag?.querySelector(".tag-sector");

let isDraggingRocket = false;
let isRocketLaunching = false;
let rocketScrollTimeout = null;

const SECTOR_RANGES = [
  { max: 0.15, name: "HOME" },
  { max: 0.35, name: "DOSSIER" },
  { max: 0.55, name: "AVIONICS" },
  { max: 0.75, name: "EXPEDITIONS" },
  { max: 0.90, name: "CREDENTIALS" },
  { max: 1.00, name: "UPLINK" },
];

function updateRocketScrollbar() {
  if (isDraggingRocket || isRocketLaunching || !rocketThumb) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollRatio = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

  const viewportHeight = window.innerHeight;
  const rocketHeight = 44;
  const maxTravel = viewportHeight - rocketHeight - 20;
  const rocketY = 10 + scrollRatio * maxTravel;

  // Move rocket along the right edge
  rocketThumb.style.transform = `translateY(${rocketY}px)`;

  // Update glowing trail behind the rocket
  if (trackTrail) {
    trackTrail.style.height = `${rocketY + 20}px`;
  }

  // Update Telemetry Tag
  const percentInt = Math.round(scrollRatio * 100);
  if (tagPercent) tagPercent.textContent = `${percentInt}%`;

  if (tagSector) {
    const currentSector = SECTOR_RANGES.find((s) => scrollRatio <= s.max) || SECTOR_RANGES[SECTOR_RANGES.length - 1];
    tagSector.textContent = currentSector.name;
  }

  // Active thruster flame while scrolling
  rocketThumb.classList.add("is-scrolling");
  clearTimeout(rocketScrollTimeout);
  rocketScrollTimeout = setTimeout(() => {
    rocketThumb.classList.remove("is-scrolling");
  }, 280);
}

window.addEventListener("scroll", updateRocketScrollbar, { passive: true });
window.addEventListener("resize", updateRocketScrollbar);
updateRocketScrollbar();

// Click track to jump directly to that sector
if (rocketTrack) {
  rocketTrack.addEventListener("click", (e) => {
    if (e.target.closest("#rocket-thumb")) return; // Don't trigger if clicking rocket
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const clickRatio = Math.min(1, Math.max(0, e.clientY / window.innerHeight));
    window.scrollTo({
      top: clickRatio * docHeight,
      behavior: "smooth",
    });
  });
}

// Drag rocket thumb to scroll
if (rocketThumb) {
  let dragStartY = 0;
  let dragStartScroll = 0;
  let hasMoved = false;

  rocketThumb.addEventListener("mousedown", (e) => {
    isDraggingRocket = true;
    hasMoved = false;
    dragStartY = e.clientY;
    dragStartScroll = window.scrollY || document.documentElement.scrollTop;
    document.body.style.userSelect = "none";
    rocketThumb.classList.add("is-scrolling");
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDraggingRocket) return;
    hasMoved = true;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const viewportHeight = window.innerHeight;
    const rocketHeight = 44;
    const maxTravel = viewportHeight - rocketHeight - 20;

    const targetY = Math.min(maxTravel, Math.max(0, e.clientY - rocketHeight / 2));
    const targetRatio = targetY / maxTravel;

    window.scrollTo(0, targetRatio * docHeight);

    rocketThumb.style.transform = `translateY(${10 + targetY}px)`;
    if (trackTrail) trackTrail.style.height = `${10 + targetY + 20}px`;

    const percentInt = Math.round(targetRatio * 100);
    if (tagPercent) tagPercent.textContent = `${percentInt}%`;
    if (tagSector) {
      const currentSector = SECTOR_RANGES.find((s) => targetRatio <= s.max) || SECTOR_RANGES[SECTOR_RANGES.length - 1];
      tagSector.textContent = currentSector.name;
    }
  });

  window.addEventListener("mouseup", () => {
    if (!isDraggingRocket) return;
    isDraggingRocket = false;
    document.body.style.userSelect = "";
    setTimeout(() => rocketThumb.classList.remove("is-scrolling"), 200);
  });

  // Click rocket to blast-off to orbit (return to top)
  rocketThumb.addEventListener("click", () => {
    if (hasMoved || isRocketLaunching) return;
    isRocketLaunching = true;
    rocketThumb.classList.add("launching");

    if (tagSector) tagSector.textContent = "LAUNCHING";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setTimeout(() => {
      rocketThumb.classList.remove("launching");
      isRocketLaunching = false;
      updateRocketScrollbar();
    }, 1100);
  });
}

// ==========================================
// 8️⃣ PLANETS PARALLAX & COSMIC ORBITS
// ==========================================
const planets = document.querySelectorAll(".planet");
function updatePlanetsParallax() {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  planets.forEach((planet) => {
    const speed = parseFloat(planet.getAttribute("data-parallax")) || 0.04;
    const yOffset = scrollY * speed;
    const xOffset = mouseX * speed * 1.5;
    planet.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
  });
}

window.addEventListener("scroll", updatePlanetsParallax, { passive: true });

// ==========================================
// 9️⃣ SUBSPACE UPLINK & COCKPIT FOOTER CONTROLLER
// ==========================================

// 1. Live Mission Clock (IST / Asia-Kolkata)
const missionClock = document.getElementById("mission-clock");
function updateMissionClock() {
  if (!missionClock) return;
  try {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    missionClock.textContent = `${timeStr} IST`;
  } catch (err) {
    const d = new Date();
    missionClock.textContent = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")} IST`;
  }
}
updateMissionClock();
setInterval(updateMissionClock, 1000);

// 2. One-Click Copy-to-Clipboard Buttons
const copyButtons = document.querySelectorAll(".contact-copy-btn");
copyButtons.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const textToCopy = btn.getAttribute("data-copy");
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      const originalHTML = btn.innerHTML;
      btn.classList.add("copied");
      btn.innerHTML = `<i class="fas fa-check"></i> <span class="btn-text">COPIED!</span>`;

      setTimeout(() => {
        btn.classList.remove("copied");
        btn.innerHTML = originalHTML;
      }, 2200);
    } catch (err) {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      const originalHTML = btn.innerHTML;
      btn.classList.add("copied");
      btn.innerHTML = `<i class="fas fa-check"></i> <span class="btn-text">COPIED!</span>`;
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.innerHTML = originalHTML;
      }, 2200);
    }
  });
});

// 3. Subspace Transmission Form (Interactive Direct Dispatch)
const transmissionForm = document.getElementById("transmission-form");
const transmissionStatus = document.getElementById("transmission-status-msg");
const transmitBtn = document.getElementById("transmit-btn");

if (transmissionForm) {
  transmissionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const senderName = document.getElementById("comm-sender-name")?.value.trim() || "";
    const senderEmail = document.getElementById("comm-sender-email")?.value.trim() || "";
    const message = document.getElementById("comm-message")?.value.trim() || "";

    if (!senderName || !senderEmail || !message) {
      if (transmissionStatus) {
        transmissionStatus.innerHTML = `<span class="status-error"><i class="fas fa-exclamation-triangle"></i> Complete all required fields.</span>`;
      }
      return;
    }

    if (transmitBtn) {
      transmitBtn.classList.add("transmitting");
      transmitBtn.innerHTML = `<i class="fas fa-satellite-dish fa-spin"></i> <span>ENCRYPTING &amp; DISPATCHING...</span>`;
    }

    if (transmissionStatus) {
      transmissionStatus.innerHTML = `<span class="status-success"><i class="fas fa-check-circle"></i> TRANSMISSION DISPATCHED // OPENING COMMS LINK...</span>`;
    }

    // Prepare direct mailto
    const subject = encodeURIComponent(`Mission Proposal / Transmission from ${senderName}`);
    const body = encodeURIComponent(
      `Hello Sri Ram Harshit,\n\n${message}\n\n---\nCallsign: ${senderName}\nReturn Frequency: ${senderEmail}\nDispatched via Celestial Portfolio Subspace Uplink`
    );
    const mailtoUri = `mailto:sriramharshit4859@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      window.location.href = mailtoUri;
      if (transmitBtn) {
        transmitBtn.classList.remove("transmitting");
        transmitBtn.innerHTML = `<span class="btn-glow"></span><i class="fas fa-check"></i> <span>TRANSMISSION SENT</span>`;
        setTimeout(() => {
          transmitBtn.innerHTML = `<span class="btn-glow"></span><i class="fas fa-paper-plane"></i> <span>TRANSMIT DISPATCH TO ORBIT</span>`;
        }, 3500);
      }
    }, 800);
  });
}

// 4. Blast Off To Top Button (Footer)
const blastOffBtn = document.getElementById("blast-off-btn");
if (blastOffBtn) {
  blastOffBtn.addEventListener("click", () => {
    blastOffBtn.classList.add("launching");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      blastOffBtn.classList.remove("launching");
    }, 1200);
  });
}

// ==========================================
// 🔟 FLIGHT DOSSIER (RESUME) MODAL CONTROLLER
// ==========================================
const dossierModal = document.getElementById("dossier-viewer-modal");
const dossierBackdrop = document.getElementById("dossier-modal-backdrop");
const dossierCloseBtn = document.getElementById("dossier-close-btn");
const dossierPrintBtn = document.getElementById("dossier-print-btn");
const heroDossierBtn = document.getElementById("hero-dossier-btn");
const dossierPreviewBtn = document.getElementById("dossier-preview-btn");

function openDossierModal() {
  if (!dossierModal) return;
  dossierModal.classList.add("active");
  dossierModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  const scrollArea = document.getElementById("dossier-printable-area");
  if (scrollArea) {
    scrollArea.scrollTop = 0;
    setTimeout(() => scrollArea.focus(), 100);
  }
}

function closeDossierModal() {
  if (!dossierModal) return;
  dossierModal.classList.remove("active");
  dossierModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

if (heroDossierBtn) heroDossierBtn.addEventListener("click", openDossierModal);
if (dossierPreviewBtn) dossierPreviewBtn.addEventListener("click", openDossierModal);
if (dossierCloseBtn) dossierCloseBtn.addEventListener("click", closeDossierModal);
if (dossierBackdrop) dossierBackdrop.addEventListener("click", closeDossierModal);
if (dossierPrintBtn) {
  dossierPrintBtn.addEventListener("click", () => {
    window.print();
  });
}

// ==========================================
// 1️⃣1️⃣ COSMIC DEVELOPER CLI TERMINAL CONTROLLER
// ==========================================
const cliModal = document.getElementById("cosmic-cli-modal");
const cliBackdrop = document.getElementById("terminal-modal-backdrop");
const cliLauncher = document.getElementById("terminal-launcher-btn");
const cliCloseBtn = document.getElementById("terminal-close-btn");
const cliMinBtn = document.getElementById("terminal-min-btn");
const cliMaxBtn = document.getElementById("terminal-max-btn");
const cliInput = document.getElementById("terminal-cli-input");
const cliHistory = document.getElementById("terminal-history");
const cliScreen = document.getElementById("terminal-screen");
const quickCmdBtns = document.querySelectorAll(".quick-cmd-btn");

let commandHistory = [];
let historyIndex = -1;

function openTerminal() {
  if (!cliModal) return;
  cliModal.classList.add("active");
  cliModal.setAttribute("aria-hidden", "false");
  if (cliInput) {
    setTimeout(() => cliInput.focus(), 150);
  }
}

function closeTerminal() {
  if (!cliModal) return;
  cliModal.classList.remove("active");
  cliModal.setAttribute("aria-hidden", "true");
}

function toggleTerminal() {
  if (cliModal && cliModal.classList.contains("active")) {
    closeTerminal();
  } else {
    openTerminal();
  }
}

if (cliLauncher) cliLauncher.addEventListener("click", toggleTerminal);
if (cliCloseBtn) cliCloseBtn.addEventListener("click", closeTerminal);
if (cliMinBtn) cliMinBtn.addEventListener("click", closeTerminal);
if (cliBackdrop) cliBackdrop.addEventListener("click", closeTerminal);
if (cliMaxBtn) {
  cliMaxBtn.addEventListener("click", () => {
    const frame = cliModal?.querySelector(".terminal-frame");
    if (frame) frame.classList.toggle("fullscreen");
  });
}

// Global hotkeys: Backtick `~` or Ctrl+K opens terminal; Esc closes active modals
document.addEventListener("keydown", (e) => {
  const targetTag = e.target.tagName.toLowerCase();
  const isTypingInField = targetTag === "input" || targetTag === "textarea";

  if ((e.key === "`" && !isTypingInField) || (e.ctrlKey && e.key.toLowerCase() === "k")) {
    e.preventDefault();
    toggleTerminal();
    return;
  }

  if (e.key === "Escape") {
    if (cliModal && cliModal.classList.contains("active")) {
      closeTerminal();
    } else if (dossierModal && dossierModal.classList.contains("active")) {
      closeDossierModal();
    }
  }
});

function appendToTerminalHistory(cmd, outputHtml) {
  if (!cliHistory) return;
  const entry = document.createElement("div");
  entry.classList.add("history-entry");
  entry.innerHTML = `
    <div class="history-prompt-line">
      <span class="terminal-prompt">sriram@orbit:~$</span>
      <span class="history-cmd">${escapeHtml(cmd)}</span>
    </div>
    <div class="history-output">${outputHtml}</div>
  `;
  cliHistory.appendChild(entry);
  if (cliScreen) {
    cliScreen.scrollTop = cliScreen.scrollHeight;
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function processCommand(rawCmd) {
  const cmd = rawCmd.trim().toLowerCase();
  if (!cmd) return;

  commandHistory.push(rawCmd);
  historyIndex = commandHistory.length;

  let response = "";

  switch (cmd) {
    case "help":
      response = `
        <div class="term-help-grid">
          <div><span class="cmd-name">help</span> &bull; Display all flight commands</div>
          <div><span class="cmd-name">trajectory</span> &bull; Career milestones & flight timeline</div>
          <div><span class="cmd-name">skills</span> &bull; Output avionics & technical capabilities</div>
          <div><span class="cmd-name">projects</span> &bull; Inspect deep space expeditions</div>
          <div><span class="cmd-name">certs</span> &bull; List 10 verified flight credentials</div>
          <div><span class="cmd-name">about</span> &bull; Astronaut mission directives & bio</div>
          <div><span class="cmd-name">contact</span> &bull; Communication channels & coordinates</div>
          <div><span class="cmd-name">date</span> &bull; Show current mission orbital clock</div>
          <div><span class="cmd-name">sudo hire</span> &bull; Authorize engineering recruitment protocol</div>
          <div><span class="cmd-name">clear</span> &bull; Wipe terminal output screen</div>
          <div><span class="cmd-name">exit</span> &bull; Disconnect and close terminal drawer</div>
        </div>`;
      break;

    case "trajectory":
    case "timeline":
    case "experience":
      response = `
        <div class="term-box">
          <div class="term-box-title">🛰️ MISSION TRAJECTORY // FLIGHT LOG</div>
          <div>1. <strong>2026 &mdash; Ongoing:</strong> Software Engineer Intern &bull; <strong>Edvak EHR</strong> (EHR systems & full-stack development)</div>
          <div>2. <strong>2023 &mdash; Ongoing:</strong> Full-Stack Development Trainee &bull; <strong>NxtWave // CCBP 4.0 Academy</strong></div>
          <div>3. <strong>2020 &mdash; 2024:</strong> Bachelor of Technology (B.Tech) in Computer Science &amp; Engineering</div>
        </div>`;
      break;

    case "skills":
      response = `
        <div class="term-box">
          <div class="term-box-title">🛰️ TECHNICAL AVIONICS TELEMETRY</div>
          <div><strong>Languages:</strong> JavaScript (ES6+), Python, SQL (Relational/CRUD)</div>
          <div><strong>Frontend:</strong> React.js, Component Trees, HTML5, CSS3, Flexbox Grid</div>
          <div><strong>Backend:</strong> Node.js, Express.js REST APIs, SQL Databases, MongoDB</div>
          <div><strong>Ecosystem:</strong> Git, GitHub, NPM Packages, Chrome DevTools, Vercel</div>
        </div>`;
      break;

    case "projects":
    case "expeditions":
      response = `
        <div class="term-box">
          <div class="term-box-title">🚀 ACTIVE DEEP SPACE EXPEDITIONS (04 MISSIONS)</div>
          <div>1. <strong>TheStore</strong> [MERN Stack] &rarr; <a href="https://the-store-fra4.vercel.app/#/" target="_blank" class="term-link">Live App ↗</a> | <a href="https://github.com/Sriram-Harshit/TheStore" target="_blank" class="term-link">GitHub ↗</a></div>
          <div>2. <strong>Cosmic Memory Matrix</strong> [Algorithms/UI] &rarr; <a href="https://memory-game-rouge-phi.vercel.app/" target="_blank" class="term-link">Live App ↗</a> | <a href="https://github.com/Sriram-Harshit/Memory-game" target="_blank" class="term-link">GitHub ↗</a></div>
          <div>3. <strong>Digital Health Wallet</strong> [Patient Vitals Vault] &rarr; <a href="https://digital-health-wallet-theta.vercel.app/" target="_blank" class="term-link">Live App ↗</a> | <a href="https://github.com/Sriram-Harshit/DigitalHealthWallet" target="_blank" class="term-link">GitHub ↗</a></div>
          <div>4. <strong>OmniAnalytics</strong> [Django & Scikit-Learn ML] &rarr; <a href="https://ecommerce-analytics-gcm8.onrender.com/ml-results/" target="_blank" class="term-link">Live App ↗</a> | <a href="https://github.com/Sriram-Harshit/ecommerce_analytics" target="_blank" class="term-link">GitHub ↗</a></div>
        </div>`;
      break;

    case "certs":
    case "certifications":
    case "credentials":
      response = `
        <div class="term-box">
          <div class="term-box-title">📜 10 ACCREDITED FLIGHT CREDENTIALS (NxtWave / NASSCOM)</div>
          <div>01. React JS &bull; 02. Node.js &bull; 03. JavaScript Essentials</div>
          <div>04. Build Your Own Dynamic Web App &bull; 05. Responsive Web Design using Flexbox</div>
          <div>06. Build Your Own Responsive Website &bull; 07. Build Your Own Static Website</div>
          <div>08. Introduction to Databases (SQL) &bull; 09. Programming Foundations with Python</div>
          <div>10. Developer Foundations (Git/CLI)</div>
          <div style="margin-top: 6px; color: #4ade80;">STATUS: 100% VERIFIED & AUTHENTICATED</div>
        </div>`;
      break;

    case "about":
    case "bio":
    case "whoami":
      response = `
        <div class="term-box">
          <div><strong>CALLSIGN:</strong> Sri Ram Harshit</div>
          <div><strong>ROLE:</strong> Software Engineer Intern & Full-Stack Developer</div>
          <div><strong>CURRENT MISSION:</strong> Edvak EHR (Software Engineer Intern)</div>
          <div><strong>BASE:</strong> Hyderabad, India [IST / UTC+5:30]</div>
          <div><strong>DIRECTIVE:</strong> Engineering resilient, scalable full-stack applications with MERN Stack & Python.</div>
        </div>`;
      break;

    case "contact":
    case "uplink":
      response = `
        <div class="term-box">
          <div><strong>EMAIL:</strong> sriramharshit4859@gmail.com</div>
          <div><strong>LINKEDIN:</strong> linkedin.com/in/sriram-harshit</div>
          <div><strong>GITHUB:</strong> github.com/Sriram-Harshit</div>
          <div><strong>STATUS:</strong> Ready for new mission transmissions.</div>
        </div>`;
      break;

    case "sudo hire":
    case "sudo hire sriram":
    case "hire":
      response = `
        <div class="term-box term-hire-success">
          <div style="font-weight: 800; color: #4ade80; font-size: 1.05rem;">🎉 ACCESS GRANTED: RECRUITMENT PROTOCOL ENGAGED!</div>
          <p>Excellent decision, Commander. Sri Ram Harshit is ready to bring high-velocity engineering to your team.</p>
          <div style="margin-top: 8px;">
            <a href="mailto:sriramharshit4859@gmail.com?subject=Offer%20/%20Interview%20Invitation" class="term-btn-action">
              <i class="fas fa-paper-plane"></i> Transmit Interview Invitation
            </a>
          </div>
        </div>`;
      break;

    case "date":
    case "time":
      response = `<div>ORBITAL TIME: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} IST</div>`;
      break;

    case "clear":
    case "cls":
      if (cliHistory) cliHistory.innerHTML = "";
      return;

    case "exit":
    case "quit":
      closeTerminal();
      return;

    default:
      response = `<span class="term-error">Command not recognized: '${escapeHtml(cmd)}'. Type <span class="term-cmd-highlight">help</span> for flight commands.</span>`;
  }

  appendToTerminalHistory(rawCmd, response);
}

if (cliInput) {
  cliInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = cliInput.value;
      cliInput.value = "";
      processCommand(val);
    } else if (e.key === "ArrowUp") {
      if (commandHistory.length > 0 && historyIndex > 0) {
        historyIndex--;
        cliInput.value = commandHistory[historyIndex];
      }
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        cliInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        cliInput.value = "";
      }
      e.preventDefault();
    }
  });
}

quickCmdBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const cmd = btn.getAttribute("data-cmd");
    if (cmd) {
      if (cmd === "clear") {
        if (cliHistory) cliHistory.innerHTML = "";
      } else {
        processCommand(cmd);
      }
      if (cliInput) cliInput.focus();
    }
  });
});



