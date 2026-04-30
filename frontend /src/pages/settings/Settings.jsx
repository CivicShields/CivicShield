import { useState } from "react";
import {
  UserCircle,
  Bell,
  LockKeyhole,
  FileText,
  BadgeCheck,
} from "lucide-react";
import styles from "./Settings.module.css";
import Profile from "./sub_setting_pages/profile_setting/Profile";
import NotificationPage from "./sub_setting_pages/notification_setting/NotificationPage";
import MyReport from "./sub_setting_pages/my_reports/MyReport";
import SecurityPage from "./sub_setting_pages/security_setting/SecurityPage";
import Header from "../../components/header/Header";

function Settings() {
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
  ];

  const [activeTab, setActiveTab] = useState("profile");
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
                    onClick={() => setActiveTab(item.id)}
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
