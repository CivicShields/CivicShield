// AdminDashboard.js
import React, { useState } from "react";
import { NavLink, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./Admin.css";
import Modal from "../../components/modal/Modal";
import { useAuth } from "../../contexts/AuthContext";
import AdminDeparts from "./adminDeparts/AdminDeparts";
import AdminMedia from "./adminMedia/AdminMedia";
import AdminUsers from "./adminUsers/AdminUsers";
import AdminNotif from "./adminNotif/AdminNotifications";
import AdminInc from "./adminInc/AdminInc";
import NotFound from "../not_found/NotFound";
import {
  ChartBarIncreasingIcon,
  LogOut,
  Users,
  File,
  BellDot,
  Building2,
} from "lucide-react";

const Admin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul className="menuList">
            <li>
              <NavLink
                to="/admin/incidents"
                end
                className={({ isActive }) => (isActive ? "active" : "menuBtn")}
              >
                <ChartBarIncreasingIcon size={20} /> <span>Incidents</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/departments"
                end
                className={({ isActive }) => (isActive ? "active" : "menuBtn")}
              >
                <Building2 size={20} /> <span>Departments</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                end
                className={({ isActive }) => (isActive ? "active" : "menuBtn")}
              >
                <Users size={20} /> <span>Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/media"
                end
                className={({ isActive }) => (isActive ? "active" : "menuBtn")}
              >
                <File size={20} /> <span>Media</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/notifications"
                end
                className={({ isActive }) => (isActive ? "active" : "menuBtn")}
              >
                <BellDot size={20} /> <span>Notifications</span>
              </NavLink>
            </li>
            <li>
              <button
                className="menuBtn"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <LogOut size={20} /> <span>logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="main-content">
        {/* This renders the NotificationPage, etc. based on URL */}
        <Outlet />
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
    </div>
  );
};

function AdminDashboard() {
  return (
    <>
      <Routes>
        <Route element={<Admin />}>
          <Route index element={<AdminInc />} />
          <Route path="incidents" element={<AdminInc />} />
          <Route path="notifications" element={<AdminNotif />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="departments" element={<AdminDeparts />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/incidents" replace />} />
      </Routes>
    </>
  );
}

export default AdminDashboard;
