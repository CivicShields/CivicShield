import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import logo from "/incident.png";

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

          <Link to="/">Landing</Link>
          <Link to="/services">Services</Link>
          <Link to="/map">Live map</Link>
          <Link to="/dashboard">Reporter's dashboard</Link>
        </div>
        <div className={styles.names}>
          <p>Resources</p>
          <Link to="/about">Help & Support</Link>
          <Link to="/about">Contact Us</Link>
          <a href="#top">Back to top</a>
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
