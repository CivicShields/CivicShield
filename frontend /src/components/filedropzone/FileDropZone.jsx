import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./FileDropZone.module.css";

function FileDropZone({ onFileSelect }) {
  const [filePreview, setFilePreview] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]; // Get the first file
      if (!file) return;

      if (file.type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview("document");
      }

      onFileSelect(file);
    },
    [onFileSelect],
  );

  // Function to clear the selection
  const removeFile = (e) => {
    e.stopPropagation(); // Prevents the dropzone from opening
    setFilePreview(null);
    onFileSelect(""); // Clear file in the parent form state
  };

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [], "application/pdf": [] },
  });

  return (
    <div className={styles.container}>
      <h5 className={styles.heading}>Upload Document</h5>

      <div {...getRootProps()} className={styles.dropzoneContainer}>
        <input {...getInputProps()} required />

        {filePreview ? (
          <div className={styles.previewSection}>
            <div className={styles.thumbnailWrapper}>
              {filePreview === "document" ? (
                <div className={styles.iconPlaceholder}>📄 PDF Attached</div>
              ) : (
                <img
                  src={filePreview}
                  alt="Preview"
                  className={styles.thumbnail}
                />
              )}
              <button
                type="button"
                className={styles.removeBtn}
                onClick={removeFile}
                title="Remove file"
              >
                &times;
              </button>
            </div>
            <p className={styles.changeText}>Click or drag to change file</p>
          </div>
        ) : (
          <div className={styles.uploadPrompt}>
            {isDragActive ? (
              <p>Drop it!</p>
            ) : (
              <p>Drag & drop evidence or click to browse</p>
            )}
            <button type="button" className={styles.uploadButton}>
              Select File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileDropZone;
