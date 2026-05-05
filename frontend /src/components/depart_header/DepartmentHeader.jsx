import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  AlertCircle,
  LayoutDashboard,
  ListFilter,
  History,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Modal from "../modal/Modal";
import styles from "./DepartmentHeader.module.css";
import { useAuth } from "../../contexts/AuthContext";

function DepartmentHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const closeSidebar = () => setSidebarOpen(false);

  const navLinks = (
    <ul className={styles.navList}>
      <li>
        <NavLink
          to="/dept/dashboard"
          end
          className={({ isActive }) =>
            isActive ? styles.active : styles.navItem
          }
          onClick={closeSidebar}
        >
          <LayoutDashboard size={18} /> Department Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dept/queue"
          className={({ isActive }) =>
            isActive ? styles.active : styles.navItem
          }
          onClick={closeSidebar}
        >
          <ListFilter size={18} /> Incident Queue
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dept/allIncidents"
          className={({ isActive }) =>
            isActive ? styles.active : styles.navItem
          }
          onClick={closeSidebar}
        >
          <History size={18} /> All Incidents
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dept/settings"
          className={({ isActive }) =>
            isActive ? styles.active : styles.navItem
          }
          onClick={closeSidebar}
        >
          <Settings size={18} /> Dept. Info
        </NavLink>
      </li>
      <li className={styles.logoutItem}>
        <button
          onClick={() => {
            setIsModalOpen(true);
            closeSidebar();
          }}
          className={styles.navItemLog}
        >
          <LogOut size={20} /> <span>Logout</span>
        </button>
      </li>
    </ul>
  );

  return (
    <>
      <div className={styles.depart}>
        {/* Hamburger button (mobile only) */}
        <button
          className={styles.hamburger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar (desktop permanent, mobile overlay) */}
        <aside
          className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
        >
          <div className={styles.logo}>
            <AlertCircle /> Kwanganji Incident Reporter
          </div>
          {navLinks}
        </aside>

        {/* Dark overlay behind mobile sidebar */}
        {sidebarOpen && (
          <div className={styles.overlay} onClick={closeSidebar} />
        )}

        {/* Main content */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        action={handleLogout}
      >
        <h2>
          Are you sure you want <br /> to log out
        </h2>
        <p>Log out of Kwanganje Incident Reporter as {user.email}</p>
      </Modal>
    </>
  );
}

export default DepartmentHeader;
