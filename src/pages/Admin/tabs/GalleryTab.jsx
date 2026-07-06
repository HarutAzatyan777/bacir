import React, { useState, useRef, useEffect } from "react";
import { FaCloudUploadAlt, FaImages } from "react-icons/fa";

function NewFileCard({ file, onRemove }) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!preview) return null;

  return (
    <div className="gallery-thumb-card new-thumb">
      <img src={preview} alt="New Preview" />
      <span className="gallery-badge new-badge">Նոր / Новый</span>
      <button
        type="button"
        className="delete-thumb-btn"
        onClick={onRemove}
        title="Ջնջել / Удалить"
      >
        ×
      </button>
    </div>
  );
}

export default function GalleryTab({
  setGalleryFiles,
  galleryFiles,
  galleryUrls = [],
  setGalleryUrls
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Handle case where galleryFiles might be FileList or array or empty
  const filesArray = Array.from(galleryFiles || []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (droppedFiles.length > 0) {
        setGalleryFiles([...filesArray, ...droppedFiles]);
      } else {
        alert("Խնդրում ենք ընտրել միայն պատկերային ֆայլեր (images):");
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setGalleryFiles([...filesArray, ...selectedFiles]);
    }
  };

  const handleRemoveNewFile = (idxToRemove) => {
    setGalleryFiles(filesArray.filter((_, idx) => idx !== idxToRemove));
  };

  return (
    <div className="tab-pane">
      <h3>Լուսանկարների Սրահ / Gallery</h3>
      
      <div className="gallery-upload-section" style={{ marginBottom: "25px" }}>
        <div
          className={`upload-box gallery-dropzone ${isDragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            border: "2px dashed rgba(44, 62, 53, 0.25)",
            borderRadius: "12px",
            padding: "40px 20px",
            textAlign: "center",
            cursor: "pointer",
            background: "#fafbfb",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleChange}
          />
          <div className="placeholder-icon-wrapper" style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "rgba(44, 62, 53, 0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#2c3e35",
            fontSize: "20px"
          }}>
            <FaCloudUploadAlt />
          </div>
          <span style={{ fontWeight: "600", color: "#2c3e35" }}>
            + Ավելացնել լուսանկարներ / Добавить фото
          </span>
          <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
            Քաշեք և գցեք նկարները այստեղ կամ սեղմեք ընտրելու համար
          </span>
        </div>
      </div>

      <div className="existing-gallery">
        <h4>Նկարների ցանկ ({galleryUrls.length + filesArray.length})</h4>
        
        {galleryUrls.length === 0 && filesArray.length === 0 ? (
          <div className="no-images-placeholder" style={{
            textAlign: "center",
            padding: "40px",
            border: "1px dashed #cbd5e1",
            borderRadius: "8px",
            color: "#64748b"
          }}>
            <FaImages style={{ fontSize: "36px", marginBottom: "10px", opacity: 0.5 }} />
            <p>Նկարներ դեռ չկան: Ընտրեք նկարներ վերևի դաշտից:</p>
          </div>
        ) : (
          <div className="gallery-thumbs-grid">
            {/* 1. Newly selected files */}
            {filesArray.map((file, idx) => (
              <NewFileCard
                key={`new-${idx}-${file.name}`}
                file={file}
                onRemove={() => handleRemoveNewFile(idx)}
              />
            ))}

            {/* 2. Existing files */}
            {galleryUrls.map((url, idx) => (
              <div key={`existing-${idx}`} className="gallery-thumb-card existing-thumb">
                <img src={url} alt={`Gallery ${idx}`} />
                <span className="gallery-badge existing-badge">Առկա / Загружено</span>
                <button
                  type="button"
                  className="delete-thumb-btn"
                  onClick={() => setGalleryUrls(galleryUrls.filter((_, i) => i !== idx))}
                  title="Ջնջել / Удалить"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
