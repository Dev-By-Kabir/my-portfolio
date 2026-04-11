"use client";

import * as THREE from "three";
import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

// ── Skill Definitions ───────────────────────────────────────────────────────
const BRAND_STYLES: Record<string, { color: string; symbol: string; iconScale?: number }> = {
  "Dart": { color: "#00b4ab", symbol: "D", iconScale: 0.6 },
  "SQL": { color: "#4479a1", symbol: "SQL", iconScale: 0.7 },
  "Flask": { color: "#1a1a1a", symbol: "F", iconScale: 0.7 },
  "Pandas": { color: "#150458", symbol: "Pd", iconScale: 0.7 },
  "NumPy": { color: "#013243", symbol: "Np", iconScale: 0.7 },
  "Sklearn": { color: "#f7931e", symbol: "Sk", iconScale: 0.7 },
  "Spark": { color: "#e25a1c", symbol: "S", iconScale: 0.7 },
  "Hadoop": { color: "#66ccff", symbol: "H", iconScale: 0.7 },
  "Figma": { color: "#f24e1e", symbol: "Fg", iconScale: 0.7 },
  "VS Code": { color: "#007acc", symbol: "VS", iconScale: 0.7 },
  "Dialogflow": { color: "#ff9800", symbol: "Df", iconScale: 0.7 },
};

const SKILLS_CONFIG = [
  { name: "TypeScript", logo: "/images/typescript.png" },
  { name: "JavaScript", logo: "/images/javascript.png" },
  { name: "React", logo: "/images/react.png" },
  { name: "Next.js", logo: "/images/nextjs.png" },
  { name: "Python", logo: "/images/python.png" },
  { name: "Node.js", logo: "/images/nodejs.png" },
  { name: "Docker", logo: "/images/docker.png" },
  { name: "MongoDB", logo: "/images/mongodb.png" },
  { name: "C++", logo: "/images/cpp.png" },
  { name: "Flutter", logo: "/images/flutter.png" },
  { name: "Git", logo: "/images/git.png" },
  { name: "Kubernetes", logo: "/images/kubernetes.png" },
  { name: "MySQL", logo: "/images/mysql.png" },
  { name: "GitHub", logo: "/images/github.png" },
  { name: "FastAPI", logo: "/images/fastapi.png" },
  { name: "Java", logo: "/images/java.png" },
  { name: "Express", logo: "/images/express.png" },
  { name: "C", logo: "/images/c.png" },
  { name: "Dart" },
  { name: "SQL" },
  { name: "Flask" },
  { name: "Pandas" },
  { name: "NumPy" },
  { name: "Sklearn" },
  { name: "Spark" },
  { name: "Hadoop" },
  { name: "Figma" },
  { name: "VS Code" },
  { name: "Dialogflow" },
];

const sphereGeometry = new THREE.SphereGeometry(1, 48, 48);

// ── Absolute Minimalist Texture Generator ─────────────────────────────────────
function createMinimalTexture(name: string, logoImg?: HTMLImageElement | HTMLCanvasElement) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 1. Background - Pure White (Original state restored)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1024, 1024);

  const style = BRAND_STYLES[name] || { color: "#333333", symbol: name.charAt(0) };

  // 2. Logo / Icon (Centered as a clear decal - Slightly Enlarged)
  if (logoImg) {
    const size = 620 * (style.iconScale || 1);
    ctx.drawImage(logoImg, 512 - size / 2, 430 - size / 2, size, size);
  } else {
    // Advanced Procedural Logos (Pixel-Perfect Canvas Recreations)
    ctx.save();
    ctx.translate(512, 430);
    ctx.fillStyle = style.color;

    if (name === "SQL") {
      [-70, 0, 70].forEach(y => {
        ctx.beginPath(); ctx.ellipse(0, y, 160, 60, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 5; ctx.stroke();
      });
    } else if (name === "Flask") {
      ctx.beginPath(); ctx.arc(0, 80, 110, 0, Math.PI * 2);
      ctx.fillRect(-45, -110, 90, 160); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fillRect(-35, -50, 70, 10); // Reflection
    } else if (name === "Dart") {
      ctx.beginPath(); ctx.moveTo(-140, -140); ctx.lineTo(140, 0); ctx.lineTo(-140, 140); ctx.lineTo(-40, 0); ctx.closePath(); ctx.fill();
    } else if (name === "Figma") {
      [[-70, -70], [-70, 0], [70, -70], [70, 0], [-70, 70]].forEach(([x, y], i) => {
        ctx.beginPath(); ctx.arc(x, y, 65, 0, Math.PI * 2); ctx.fill();
      });
    } else if (name === "VS Code") {
      ctx.beginPath(); ctx.moveTo(-130, 0); ctx.lineTo(0, -140); ctx.lineTo(130, -50); ctx.lineTo(130, 50); ctx.lineTo(0, 140); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 10; ctx.stroke();
    } else if (name === "Spark") {
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4); ctx.fillRect(0, -150, 20, 300);
      }
    } else if (name === "Pandas") {
      ctx.beginPath(); ctx.arc(0, 0, 120, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-40, -20, 30, 0, Math.PI * 2); ctx.arc(40, -20, 30, 0, Math.PI * 2); ctx.fill();
    } else if (name === "NumPy") {
      ctx.font = "bold 250px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("N", 0, 0);
    } else if (name === "Hadoop") {
      ctx.beginPath(); ctx.arc(0, 0, 100, 0, Math.PI * 2);
      ctx.moveTo(-100, 0); ctx.quadraticCurveTo(-150, 100, -50, 50); ctx.fill();
    } else if (name === "Sklearn") {
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.arc(-80 + i * 80, -40 + i * 40, 50, 0, Math.PI * 2); ctx.fill();
      }
    } else if (name === "Dialogflow") {
      ctx.beginPath(); ctx.arc(0, 0, 130, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 15; ctx.beginPath(); ctx.arc(0, 0, 80, 0, Math.PI * 2); ctx.stroke();
    } else {
      const fontSize = style.symbol.length > 2 ? 180 : 350;
      ctx.font = `italic 900 ${fontSize}px "Inter", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(style.symbol, 0, 0);
    }
    ctx.restore();
  }

  // 3. Text Label (Refined Greyish Black as requested)
  ctx.fillStyle = "#333333";
  ctx.font = `bold 125px "Inter", -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "2px";
  ctx.fillText(name.trim().toUpperCase(), 512, 820);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ── Single sphere ─────────────────────────────────────────────────────────────
type SphereProps = {
  name: string;
  scale: number;
  texture?: THREE.Texture;
  vec?: THREE.Vector3;
};

function Sphere({ name, scale, texture, vec = new THREE.Vector3() }: SphereProps) {
  const api = useRef<RapierRigidBody>(null);

  const finalTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    return createMinimalTexture(name, texture?.image as any);
  }, [texture, name]);

  useFrame((state, delta) => {
    delta = Math.min(0.1, delta);
    if (!api.current) return;

    // Clustering logic
    const impulse = vec
      .copy(api.current.translation() as THREE.Vector3)
      .normalize()
      .multiplyScalar(-65 * delta * scale);
    api.current.applyImpulse(impulse, true);

    // Subtle float
    api.current.applyTorqueImpulse({
      x: (Math.random() - 0.5) * 0.1 * scale,
      y: (Math.random() - 0.5) * 0.1 * scale,
      z: (Math.random() - 0.5) * 0.1 * scale
    }, true);
  });

  // MeshBasicMaterial is the ONLY way to guarantee zero "black design" (shading)
  // It is self-illuminated and ignores all lights/shadows.
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: finalTexture || null,
      color: "#ffffff",
      transparent: false,
    });
  }, [finalTexture]);

  const r = THREE.MathUtils.randFloatSpread;

  return (
    <RigidBody
      linearDamping={0.6}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(22) - 30, r(15)]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.25 * scale]}
      />
      <mesh scale={scale} geometry={sphereGeometry} material={material} />
    </RigidBody>
  );
}

// ── Mouse-following kinematic pointer ────────────────────────────────────────
function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      )
    );
  });

  return (
    <RigidBody
      position={[0, 0, 0]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2.5]} />
    </RigidBody>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene() {
  const logoPathMap = useMemo(() => {
    const map: Record<string, string> = {};
    SKILLS_CONFIG.forEach(s => { if (s.logo) map[s.name] = s.logo; });
    return map;
  }, []);

  const logoPaths = Object.values(logoPathMap);
  const loadedTextures = useTexture(logoPaths);

  const skillTextures = useMemo(() => {
    const map: Record<string, THREE.Texture> = {};
    Object.keys(logoPathMap).forEach((name, i) => {
      const tex = loadedTextures[i];
      if (tex) {
        tex.anisotropy = 16;
        tex.colorSpace = THREE.SRGBColorSpace;
      }
      map[name] = tex;
    });
    return map;
  }, [logoPathMap, loadedTextures]);

  const spheres = useMemo(() => {
    return SKILLS_CONFIG.map((s) => ({
      name: s.name,
      scale: [0.75, 0.9, 1.0, 1.2][Math.floor(Math.random() * 4)],
      texture: skillTextures[s.name]
    }));
  }, [skillTextures]);

  return (
    <Physics gravity={[0, 0, 0]}>
      <Pointer />
      {spheres.map((s, i) => (
        <Sphere
          key={i}
          name={s.name}
          scale={s.scale}
          texture={s.texture}
        />
      ))}
    </Physics>
  );
}

// ── Component Export ──────────────────────────────────────────────────────────
export default function SkillsBalls() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ height: 600, width: "100%", cursor: "grab" }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
