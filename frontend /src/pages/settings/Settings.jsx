import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
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
import Header from "../../components/header/Header";
import Modal from "../../components/modal/Modal";

function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  const [activeTab, setActiveTab] = useState("profile");
  const menuItems = [
    { id: "profile", label: "Profile", icon: UserCircle, content: <Profile /> },
    {
      id: "notifs",
      label: "Notifications",
      icon: Bell,
      content: <NotificationPage />,
    },
    {
      id: "security",
      label: "Security & Password",
      icon: LockKeyhole,
      content: <SecurityPage />,
    },
    {
      id: "reports",
      label: "My Reports",
      icon: FileText,
      content: <MyReport />,
    },
    {
      id: "logout",
      label: "Log out",
      icon: LogOut,
      content: (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActiveTab("profile");
          }}
          action={handleLogout}
        >
          <h2>
            Are you sure you want <br /> to log out
          </h2>
          <p>Log out of Kwanganje Incident Reporter as test@test.com</p>
        </Modal>
      ),
    },
  ];

  const activeItem = menuItems.find((item) => item.id === activeTab);

  return (
    <>
      <Header />
      <div className={styles.settings}>
        <nav className={styles.sidebar}>
          <h2 className={styles.heading}>Account Settings</h2>
          <ul className={styles.menuList}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`${styles.menuBtn} ${isActive ? styles.active : ""}`}
                    onClick={() => {
                      if (item.id === "logout") {
                        setActiveTab(item.id);
                        setIsModalOpen(true);
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content Area */}
        <main className={styles.content}>{activeItem?.content}</main>
      </div>
    </>
  );
}

export default Settings;
