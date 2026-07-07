import React from "react";
import "./Logo.css";

/**
 * BACIR ONLINE Brand Logo Component
 * 
 * @param {Object} props
 * @param {"horizontal" | "vertical"} [props.variant="horizontal"] - The logo layout variant
 * @param {"gold" | "dark" | "light"} [props.theme="gold"] - The color theme
 * @param {number} [props.height] - Optional custom height override in pixels
 */
export default function Logo({ variant = "horizontal", theme = "gold", height }) {
  // Determine default height based on variant if not provided
  const logoHeight = height || (variant === "horizontal" ? 36 : 80);

  // SVG viewBox is 0 0 100 100. We compute width assuming square proportions for the icon.
  return (
    <div className={`logo-container variant-${variant} theme-${theme}`}>
      <div className="logo-svg-wrapper" style={{ height: `${logoHeight}px`, width: `${logoHeight}px` }}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="logo-svg"
        >
          <defs>
            {/* Soft Metallic Gold Gradient */}
            <linearGradient id="logo-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFBA6B" />
              <stop offset="35%" stopColor="#F5E3B5" />
              <stop offset="70%" stopColor="#C89D4B" />
              <stop offset="100%" stopColor="#9E782F" />
            </linearGradient>

            {/* Premium Sage Green Gradient */}
            <linearGradient id="logo-sage-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22322A" />
              <stop offset="100%" stopColor="#3E5A49" />
            </linearGradient>

            {/* Dark Theme Outline/Stroke Gradient */}
            <linearGradient id="logo-dark-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c3e35" />
              <stop offset="100%" stopColor="#5a7a60" />
            </linearGradient>

            {/* Light Theme Outline/Stroke Gradient */}
            <linearGradient id="logo-light-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#E8E0D5" />
            </linearGradient>

            {/* Drop Shadow Filter for Wax Seal */}
            <filter id="seal-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Sparkle 1 (Top Left) */}
          <path
            className="logo-sparkle logo-sparkle-1"
            d="M26 14 l1.5 4.5 l4.5 1.5 l-4.5 1.5 l-1.5 4.5 l-1.5 -4.5 l-4.5 -1.5 l4.5 -1.5 Z"
            fill="url(#logo-gold-grad)"
          />

          {/* Sparkle 2 (Top Right) */}
          <path
            className="logo-sparkle logo-sparkle-2"
            d="M74 24 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 l3 -1 Z"
            fill="url(#logo-gold-grad)"
          />

          {/* Outer Envelope Silhouette */}
          {/* Backplate of the Envelope */}
          <path
            d="M15 45 h70 v40 h-70 Z"
            fill={theme === "light" ? "rgba(255, 255, 255, 0.08)" : "rgba(44, 62, 53, 0.03)"}
            stroke={theme === "light" ? "url(#logo-light-stroke)" : (theme === "gold" ? "url(#logo-gold-grad)" : "url(#logo-dark-stroke)")}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Envelope Open Flap (pointing up) */}
          <path
            className="logo-envelope-flap"
            d="M15 45 L50 20 L85 45"
            stroke={theme === "light" ? "url(#logo-light-stroke)" : (theme === "gold" ? "url(#logo-gold-grad)" : "url(#logo-dark-stroke)")}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Card Inside (protruding slightly) */}
          <path
            d="M22 36 h56 v24 h-56 Z"
            fill={theme === "light" ? "rgba(255, 255, 255, 0.15)" : "rgba(44, 62, 53, 0.06)"}
            stroke={theme === "light" ? "url(#logo-light-stroke)" : (theme === "gold" ? "url(#logo-gold-grad)" : "url(#logo-dark-stroke)")}
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />

          {/* Envelope Inner Folds (Front Overlay) */}
          {/* Left Fold */}
          <path
            d="M15 45 L48 68 L15 85"
            stroke={theme === "light" ? "url(#logo-light-stroke)" : (theme === "gold" ? "url(#logo-gold-grad)" : "url(#logo-dark-stroke)")}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Fold */}
          <path
            d="M85 45 L52 68 L85 85"
            stroke={theme === "light" ? "url(#logo-light-stroke)" : (theme === "gold" ? "url(#logo-gold-grad)" : "url(#logo-dark-stroke)")}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bottom Fold */}
          <path
            d="M15 85 L50 64 L85 85"
            fill={theme === "light" ? "rgba(255, 255, 255, 0.03)" : "rgba(44, 62, 53, 0.02)"}
            stroke={theme === "light" ? "url(#logo-light-stroke)" : (theme === "gold" ? "url(#logo-gold-grad)" : "url(#logo-dark-stroke)")}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Organic-shaped Luxury Wax Seal */}
          <g className="logo-wax-seal" filter="url(#seal-shadow)">
            {/* Outer melted wax outline */}
            <path
              d="M50 44 c6.5 0 12.5 3 13.5 9.5 s-2.5 12.5 -9.5 13.5 s-13.5 -2.5 -13.5 -9s4.5 -14 9.5 -14 Z"
              fill="url(#logo-gold-grad)"
            />
            {/* Inner pressed area */}
            <circle
              cx="50"
              cy="56"
              r="9"
              fill="none"
              stroke="#87621B"
              strokeWidth="0.75"
              strokeOpacity="0.4"
            />
            {/* Monogram Serif 'B' */}
            <path
              d="M48 51.5 h3.2 c1.4 0 2.2 0.6 2.2 1.5 c0 0.8 -0.6 1.3 -1.5 1.4 c1.1 0.1 1.8 0.7 1.8 1.7 c0 1.1 -0.9 1.9 -2.5 1.9 H48 Z 
                 M49.2 52.5 v2.2 h1.8 c0.7 0 1.1 -0.3 1.1 -1.1 c0 -0.8 -0.4 -1.1 -1.1 -1.1 Z
                 M49.2 55.6 v2.4 h2 c0.8 0 1.3 -0.4 1.3 -1.2 c0 -0.8 -0.5 -1.2 -1.3 -1.2 Z"
              fill="#5A4012"
            />
          </g>
        </svg>
      </div>

      <div className="logo-text-group">
        <span className="logo-main-text">BACIR</span>
        <span className="logo-sub-text">ONLINE</span>
      </div>
    </div>
  );
}
