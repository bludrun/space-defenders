import { useAuth } from "react-oidc-context";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export function Auth() {
  const auth = useAuth();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSignIn = async () => {
    try {
      await auth.signinRedirect();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      const userData = {
        email: auth.user.profile.email,
        name: auth.user.profile["cognito:username"],
        sub: auth.user.profile.sub,
      };
      setUser(userData);
    }
  }, [auth.isAuthenticated, auth.user, setUser]);

  if (auth.isLoading) {
    return (
      <div className="fixed inset-0 bg-[url('/space-background.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="fixed inset-0 bg-[url('/space-background.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="bg-red-500/80 backdrop-blur-sm p-6 rounded-lg text-white">
          <p className="text-xl">Error: {auth.error.message}</p>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[url('/space-background.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="max-w-md w-full mx-4 bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Space Defender
            </h1>
            <p className="text-gray-300">
              Defend the galaxy from incoming threats
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h2 className="text-white text-lg mb-2">Features:</h2>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">🚀</span> Multiple spaceships to choose
                  from
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🎮</span> Action-packed gameplay
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🏆</span> Global leaderboards
                </li>
              </ul>
            </div>

            <button
              onClick={handleSignIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 flex items-center justify-center group"
            >
              <span>Sign in</span>
              <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
