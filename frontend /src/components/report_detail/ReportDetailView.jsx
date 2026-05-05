import { useRef, useEffect } from "react";
import Talk from "talkjs";
import styles from "./ReportDetailView.module.css";

// viewingAs should be either "student" or "department"
function ReportDetailView({ report, onBack, viewingAs }) {
  const chatContainerRef = useRef();

  useEffect(() => {
    let session;

    Talk.ready.then(() => {
      const isDept = viewingAs === "department";
      const reporterId = report.created_by;

      const me = new Talk.User(
        isDept
          ? {
              id: report.assignedDepartment,
              name: `${report.assignedDepartment} Dept`,
              role: "default",
            }
          : { id: reporterId, name: "Reporter", role: "default" },
      );

      const other = new Talk.User(
        isDept
          ? { id: reporterId, name: "Reporter", role: "default" }
          : {
              id: report.assignedDepartment,
              name: `${report.assignedDepartment} Dept`,
              role: "default",
            },
      );

      session = new Talk.Session({
        appId: import.meta.env.VITE_APPID,
        me,
      });

      const conversationId = `report_${report.report_id}`;
      const conversation = session.getOrCreateConversation(conversationId);

      conversation.setParticipant(me);
      conversation.setParticipant(other);

      const chatbox = session.createChatbox();
      chatbox.select(conversation);
      chatbox.mount(chatContainerRef.current);
    });

    return () => {
      if (session) {
        session.destroy();
      }
    };
  }, [report, viewingAs]);

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
                <strong>Reported To:</strong> {report.assignedDepartment}
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
            {viewingAs === "department"
              ? `Chatting with Student (Report #${report.report_id})`
              : `Chat with ${report.assignedDepartment} Dept`}
          </h4>
          <div
            ref={chatContainerRef}
            style={{
              height: "500px",
              background: "#f3f4f6",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            {/* The Chat UI mounts here */}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ReportDetailView;
