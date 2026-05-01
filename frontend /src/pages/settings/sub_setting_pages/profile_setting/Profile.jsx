import { useAuth } from "../../../../contexts/AuthContext";
import Button from "../../../../utilities/Button";
import styles from "./Profile.module.css";

function Profile() {
  const { user } = useAuth();

  return (
    <section className={styles.sectionB}>
      <h2>Profile settings</h2>
      <div className={styles.container}>
        <div className={styles.userIcon}>
          {user.email ? user.email[0].toUpperCase() : "U"}
        </div>
        <p>Personal Information</p>
        <label>FullName</label>
        <input type="text" placeholder={user.name} readOnly />
        <label> Email Address</label>
        <input type="text" placeholder={user.email} readOnly />
        <label>Phone number</label>
        <input type="text" readOnly />
      </div>
    </section>
  );
}

export default Profile;
