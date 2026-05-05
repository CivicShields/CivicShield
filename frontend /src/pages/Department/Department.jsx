import NotFound from "../not_found/NotFound";
import { Route, Routes, Navigate } from "react-router-dom";
import DepartmentHeader from "../../components/depart_header/DepartmentHeader";
import IncidentQueue from "./depart_incident_queue/IncidentQueue";
import DepartDashboard from "./depart_dashboard/DepartDashboard";
import AllIncidents from "./depart_incidents/AllIncidents";
import DepartSettings from "./depart_settings/DepartSettings";
//import Landing from "../../landing/Landing";

function Department() {
  return (
    <>
      <Routes>
        <Route path="/error" element={<NotFound />} />
        {/* <Route path="/" element={<Landing />} /> */}
        <Route
          path="/department/*"
          element={
            // <ProtectedRoute>
            //   <Settings />
            // </ProtectedRoute>
            <DepartmentHeader />
          }
        >
          <Route index element={<DepartDashboard />} />
          <Route path="dashboard" element={<DepartDashboard />} />
          <Route path="queue" element={<IncidentQueue />} />
          <Route path="allIncidents" element={<AllIncidents />} />
          <Route path="settings" element={<DepartSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </>
  );
}

export default Department;
