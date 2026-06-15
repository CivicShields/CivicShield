import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router-dom";

const DepartContext = createContext(null);

export function DepartProvider({ children }) {
  const [departReports, setDepartReports] = useState([]);
  const [name, setName] = useState(null);
  const { user } = useAuth();
  const location = useLocation();

  // Check if the current URL path starts with /dept/
  const isDeptRoute = location.pathname.startsWith("/dept/");

  useEffect(() => {
    async function loadName() {
      const req = await fetch(`/departments/${user.department_id}/`, {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) {
        return setName(res.department.name);
      }
    }
    if (isDeptRoute) loadName();
  }, [user, isDeptRoute]);

  const fetchDepartReports = useCallback(async () => {
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
    [],
  );

  return (
    <DepartContext.Provider
      value={{
        departReports,
        name,
        isDeptRoute,
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
  return context;
}
