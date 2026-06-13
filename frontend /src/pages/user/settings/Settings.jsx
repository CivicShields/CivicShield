import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { NavLink, Outlet } from "react-router-dom";
import {
  UserCircle,
  Bell,
  LockKeyhole,
  FileText,
  BadgeCheck,
  LogOut,
} from "lucide-react";
import styles from "./Settings.module.css";
import Profile from "./sub_setting_pages/profile_setting/Profile";
import NotificationPage from "./sub_setting_pages/notification_setting/NotificationPage";
import MyReport from "./sub_setting_pages/my_reports/MyReport";
import SecurityPage from "./sub_setting_pages/security_setting/SecurityPage";
import Header from "../../../components/header/Header";
import Modal from "../../../components/modal/Modal";

function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Header />
      <div className={styles.settings}>
        <nav className={styles.sidebar}>
          <h2 className={styles.heading}>Account Settings</h2>
          <ul className={styles.menuList}>
            <li>
              <NavLink
                to="/settings/profile"
                end
                className={({ isActive }) =>
                  isActive ? styles.active : styles.menuBtn
                }
              >
                <UserCircle size={20} /> <span>Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings/notifications"
                className={({ isActive }) =>
                  isActive ? styles.active : styles.menuBtn
                }
              >
                <Bell size={20} /> <span>Notifications</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings/security"
                className={({ isActive }) =>
                  isActive ? styles.active : styles.menuBtn
                }
              >
                <LockKeyhole size={20} /> <span>Security & Password</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings/myreports"
                className={({ isActive }) =>
                  isActive ? styles.active : styles.menuBtn
                }
              >
                <FileText size={20} /> <span>My Reports</span>
              </NavLink>
            </li>
            <li>
              <button
                onClick={() => setIsModalOpen(true)}
                className={styles.menuBtn}
              >
                <LogOut size={20} /> <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>

        <main className={styles.content}>
          {/* This renders the Profile, NotificationPage, etc. based on URL */}
          <Outlet />
        </main>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
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

export default Settings;
