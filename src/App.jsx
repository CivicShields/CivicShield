import { Routes, Route } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import ReportIncident from "./pages/incident_report/IncidentReport";
import LogIn from "./pages/login/LogIn";
import Footer from "./components/footer/Footer";

function App() {
  console.log("Current pathname:", window.location.pathname);
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/report" element={<ReportIncident />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </>
  );
}

export default App;
