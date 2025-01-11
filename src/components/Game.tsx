import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { GameUI } from "./GameUI";
import { Auth } from "./Auth";
import { useAuthStore } from "../store/authStore";
import { StartPage } from "./StartPage";
import { useState } from "react";

export function Game() {
  const { isAuthenticated } = useAuthStore();
  const [gameStarted, setGameStarted] = useState(false);

  if (!isAuthenticated) {
    return <Auth />;
  }

  if (!gameStarted) {
    return <StartPage onStartGame={() => setGameStarted(true)} />;
  }

  return (
    <div className="w-full h-screen relative">
      <Canvas>
        <Scene />
      </Canvas>
      <GameUI onBackToMenu={() => setGameStarted(false)} />
    </div>
  );
}
