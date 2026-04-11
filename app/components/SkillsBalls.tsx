"use client";

import { useEffect, useRef } from "react";

const SKILLS = [
  { name: "C",           cat: "blue",   r: 44 },
  { name: "C++",         cat: "blue",   r: 50 },
  { name: "Python",      cat: "blue",   r: 60 },
  { name: "Java",        cat: "blue",   r: 46 },
  { name: "JavaScript",  cat: "blue",   r: 60 },
  { name: "TypeScript",  cat: "blue",   r: 54 },
  { name: "Dart",        cat: "blue",   r: 42 },
  { name: "SQL",         cat: "blue",   r: 42 },
  { name: "React",       cat: "purple", r: 58 },
  { name: "Next.js",     cat: "purple", r: 56 },
  { name: "Node.js",     cat: "purple", r: 52 },
  { name: "Express",     cat: "purple", r: 46 },
  { name: "Flutter",     cat: "purple", r: 50 },
  { name: "FastAPI",     cat: "purple", r: 46 },
  { name: "Flask",       cat: "purple", r: 40 },
  { name: "Pandas",      cat: "purple", r: 44 },
  { name: "NumPy",       cat: "purple", r: 44 },
  { name: "Sklearn",     cat: "purple", r: 48 },
  { name: "Spark",       cat: "purple", r: 42 },
  { name: "Hadoop",      cat: "purple", r: 42 },
  { name: "Git",         cat: "green",  r: 48 },
  { name: "GitHub",      cat: "green",  r: 50 },
  { name: "Docker",      cat: "green",  r: 52 },
  { name: "Kubernetes",  cat: "green",  r: 50 },
  { name: "Figma",       cat: "green",  r: 44 },
  { name: "VS Code",     cat: "green",  r: 44 },
  { name: "Dialogflow",  cat: "green",  r: 46 },
  { name: "MongoDB",     cat: "orange", r: 52 },
  { name: "MySQL",       cat: "orange", r: 48 },
];

const CAT = {
  blue:   { text: "#67e8f9", border: "rgba(0,243,255,0.6)",   bg: "rgba(0,243,255,0.11)",  glow: "rgba(0,243,255,0.5)" },
  purple: { text: "#c4b5fd", border: "rgba(167,139,250,0.6)", bg: "rgba(139,92,246,0.11)", glow: "rgba(139,92,246,0.5)" },
  green:  { text: "#6ee7b7", border: "rgba(52,211,153,0.6)",  bg: "rgba(52,211,153,0.11)", glow: "rgba(52,211,153,0.5)" },
  orange: { text: "#fdba74", border: "rgba(249,115,22,0.6)",  bg: "rgba(249,115,22,0.11)", glow: "rgba(249,115,22,0.5)" },
} as const;
type Cat = keyof typeof CAT;

// ── Physics tunables ──────────────────────────────────────────────────────────
const GRAVITY      = 0.22;   // gentle gravity — slow drift
const AIR_DRAG     = 0.994;  // a bit more air resistance for floaty feel
const COR_WALL     = 0.68;   // walls absorb a little energy
const COR_FLOOR    = 0.64;   // floor is softer
const COR_BALL     = 0.72;   // ball collisions transfer energy but not explosively
const FLOOR_FRIC   = 0.78;   // floor slows horizontal slide
const MIN_BOUNCE   = 1.2;    // gentle minimum bounce — no frantic settling
const NUDGE_RATE   = 0.004;  // less frequent nudges
const SLOW_THRESH  = 1.2;    // threshold for "too slow" detection

export default function SkillsBalls() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ballRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef       = useRef<number>(0);

  useEffect(() => {
    let alive = true;
    const container = containerRef.current;
    if (!container) return;

    const FULL_W = container.clientWidth || 1200;
    const H      = container.clientHeight || 580;
    // ~5 cm margins each side at 96dpi ≈ 190px; cap at 13% of width
    const MX     = Math.min(190, FULL_W * 0.13);
    const W      = FULL_W - MX * 2;
    const OX     = MX;

    // ── Initialise ball state ──────────────────────────────────────────────
    const balls = SKILLS.map((sk, i) => {
      const mass = Math.PI * sk.r * sk.r * 0.001;
      const cols = Math.max(1, Math.floor(W / 108));
      const col  = i % cols;
      const row  = Math.floor(i / cols);
      const rows = Math.ceil(SKILLS.length / cols);
      // Spawn INSIDE the arena, distributed across the full height
      return {
        x:    sk.r + (col + 0.5) * (W / cols) + (Math.random() - 0.5) * 20,
        y:    sk.r + (row + 0.5) * ((H - sk.r * 2) / rows) + (Math.random() - 0.5) * 20,
        vx:   (Math.random() - 0.5) * 3,
        vy:   (Math.random() - 0.5) * 3,
        r:    sk.r,
        mass,
        // squash-stretch (purely visual, no spin)
        squashX: 1,
        squashY: 1,
        impactV: 0,
      };
    });

    let prev = performance.now();

    function step() {
      if (!alive) return;
      const now = performance.now();
      const dt  = Math.min((now - prev) / 16.667, 2.5);
      prev = now;

      // ── Integrate positions ────────────────────────────────────────────────
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];

        b.vy += GRAVITY * dt;
        b.vx *= Math.pow(AIR_DRAG, dt);
        b.vy *= Math.pow(AIR_DRAG, dt);

        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Squash recovery
        b.squashX += (1 - b.squashX) * 0.25 * dt;
        b.squashY += (1 - b.squashY) * 0.25 * dt;
        b.impactV *= Math.pow(0.88, dt);

        // ── Wall collisions ──────────────────────────────────────────────────
        // Floor
        if (b.y + b.r >= H) {
          b.y  = H - b.r;
          const spd = Math.abs(b.vy);
          // Enforce minimum bounce so balls NEVER settle at floor
          b.vy = -Math.max(spd * COR_FLOOR, MIN_BOUNCE);
          b.vx *= FLOOR_FRIC;
          const sq = Math.min(spd * 0.0022, 0.3);
          b.squashX = 1 + sq * 1.2;
          b.squashY = 1 - sq * 0.85;
          b.impactV = spd;
        }
        // Ceiling
        if (b.y - b.r <= 0) {
          b.y  = b.r;
          b.vy = Math.abs(b.vy) * COR_WALL;
        }
        // Left wall
        if (b.x - b.r <= 0) {
          b.x  = b.r;
          const spd = Math.abs(b.vx);
          b.vx = spd * COR_WALL;
          const sq = Math.min(spd * 0.002, 0.2);
          b.squashX = 1 - sq;
          b.squashY = 1 + sq * 0.7;
        }
        // Right wall
        if (b.x + b.r >= W) {
          b.x  = W - b.r;
          const spd = Math.abs(b.vx);
          b.vx = -spd * COR_WALL;
          const sq = Math.min(spd * 0.002, 0.2);
          b.squashX = 1 - sq;
          b.squashY = 1 + sq * 0.7;
        }
      }

      // ── Ball–ball collisions ───────────────────────────────────────────────
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a  = balls[i];
          const b  = balls[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy;
          const minD   = a.r + b.r;

          if (distSq >= minD * minD || distSq < 0.0001) continue;

          const dist  = Math.sqrt(distSq);
          const nx    = dx / dist;
          const ny    = dy / dist;
          const overlap = minD - dist;

          // Positional correction weighted by inverse mass
          const totalMass = a.mass + b.mass;
          const wa = b.mass / totalMass;
          const wb = a.mass / totalMass;
          a.x -= nx * overlap * wa;
          a.y -= ny * overlap * wa;
          b.x += nx * overlap * wb;
          b.y += ny * overlap * wb;

          // Relative velocity along normal
          const rvn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
          if (rvn <= 0) continue;

          // Impulse (2-body with restitution)
          const imp = (1 + COR_BALL) * rvn / totalMass;
          a.vx -= imp * b.mass * nx;
          a.vy -= imp * b.mass * ny;
          b.vx += imp * a.mass * nx;
          b.vy += imp * a.mass * ny;

          // Squash both on collision
          const sq = Math.min(rvn * 0.0014, 0.2);
          a.squashX = 1 + sq * Math.abs(nx);
          a.squashY = 1 + sq * Math.abs(ny);
          b.squashX = 1 + sq * Math.abs(nx);
          b.squashY = 1 + sq * Math.abs(ny);
          a.impactV = rvn;
          b.impactV = rvn;
        }
      }

      // ── Energy injection: target slow/stuck balls aggressively ─────────────
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);

        // Slow or resting balls get kicked much more often
        const isSlow = speed < SLOW_THRESH;
        const nudgeP = isSlow
          ? NUDGE_RATE * 8 * dt   // 8× more likely when slow
          : NUDGE_RATE * dt;

        if (Math.random() < nudgeP) {
          b.vy -= Math.random() * 4 + 2.5;   // gentle upward nudge
          b.vx += (Math.random() - 0.5) * 3; // mild horizontal drift
        }
      }

      // ── Write to DOM ───────────────────────────────────────────────────────
      for (let i = 0; i < balls.length; i++) {
        const b  = balls[i];
        const el = ballRefs.current[i];
        if (!el) continue;

        el.style.left = `${OX + b.x - b.r}px`;
        el.style.top  = `${b.y - b.r}px`;

        // No rotation — just squash/stretch
        const sx = Math.max(0.72, Math.min(1.42, b.squashX));
        const sy = Math.max(0.72, Math.min(1.42, b.squashY));
        el.style.transform = `scale(${sx}, ${sy})`;

        // Impact glow flare
        const extra = Math.min(b.impactV * 0.7, 22);
        const c = CAT[SKILLS[i].cat as Cat];
        el.style.boxShadow = `0 0 ${28 + extra}px ${c.glow}, 0 4px 18px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.22)`;
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: "600px", overflow: "hidden" }}
    >
      {SKILLS.map((sk, i) => {
        const style = CAT[sk.cat as Cat];
        const d = sk.r * 2;

        return (
          <div
            key={sk.name}
            ref={el => { ballRefs.current[i] = el; }}
            style={{
              position:        "absolute",
              width:           d,
              height:          d,
              left:            0,
              top:             0,
              borderRadius:    "50%",
              background:      style.bg,
              border:          `2px solid ${style.border}`,
              boxShadow:       `0 0 28px ${style.glow}, 0 4px 18px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.22)`,
              backdropFilter:  "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              userSelect:      "none",
              pointerEvents:   "none",
              willChange:      "transform, left, top, box-shadow",
              transformOrigin: "center center",
            }}
          >
            {/* Primary specular glint */}
            <div style={{
              position:    "absolute",
              width:       sk.r * 0.55,
              height:      sk.r * 0.28,
              top:         sk.r * 0.14,
              left:        sk.r * 0.22,
              background:  "rgba(255,255,255,0.28)",
              borderRadius:"50%",
              filter:      "blur(5px)",
              pointerEvents:"none",
              transform:   "rotate(-20deg)",
            }} />
            {/* Secondary tiny glint */}
            <div style={{
              position:    "absolute",
              width:       sk.r * 0.18,
              height:      sk.r * 0.1,
              top:         sk.r * 0.12,
              left:        sk.r * 0.56,
              background:  "rgba(255,255,255,0.5)",
              borderRadius:"50%",
              filter:      "blur(2px)",
              pointerEvents:"none",
            }} />
            <span style={{
              color:         style.text,
              fontWeight:    800,
              fontSize:      Math.max(9, sk.r * 0.3),
              textAlign:     "center",
              lineHeight:    1.15,
              padding:       "0 6px",
              textShadow:    `0 0 14px ${style.glow}`,
              letterSpacing: "-0.01em",
            }}>
              {sk.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
