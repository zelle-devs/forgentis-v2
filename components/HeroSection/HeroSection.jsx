// 'use client'
// import { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import ImageSplit from '../ImageSplit/ImageSplit'
// import './HeroSection.css'

// function HeroSection() {
//   const sectionRef = useRef(null)

//   useEffect(() => {
//     const timeline = gsap.timeline()
//     timeline.fromTo(
//       sectionRef.current,
//       { opacity: 0, scale: 1.1 },
//       { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
//     )
//     return () => timeline.kill()
//   }, [])

//   return (
//     <div ref={sectionRef} className="hero-section">
//       <ImageSplit />
//       <div className="hero-overlay"></div>
//     </div>
//   )
// }

// export default HeroSection


'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ImageSplit from '../ImageSplit/ImageSplit'
import './HeroSection.css'

function HeroSection({headline}) {
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const subtitleRef = useRef(null)

  useEffect(() => {
    const timeline = gsap.timeline()
    timeline.fromTo(
      sectionRef.current,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
    )
    return () => timeline.kill()
  }, [])

  const handleImageAnimationComplete = () => {
    gsap.to(headlineRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    })
    gsap.to(subtitleRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.2
    })
  }

  return (
    <div ref={sectionRef} className="hero-section">
      <ImageSplit onComplete={handleImageAnimationComplete} />
      <div className="hero-overlay"></div>

      {headline && <div className="hero-content">
        <h1 ref={headlineRef} className="hero-headline">
          {headline}
        </h1>
      </div>}
    </div>
  )
}

export default HeroSection