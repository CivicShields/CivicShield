import { createContext, useContext, useCallback, useState } from "react";
import { useAuth } from "./AuthContext";
import { changeReportStatusRequest } from "../services/DepartService";

const DepartContext = createContext(null);

export function DepartProvider({ children }) {
  const [departReports, setDepartReports] = useState([]);
  const { user } = useAuth();

  const fetchDepartReports = useCallback(async () => {
    if (!user) throw new Error("No user is logged in");
    const req = await fetch(`/departments/${user.department_id}/incidents/`, {
      credentials: "include",
    });
    const res = await req.json();
    console.log(res);
    if (res.success) {
      setDepartReports(res.incidents);
      return res.incidents;
    }
    console.error(res.error);
  }, [user]);

  const changeStatus = useCallback(
    async (reportID, newStatus = "In Progress") => {
      if (!user) throw new Error("No user logged in");
      await changeReportStatusRequest(reportID, newStatus);
      setDepartReports((prev) =>
        prev.map((departReports) =>
          departReports.report_id === reportID
            ? { ...departReports, status: newStatus }
            : departReports,
        ),
      );
    },
    [user],
  );

  return (
    <DepartContext.Provider
      value={{ departReports, changeStatus, fetchDepartReports }}
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
