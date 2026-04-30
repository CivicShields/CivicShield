import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../utilities/Button";
import styles from "./Header.module.css";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  function handleLogin() {
    navigate("/login");
    closeMenu();
  }

  function handleReport() {
    navigate("/report");
    closeMenu();
  }

  // Buttons / elements that depend on auth state
  const loginButton = (
    <Button name="Log in" classStyle="not-covered" onClick={handleLogin} />
  );

  const userIconElement = (style, text) =>
    user ? (
      <Link to="/settings" className={style} onClick={closeMenu}>
        {text}
      </Link>
    ) : null;

  return (
    <>
      <header>
        <div className={styles.brand}>
          <b className={styles.safe}>SafetyTrack</b>
          <span>Kwanganje Incident Reporter</span>
        </div>

        <nav className={styles.navLinks}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/report">Report incident</Link>
          <Link to="/map">View map</Link>
        </nav>

        <div className={styles.headerButtons}>
          {!user && loginButton}
          <Button
            name="Report now"
            classStyle="covered"
            onClick={handleReport}
          />
          {user &&
            userIconElement(
              styles.userIcon,
              user.email ? user.email[0].toUpperCase() : "U",
            )}
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
          <Link to="/dashboard" onClick={closeMenu}>
            Dashboard
          </Link>
          <Link to="/report" onClick={closeMenu}>
            Report incident
          </Link>
          <Link to="/map" onClick={closeMenu}>
            View map
          </Link>
          <div className={styles.mobileButtons}>
            {!user && loginButton}
            <Button
              name="Report now"
              classStyle="covered"
              onClick={handleReport}
            />
            {user && userIconElement(styles.navLinks, "Settings")}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
