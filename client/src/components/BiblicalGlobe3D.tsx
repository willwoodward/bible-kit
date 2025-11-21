import { useRef, useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Cone } from '@react-three/drei';
import * as THREE from 'three';
import { biblicalLocations } from '../data/biblicalLocations';

function LocationMarker({ lat, lng, name, description }: { lat: number; lng: number; name: string; description: string }) {
  const [hovered, setHovered] = useState(false);
  const markerRef = useRef<THREE.Group>(null);

  // Convert lat/lng to 3D coordinates on sphere (radius = 2)
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const radius = 2.05; // Slightly above sphere surface

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  // Calculate rotation to point marker outward from globe center
  const outwardVector = new THREE.Vector3(x, y, z).normalize();
  const upVector = new THREE.Vector3(0, 1, 0);
  const rotationMatrix = new THREE.Matrix4().lookAt(
    new THREE.Vector3(0, 0, 0),
    outwardVector,
    upVector
  );
  const rotation = new THREE.Euler().setFromRotationMatrix(rotationMatrix);

  return (
    <group position={[x, y, z]} rotation={rotation} ref={markerRef}>
      {/* Pin marker shape (teardrop/location pin) */}
      <group
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Top sphere (round part of pin) */}
        <Sphere args={[0.025, 16, 16]} position={[0, 0.035, 0]}>
          <meshStandardMaterial
            color={hovered ? '#93c5fd' : '#60a5fa'}
            emissive={hovered ? '#60a5fa' : '#3b82f6'}
            emissiveIntensity={hovered ? 0.4 : 0.2}
          />
        </Sphere>

        {/* Bottom cone (pointed part of pin) */}
        <Cone args={[0.02, 0.04, 16]} position={[0, 0.015, 0]} rotation={[Math.PI, 0, 0]}>
          <meshStandardMaterial
            color={hovered ? '#93c5fd' : '#60a5fa'}
            emissive={hovered ? '#60a5fa' : '#3b82f6'}
            emissiveIntensity={hovered ? 0.4 : 0.2}
          />
        </Cone>
      </group>

      {hovered && (
        <Html distanceFactor={20} position={[0, 0.06, 0]}>
          <div className="bg-white dark:bg-zinc-900 px-1 py-0.5 rounded shadow border border-zinc-200 dark:border-zinc-700 pointer-events-none whitespace-nowrap text-[8px] font-normal text-zinc-900 dark:text-zinc-100">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}

function Globe() {
  const globeRef = useRef<THREE.Mesh>(null);
  const [twoToneTexture, setTwoToneTexture] = useState<THREE.Texture | null>(null);

  // Load Earth land/ocean mask (specular map - bright=water, dark=land)
  const maskTexture = useLoader(
    THREE.TextureLoader,
    '/textures/earth_mask.jpg'
  );

  // Process mask to create two-tone effect (dark grey ocean, light grey land)
  useEffect(() => {
    if (maskTexture && !twoToneTexture) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const img = maskTexture.image;
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original mask
        ctx.drawImage(img, 0, 0);

        // Get image data and process pixels
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Convert mask to two-tone: dark grey (#3f3f46) for ocean, light grey (#d4d4d8) for land
        // Specular map: bright pixels = water (reflective), dark pixels = land (non-reflective)
        for (let i = 0; i < data.length; i += 4) {
          // Convert to grayscale
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;

          // Invert: bright in mask = ocean, dark in mask = land
          if (gray > 128) {
            // Ocean - dark grey
            data[i] = 63;     // R
            data[i + 1] = 63; // G
            data[i + 2] = 70; // B
          } else {
            // Land - light grey
            data[i] = 212;    // R
            data[i + 1] = 212; // G
            data[i + 2] = 216; // B
          }
        }

        ctx.putImageData(imageData, 0, 0);

        // Create new texture from processed canvas
        const newTexture = new THREE.CanvasTexture(canvas);
        newTexture.needsUpdate = true;
        setTwoToneTexture(newTexture);
      }
    }
  }, [maskTexture, twoToneTexture]);

  return (
    <group>
      {/* Main globe with two-tone texture */}
      <Sphere ref={globeRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          map={twoToneTexture || maskTexture}
          roughness={0.9}
          metalness={0.1}
        />
      </Sphere>

      {/* Latitude/longitude grid */}
      <Sphere args={[2.005, 32, 32]}>
        <meshBasicMaterial
          color="#52525b"
          wireframe
          transparent
          opacity={0.15}
        />
      </Sphere>

      {/* Location markers */}
      {biblicalLocations.map((location, idx) => (
        <LocationMarker
          key={idx}
          lat={location.lat}
          lng={location.lng}
          name={location.name}
          description={location.description}
        />
      ))}
    </group>
  );
}

export function BiblicalGlobe3D() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-black">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />

        <Globe />

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
