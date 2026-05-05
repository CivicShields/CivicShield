import reportData from "../mock_data/reports.json" with { type: "json" };

export function getReportsRequest(userID) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const reports = [];
      reportData.forEach((r) => {
        if (r.created_by === userID) {
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

export function addReportRequest(
  email,
  category,
  assignedDepart,
  rpdate,
  incTitle,
  location,
  descr,
  doc,
  creator,
) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // if (!user.reports) user.reports = [];
      const newReport = {
        report_id: Date.now().toString(),
        category: category,
        severity: "medium",
        description: descr,
        assignedDepartment: assignedDepart,
        status: "Pending",
        created_at: rpdate,
        doc: doc,
        location: location,
        title: incTitle,
        created_by: creator,
      };
      reportData.push(newReport);
      resolve({ report: newReport });
    }, 600);
  });
}
