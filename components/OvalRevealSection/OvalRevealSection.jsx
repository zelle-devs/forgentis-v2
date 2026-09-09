'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './OvalRevealSection.css'

function OvalRevealSection() {
  const sectionRef = useRef(null)
  const backgroundRef = useRef(null)
  const overlayRef = useRef(null)
  const shapesRef = useRef(null)
  const scrollProgressRef = useRef(0)

  useEffect(() => {
    // ==========================================
    // INITIAL STATE - Black screen
    // ==========================================
    gsap.set(backgroundRef.current, {
      scale: 1.5,
      opacity: 0.1,
      filter: 'blur(20px)'
    })

    gsap.set(overlayRef.current, {
      opacity: 1
    })

    gsap.set(shapesRef.current, {
      opacity: 0,
      scale: 0.5
    })

    // ==========================================
    // SCROLL PROGRESS HANDLER
    // ==========================================
    const handleScrollProgress = (e) => {
      const progress = e.detail.progress
      scrollProgressRef.current = progress

      // ==========================================
      // BACKGROUND ZOOM OUT + REVEAL
      // ==========================================
      if (backgroundRef.current) {
        // Zoom out from 1.5 to 1
        const zoom = 1.5 - (progress * 0.5)
        
        // Opacity from 0.1 to 1
        const opacity = 0.1 + (progress * 0.9)

        // Blur from 20px to 0
        const blur = 20 - (progress * 20)

        gsap.to(backgroundRef.current, {
          scale: zoom,
          opacity: opacity,
          filter: `blur(${blur}px)`,
          duration: 0.1,
          ease: 'none'
        })
      }

      // ==========================================
      // OVERLAY FADE OUT
      // ==========================================
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 1 - (progress * 0.9),
          duration: 0.1,
          ease: 'none'
        })
      }

      // ==========================================
      // SHAPES SCALE IN + OPACITY
      // ==========================================
      if (shapesRef.current) {
        gsap.to(shapesRef.current, {
          opacity: progress,
          scale: 0.5 + (progress * 0.5),
          duration: 0.1,
          ease: 'none'
        })
      }
    }

    window.addEventListener('ovalRevealProgress', handleScrollProgress)

    return () => {
      window.removeEventListener('ovalRevealProgress', handleScrollProgress)
    }
  }, [])

  return (
    <div ref={sectionRef} className="oval-reveal-section">
      {/* ==========================================
          BACKGROUND IMAGE (Blurred initially)
      ========================================== */}
      <div className="oval-background-wrapper">
        <img
          ref={backgroundRef}
          src="/images/1-a.png"
          alt="Background"
          className="oval-background-image"
        />
      </div>

      {/* ==========================================
          BLACK OVERLAY
      ========================================== */}
      <div ref={overlayRef} className="oval-overlay"></div>

      {/* ==========================================
          SVG SHAPES (Vertical Ovals/Arches)
      ========================================== */}
      <div ref={shapesRef} className="oval-shapes-wrapper">
        <svg
          className="oval-shapes-svg"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Row 1 - Top Ovals */}
          <ellipse cx="240" cy="270" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="480" cy="270" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="720" cy="270" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="960" cy="270" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="1200" cy="270" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="1440" cy="270" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="1680" cy="270" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

          {/* Row 2 - Middle Ovals */}
          <ellipse cx="360" cy="540" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="600" cy="540" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="840" cy="540" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="1080" cy="540" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="1320" cy="540" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="1560" cy="540" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

          {/* Row 3 - Bottom Ovals */}
          <ellipse cx="240" cy="810" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="480" cy="810" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="720" cy="810" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="960" cy="810" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="1200" cy="810" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="1440" cy="810" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="1680" cy="810" rx="120" ry="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* ==========================================
          CONTENT (Optional - Title)
      ========================================== */}
      <div className="oval-reveal-content">
        <h2>Discover The Artistry</h2>
        <p>Precision in every curve, elegance in every shape</p>
      </div>
    </div>
  )
}

export default OvalRevealSection