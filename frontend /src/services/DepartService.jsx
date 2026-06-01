import reportData from "../mock_data/reports.json" with { type: "json" };

export function getDepartReportsRequest(departName) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const reports = [];
      reportData.forEach((r) => {
        if (r.assignedDepartment === departName) {
          reports.push(r);
        }
      });
      if (!reports) {
        reject({ message: "Reports not found" });
      } else {
        resolve({ reports: reports || [] });
      }
    }, 500);
  });
}

export function changeReportStatusRequest(reportId, status) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const statusChange = reportData.find((r) => r.report_id === reportId);
      if (statusChange) {
        statusChange.status = status;
      }

      resolve({ status: statusChange });
    }, 500);
  });
}
