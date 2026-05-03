import { createContext, useContext, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getDepartmentNamesRequest } from "../services/DepartService";

const DepartContext = createContext(null);

export function DepartProvider({ children }) {
  const { user } = useAuth();

  const fetchDeparts = useCallback(async () => {
    if (!user) throw new Error("No user is logged in");
    const { departs } = await getDepartmentNamesRequest();
    return departs;
  }, [user]);

  return (
    <DepartContext.Provider value={{ fetchDeparts }}>
      {children}
    </DepartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDepart() {
  const context = useContext(DepartContext);
  if (!context) {
    throw new Error("useDepart must be used inside a DepartProvider");
  }
  return context;
}
