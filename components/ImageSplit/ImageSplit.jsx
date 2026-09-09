'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './ImageSplit.css'

function ImageSplit() {
  const containerRef = useRef(null)
  const leftWindowRef = useRef(null)
  const centerWindowRef = useRef(null)
  const rightWindowRef = useRef(null)
  const imageContainerRef = useRef(null)
  const windowsContainerRef = useRef(null)
  const scaleTweenRef = useRef(null)

  const heroImage = '/images/hero.webp'

  useEffect(() => {
    const calculateScale = () => {
      const totalWidth = 160 * 3
      const totalHeight = 280
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      const scaleX = screenWidth / totalWidth
      const scaleY = screenHeight / totalHeight
      return Math.max(scaleX, scaleY) * 1.05
    }

    const timeline = gsap.timeline({ delay: 0.3 })

    timeline
      // Bottom se teeno windows enter karo - ek saath
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
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.08
        }
      )
      // Gap close - join
      .to(
        windowsContainerRef.current,
        { 
          gap: '0px',
          duration: 0.8,
          ease: 'power3.inOut'
        }
      )
      // Scale up - full screen
      .to(
        windowsContainerRef.current,
        {
          scale: calculateScale(),
          duration: 2,
          ease: 'power4.inOut',
          // onComplete: () => {
          //   gsap.set(windowsContainerRef.current, {
          //     opacity: 0,
          //     pointerEvents: 'none'
          //   })
            
          //   gsap.to(imageContainerRef.current, {
          //     opacity: 1,
          //     scale: 1,
          //     duration: 0.5,
          //     ease: 'power2.out'
          //   })
            
          //   gsap.to(imageContainerRef.current, {
          //     scale: 1.05,
          //     duration: 4,
          //     ease: 'power1.inOut',
          //     delay: 0.5
          //   })
          // }
          onComplete: () => {
  // Full image ko pehle exactly same position par rakh do
  gsap.set(imageContainerRef.current, {
    opacity: 1,
    scale: 1,
  })

  // Windows ko hide nahi karna — sirf pointer events disable
  gsap.set(windowsContainerRef.current, {
    pointerEvents: 'none',
  })

  // Very slight zoom continue
  gsap.to(imageContainerRef.current, {
    scale: 1.05,
    duration: 4,
    ease: 'power1.inOut',
    delay: 0.5
  })
}
        }
      )

    return () => {
      timeline.kill()
    }
  }, [])

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
