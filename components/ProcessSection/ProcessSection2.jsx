'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './ProcessSection2.css'

function ProcessSection2({
  scrollProgressRef,
  stageRef,
  myStage,
  POINTS = [],
  heading_part_1 = '',
  heading_part_2 = '',
  description = '',
}) {
  const cardRefs = useRef([])
  const paneRefs = useRef([])
  const titleOverlayRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const sectionContentRef = useRef(null)
  const mobileValueRef = useRef(0)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const totalItems = POINTS.length

  // ===== Mobile detection =====
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // ===== Initial GSAP setup =====
  useEffect(() => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      if (i === 0) {
        gsap.set(el, { y: '0%', x: '0%', rotate: 0, scale: 1, zIndex: 1, opacity: 1 })
      } else {
        const initialPositions = [
          { x: 2, rotate: 2 },
          { x: -2, rotate: -2 },
          { x: 1.5, rotate: 3 },
          { x: -1.5, rotate: -3 },
          { x: 2.5, rotate: 2.5 },
          { x: -2.5, rotate: -2.5 },
        ]

        const position = initialPositions[i] || { x: 0, rotate: 0 }

        gsap.set(el, {
          y: '150%',
          x: `${position.x}%`,
          rotate: position.rotate,
          scale: 0.95,
          zIndex: i + 1,
          opacity: 0,
        })
      }
    })
  }, [POINTS.length])

  // ===== Sync with page.js scrollProgressRef =====
  useEffect(() => {
    let rafId = null

    const updateProcessAnimations = () => {
      if (!scrollProgressRef || scrollProgressRef.current === undefined) {
        rafId = requestAnimationFrame(updateProcessAnimations)
        return
      }

      const isActive = !stageRef || !myStage || stageRef.current === myStage
      if (!isActive) {
        rafId = requestAnimationFrame(updateProcessAnimations)
        return
      }

      const rawProgress = scrollProgressRef.current
      const progress = Math.max(0, Math.min(1, rawProgress))

      // Title buffer for mobile & desktop
      const buffer = isMobile ? 0.35 : 0.28

      // ─── TITLE OVERLAY ─────────────────────────────────
      if (titleOverlayRef.current && titleRef.current && descRef.current) {
        const titleFadeStart = buffer * 0.5
        const titleFadeEnd = buffer

        let titleOpacity = 1
        let titleY = 0

        if (progress <= titleFadeStart) {
          titleOpacity = 1
          titleY = 0
        } else if (progress >= titleFadeEnd) {
          titleOpacity = 0
          titleY = -50
        } else {
          const t = (progress - titleFadeStart) / (titleFadeEnd - titleFadeStart)
          titleOpacity = 1 - t
          titleY = -50 * t
        }

        gsap.set(titleOverlayRef.current, {
          opacity: titleOpacity,
          visibility: titleOpacity <= 0.01 ? 'hidden' : 'visible',
          pointerEvents: titleOpacity > 0.5 ? 'auto' : 'none',
        })
        gsap.set(titleRef.current, { y: titleY })
        gsap.set(descRef.current, { y: titleY * 0.5 })
      }

      // ─── SECTION CONTENT REVEAL ───────────────────────
      let contentOpacity = 0
      if (sectionContentRef.current) {
        const contentFadeStart = buffer * 0.4
        const contentFadeEnd = buffer

        if (progress <= contentFadeStart) contentOpacity = 0
        else if (progress >= contentFadeEnd) contentOpacity = 1
        else {
          contentOpacity =
            (progress - contentFadeStart) / (contentFadeEnd - contentFadeStart)
        }

        gsap.set(sectionContentRef.current, {
          opacity: contentOpacity,
          visibility: contentOpacity <= 0.01 ? 'hidden' : 'visible',
        })
      }

      if (cardRefs.current[0]) {
        gsap.set(cardRefs.current[0], {
          opacity: contentOpacity,
          y: `${(1 - contentOpacity) * 20}%`,
        })
      }

      // ─── CARDS & PROGRESS MAPPING (STRICT ONE-BY-ONE FOR MOBILE) ───
      const adjustedProgress =
        progress < buffer ? 0 : (progress - buffer) / (1 - buffer)

      const maxCardProgress = 0.90
      const normalizedProgress = Math.min(1, adjustedProgress / maxCardProgress)

      let targetValue = 0

      if (isMobile) {
        // Mobile par har scroll par strictly aik aik index (slide) par snap karega
        const rawStep = normalizedProgress * (totalItems - 1)
        targetValue = Math.round(rawStep)
      } else {
        // Desktop continuous flow
        if (normalizedProgress > 0) {
          const effectiveFlow = Math.max(0, (normalizedProgress - 0.10) / 0.90)
          targetValue = effectiveFlow * (totalItems - 1)
        }
      }

      targetValue = Math.max(0, Math.min(totalItems - 1, targetValue))

      let value
      if (isMobile) {
        // Only allow moving ONE card away from the current card
        const currentCard = Math.round(mobileValueRef.current)
        targetValue = Math.max(currentCard - 1, Math.min(currentCard + 1, targetValue))

        // Faster glide = stops sooner (0.15 → 0.3)
        mobileValueRef.current += (targetValue - mobileValueRef.current) * 0.3

        // Snap asnd stop completely when close enough (no endless tiny movement)
        if (Math.abs(targetValue - mobileValueRef.current) < 0.01) {
          mobileValueRef.current = targetValue
        }

        value = mobileValueRef.current
      } else {
        value = targetValue
      }

      const cardY = isMobile ? 300 : 260

      POINTS.forEach((_, i) => {
        if (i === 0) return
        const el = cardRefs.current[i]
        if (!el) return

        const cardProgress = Math.max(0, Math.min(1, value - (i - 1)))

        const cardPositions = [
          { x: 2, y: 1, rotate: 2 },
          { x: -2, y: 2, rotate: -2 },
          { x: 1.5, y: 3, rotate: 3 },
          { x: -1.5, y: 4, rotate: -3 },
          { x: 2.5, y: 5, rotate: 2.5 },
          { x: -2.5, y: 6, rotate: -2.5 },
        ]

        const position = cardPositions[i] || { x: 0, y: 0, rotate: 0 }

        const y = (1 - cardProgress) * cardY + position.y
        const x = (1 - cardProgress) * 3 + position.x
        const rotate = (1 - cardProgress) * 4 + position.rotate
        const scale = 0.95 + cardProgress * 0.05

        const entranceOpacity = Math.min(1, cardProgress / 0.3)

        gsap.set(el, {
          y: `${y}%`,
          x: `${x}%`,
          rotate,
          scale,
          zIndex: i + 1,
          opacity: entranceOpacity,
          overwrite: 'auto',
        })
      })

      // ─── TEXT PANES ──────────────────────────────────
      const paneTranslate = isMobile ? 120 : 150
      const paneFadeMultiplier = isMobile ? 2.2 : 1.2

      POINTS.forEach((_, i) => {
        const paneEl = paneRefs.current[i]
        if (!paneEl) return

        const distance = i - value
        const translateY = distance * paneTranslate + 15
        const opacity = Math.max(0, 1 - Math.abs(distance) * paneFadeMultiplier)

        gsap.set(paneEl, {
          yPercent: translateY,
          opacity: opacity > 0.05 ? opacity : 0,
          pointerEvents: Math.abs(distance) < 0.4 ? 'auto' : 'none',
          overwrite: 'auto',
        })
      })

      const discreteIndex = Math.min(
        totalItems - 1,
        Math.max(0, Math.round(value))
      )
      setActiveIndex((prev) => (prev !== discreteIndex ? discreteIndex : prev))

      rafId = requestAnimationFrame(updateProcessAnimations)
    }

    rafId = requestAnimationFrame(updateProcessAnimations)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [scrollProgressRef, POINTS, totalItems, isMobile])

  const currentActivePoint = POINTS[activeIndex] || POINTS[0]
  const currentBgImg = isMobile
    ? currentActivePoint?.mobileImage || currentActivePoint?.image
    : currentActivePoint?.image

  return (
    <div className="process-wrapper-main">
      <div
        className="process-glass-backdrop"
        style={{ backgroundImage: `url(${currentBgImg})` }}
      />
      <div className="process-backdrop-overlay" />

      {/* ===== MAIN TITLE OVERLAY ===== */}
      <div ref={titleOverlayRef} className="process-title-overlay">
        <h2 ref={titleRef} className="process-main-title">
          <span className="process-title-line">{heading_part_1}</span>
          {heading_part_2 && (
            <span className="process-title-line process-title-line--accent">
              {heading_part_2}
            </span>
          )}
        </h2>
        {description && (
          <p ref={descRef} className="process-main-desc">
            {description}
          </p>
        )}
      </div>

      {/* ===== ACTUAL SECTION CONTENT ===== */}
      <div ref={sectionContentRef} className="process-section-content">
        <div className="process-section">
          <div className="process-image-container">
            {POINTS.map((point, i) => {
              const currentImg = isMobile
                ? point.mobileImage || point.image
                : point.image

              return (
                <div
                  key={point.title || i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="process-card"
                >
                  <img
                    src={currentImg}
                    alt={point.title || 'Process Image'}
                    className="process-card-img"
                  />
                  <div className="process-card-overlay" />
                </div>
              )
            })}
          </div>

          <div className="process-content-container">
            <div className="process-text-viewport">
              {POINTS.map((point, i) => {
                const showBtn = point.showButton !== false && point.buttonText

                return (
                  <div
                    key={point.title + '-text-' + i}
                    ref={(el) => (paneRefs.current[i] = el)}
                    className="process-text-pane"
                  >
                    <div className="process-counter">
                      <span className="process-counter-current">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="process-counter-divider" />
                      <span className="process-counter-total">
                        {String(totalItems).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="process-item-title">{point.title}</h3>
                    <p className="process-item-desc">{point.desc}</p>

                    {showBtn && (
                      <a
                        href={point.buttonUrl || '#'}
                        className="process-cta-btn"
                        onClick={(e) => {
                          if (!point.buttonUrl || point.buttonUrl === '#') {
                            e.preventDefault()
                          }
                        }}
                      >
                        {point.buttonText}
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProcessSection2




