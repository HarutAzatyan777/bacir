import React, { useState, useEffect, useRef } from "react";
import { Modal, Slider, Button } from "antd";
import { UndoOutlined } from "@ant-design/icons";
import "./ImageCropperModal.css";

export default function ImageCropperModal({
  file,
  aspectRatio,
  onCropComplete,
  onCancel
}) {
  const [imageSrc, setImageSrc] = useState("");
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const imgRef = useRef(null);
  const frameRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });

  // Generate object URL for the local file
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Center image inside the crop frame initially
  const handleImageLoad = () => {
    const img = imgRef.current;
    const frame = frameRef.current;
    if (!img || !frame) return;

    const imgRect = img.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();

    setPosition({
      x: (frameRect.width - imgRect.width) / 2,
      y: (frameRect.height - imgRect.height) / 2
    });
    setZoom(1);
  };

  // Mouse / Drag Handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers for Mobile Devices
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.current.x,
      y: e.touches[0].clientY - dragStart.current.y
    });
  };

  const handleReset = () => {
    handleImageLoad();
  };

  const handleCrop = () => {
    const img = imgRef.current;
    const frame = frameRef.current;
    if (!img || !frame) return;

    const imgRect = img.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();

    // Map screen-rendered size back to original image space
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    // Bounding coordinates on the original image
    const sourceX = (frameRect.left - imgRect.left) * scaleX;
    const sourceY = (frameRect.top - imgRect.top) * scaleY;
    const sourceW = frameRect.width * scaleX;
    const sourceH = frameRect.height * scaleY;

    // Create Canvas to perform the crop
    const canvas = document.createElement("canvas");
    
    // We can define output dimensions. Let's make it sharp:
    // Output size will match original image resolution in that crop frame
    canvas.width = Math.min(sourceW, 2048); // Cap output resolution for performance
    canvas.height = canvas.width / (frameRect.width / frameRect.height);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw cropped section
      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceW,
        sourceH,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Export as Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const croppedFile = new File([blob], file.name || "cropped_image.jpg", {
              type: file.type || "image/jpeg",
              lastModified: Date.now()
            });
            onCropComplete(croppedFile);
          }
        },
        file.type || "image/jpeg",
        0.92 // 92% Quality compression
      );
    }
  };

  // Calculate crop frame dimensions based on Aspect Ratio
  const maxW = 280;
  const maxH = 280;
  let frameW = maxW;
  let frameH = maxH;

  if (aspectRatio) {
    if (aspectRatio > 1) {
      frameW = maxW;
      frameH = maxW / aspectRatio;
    } else {
      frameH = maxH;
      frameW = maxH * aspectRatio;
    }
  }

  if (!file) return null;

  return (
    <Modal
      title="Կտրել նկարը / Обрезать фото"
      open={true}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Չեղարկել / Отмена
        </Button>,
        <Button key="crop" type="primary" onClick={handleCrop} style={{ backgroundColor: "#2c3e35" }}>
          Կտրել և Պահպանել / Обрезать
        </Button>
      ]}
      width={400}
      centered
      className="image-cropper-antd-modal"
    >
      <div className="cropper-viewport-container" style={{ display: "flex", justifyContent: "center", overflow: "hidden", position: "relative" }}>
        <div 
          className="cropper-workspace"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          style={{ width: "320px", height: "320px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {imageSrc && (
            <img
              ref={imgRef}
              src={imageSrc}
              alt="To Crop"
              className="cropper-preview-img"
              onLoad={handleImageLoad}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                cursor: isDragging ? "grabbing" : "grab",
                position: "absolute",
                maxWidth: "none",
                maxHeight: "none"
              }}
            />
          )}

          {/* Dark Mask Overlay around the frame */}
          <div className="cropper-overlay-mask" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", pointerEvents: "none", zIndex: 5 }}></div>

          {/* Target Crop Box */}
          <div
            ref={frameRef}
            className="cropper-crop-frame"
            style={{
              width: `${frameW}px`,
              height: `${frameH}px`,
              position: "relative",
              zIndex: 10,
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
              border: "2px solid #ffffff"
            }}
          >
            <div className="frame-corner top-left"></div>
            <div className="frame-corner top-right"></div>
            <div className="frame-corner bottom-left"></div>
            <div className="frame-corner bottom-right"></div>
            
            {/* Optional aspect indicator overlay */}
            {aspectRatio && (
              <div className="aspect-ratio-indicator">
                {aspectRatio === 1 ? "1:1" : aspectRatio > 1.7 ? "16:9" : aspectRatio < 0.6 ? "9:16" : "3:2"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="cropper-controls" style={{ marginTop: "20px" }}>
        <div className="zoom-control-row" style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
          <span style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>Մասշտաբ:</span>
          <Slider
            min={1}
            max={4}
            step={0.02}
            value={zoom}
            onChange={setZoom}
            style={{ flex: 1 }}
          />
          <Button 
            shape="circle"
            icon={<UndoOutlined />} 
            onClick={handleReset} 
            title="Կենտրոնացնել / Сбросить"
          />
        </div>
      </div>
    </Modal>
  );
}
