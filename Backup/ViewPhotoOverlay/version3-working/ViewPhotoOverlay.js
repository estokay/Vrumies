import React, { useState, useRef, useEffect } from "react";
import {
  FaTimes,
  FaSearchPlus,
  FaSearchMinus,
  FaShareAlt,
  FaDownload,
  FaExpand
} from "react-icons/fa";
import "./ViewPhotoOverlay.css";
import useTimestampObjectToDate from "../../Hooks/useTimestampObjectToDate";

export default function ViewPhotoOverlay({ photoUrl, photos = null, startIndex = 0, onClose, caption, createdAt }) {
  const [zoom, setZoom] = useState(1);
  const imageRef = useRef(null);
  const dateString = useTimestampObjectToDate(createdAt);

  const imageList = photos && photos.length > 0 ? photos : [photoUrl];
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const currentPhoto = imageList[currentIndex];

  

  const stopClick = (e) => e.stopPropagation();

  const zoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.2, 1));

  const hasMultiple = imageList.length > 1;

  const nextImage = () => {
    setCurrentIndex((i) => (i + 1) % imageList.length);
  };

  const prevImage = () => {
    setCurrentIndex((i) => (i - 1 + imageList.length) % imageList.length);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!hasMultiple) return;

      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [hasMultiple, imageList.length]);

  useEffect(() => {
    setZoom(1);
  }, [currentIndex]);

  if (!imageList || imageList.length === 0 || !imageList[0]) return null;

  const downloadImage = async () => {
    try {
      const res = await fetch(currentPhoto);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "photo.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const shareImage = async () => {
    if (navigator.share) {
      await navigator.share({ url: currentPhoto });
    } else {
      await navigator.clipboard.writeText(currentPhoto);
      alert("Image link copied");
    }
  };

  const fullscreenImage = () => {
    imageRef.current?.requestFullscreen?.();
  };

  return (
    <div className="viewphotooverlay-container" onClick={onClose}>
      <div className="viewphotooverlay-inner" onClick={stopClick}>
        <div className="viewphotooverlay-image-container">
          {hasMultiple && (
            <>
              <button className="nav-arrow left" onClick={prevImage}>‹</button>
              <button className="nav-arrow right" onClick={nextImage}>›</button>
            </>
          )}
          {/* IMAGE ZOOM LAYER */}
          <img
            ref={imageRef}
            src={currentPhoto}
            alt="Expanded"
            className="viewphotooverlay-image"
            style={{ transform: `scale(${zoom})` }}
            draggable={false}
          />

          {/* DATE TOP LEFT */}
          {createdAt && (
            <div className="viewphotooverlay-date">
              {dateString}
            </div>
          )}

          {/* CAPTION */}
          {caption && (
            <div className="viewphotooverlay-caption">
              {caption}
            </div>
          )}

          {/* CONTROLS — ALWAYS TOP RIGHT OF IMAGE */}
          <div className="viewphotooverlay-controls">
            <button onClick={zoomIn} title="Zoom In"><FaSearchPlus /></button>
            <button onClick={zoomOut} title="Zoom Out"><FaSearchMinus /></button>
            <button onClick={shareImage} title="Share"><FaShareAlt /></button>
            <button onClick={downloadImage} title="Download"><FaDownload /></button>
            <button onClick={fullscreenImage} title="Fullscreen"><FaExpand /></button>
            <button onClick={onClose} title="Close"><FaTimes /></button>
          </div>
        </div>
      </div>
    </div>
  );
}