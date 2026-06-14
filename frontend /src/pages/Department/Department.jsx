import { Route, Routes, Navigate } from "react-router-dom";
import DepartmentHeader from "../../components/depart_header/DepartmentHeader";
import IncidentQueue from "./depart_incident_queue/IncidentQueue";
import DepartDashboard from "./depart_dashboard/DepartDashboard";
import AllIncidents from "./depart_incidents/AllIncidents";
import DepartSettings from "./depart_settings/DepartSettings";
import DepartResolve from "./departResolve/DepartResolve";

function Department() {
  return (
    <>
      <Routes>
        <Route element={<DepartmentHeader />}>
          <Route index element={<DepartDashboard />} />
          <Route path="dashboard" element={<DepartDashboard />} />
          <Route path="queue" element={<IncidentQueue />} />
          <Route path="allIncidents" element={<AllIncidents />} />
          <Route path="settings" element={<DepartSettings />} />
          <Route path="resolve" element={<DepartResolve />} />
        </Route>
        <Route path="*" element={<Navigate to="/dept/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default Department;
