import { useAuthStore } from "../store/authStore";
import { useGameStore } from "../store/gameStore";
import { useAuth } from "react-oidc-context";

interface StartPageProps {
  onStartGame: () => void;
}

export function StartPage({ onStartGame }: StartPageProps) {
  const { user, setUser } = useAuthStore();
  const auth = useAuth();
  const { setSelectedShip } = useGameStore();

  const spaceships = [
    { id: 1, image: "/spaceship1.png" },
    { id: 2, image: "/spaceship2.png" },
    { id: 3, image: "/spaceship3.png" },
  ];

  const handleShipSelect = (shipId: number) => {
    setSelectedShip(shipId);
    onStartGame();
  };

  const handleLogout = () => {
    auth.removeUser();
    setUser(null);
  };

  const handleLogin = () => {
    auth.signinRedirect();
  };

  return (
    <div className="fixed inset-0 bg-[url('/space-background.jpg')] bg-cover bg-center flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white">Space Defenders</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-white">Welcome, {user.name}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        <h2 className="text-2xl text-white text-center mb-12">
          Choose Your Ship
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {spaceships.map((ship) => (
            <div
              key={ship.id}
              onClick={() => handleShipSelect(ship.id)}
              className="group relative flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-blue-500/10 rounded-lg backdrop-blur-sm group-hover:bg-blue-500/20 transition-all duration-300" />
              <img
                src={ship.image}
                alt={`Spaceship ${ship.id}`}
                className="w-48 h-48 object-contain transform group-hover:scale-110 transition-transform duration-300 animate-float cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 //done