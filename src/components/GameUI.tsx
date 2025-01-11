import { useGameStore } from "../store/gameStore";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export function GameUI({ onBackToMenu }: { onBackToMenu: () => void }) {
  const {
    score,
    highScore,
    lives,
    level,
    gameOver,
    resetGame,
    isPaused,
    togglePause,
  } = useGameStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePause]);

  return (
    <div className="absolute top-0 left-0 w-full h-full p-4 text-white">
      <div className="flex justify-between items-center">
        <div>
          <div>Score: {score}</div>
          <div>High Score: {highScore}</div>
          <div className="text-green-400">
            Player: {user?.name || "Anonymous"}
          </div>
        </div>
        <div>
          <div>Lives: {lives}</div>
          <div>Level: {level}</div>
        </div>
      </div>

      {isPaused && !gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center p-8 bg-gray-800 rounded-lg">
            <h2 className="text-4xl font-bold mb-4">Game Paused</h2>
            <p className="text-xl mb-4">Current Score: {score}</p>
            <div className="space-y-2">
              <button
                onClick={togglePause}
                className="w-full bg-white text-black px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Resume Game
              </button>
              <button
                onClick={resetGame}
                className="w-full bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Restart Game
              </button>
              <button
                onClick={() => {
                  resetGame();
                  onBackToMenu();
                }}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center p-8 bg-gray-800 rounded-lg">
            <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
            <p className="text-xl mb-4">Final Score: {score}</p>
            <div className="space-y-2">
              <button
                onClick={resetGame}
                className="w-full bg-white text-black px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={() => {
                  resetGame();
                  onBackToMenu();
                }}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
