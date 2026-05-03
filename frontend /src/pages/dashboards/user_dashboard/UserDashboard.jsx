import styles from "./UserDashboard.module.css";
import { Link } from "react-router-dom";
import { Bell, Siren, FileText, User2Icon } from "lucide-react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import GetReports from "../../../utilities/GetReports";
import { getElapsedTime } from "../../../utilities/Date_utilities";

function UserDashboard() {
  const report = GetReports();

  const reports =
    report.length > 0 ? (
      report.slice(0, 10).map((report, index) => {
        //set the reports to only show a maximum of ten
        if (report.status === "Pending") {
          return (
            <div key={index}>
              <div className={styles.reportDetails}>
                <span className={styles.pending}>&#11044;</span>
                <p>
                  {report.title} - {report.location} <br />{" "}
                  <span>
                    {report.category} &bull; Reported{" "}
                    {getElapsedTime(report.created_at)} &bull;{" "}
                    {report.report_id}
                  </span>
                </p>
              </div>
              <p className={styles.pending}>pending</p>
            </div>
          );
        } else if (report.status === "Resolved") {
          return (
            <div key={index}>
              <div className={styles.reportDetails}>
                <span className={styles.resolved}>&#11044;</span>
                <p>
                  {report.title} - {report.location}
                  <br />{" "}
                  <span>
                    {" "}
                    {report.category} &bull;Reported{" "}
                    {getElapsedTime(report.created_at)} &bull;{" "}
                    {report.report_id}
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
                  {report.title} - {report.location}
                  <br />{" "}
                  <span>
                    {report.category} &bull; Reported{" "}
                    {getElapsedTime(report.created_at)} &bull;{" "}
                    {report.report_id}
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

  return (
    <>
      <Header />
      <main className={styles.dashboard}>
        <section className={styles.firstSection}>
          <div>
            <p>TOTAL REPORTS</p>
            <p>{report.length}</p>
            <p>Since joining</p>
          </div>
          <div>
            <p>PENDING</p>
            <p>{report.filter((item) => item.status === "Pending").length}</p>
            <p>Awaiting response</p>
          </div>
          <div>
            <p>IN PROGRESS</p>
            <p>
              {report.filter((item) => item.status === "In Progress").length}
            </p>
            <p>Agent assigned</p>
          </div>
          <div>
            <p>RESOLVED</p>
            <p>{report.filter((item) => item.status === "Resolved").length}</p>
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
          <div className={styles.report}>{reports}</div>
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
                  <span>View all {report.length}</span>
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
