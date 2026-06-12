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
  category,
  assignedDepart,
  incTitle,
  location,
  descr,
  doc,
) {
  const formData = new FormData();
  formData.append("file", doc);
  formData.append("department_id", assignedDepart);
  formData.append("location", location);
  (formData.append("title", incTitle), formData.append("category", category));
  formData.append("description", descr);

  try {
    const req = await fetch("/incident/create", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const res = await req.json();
    console.log(res);

    return { serverResponse: res };
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}
