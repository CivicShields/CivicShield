// Import the array of user objects directly
import users from "../mock_data/user.json" with { type: "json" };

export function getReportsRequest(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((u) => u.email === email);
      if (!user) {
        reject({ message: "User not found" });
      } else {
        resolve({ reports: user.reports || [] });
      }
    }, 500);
  });
}

export function addReportRequest(
  email,
  category,
  depart,
  rpdate,
  incTitle,
  location,
  descr,
  doc,
) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((u) => u.email === email);
      if (!user) {
        reject({ message: "User not found" });
      } else {
        // if (!user.reports) user.reports = [];
        const newReport = {
          report_id: Date.now().toString(),
          category: category,
          severity: "Urgent",
          description: descr,
          department: depart,
          status: "Pending",
          created_at: rpdate,
          doc: doc,
          location: location,
          title: incTitle,
        };
        user.reports.push(newReport);
        resolve({ report: newReport });
      }
    }, 600);
  });
}
