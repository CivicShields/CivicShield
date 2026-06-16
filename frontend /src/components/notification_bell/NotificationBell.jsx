import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./NotificationBell.module.css";

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!user || user.role === "admin") return null;

    const fetchUnreadCount = async () => {
      const deptPath = `/notifications/department/${user.department_id}/`;
      const userPath = `/notifications/user/${user.id}/`;

      const path = user.role === "normal_user" ? userPath : deptPath;
      const req = await fetch(path, {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) {
        const data = res.notifications;
        const count = data.filter((n) => !n.is_read).length;
        setUnreadCount(count);
      }
    };

    fetchUnreadCount();
    intervalRef.current = setInterval(fetchUnreadCount, 30000); // poll every 30s
    return () => clearInterval(intervalRef.current);
  }, [user]);

  const handleClick = () => {
    if (user.role === "department_user") {
      navigate("/dept/notifications");
    } else {
      navigate("/settings/notifications");
    }
  };

  return (
    <div className={styles.notification_bell} onClick={handleClick}>
      <Bell size={24} />
      {unreadCount > 0 && (
        <span className={styles.notification_badge}>{unreadCount}</span>
      )}
    </div>
  );
};

export default NotificationBell;
