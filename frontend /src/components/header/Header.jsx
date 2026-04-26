import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../utilities/Button";
import styles from "./Header.module.css";

/* 
Header component which uses Link from react-router-dom to achieve navigation.
uses user and logout to determine whether a user is logged in or not
if user is logged in, report incident button and link works else it doesnt plus log in button changes to 
log out button and the viceversa is also true 

also implemented mobile header view and pc view
*/

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

  const showButton = !user ? (
    <Button name="Log in" classStyle="not-covered" onClick={handleLogin} />
  ) : (
    <Button name="Log out" classStyle="not-covered" onClick={handleLogout} />
  );

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
          {showButton}
          <Button
            name="Report now"
            classStyle="covered"
            onClick={handleReport}
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
            {showButton}
            <Button
              name="Report now"
              classStyle="covered"
              onClick={handleReport}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
