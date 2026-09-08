'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './LoadingScreen.css'

function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null)
  const logoRef = useRef(null)
  const textRef = useRef(null)
  const subtitleRef = useRef(null)

  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: () => {
        // Smooth fade out
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: onComplete
        })
      }
    })

    // Step 1: Black screen se logo aayega
    timeline
      .fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      )
      // Step 2: Logo image aayegi
      .fromTo(
        logoRef.current,
        { 
          scale: 0,
          opacity: 0,
          rotation: -180,
        },
        { 
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1,
          ease: 'back.out(1.7)'
        }
      )
      // Step 3: Text logo ke peeche se slide hokar aayega
      .fromTo(
        textRef.current,
        { 
          x: -150,
          opacity: 0,
        },
        { 
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out'
        },
        '-=0.6'
      )
      // Step 4: Subtitle "Fabrication" fade in
      .fromTo(
        subtitleRef.current,
        { 
          y: 20,
          opacity: 0,
        },
        { 
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        },
        '-=0.4'
      )
      // Step 5: Sab kuch zoom out hokar fade
      .to(
        [logoRef.current, textRef.current, subtitleRef.current],
        { 
          scale: 1.5,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.inOut',
          delay: 0.8,
          stagger: 0.1
        }
      )

    return () => {
      timeline.kill()
    }
  }, [onComplete])

  return (
    <div ref={containerRef} className="loading-screen">
      <div className="loading-content">
        {/* Logo Image - Apni image yahan lagao */}
        <div ref={logoRef} className="loading-logo">
          <img 
            src="/images/forgentis_icon.webp" 
            alt="Forgentis Logo"
            className="logo-image"
          />
        </div>

        {/* Text Content */}
        <div className="loading-text-content">
          <h1 ref={textRef} className="loading-title">
            Forgentis
          </h1>
          <p ref={subtitleRef} className="loading-subtitle">
            Fabrication
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen