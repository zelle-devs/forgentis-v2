'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './ProcessSection.css'

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
      const value = progress * (TOTAL_ITEMS - 1)

      // Intro animation
      const introProgress = Math.max(0, Math.min(1, 1 - value))
      if (introRef.current) {
        gsap.set(introRef.current, {
          yPercent: (1 - introProgress) * -40,
          opacity: introProgress,
        })
      }

      // Cards animations
      POINTS.forEach((_, i) => {
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
        TOTAL_ITEMS - 1,
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
          {String(TOTAL_ITEMS - 1).padStart(2, '0')}
        </span>
      </div>

      <div className="process-stack">
        <div ref={introRef} className="process-intro">
          <h2 className="process-title">
            {heading_part_1}
            <span className="process-title-colored"> {heading_part_2}</span>
          </h2>
          <p className="process-desc">{description}</p>
        </div>

        {POINTS.map((point, i) => (
          <div
            key={point.title}
            ref={(el) => (cardRefs.current[i] = el)}
            className="process-card"
            style={{ zIndex: i + 2 }}
          >
            {/* Desktop image */}
            <img
              src={point.image}
              alt={point.title}
              className="process-card-img process-card-img-desktop"
            />

            {/* Mobile image — agar point.mobileImage hai toh use karo, warna same image */}
            <img
              src={point.mobileImage || point.image}
              alt={point.title}
              className="process-card-img process-card-img-mobile"
            />

            <div className="process-card-overlay" />

            <div
              className="process-card-text"
              style={{
                top: isMobile
                  ? point.mobilePos?.top || '65%'
                  : point.pos.top,
                left: isMobile
                  ? point.mobilePos?.left || '5%'
                  : point.pos.left,
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
    </div>
  )
}

export default ProcessSection

// ****************************************


// 'use client'
// import { useEffect, useRef, useState } from 'react'
// import gsap from 'gsap'
// import './ProcessSection.css'


// function ProcessSection({heading_part_1,heading_part_2,description,POINTS,TOTAL_ITEMS}) {
//   const introRef = useRef(null)
//   const cardRefs = useRef([])
//   const [activeIndex, setActiveIndex] = useState(0)
  
//   // Smooth tracking refs for buttery momentum
//   const currentProgressRef = useRef(0)
//   const targetProgressRef = useRef(0)
//   const rafIdRef = useRef(null)

//   useEffect(() => {
//     gsap.set(introRef.current, { yPercent: 0, opacity: 1 })
//     cardRefs.current.forEach((el) => {
//       if (el) gsap.set(el, { yPercent: 115, scale: 1.15 }) // Increased initial yPercent to completely hide below screen
//     })
//   }, [])

//   useEffect(() => {
//     const handleProgress = (e) => {
//       targetProgressRef.current = e.detail.progress
//     }

//     window.addEventListener('processProgress', handleProgress)

//     // RequestAnimationFrame loop for high-sensitivity damping & weight
//     const updateAnimations = () => {
//       // Lerp formula adjusted for hyper-smooth glide and higher sensitivity
//       currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.15
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

//       // Cards animations - Clean bottom entry without any peek or fade
//       POINTS.forEach((_, i) => {
//         const idx = i + 1
//         const rawItemProgress = value - idx + 1
//         const itemProgress = Math.max(0, Math.min(1, rawItemProgress))
//         const el = cardRefs.current[i]
//         if (!el) return

//         gsap.set(el, {
//           yPercent: (1 - itemProgress) * 115, // Matches the initial 115 offset for a seamless glide from outside the view
//           scale: 1.15 - itemProgress * 0.15,
//         })
//       })

//       const newActive = Math.min(TOTAL_ITEMS - 1, Math.max(0, Math.round(value)))
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
//         <span className="process-counter-current">{String(activeIndex).padStart(2, '0')}</span>
//         <span className="process-counter-divider" />
//         <span className="process-counter-total">{String(TOTAL_ITEMS - 1).padStart(2, '0')}</span>
//       </div>

//       <div className="process-stack">
//         <div ref={introRef} className="process-intro">
//           <h2 className="process-title">{heading_part_1}<span  className='process-title-colored'> {heading_part_2}</span></h2>
//           <p className="process-desc">
//             {description}
//           </p>
//         </div>

//         {POINTS.map((point, i) => (
//           <div
//             key={point.title}
//             ref={(el) => (cardRefs.current[i] = el)}
//             className="process-card"
//             style={{ zIndex: i + 2 }}
//           >
//             <img src={point.image} alt={point.title} className="process-card-img" />
//             <div className="process-card-overlay" />
//             <div className="process-card-text" style={{ top: point.pos.top, left: point.pos.left }}>
//               <h3>{point.title}</h3>
//               <p>{point.desc}</p>
//               {point.button && <button className="process-view-all">VIEW ALL CAPABILITIES</button>}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ProcessSection
