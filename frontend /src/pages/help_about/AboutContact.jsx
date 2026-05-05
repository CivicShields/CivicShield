import React from "react";
import styles from "./AboutContact.module.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { team } from "../../utilities/Data";

const TeamMember = ({ name, role, bio }) => (
  <div className={styles.teamCard}>
    <div className={styles.teamImagePlaceholder} />{" "}
    {/* shall replace with images if needed */}
    <h3 style={{ margin: "10px 0 5px" }}>{name}</h3>
    <p style={{ color: "rgba(210, 210, 223, 0.87)", fontWeight: "500" }}>
      {role}
    </p>
    <p style={{ color: "white", fontSize: "0.9rem" }}>{bio}</p>
  </div>
);

function AboutContact() {
  return (
    <>
      <Header />
      <main className={styles.about}>
        <div className={styles.container}>
          {/* Team Section */}
          <section style={{ marginBottom: "100px" }}>
            <div className={styles.sectionHeader}>
              <h1>Meet Our Team</h1>
              <p>The developers behind the platform.</p>
            </div>
            <div className={styles.teamGrid}>
              {team.map((m, i) => (
                <TeamMember key={i} {...m} />
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className={styles.contactWrapper}>
            <div className={styles.contactInfo}>
              <h2>Get in Touch</h2>
              <p>Have questions? Fill out the form or reach out directly.</p>
              <div style={{ marginTop: "20px" }}>
                <p>
                  <strong>Email:</strong> support@safetytrack.io
                </p>
                <p>
                  <strong>Location:</strong> Lilongwe, Malawi
                </p>
              </div>
            </div>

            <form className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input type="text" placeholder="Your Name" />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" placeholder="email@example.com" />
              </div>
              <div className={styles.formGroup}>
                <label>Message</label>
                <textarea rows="5" placeholder="How can we help?"></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>
                Send Message
              </button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AboutContact;
