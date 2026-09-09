// components/StickyFooter/StickyFooter.jsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './StickyFooter.css'

function StickyFooter() {
  const progressLineRef = useRef(null)
  const chaptersRef = useRef(null)

  useEffect(() => {
    const handleScrollProgress = (e) => {
      const progress = e.detail.progress

      if (progressLineRef.current) {
        gsap.to(progressLineRef.current, {
          scaleX: progress,
          duration: 0.1,
          ease: 'none'
        })
      }

      if (chaptersRef.current) {
        gsap.to(chaptersRef.current, {
          opacity: 1,
          duration: 0.1
        })
      }
    }

    window.addEventListener('scrollProgress', handleScrollProgress)
    window.addEventListener('thirdSlideProgress', handleScrollProgress)
    window.addEventListener('thirdHorizontalProgress', handleScrollProgress)

    return () => {
      window.removeEventListener('scrollProgress', handleScrollProgress)
      window.removeEventListener('thirdSlideProgress', handleScrollProgress)
      window.removeEventListener('thirdHorizontalProgress', handleScrollProgress)
    }
  }, [])

  return (
    <footer className="sticky-footer">
      <div className="footer-chapters" ref={chaptersRef}>
        <span className="chapter active">Chapter I</span>
        <span className="chapter-divider"></span>
        <span className="chapter">Chapter II</span>
        <span className="chapter-divider"></span>
        <span className="chapter">Chapter III</span>
        <span className="chapter-divider"></span>
        <span className="chapter">Chapter IV</span>
        <span className="chapter-divider"></span>
        <span className="chapter">Chapter V</span>
      </div>

      <div className="footer-progress-container">
        <div ref={progressLineRef} className="footer-progress-line"></div>
      </div>
    </footer>
  )
}

export default StickyFooter