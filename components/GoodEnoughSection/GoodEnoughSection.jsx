'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './GoodEnoughSection.module.css'

export default function GoodEnoughSection({ scrollProgressRef }) {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const titleRef = useRef(null)
  const pointsRef = useRef([])

  const points = [
    { num: '01', title: 'GET IT RIGHT.', desc: 'Precision starts with understanding the requirement.' },
    { num: '02', title: 'KEEP CONTROL.', desc: 'One coordinated workflow from drawing to delivery.' },
    { num: '03', title: 'BUILD WITH CONFIDENCE.', desc: 'Quality checks throughout production.' },
    { num: '04', title: 'DELIVER WITH PURPOSE.', desc: 'Because your timeline matters as much as the fabrication.' }
  ]

  useEffect(() => {
    // Initial setup: position image off-screen to the right
    gsap.set(imageRef.current, { x: '100%', opacity: 0 })
    gsap.set(titleRef.current, { y: 50, opacity: 0 })
    gsap.set(pointsRef.current, { y: 30, opacity: 0 })

    const handleProgress = (e) => {
      const progress = e.detail.progress // Ranges from 0 to 1 for this section
      
      // Smoothly animate image entering from the right as user scrolls into this section
      gsap.to(imageRef.current, {
        x: `${(1 - progress) * 100}%`,
        opacity: progress > 0.05 ? 1 : 0,
        duration: 0.1,
        ease: 'power2.out',
        overwrite: 'auto'
      })

      // Title fade & slide in
      gsap.to(titleRef.current, {
        y: (1 - progress) * 30,
        opacity: progress > 0.1 ? 1 : 0,
        duration: 0.1,
        ease: 'power2.out',
        overwrite: 'auto'
      })

      // Stagger points fade in based on progress
      pointsRef.current.forEach((el, index) => {
        const threshold = 0.2 + index * 0.15
        if (el) {
          gsap.to(el, {
            opacity: progress >= threshold ? 1 : 0.3,
            y: progress >= threshold ? 0 : 20,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: 'auto'
          })
        }
      })
    }

    window.addEventListener('goodEnoughProgress', handleProgress)
    return () => window.removeEventListener('goodEnoughProgress', handleProgress)
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* Left / Center Content Area */}
        <div className={styles.contentArea}>
          <h2 ref={titleRef} className={styles.title}>
            WHEN “GOOD ENOUGH” <span className={styles.highlight}>ISN'T</span>
          </h2>

          <div className={styles.pointsGrid}>
            {points.map((pt, idx) => (
              <div 
                key={idx} 
                ref={(el) => (pointsRef.current[idx] = el)}
                className={styles.pointCard}
              >
                <span className={styles.pointNum}>{pt.num}</span>
                <h3 className={styles.pointTitle}>{pt.title}</h3>
                <p className={styles.pointDesc}>{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Half-Screen Image Container */}
        <div className={styles.imageContainer}>
          <div ref={imageRef} className={styles.imageWrapper}>
            {/* Replace with your image asset path */}
            <div className={styles.imageFallbackOverlay} />
          </div>
        </div>
      </div>
    </section>
  )
}