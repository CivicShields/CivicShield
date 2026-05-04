import { BarChart3, Activity, ShieldCheck } from "lucide-react";
import styles from "./DepartDashboard.module.css";

function DepartDashboard() {
  return (
    <div className={styles.contentFade}>
      <h2 className={styles.pageTitle}>Department Dashboard</h2>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pending Reports</span>
          <span className={styles.statValue}>12</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Currently Assigned</span>
          <span className={styles.statValue}>05</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Resolved Today</span>
          <span className={[styles.statValue, styles.green].join(" ")}>08</span>
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
                  <span>2</span>
                </div>
                <div className={styles.barBg}>
                  <div
                    className={[styles.barFill, styles.critical].join(" ")}
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
              <div className={styles.barItem}>
                <div className={styles.barLabel}>
                  <span>High</span>
                  <span>5</span>
                </div>
                <div className={styles.barBg}>
                  <div
                    className={[styles.barFill, styles.high].join(" ")}
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>
              <div className={styles.barItem}>
                <div className={styles.barLabel}>
                  <span>Medium / Low</span>
                  <span>7</span>
                </div>
                <div className={styles.barBg}>
                  <div
                    className={[styles.barFill, styles.low].join(" ")}
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sectionContainer}>
            <h3 className={styles.sectionHeader}>
              <Activity size={18} /> Recent System Activity
            </h3>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityDot}></div>
                <div className={styles.activityInfo}>
                  <p>
                    New high-priority report received: <strong>INC-004</strong>
                  </p>
                  <span>Just now</span>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityDot}></div>
                <div className={styles.activityInfo}>
                  <p>
                    Team assigned to <strong>INC-002</strong>
                  </p>
                  <span>14 minutes ago</span>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityDot}></div>
                <div className={styles.activityInfo}>
                  <p>System sync with Incident Microservice successful</p>
                  <span>1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.gridSide}>
          <div
            className={[styles.sectionContainer, styles.deptInfoCard].join(" ")}
          >
            <ShieldCheck size={32} className={styles.deptIcon} />
            <h4>Department Identity</h4>
            <div className={styles.infoRow}>
              <span>Node ID:</span>
              <strong className={styles.fontMono}>KWG-PW-001</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Zone:</span>
              <strong>Sector 4 (CBD)</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Status:</span>
              <span className={[styles.statusPill, styles.assigned].join(" ")}>
                ACTIVE
              </span>
            </div>
            <hr className={styles.divider} />
            <p className={[styles.textMuted, styles.small].join(" ")}>
              This node is authorized to manage infrastructure and utility
              incidents within Kwanganji district.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartDashboard;
