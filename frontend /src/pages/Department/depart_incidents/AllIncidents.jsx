import { useEffect, useState } from "react";
import styles from "./AllIncidents.module.css";
import ReportDetailView from "../../../components/report_detail/ReportDetailView";
import { useDepart } from "../../../contexts/DepartContext";

function AllIncidents() {
  const { fetchDepartReports, departReports } = useDepart();
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchDepartReports();
  }, [fetchDepartReports]);

  if (!departReports) return <div> ... loading </div>;

  const departIncidents = departReports;
  if (selectedReport) {
    return (
      <ReportDetailView
        report={selectedReport}
        onBack={() => setSelectedReport(null)}
        viewingAs="department"
      />
    );
  }
  return (
    <div className={styles.contentFade}>
      <h2 className={styles.pageTitle}>All Incident Logs</h2>
      <div className={styles.tableContainer}>
        <table className={styles.rawTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Incident</th>
              <th>Location</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {departIncidents?.map((i) => {
              const sta = i.status.replaceAll(" ", "").toLowerCase();
              return (
                <tr key={i.report_id}>
                  <td className={styles.fontMono} data-label="ID">
                    {i.report_id}
                  </td>
                  <td data-label="Incident">{i.title}</td>
                  <td data-label="Location">{i.location}</td>
                  <td data-label="Status">
                    <span
                      className={[styles.statusPill, styles[sta]].join(" ")}
                    >
                      {i.status}
                    </span>
                  </td>
                  <td data-label="Action">
                    <button
                      className={styles.btnText}
                      onClick={() => setSelectedReport(i)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllIncidents;
