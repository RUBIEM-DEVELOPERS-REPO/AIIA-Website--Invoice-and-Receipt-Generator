import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Float } from "@react-three/drei";
import { Vector3 } from "three";

// Neural network node
function Neuron({ position, layer }: { position: [number, number, number]; layer: string }) {
  const meshRef = useRef<any>();
  const pulseRef = useRef(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    pulseRef.current = (Math.sin(time * 2) + 1) / 2;

    if (meshRef.current?.material) {
      meshRef.current.material.emissiveIntensity = 0.7 + pulseRef.current * 0.5;
    }
  });

  const size = 0.2;
  const color = layer === "input" ? "#FF00FF" : "#00FFFF";

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh position={position} ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.9}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

// Neural connection
function Connection({ start, end }: { start: Vector3; end: Vector3 }) {
  const ref = useRef<any>();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ref.current?.material) {
      ref.current.material.dashOffset = -time * 0.5;
      ref.current.material.opacity = (Math.sin(time * 2) * 0.3 + 0.7);
    }
  });

  return (
    <Line
      ref={ref}
      points={[start, end]}
      color="#00FFFF"
      lineWidth={1}
      dashed
      dashScale={3}
      dashSize={0.3}
      dashOffset={0}
      transparent
      opacity={0.5}
    />
  );
}

// Camera animation
function CameraRig() {
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(time * 0.1) * 8;
    state.camera.position.y = Math.cos(time * 0.1) * 8;
    state.camera.position.z = 12;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

// Create positions in octagonal pattern
function createOctagonPositions(radius: number, count: number, xOffset: number): Vector3[] {
  const positions: Vector3[] = [];
  const angleStep = (2 * Math.PI) / 8;

  // Create the octagon vertices
  for (let i = 0; i < 8 && positions.length < count; i++) {
    const angle = i * angleStep - Math.PI / 8; // Rotate by 1/8 to align nicely
    const x = xOffset;
    const y = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    positions.push(new Vector3(x, y, z));
  }

  // If we need more positions, add them inside the octagon
  if (count > 8) {
    const innerRadius = radius * 0.5;
    for (let i = 0; i < 8 && positions.length < count; i++) {
      const angle = i * angleStep - Math.PI / 8;
      const x = xOffset;
      const y = Math.sin(angle) * innerRadius;
      const z = Math.cos(angle) * innerRadius;
      positions.push(new Vector3(x, y, z));
    }
  }

  return positions.slice(0, count);
}

// Neural network
function NeuralNetwork() {
  const layers = useMemo(() => {
    const inputNodes = 8;
    const outputNodes = 8;

    const nodes: { position: Vector3; layer: string }[] = [];
    const connections: { start: Vector3; end: Vector3 }[] = [];

    // Create positions for each layer in octagonal patterns
    const inputPositions = createOctagonPositions(3, inputNodes, -4);
    const outputPositions = createOctagonPositions(3, outputNodes, 4);

    // Add nodes for each layer
    inputPositions.forEach(pos => {
      nodes.push({ position: pos, layer: "input" });
    });
    outputPositions.forEach(pos => {
      nodes.push({ position: pos, layer: "output" });
    });

    // Create connections between layers
    const inputLayer = nodes.slice(0, inputNodes);
    const outputLayer = nodes.slice(inputNodes);

    // Connect input to output with some randomness for visual interest
    inputLayer.forEach(input => {
      outputLayer.forEach(output => {
        if (Math.random() > 0.5) {
          connections.push({
            start: input.position,
            end: output.position
          });
        }
      });
    });

    return { nodes, connections };
  }, []);

  return (
    <group>
      {layers.nodes.map((node, i) => (
        <Neuron 
          key={i} 
          position={[node.position.x, node.position.y, node.position.z]}
          layer={node.layer}
        />
      ))}
      {layers.connections.map((conn, i) => (
        <Connection key={i} start={conn.start} end={conn.end} />
      ))}
    </group>
  );
}

// Main component
export default function WireframeAnimation() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <CameraRig />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <NeuralNetwork />
      </Canvas>
    </div>
  );
}