// contexts/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import { getCurrentUserRequest } from "../services/AuthService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback(async (email, password) => {
    const { loginRequest } = await import("../services/AuthService");
    const { user } = await loginRequest(email, password);
    setUser(user);
  }, []);

  const changePass = useCallback(async (email, oldpassword, newpassword) => {
    const { ChangePassRequest } = await import("../services/AuthService");
    const { user } = await ChangePassRequest(email, oldpassword, newpassword);
    setUser(user);
  }, []);

  const changePassword = useCallback(
    async (oldPassword, newPassword) => {
      if (!user) {
        throw new Error("You must be logged in to change password");
      }
      const { changePasswordRequest } = await import("../services/AuthService");
      await changePasswordRequest(user.email, oldPassword, newPassword);
    },
    [user],
  );

  const fetchCurrentUser = useCallback(async () => {
    if (!user) {
      throw new Error("No user is logged in");
    }
    const { getCurrentUserRequest } = await import("../services/AuthService");
    const { user: freshUser } = await getCurrentUserRequest(user.email);
    setUser(freshUser);
    return freshUser;
  }, [user]);

  const register = useCallback(async (email, password, name) => {
    const { registerRequest } = await import("../services/AuthService");
    const { user } = await registerRequest(email, password, name);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
