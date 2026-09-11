'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './ProcessSection.css'

const POINTS = [
  { title: 'CNC LASER CUTTING', desc: 'Clean, accurate cuts with repeatable precision.', image: '/images/cap1.png', pos: { top: '70%', left: '2%' } },
  { title: '3D PIPE CUTTING', desc: 'Complex tube and pipe geometries fabricated to specification.', image: '/images/cap2.png', pos: { top: '70%', left: '75%' } },
  { title: 'BENDING & FORMING', desc: 'Controlled shaping for precise, consistent results.', image: '/images/cap3.png', pos: { top: '70%', left: '75%' } },
  { title: 'MACHINING', desc: 'Precision components produced to your required specifications.', image: '/images/cap4.png', pos: { top: '20%', left: '5%' } },
  { title: 'WELDING & ASSEMBLY', desc: 'From individual components to complete fabricated assemblies.', image: '/images/cap5.png', pos: { top: '65%', left: '5%' } },
  { title: 'FINISHING', desc: 'PVD, powder coating, brushed and specialty finishes to complete the result.', image: '/images/cap6.png', pos: { top: '60%', left: '70%' }, button: true },
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
          <h2 className="process-title">BUILT TO FABRICATE <span  className='process-title-colored'>EQUIPPED TO DELIVER</span></h2>
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
