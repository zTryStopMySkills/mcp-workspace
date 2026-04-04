"use client";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────
   STATIC GEOMETRY PROFILES  (defined outside component so they
   are created once and never re-allocated)
   ───────────────────────────────────────────────────────────── */

/**
 * Vase lathe profile — teardrop / wide-belly silhouette
 * Points: [radius, y] bottom → top
 */
const VASE_PROFILE: THREE.Vector2[] = [
  new THREE.Vector2(0.030, -0.920),   // base centre
  new THREE.Vector2(0.185, -0.900),   // base inner edge
  new THREE.Vector2(0.305, -0.800),   // base taper to body
  new THREE.Vector2(0.435, -0.580),   // lower belly curve
  new THREE.Vector2(0.530, -0.240),   // belly approach
  new THREE.Vector2(0.560,  0.040),   // max belly width
  new THREE.Vector2(0.510,  0.250),   // upper belly
  new THREE.Vector2(0.375,  0.405),   // shoulder
  new THREE.Vector2(0.225,  0.520),   // neck transition
  new THREE.Vector2(0.165,  0.625),   // lower neck
  new THREE.Vector2(0.175,  0.685),   // neck lip flare
  new THREE.Vector2(0.150,  0.735),   // lip top
];

/**
 * Bowl lathe profile — funnel / chalice shape (small & deep)
 * Points: [radius, y] bottom → top
 */
const BOWL_PROFILE: THREE.Vector2[] = [
  new THREE.Vector2(0.038, 0.000),
  new THREE.Vector2(0.058, 0.055),
  new THREE.Vector2(0.108, 0.135),
  new THREE.Vector2(0.185, 0.215),
  new THREE.Vector2(0.240, 0.280),
  new THREE.Vector2(0.246, 0.315),
  new THREE.Vector2(0.222, 0.338),
];

/** Hose curve — long S-shaped drape from vase port to mouthpiece */
const HOSE_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3( 0.575, -0.130,  0.000),
  new THREE.Vector3( 0.820, -0.340,  0.200),
  new THREE.Vector3( 1.060, -0.640,  0.480),
  new THREE.Vector3( 0.880, -0.980,  0.790),
  new THREE.Vector3( 0.480, -1.180,  0.970),
  new THREE.Vector3( 0.040, -1.280,  1.040),
  new THREE.Vector3(-0.240, -1.260,  1.040),
]);

/* ─────────────────────────────────────────────────────────────
   MATERIALS  (memoized outside component)
   ───────────────────────────────────────────────────────────── */
const navyGlassMat = new THREE.MeshPhysicalMaterial({
  color: "#0C1D42",
  metalness: 0.0,
  roughness: 0.06,
  transmission: 0.28,
  thickness: 1.0,
  transparent: true,
  opacity: 0.91,
  envMapIntensity: 2.2,
});
const chromeMat = new THREE.MeshStandardMaterial({
  color: "#CECECE",
  metalness: 0.98,
  roughness: 0.07,
});
const silverMat = new THREE.MeshStandardMaterial({
  color: "#B8B8B8",
  metalness: 0.95,
  roughness: 0.12,
});
const goldMat = new THREE.MeshStandardMaterial({
  color: "#F5C01A",
  metalness: 0.90,
  roughness: 0.15,
});
const blueMat = new THREE.MeshStandardMaterial({
  color: "#1A4A90",
  metalness: 0.38,
  roughness: 0.48,
});
const clayMat = new THREE.MeshStandardMaterial({
  color: "#6A6055",
  metalness: 0.0,
  roughness: 0.92,
});
const hoseMat = new THREE.MeshStandardMaterial({
  color: "#0C0C0C",
  metalness: 0.0,
  roughness: 0.90,
});
const coalMat = new THREE.MeshStandardMaterial({
  color: "#CC4400",
  emissive: "#FF2200",
  emissiveIntensity: 1.1,
  roughness: 0.80,
});
const rubberMat = new THREE.MeshStandardMaterial({
  color: "#191919",
  metalness: 0.0,
  roughness: 0.96,
});
const mouthMat = new THREE.MeshPhysicalMaterial({
  color: "#1F55CC",
  metalness: 0.08,
  roughness: 0.22,
  transparent: true,
  opacity: 0.82,
});

/* ── helpers ── */
const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
function lerpGroup(g: THREE.Group, target: THREE.Vector3, alpha: number) {
  g.position.lerp(target, alpha);
}

/* ─────────────────────────────────────────────────────────────
   SHISHA MODEL
   ───────────────────────────────────────────────────────────── */
function ShishaModel({
  autoRotate,
  explodedProgress = 0,
}: {
  autoRotate: boolean;
  explodedProgress?: number;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const vaseRef = useRef<THREE.Group>(null);
  const stemRef = useRef<THREE.Group>(null);
  const trayRef = useRef<THREE.Group>(null);
  const hoseRef = useRef<THREE.Group>(null);

  /* Exploded target offsets (applied as group.position) */
  const VASE_EXP = v3( 0.00, -1.55,  0.00);
  const STEM_EXP = v3( 0.65,  0.05,  0.30);
  const TRAY_EXP = v3(-0.40,  1.85,  0.00);
  const HOSE_EXP = v3( 2.10, -0.35,  0.55);
  const ZERO     = v3(0, 0, 0);

  useFrame((state, delta) => {
    const alpha = 1 - Math.pow(0.03, delta); // frame-rate independent
    if (autoRotate && rootRef.current && explodedProgress < 0.05) {
      const t = state.clock.elapsedTime;
      rootRef.current.rotation.y += delta * 0.48;
      rootRef.current.rotation.x = Math.sin(t * 0.38) * 0.14; // cabeceo suave
    }
    const exp = explodedProgress > 0;
    if (vaseRef.current) lerpGroup(vaseRef.current, exp ? VASE_EXP : ZERO, alpha);
    if (stemRef.current) lerpGroup(stemRef.current, exp ? STEM_EXP : ZERO, alpha);
    if (trayRef.current) lerpGroup(trayRef.current, exp ? TRAY_EXP : ZERO, alpha);
    if (hoseRef.current) lerpGroup(hoseRef.current, exp ? HOSE_EXP : ZERO, alpha);
  });

  const lbl: React.CSSProperties = {
    background: "rgba(13,13,13,0.88)",
    border: "1px solid rgba(245,192,26,0.55)",
    color: "#F5C01A",
    padding: "3px 10px",
    borderRadius: "2px",
    fontSize: "11px",
    letterSpacing: "0.16em",
    fontFamily: "var(--font-cinzel, Cinzel)",
    whiteSpace: "nowrap",
    opacity: explodedProgress > 0.45 ? 1 : 0,
    transition: "opacity 0.4s ease",
  };

  return (
    <group ref={rootRef} position={[0, -0.68, 0]}>

      {/* ════════════════════════════════════════
          VASE GROUP — navy blue ornate glass vase
          ════════════════════════════════════════ */}
      <group ref={vaseRef}>

        {/* Main vase body — LatheGeometry */}
        <mesh material={navyGlassMat} castShadow>
          <latheGeometry args={[VASE_PROFILE, 72]} />
        </mesh>

        {/* Base chrome disc */}
        <mesh position={[0, -0.885, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.240, 0.240, 0.040, 36]} />
        </mesh>
        {/* Base gold accent ring */}
        <mesh position={[0, -0.865, 0]} material={goldMat}>
          <torusGeometry args={[0.232, 0.013, 8, 48]} />
        </mesh>

        {/* Ornamental relief rings on belly (chrome) */}
        <mesh position={[0, -0.400, 0]} material={chromeMat}>
          <torusGeometry args={[0.528, 0.009, 8, 56]} />
        </mesh>
        <mesh position={[0, -0.100, 0]} material={chromeMat}>
          <torusGeometry args={[0.559, 0.009, 8, 56]} />
        </mesh>
        <mesh position={[0,  0.210, 0]} material={chromeMat}>
          <torusGeometry args={[0.506, 0.009, 8, 56]} />
        </mesh>

        {/* Neck lower chrome collar */}
        <mesh position={[0, 0.600, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.188, 0.188, 0.115, 36]} />
        </mesh>
        {/* Neck gold top ring */}
        <mesh position={[0, 0.670, 0]} material={goldMat}>
          <torusGeometry args={[0.166, 0.015, 8, 36]} />
        </mesh>

        {/* Hose port — side stub */}
        <mesh
          position={[0.570, -0.125, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={silverMat}
        >
          <cylinderGeometry args={[0.036, 0.036, 0.165, 16]} />
        </mesh>
        <mesh position={[0.648, -0.125, 0]} material={goldMat}>
          <torusGeometry args={[0.037, 0.012, 8, 20]} />
        </mesh>

        <Html position={[0.82, -0.22, 0]} style={lbl}>Vaso</Html>
      </group>

      {/* ════════════════════════════════════════
          STEM GROUP — long chrome shaft with
          blue accent section and gold rings
          ════════════════════════════════════════ */}
      <group ref={stemRef}>

        {/* Rubber grommet / gasket that seals into vase neck */}
        <mesh position={[0, 0.610, 0]} material={rubberMat}>
          <torusGeometry args={[0.150, 0.022, 10, 28]} />
        </mesh>

        {/* Lower chrome connector — tapers slightly down */}
        <mesh position={[0, 0.825, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.122, 0.146, 0.290, 28]} />
        </mesh>

        {/* Blue decorative section — matches vase colour */}
        <mesh position={[0, 1.085, 0]} material={blueMat}>
          <cylinderGeometry args={[0.096, 0.096, 0.265, 28]} />
        </mesh>
        {/* Blue section chrome end caps */}
        <mesh position={[0, 0.975, 0]} material={chromeMat}>
          <torusGeometry args={[0.098, 0.018, 8, 28]} />
        </mesh>
        <mesh position={[0, 1.220, 0]} material={chromeMat}>
          <torusGeometry args={[0.098, 0.018, 8, 28]} />
        </mesh>

        {/* Main shaft — long narrow chrome tube */}
        <mesh position={[0, 1.840, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.044, 0.050, 1.220, 22]} />
        </mesh>

        {/* Gold accent rings along shaft */}
        {([1.44, 1.72, 2.08, 2.32] as const).map((y, i) => (
          <mesh key={i} position={[0, y, 0]} material={goldMat}>
            <torusGeometry args={[0.051, 0.010, 8, 24]} />
          </mesh>
        ))}

        <Html position={[0.58, 1.84, 0]} style={lbl}>Vástago</Html>
      </group>

      {/* ════════════════════════════════════════
          TRAY + BOWL GROUP — wide chrome tray
          topped with small funnel clay bowl
          ════════════════════════════════════════ */}
      <group ref={trayRef}>

        {/* Stem top cap */}
        <mesh position={[0, 2.465, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.058, 0.052, 0.085, 22]} />
        </mesh>

        {/* Tray plate — wide flat disc */}
        <mesh position={[0, 2.510, 0]} material={silverMat}>
          <cylinderGeometry args={[0.315, 0.315, 0.032, 56]} />
        </mesh>
        {/* Tray chrome rim lip */}
        <mesh position={[0, 2.527, 0]} material={chromeMat}>
          <torusGeometry args={[0.308, 0.013, 8, 56]} />
        </mesh>

        {/* Bowl stub connector */}
        <mesh position={[0, 2.558, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.055, 0.055, 0.100, 18]} />
        </mesh>

        {/* Clay bowl — LatheGeometry funnel */}
        <mesh position={[0, 2.608, 0]} material={clayMat} castShadow>
          <latheGeometry args={[BOWL_PROFILE, 36]} />
        </mesh>
        {/* Bowl rim torus */}
        <mesh position={[0, 2.945, 0]} material={clayMat}>
          <torusGeometry args={[0.210, 0.018, 8, 36]} />
        </mesh>

        {/* Foil / screen (thin silver disc) */}
        <mesh position={[0, 2.960, 0]} material={silverMat}>
          <cylinderGeometry args={[0.196, 0.196, 0.008, 36]} />
        </mesh>

        {/* Burning coal */}
        <mesh position={[0, 2.974, 0]} material={coalMat}>
          <cylinderGeometry args={[0.072, 0.072, 0.055, 18]} />
        </mesh>

        <Html position={[0.56, 2.82, 0]} style={lbl}>Cuenco</Html>
      </group>

      {/* ════════════════════════════════════════
          HOSE GROUP — long black hose with
          blue acrylic mouthpiece
          ════════════════════════════════════════ */}
      <group ref={hoseRef}>

        {/* Adapter ring at vase port */}
        <mesh
          position={[0.570, -0.125, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={chromeMat}
        >
          <cylinderGeometry args={[0.040, 0.040, 0.075, 16]} />
        </mesh>

        {/* Main hose — TubeGeometry along CatmullRom curve */}
        <mesh material={hoseMat}>
          <tubeGeometry args={[HOSE_CURVE, 32, 0.025, 10, false]} />
        </mesh>

        {/* Chrome connector ring at mouthpiece end */}
        <mesh position={[-0.240, -1.260, 1.040]} material={chromeMat}>
          <torusGeometry args={[0.030, 0.010, 8, 20]} />
        </mesh>

        {/* Blue acrylic mouthpiece */}
        <mesh
          position={[-0.240, -1.355, 1.040]}
          rotation={[0.30, 0.22, 0.12]}
          material={mouthMat}
        >
          <cylinderGeometry args={[0.019, 0.028, 0.210, 14]} />
        </mesh>

        <Html position={[1.08, -0.18, 0.52]} style={lbl}>Manguera</Html>
      </group>

    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   VAPER BOX MOD — unchanged
   ───────────────────────────────────────────────────────────── */
function VaperModel({ autoRotate }: { autoRotate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y += delta * 0.6;
      groupRef.current.rotation.x = Math.sin(t * 0.42) * 0.18; // cabeceo arriba/abajo
    }
  });

  const bodyMat  = new THREE.MeshStandardMaterial({ color: "#1C1C1E", metalness: 0.75, roughness: 0.25 });
  const goldM    = new THREE.MeshStandardMaterial({ color: "#F5C01A", metalness: 0.95, roughness: 0.1  });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: "#88CCFF", transmission: 0.85, thickness: 0.15, roughness: 0.0, transparent: true, opacity: 0.55 });
  const ledMat   = new THREE.MeshStandardMaterial({ color: "#F5C01A", emissive: "#F5C01A", emissiveIntensity: 2.0 });
  const btnMat   = new THREE.MeshStandardMaterial({ color: "#2E2E30", metalness: 0.8, roughness: 0.2 });
  const screenM  = new THREE.MeshStandardMaterial({ color: "#00CFFF", emissive: "#0055AA", emissiveIntensity: 1.0, roughness: 0.05 });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ── Cuerpo principal cilíndrico ── */}
      <mesh position={[0, 0, 0]} material={bodyMat}>
        <cylinderGeometry args={[0.14, 0.16, 2.0, 32]} />
      </mesh>

      {/* Anillo dorado superior */}
      <mesh position={[0, 0.9, 0]} material={goldM}>
        <torusGeometry args={[0.155, 0.018, 10, 40]} />
      </mesh>

      {/* Anillo dorado inferior */}
      <mesh position={[0, -0.9, 0]} material={goldM}>
        <torusGeometry args={[0.165, 0.018, 10, 40]} />
      </mesh>

      {/* ── Boquilla superior ── */}
      <mesh position={[0, 1.12, 0]} material={new THREE.MeshStandardMaterial({ color: "#2A2A2A", metalness: 0.6, roughness: 0.3 })}>
        <cylinderGeometry args={[0.07, 0.14, 0.22, 24]} />
      </mesh>
      <mesh position={[0, 1.3, 0]} material={new THREE.MeshStandardMaterial({ color: "#1A1A1A", metalness: 0.5, roughness: 0.4 })}>
        <cylinderGeometry args={[0.045, 0.07, 0.2, 20]} />
      </mesh>
      {/* Abertura de vapor (mouthpiece glass) */}
      <mesh position={[0, 1.42, 0]} material={glassMat}>
        <cylinderGeometry args={[0.035, 0.045, 0.08, 16]} />
      </mesh>

      {/* ── Panel lateral: display OLED ── */}
      <mesh position={[0.145, 0.25, 0]} material={screenM} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.30, 0.22]} />
      </mesh>
      {/* Bisel pantalla */}
      <mesh position={[0.1445, 0.25, 0]} material={new THREE.MeshStandardMaterial({ color: "#0A0A0A" })} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.35, 0.27]} />
      </mesh>

      {/* ── Botón de fuego ── */}
      <mesh position={[-0.155, 0.1, 0]} rotation={[0, 0, Math.PI / 2]} material={btnMat}>
        <cylinderGeometry args={[0.028, 0.028, 0.06, 16]} />
      </mesh>
      {/* Botones + / – */}
      {[0.38, 0.58].map((y, i) => (
        <mesh key={i} position={[-0.15, y, 0]} material={btnMat}>
          <cylinderGeometry args={[0.02, 0.02, 0.04, 12]} />
        </mesh>
      ))}

      {/* ── LED indicator strip (base) ── */}
      <mesh position={[0, -1.02, 0]} material={ledMat}>
        <torusGeometry args={[0.1, 0.012, 8, 32]} />
      </mesh>

      {/* ── Base con puerto USB-C ── */}
      <mesh position={[0, -1.06, 0]} material={new THREE.MeshStandardMaterial({ color: "#111", metalness: 0.9, roughness: 0.15 })}>
        <cylinderGeometry args={[0.155, 0.155, 0.08, 32]} />
      </mesh>
      {/* Ranura USB-C */}
      <mesh position={[0, -1.12, 0]} material={new THREE.MeshStandardMaterial({ color: "#080808" })}>
        <boxGeometry args={[0.07, 0.025, 0.04]} />
      </mesh>

      {/* ── Textura decorativa: bandas finas ── */}
      {[-0.55, -0.15, 0.55].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} material={new THREE.MeshStandardMaterial({ color: "#252525", metalness: 0.6, roughness: 0.4 })}>
          <torusGeometry args={[0.145, 0.008, 6, 36]} />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCENE
   ───────────────────────────────────────────────────────────── */
function Scene({
  type,
  explodedProgress,
}: {
  type: "shisha" | "vaper";
  explodedProgress?: number;
}) {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 5]}  intensity={1.3} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.6} color="#6688FF" />
      <pointLight position={[0, 3, 2]} intensity={0.9} color="#FFD84A" />
      <pointLight position={[0, -2, 2]} intensity={0.3} color="#4466FF" />
      <Environment preset="city" />

      {type === "shisha" ? (
        <ShishaModel autoRotate={autoRotate} explodedProgress={explodedProgress} />
      ) : (
        <VaperModel autoRotate={autoRotate} />
      )}

      <ContactShadows
        position={[0, -1.58, 0]}
        opacity={0.45}
        scale={5}
        blur={2.5}
        far={3.5}
        color="#F5C01A"
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(Math.PI * 3) / 4}
        onStart={() => setAutoRotate(false)}
        onEnd={() => setTimeout(() => setAutoRotate(true), 3000)}
        rotateSpeed={0.8}
        touches={{ ONE: 2, TWO: 0 }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   PUBLIC COMPONENT
   ───────────────────────────────────────────────────────────── */
export default function ProductViewer3D({
  type = "shisha",
  className = "",
  explodedProgress,
}: {
  type?: "shisha" | "vaper";
  className?: string;
  /** 0 = assembled · 1 = fully exploded (scroll-jacked hero) */
  explodedProgress?: number;
}) {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0.85, 5.0], fov: 44 }}
        shadows
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene type={type} explodedProgress={explodedProgress} />
        </Suspense>
      </Canvas>

      {!explodedProgress && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
          <span
            className="text-[9px] text-[rgba(245,192,26,0.4)] tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            ↺ Arrastra para girar
          </span>
        </div>
      )}
    </div>
  );
}
