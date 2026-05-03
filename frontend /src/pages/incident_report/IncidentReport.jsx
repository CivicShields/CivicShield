import Button from "../../components/button/Button";
import styles from "./IncidentReport.module.css";
import { time, date } from "../../utilities/Date_utilities";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import FileDropZone from "../../components/filedropzone/FileDropZone";
import AllDeparts from "../../utilities/GetDeparts.js";
import { useReport } from "../../contexts/ReportContext.jsx";

function IncidentReport() {
  const [descCount, setDescCount] = useState(0);

  function handleDescCount(e) {
    setDescCount(e.target.value.length);
    handleChange(e);
  }

  const { addReport } = useReport();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: "",
    department: "",
    reportedDate: date + ", " + time,
    incidentTitle: "",
    location: "",
    description: "",
    document: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (file) => {
    setForm({ ...form, document: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      await addReport(
        form.category,
        form.department,
        form.reportedDate,
        form.incidentTitle,
        form.location,
        form.description,
        form.document,
      );
      navigate("/settings/myreports");
    } catch (err) {
      setError(err.message || "Report registration failed");
    } finally {
      setLoading(false);
    }
  };

  const Departments = [
    <option value="" key="default" disabled>
      Select a Department
    </option>,
    ...AllDeparts().map((depart, index) => (
      <option value={depart} key={index}>
        {depart}
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
              <input
                type="text"
                name="category"
                placeholder="Enter category"
                value={form.category}
                onChange={handleChange}
                required
                autoFocus
              />
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
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
              />
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
