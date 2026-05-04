import { useRef, useEffect } from "react";
import Talk from "talkjs";
import styles from "./ReportDetailView.module.css";

function ReportDetailView({ report, onBack }) {
  const chatContainerRef = useRef();

  useEffect(() => {
    Talk.ready.then(() => {
      const me = new Talk.User({
        id: "user_student",
        name: "Student Reporter",
        role: "default",
      });
      const session = new Talk.Session({
        appId: import.meta.env.VITE_APPID,
        me,
      });
      const other = new Talk.User({
        id: report.department,
        name: `${report.department} Dept`,
      });

      const conversation = session.getOrCreateConversation(
        `report_${report.report_id}`,
      );
      conversation.setParticipant(me);
      conversation.setParticipant(other);

      const chatbox = session.createChatbox();
      chatbox.select(conversation);
      chatbox.mount(chatContainerRef.current);
    });
  }, [report]);

  return (
    <div className={styles.reportsContainer}>
      <button onClick={onBack} className={styles.backButton}>
        ← Back to Reports
      </button>

      <div className={styles.detailGrid}>
        {/* Left Side: Report Information */}
        <section>
          <h2 style={{ margin: "0 0 10px 0" }}>{report.title}</h2>
          <p style={{ color: "#6b7280" }}>
            Location: {report.location} | ID: {report.report_id}
          </p>

          <div className={styles.detailSection}>
            <h4>Full Description</h4>
            <p>{report.description || "No description provided."}</p>
          </div>

          <div className={styles.detailSection}>
            <h4>Media Attachments</h4>
            <div className={styles.mediaGallery}>
              {report.doc !== "" ? (
                <img
                  src={report.doc}
                  alt="Incident"
                  className={styles.reportImage}
                />
              ) : (
                <p style={{ fontStyle: "italic", color: "#999" }}>
                  No images uploaded.
                </p>
              )}
            </div>
          </div>

          <div className={styles.detailSection}>
            <h4>Metadata</h4>
            <ul style={{ fontSize: "14px", listStyle: "none", padding: 0 }}>
              <li>
                <strong>Reported To:</strong> {report.department}
              </li>
              <li>
                <strong>Created At:</strong> {report.created_at}
              </li>
              <li>
                <strong>Category:</strong> {report.category}
              </li>
            </ul>
          </div>
        </section>

        {/* Right Side: Chat Integration */}
        <aside className={styles.chatSection}>
          <h4 style={{ marginBottom: "16px" }}>
            Chat with {report.department}
          </h4>
          <div
            ref={chatContainerRef}
            style={{
              height: "500px",
              background: "#f3f4f6",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                textAlign: "center",
                paddingTop: "50px",
                color: "#6b7280",
              }}
            >
              TalkJS Chat Interface will mount here
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ReportDetailView;
