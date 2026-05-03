import React, { useState, useMemo } from "react";
import styles from "./MyReport.module.css";
import AllDeparts from "../../../../utilities/GetDeparts";
import GetReports from "../../../../utilities/GetReports";
import { getElapsedTime } from "../../../../utilities/Date_utilities";

const MyReports = () => {
  const [filter, setFilter] = useState({
    status: "All",
    department: "All",
    type: "All",
    sortTime: "latest",
  });

  const reports = GetReports();

  const processedReports = useMemo(() => {
    return reports
      .filter((r) => filter.status === "All" || r.status === filter.status)
      .filter(
        (r) =>
          filter.department === "All" || r.department === filter.department,
      )
      .filter((r) => filter.type === "All" || r.category === filter.type)
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return filter.sortTime === "latest" ? dateB - dateA : dateA - dateB;
      });
  }, [filter, reports]);

  const Departments = AllDeparts().map((depart, index) => (
    <option value={depart} key={index}>
      {depart}
    </option>
  ));

  return (
    <div className={styles.reportsContainer}>
      <section className={styles.filterBarSection}>
        <div>
          <label className={styles.labelStyle}>Status</label>
          <select
            className={styles.selectStyle}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div>
          <label className={styles.labelStyle}>Time</label>
          <select
            className={styles.selectStyle}
            onChange={(e) => setFilter({ ...filter, sortTime: e.target.value })}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div>
          <label className={styles.labelStyle}>Department</label>
          <select
            className={styles.selectStyle}
            onChange={(e) =>
              setFilter({ ...filter, department: e.target.value })
            }
          >
            <option value="All">All Departments</option>
            {Departments}
          </select>
        </div>

        <div>
          <label className={styles.labelStyle}>Accident Type</label>
          <select
            className={styles.selectStyle}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            <option value="All">All Types</option>
            <option value="Fall">Fall</option>
            <option value="Electrical">Electrical</option>
            <option value="Fire Safety">Fire Safety</option>
          </select>
        </div>
      </section>

      {/* Reports List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {processedReports.map((report) => (
          <div key={report.report_id} className={styles.reportRowStyle}>
            <div>
              <div style={{ fontWeight: "600" }}>
                {report.title} - {report.location}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginTop: "12px",
                }}
              >
                {report.category} • Reported {getElapsedTime(report.created_at)}
              </div>
            </div>
            <div style={getStatusStyle(report.status)}>{report.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getStatusStyle = (status) => ({
  fontSize: "0.75rem",
  fontWeight: "600",
  padding: "0.25rem 0.8rem",
  borderRadius: "20px",
  whiteSpace: "nowrap",
  textTransform: "capitalize",
  backgroundColor:
    status === "Resolved"
      ? "rgba(50, 164, 12, 0.1)"
      : status === "In Progress"
        ? "rgba(63, 201, 232, 0.1)"
        : "rgba(234, 96, 22, 0.1)",
  color:
    status === "Resolved"
      ? "rgb(50, 164, 12)"
      : status === "In Progress"
        ? "rgb(63, 201, 232)"
        : "rgb(234, 96, 22)",
  border:
    status === "Resolved"
      ? "1px solid rgb(50, 164, 12)"
      : status === "In Progress"
        ? "1px solid rgb(63, 201, 232)"
        : "1px solid rgb(234, 96, 22)",
});

export default MyReports;
