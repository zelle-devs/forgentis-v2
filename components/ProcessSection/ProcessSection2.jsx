// 'use client'
// import { useEffect, useRef, useState } from 'react'
// import gsap from 'gsap'
// import './ProcessSection2.css'

// function ProcessSection2({
//   scrollProgressRef,
//   POINTS = [],
// }) {
//   const cardRefs = useRef([])
//   const paneRefs = useRef([])
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

//   // ===== Initial GSAP setup — Clean Start (1st image fully open, rest collapsed) =====
//   useEffect(() => {
//     cardRefs.current.forEach((el, i) => {
//       if (!el) return
//       if (i === 0) {
//         gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)', zIndex: 1 })
//       } else {
//         // Baaki sabhi images bilkul center se collapsed shuru hongi taake pehli entry par koi overlap na ho
//         gsap.set(el, { clipPath: 'inset(50% 50% 50% 50%)', zIndex: i + 1 })
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

//       const rawProgress = scrollProgressRef.current // 0 → 1
//       const progress = Math.max(0, Math.min(1, rawProgress))
//       const value = progress * (totalItems - 1)

//       // 1. Square Center-out Image Reveal Animation
//       POINTS.forEach((_, i) => {
//         if (i === 0) return
//         const el = cardRefs.current[i]
//         if (!el) return

//         const cardProgress = Math.max(0, Math.min(1, value - (i - 1)))
//         const topBottom = (1 - cardProgress) * 50
//         const leftRight = (1 - cardProgress) * 50

//         gsap.set(el, {
//           clipPath: `inset(${topBottom}% ${leftRight}% ${topBottom}% ${leftRight}%)`,
//           zIndex: i + 1,
//           overwrite: 'auto',
//         })
//       })

//       // 2. Smooth Continuous Text Panes Sliding with increased gap multiplier (150% distance)
//       POINTS.forEach((_, i) => {
//         const paneEl = paneRefs.current[i]
//         if (!paneEl) return

//         const distance = i - value 
//         // 150% shift denge taake har point ke beech mein ample vertical spacing/gap rahe
//         const translateY = distance * 150 
//         const opacity = Math.max(0, 1 - Math.abs(distance) * 1.2)

//         gsap.set(paneEl, {
//           yPercent: translateY,
//           opacity: opacity > 0.05 ? opacity : 0,
//           pointerEvents: Math.abs(distance) < 0.4 ? 'auto' : 'none',
//           overwrite: 'auto'
//         })
//       })

//       // Discrete active index tracking
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

//       <div className="process-section">
//         {/* ===== LEFT: Square Center-out Reveal Image Container ===== */}
//         <div className="process-image-container">
//           {POINTS.map((point, i) => {
//             const currentImg = isMobile
//               ? point.mobileImage || point.image
//               : point.image

//             return (
//               <div
//                 key={point.title || i}
//                 ref={(el) => (cardRefs.current[i] = el)}
//                 className="process-card"
//               >
//                 <img
//                   src={currentImg}
//                   alt={point.title || 'Process Image'}
//                   className="process-card-img"
//                 />
//                 <div className="process-card-overlay" />
//               </div>
//             )
//           })}
//         </div>

//         {/* ===== RIGHT: Robust Vertical Sliding Content Stack ===== */}
//         <div className="process-content-container">
//           <div className="process-text-viewport">
//             {POINTS.map((point, i) => {
//               const showBtn = point.showButton !== false && point.buttonText

//               return (
//                 <div
//                   key={point.title + '-text-' + i}
//                   ref={(el) => (paneRefs.current[i] = el)}
//                   className="process-text-pane"
//                 >
//                   <div className="process-counter">
//                     <span className="process-counter-current">
//                       {String(i + 1).padStart(2, '0')}
//                     </span>
//                     <span className="process-counter-divider" />
//                     <span className="process-counter-total">
//                       {String(totalItems).padStart(2, '0')}
//                     </span>
//                   </div>

//                   <h3 className="process-item-title">{point.title}</h3>
//                   <p className="process-item-desc">{point.desc}</p>
                  
//                   {showBtn && (
//                     <a
//                       href={point.buttonUrl || '#'}
//                       className="process-cta-btn"
//                       onClick={(e) => {
//                         if (!point.buttonUrl || point.buttonUrl === '#') {
//                           e.preventDefault()
//                         }
//                       }}
//                     >
//                       {point.buttonText}
//                     </a>
//                   )}
//                 </div>
//               )
//             })}
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
}) {
  const cardRefs = useRef([])
  const paneRefs = useRef([])
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

  // ===== Initial GSAP setup — Clean Start (1st image fully open, rest collapsed) =====
  useEffect(() => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      if (i === 0) {
        gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)', zIndex: 1 })
      } else {
        gsap.set(el, { clipPath: 'inset(50% 50% 50% 50%)', zIndex: i + 1 })
      }
    })
  }, [POINTS.length])

  // ===== Sync with page.js scrollProgressRef with safe entry buffer =====
  // useEffect(() => {
  //   let rafId = null

  //   const updateProcessAnimations = () => {
  //     if (!scrollProgressRef || !scrollProgressRef.current) {
  //       rafId = requestAnimationFrame(updateProcessAnimations)
  //       return
  //     }

  //     const rawProgress = scrollProgressRef.current // 0 → 1
  //     const progress = Math.max(0, Math.min(1, rawProgress))

  //     // 🛑 BUFFER / LOCK FIX: 
  //     // Jab tak user scroll ko thoda andar nahi le jata (e.g., first 8% of section), 
  //     // tab tak value strictly 0 rahegi taake 1st point 100% stable aur visible rahe.
  //     const adjustedProgress = progress < 0.08 ? 0 : (progress - 0.08) / (1 - 0.08)
  //     const value = adjustedProgress * (totalItems - 1)

  //     // 1. Square Center-out Image Reveal Animation
  //     POINTS.forEach((_, i) => {
  //       if (i === 0) return
  //       const el = cardRefs.current[i]
  //       if (!el) return

  //       const cardProgress = Math.max(0, Math.min(1, value - (i - 1)))
  //       const topBottom = (1 - cardProgress) * 50
  //       const leftRight = (1 - cardProgress) * 50

  //       gsap.set(el, {
  //         clipPath: `inset(${topBottom}% ${leftRight}% ${topBottom}% ${leftRight}%)`,
  //         zIndex: i + 1,
  //         overwrite: 'auto',
  //       })
  //     })

  //     // 2. Smooth Continuous Text Panes Sliding with increased gap multiplier
  //     POINTS.forEach((_, i) => {
  //       const paneEl = paneRefs.current[i]
  //       if (!paneEl) return

  //       const distance = i - value 
  //       const translateY = distance * 150 
  //       const opacity = Math.max(0, 1 - Math.abs(distance) * 1.2)

  //       gsap.set(paneEl, {
  //         yPercent: translateY,
  //         opacity: opacity > 0.05 ? opacity : 0,
  //         pointerEvents: Math.abs(distance) < 0.4 ? 'auto' : 'none',
  //         overwrite: 'auto'
  //       })
  //     })

  //     // Discrete active index tracking
  //     const discreteIndex = Math.min(
  //       totalItems - 1,
  //       Math.max(0, Math.floor(value + 0.15))
  //     )
  //     setActiveIndex((prev) => (prev !== discreteIndex ? discreteIndex : prev))

  //     rafId = requestAnimationFrame(updateProcessAnimations)
  //   }

  //   rafId = requestAnimationFrame(updateProcessAnimations)
  //   return () => {
  //     if (rafId) cancelAnimationFrame(rafId)
  //   }
  // }, [scrollProgressRef, POINTS, totalItems])

  // ===== Sync with page.js scrollProgressRef with enhanced entry buffer =====
  useEffect(() => {
    let rafId = null

    const updateProcessAnimations = () => {
      if (!scrollProgressRef || !scrollProgressRef.current) {
        rafId = requestAnimationFrame(updateProcessAnimations)
        return
      }

      const rawProgress = scrollProgressRef.current // 0 → 1
      const progress = Math.max(0, Math.min(1, rawProgress))

      // Enhanced buffer threshold to keep 1st point fully visible on entry
      const buffer = 0.15
      const adjustedProgress = progress < buffer ? 0 : (progress - buffer) / (1 - buffer)
      const value = adjustedProgress * (totalItems - 1)

      // 1. Square Center-out Image Reveal Animation
      POINTS.forEach((_, i) => {
        if (i === 0) return
        const el = cardRefs.current[i]
        if (!el) return

        const cardProgress = Math.max(0, Math.min(1, value - (i - 1)))
        const topBottom = (1 - cardProgress) * 50
        const leftRight = (1 - cardProgress) * 50

        gsap.set(el, {
          clipPath: `inset(${topBottom}% ${leftRight}% ${topBottom}% ${leftRight}%)`,
          zIndex: i + 1,
          overwrite: 'auto',
        })
      })

      // 2. Smooth Continuous Text Panes Sliding with increased gap multiplier
      POINTS.forEach((_, i) => {
        const paneEl = paneRefs.current[i]
        if (!paneEl) return

        const distance = i - value 
        const translateY = distance * 150 
        const opacity = Math.max(0, 1 - Math.abs(distance) * 1.2)

        gsap.set(paneEl, {
          yPercent: translateY,
          opacity: opacity > 0.05 ? opacity : 0,
          pointerEvents: Math.abs(distance) < 0.4 ? 'auto' : 'none',
          overwrite: 'auto'
        })
      })

      // Discrete active index tracking
      const discreteIndex = Math.min(
        totalItems - 1,
        Math.max(0, Math.floor(value + 0.15))
      )
      setActiveIndex((prev) => (prev !== discreteIndex ? discreteIndex : prev))

      rafId = requestAnimationFrame(updateProcessAnimations)
    }

    rafId = requestAnimationFrame(updateProcessAnimations)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [scrollProgressRef, POINTS, totalItems])

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

      <div className="process-section">
        {/* ===== LEFT: Square Center-out Reveal Image Container ===== */}
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

        {/* ===== RIGHT: Robust Vertical Sliding Content Stack ===== */}
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
// }) {
//   const cardRefs = useRef([])
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

//   // ===== Initial GSAP setup — Square inset reveal from center =====
//   useEffect(() => {
//     cardRefs.current.forEach((el, i) => {
//       if (!el) return
//       if (i === 0) {
//         gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)', zIndex: 1 })
//       } else {
//         gsap.set(el, { clipPath: 'inset(50% 50% 50% 50%)', zIndex: i + 1 })
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

//       const rawProgress = scrollProgressRef.current // 0 → 1
//       const progress = Math.max(0, Math.min(1, rawProgress))
//       const value = progress * (totalItems - 1)

//       // Square Center-out Reveal using strict inset mapping
//       POINTS.forEach((_, i) => {
//         if (i === 0) return
//         const el = cardRefs.current[i]
//         if (!el) return

//         // Har card ka reveal apne specific scroll window mein strictly complete hoga
//         const cardProgress = Math.max(0, Math.min(1, value - (i - 1)))
//         const topBottom = (1 - cardProgress) * 50
//         const leftRight = (1 - cardProgress) * 50

//         gsap.set(el, {
//           clipPath: `inset(${topBottom}% ${leftRight}% ${topBottom}% ${leftRight}%)`,
//           zIndex: i + 1,
//           overwrite: 'auto',
//         })
//       })

//       // Strict discrete active index tracking: 
//       // Text aur active index tab hi change hoga jab image ka inset reveal pora (ya near complete) ho jaye
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

//       <div className="process-section">
//         {/* ===== LEFT: Square Center-out Reveal Image Container ===== */}
//         <div className="process-image-container">
//           {POINTS.map((point, i) => {
//             const currentImg = isMobile
//               ? point.mobileImage || point.image
//               : point.image

//             return (
//               <div
//                 key={point.title || i}
//                 ref={(el) => (cardRefs.current[i] = el)}
//                 className="process-card"
//               >
//                 <img
//                   src={currentImg}
//                   alt={point.title || 'Process Image'}
//                   className="process-card-img"
//                 />
//                 <div className="process-card-overlay" />
//               </div>
//             )
//           })}
//         </div>

//         {/* ===== RIGHT: Robust Vertical Sliding Content Stack ===== */}
//         <div className="process-content-container">
//           {/* Counter */}
//           <div className="process-counter">
//             <span className="process-counter-current">
//               {String(activeIndex + 1).padStart(2, '0')}
//             </span>
//             <span className="process-counter-divider" />
//             <span className="process-counter-total">
//               {String(totalItems).padStart(2, '0')}
//             </span>
//           </div>

//           {/* Text stack viewport with precise index mapping */}
//           <div className="process-text-viewport">
//             {POINTS.map((point, i) => {
//               let positionClass = 'process-pane-next'
//               if (i === activeIndex) {
//                 positionClass = 'process-pane-active'
//               } else if (i < activeIndex) {
//                 positionClass = 'process-pane-prev'
//               }

//               // Check if button should be shown for this specific point
//               const showBtn = point.showButton !== false && point.buttonText

//               return (
//                 <div
//                   key={point.title + '-text-' + i}
//                   className={`process-text-pane ${positionClass}`}
//                 >
//                   <h3 className="process-item-title">{point.title}</h3>
//                   <p className="process-item-desc">{point.desc}</p>
                  
//                   {showBtn && (
//                     <a
//                       href={point.buttonUrl || '#'}
//                       className="process-cta-btn"
//                       onClick={(e) => {
//                         if (!point.buttonUrl || point.buttonUrl === '#') {
//                           e.preventDefault()
//                         }
//                       }}
//                     >
//                       {point.buttonText}
//                     </a>
//                   )}
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProcessSection2
