import React, { useState, useEffect, useRef } from "react";
import { UploadOutlined, DeleteOutlined, SwapOutlined } from "@ant-design/icons";
import { message } from "antd";
import ImageCropperModal from "./ImageCropperModal";
import "./ImageUpload.css";

export default function ImageUpload({
  label,
  file,
  setFile,
  url,
  setUrl,
  aspectRatio,
  placeholder = "Սեղմեք կամ քաշեք նկարը",
  subText = "JPG, PNG, WEBP, GIF · մինչև 10MB",
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
        message.warning("Խնդրում ենք ընտրել միայն պատկերային ֆայլեր (images):");
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

      <div className={`image-upload-row ${preview ? "has-preview" : ""}`}>
        {/* Drop Zone */}
        <div
          className={`image-upload-dropzone ${isDragActive ? "drag-active" : ""} ${preview ? "compact" : ""}`}
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

          <div className="image-upload-placeholder">
            <div className="placeholder-icon-wrapper">
              <UploadOutlined className="placeholder-icon" style={{ fontSize: preview ? "1.4rem" : "2rem", color: "#556b5e" }} />
            </div>
            {!preview && (
              <>
                <p className="placeholder-text">{placeholder}</p>
                <p className="placeholder-subtext">{subText}</p>
                {dimensionsInfo && <p className="placeholder-dimensions">{dimensionsInfo}</p>}
              </>
            )}
            {preview && <p className="placeholder-subtext compact-hint">Փոխարինել</p>}
          </div>
        </div>

        {/* Side Preview Panel */}
        {preview && (
          <div className="image-side-preview" style={{ animation: "slideInRight 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
            <div className="image-side-preview-img-wrap">
              <img src={preview} alt="Preview" className="image-side-img" />
              <div className="preview-badge">
                {file ? "Չպահպանված" : "Բեռնված"}
              </div>
            </div>
            <div className="image-side-actions">
              <button
                className="upload-action-btn upload-action-change"
                onClick={handleButtonClick}
                title="Փոխել նկարը"
              >
                <SwapOutlined />
                <span>Փոխել</span>
              </button>
              <button
                className="upload-action-btn upload-action-delete"
                onClick={handleRemove}
                title="Հեռացնել"
              >
                <DeleteOutlined />
                <span>Հեռացնել</span>
              </button>
            </div>
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
