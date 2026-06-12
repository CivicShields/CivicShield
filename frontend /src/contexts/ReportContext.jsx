import { createContext, useContext, useCallback, useState } from "react";
import { useAuth } from "./AuthContext";
import { getReportsRequest } from "../services/ReportService";

const ReportContext = createContext(null);

export function ReportProvider({ children }) {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);

  const fetchReports = useCallback(async () => {
    if (!user) throw new Error("No user is logged in");
    const { reports: data } = await getReportsRequest(user.id);
    setReports(data);
    return data;
  }, [user]);

  return (
    <ReportContext.Provider value={{ reports, fetchReports }}>
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
