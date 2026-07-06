import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearchPlus, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const galleryImages = [
  { id: 1, src: "images/1762250986-9.avif", tag: "Wedding / Portrait", size: "large", slug: "demo-wedding-portrait" },
  { id: 2, src: "images/1749120138-12.avif", tag: "Minimal / Modern", size: "small", slug: "demo-minimal-modern" },
  { id: 3, src: "images/1749120139-3.avif", tag: "Floral / Classic", size: "tall", slug: "demo-floral-classic" },
  { id: 4, src: "images/4.avif", tag: "Chic / Elegant", size: "wide", slug: "demo-chic-elegant" },
  { id: 5, src: "images/1749120138-6.avif", tag: "Luxury / Gold", size: "small", slug: "demo-luxury-gold" },
  { id: 6, src: "images/1762342687-05.avif", tag: "Romantic / Photo", size: "tall", slug: "demo-romantic-photo" },
  { id: 7, src: "images/1749120139-11.avif", tag: "Aesthetic / Editorial", size: "large", slug: "demo-aesthetic-editorial" },
  { id: 8, src: "images/2.avif", tag: "Vintage / Retro", size: "wide", slug: "demo-vintage-retro" }
];

export default function GallerySection({ t }) {
  const [selectedIdx, setSelectedIdx] = useState(null);

  const openLightbox = (idx) => setSelectedIdx(idx);
  const closeLightbox = () => setSelectedIdx(null);

  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <section className="gallery-section">
      <div className="section-header">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t.galleryTitle}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t.gallerySubtitle}
        </motion.p>
      </div>

      <div className="gallery-grid">
        {galleryImages.map((img, idx) => (
          <motion.div
            key={img.id}
            className={`gallery-card size-${img.size}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            onClick={() => openLightbox(idx)}
          >
            <div className="gallery-img-wrapper">
              <img src={img.src} alt={`Template ${img.id}`} className="gallery-img" loading="lazy" />
              <div className="gallery-card-overlay">
                <span className="gallery-card-icon">
                  <FaSearchPlus />
                </span>
                <span className="gallery-card-tag">{img.tag}</span>
                {img.slug && (
                  <button
                    className="gallery-view-demo-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/i/${img.slug}`, '_blank');
                    }}
                  >
                    {t.viewTemplate}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">
              <FaTimes />
            </button>

            <button className="lightbox-nav prev" onClick={prevImage} aria-label="Previous image">
              <FaChevronLeft />
            </button>

            <motion.div
              className="lightbox-content"
              key={selectedIdx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[selectedIdx].src}
                alt={`Expanded Template ${galleryImages[selectedIdx].id}`}
                className="lightbox-img"
              />
              <div className="lightbox-caption">
                <span>{galleryImages[selectedIdx].tag}</span>
                {galleryImages[selectedIdx].slug && (
                  <a
                    href={`/i/${galleryImages[selectedIdx].slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lightbox-demo-link"
                  >
                    {t.viewTemplate}
                  </a>
                )}
              </div>
            </motion.div>

            <button className="lightbox-nav next" onClick={nextImage} aria-label="Next image">
              <FaChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
