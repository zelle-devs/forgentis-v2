'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './ProcessSection.css'

// ---------------------------------------------------------------------------
// CHUNK SIZE — kitne cards ek slide (page) me dikhein
// ---------------------------------------------------------------------------
const CHUNK_SIZE = 3

function ProcessSection({
  heading_part_1,
  heading_part_2,
  description,
  POINTS,
  TOTAL_ITEMS,
}) {
  const introRef = useRef(null)
  const cardRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // ---------------------------------------------------------------------------
  // POINTS ko CHUNK_SIZE ke hisaab se groups me baanto
  // Example: [img1, img2, img3] [img4, img5, img6]
  // ---------------------------------------------------------------------------
  const groups = []
  for (let i = 0; i < POINTS.length; i += CHUNK_SIZE) {
    groups.push(POINTS.slice(i, i + CHUNK_SIZE))
  }

  const TOTAL_GROUPS = groups.length
  // TOTAL_ITEMS wahi rahega — sirf animation groups ke hisaab se chalega
  // (intro + groups)
  const TOTAL_STEPS = TOTAL_GROUPS + 1

  // Smooth tracking refs
  const currentProgressRef = useRef(0)
  const targetProgressRef = useRef(0)
  const rafIdRef = useRef(null)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    gsap.set(introRef.current, { yPercent: 0, opacity: 1 })

    // Har group card ke wrapper ko initial state do
    cardRefs.current.forEach((el) => {
      if (el) gsap.set(el, { yPercent: 115, scale: 1.15 })
    })
  }, [])

  useEffect(() => {
    const handleProgress = (e) => {
      targetProgressRef.current = e.detail.progress
    }

    window.addEventListener('processProgress', handleProgress)

    const updateAnimations = () => {
      currentProgressRef.current +=
        (targetProgressRef.current - currentProgressRef.current) * 0.08
      const progress = currentProgressRef.current
      const value = progress * (TOTAL_STEPS - 1)

      // Intro animation
      const introProgress = Math.max(0, Math.min(1, 1 - value))
      if (introRef.current) {
        gsap.set(introRef.current, {
          yPercent: (1 - introProgress) * -40,
          opacity: introProgress,
        })
      }

      // Group animations — har group ek unit hai
      groups.forEach((_, i) => {
        const idx = i + 1
        const rawItemProgress = value - idx + 1
        const itemProgress = Math.max(0, Math.min(1, rawItemProgress))
        const el = cardRefs.current[i]
        if (!el) return

        gsap.set(el, {
          yPercent: (1 - itemProgress) * 115,
          scale: 1.15 - itemProgress * 0.15,
        })
      })

      const newActive = Math.min(
        TOTAL_STEPS - 1,
        Math.max(0, Math.round(value))
      )
      setActiveIndex((prev) => (prev !== newActive ? newActive : prev))

      rafIdRef.current = requestAnimationFrame(updateAnimations)
    }

    rafIdRef.current = requestAnimationFrame(updateAnimations)

    return () => {
      window.removeEventListener('processProgress', handleProgress)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  return (
    <div className="process-section">
      <div className="process-counter">
        <span className="process-counter-current">
          {String(activeIndex).padStart(2, '0')}
        </span>
        <span className="process-counter-divider" />
        <span className="process-counter-total">
          {String(TOTAL_STEPS - 1).padStart(2, '0')}
        </span>
      </div>

      <div className="process-stack">
        {/* INTRO */}
        <div ref={introRef} className="process-intro">
          <h2 className="process-title">
            {heading_part_1}
            <span className="process-title-colored"> {heading_part_2}</span>
          </h2>
          <p className="process-desc">{description}</p>
        </div>

        {/* GROUPS — har group ek slide */}
        {groups.map((group, groupIndex) => (
          <div
            key={`group-${groupIndex}`}
            ref={(el) => (cardRefs.current[groupIndex] = el)}
            className="process-card process-group"
            style={{ zIndex: groupIndex + 2 }}
          >
            {group.map((point, i) => (
              <div key={point.title} className="process-group-item">
                {/* Desktop image */}
                <img
                  src={point.image}
                  alt={point.title}
                  className="process-card-img process-card-img-desktop"
                />

                {/* Mobile image — fallback to desktop */}
                <img
                  src={point.mobileImage || point.image}
                  alt={point.title}
                  className="process-card-img process-card-img-mobile"
                />

                <div className="process-card-overlay" />

               <div
  className={`process-card-text ${isMobile ? 'process-card-text-mobile' : ''}`}
  style={{
    top: isMobile
      ? point.mobilePos?.top || 'auto'
      : point.pos?.top || 'auto',
    left: isMobile
      ? '50%'                          // ← mobile pe always center horizontally
      : point.pos?.left || 'auto',
  }}
>
                  <h3>{point.title}</h3>
                  <p>{point.desc}</p>
                  {point.button && (
                    <button className="process-view-all">
                      VIEW ALL CAPABILITIES
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProcessSection


// 'use client'
// import { useEffect, useRef, useState } from 'react'
// import gsap from 'gsap'
// import './ProcessSection.css'

// function ProcessSection({
//   heading_part_1,
//   heading_part_2,
//   description,
//   POINTS,
//   TOTAL_ITEMS,
// }) {
//   const introRef = useRef(null)
//   const cardRefs = useRef([])
//   const [activeIndex, setActiveIndex] = useState(0)
//   const [isMobile, setIsMobile] = useState(false)

//   // Smooth tracking refs
//   const currentProgressRef = useRef(0)
//   const targetProgressRef = useRef(0)
//   const rafIdRef = useRef(null)

//   // Mobile detection
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth <= 768)
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   useEffect(() => {
//     gsap.set(introRef.current, { yPercent: 0, opacity: 1 })
//     cardRefs.current.forEach((el) => {
//       if (el) gsap.set(el, { yPercent: 115, scale: 1.15 })
//     })
//   }, [])

//   useEffect(() => {
//     const handleProgress = (e) => {
//       targetProgressRef.current = e.detail.progress
//     }

//     window.addEventListener('processProgress', handleProgress)

//     const updateAnimations = () => {
//       currentProgressRef.current +=
//         (targetProgressRef.current - currentProgressRef.current) * 0.08
//       const progress = currentProgressRef.current
//       const value = progress * (TOTAL_ITEMS - 1)

//       // Intro animation
//       const introProgress = Math.max(0, Math.min(1, 1 - value))
//       if (introRef.current) {
//         gsap.set(introRef.current, {
//           yPercent: (1 - introProgress) * -40,
//           opacity: introProgress,
//         })
//       }

//       // Cards animations
//       POINTS.forEach((_, i) => {
//         const idx = i + 1
//         const rawItemProgress = value - idx + 1
//         const itemProgress = Math.max(0, Math.min(1, rawItemProgress))
//         const el = cardRefs.current[i]
//         if (!el) return

//         gsap.set(el, {
//           yPercent: (1 - itemProgress) * 115,
//           scale: 1.15 - itemProgress * 0.15,
//         })
//       })

//       const newActive = Math.min(
//         TOTAL_ITEMS - 1,
//         Math.max(0, Math.round(value))
//       )
//       setActiveIndex((prev) => (prev !== newActive ? newActive : prev))

//       rafIdRef.current = requestAnimationFrame(updateAnimations)
//     }

//     rafIdRef.current = requestAnimationFrame(updateAnimations)

//     return () => {
//       window.removeEventListener('processProgress', handleProgress)
//       if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
//     }
//   }, [])

//   return (
//     <div className="process-section">
//       <div className="process-counter">
//         <span className="process-counter-current">
//           {String(activeIndex).padStart(2, '0')}
//         </span>
//         <span className="process-counter-divider" />
//         <span className="process-counter-total">
//           {String(TOTAL_ITEMS - 1).padStart(2, '0')}
//         </span>
//       </div>

//       <div className="process-stack">
//         <div ref={introRef} className="process-intro">
//           <h2 className="process-title">
//             {heading_part_1}
//             <span className="process-title-colored"> {heading_part_2}</span>
//           </h2>
//           <p className="process-desc">{description}</p>
//         </div>

//         {POINTS.map((point, i) => (
//           <div
//             key={point.title}
//             ref={(el) => (cardRefs.current[i] = el)}
//             className="process-card"
//             style={{ zIndex: i + 2 }}
//           >
//             {/* Desktop image */}
//             <img
//               src={point.image}
//               alt={point.title}
//               className="process-card-img process-card-img-desktop"
//             />

//             {/* Mobile image — agar point.mobileImage hai toh use karo, warna same image */}
//             <img
//               src={point.mobileImage || point.image}
//               alt={point.title}
//               className="process-card-img process-card-img-mobile"
//             />

//             <div className="process-card-overlay" />

//             <div
//               className="process-card-text"
//               style={{
//                 top: isMobile
//                   ? point.mobilePos?.top || '65%'
//                   : point.pos.top,
//                 left: isMobile
//                   ? point.mobilePos?.left || '5%'
//                   : point.pos.left,
//               }}
//             >
//               <h3>{point.title}</h3>
//               <p>{point.desc}</p>
//               {point.button && (
//                 <button className="process-view-all">
//                   VIEW ALL CAPABILITIES
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ProcessSection
