import styles from "./UserDashboard.module.css";
import { Link } from "react-router-dom";
import { Bell, Siren, FileText, User2Icon } from "lucide-react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";

function UserDashboard() {
  return (
    <>
      <Header />
      <main className={styles.dashboard}>
        <section className={styles.firstSection}>
          <div>
            <p>TOTAL REPORTS</p>
            <p>7</p>
            <p>Since joining</p>
          </div>
          <div>
            <p>PENDING</p>
            <p>2</p>
            <p>Awaiting response</p>
          </div>
          <div>
            <p>IN PROGRESS</p>
            <p>1</p>
            <p>Agent assigned</p>
          </div>
          <div>
            <p>RESOLVED</p>
            <p>4</p>
            <p>Successfully closed</p>
          </div>
        </section>
        <section className={styles.secondSection}>
          <div className={styles.reportHeader}>
            <p>My Recent Reports</p>
            <Link to="/myreports" className={styles.repo}>
              View all &rarr;
            </Link>
          </div>
          <div className={styles.report}>
            <div>
              <div className={styles.reportDetails}>
                <span className={styles.inprogress}>&#11044;</span>
                <p>
                  Building Fire - Area 15 <br />{" "}
                  <span>Fire &bull; Reported 2hrs ago &bull; #INC-0041</span>
                </p>
              </div>
              <p className={styles.inprogress}>in Progress</p>
            </div>
            <div>
              <div className={styles.reportDetails}>
                <span className={styles.pending}>&#11044;</span>
                <p>
                  Road Collision - Chilomini <br />{" "}
                  <span>
                    Accident &bull; Reported yesterday &bull; #INC-0038
                  </span>
                </p>
              </div>
              <p className={styles.pending}>pending</p>
            </div>
            <div>
              <div className={styles.reportDetails}>
                <span className={styles.inprogress}>&#11044;</span>
                <p>
                  Broken water pipe <br />{" "}
                  <span>
                    Infrastructure &bull; Reported yesterday &bull; #INC-0034
                  </span>
                </p>
              </div>
              <p className={styles.inprogress}>In Progress</p>
            </div>
            <div>
              <div className={styles.reportDetails}>
                <span className={styles.resolved}>&#11044;</span>
                <p>
                  Stolen Motorcycle <br />{" "}
                  <span>
                    {" "}
                    Crime &bull;Reported 1 week ago ago &bull; #INC-0029
                  </span>
                </p>
              </div>
              <p className={styles.resolved}>resolved</p>
            </div>
          </div>
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
                  <span>View all 7</span>
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
