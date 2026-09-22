'use client'
import React from 'react';
import './DynamicButton.css';

const DynamicButton = ({ 
  label, 
  onClick, 
  type = "button", 
  disabled = false, 
  className = "",
  variant = "solid",
  borderRadius,
  width = "default",
  height,
  size = "md"
}) => {
  const variantClass = variant === "outline" ? "db-outline" : "db-solid";
  const sizeClass = `db-${size}`;

  const getWidthStyle = () => {
    if (width === "full") return "100%";
    if (width === "default") return "fit-content";
    return width;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`db-btn ${variantClass} ${sizeClass} ${className}`}
      style={{ 
        borderRadius: borderRadius || 'var(--radius-lg)',
        width: getWidthStyle(),
        height: height || undefined
      }}
    >
      <span className="db-btn-text">{label}</span>
    </button>
  );
};

export default DynamicButton;