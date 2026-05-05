import styles from "./IncidentQueue.module.css";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import GetDepartReports from "../../../utilities/getDepartReports";

function IncidentQueue() {
  const incidents = GetDepartReports();

  return (
    <div className={styles.contentFade}>
      <h2 className={styles.pageTitle}>Active Queue</h2>
      <div className={styles.incidentList}>
        {incidents
          .filter((i) => i.status === "Pending")
          .map((incident) => {
            const priorityVal = incident.severity;
            console.log(priorityVal);
            return (
              <div key={incident.report_id} className={styles.incidentCard}>
                <div className={styles.incidentHeader}>
                  <span
                    className={[styles.priorityTag, styles[priorityVal]].join(
                      " ",
                    )}
                  >
                    {incident.severity}
                  </span>
                  <span className={styles.incidentId}>
                    {incident.report_id}
                  </span>
                </div>
                <h4 className={styles.incidentTitle}>{incident.title}</h4>
                <div className={styles.incidentMeta}>
                  <span>
                    <MapPin size={14} /> {incident.location}
                  </span>
                  <span>
                    <Clock size={14} /> {incident.created_at}
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
