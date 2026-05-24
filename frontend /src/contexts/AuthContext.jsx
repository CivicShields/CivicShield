// contexts/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback(async (email, password) => {
    const { loginRequest } = await import("../services/AuthService");
    const { serverResponse } = await loginRequest(email, password);
    setUser(serverResponse);
    return serverResponse;
  }, []);

  const changePassword = useCallback(
    async (oldPassword, newPassword) => {
      if (!user) {
        throw new Error("You must be logged in to change password");
      }
      const { changePasswordRequest } = await import("../services/AuthService");
      const { serverResponse } = await changePasswordRequest(
        oldPassword,
        newPassword,
      );
      return serverResponse;
    },
    [user],
  );

  const fetchCurrentUser = useCallback(async () => {
    if (!user) {
      throw new Error("No user is logged in");
    }
    const { getCurrentUserRequest } = await import("../services/AuthService");
    const { serverResponse } = await getCurrentUserRequest();
    return serverResponse;
  }, [user]);

  const register = useCallback(async (email, password, name, number = "") => {
    const { registerRequest } = await import("../services/AuthService");
    const { serverResponse } = await registerRequest(
      email,
      password,
      name,
      number,
    );
    setUser(serverResponse);
    return serverResponse;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("userToken");
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        fetchCurrentUser,
        login,
        register,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
