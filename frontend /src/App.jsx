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
import SecurityPage from "./pages/settings/sub_setting_pages/security_setting/SecurityPage";
import Policy from "./pages/policy/Policy";
import AboutContact from "./pages/help_about/AboutContact";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/error" element={<NotFound />} />
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
          <Route path="myreports" element={<MyReport />} />
        </Route>
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </>
  );
}

export default App;
