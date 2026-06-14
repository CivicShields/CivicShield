import styles from "./DepartSettings.module.css";
import { useAuth } from "../../../contexts/AuthContext";
import { useDepart } from "../../../contexts/DepartContext";

function DepartSettings() {
  const { user } = useAuth();
  const { name } = useDepart();
  return (
    <div className={styles.contentFade}>
      <h2 className={styles.pageTitle}>Department Settings</h2>
      <div className={[styles.sectionContainer, styles.maxW500].join(" ")}>
        <div className={styles.formGroup}>
          <label>Department ID</label>
          <input
            type="text"
            value={user.id}
            disabled
            className={[styles.rawInput, styles.disabled].join(" ")}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Department Name</label>
          <input
            type="text"
            value={name}
            disabled
            className={[styles.rawInput, styles.disabled].join(" ")}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Contact Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className={[styles.rawInput, styles.disabled].join(" ")}
          />
        </div>
        <button className={styles.btnPrimary} disabled>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default DepartSettings;
