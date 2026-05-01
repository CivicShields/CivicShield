import { createContext, useContext, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getReportsRequest, addReportRequest } from "../services/ReportService";

const ReportContext = createContext(null);

export function ReportProvider({ children }) {
  const { user } = useAuth();

  const fetchReports = useCallback(async () => {
    if (!user) throw new Error("No user is logged in");
    const { reports } = await getReportsRequest(user.email);
    return reports;
  }, [user]);

  const addReport = useCallback(
    async (reportData) => {
      if (!user) throw new Error("No user is logged in");
      const { report } = await addReportRequest(user.email, reportData);
      return report;
    },
    [user],
  );

  return (
    <ReportContext.Provider value={{ fetchReports, addReport }}>
      {children}
    </ReportContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReport() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReport must be used inside a ReportProvider");
  }
  return context;
}
