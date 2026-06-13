import React, { useState, useMemo, useEffect } from "react";
import styles from "./MyReport.module.css";
import { getElapsedTime } from "../../../../../utilities/Date_utilities";
import ReportDetailView from "../../../../../components/report_detail/ReportDetailView";
import { incidentCategories } from "../../../../../utilities/Data";

const MyReports = () => {
  const [filter, setFilter] = useState({
    status: "All",
    department: "All",
    type: "All",
    sortTime: "latest",
  });

  const [selectedReport, setSelectedReport] = useState(null);
  const [allDeparts, setAllDeparts] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      const req = await fetch("/incident/reporter/", {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) setReports(res.reports);
    }
    async function fetchDeparts() {
      const req = await fetch("/departments/depart-names/", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (req.ok) {
        const res = await req.json();
        if (res.success) setAllDeparts(res.list);
      }
    }
    fetchDeparts();
    fetchReports();
  }, []);

  const processedReports = useMemo(() => {
    // Safety guard if data is still loading
    if (!reports) return [];

    return reports
      .filter((r) => filter.status === "All" || r.status === filter.status)
      .filter(
        (r) =>
          filter.department === "All" || r.department_id === filter.department,
      )
      .filter((r) => filter.type === "All" || r.category === filter.type)
      .sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return filter.sortTime === "latest" ? dateB - dateA : dateA - dateB;
      });
  }, [filter, reports]);

  if (!reports && !allDeparts) return <div>.... isloading</div>;

  const Departments = allDeparts?.map((depart, index) => (
    <option value={depart.name} key={index}>
      {depart.name}
    </option>
  ));

  const Categories = incidentCategories.map((item) => (
    <option key={item.value} value={item.value}>
      {item.label}
    </option>
  ));

  if (selectedReport) {
    return (
      <ReportDetailView
        report={selectedReport}
        onBack={() => setSelectedReport(null)}
        viewingAs="reporter"
      />
    );
  }

  return (
    <div className={styles.reportsContainer}>
      <section className={styles.filterBarSection}>
        {/* Status Filter */}
        <div>
          <label className={styles.labelStyle}>Status</label>
          <select
            className={styles.selectStyle}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_rogress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Time Filter */}
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

        {/* Department Filter */}
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

        {/* Accident Type Filter */}
        <div>
          <label className={styles.labelStyle}>Accident Type</label>
          <select
            className={styles.selectStyle}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            {Categories}
          </select>
        </div>
      </section>

      {/* Reports List */}
      <div className={styles.reportList}>
        {processedReports.length > 0 ? (
          processedReports.map((report) => {
            return (
              <div
                key={report.id}
                className={styles.reportRowStyle}
                onClick={() => setSelectedReport(report)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <div style={{ fontWeight: "600" }}>
                    {report.title} - {report.named_location}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      marginTop: "12px",
                    }}
                  >
                    {report.category} • Reported{" "}
                    {getElapsedTime(report.created_at)}
                  </div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgb(63, 201, 232)",
                      textDecoration: "underline",
                    }}
                  >
                    View Details
                  </span>
                  <div style={getStatusStyle(report.status)}>
                    {report.status}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <center className={styles.noreport}>
            <span>No reports made yet</span>
          </center>
        )}
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
