import styles from "./UserDashboard.module.css";
import { Link } from "react-router-dom";
import { Bell, Siren, FileText, User2Icon } from "lucide-react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import { getElapsedTime } from "../../../utilities/Date_utilities";
import { useEffect, useState, useMemo } from "react";

function UserDashboard() {
  const [reports, setReports] = useState([]);

  const userReports = useMemo(() => {
    return reports.length > 0 ? (
      reports
        .sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        })
        .slice(0, 5)
        .map((report, index) => {
          //set the reports to only show a maximum of ten
          if (report.status === "pending") {
            return (
              <div key={index}>
                <div className={styles.reportDetails}>
                  <span className={styles.pending}>&#11044;</span>
                  <p>
                    {report.title} - {report.named_location} <br />{" "}
                    <span>
                      {report.category} &bull; Reported{" "}
                      {getElapsedTime(report.created_at)} &bull; {report.id}
                    </span>
                  </p>
                </div>
                <p className={styles.pending}>pending</p>
              </div>
            );
          } else if (report.status === "resolved") {
            return (
              <div key={index}>
                <div className={styles.reportDetails}>
                  <span className={styles.resolved}>&#11044;</span>
                  <p>
                    {report.title} - {report.named_location}
                    <br />{" "}
                    <span>
                      {" "}
                      {report.category} &bull;Reported{" "}
                      {getElapsedTime(report.created_at)} &bull; {report.id}
                    </span>
                  </p>
                </div>
                <p className={styles.resolved}>resolved</p>
              </div>
            );
          } else {
            return (
              <div key={index}>
                <div className={styles.reportDetails}>
                  <span className={styles.inprogress}>&#11044;</span>
                  <p>
                    {report.title} - {report.named_location}
                    <br />{" "}
                    <span>
                      {report.category} &bull; Reported{" "}
                      {getElapsedTime(report.created_at)} &bull; {report.id}
                    </span>
                  </p>
                </div>
                <p className={styles.inprogress}>In Progress</p>
              </div>
            );
          }
        })
    ) : (
      <center className={styles.noreport}>
        <span>No reports made yet</span>
      </center>
    );
  }, [reports]);

  useEffect(() => {
    async function fetchReports() {
      const req = await fetch("/incident/reporter/", {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) setReports(res.reports);
    }
    fetchReports();
  }, [reports.length]);

  if (!reports) return <div>....isloading</div>;

  return (
    <>
      <Header />
      <main className={styles.dashboard}>
        <section className={styles.firstSection}>
          <div>
            <p>TOTAL REPORTS</p>
            <p>{reports.length}</p>
            <p>Since joining</p>
          </div>
          <div>
            <p>PENDING</p>
            <p>{reports.filter((item) => item.status === "pending").length}</p>
            <p>Awaiting response</p>
          </div>
          <div>
            <p>IN PROGRESS</p>
            <p>
              {reports.filter((item) => item.status === "in_progress").length}
            </p>
            <p>Agent assigned</p>
          </div>
          <div>
            <p>RESOLVED</p>
            <p>{reports.filter((item) => item.status === "resolved").length}</p>
            <p>Successfully closed</p>
          </div>
        </section>
        <section className={styles.secondSection}>
          <div className={styles.reportHeader}>
            <p>My Recent Reports</p>
            <Link to="/settings/myreports" className={styles.repo}>
              View all &rarr;
            </Link>
          </div>
          <div className={styles.report}>{userReports}</div>
        </section>
        <section className={styles.lastSection}>
          <p>Quick Actions</p>
          <div className={styles.quick}>
            <div className={styles.under}>
              <Link to="/report" className={styles.cont}>
                <Siren size={35} color="red" />
                <p>
                  New Report
                  <br />
                  <span>Submit incident</span>
                </p>
              </Link>
              <Link to="/settings/myreports" className={styles.cont}>
                {" "}
                <FileText size={35} />
                <p>
                  My Reports
                  <br />
                  <span>View all {reports.length}</span>
                </p>
              </Link>
            </div>
            <div className={styles.under}>
              <Link to="/settings/notifications" className={styles.cont}>
                <Bell size={35} color="orange" />
                <p>
                  Notifications
                  <br />
                  <span>2 unread</span>
                </p>
              </Link>
              <Link to="/settings/profile" className={styles.cont}>
                {" "}
                <User2Icon size={35} color="blue" />
                <p>
                  My Profile
                  <br />
                  <span>Edit details</span>
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default UserDashboard;
