'use client'
import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner = () => {
  return (
    <div className="ls-overlay">
      <div className="ls-spinner">
        <div className="ls-dot"></div>
        <div className="ls-dot"></div>
        <div className="ls-dot"></div>
        <div className="ls-dot"></div>
        <div className="ls-dot"></div>
        <div className="ls-dot"></div>
        <div className="ls-dot"></div>
        <div className="ls-dot"></div>
        <div className="ls-dot"></div>
        <div className="ls-dot"></div>
        <div className="ls-dot"></div>
        <div className="ls-dot"></div>
        <div className="ls-text">Loading…</div>
      </div>
    </div>
  )
}

export default LoadingSpinner