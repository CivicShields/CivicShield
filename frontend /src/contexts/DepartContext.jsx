import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";

const DepartContext = createContext(null);

export function DepartProvider({ children }) {
  const [departReports, setDepartReports] = useState([]);
  const [name, setName] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function loadName() {
      if (!user) throw new Error("No user is logged in");
      const req = await fetch(`/departments/${user.department_id}/`, {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) {
        return setName(res.department.name);
      }
    }
    loadName();
  }, [user]);

  const fetchDepartReports = useCallback(async () => {
    if (!user) throw new Error("No user is logged in");
    const req = await fetch(`/departments/${user.department_id}/incidents/`, {
      credentials: "include",
    });
    const res = await req.json();
    if (res.success) {
      setDepartReports(res.incidents);
      return res.incidents;
    }
  }, [user]);

  const changeStatus = useCallback(
    async (incident_id, newStatus = "in_progress") => {
      if (!user) throw new Error("No user is logged in");
      const req = await fetch(`/incident/department/${incident_id}/status/`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) {
        return res;
      }
    },
    [user],
  );

  return (
    <DepartContext.Provider
      value={{
        departReports,
        name,
        changeStatus,
        fetchDepartReports,
      }}
    >
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
