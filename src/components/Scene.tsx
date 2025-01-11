import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, useMemo } from "react";
import { Mesh, Vector3, TextureLoader } from "three";
import { useGameStore } from "../store/gameStore";
import gsap from "gsap";

interface Bullet {
  position: Vector3;
  velocity: Vector3;
  id: number;
}

interface Star {
  position: Vector3;
  size: number;
}

export function Scene() {
  const rocketRef = useRef<Mesh>(null);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [craters, setCraters] = useState<Vector3[]>([]);
  const lastCraterSpawn = useRef(0);
  const lastBulletSpawn = useRef(0);
  const bulletIdCounter = useRef(0);
  const gameStore = useGameStore();
  const moveDirection = useRef(0);

  // Move texture loading inside the component
  const spaceshipTexture = useMemo(() => {
    const textureLoader = new TextureLoader();
    return textureLoader.load(`/spaceship${gameStore.selectedShip}.png`);
  }, [gameStore.selectedShip]);

  const spawnCrater = () => {
    const x = (Math.random() - 0.5) * 10;
    const newCrater = new Vector3(x, 10, 0);
    setCraters((prev) => [...prev, newCrater]);
  };

  const spawnBullet = () => {
    if (!rocketRef.current) return;

    const bulletVelocity = new Vector3(0, 1, 0).multiplyScalar(8);
    const bulletPosition = new Vector3(rocketRef.current.position.x, -3.5, 0);

    setBullets((prev) => [
      ...prev,
      {
        position: bulletPosition,
        velocity: bulletVelocity,
        id: bulletIdCounter.current++,
      },
    ]);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!rocketRef.current || gameStore.gameOver || gameStore.isPaused) return;

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
      moveDirection.current = -1;
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
      moveDirection.current = 1;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
      if (moveDirection.current === -1) moveDirection.current = 0;
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
      if (moveDirection.current === 1) moveDirection.current = 0;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Keep only the memoized version
  const stars = useMemo(() => {
    const initialStars: Star[] = [];
    for (let i = 0; i < 200; i++) {
      initialStars.push({
        position: new Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          -5
        ),
        size: Math.random() * 0.05 + 0.01,
      });
    }
    return initialStars;
  }, []);

  useFrame((_, delta) => {
    if (gameStore.gameOver || gameStore.isPaused) return;

    // Use requestAnimationFrame timing instead of Date.now()
    const now = performance.now();

    // Smooth continuous movement with optimized interpolation
    if (rocketRef.current) {
      const speed = 10;
      const currentX = rocketRef.current.position.x;
      const targetX = currentX + moveDirection.current * speed * delta;
      const clampedX = Math.max(-5, Math.min(5, targetX));
      rocketRef.current.position.x = clampedX;
    }

    // Optimize spawn intervals using performance.now()
    const spawnInterval = Math.max(1000 - gameStore.level * 50, 300);
    if (now - lastCraterSpawn.current > spawnInterval) {
      spawnCrater();
      lastCraterSpawn.current = now;
    }

    if (now - lastBulletSpawn.current > 500) {
      spawnBullet();
      lastBulletSpawn.current = now;
    }

    // Batch updates together
    requestAnimationFrame(() => {
      // Update bullets
      setBullets((prev) =>
        prev
          .map((bullet) => ({
            ...bullet,
            position: bullet.position
              .clone()
              .add(bullet.velocity.clone().multiplyScalar(delta)),
          }))
          .filter((bullet) => bullet.position.y < 15)
      );

      // Update craters
      setCraters((prev) => {
        const updatedCraters = prev
          .map((crater) => {
            const newY = crater.y - delta * (2 + gameStore.level * 0.2);
            return new Vector3(crater.x, newY, 0);
          })
          .filter((crater) => {
            if (crater.y < -5) {
              gameStore.decreaseLives();
              return false;
            }
            return true;
          });

        // Check collisions
        bullets.forEach((bullet) => {
          updatedCraters.forEach((crater, craterIndex) => {
            if (crater.y <= 10 && bullet.position.distanceTo(crater) < 0.5) {
              updatedCraters.splice(craterIndex, 1);
              gameStore.updateScore(100);
            }
          });
        });

        return updatedCraters;
      });
    });
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <hemisphereLight color="#ffffff" groundColor="#000000" intensity={0.5} />

      {/* Background stars */}
      {stars.map((star, index) => (
        <mesh key={index} position={star.position}>
          <sphereGeometry args={[star.size, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Spaceship sprite */}
      <sprite ref={rocketRef} position={[0, -3, 0]} scale={[0.3, 0.3, 1]}>
        <spriteMaterial
          attach="material"
          map={spaceshipTexture}
          transparent={true}
          sizeAttenuation={false}
        />
      </sprite>

      {/* Laser beams */}
      {bullets.map((bullet) => (
        <group key={bullet.id} position={bullet.position}>
          {/* Core beam */}
          <mesh>
            <cylinderGeometry
              args={[0.05, 0.05, 0.4, 8]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <meshBasicMaterial color="#ff0000" transparent opacity={0.9} />
          </mesh>
          {/* Outer glow */}
          <mesh>
            <cylinderGeometry
              args={[0.1, 0.1, 0.3, 8]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <meshBasicMaterial color="#ff3333" transparent opacity={0.3} />
          </mesh>
        </group>
      ))}

      {/* Metallic asteroids */}
      {craters.map((position, index) => (
        <group
          key={index}
          position={position}
          rotation={[
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI,
          ]}
        >
          <mesh>
            <icosahedronGeometry args={[0.3, 1]} />
            <meshStandardMaterial
              color="#c0c0c0"
              metalness={0.8}
              roughness={0.2}
              emissive="#404040"
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Increased intensity of the point light */}
          <pointLight color="#ffffff" intensity={1} distance={1} />
        </group>
      ))}
    </>
  );
}
