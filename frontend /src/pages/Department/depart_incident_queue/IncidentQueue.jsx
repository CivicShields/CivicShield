import styles from "./IncidentQueue.module.css";
import { useState } from "react";
import { MapPin, Clock, ArrowRight } from "lucide-react";

function IncidentQueue() {
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
      <h2 className={styles.pageTitle}>Active Queue</h2>
      <div className={styles.incidentList}>
        {incidents
          .filter((i) => i.status === "Pending")
          .map((incident) => {
            const priorityVal = incident.priority.toLowerCase();
            return (
              <div key={incident.id} className={styles.incidentCard}>
                <div className={styles.incidentHeader}>
                  <span
                    className={[styles.priorityTag, styles[priorityVal]].join(
                      " ",
                    )}
                  >
                    {incident.priority}
                  </span>
                  <span className={styles.incidentId}>{incident.id}</span>
                </div>
                <h4 className={styles.incidentTitle}>{incident.title}</h4>
                <div className={styles.incidentMeta}>
                  <span>
                    <MapPin size={14} /> {incident.location}
                  </span>
                  <span>
                    <Clock size={14} /> {incident.time}
                  </span>
                </div>
                <button className={[styles.btnPrimary, styles.mt10].join(" ")}>
                  Assign Team <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default IncidentQueue;
