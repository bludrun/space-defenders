import { create } from "zustand";

interface GameState {
  score: number;
  highScore: number;
  gameOver: boolean;
  lives: number;
  level: number;
  isPaused: boolean;
  updateScore: (points: number) => void;
  resetGame: () => void;
  setGameOver: () => void;
  decreaseLives: () => void;
  togglePause: () => void;
  selectedShip: number;
  setSelectedShip: (shipId: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  highScore: parseInt(localStorage.getItem("highScore") || "0"),
  gameOver: false,
  isPaused: false,
  lives: 5,
  level: 1,
  selectedShip: 1,
  updateScore: (points) =>
    set((state) => {
      const newScore = state.score + points;
      const newHighScore = Math.max(newScore, state.highScore);
      if (newHighScore > state.highScore) {
        localStorage.setItem("highScore", newHighScore.toString());
      }
      const newLevel = Math.floor(newScore / 1000) + 1;
      return {
        score: newScore,
        highScore: newHighScore,
        level: newLevel,
      };
    }),
  resetGame: () =>
    set((state) => ({
      score: 0,
      gameOver: false,
      isPaused: false,
      lives: 5,
      level: 1,
      highScore: state.highScore,
    })),
  setGameOver: () => set({ gameOver: true }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  decreaseLives: () =>
    set((state) => {
      const newLives = state.lives - 1;
      if (newLives <= 0) {
        return { lives: 0, gameOver: true };
      }
      return { lives: newLives };
    }),
  setSelectedShip: (shipId) => set({ selectedShip: shipId }),
}));
