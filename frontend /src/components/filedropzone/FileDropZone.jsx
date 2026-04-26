import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./FileDropZone.module.css";

// component responsible for file uploading which used module react-dropzone

function FileDropZone() {
  const onDrop = useCallback((acceptedFiles) => {
    alert(`File uploaded: ${acceptedFiles[0].name}`);
  }, []);

  const { getInputProps, getRootProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div style={{ padding: 30 }}>
      <h5 className={styles.heading}>Upload Document</h5>

      <div {...getRootProps()} className={styles.dropzoneContainer}>
        <input {...getInputProps()} />

        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <>
            <p>Drag & drop a file here or click to browse</p>
            {/* The Button */}
            <button type="button" className={styles.uploadButton}>
              Select File
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default FileDropZone;
