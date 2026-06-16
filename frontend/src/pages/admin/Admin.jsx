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
import {
  ChartBarIncreasingIcon,
  LogOut,
  Users,
  File,
  BellDot,
  Building2,
  Menu,
  X,
} from "lucide-react";

function Admin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const closeSidebar = () => setSidebarOpen(false);

  const navLinks = (
    <ul className="menuList">
      <li>
        <NavLink
          to="/admin/incidents"
          end
          className={({ isActive }) => (isActive ? "active" : "menuBtn")}
          onClick={closeSidebar}
        >
          <ChartBarIncreasingIcon size={20} /> <span>Incidents</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/departments"
          end
          className={({ isActive }) => (isActive ? "active" : "menuBtn")}
          onClick={closeSidebar}
        >
          <Building2 size={20} /> <span>Departments</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/users"
          end
          className={({ isActive }) => (isActive ? "active" : "menuBtn")}
          onClick={closeSidebar}
        >
          <Users size={20} /> <span>Users</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/media"
          end
          className={({ isActive }) => (isActive ? "active" : "menuBtn")}
          onClick={closeSidebar}
        >
          <File size={20} /> <span>Media</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/notifications"
          end
          className={({ isActive }) => (isActive ? "active" : "menuBtn")}
          onClick={closeSidebar}
        >
          <BellDot size={20} /> <span>Notifications</span>
        </NavLink>
      </li>
      <li>
        <button className="menuBtn" onClick={() => setIsModalOpen(true)}>
          <LogOut size={20} /> <span>Logout</span>
        </button>
      </li>
    </ul>
  );

  return (
    <>
      <div className="admin-dashboard">
        {" "}
        {/* Fixed: removed extra } */}
        {/* Hamburger button */}
        <button
          className="hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : ""}`}>
          <div className="logo">Admin Panel</div>
          {navLinks}
        </aside>
        {/* Overlay */}
        {sidebarOpen && <div className="overlay" onClick={closeSidebar} />}
        {/* Main content */}
        <div className="content">
          <Outlet />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        action={handleLogout}
      >
        <h2>Are you sure you want to log out?</h2>
        <p>Log out of Kwanganje Incident Reporter as {user?.email}</p>
      </Modal>
    </>
  );
}

function AdminDashboard() {
  return (
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
  );
}

export default AdminDashboard;
