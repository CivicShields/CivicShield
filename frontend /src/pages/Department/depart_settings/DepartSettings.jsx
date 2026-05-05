import styles from "./DepartSettings.module.css";

function DepartSettings() {
  return (
    <div className={styles.contentFade}>
      <h2 className={styles.pageTitle}>Department Settings</h2>
      <div className={[styles.sectionContainer, styles.maxW500].join(" ")}>
        <div className={styles.formGroup}>
          <label>Department ID</label>
          <input
            type="text"
            value="KWG-DEPT-001"
            disabled
            className={[styles.rawInput, styles.disabled].join(" ")}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Department Name</label>
          <input
            type="text"
            placeholder="e.g. Public Works"
            className={styles.rawInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Contact Email</label>
          <input
            type="email"
            placeholder="dept@kwanganji.go.ke"
            className={styles.rawInput}
          />
        </div>
        <button className={styles.btnPrimary}>Save Changes</button>
      </div>
    </div>
  );
}

export default DepartSettings;
