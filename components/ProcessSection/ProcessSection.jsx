// // *************************************
// 'use client'
// import { useEffect, useRef, useState } from 'react'
// import gsap from 'gsap'
// import './ProcessSection.css'

// const POINTS = [
//   { title: 'CNC LASER CUTTING', desc: 'Clean, accurate cuts with repeatable precision.', image: '/images/1-a.png', pos: { top: '10%', left: '6%' } },
//   { title: '3D PIPE CUTTING', desc: 'Complex tube and pipe geometries fabricated to specification.', image: '/images/1-b.png', pos: { top: '50%', left: '62%' } },
//   { title: 'BENDING & FORMING', desc: 'Controlled shaping for precise, consistent results.', image: '/images/1-c.png', pos: { top: '12%', left: '58%' } },
//   { title: 'MACHINING', desc: 'Precision components produced to your required specifications.', image: '/images/1-d.webp', pos: { top: '55%', left: '8%' } },
//   { title: 'WELDING & ASSEMBLY', desc: 'From individual components to complete fabricated assemblies.', image: '/images/1-a.png', pos: { top: '14%', left: '10%' } },
//   { title: 'FINISHING', desc: 'PVD, powder coating, brushed and specialty finishes to complete the result.', image: '/images/1-b.png', pos: { top: '48%', left: '58%' }, button: true },
// ]

// const TOTAL_ITEMS = POINTS.length + 1

// function ProcessSection() {
//   const introRef = useRef(null)
//   const cardRefs = useRef([])
//   const [activeIndex, setActiveIndex] = useState(0)
  
//   const currentProgressRef = useRef(0)
//   const targetProgressRef = useRef(0)
//   const rafIdRef = useRef(null)

//   useEffect(() => {
//     gsap.set(introRef.current, { yPercent: 0, opacity: 1 })
//     cardRefs.current.forEach((el) => {
//       // Third section ki tarah initial scale bara rakha hai taake enter hote waqt zoom/focus feel ho
//       if (el) gsap.set(el, { yPercent: 115, scale: 1.3 })
//     })
//   }, [])

//   useEffect(() => {
//     const handleProgress = (e) => {
//       targetProgressRef.current = e.detail.progress
//     }

//     window.addEventListener('processProgress', handleProgress)

//     const updateAnimations = () => {
//       currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.15
//       const progress = currentProgressRef.current
//       const value = progress * (TOTAL_ITEMS - 1)

//       const introProgress = Math.max(0, Math.min(1, 1 - value))
//       if (introRef.current) {
//         gsap.set(introRef.current, {
//           yPercent: (1 - introProgress) * -40,
//           opacity: introProgress,
//         })
//       }

//       POINTS.forEach((_, i) => {
//         const idx = i + 1
//         const rawItemProgress = value - idx + 1
//         const itemProgress = Math.max(0, Math.min(1, rawItemProgress))
//         const el = cardRefs.current[i]
//         if (!el) return

//         // Exactly third section wala scale math: 1.3 se start ho kar progress ke sath 1.0 (normal) ho jayega
//         const scaleValue = 1.3 - (itemProgress * 0.3)

//         gsap.set(el, {
//           yPercent: (1 - itemProgress) * 115,
//           scale: scaleValue,
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
//           <h2 className="process-title">BUILT TO FABRICATE. EQUIPPED TO DELIVER.</h2>
//           <p className="process-desc">
//             From precision cutting to final finishing, our capabilities are built to
//             handle demanding architectural, commercial and industrial requirements.
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

// // *************************************
'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './ProcessSection.css'

const POINTS = [
  { title: 'CNC LASER CUTTING', desc: 'Clean, accurate cuts with repeatable precision.', image: '/images/cap1.png', pos: { top: '75%', left: '4%' } },
  { title: '3D PIPE CUTTING', desc: 'Complex tube and pipe geometries fabricated to specification.', image: '/images/cap2.png', pos: { top: '80%', left: '72%' } },
  { title: 'BENDING & FORMING', desc: 'Controlled shaping for precise, consistent results.', image: '/images/cap3.png', pos: { top: '80%', left: '8%' } },
  { title: 'MACHINING', desc: 'Precision components produced to your required specifications.', image: '/images/cap4.png', pos: { top: '20%', left: '5%' } },
  { title: 'WELDING & ASSEMBLY', desc: 'From individual components to complete fabricated assemblies.', image: '/images/cap5.png', pos: { top: '75%', left: '10%' } },
  { title: 'FINISHING', desc: 'PVD, powder coating, brushed and specialty finishes to complete the result.', image: '/images/cap6.png', pos: { top: '68%', left: '68%' }, button: true },
]

const TOTAL_ITEMS = POINTS.length + 1

function ProcessSection() {
  const introRef = useRef(null)
  const cardRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Smooth tracking refs for buttery momentum
  const currentProgressRef = useRef(0)
  const targetProgressRef = useRef(0)
  const rafIdRef = useRef(null)

  useEffect(() => {
    gsap.set(introRef.current, { yPercent: 0, opacity: 1 })
    cardRefs.current.forEach((el) => {
      if (el) gsap.set(el, { yPercent: 115, scale: 1.15 }) // Increased initial yPercent to completely hide below screen
    })
  }, [])

  useEffect(() => {
    const handleProgress = (e) => {
      targetProgressRef.current = e.detail.progress
    }

    window.addEventListener('processProgress', handleProgress)

    // RequestAnimationFrame loop for high-sensitivity damping & weight
    const updateAnimations = () => {
      // Lerp formula adjusted for hyper-smooth glide and higher sensitivity
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.15
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

      // Cards animations - Clean bottom entry without any peek or fade
      POINTS.forEach((_, i) => {
        const idx = i + 1
        const rawItemProgress = value - idx + 1
        const itemProgress = Math.max(0, Math.min(1, rawItemProgress))
        const el = cardRefs.current[i]
        if (!el) return

        gsap.set(el, {
          yPercent: (1 - itemProgress) * 115, // Matches the initial 115 offset for a seamless glide from outside the view
          scale: 1.15 - itemProgress * 0.15,
        })
      })

      const newActive = Math.min(TOTAL_ITEMS - 1, Math.max(0, Math.round(value)))
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
        <span className="process-counter-current">{String(activeIndex).padStart(2, '0')}</span>
        <span className="process-counter-divider" />
        <span className="process-counter-total">{String(TOTAL_ITEMS - 1).padStart(2, '0')}</span>
      </div>

      <div className="process-stack">
        <div ref={introRef} className="process-intro">
          <h2 className="process-title">BUILT TO FABRICATE. EQUIPPED TO DELIVER.</h2>
          <p className="process-desc">
            From precision cutting to final finishing, our capabilities are built to
            handle demanding architectural, commercial and industrial requirements.
          </p>
        </div>

        {POINTS.map((point, i) => (
          <div
            key={point.title}
            ref={(el) => (cardRefs.current[i] = el)}
            className="process-card"
            style={{ zIndex: i + 2 }}
          >
            <img src={point.image} alt={point.title} className="process-card-img" />
            <div className="process-card-overlay" />
            <div className="process-card-text" style={{ top: point.pos.top, left: point.pos.left }}>
              <h3>{point.title}</h3>
              <p>{point.desc}</p>
              {point.button && <button className="process-view-all">VIEW ALL CAPABILITIES</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProcessSection
