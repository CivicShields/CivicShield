import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import logo from "/favicon.svg";

function Footer() {
  return (
    <footer>
      <div className={styles.footerStyle}>
        <div className={styles.names}>
          <h2>
            <img src={logo} alt="" /> SafetyTrack
          </h2>
          <p>Faster incident management. </p>
          <p> Trusted departments.</p>
          <p>Secure community.</p>
        </div>

        <div className={styles.names}>
          <p>Platform</p>

          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/map">Live map</Link>
          <Link to="/reportDashboard">Reporter's dashboard</Link>
        </div>
        <div className={styles.names}>
          <p>Resources</p>
          <Link to="/help">Help & Support</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>

      <p>
        &copy; {new Date().getFullYear()} SafetyTrack Inc. Group 1. All Rights
        Reserved.
      </p>
    </footer>
  );
}

export default Footer;
