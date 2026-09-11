'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './QualitySection.css'

const POINTS = [
  { title: 'GET IT RIGHT.', desc: 'Precision starts with understanding the requirement.' },
  { title: 'KEEP CONTROL.', desc: 'One coordinated workflow from drawing to delivery.' },
  { title: 'BUILD WITH CONFIDENCE.', desc: 'Quality checks throughout production.' },
  { title: 'DELIVER WITH PURPOSE.', desc: 'Because your timeline matters as much as the fabrication.' },
]

const STEP = 0.015

function QualitySection() {
  const wrapperRef = useRef(null)
  const imageWrapRef = useRef(null)
  const imageRef = useRef(null)
  const titleRef = useRef(null)
  const itemRefs = useRef([])
  const progressRef = useRef(0)

  // Entrance — ek baar, mount hote hi
  useEffect(() => {
    gsap.set(itemRefs.current, { opacity: 0, y: 40 })
    gsap.set(imageRef.current, { yPercent: 0 })

    const tl = gsap.timeline({ delay: 0.15 })
    tl.fromTo(
      imageWrapRef.current,
      { xPercent: 100, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }
    ).fromTo(
      titleRef.current.querySelectorAll('.quality-title-line'),
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out' },
      '-=0.7'
    )

    return () => tl.kill()
  }, [])

 // Scroll — page.js ke qualityProgress event se drive (apna wheel listener nahi)
useEffect(() => {
  const applyProgress = (progress) => {
    gsap.to(imageRef.current, {
      yPercent: -progress * 22,
      duration: 0.08,
      ease: 'none',
      overwrite: 'auto',
    })

    POINTS.forEach((_, i) => {
      const start = i * 0.25
      const itemProgress = Math.max(0, Math.min(1, (progress - start) / 0.2))
      const el = itemRefs.current[i]
      if (!el) return
      gsap.to(el, {
        opacity: itemProgress,
        y: (1 - itemProgress) * 40,
        duration: 0.08,
        ease: 'none',
        overwrite: 'auto',
      })
    })
  }

  const handleQualityProgress = (e) => {
    applyProgress(e.detail.progress)
  }

  window.addEventListener('qualityProgress', handleQualityProgress)
  return () => window.removeEventListener('qualityProgress', handleQualityProgress)
}, [])

  return (
    <div ref={wrapperRef} className="quality-section">
      <div ref={imageWrapRef} className="quality-image-wrap">
        <img ref={imageRef} src="/images/when_good_enough.jpeg" alt="Craftsmanship" />
      </div>

      <h2 ref={titleRef} className="quality-title">
        <span className="quality-title-line">WHEN <span className="accent">"GOOD</span></span>
        <span className="quality-title-line">ENOUGH"</span>
        <span className="quality-title-line accent">ISN'T</span>
      </h2>

      <div className="quality-list">
        {POINTS.map((point, i) => (
          <div key={point.title} ref={(el) => (itemRefs.current[i] = el)} className="quality-item">
            <span className="quality-item-number">{String(i + 1).padStart(2, '0')}</span>
            <div className="quality-item-text">
              <h3>{point.title}</h3>
              <p>{point.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QualitySection
