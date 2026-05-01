import { useState, useEffect } from "react";
import { useReport } from "../contexts/ReportContext";

function MyReports() {
    const { fetchReports } = useReport();
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetchReports().then(setReports).catch(console.error);
    }, [fetchReports]);

    return reports
}

export default MyReports;