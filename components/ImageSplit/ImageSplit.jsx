'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './ImageSplit.css'

function ImageSplit({ onComplete }) {
  const containerRef = useRef(null)
  const leftWindowRef = useRef(null)
  const centerWindowRef = useRef(null)
  const rightWindowRef = useRef(null)
  const imageContainerRef = useRef(null)
  const windowsContainerRef = useRef(null)

  const [heroImage, setHeroImage] = useState('/images/hero.webp')

  // Mobile ke liye alag image select karo
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    setHeroImage(isMobile ? '/optimize/hero-mobile.png' : '/optimize/hero.png')
  }, [])

  useEffect(() => {
    // Jab tak image decide na ho jaye, animation start mat karo
    if (!heroImage) return

    const calculateScale = () => {
      // Hardcoded 160x280 ki bajaye actual rendered size uthao
      // taake mobile pe CSS se window size badlein to yeh apne aap adjust ho jaye
      const windowEl = centerWindowRef.current
      const rect = windowEl.getBoundingClientRect()
      const windowWidth = rect.width
      const windowHeight = rect.height

      const totalWidth = windowWidth * 3
      const totalHeight = windowHeight
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      const scaleX = screenWidth / totalWidth
      const scaleY = screenHeight / totalHeight
      return Math.max(scaleX, scaleY) * 1.05
    }

  const timeline = gsap.timeline({ delay: 0.05 })

timeline
  .fromTo(
    [leftWindowRef.current, centerWindowRef.current, rightWindowRef.current],
    { 
      y: '100vh',
      opacity: 0,
      scale: 0.8,
    },
    { 
      y: '0vh',
      opacity: 1,
      scale: 1,
      duration: 0.4,          // was 0.6 → faster
      ease: 'power3.out',
      stagger: 0.05           // was 0.08 → tighter stagger
    }
  )
  .to(
    windowsContainerRef.current,
    { 
      gap: '0px',
      duration: 0.25,         // was 0.4 → faster
      ease: 'power3.inOut'
    }
  )
  .to(
    windowsContainerRef.current,
    {
      scale: calculateScale(),
      duration: 0.65,         // was 1 → much snappier
      ease: 'power4.inOut',
      onComplete: () => {
        gsap.set(imageContainerRef.current, {
          opacity: 1,
          scale: 1,
        })

        gsap.set(windowsContainerRef.current, {
          pointerEvents: 'none',
        })

        gsap.to(imageContainerRef.current, {
          scale: 1.05,
          duration: 4,
          ease: 'power1.inOut',
          delay: 0.15           // was 0.5 → zooms sooner
        })

        if (onComplete) onComplete()
      }
    }
  )

    return () => {
      timeline.kill()
    }
  }, [heroImage])

  return (
    <div ref={containerRef} className="image-split-container">
      <div 
        ref={imageContainerRef}
        className="full-image-background"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      />

      <div ref={windowsContainerRef} className="windows-container">
        <div ref={leftWindowRef} className="window left-window">
          <div 
            className="window-image"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundPosition: 'left center'
            }}
          />
        </div>

        <div ref={centerWindowRef} className="window center-window">
          <div 
            className="window-image"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundPosition: 'center center'
            }}
          />
        </div>

        <div ref={rightWindowRef} className="window right-window">
          <div 
            className="window-image"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundPosition: 'right center'
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ImageSplit
