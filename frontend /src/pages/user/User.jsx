import { Routes, Route, Navigate } from "react-router-dom";
import UserDashboard from "./user_dashboard/UserDashboard";
import Landing from "../landing/Landing";
import NotFound from "../not_found/NotFound";
import Policy from "../policy/Policy";
import AboutContact from "../help_about/AboutContact";
import ProtectedRoute from "../../components/protected_route/ProtectedRoute";
import IncidentReport from "./incident_report/IncidentReport";
import Settings from "./settings/Settings";
import IncidentMap from "../../IncidentMap";
import Profile from "./settings/sub_setting_pages/profile_setting/Profile";
import NotificationPage from "./settings/sub_setting_pages/notification_setting/NotificationPage";
import SecurityPage from "./settings/sub_setting_pages/security_setting/SecurityPage";
import MyReports from "./settings/sub_setting_pages/my_reports/MyReport";
import { LogIn } from "lucide-react";

function User() {
  return (
    <>
      <Routes>
        <Route index element={<UserDashboard />} />
        <Route path="/" element={<Landing />} />
        <Route path="/error" element={<NotFound />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/about" element={<AboutContact />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <IncidentReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <IncidentMap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/*"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="myreports" element={<MyReports />} />
        </Route>
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </>
  );
}

export default User;
