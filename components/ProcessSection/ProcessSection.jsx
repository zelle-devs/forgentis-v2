'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './ProcessSection.css'

const POINTS = [
  {
    title: 'CNC LASER CUTTING',
    desc: 'Clean, accurate cuts with repeatable precision.',
    image: '/images/1-a.png',
    pos: { top: '10%', left: '6%' },
  },
  {
    title: '3D PIPE CUTTING',
    desc: 'Complex tube and pipe geometries fabricated to specification.',
    image: '/images/1-b.png',
    pos: { top: '50%', left: '62%' },
  },
  {
    title: 'BENDING & FORMING',
    desc: 'Controlled shaping for precise, consistent results.',
    image: '/images/1-c.png',
    pos: { top: '12%', left: '58%' },
  },
  {
    title: 'MACHINING',
    desc: 'Precision components produced to your required specifications.',
    image: '/images/1-d.webp',
    pos: { top: '55%', left: '8%' },
  },
  {
    title: 'WELDING & ASSEMBLY',
    desc: 'From individual components to complete fabricated assemblies.',
    image: '/images/1-a.png',
    pos: { top: '14%', left: '10%' },
  },
  {
    title: 'FINISHING',
    desc: 'PVD, powder coating, brushed and specialty finishes to complete the result.',
    image: '/images/1-b.png',
    pos: { top: '48%', left: '58%' },
    button: true,
  },
]

// Item 0 = intro (title+desc), items 1..6 = images
const TOTAL_ITEMS = POINTS.length + 1
const STEP = 0.015 // sensitivity yahan se control hoti hai — chhota = zyada slow/controlled

function ProcessSection() {
  const wrapperRef = useRef(null)
  const introRef = useRef(null)
  const cardRefs = useRef([])
  const ySetters = useRef([])
  const scaleSetters = useRef([])
  const opacitySetters = useRef([])
  const progressRef = useRef(0) // 0 -> TOTAL_ITEMS - 1
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (introRef.current) {
      ySetters.current[0] = gsap.quickTo(introRef.current, 'y', { duration: 1, ease: 'power3.out' })
      opacitySetters.current[0] = gsap.quickTo(introRef.current, 'opacity', { duration: 0.8, ease: 'power2.out' })
    }

    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const idx = i + 1
      ySetters.current[idx] = gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' })
      scaleSetters.current[idx] = gsap.quickTo(el, 'scale', { duration: 1.1, ease: 'power3.out' })
    })

    applyProgress(0)
  }, [])

  const applyProgress = (value) => {
    // Item 0: intro — fade + halka upar jaana
    const introProgress = Math.max(0, Math.min(1, 1 - value)) // scroll shuru hote hi fade out
    if (ySetters.current[0]) ySetters.current[0]((1 - introProgress) * -60)
    if (opacitySetters.current[0]) opacitySetters.current[0](introProgress)

    // Items 1..6: images — neeche se scale-zoom karke land hoti hain
    POINTS.forEach((_, i) => {
      const idx = i + 1
      const progress = Math.max(0, Math.min(1, value - idx + 1))
      const yPercent = (1 - progress) * 100
      const scale = 1.35 - progress * 0.35

      if (ySetters.current[idx]) ySetters.current[idx](yPercent)
      if (scaleSetters.current[idx]) scaleSetters.current[idx](scale)
    })

    const newActive = Math.min(TOTAL_ITEMS - 1, Math.max(0, Math.round(value)))
    setActiveIndex((prev) => (prev !== newActive ? newActive : prev))
  }

  useEffect(() => {
    const handleWheel = (e) => {
      const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0
      if (dir === 0) return

      progressRef.current = Math.max(0, Math.min(TOTAL_ITEMS - 1, progressRef.current + dir * STEP))
      applyProgress(progressRef.current)
    }

    const node = wrapperRef.current
    if (!node) return
    node.addEventListener('wheel', handleWheel, { passive: true })
    return () => node.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div ref={wrapperRef} className="process-section">
      <div className="process-counter">
        <span className="process-counter-current">{String(activeIndex).padStart(2, '0')}</span>
        <span className="process-counter-divider" />
        <span className="process-counter-total">{String(TOTAL_ITEMS - 1).padStart(2, '0')}</span>
      </div>

      <div className="process-stack">
        {/* Item 0: Intro */}
        <div ref={introRef} className="process-intro">
          <h2 className="process-title">BUILT TO FABRICATE. EQUIPPED TO DELIVER.</h2>
          <p className="process-desc">
            From precision cutting to final finishing, our capabilities are built to
            handle demanding architectural, commercial and industrial requirements.
          </p>
        </div>

        {/* Items 1..6: Images */}
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

              {point.button && (
                <button className="process-view-all">VIEW ALL CAPABILITIES</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProcessSection