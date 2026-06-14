import styles from "./DepartResolve.module.css";
import { MapPin, Clock, ArrowRight, X, Users } from "lucide-react";
import { getElapsedTime } from "../../../utilities/Date_utilities";
import { useState, useEffect } from "react";
import { useDepart } from "../../../contexts/DepartContext";

function DepartResolve() {
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
    changeStatus(selectedIncident?.id, "resolved");
    (setShowAssignModal(false), setSelectedIncident(null));
    fetchDepartReports();
  };

  const openAssignModal = (incident) => {
    setSelectedIncident(incident);
    setShowAssignModal(true);
  };

  return (
    <div className={styles.contentFade}>
      <h2 className={styles.pageTitle}>Active Queue</h2>
      <div className={styles.incidentList}>
        {incidents?.filter((i) => i.status === "in_progress").length > 0 ? (
          incidents
            ?.toSorted(
              (a, b) =>
                new Date(b.created_at) - new Date(a.created_at).getTime(),
            )
            ?.filter((i) => i.status === "in_progress")
            ?.map((incident) => {
              const priorityVal = incident.severity;
              return (
                <div key={incident.id} className={styles.incidentCard}>
                  <div className={styles.incidentHeader}>
                    <span
                      className={[styles.priorityTag, styles[priorityVal]].join(
                        " ",
                      )}
                    >
                      {incident.severity}
                    </span>
                    <span className={styles.incidentId}>{incident.id}</span>
                  </div>
                  <h4
                    className={styles.incidentTitle}
                    style={{
                      display: "inline-block",
                      maxWidth: "180px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {incident.title}
                  </h4>
                  <div className={styles.incidentMeta}>
                    <span
                      style={{
                        display: "inline-block",
                        maxWidth: "180px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <MapPin size={14} /> {incident.named_location}
                    </span>
                    <span>
                      <Clock size={14} /> {getElapsedTime(incident.created_at)}
                    </span>
                  </div>
                  <button
                    onClick={() => openAssignModal(incident)}
                    className={[styles.btnPrimary, styles.mt10].join(" ")}
                  >
                    Resolve incident <ArrowRight size={14} />
                  </button>
                </div>
              );
            })
        ) : (
          <div className={styles.emptyState}>
            No in_progress incidents in queue.
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
            <h3 className={styles.modalTitle}>Resolve Incident</h3>
            <p
              className={[styles.textMuted, styles.small, styles.mb20].join(
                " ",
              )}
            >
              Resolve incident confirmation{" "}
              <strong>{selectedIncident.id}</strong>: {selectedIncident.title}
            </p>

            <div className={[styles.teamOptions, styles.mt20].join(" ")}>
              <div className={styles.teamOption} onClick={() => handleAssign()}>
                <Users size={20} className={styles.textPrimary} />
                <div>
                  <h5>
                    Incident will be reolved when clicked, you sure its
                    resolved?
                  </h5>
                  <p>Resolve</p>
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

export default DepartResolve;
