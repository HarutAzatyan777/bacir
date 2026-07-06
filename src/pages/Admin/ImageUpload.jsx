import React, { useState, useEffect, useRef } from "react";
import { FaCloudUploadAlt, FaTrashAlt, FaExchangeAlt } from "react-icons/fa";
import ImageCropperModal from "./ImageCropperModal";
import "./ImageUpload.css";

export default function ImageUpload({
  label,
  file,
  setFile,
  url,
  setUrl,
  aspectRatio,
  placeholder = "Քաշեք և գցեք նկարը այստեղ կամ սեղմեք ընտրելու համար",
  subText = "Աջակցում է՝ JPG, PNG, WEBP, GIF (մինչև 10MB)",
  dimensionsInfo = "",
  accept = "image/*"
}) {
  const [preview, setPreview] = useState(url || "");
  const [isDragActive, setIsDragActive] = useState(false);
  const [cropTargetFile, setCropTargetFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
      return () => URL.revokeObjectURL(localUrl);
    } else {
      setPreview(url || "");
    }
  }, [file, url]);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("image/")) {
        setCropTargetFile(droppedFile);
      } else {
        alert("Խնդրում ենք ընտրել միայն պատկերային ֆայլեր (images):");
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setCropTargetFile(e.target.files[0]);
    }
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
    if (setUrl) setUrl("");
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="image-upload-wrapper">
      {label && <label className="image-upload-label">{label}</label>}
      
      <div
        className={`image-upload-dropzone ${isDragActive ? "drag-active" : ""} ${preview ? "has-preview" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="image-upload-input"
          accept={accept}
          onChange={handleChange}
        />

        {preview ? (
          <div className="image-upload-preview-container">
            <img src={preview} alt="Upload Preview" className="image-upload-img" />
            <div className="image-upload-overlay">
              <div className="image-upload-actions">
                <button
                  type="button"
                  className="upload-action-btn edit-btn"
                  onClick={handleButtonClick}
                  title="Փոխել նկարը / Изменить"
                >
                  <FaExchangeAlt /> <span>Փոխել / Изменить</span>
                </button>
                <button
                  type="button"
                  className="upload-action-btn delete-btn"
                  onClick={handleRemove}
                  title="Ջնջել / Удалить"
                >
                  <FaTrashAlt /> <span>Ջնջել / Удалить</span>
                </button>
              </div>
            </div>
            
            <div className="preview-badge">
              {file ? "Նոր / Новое (Չպահպանված)" : "Առկա / Загружено"}
            </div>
          </div>
        ) : (
          <div className="image-upload-placeholder">
            <div className="placeholder-icon-wrapper">
              <FaCloudUploadAlt className="placeholder-icon" />
            </div>
            <p className="placeholder-text">{placeholder}</p>
            <p className="placeholder-subtext">{subText}</p>
            {dimensionsInfo && <p className="placeholder-dimensions">{dimensionsInfo}</p>}
          </div>
        )}
      </div>

      {/* Cropper Modal Trigger */}
      {cropTargetFile && (
        <ImageCropperModal
          file={cropTargetFile}
          aspectRatio={aspectRatio}
          onCropComplete={(croppedFile) => {
            setFile(croppedFile);
            setCropTargetFile(null);
          }}
          onCancel={() => setCropTargetFile(null)}
        />
      )}
    </div>
  );
}
