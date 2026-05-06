import styles from "./IncidentQueue.module.css";
import { MapPin, Clock, ArrowRight, X, Users } from "lucide-react";
import { getElapsedTime } from "../../../utilities/Date_utilities";
import { useState, useEffect } from "react";
import { useDepart } from "../../../contexts/DepartContext";

function IncidentQueue() {
  const { fetchDepartReports, changeStatus, departReports } = useDepart();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    fetchDepartReports();
  }, [fetchDepartReports]);

  if (!departReports) return <div>Loading...</div>;

  const incidents = departReports;

  //const handleAssign = teamName;
  const handleAssign = () => {
    changeStatus(selectedIncident?.report_id, "In Progress");
    (setShowAssignModal(false), setSelectedIncident(null));
  };

  const openAssignModal = (incident) => {
    setSelectedIncident(incident);
    setShowAssignModal(true);
  };

  return (
    <div className={styles.contentFade}>
      <h2 className={styles.pageTitle}>Active Queue</h2>
      <div className={styles.incidentList}>
        {incidents
          ? incidents
              ?.toSorted(
                (a, b) =>
                  new Date(b.created_at.replace("-", ":")).getTime() -
                  new Date(a.created_at.replace("-", ":")).getTime(),
              )
              ?.filter((i) => i.status === "Pending")
              ?.map((incident) => {
                const priorityVal = incident.severity;
                return (
                  <div key={incident.report_id} className={styles.incidentCard}>
                    <div className={styles.incidentHeader}>
                      <span
                        className={[
                          styles.priorityTag,
                          styles[priorityVal],
                        ].join(" ")}
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
                        <Clock size={14} />{" "}
                        {getElapsedTime(incident.created_at)}
                      </span>
                    </div>
                    <button
                      onClick={() => openAssignModal(incident)}
                      className={[styles.btnPrimary, styles.mt10].join(" ")}
                    >
                      Assign Team <ArrowRight size={14} />
                    </button>
                  </div>
                );
              })
          : incidents?.filter((i) => i.status === "Pending").length === 0 && (
              <div className={styles.emptyState}>
                No pending incidents in queue.
              </div>
            )}
      </div>
      {showAssignModal && selectedIncident && (
        <div className={styles.modalOverlay}>
          <div className={[styles.modalContent, styles.contentFade].join(" ")}>
            <button
              className={styles.modalClose}
              onClick={() => setShowAssignModal(false)}
            >
              <X size={20} />
            </button>
            <h3 className={styles.modalTitle}>Assign Response Team</h3>
            <p
              className={[styles.textMuted, styles.small, styles.mb20].join(
                " ",
              )}
            >
              Select a unit to handle <strong>{selectedIncident.id}</strong>:{" "}
              {selectedIncident.title}
            </p>

            <div className={[styles.teamOptions, styles.mt20].join(" ")}>
              <div className={styles.teamOption} onClick={() => handleAssign()}>
                <Users size={20} className={styles.textPrimary} />
                <div>
                  <h5>Emergency Unit Alpha</h5>
                  <p>Rapid response for high-priority utility issues.</p>
                </div>
              </div>

              <div className={styles.teamOption} onClick={() => handleAssign()}>
                <Users size={20} className={styles.textPrimary} />
                <div>
                  <h5>Field Maintenance B</h5>
                  <p>Standard unit for routine inspections and repairs.</p>
                </div>
              </div>

              <div className={styles.teamOption} onClick={() => handleAssign()}>
                <Users size={20} className={styles.textPrimary} />
                <div>
                  <h5>Night Shift Support</h5>
                  <p>Available for off-peak monitoring and cleanup.</p>
                </div>
              </div>
            </div>

            <div className={styles.mt20}>
              <p
                className={[styles.textMuted, styles.small, styles.italic].join(
                  " ",
                )}
              ></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IncidentQueue;
