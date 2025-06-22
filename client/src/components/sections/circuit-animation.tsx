import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";

// Generate circuit paths
function generateCircuitPath(startPoint: Vector3, depth: number = 0): Vector3[] {
  if (depth > 3) return [startPoint];

  const points: Vector3[] = [startPoint];
  const directions = [
    [1, 0, 0],
    [0, 1, 0],
    [-1, 0, 0],
    [0, -1, 0]
  ];

  const dir = directions[Math.floor(Math.random() * directions.length)];
  const length = 1 + Math.random() * 2;

  const nextPoint = new Vector3(
    startPoint.x + dir[0] * length,
    startPoint.y + dir[1] * length,
    startPoint.z + dir[2] * length
  );

  points.push(nextPoint);

  if (Math.random() > 0.5) {
    const branchPoints = generateCircuitPath(nextPoint, depth + 1);
    points.push(...branchPoints.slice(1));
  }

  return points;
}

// Circuit trace component with pulse animation
function CircuitTrace({ points }: { points: Vector3[] }) {
  const ref = useRef<any>();
  const pulseRef = useRef(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    pulseRef.current = (time % 2) / 2;

    if (ref.current?.material) {
      ref.current.material.dashOffset = -time * 0.5;
      ref.current.material.opacity = 0.4 + Math.sin(time * 2) * 0.3;
    }
  });

  return (
    <Line
      ref={ref}
      points={points}
      color="#00F0FF"
      lineWidth={2}
      dashed
      dashScale={2}
      dashSize={0.4}
      dashOffset={0}
      transparent
      opacity={0.7}
    />
  );
}

// Connection nodes at circuit intersections
function CircuitNode({ position }: { position: Vector3 }) {
  const meshRef = useRef<any>();
  const pulseRef = useRef(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    pulseRef.current = (Math.sin(time * 2) + 1) / 2;

    if (meshRef.current?.material) {
      meshRef.current.material.emissiveIntensity = 0.7 + pulseRef.current * 0.5;
    }
  });

  return (
    <mesh position={position} ref={meshRef}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshPhysicalMaterial
        color="#00F0FF"
        emissive="#00F0FF"
        emissiveIntensity={1}
        transparent
        opacity={0.9}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

// Generate the full circuit board
function CircuitBoard() {
  const circuits = Array.from({ length: 15 }, (_, i) => {
    const startX = (Math.random() - 0.5) * 20;
    const startY = (Math.random() - 0.5) * 20;
    return generateCircuitPath(new Vector3(startX, startY, 0));
  });

  return (
    <group>
      {circuits.map((points, i) => (
        <group key={i}>
          <CircuitTrace points={points} />
          {points.map((point, j) => (
            <CircuitNode key={`${i}-${j}`} position={point} />
          ))}
        </group>
      ))}
    </group>
  );
}

// Camera animation
function CameraRig() {
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(time * 0.1) * 2;
    state.camera.position.y = Math.cos(time * 0.1) * 2;
    state.camera.position.z = 15;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

// Main component
export default function CircuitAnimation() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <CameraRig />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <CircuitBoard />
      </Canvas>
    </div>
  );
}