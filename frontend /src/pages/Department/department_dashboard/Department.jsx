import NotFound from "../../not_found/NotFound";
import { Route, Routes, Navigate } from "react-router-dom";
import DepartmentHeader from "../../../components/depart_header/DepartmentHeader";
import IncidentQueue from "../depart_incident_queue/IncidentQueue";
import DepartDashboard from "../depart_dashboard/DepartDashboard";
//import Landing from "../../landing/Landing";

// const renderAllIncidents = () => (
//   <div className="content-fade">
//     <h2 className="page-title">All Incident Logs</h2>
//     <div className="table-container">
//       <table className="raw-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Incident</th>
//             <th>Location</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {incidents.map((i) => (
//             <tr key={i.id}>
//               <td className="font-mono">{i.id}</td>
//               <td>{i.title}</td>
//               <td>{i.location}</td>
//               <td>
//                 <span className={`status-pill ${i.status.toLowerCase()}`}>
//                   {i.status}
//                 </span>
//               </td>
//               <td>
//                 <button className="btn-text">View Details</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// );

// const renderSettings = () => (
//   <div className="content-fade">
//     <h2 className="page-title">Department Settings</h2>
//     <div className="section-container max-w-500">
//       <div className="form-group">
//         <label>Department ID</label>
//         <input
//           type="text"
//           value="KWG-DEPT-001"
//           disabled
//           className="raw-input disabled"
//         />
//       </div>
//       <div className="form-group">
//         <label>Department Name</label>
//         <input
//           type="text"
//           placeholder="e.g. Public Works"
//           className="raw-input"
//         />
//       </div>
//       <div className="form-group">
//         <label>Contact Email</label>
//         <input
//           type="email"
//           placeholder="dept@kwanganji.go.ke"
//           className="raw-input"
//         />
//       </div>
//       <button className="btn-primary">Save Changes</button>
//     </div>
//   </div>
// );
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
          {/* 
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="myreports" element={<MyReport />} /> */}
        </Route>
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </>
  );
}

export default Department;
