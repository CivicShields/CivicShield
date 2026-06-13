import { BarChart3, Activity, ShieldCheck } from "lucide-react";
import styles from "./DepartDashboard.module.css";
import { getElapsedTime } from "../../../utilities/Date_utilities";
import { useAuth } from "../../../contexts/AuthContext";
import { useDepart } from "../../../contexts/DepartContext";
import { useEffect } from "react";

function DepartDashboard() {
  const { fetchDepartReports, departReports } = useDepart();
  const { user } = useAuth();

  useEffect(() => {
    fetchDepartReports();
  }, [fetchDepartReports]);

  if (!departReports) return <div>Loading...</div>;

  const totalReports = departReports?.length;

  const getWidth = (count) => {
    if (totalReports === 0) return "0%";
    return `${(count / totalReports) * 100}%`;
  };

  const criticalCount = departReports.filter(
    (i) => i.severity === "critical",
  ).length;
  const highCount = departReports?.filter((i) => i.severity === "high").length;
  const lowMedCount = departReports?.filter(
    (i) => i.severity === "medium" || i.severity === "low",
  ).length;

  const recentAdditions = departReports
    ?.toSorted(
      (a, b) =>
        new Date(b.created_at.replace("-", ":")).getTime() -
        new Date(a.created_at.replace("-", ":")).getTime(),
    )
    .slice(0, 5);

  const recents = recentAdditions ? (
    recentAdditions?.map((r) => (
      <div className={styles.activityItem} key={r.report_id}>
        <div className={styles.activityDot}></div>
        <div className={styles.activityInfo}>
          <p>
            {r.title} <strong> {r.report_id} </strong>
          </p>
          <span>{getElapsedTime(r.created_at)}</span>
        </div>
      </div>
    ))
  ) : (
    <p>No high priority reports at this time.</p>
  );

  return (
    <div className={styles.contentFade}>
      <h2 className={styles.pageTitle}>Department Dashboard</h2>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pending Reports</span>
          <span className={styles.statValue}>
            {departReports?.filter((item) => item.status === "Pending").length}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Currently Assigned</span>
          <span className={styles.statValue}>
            {
              departReports?.filter((item) => item.status === "In Progress")
                .length
            }
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Resolved Today</span>
          <span className={[styles.statValue, styles.green].join(" ")}>
            {departReports?.filter((item) => item.status === "Resolved").length}
          </span>
        </div>
      </div>

      <div className={[styles.dashboardGrid, styles.mt20].join(" ")}>
        <div className={styles.gridMain}>
          <div className={[styles.sectionContainer, styles.mb20].join(" ")}>
            <h3 className={styles.sectionHeader}>
              <BarChart3 size={18} /> Priority Distribution
            </h3>
            <div className={styles.priorityBars}>
              <div className={styles.barItem}>
                <div className={styles.barLabel}>
                  <span>Critical</span>
                  <span>{criticalCount}</span>
                </div>
                <div className={styles.barBg}>
                  <div
                    className={[styles.barFill, styles.critical].join(" ")}
                    style={{ width: getWidth(criticalCount) }}
                  ></div>
                </div>
              </div>
              <div className={styles.barItem}>
                <div className={styles.barLabel}>
                  <span>High</span>
                  <span>{highCount}</span>
                </div>
                <div className={styles.barBg}>
                  <div
                    className={[styles.barFill, styles.high].join(" ")}
                    style={{ width: getWidth(highCount) }}
                  ></div>
                </div>
              </div>
              <div className={styles.barItem}>
                <div className={styles.barLabel}>
                  <span>Medium / Low</span>
                  <span>{lowMedCount}</span>
                </div>
                <div className={styles.barBg}>
                  <div
                    className={[styles.barFill, styles.low].join(" ")}
                    style={{ width: getWidth(lowMedCount) }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sectionContainer}>
            <h3 className={styles.sectionHeader}>
              <Activity size={18} /> Recent System Activity
            </h3>

            <div className={styles.activityList}>{recents}</div>
          </div>
        </div>

        <div className={styles.gridSide}>
          <div
            className={[styles.sectionContainer, styles.deptInfoCard].join(" ")}
          >
            <ShieldCheck size={32} className={styles.deptIcon} />
            <h4>Department Identity</h4>
            <div className={styles.infoRow}>
              <span>Department Name:</span>
              <strong className={styles.fontMono}>{user.department}</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Zone:</span>
              <strong>Malawi</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Status:</span>
              <span className={[styles.statusPill, styles.assigned].join(" ")}>
                ACTIVE
              </span>
            </div>
            <hr className={styles.divider} />
            <p className={[styles.textMuted, styles.small].join(" ")}>
              Info on the department
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartDashboard;
