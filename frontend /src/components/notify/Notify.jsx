import { useState, useEffect } from "react";
import styles from "./Notify.module.css";
import { LucideMessageSquareMore } from "lucide-react";

function Notify({ content, type = "" }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const duration = type === "error" || type === "success" ? 6000 : 12000;
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  function closeButton() {
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      className={[
        styles.notification,
        styles.show,
        type === "error"
          ? styles.error
          : type === "success"
            ? styles.success
            : styles.message,
      ].join(" ")}
    >
      <div className={styles.notiContent}>
        <h4>
          <LucideMessageSquareMore size={17} />
          {type === "error" ? (
            <span style={{ color: "red" }}>Error</span>
          ) : type === "success" ? (
            <span style={{ color: "lightgreen" }}>Success</span>
          ) : (
            <span style={{ color: "#1f2937" }}>Message</span>
          )}
        </h4>
        <p>{content}</p>
      </div>
      <button className={styles.notiClose} onClick={closeButton}>
        &times;
      </button>
    </div>
  );
}

export default Notify;
