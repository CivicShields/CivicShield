import reportData from "../mock_data/reports.json" with { type: "json" };

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
