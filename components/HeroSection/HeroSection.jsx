'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ImageSplit from '../ImageSplit/ImageSplit'
import NavContent from '../NavContent/NavContent'
import './HeroSection.css'

function HeroSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const timeline = gsap.timeline()

    timeline
      .fromTo(
        sectionRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
      )

    return () => {
      timeline.kill()
    }
  }, [])

  return (
    <div ref={sectionRef} className="hero-section">
      <ImageSplit />
      <div className="hero-overlay"></div>
      <NavContent />
    </div>
  )
}

export default HeroSection

// 'use client'
// import { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import ImageSplit from '../ImageSplit/ImageSplit'
// import NavContent from '../NavContent/NavContent'
// import './HeroSection.css'

// function HeroSection() {
//   const sectionRef = useRef(null)

//   useEffect(() => {
//     // Hero section smooth entrance - no gap
//     const timeline = gsap.timeline()

//     timeline
//       .fromTo(
//         sectionRef.current,
//         { 
//           opacity: 0,
//           scale: 1.1 
//         },
//         { 
//           opacity: 1,
//           scale: 1,
//           duration: 1,
//           ease: 'power2.out' 
//         }
//       )

//     return () => {
//       timeline.kill()
//     }
//   }, [])

//   return (
//     <div ref={sectionRef} className="hero-section">
//       {/* Split Image Background */}
//       <ImageSplit />
      
//       {/* Dark Overlay */}
//       <div className="hero-overlay"></div>

//       {/* Navigation Content - Vertical Center */}
//       <NavContent />
//     </div>
//   )
// }

// export default HeroSection