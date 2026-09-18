// 'use client'
// import { useEffect, useRef, useState } from 'react'
// import gsap from 'gsap'
// import './ProcessSection2.css'

// function ProcessSection2({
//   scrollProgressRef,
//   POINTS = [],
//   heading_part_1 = '',
//   heading_part_2 = '',
//   description = '',
// }) {
//   const cardRefs = useRef([])
//   const paneRefs = useRef([])
//   const titleOverlayRef = useRef(null)
//   const titleRef = useRef(null)
//   const descRef = useRef(null)
//   const sectionContentRef = useRef(null)
//   const [activeIndex, setActiveIndex] = useState(0)
//   const [isMobile, setIsMobile] = useState(false)

//   const totalItems = POINTS.length

//   // ===== Mobile detection =====
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth <= 768)
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   // ===== Initial GSAP setup — 1st image settled, rest stacked below with tilt =====
//   useEffect(() => {
//     cardRefs.current.forEach((el, i) => {
//       if (!el) return
//       if (i === 0) {
//         gsap.set(el, { y: '0%', x: '0%', rotate: 0, scale: 1, zIndex: 1 })
//       } else {
//         const tiltDir = i % 2 === 1 ? 1 : -1
//         gsap.set(el, {
//           y: '130%',
//           x: `${tiltDir * 5}%`,
//           rotate: tiltDir * 10,
//           scale: 0.95,
//           zIndex: i + 1,
//         })
//       }
//     })
//   }, [POINTS.length])

//   // ===== Sync with page.js scrollProgressRef =====
//   useEffect(() => {
//     let rafId = null

//     const updateProcessAnimations = () => {
//       if (!scrollProgressRef || !scrollProgressRef.current) {
//         rafId = requestAnimationFrame(updateProcessAnimations)
//         return
//       }

//       const rawProgress = scrollProgressRef.current
//       const progress = Math.max(0, Math.min(1, rawProgress))

//       // ✅ Buffer — mobile pe bada (title zyada der visible)
//       const buffer = isMobile ? 0.35 : 0.25

//       // ─── TITLE OVERLAY ─────────────────────────────────
//       if (titleOverlayRef.current && titleRef.current && descRef.current) {
//         const titleFadeStart = buffer * 0.75
//         const titleFadeEnd = buffer * 1.0

//         let titleOpacity = 1
//         let titleY = 0

//         if (progress <= titleFadeStart) {
//           titleOpacity = 1
//           titleY = 0
//         } else if (progress >= titleFadeEnd) {
//           titleOpacity = 0
//           titleY = -60
//         } else {
//           const t = (progress - titleFadeStart) / (titleFadeEnd - titleFadeStart)
//           titleOpacity = 1 - t
//           titleY = -60 * t
//         }

//         gsap.set(titleOverlayRef.current, {
//           opacity: titleOpacity,
//           visibility: titleOpacity <= 0.01 ? 'hidden' : 'visible',
//           pointerEvents: titleOpacity > 0.5 ? 'auto' : 'none',
//         })
//         gsap.set(titleRef.current, { y: titleY })
//         gsap.set(descRef.current, { y: titleY * 0.5 })
//       }

//       // ─── SECTION CONTENT REVEAL ───────────────────────
//       if (sectionContentRef.current) {
//         const contentFadeStart = buffer * 0.85
//         const contentFadeEnd = buffer * 1.1

//         let contentOpacity = 0
//         if (progress <= contentFadeStart) contentOpacity = 0
//         else if (progress >= contentFadeEnd) contentOpacity = 1
//         else {
//           contentOpacity =
//             (progress - contentFadeStart) / (contentFadeEnd - contentFadeStart)
//         }

//         gsap.set(sectionContentRef.current, {
//           opacity: contentOpacity,
//           visibility: contentOpacity <= 0.01 ? 'hidden' : 'visible',
//         })
//       }

//       // ─── CARDS ───────────────────────────────────────
//       const adjustedProgress =
//         progress < buffer ? 0 : (progress - buffer) / (1 - buffer)
//       const value = adjustedProgress * (totalItems - 1)

//       // Mobile pe card translate kam
//       const cardY = isMobile ? 100 : 130

//       POINTS.forEach((_, i) => {
//         if (i === 0) return
//         const el = cardRefs.current[i]
//         if (!el) return

//         const cardProgress = Math.max(0, Math.min(1, value - (i - 1)))
//         const tiltDir = i % 2 === 1 ? 1 : -1

//         const y = (1 - cardProgress) * cardY
//         const x = (1 - cardProgress) * tiltDir * 5
//         const rotate = (1 - cardProgress) * tiltDir * 10
//         const scale = 0.95 + cardProgress * 0.05

//         gsap.set(el, {
//           y: `${y}%`,
//           x: `${x}%`,
//           rotate,
//           scale,
//           zIndex: i + 1,
//           overwrite: 'auto',
//         })
//       })

//       // ─── TEXT PANES ──────────────────────────────────
//       // Mobile pe translate kam + fade smooth (ek time pe ek pane)
//       const paneTranslate = isMobile ? 85 : 150
//       const paneFadeMultiplier = isMobile ? 0.7 : 1.2

//       POINTS.forEach((_, i) => {
//         const paneEl = paneRefs.current[i]
//         if (!paneEl) return

//         const distance = i - value
//         const translateY = distance * paneTranslate + 15
//         const opacity = Math.max(0, 1 - Math.abs(distance) * paneFadeMultiplier)

//         gsap.set(paneEl, {
//           yPercent: translateY,
//           opacity: opacity > 0.05 ? opacity : 0,
//           pointerEvents: Math.abs(distance) < 0.4 ? 'auto' : 'none',
//           overwrite: 'auto',
//         })
//       })

//       const discreteIndex = Math.min(
//         totalItems - 1,
//         Math.max(0, Math.floor(value + 0.15))
//       )
//       setActiveIndex((prev) => (prev !== discreteIndex ? discreteIndex : prev))

//       rafId = requestAnimationFrame(updateProcessAnimations)
//     }

//     rafId = requestAnimationFrame(updateProcessAnimations)
//     return () => {
//       if (rafId) cancelAnimationFrame(rafId)
//     }
//   }, [scrollProgressRef, POINTS, totalItems, isMobile])

//   const currentActivePoint = POINTS[activeIndex] || POINTS[0]
//   const currentBgImg = isMobile
//     ? currentActivePoint?.mobileImage || currentActivePoint?.image
//     : currentActivePoint?.image

//   return (
//     <div className="process-wrapper-main">
//       {/* Background Blurred Glassy Backdrop */}
//       <div
//         className="process-glass-backdrop"
//         style={{ backgroundImage: `url(${currentBgImg})` }}
//       />
//       <div className="process-backdrop-overlay" />

//       {/* ===== MAIN TITLE OVERLAY ===== */}
//       <div ref={titleOverlayRef} className="process-title-overlay">
//         <h2 ref={titleRef} className="process-main-title">
//           <span className="process-title-line">{heading_part_1}</span>
//           {heading_part_2 && (
//             <span className="process-title-line process-title-line--accent">
//               {heading_part_2}
//             </span>
//           )}
//         </h2>
//         {description && (
//           <p ref={descRef} className="process-main-desc">
//             {description}
//           </p>
//         )}
//       </div>

//       {/* ===== ACTUAL SECTION CONTENT ===== */}
//       <div ref={sectionContentRef} className="process-section-content">
//         <div className="process-section">
//           <div className="process-image-container">
//             {POINTS.map((point, i) => {
//               const currentImg = isMobile
//                 ? point.mobileImage || point.image
//                 : point.image

//               return (
//                 <div
//                   key={point.title || i}
//                   ref={(el) => (cardRefs.current[i] = el)}
//                   className="process-card"
//                 >
//                   <img
//                     src={currentImg}
//                     alt={point.title || 'Process Image'}
//                     className="process-card-img"
//                   />
//                   <div className="process-card-overlay" />
//                 </div>
//               )
//             })}
//           </div>

//           <div className="process-content-container">
//             <div className="process-text-viewport">
//               {POINTS.map((point, i) => {
//                 const showBtn = point.showButton !== false && point.buttonText

//                 return (
//                   <div
//                     key={point.title + '-text-' + i}
//                     ref={(el) => (paneRefs.current[i] = el)}
//                     className="process-text-pane"
//                   >
//                     <div className="process-counter">
//                       <span className="process-counter-current">
//                         {String(i + 1).padStart(2, '0')}
//                       </span>
//                       <span className="process-counter-divider" />
//                       <span className="process-counter-total">
//                         {String(totalItems).padStart(2, '0')}
//                       </span>
//                     </div>

//                     <h3 className="process-item-title">{point.title}</h3>
//                     <p className="process-item-desc">{point.desc}</p>

//                     {showBtn && (
//                       <a
//                         href={point.buttonUrl || '#'}
//                         className="process-cta-btn"
//                         onClick={(e) => {
//                           if (!point.buttonUrl || point.buttonUrl === '#') {
//                             e.preventDefault()
//                           }
//                         }}
//                       >
//                         {point.buttonText}
//                       </a>
//                     )}
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProcessSection2

'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './ProcessSection2.css'

function ProcessSection2({
  scrollProgressRef,
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
        gsap.set(el, { y: '0%', x: '0%', rotate: 0, scale: 1, zIndex: 1 })
      } else {
        const tiltDir = i % 2 === 1 ? 1 : -1
        gsap.set(el, {
          y: '130%',
          x: `${tiltDir * 5}%`,
          rotate: tiltDir * 10,
          scale: 0.95,
          zIndex: i + 1,
        })
      }
    })
  }, [POINTS.length])

  // ===== Sync with page.js scrollProgressRef =====
  useEffect(() => {
    let rafId = null

    const updateProcessAnimations = () => {
      if (!scrollProgressRef || !scrollProgressRef.current) {
        rafId = requestAnimationFrame(updateProcessAnimations)
        return
      }

      const rawProgress = scrollProgressRef.current
      const progress = Math.max(0, Math.min(1, rawProgress))

      // ✅ Buffer — mobile pe bada (title zyada der visible)
      const buffer = isMobile ? 0.35 : 0.25

      // ─── TITLE OVERLAY ─────────────────────────────────
      if (titleOverlayRef.current && titleRef.current && descRef.current) {
        const titleFadeStart = buffer * 0.75
        const titleFadeEnd = buffer * 1.0

        let titleOpacity = 1
        let titleY = 0

        if (progress <= titleFadeStart) {
          titleOpacity = 1
          titleY = 0
        } else if (progress >= titleFadeEnd) {
          titleOpacity = 0
          titleY = -60
        } else {
          const t = (progress - titleFadeStart) / (titleFadeEnd - titleFadeStart)
          titleOpacity = 1 - t
          titleY = -60 * t
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
      if (sectionContentRef.current) {
        const contentFadeStart = buffer * 0.85
        const contentFadeEnd = buffer * 1.1

        let contentOpacity = 0
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

      // ─── CARDS ───────────────────────────────────────
      const adjustedProgress =
        progress < buffer ? 0 : (progress - buffer) / (1 - buffer)
      const value = adjustedProgress * (totalItems - 1)

      // Card translate — same on both (sync with pane)
      const cardY = 130

      POINTS.forEach((_, i) => {
        if (i === 0) return
        const el = cardRefs.current[i]
        if (!el) return

        const cardProgress = Math.max(0, Math.min(1, value - (i - 1)))
        const tiltDir = i % 2 === 1 ? 1 : -1

        const y = (1 - cardProgress) * cardY
        const x = (1 - cardProgress) * tiltDir * 5
        const rotate = (1 - cardProgress) * tiltDir * 10
        const scale = 0.95 + cardProgress * 0.05

        gsap.set(el, {
          y: `${y}%`,
          x: `${x}%`,
          rotate,
          scale,
          zIndex: i + 1,
          overwrite: 'auto',
        })
      })

      // ─── TEXT PANES ──────────────────────────────────
      // Mobile: translate zyada (gap) + fade strict (sirf ek pane visible)
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

      // Round instead of floor+0.15 — mid-point pe change
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
      {/* Background Blurred Glassy Backdrop */}
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

// 'use client'
// import { useEffect, useRef, useState } from 'react'
// import gsap from 'gsap'
// import './ProcessSection2.css'

// function ProcessSection2({
//   scrollProgressRef,
//   POINTS = [],
//   heading_part_1 = '',
//   heading_part_2 = '',
//   description = '',
// }) {
//   const cardRefs = useRef([])
//   const paneRefs = useRef([])
//   const titleOverlayRef = useRef(null)
//   const titleRef = useRef(null)
//   const descRef = useRef(null)
//   const sectionContentRef = useRef(null)
//   const [activeIndex, setActiveIndex] = useState(0)
//   const [isMobile, setIsMobile] = useState(false)

//   const totalItems = POINTS.length

//   // ===== Mobile detection =====
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth <= 768)
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   // ===== Initial GSAP setup — 1st image settled, rest stacked below with tilt =====
//   useEffect(() => {
//     cardRefs.current.forEach((el, i) => {
//       if (!el) return
//       if (i === 0) {
//         gsap.set(el, { y: '0%', x: '0%', rotate: 0, scale: 1, zIndex: 1 })
//       } else {
//         const tiltDir = i % 2 === 1 ? 1 : -1
//         gsap.set(el, {
//           y: '130%',
//           x: `${tiltDir * 5}%`,
//           rotate: tiltDir * 10,
//           scale: 0.95,
//           zIndex: i + 1,
//         })
//       }
//     })
//   }, [POINTS.length])

//   // ===== Sync with page.js scrollProgressRef =====
//   useEffect(() => {
//     let rafId = null

//     const updateProcessAnimations = () => {
//       if (!scrollProgressRef || !scrollProgressRef.current) {
//         rafId = requestAnimationFrame(updateProcessAnimations)
//         return
//       }

//       const rawProgress = scrollProgressRef.current
//       const progress = Math.max(0, Math.min(1, rawProgress))

//       // ✅ Buffer — is andar sirf title dikhega, cards still
//       const buffer = 0.25

//       // ─── TITLE OVERLAY ─────────────────────────────────
//       // 0 → buffer*0.55       : title fully visible (solid black bg)
//       // buffer*0.55 → buffer  : title fade out
//       // buffer → 1            : title hidden
//       if (titleOverlayRef.current && titleRef.current && descRef.current) {
//         const titleFadeStart = buffer * 0.75
//         const titleFadeEnd = buffer * 1.0

//         let titleOpacity = 1
//         let titleY = 0

//         if (progress <= titleFadeStart) {
//           titleOpacity = 1
//           titleY = 0
//         } else if (progress >= titleFadeEnd) {
//           titleOpacity = 0
//           titleY = -60
//         } else {
//           const t = (progress - titleFadeStart) / (titleFadeEnd - titleFadeStart)
//           titleOpacity = 1 - t
//           titleY = -60 * t
//         }

//         gsap.set(titleOverlayRef.current, {
//           opacity: titleOpacity,
//           visibility: titleOpacity <= 0.01 ? 'hidden' : 'visible',
//           pointerEvents: titleOpacity > 0.5 ? 'auto' : 'none',
//         })
//         gsap.set(titleRef.current, { y: titleY })
//         gsap.set(descRef.current, { y: titleY * 0.5 })
//       }

//       // ─── SECTION CONTENT REVEAL ───────────────────────
//       // Title fade hone ke baad hi cards/text dikhao (fade-in)
//       if (sectionContentRef.current) {
//         const contentFadeStart = buffer * 0.85
//         const contentFadeEnd = buffer * 1.1

//         let contentOpacity = 0
//         if (progress <= contentFadeStart) contentOpacity = 0
//         else if (progress >= contentFadeEnd) contentOpacity = 1
//         else {
//           contentOpacity =
//             (progress - contentFadeStart) / (contentFadeEnd - contentFadeStart)
//         }

//         gsap.set(sectionContentRef.current, {
//           opacity: contentOpacity,
//           visibility: contentOpacity <= 0.01 ? 'hidden' : 'visible',
//         })
//       }

//       // ─── CARDS (same as before) ───────────────────────
//       const adjustedProgress =
//         progress < buffer ? 0 : (progress - buffer) / (1 - buffer)
//       const value = adjustedProgress * (totalItems - 1)

//       POINTS.forEach((_, i) => {
//         if (i === 0) return
//         const el = cardRefs.current[i]
//         if (!el) return

//         const cardProgress = Math.max(0, Math.min(1, value - (i - 1)))
//         const tiltDir = i % 2 === 1 ? 1 : -1

//         const y = (1 - cardProgress) * 130
//         const x = (1 - cardProgress) * tiltDir * 5
//         const rotate = (1 - cardProgress) * tiltDir * 10
//         const scale = 0.95 + cardProgress * 0.05

//         gsap.set(el, {
//           y: `${y}%`,
//           x: `${x}%`,
//           rotate,
//           scale,
//           zIndex: i + 1,
//           overwrite: 'auto',
//         })
//       })

//       POINTS.forEach((_, i) => {
//         const paneEl = paneRefs.current[i]
//         if (!paneEl) return

//         const distance = i - value
//         const translateY = distance * 150 + 15
//         const opacity = Math.max(0, 1 - Math.abs(distance) * 1.2)

//         gsap.set(paneEl, {
//           yPercent: translateY,
//           opacity: opacity > 0.05 ? opacity : 0,
//           pointerEvents: Math.abs(distance) < 0.4 ? 'auto' : 'none',
//           overwrite: 'auto',
//         })
//       })

//       const discreteIndex = Math.min(
//         totalItems - 1,
//         Math.max(0, Math.floor(value + 0.15))
//       )
//       setActiveIndex((prev) => (prev !== discreteIndex ? discreteIndex : prev))

//       rafId = requestAnimationFrame(updateProcessAnimations)
//     }

//     rafId = requestAnimationFrame(updateProcessAnimations)
//     return () => {
//       if (rafId) cancelAnimationFrame(rafId)
//     }
//   }, [scrollProgressRef, POINTS, totalItems])

//   const currentActivePoint = POINTS[activeIndex] || POINTS[0]
//   const currentBgImg = isMobile
//     ? currentActivePoint?.mobileImage || currentActivePoint?.image
//     : currentActivePoint?.image

//   return (
//     <div className="process-wrapper-main">
//       {/* Background Blurred Glassy Backdrop */}
//       <div
//         className="process-glass-backdrop"
//         style={{ backgroundImage: `url(${currentBgImg})` }}
//       />
//       <div className="process-backdrop-overlay" />

//       {/* ===== MAIN TITLE OVERLAY — solid black, scroll par fade ===== */}
//       <div ref={titleOverlayRef} className="process-title-overlay">
//         <h2 ref={titleRef} className="process-main-title">
//           <span className="process-title-line">{heading_part_1}</span>
//           {heading_part_2 && (
//             <span className="process-title-line process-title-line--accent">
//               {heading_part_2}
//             </span>
//           )}
//         </h2>
//         {description && (
//           <p ref={descRef} className="process-main-desc">
//             {description}
//           </p>
//         )}
//       </div>

//       {/* ===== ACTUAL SECTION CONTENT — title fade ke baad reveal ===== */}
//       <div ref={sectionContentRef} className="process-section-content">
//         <div className="process-section">
//           <div className="process-image-container">
//             {POINTS.map((point, i) => {
//               const currentImg = isMobile
//                 ? point.mobileImage || point.image
//                 : point.image

//               return (
//                 <div
//                   key={point.title || i}
//                   ref={(el) => (cardRefs.current[i] = el)}
//                   className="process-card"
//                 >
//                   <img
//                     src={currentImg}
//                     alt={point.title || 'Process Image'}
//                     className="process-card-img"
//                   />
//                   <div className="process-card-overlay" />
//                 </div>
//               )
//             })}
//           </div>

//           <div className="process-content-container">
//             <div className="process-text-viewport">
//               {POINTS.map((point, i) => {
//                 const showBtn = point.showButton !== false && point.buttonText

//                 return (
//                   <div
//                     key={point.title + '-text-' + i}
//                     ref={(el) => (paneRefs.current[i] = el)}
//                     className="process-text-pane"
//                   >
//                     <div className="process-counter">
//                       <span className="process-counter-current">
//                         {String(i + 1).padStart(2, '0')}
//                       </span>
//                       <span className="process-counter-divider" />
//                       <span className="process-counter-total">
//                         {String(totalItems).padStart(2, '0')}
//                       </span>
//                     </div>

//                     <h3 className="process-item-title">{point.title}</h3>
//                     <p className="process-item-desc">{point.desc}</p>

//                     {showBtn && (
//                       <a
//                         href={point.buttonUrl || '#'}
//                         className="process-cta-btn"
//                         onClick={(e) => {
//                           if (!point.buttonUrl || point.buttonUrl === '#') {
//                             e.preventDefault()
//                           }
//                         }}
//                       >
//                         {point.buttonText}
//                       </a>
//                     )}
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProcessSection2
