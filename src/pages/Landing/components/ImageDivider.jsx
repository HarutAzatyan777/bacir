import React from "react";
import { motion } from "framer-motion";

export default function ImageDivider({ bgImage, text1, text2 }) {
  return (
    <div className="image-divider-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="image-divider-overlay"></div>
      <div className="image-divider-content">
        <motion.div
          className="divider-glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="divider-card-accent"></div>
          {text1 && <h3 className="divider-title">{text1}</h3>}
          {text2 && <p className="divider-subtitle">{text2}</p>}
        </motion.div>
      </div>
    </div>
  );
}
