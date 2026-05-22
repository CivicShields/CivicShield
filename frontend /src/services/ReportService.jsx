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

export async function addReportRequest(
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
  const newReport = {
    report_id: Date.now().toString(),
    category,
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

  const formData = new FormData();
  formData.append("file", doc);
  formData.append("incident_id", newReport.report_id);

  try {
    const response = await fetch("http://localhost:8000/media/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    newReport.doc = data.media_id;
    reportData.push(newReport);

    return { report: newReport, serverResponse: data };
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}
