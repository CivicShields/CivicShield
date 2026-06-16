import React, { useEffect, useRef } from "react";
import Button from "../button/Button";
import styles from "./Modal.module.css";

function Modal({ isOpen, onClose, action, children, name = "Log out" }) {
  const modalRef = useRef();

  // 1. Detect clicks outside the modal content box
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If modal is open AND the clicked element is NOT inside modalRef
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    // Add listener to the whole document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Accessibility: Close on "Escape" key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div ref={modalRef} className={styles.modal}>
        {children}
        <Button name={name} classStyle={styles.firstBut} onClick={action} />
        <Button name="Cancel" classStyle={styles.secondBut} onClick={onClose} />
      </div>
    </div>
  );
}

export default Modal;
