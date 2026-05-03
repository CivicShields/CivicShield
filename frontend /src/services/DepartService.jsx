import departs from "../mock_data/depart.json" with { type: "json" };

export function getDepartmentNamesRequest() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const departments = departs.map((u) => u.name);
      resolve({ departs: departments || [] });
    }, 300);
  });
}
