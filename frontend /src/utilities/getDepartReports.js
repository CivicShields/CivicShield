import { useState, useEffect } from "react";
import { useDepart } from "../contexts/DepartContext";

function GetDepartReports() {
    const { fetchDepartReports } = useDepart();
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetchDepartReports().then(setReports).catch(console.error);
    }, [fetchDepartReports]);

    return reports
}

export default GetDepartReports;