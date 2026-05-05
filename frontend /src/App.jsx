import { Routes, Route, Navigate } from "react-router-dom";
import Department from "./pages/Department/Department";
import User from "./pages/user/User";
import Landing from "./pages/landing/Landing";
import LogIn from "./pages/login/LogIn";
import SignUp from "./pages/sign_up/SignUp";
import NotFound from "./pages/not_found/NotFound";
import ProtectedRoute from "./components/protected_route/ProtectedRoute";
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
        <Route path="/about" element={<AboutContact />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute allowedRoles={["normal"]}>
              <User />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dept/*"
          element={
            <ProtectedRoute allowedRoles={["department"]}>
              <Department />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </>
  );
}

export default App;
