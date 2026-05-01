import Button from "../../utilities/Button";
import styles from "./IncidentReport.module.css";
import { time, date } from "../../utilities/Date_utilities";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import FileDropZone from "../../components/filedropzone/FileDropZone";

function IncidentReport() {
  const [descCount, setDescCount] = useState(0);

  function handleDescCount(e) {
    setDescCount(e.target.value.length);
  }

  const departs = [
    "Police Department",
    "Fire Department",
    "WaterBoard",
    "ESCOM",
    "Roads Authority",
  ];

  const Departments = departs.map((depart, index) => {
    return (
      <option value={depart} key={index}>
        {depart}
      </option>
    );
  });

  return (
    <>
      <Header />
      <main className={styles.irContainer}>
        <h2>Report an Incident</h2>
        <p>
          Please provide as much details as possible to help as respond
          effectively
        </p>
        <form id="incidentForm">
          <h2>Incident Reporting Form</h2>
          <div className={styles.userDetailsContainer}>
            <div className={styles.userDetails}>
              <p>
                Reporter's Full Name <span style={{ color: "red" }}>*</span>
              </p>
              <input type="text" placeholder="Enter name" required />
            </div>
            <div className={styles.userDetails}>
              <p>Department</p>
              <select name="" id="" required>
                {Departments}
              </select>
            </div>
            <div className={styles.userDetails}>
              <p>Report Date/Time</p>
              <input type="text" value={date + ", " + time} readOnly />
            </div>
          </div>
          <div className={styles.iDetailsContainer}>
            <div className={styles.iDetails}>
              <p>Incident title</p>
              <input
                type="text"
                placeholder="E.g. Pothole development on mchinji m1 road."
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
                onChange={(e) => handleDescCount(e)}
                placeholder="Describe exactly what happened, who was involved and the sequence of events. Stick to facts."
              ></textarea>
            </div>
            <div className={styles.iDetails2}>
              <p>Location Details</p>
              <input type="text" />
              <FileDropZone />
            </div>
          </div>
          <div className={styles.srButtonDiv}>
            <Link to="/policy">Privacy Policy & Data use</Link>
            <Button name="Submit Report &rarr;" classStyle={styles.srButton} />
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}

export default IncidentReport;
