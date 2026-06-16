import React from "react";
import styles from "./Policy.module.css";

function Policy() {
  // Handles moving back to the incident form
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className={styles.policyContainer}>
      {/* Back Navigation Row */}
      <div className={styles.policyNavigation}>
        <button className={styles.backBtn} onClick={handleBack}>
          <span className={styles.backArrow}>←</span> Back to Reporting Form
        </button>
      </div>

      {/* Main Content Area */}
      <main className={styles.policyContent}>
        <h1>Incident Reporting Policy & Data Usage Notice</h1>
        <p className={styles.policyLastUpdated}>Last updated: June 2026</p>

        <p className={styles.policyIntro}>
          Before submitting an official incident report, please carefully review
          how your personal information, organizational data and uploaded media
          are managed, processed and distributed across our infrastructure.
        </p>

        <section className={styles.policySection}>
          <h2>1. Data Collection & Cross-Service Scope</h2>
          <p>
            When you create an incident report, our system records the following
            specific elements:
          </p>
          <ul>
            <li>
              <strong>Identity Details (Auth Service):</strong> Your unique
              account token and reporter profile are linked to the record to
              maintain accountability, enforce access controls and assign case
              ownership.
            </li>
            <li>
              <strong>Operational Mapping (Department Service):</strong> The
              designated department code is utilized to route your issue
              dynamically to authorized handlers and supervisors within that
              business boundary.
            </li>
            <li>
              <strong>Attachments & Streams (Media Service):</strong> Any files,
              documentation or evidence uploaded are partitioned and transmitted
              directly to secure isolated storage nodes.
            </li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>2. How Your Data Is Processed</h2>
          <p>
            The system optimizes and propagates your submission through
            automated background routines:
          </p>
          <div className={styles.processCard}>
            <h3>Automated Alerts & Dispatching</h3>
            <p>
              Upon hitting submit, data payloads trigger our internal{" "}
              <strong>Notification Service</strong>. This instantly dispatches
              security updates, administrative notices, and status tracking
              flags to designated system administrators and associated
              management personnel via secure microservice endpoints.
            </p>
          </div>
        </section>

        <section className={styles.policySection}>
          <h2>3. Storage Security & Data Retention</h2>
          <p>
            We do not share your structural files or user information with any
            external databases. Records are maintained in segregated
            service-level data stores configured with token-based access
            verification layers. Information remains retrievable by
            administrators until an incident is formally resolved, flagged for
            deletion or archival workflows are enacted by data security teams.
          </p>
        </section>

        <section className={styles.policySection}>
          <h2>4. User Rights and Consents</h2>
          <p>
            By proceeding with the submission of this incident, you acknowledge
            that your system identity, assigned structural group targets and
            accompanying file uploads are necessary variables required to
            execute resolution tracking processes within the platform boundary.
          </p>
        </section>

        {/* Bottom Call to Action / Back Button Alternative */}
        <div className={styles.policyFooter}>
          <p>Ready to complete your submission?</p>
          <button className={styles.backBtnPrimary} onClick={handleBack}>
            Return and Fill Report
          </button>
        </div>
      </main>
    </div>
  );
}

export default Policy;
