'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './ThirdSection.css'

function ThirdSection({
  heading_part_1 = 'MADE FOR THE PROJECT',
  heading_part_2 = 'NOT THE CATALOGUE',
  description = 'Every project has its own requirements. We fabricate accordingly.',
  slides = [],
}) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const sliderRef = useRef(null)
  const firstSlideImageRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

useEffect(() => {
  const track = trackRef.current
  const slider = sliderRef.current
  if (!track) return

  // Gap you want after the last slide (0 = flush with the right edge)
  const END_GAP_DESKTOP = 0
  const END_GAP_MOBILE = 0

  // Initial state
  gsap.set(track, { y: 0 })
  if (slider) gsap.set(slider, { x: 0 })
  if (firstSlideImageRef.current)
    gsap.set(firstSlideImageRef.current, { scale: 1.3 })

  const trackY = gsap.quickTo(track, 'y', { duration: 0.5, ease: 'power3.out' })
  const sliderX = slider
    ? gsap.quickTo(slider, 'x', { duration: 0.5, ease: 'power3.out' })
    : null
  const imageScaleX = firstSlideImageRef.current
    ? gsap.quickTo(firstSlideImageRef.current, 'scale', { duration: 0.3, ease: 'power3.out' })
    : null

  // ✅ Exact distance: last slide's right edge → panel's right edge
  let maxScroll = 0
  const measure = () => {
    if (!slider || !slider.lastElementChild) {
      maxScroll = 0
      return
    }
    const panel = slider.parentElement
    const lastSlide = slider.lastElementChild
    const currentX = Number(gsap.getProperty(slider, 'x')) || 0

    // Undo the current translate so the measurement is the same at any scroll position
    const lastRight = lastSlide.getBoundingClientRect().right - currentX
    const panelRight = panel.getBoundingClientRect().right
    const endGap = window.innerWidth <= 768 ? END_GAP_MOBILE : END_GAP_DESKTOP

    maxScroll = Math.max(0, lastRight - panelRight + endGap)
  }

  measure()

  // Re-measure on resize and when images load or change size
  const ro = slider ? new ResizeObserver(measure) : null
  if (ro) {
    ro.observe(slider)
    Array.from(slider.children).forEach((child) => ro.observe(child))
  }
  window.addEventListener('resize', measure)

  // 1. Intro → slider vertical shift
  const handleSlideProgress = (e) => {
    const p = e.detail?.progress ?? 0
    if (imageScaleX) imageScaleX(1.3 - p * 0.3)
    trackY(-p * window.innerHeight)
    if (sliderX) sliderX(0)
  }

  // 2. Horizontal slider
  const handleHorizontalProgress = (e) => {
    const p = e.detail?.progress ?? 0
    if (imageScaleX) imageScaleX(1)
    trackY(-window.innerHeight)
    if (sliderX) sliderX(-p * maxScroll)
  }

  window.addEventListener('thirdSlideProgress', handleSlideProgress)
  window.addEventListener('thirdHorizontalProgress', handleHorizontalProgress)

  return () => {
    window.removeEventListener('thirdSlideProgress', handleSlideProgress)
    window.removeEventListener('thirdHorizontalProgress', handleHorizontalProgress)
    window.removeEventListener('resize', measure)
    ro?.disconnect()
  }
}, [slides.length])
  return (
    <div ref={sectionRef} className="third-section">
      <div ref={trackRef} className="third-track">
        {/* Panel 1: Intro */}
        <div className="third-intro-panel">
          <h2 className="third-intro-title">
            <span className="title-white">{heading_part_1}</span>
            <br />
            <span className="third-intro-title-color">{heading_part_2}</span>
          </h2>
          <p className="third-intro-desc">{description}</p>
        </div>

        {/* Panel 2: Slider */}
        <div className="third-slider-panel">
          <div ref={sliderRef} className="third-slider">
            {slides.map((slide, index) => (
              <div key={slide.id || index} className="third-slide">
                {/* Desktop image */}
                <img
                  src={slide.src}
                  alt={slide.desc || ''}
                  className="slide-image slide-image-desktop"
                  ref={index === 0 ? firstSlideImageRef : null}
                />

                {/* Mobile image — fallback to desktop if not provided */}
                <img
                  src={slide.mobileSrc || slide.src}
                  alt={slide.desc || ''}
                  className="slide-image slide-image-mobile"
                />

                <div className="slide-image-overlay" />

                {/* <div
                  className="slide-content-box"
                  style={{
                    top: isMobile
                      ? slide.mobilePos?.top || 'auto'
                      : slide.pos?.top || '60%',
                    left: isMobile
                      ? slide.mobilePos?.left || 'auto'
                      : slide.pos?.left || '8%',
                  }}
                >
                  <span className="slide-category">{slide.desc}</span>
                  <h3 className="slide-title">{slide.title}</h3>
                  {slide.button && (
                    <button type="button" className="explore-work-btn">
                      EXPLORE OUR WORK →
                    </button>
                  )}
                </div> */}

{/* Inside the slides map loop in ThirdSection.jsx */}
<div
  className="slide-content-box"
  style={{
    top: isMobile
      ? slide.mobilePos?.top || 'auto'
      : slide.pos?.top || '60%',
    left: isMobile
      ? slide.mobilePos?.left || 'auto'
      : slide.pos?.left || '8%',
  }}
>
  {/* Logo Container */}
  {slide.logo && (
    <div className="slide-logo-container">
      <img src={slide.logo} alt={`${slide.desc} logo`} className="slide-logo" />
    </div>
  )}

  <div className="slide-text-content">
    <span className="slide-category">{slide.desc}</span>
    <h3 className="slide-title">{slide.title}</h3>
    {slide.button && (
      <button type="button" className="explore-work-btn">
        EXPLORE OUR WORK →
      </button>
    )}
  </div>
</div>

                <div className="slide-counter">
                  <span>{String(slide.id || index + 1).padStart(2, '0')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThirdSection
