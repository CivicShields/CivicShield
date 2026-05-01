import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/protected_route/ProtectedRoute";
import Landing from "./pages/landing/Landing";
import ReportIncident from "./pages/incident_report/IncidentReport";
import LogIn from "./pages/login/LogIn";
import SignUp from "./pages/sign_up/SignUp";
import Footer from "./components/footer/Footer";
import IncidentMap from "./IncidentMap";
import Settings from "./pages/settings/Settings";
import UserDashboard from "./pages/dashboards/user_dashboard/UserDashboard";
import NotificationPage from "./pages/settings/sub_setting_pages/notification_setting/NotificationPage";
import Profile from "./pages/settings/sub_setting_pages/profile_setting/Profile";
import MyReport from "./pages/settings/sub_setting_pages/my_reports/MyReport";
import NotFound from "./pages/not_found/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/error" element={<NotFound />} />
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
              <ReportIncident />
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
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </>
  );
}

export default App;
