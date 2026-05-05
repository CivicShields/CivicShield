import departs from "../mock_data/users.json" with { type: "json" };

export function getDepartmentNamesRequest() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const departments = [];
      departs.forEach((d) => {
        if (d.role === "department") {
          departments.push(d.department);
        }
      });
      resolve({ departs: departments || [] });
    }, 300);
  });
}
