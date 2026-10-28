'use client';

import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Billboard, Html, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { projects } from '@/data/projects';
import { SKY_COLORS, type Affinity, type Vec3Tuple } from '@/data/experience';
import { layoutSky, placeForAspect, skyCamera, wideness, type SkyStar } from '@/lib/experience/layout';

interface SkySceneProps {
  selectedId: string | null;
  /** A group lit from outside the canvas (the legend). */
  highlightAffinity: Affinity | null;
  /** A star lit from outside the canvas (its button in the intro). */
  highlightId: string | null;
  isCoarsePointer: boolean;
  onSelect: (id: string) => void;
  /** A click on empty sky. */
  onBack: () => void;
  onReady: () => void;
}

export function SkyScene({ isCoarsePointer, onReady, ...rest }: SkySceneProps) {
  return (
    <Canvas
      dpr={[1, isCoarsePointer ? 1.5 : 2]}
      gl={{ antialias: !isCoarsePointer }}
      camera={{ position: [2, -1.6, 24], fov: 40, near: 0.1, far: 200 }}
      // The sky fills the first screen, so a vertical swipe on it has to scroll the page.
      style={{ touchAction: 'pan-y' }}
      onCreated={() => onReady()}
      onPointerMissed={() => rest.onBack()}
    >
      <SkyContent isCoarsePointer={isCoarsePointer} {...rest} />
    </Canvas>
  );
}

// Mulberry32: the same "random" starfield on every visit.
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function SkyContent({
  selectedId,
  highlightAffinity,
  highlightId,
  isCoarsePointer,
  onSelect,
}: Omit<SkySceneProps, 'onReady'>) {
  const layout = useMemo(() => layoutSky(projects), []);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { size } = useThree();

  const aspect = size.width / Math.max(size.height, 1);
  const placed = useMemo(() => new Map(layout.stars.map((s) => [s.id, placeForAspect(s.position, aspect)])), [layout, aspect]);
  const rest = skyCamera(aspect);

  const byId = useMemo(() => new Map(layout.stars.map((s) => [s.id, s])), [layout]);
  const lit = hoveredId ?? highlightId;
  const activeAffinity = highlightAffinity ?? (lit ? byId.get(lit)?.affinity ?? null : null);
  // Hovering Ashwake dims the light around it: the eclipse is the one star that takes light away.
  const eclipse = lit !== null && byId.get(lit)?.featured?.motif === 'eclipse';

  const isDimmed = (star: SkyStar) =>
    selectedId !== null ? star.id !== selectedId : (activeAffinity !== null && star.affinity !== activeAffinity) || (eclipse && star.id !== lit);

  const focus = selectedId ? placed.get(selectedId) ?? null : null;

  return (
    <>
      <color attach="background" args={[SKY_COLORS.void]} />
      <fog attach="fog" args={[SKY_COLORS.midnight, 28, 95]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[-8, 6, 14]} intensity={1.2} color={SKY_COLORS.starlight} distance={80} />

      <CameraRig focus={focus} rest={rest} wide={wideness(aspect)} />
      <Starfield count={isCoarsePointer ? 500 : 1100} dimmed={eclipse || selectedId !== null} />

      {layout.links.map((link) => {
        const from = placed.get(link.from);
        const to = placed.get(link.to);
        if (!from || !to) return null;
        const inGroup = activeAffinity === link.affinity || selectedId === link.from || selectedId === link.to;
        const quiet = (activeAffinity !== null && !inGroup) || (selectedId !== null && !inGroup) || eclipse;
        return (
          <Line
            key={`${link.from}-${link.to}`}
            points={[from, to]}
            color={byId.get(link.to)?.color ?? SKY_COLORS.silver}
            lineWidth={1}
            transparent
            opacity={inGroup ? 0.55 : quiet ? 0.04 : 0.16}
          />
        );
      })}

      {layout.stars.map((star) => {
        const position = placed.get(star.id) as Vec3Tuple;
        const common = {
          star,
          position,
          hovered: lit === star.id,
          dimmed: isDimmed(star),
          selected: selectedId === star.id,
          coarse: isCoarsePointer,
          onHover: setHoveredId,
          onSelect,
        };
        return star.featured ? <FeaturedStar key={star.id} {...common} /> : <QuietStar key={star.id} {...common} />;
      })}

      <EffectComposer>
        <Bloom intensity={isCoarsePointer ? 0.6 : 0.85} luminanceThreshold={0.22} luminanceSmoothing={0.4} />
      </EffectComposer>
    </>
  );
}

/** Slight parallax at rest; a weighted drift toward a selected star (about a second), a little slower on the way back. */
function CameraRig({ focus, rest, wide }: { focus: Vec3Tuple | null; rest: { x: number; y: number; z: number }; wide: number }) {
  const { camera, pointer } = useThree();
  const look = useRef(new THREE.Vector3(rest.x, rest.y, 0));
  const wantPos = useRef(new THREE.Vector3());
  const wantLook = useRef(new THREE.Vector3());
  const placed = useRef(false);

  useFrame((_, dt) => {
    // First frame: start at rest for this screen shape instead of drifting there from the Canvas default.
    const k = placed.current ? 1 - Math.exp(-dt * (focus ? 3.2 : 2.4)) : 1;
    placed.current = true;
    if (focus) {
      // Wide screens: the star sits left of centre, clear of the panel on the right. Tall ones: centred, above the
      // panel at the bottom.
      wantPos.current.set(focus[0] + 1.8 * wide, focus[1] + 0.3 - 1.1 * (1 - wide), focus[2] + 8.5 + 3 * (1 - wide));
      wantLook.current.set(focus[0] + 1.2 * wide, focus[1] - 1.1 * (1 - wide), focus[2]);
    } else {
      wantPos.current.set(rest.x + pointer.x * 0.9, rest.y + pointer.y * 0.55, rest.z);
      wantLook.current.set(rest.x + pointer.x * 0.25, rest.y + pointer.y * 0.15, 0);
    }
    camera.position.lerp(wantPos.current, k);
    look.current.lerp(wantLook.current, k);
    camera.lookAt(look.current);
  });
  return null;
}

function Starfield({ count, dimmed }: { count: number; dimmed: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => {
    const rand = seeded(7);
    const out = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // A shell behind and around the constellation, thinning toward the camera.
      const r = 30 + rand() * 55;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      out[i * 3 + 2] = -Math.abs(r * Math.cos(phi)) - 6;
    }
    return out;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.0035;
    if (material.current) {
      const target = dimmed ? 0.35 : 0.85;
      material.current.opacity += (target - material.current.opacity) * Math.min(1, dt * 3);
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={material} size={0.16} sizeAttenuation color={SKY_COLORS.silver} transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

interface StarProps {
  star: SkyStar;
  position: Vec3Tuple;
  hovered: boolean;
  dimmed: boolean;
  selected: boolean;
  coarse: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

function hitHandlers(star: SkyStar, onHover: StarProps['onHover'], onSelect: StarProps['onSelect']) {
  return {
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect(star.id);
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onHover(star.id);
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: () => {
      onHover(null);
      document.body.style.cursor = 'auto';
    },
  };
}

/** `offset`: how far right of the star (in scene units) the label starts, so it clears the star's rings or corona. */
function Label({ text, strength, featured, offset = 0 }: { text: string; strength: number; featured: boolean; offset?: number }) {
  return (
    <Html position={[offset, 0, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
      <div
        style={{ opacity: strength, transform: `translate(${featured ? 8 : 14}px, -50%)` }}
        className={`whitespace-nowrap transition-opacity duration-200 ${
          featured ? 'text-[15px] text-[#ECE8DF]' : 'text-[11px] text-[#ECE8DF]'
        }`}
      >
        {text}
      </div>
    </Html>
  );
}

function QuietStar({ star, position, hovered, dimmed, selected, coarse, onHover, onSelect }: StarProps) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, dt) => {
    if (!mat.current) return;
    const target = (dimmed ? 0.25 : 1.1) * (hovered || selected ? 1.9 : 1);
    mat.current.emissiveIntensity += (target - mat.current.emissiveIntensity) * Math.min(1, dt * 8);
  });
  return (
    <group position={position}>
      <mesh {...hitHandlers(star, onHover, onSelect)}>
        <sphereGeometry args={[coarse ? 0.9 : 0.6, 8, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      <mesh raycast={() => null}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial ref={mat} color={star.color} emissive={star.color} emissiveIntensity={1.1} />
      </mesh>
      <Label text={star.project.name} strength={hovered || selected ? 1 : dimmed ? 0.15 : 0.5} featured={false} />
    </group>
  );
}

function FeaturedStar({ star, position, hovered, dimmed, selected, coarse, onHover, onSelect }: StarProps) {
  const active = hovered || selected;
  const motif = star.featured?.motif;
  return (
    <group position={position}>
      <mesh {...hitHandlers(star, onHover, onSelect)}>
        <sphereGeometry args={[coarse ? 2.1 : 1.6, 10, 10]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {motif === 'contour' && <ContourStar color={star.color} active={active} dimmed={dimmed} />}
      {motif === 'orbit' && <OrbitStar color={star.color} active={active} dimmed={dimmed} />}
      {motif === 'eclipse' && <EclipseStar color={star.color} active={active} dimmed={dimmed} />}
      {/* Selected: the focus panel names it. */}
      <Label text={star.project.name} strength={selected ? 0 : active ? 1 : dimmed ? 0.25 : 0.88} featured offset={motif === 'eclipse' ? 1.05 : 2.05} />
    </group>
  );
}

interface MotifProps {
  color: string;
  active: boolean;
  dimmed: boolean;
}

/** A small easing helper for per-frame values kept in refs. */
const ease = (current: number, target: number, dt: number, speed = 4) => current + (target - current) * Math.min(1, dt * speed);

function Core({ color, active, dimmed, radius = 0.3 }: MotifProps & { radius?: number }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, dt) => {
    if (mat.current) mat.current.emissiveIntensity = ease(mat.current.emissiveIntensity, dimmed ? 0.3 : active ? 2.2 : 1.4, dt, 6);
  });
  return (
    <mesh raycast={() => null}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial ref={mat} color={color} emissive={color} emissiveIntensity={1.4} />
    </mesh>
  );
}

/** TerraTrace: irregular contour rings, like elevation lines around a summit. They open out when the star is lit. */
function ContourStar(props: MotifProps) {
  const rings = useMemo(
    () =>
      [0.62, 0.95, 1.32, 1.75].map((r, i) =>
        Array.from({ length: 97 }, (_, k) => {
          const a = (k / 96) * Math.PI * 2;
          const wobble = 1 + 0.09 * Math.sin(3 * a + i * 1.3) + 0.05 * Math.sin(5 * a + i * 2.1);
          return new THREE.Vector3(Math.cos(a) * r * wobble, Math.sin(a) * r * wobble, 0);
        }),
      ),
    [],
  );
  const group = useRef<THREE.Group>(null);
  const spread = useRef(1);
  useFrame(({ clock }, dt) => {
    spread.current = ease(spread.current, props.active ? 1.22 : 1, dt, 3);
    group.current?.children.forEach((child, i) => {
      const breathe = 1 + Math.sin(clock.elapsedTime * 0.5 + i * 0.9) * 0.025;
      child.scale.setScalar((1 + (spread.current - 1) * (i + 1) * 0.6) * breathe);
    });
    if (group.current) group.current.rotation.z += dt * 0.03;
  });
  return (
    <>
      <Core {...props} radius={0.28} />
      <group ref={group} rotation={[-1.05, 0, 0]}>
        {rings.map((points, i) => (
          <Line
            key={i}
            points={points}
            color={props.color}
            lineWidth={1}
            transparent
            opacity={(props.dimmed ? 0.12 : props.active ? 0.85 : 0.5) * (1 - i * 0.16)}
          />
        ))}
      </group>
    </>
  );
}

/** Longsignal: small bodies on their own orbits; when lit, threads appear between them, a network forming. */
function OrbitStar(props: MotifProps) {
  const orbits = useMemo(
    () => [
      { r: 0.8, speed: 0.55, tilt: [0.9, 0.2, 0] as Vec3Tuple, phase: 0 },
      { r: 1.15, speed: -0.38, tilt: [1.3, -0.4, 0.3] as Vec3Tuple, phase: 2 },
      { r: 1.5, speed: 0.27, tilt: [0.6, 0.6, -0.2] as Vec3Tuple, phase: 4 },
      { r: 1.85, speed: -0.2, tilt: [1.1, 0.1, 0.8] as Vec3Tuple, phase: 1 },
    ],
    [],
  );
  const bodies = useRef<(THREE.Mesh | null)[]>([]);
  const threads = useMemo(() => new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(12 * 3), 3)), []);
  const threadMat = useRef<THREE.LineBasicMaterial>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const eulers = useMemo(() => orbits.map((o) => new THREE.Euler(...o.tilt)), [orbits]);

  useFrame(({ clock }, dt) => {
    const pts: THREE.Vector3[] = [];
    orbits.forEach((o, i) => {
      const a = clock.elapsedTime * o.speed + o.phase;
      tmp.set(Math.cos(a) * o.r, Math.sin(a) * o.r, 0).applyEuler(eulers[i]);
      bodies.current[i]?.position.copy(tmp);
      pts.push(tmp.clone());
    });
    // Threads: each body to the next, and each to the centre.
    const arr = threads.attributes.position.array as Float32Array;
    let j = 0;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      arr.set([a.x, a.y, a.z, b.x, b.y, b.z], j);
      j += 6;
    }
    for (let i = 0; i < 2; i++) {
      const a = pts[i * 2];
      arr.set([0, 0, 0, a.x, a.y, a.z], j);
      j += 6;
    }
    threads.attributes.position.needsUpdate = true;
    if (threadMat.current) threadMat.current.opacity = ease(threadMat.current.opacity, props.active ? 0.6 : 0, dt, 4);
  });

  return (
    <>
      <Core {...props} radius={0.26} />
      {orbits.map((o, i) => (
        <group key={i} rotation={o.tilt}>
          <Line
            points={Array.from({ length: 65 }, (_, k) => {
              const a = (k / 64) * Math.PI * 2;
              return new THREE.Vector3(Math.cos(a) * o.r, Math.sin(a) * o.r, 0);
            })}
            color={props.color}
            lineWidth={0.6}
            transparent
            opacity={props.dimmed ? 0.05 : props.active ? 0.3 : 0.14}
          />
        </group>
      ))}
      {orbits.map((_, i) => (
        <mesh key={i} ref={(m) => {
            bodies.current[i] = m;
          }} raycast={() => null}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={props.color} emissive={props.color} emissiveIntensity={props.dimmed ? 0.3 : 1.6} />
        </mesh>
      ))}
      <lineSegments geometry={threads} raycast={() => null}>
        <lineBasicMaterial ref={threadMat} color={props.color} transparent opacity={0} />
      </lineSegments>
    </>
  );
}

/** Ashwake: a dark body with an ember corona, and a few embers drifting up through it. */
function EclipseStar(props: MotifProps) {
  const corona = useRef<THREE.MeshBasicMaterial>(null);
  const halo = useRef<THREE.Group>(null);
  const embers = useRef<THREE.Points>(null);
  const emberData = useMemo(() => {
    const rand = seeded(42);
    const n = 26;
    const pos = new Float32Array(n * 3);
    const speed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (rand() - 0.5) * 2.6;
      pos[i * 3 + 1] = (rand() - 0.5) * 2.6;
      pos[i * 3 + 2] = (rand() - 0.5) * 1.2;
      speed[i] = 0.08 + rand() * 0.16;
    }
    return { pos, speed, n };
  }, []);

  useFrame((_, dt) => {
    if (corona.current) corona.current.opacity = ease(corona.current.opacity, props.dimmed ? 0.25 : props.active ? 1 : 0.75, dt, 4);
    if (halo.current) halo.current.scale.setScalar(ease(halo.current.scale.x, props.active ? 1.12 : 1, dt, 3));
    const attr = embers.current?.geometry.attributes.position;
    if (attr) {
      const arr = attr.array as Float32Array;
      for (let i = 0; i < emberData.n; i++) {
        arr[i * 3 + 1] += emberData.speed[i] * dt * (props.active ? 2.2 : 1);
        if (arr[i * 3 + 1] > 1.6) arr[i * 3 + 1] = -1.6;
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <>
      <mesh raycast={() => null}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#020306" />
      </mesh>
      <Billboard>
        <group ref={halo}>
          <mesh raycast={() => null} position={[0, 0, -0.02]}>
            <ringGeometry args={[0.5, 0.58, 64]} />
            <meshBasicMaterial ref={corona} color={props.color} transparent opacity={0.75} toneMapped={false} />
          </mesh>
          <mesh raycast={() => null} position={[0, 0, -0.04]}>
            <ringGeometry args={[0.58, 0.95, 64]} />
            <meshBasicMaterial color={props.color} transparent opacity={props.dimmed ? 0.02 : 0.06} />
          </mesh>
        </group>
      </Billboard>
      <points ref={embers} raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[emberData.pos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#E09A6E" transparent opacity={props.dimmed ? 0.2 : 0.8} depthWrite={false} />
      </points>
    </>
  );
}
