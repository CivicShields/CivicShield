import { useState } from "react";
import styles from "./AllIncidents.module.css";

function AllIncidents() {
  const [incidents] = useState([
    {
      id: "INC-001",
      title: "Water Leak",
      priority: "High",
      status: "Pending",
      time: "10 mins ago",
      location: "CBD",
    },
    {
      id: "INC-002",
      title: "Trash Pile",
      priority: "Low",
      status: "Assigned",
      time: "1 hour ago",
      location: "East Side",
    },
    {
      id: "INC-003",
      title: "Power Spark",
      priority: "Critical",
      status: "Pending",
      time: "2 mins ago",
      location: "Industrial",
    },
  ]);
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
            {incidents.map((i) => {
              const sta = i.status.toLowerCase();
              return (
                <tr key={i.id}>
                  <td className={styles.fontMono}>{i.id}</td>
                  <td>{i.title}</td>
                  <td>{i.location}</td>
                  <td>
                    <span
                      className={[styles.statusPill, styles[sta]].join(" ")}
                    >
                      {i.status}
                    </span>
                  </td>
                  <td>
                    <button className={styles.btnText}>View Details</button>
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
