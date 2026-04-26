import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../../utilities/Button";
import styles from "./Header.module.css";

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  function handleLoginButton() {
    navigate("/login");
    closeMenu();
  }

  function handleReportButton() {
    navigate("/report");
    closeMenu();
  }

  return (
    <>
      <header>
        <div className={styles.brand}>
          <b className={styles.safe}>SafetyTrack</b>
          <span>Kwanganje Incident Reporter</span>
        </div>

        <nav className={styles.navLinks}>
          <Link to="/">Dashboard</Link>
          <Link to="/report">Report incident</Link>
          <Link to="/map">View map</Link>
        </nav>

        <div className={styles.headerButtons}>
          <Button
            name="Log in"
            classStyle="not-covered"
            onClick={handleLoginButton}
          />
          <Button
            name="Report now"
            classStyle="covered"
            onClick={handleReportButton}
          />
        </div>

        <button className={styles.menuToggle} onClick={toggleMenu}>
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      <div
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ""}`}
        onClick={closeMenu}
      >
        <div
          className={styles.mobileMenuContent}
          onClick={(e) => e.stopPropagation()}
        >
          <Link to="/" onClick={closeMenu}>
            Dashboard
          </Link>
          <Link to="/report" onClick={closeMenu}>
            Report incident
          </Link>
          <Link to="/map" onClick={closeMenu}>
            View map
          </Link>
          <div className={styles.mobileButtons}>
            <Button
              name="Log in"
              classStyle="not-covered"
              onClick={handleLoginButton}
            />
            <Button
              name="Report now"
              classStyle="covered"
              onClick={handleReportButton}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
