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

export function addReportRequest(email, reportData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((u) => u.email === email);
      if (!user) {
        reject({ message: "User not found" });
      } else {
        if (!user.reports) user.reports = [];
        const newReport = {
          id: Date.now().toString(),
          ...reportData,
        };
        user.reports.push(newReport);
        resolve({ report: newReport });
      }
    }, 600);
  });
}
