'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './ContactSection2.css'

function ContactSection2() {
  const sectionRef = useRef(null)
  const leftContentRef = useRef(null)
  const bgImageRef = useRef(null)
  const lettersRef = useRef([])

  const contactWord = "CONTACT"

  // Mount hote hi initial state set karo
  useEffect(() => {
    // Image center se chhoti, mask ke saath
    if (bgImageRef.current) {
      gsap.set(bgImageRef.current, {
        clipPath: 'circle(0% at 50% 50%)',
        opacity: 0,
        scale: 1.15,
      })
    }

    // Left content neeche se
    if (leftContentRef.current) {
      gsap.set(leftContentRef.current, { y: 60, opacity: 0 })
    }

    // Letters random offset pe
    const initialOffsets = [-70, 90, -50, 80, -40, 60, -80]
    lettersRef.current.forEach((el, i) => {
      if (!el) return
      gsap.set(el, { y: initialOffsets[i] || 0 })
    })
  }, [])

  // contactProgress event se drive
  useEffect(() => {
    const handleContactProgress = (e) => {
      const progress = e.detail.progress // 0 -> 1

      // Image: center se circle expand hoke poori screen bhar jaye
      if (bgImageRef.current) {
        const clipPercent = progress * 80
        gsap.to(bgImageRef.current, {
          clipPath: `circle(${clipPercent}% at 50% 50%)`,
          opacity: 0.35 + progress * 0.35,
          scale: 1.15 - progress * 0.15,
          duration: 0.15,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      // Left content slide up + fade in
      if (leftContentRef.current) {
        const localProgress = Math.min(1, progress / 0.6)
        gsap.to(leftContentRef.current, {
          y: (1 - localProgress) * 60,
          opacity: localProgress,
          duration: 0.15,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      // Letters: offset se 0 pe align
      const initialOffsets = [-70, 90, -50, 80, -40, 60, -80]
      lettersRef.current.forEach((el, i) => {
        if (!el) return
        const offset = (initialOffsets[i] || 0) * (1 - progress)
        gsap.to(el, {
          y: offset,
          duration: 0.15,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      })
    }

    window.addEventListener('contactProgress', handleContactProgress)
    return () => window.removeEventListener('contactProgress', handleContactProgress)
  }, [])

  return (
    <div ref={sectionRef} className="contact-section">
      {/* Background Image with center reveal */}
      <div ref={bgImageRef} className="contact-bg-image-wrapper">
        <div className="contact-bg-overlay" />
      </div>

      <div className="contact-container">
        {/* Center Content */}
        <div ref={leftContentRef} className="contact-left">
          <h2 className="contact-heading">HAVE SOMETHING WORTH <span className='colored'>BUILDING?</span></h2>
          <p className="contact-subtext">
            Bring us the challenge.<br />
            Bring us the idea.<br />
            We&apos;ll turn it into metal.
          </p>
          <button className="contact-btn">START A PROJECT</button>
        </div>
      </div>

      {/* CONTACT word — image ke neeche, center */}
      <div className="contact-right-word">
        <div className="staggered-word-track">
          {contactWord.split('').map((char, index) => (
            <span
              key={index}
              ref={(el) => (lettersRef.current[index] = el)}
              className="staggered-char"
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="contact-footer">
        <span className="contact-brand">FORGENTIS</span>
        <span className="contact-tagline">PRECISION FABRICATION. WITHOUT COMPROMISE.</span>
      </div>
    </div>
  )
}

export default ContactSection2