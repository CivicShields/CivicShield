import { useState, useEffect } from "react";
import { useReport } from "../contexts/ReportContext";

function GetReports() {
    const { fetchReports } = useReport();
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetchReports().then(setReports).catch(console.error);
    }, [fetchReports]);

    return reports
}

export default GetReports;