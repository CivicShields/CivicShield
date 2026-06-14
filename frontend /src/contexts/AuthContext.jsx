// contexts/AuthContext.jsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const req = await fetch("/auth/me/", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const res = await req.json();
        setUser(res.user);
      } finally {
        setIsInitializing(false);
      }
    }
    initializeAuth();
  }, []);

  const logout = useCallback(async () => {
    await fetch("/auth/logout/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        logout,
        setUser,
      }}
    >
      {isInitializing ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div>Loading your session...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
