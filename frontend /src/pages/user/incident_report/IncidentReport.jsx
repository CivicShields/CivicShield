import Button from "../../../components/button/Button.jsx";
import styles from "./IncidentReport.module.css";
import { time, date } from "../../../utilities/Date_utilities.js";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "../../../components/header/Header.jsx";
import Footer from "../../../components/footer/Footer.jsx";
import FileDropZone from "../../../components/filedropzone/FileDropZone.jsx";
import { incidentCategories } from "../../../utilities/Data.js";
import { LocateIcon } from "lucide-react";
import { reverseGeocode } from "../../../utilities/location_utilities.js";

function IncidentReport() {
  const [descCount, setDescCount] = useState(0);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: "",
    department: "",
    reportedDate: date + ", " + time,
    incidentTitle: "",
    coordinates: null,
    address: "",
    description: "",
    document: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [departNames, setDepartNames] = useState([]);

  useEffect(() => {
    async function fetchDeparts() {
      const req = await fetch("/departments/depart-names/", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (req.ok) {
        const res = await req.json();
        if (res.success) setDepartNames(res.list);
      }
    }
    fetchDeparts();
  }, [departNames.length]);

  function handleDescCount(e) {
    setDescCount(e.target.value.length);
    handleChange(e);
  }

  function getUserLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const addr = await reverseGeocode(
            pos.coords.latitude,
            pos.coords.longitude,
          );
          setForm({
            ...form,
            coordinates: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            },
            address: addr,
          });
        },
        (err) => {
          setError(err.message);
        },
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (file) => {
    setForm({ ...form, document: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    const { document, ...restOfForm } = form;
    if (document) formData.append("file", document);
    formData.append("metadata", JSON.stringify(restOfForm));

    setLoading(true);
    try {
      const req = await fetch("/incident/create/", {
        method: "POST",
        body: formData,
      });

      const res = await req.json();
      if (!res.success) setError(res.error);
      navigate("/settings/myreports");
    } catch (err) {
      setError(err.message || "Report registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!departNames) return <div>... isloading</div>;
  const Departments = [
    <option value="" key="default" disabled>
      Select a Department
    </option>,
    ...departNames.map((depart, index) => (
      <option value={depart.id} key={index}>
        {depart.name}
      </option>
    )),
  ];

  return (
    <>
      <Header />
      <main className={styles.irContainer}>
        <h2>Report an Incident</h2>
        <p>
          Please provide as much details as possible to help as respond
          effectively
        </p>
        <form id="incidentForm" onSubmit={handleSubmit}>
          <h2>Incident Reporting Form</h2>
          <div className={styles.userDetailsContainer}>
            <div className={styles.userDetails}>
              <p>
                Report category <span style={{ color: "red" }}>*</span>
              </p>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a Category</option>
                {incidentCategories.map((item) => {
                  if (item.value === "All") {
                    return;
                  } else {
                    return (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
            <div className={styles.userDetails}>
              <p>Department</p>
              <select
                value={form.department}
                onChange={handleChange}
                name="department"
                required
              >
                {Departments}
              </select>
            </div>
            <div className={styles.userDetails}>
              <p>Report Date/Time</p>
              <input
                type="text"
                name="reportedDate"
                value={form.reportedDate}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>
          <div className={styles.iDetailsContainer}>
            <div className={styles.iDetails}>
              <p>Incident title</p>
              <input
                type="text"
                name="incidentTitle"
                placeholder="E.g. Pothole development on mchinji m1 road."
                value={form.incidentTitle}
                onChange={handleChange}
                required
              />
              <div>
                <p>Description</p>
                <p>
                  <span style={{ color: "#645e5e" }}>{descCount}/2000</span>
                </p>
              </div>
              <textarea
                id="description"
                maxLength="2000"
                name="description"
                value={form.description}
                onChange={handleDescCount}
                placeholder="Describe exactly what happened, who was involved and the sequence of events. Stick to facts."
                required
              ></textarea>
            </div>
            <div className={styles.iDetails2}>
              <p>Location Details</p>
              <button
                name="location"
                onClick={getUserLocation}
                className={styles.locateButton}
                required
              >
                {" "}
                <LocateIcon size={20} />
                Get current location
              </button>
              <FileDropZone
                key={form.incidentTitle === "" ? "reset" : "active"}
                onFileSelect={handleFileSelect}
              />
            </div>
          </div>
          <div className={styles.srButtonDiv}>
            <Link to="/policy">Privacy Policy & Data use</Link>
            <Button
              name={loading ? "Submitting report..." : "Submit Report →"}
              classStyle={styles.srButton}
              disabled={loading}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </main>
      <Footer />
    </>
  );
}

export default IncidentReport;
