'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './ThirdSection.css'

function ThirdSection({
  heading_part_1 = 'MADE FOR THE PROJECT',
  heading_part_2 = 'NOT THE CATALOGUE',
  description = 'Every project has its own requirements. We fabricate accordingly.',
  slides = [],
}) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const sliderRef = useRef(null)
  const firstSlideImageRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Initial State
    gsap.set(trackRef.current, { y: 0 })
    if (sliderRef.current) gsap.set(sliderRef.current, { x: 0 })
    if (firstSlideImageRef.current)
      gsap.set(firstSlideImageRef.current, { scale: 1.3 })

    const trackY = gsap.quickTo(trackRef.current, 'y', {
      duration: 0.5,
      ease: 'power3.out',
    })

    const sliderX = sliderRef.current
      ? gsap.quickTo(sliderRef.current, 'x', {
          duration: 0.5,
          ease: 'power3.out',
        })
      : null

    const imageScaleX = firstSlideImageRef.current
      ? gsap.quickTo(firstSlideImageRef.current, 'scale', {
          duration: 0.3,
          ease: 'power3.out',
        })
      : null

    // 1. Intro → Slider vertical shift
   const handleSlideProgress = (e) => {
  const p = e.detail?.progress ?? 0
  const vh = window.innerHeight

  if (imageScaleX) imageScaleX(1.3 - p * 0.3)

  trackY(-p * vh)

  if (sliderX) sliderX(0)
}

    // 2. Horizontal slider
    const handleHorizontalProgress = (e) => {
      const p = e.detail?.progress ?? 0
      const vh = window.innerHeight

      if (imageScaleX) imageScaleX(1)
      trackY(-vh)

      if (sliderRef.current && sliderX) {
        const maxScroll = Math.max(
          0,
          sliderRef.current.scrollWidth - window.innerWidth + 80
        )
        sliderX(-p * maxScroll)
      }
    }

    window.addEventListener('thirdSlideProgress', handleSlideProgress)
    window.addEventListener(
      'thirdHorizontalProgress',
      handleHorizontalProgress
    )

    return () => {
      window.removeEventListener('thirdSlideProgress', handleSlideProgress)
      window.removeEventListener(
        'thirdHorizontalProgress',
        handleHorizontalProgress
      )
    }
  }, [slides.length])

  return (
    <div ref={sectionRef} className="third-section">
      <div ref={trackRef} className="third-track">
        {/* Panel 1: Intro */}
        <div className="third-intro-panel">
          <h2 className="third-intro-title">
            <span className="title-white">{heading_part_1}</span>
            <br />
            <span className="third-intro-title-color">{heading_part_2}</span>
          </h2>
          <p className="third-intro-desc">{description}</p>
        </div>

        {/* Panel 2: Slider */}
        <div className="third-slider-panel">
          <div ref={sliderRef} className="third-slider">
            {slides.map((slide, index) => (
              <div key={slide.id || index} className="third-slide">
                {/* Desktop image */}
                <img
                  src={slide.src}
                  alt={slide.desc || ''}
                  className="slide-image slide-image-desktop"
                  ref={index === 0 ? firstSlideImageRef : null}
                />

                {/* Mobile image — fallback to desktop if not provided */}
                <img
                  src={slide.mobileSrc || slide.src}
                  alt={slide.desc || ''}
                  className="slide-image slide-image-mobile"
                />

                <div className="slide-image-overlay" />

                <div
                  className="slide-content-box"
                  style={{
                    top: isMobile
                      ? slide.mobilePos?.top || 'auto'
                      : slide.pos?.top || '60%',
                    left: isMobile
                      ? slide.mobilePos?.left || 'auto'
                      : slide.pos?.left || '8%',
                  }}
                >
                  <span className="slide-category">{slide.desc}</span>
                  <h3 className="slide-title">{slide.title}</h3>
                  {slide.button && (
                    <button type="button" className="explore-work-btn">
                      EXPLORE OUR WORK →
                    </button>
                  )}
                </div>

                <div className="slide-counter">
                  <span>{String(slide.id || index + 1).padStart(2, '0')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThirdSection

// **************************
// 'use client'

// import { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import './ThirdSection.css'

// function ThirdSection({
//   heading_part_1 = 'MADE FOR THE PROJECT',
//   heading_part_2 = 'NOT THE CATALOGUE',
//   description = 'Every project has its own requirements. We fabricate accordingly.',
//   slides = [],
// }) {
//   const sectionRef = useRef(null)
//   const trackRef = useRef(null)
//   const sliderRef = useRef(null)
//   const firstSlideImageRef = useRef(null)

//   useEffect(() => {
//     // Initial State: Intro panel visible rahe (y: 0)
//     gsap.set(trackRef.current, { y: 0 })
//     if (sliderRef.current) gsap.set(sliderRef.current, { x: 0 })
//     if (firstSlideImageRef.current) gsap.set(firstSlideImageRef.current, { scale: 1.3 })

//     const trackY = gsap.quickTo(trackRef.current, 'y', { duration: 0.5, ease: 'power3.out' })
//     const sliderX = sliderRef.current ? gsap.quickTo(sliderRef.current, 'x', { duration: 0.5, ease: 'power3.out' }) : null
//     const imageScaleX = firstSlideImageRef.current ? gsap.quickTo(firstSlideImageRef.current, 'scale', { duration: 0.3, ease: 'power3.out' }) : null

//     // 1. Intro Panel se Slider Panel par Vertical Shift
//     const handleSlideProgress = (e) => {
//       const p = e.detail?.progress ?? 0
//       const vh = window.innerHeight

//       if (imageScaleX) imageScaleX(1.3 - p * 0.3)

//       // Pehle 30% tak Intro thehre, phir slide shift ho
//       const SHIFT_START = 0.3
//       const shiftProgress = Math.max(0, (p - SHIFT_START) / (1 - SHIFT_START))
//       trackY(-shiftProgress * vh)

//       if (sliderX) sliderX(0)
//     }

//     // 2. Horizontal Slider Scroll
//     const handleHorizontalProgress = (e) => {
//       const p = e.detail?.progress ?? 0
//       const vh = window.innerHeight

//       if (imageScaleX) imageScaleX(1)
//       trackY(-vh) // Slider view par lock

//       if (sliderRef.current && sliderX) {
//         const maxScroll = Math.max(0, sliderRef.current.scrollWidth - window.innerWidth + 80)
//         sliderX(-p * maxScroll)
//       }
//     }

//     window.addEventListener('thirdSlideProgress', handleSlideProgress)
//     window.addEventListener('thirdHorizontalProgress', handleHorizontalProgress)

//     return () => {
//       window.removeEventListener('thirdSlideProgress', handleSlideProgress)
//       window.removeEventListener('thirdHorizontalProgress', handleHorizontalProgress)
//     }
//   }, [slides.length])

//   return (
//     <div ref={sectionRef} className="third-section">
//       <div ref={trackRef} className="third-track">
//         {/* Panel 1: Intro */}
//         <div className="third-intro-panel">
//           <h2 className="third-intro-title">
//             <span className="title-white">{heading_part_1}</span>{' '}<br/>
//             <span className="third-intro-title-color">{heading_part_2}</span>
//           </h2>
//           <p className="third-intro-desc">{description}</p>
//         </div>

//         {/* Panel 2: Slider */}
//         <div className="third-slider-panel">
//           <div ref={sliderRef} className="third-slider">
//             {slides.map((slide, index) => (
//               <div key={slide.id || index} className="third-slide">
//                 <img
//                   ref={index === 0 ? firstSlideImageRef : null}
//                   src={slide.src}
//                   alt={slide.desc || ''}
//                   className="slide-image"
//                 />
//                 <div className="slide-image-overlay" />

//                 <div
//                   className="slide-content-box"
//                   style={{
//                     top: slide.pos?.top || '60%',
//                     left: slide.pos?.left || '8%',
//                   }}
//                 >
//                   <span className="slide-category">{slide.desc}</span>
//                   <h3 className="slide-title">{slide.title}</h3>
//                   {slide.button && (
//                     <button type="button" className="explore-work-btn">
//                       EXPLORE OUR WORK →
//                     </button>
//                   )}
//                 </div>

//                 <div className="slide-counter">
//                   <span>{String(slide.id || index + 1).padStart(2, '0')}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ThirdSection