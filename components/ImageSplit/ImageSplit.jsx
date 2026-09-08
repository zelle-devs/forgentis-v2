
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

  const heroImage = '/images/hero.webp'

  useEffect(() => {
    // Calculate exact scale
    const calculateScale = () => {
      const totalWidth = 160 * 3 // 3 windows after joining
      const totalHeight = 280
      
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      
      const scaleX = screenWidth / totalWidth
      const scaleY = screenHeight / totalHeight
      
      return Math.max(scaleX, scaleY) * 1.05
    }

    const timeline = gsap.timeline({ delay: 0.3 })

    timeline
      .fromTo(
        [leftWindowRef.current, centerWindowRef.current, rightWindowRef.current],
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)', stagger: 0.1 }
      )
      .to(
        windowsContainerRef.current,
        { gap: '0px', duration: 0.6, ease: 'power2.inOut' }
      )
      .to(
        windowsContainerRef.current,
        {
          scale: calculateScale(),
          duration: 2,
          ease: 'power3.inOut',
          // onUpdate:  function () {
          onUpdate: () => {
            // Jab scale 80% complete ho jaye, tab image reveal karna shuru karo
            const progress = this.progress?.()
            if (progress > 0.7) {
              gsap.to(imageContainerRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: 'power1.out'
              })
            }
          },
          onComplete: () => {
            // Windows ko hide karo
            gsap.set(windowsContainerRef.current, {
              opacity: 0,
              pointerEvents: 'none'
            })
            
            // Image ko perfect position par lao
            gsap.to(imageContainerRef.current, {
              scale: 1,
              duration: 0.5,
              ease: 'power2.out'
            })
            
            // Premium subtle zoom
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
