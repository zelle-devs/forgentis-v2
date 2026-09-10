'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './ContactSection.css'

function ContactSection() {
  const sectionRef = useRef(null)
  const leftContentRef = useRef(null)
  const bgImageRef = useRef(null)
  const lettersRef = useRef([])

  const contactWord = "CONTACT"

  useEffect(() => {
    const handleQualityProgress = (e) => {
      const progress = e.detail.progress // 0 -> 1

      // Left content animation
      if (leftContentRef.current) {
        gsap.to(leftContentRef.current, {
          y: -progress * 40,
          opacity: 1 - progress * 0.2,
          duration: 0.1,
          ease: 'none',
          overwrite: 'auto',
        })
      }

      // Background image fade/parallax effect
      if (bgImageRef.current) {
        gsap.to(bgImageRef.current, {
          opacity: 0.35 + progress * 0.25,
          scale: 1 + progress * 0.05,
          duration: 0.1,
          ease: 'none',
          overwrite: 'auto',
        })
      }

      // Staggered letters aligning into a straight line
      lettersRef.current.forEach((el, index) => {
        if (!el) return
        const initialOffsets = [-50, 70, -35, 60, -25, 45, -60]
        const currentOffset = initialOffsets[index] * (1 - progress)

        gsap.to(el, {
          y: currentOffset,
          duration: 0.1,
          ease: 'none',
          overwrite: 'auto',
        })
      })
    }

    window.addEventListener('qualityProgress', handleQualityProgress)
    return () => {
      window.removeEventListener('qualityProgress', handleQualityProgress)
    }
  }, [])

  return (
    <div ref={sectionRef} className="quality-section">
      {/* Background Fade Portrait Image */}
      <div ref={bgImageRef} className="quality-bg-image-wrapper">
        <div className="quality-bg-overlay" />
      </div>

      <div className="quality-container">
        {/* Left Side Content */}
        <div ref={leftContentRef} className="quality-left">
          <h2 className="quality-heading">HAVE SOMETHING WORTH BUILDING?</h2>
          <p className="quality-subtext">
            Bring us the challenge.<br />
            Bring us the idea.<br />
            We&apos;ll turn it into metal.
          </p>
          <button className="quality-btn">START A PROJECT</button>
        </div>

        {/* Right Side: Giant Staggered 'CONTACT' word */}
        <div className="quality-right-word">
          <div className="staggered-word-track">
            {contactWord.split('').map((char, index) => (
              <span
                key={index}
                ref={(el) => (lettersRef.current[index] = el)}
                className="staggered-char"
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="quality-footer">
        <span className="quality-brand">FORGENTIS</span>
        <span className="quality-tagline">PRECISION FABRICATION. WITHOUT COMPROMISE.</span>
      </div>
    </div>
  )
}

export default ContactSection