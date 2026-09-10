'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './ThirdSection.css'

function ThirdSection() {
  const sectionRef = useRef(null)
  const sliderRef = useRef(null)
  const firstSlideImageRef = useRef(null)
  const introRef = useRef(null)

  const slides = [
    {
      id: 1,
      src: '/images/build1.png',
      desc: 'ARCHITECTURAL METALWORK',
      title: 'Facades, screens, railings, staircases and feature elements.',
      pos: { top: '3%', left: '3%' },
    },
    {
      id: 2,
      src: '/images/build2.jpeg',
      desc: 'COMMERCIAL & INTERIOR',
      title: 'Furniture bases, signage, panels and custom interior metalwork.',
      pos: { top: '80%', left: '65%' },
    },
    {
      id: 3,
      src: '/images/build3.jpeg',
      desc: 'INDUSTRIAL FABRICATION',
      title: 'Engineered components, structural assemblies and production parts.',
      pos: { top: '80%', left: '42%' },
    },
    {
      id: 4,
      src: '/images/build4.jpeg',
      desc: 'CUSTOM FABRICATION',
      title: 'Complex requirements transformed into practical, precisely fabricated solutions.',
      pos: { top: '3%', left: '3%' },
      button: true,
    },
  ]

  useEffect(() => {
    if (firstSlideImageRef.current) {
      gsap.set(firstSlideImageRef.current, { scale: 1.3 })
    }
    if (introRef.current) {
      gsap.set(introRef.current, { yPercent: 0, opacity: 1 })
    }
  }, [])

  useEffect(() => {
    // Create optimized quickTo scrubbers for lag-free buttery smooth interpolation
    const imageScaleX = gsap.quickTo(firstSlideImageRef.current, "scale", { duration: 0.3, ease: "power3.out" })
    const introY = gsap.quickTo(introRef.current, "yPercent", { duration: 0.3, ease: "power3.out" })
    const introOpacity = gsap.quickTo(introRef.current, "opacity", { duration: 0.3, ease: "power3.out" })
    const sliderX = gsap.quickTo(sliderRef.current, "x", { duration: 0.4, ease: "power3.out" })

    const handleSlideProgress = (e) => {
      const slideProgress = e.detail.progress // 0 → 1
      imageScaleX(1.3 - slideProgress * 0.3)
      introY(slideProgress * -30)
      introOpacity(1 - slideProgress)
      sliderX(0)
    }

    const handleHorizontalProgress = (e) => {
      const horizontalProgress = e.detail.progress // 0 → 1
      imageScaleX(1)
      introOpacity(0)
      
      if (sliderRef.current) {
        const maxScroll = sliderRef.current.scrollWidth - window.innerWidth + 40
        sliderX(-horizontalProgress * maxScroll)
      }
    }

    window.addEventListener('thirdSlideProgress', handleSlideProgress)
    window.addEventListener('thirdHorizontalProgress', handleHorizontalProgress)
    return () => {
      window.removeEventListener('thirdSlideProgress', handleSlideProgress)
      window.removeEventListener('thirdHorizontalProgress', handleHorizontalProgress)
    }
  }, [])

  return (
    <div ref={sectionRef} className="third-section">
      <div ref={introRef} className="third-intro">
        <h2 className="third-intro-title">MADE FOR THE PROJECT.<span className='third-intro-title-color'>NOT THE CATALOGUE.</span></h2>
        <p className="third-intro-desc">Every project has its own requirements. We fabricate accordingly.</p>
      </div>

      <div ref={sliderRef} className="third-slider">
        {slides.map((slide, index) => (
          <div key={slide.id} className="third-slide">
            <img
              ref={index === 0 ? firstSlideImageRef : null}
              src={slide.src}
              alt={slide.desc}
              className="slide-image"
            />
            <div className="slide-image-overlay" />

            <div
              className="slide-content-box"
              style={{ top: slide.pos.top, left: slide.pos.left }}
            >
              <span className="slide-category">{slide.desc}</span>
              <h3>{slide.title}</h3>
              {slide.button && <button className="explore-work-btn">EXPLORE OUR WORK</button>}
            </div>

            <div className="slide-counter">
              <span>{String(slide.id).padStart(2, '0')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ThirdSection


// 'use client'
// import { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import './ThirdSection.css'

// function ThirdSection() {
//   const sectionRef = useRef(null)
//   const sliderRef = useRef(null)
//   const firstSlideImageRef = useRef(null)
//   const introRef = useRef(null)

//   const slides = [
//     {
//       id: 1,
//       src: '/images/build1.png',
//       desc: 'ARCHITECTURAL METALWORK',
//       title: 'Facades, screens, railings, staircases and feature elements.',
//       pos: { top: '75%', left: '8%' },
//     },
//     {
//       id: 2,
//       src: '/images/build2.jpeg',
//       desc: 'COMMERCIAL & INTERIOR',
//       title: 'Furniture bases, signage, panels and custom interior metalwork.',
//       pos: { top: '10%', left: '8%' },
//     },
//     {
//       id: 3,
//       src: '/images/build3.jpeg',
//       desc: 'INDUSTRIAL FABRICATION',
//       title: 'Engineered components, structural assemblies and production parts.',
//       pos: { top: '80%', left: '32%' },
//     },
//     {
//       id: 4,
//       src: '/images/build4.jpeg',
//       desc: 'CUSTOM FABRICATION',
//       title: 'Complex requirements transformed into practical, precisely fabricated solutions.',
//       pos: { top: '70%', left: '60%' },
//       button: true,
//     },
//   ]

//   useEffect(() => {
//     if (firstSlideImageRef.current) {
//       gsap.set(firstSlideImageRef.current, { scale: 1.3 })
//     }
//     if (introRef.current) {
//       gsap.set(introRef.current, { yPercent: 0, opacity: 1 })
//     }
//   }, [])

//   useEffect(() => {
//     // Phase 1 (Vertical slide + zoom + Intro fading out)
//     const handleSlideProgress = (e) => {
//       const slideProgress = e.detail.progress // 0 → 1

//       if (firstSlideImageRef.current) {
//         const scaleValue = 1.3 - slideProgress * 0.3
//         gsap.to(firstSlideImageRef.current, {
//           scale: scaleValue,
//           duration: 0.08,
//           ease: 'none',
//           overwrite: 'auto',
//         })
//       }

//       if (introRef.current) {
//         gsap.to(introRef.current, {
//           yPercent: slideProgress * -30,
//           opacity: 1 - slideProgress,
//           duration: 0.08,
//           ease: 'none',
//           overwrite: 'auto',
//         })
//       }

//       if (sliderRef.current) {
//         gsap.to(sliderRef.current, { x: 0, duration: 0.08, ease: 'none', overwrite: 'auto' })
//       }
//     }

//     // Phase 2 (Horizontal scroll)
//     const handleHorizontalProgress = (e) => {
//       const horizontalProgress = e.detail.progress // 0 → 1

//       if (firstSlideImageRef.current) {
//         gsap.to(firstSlideImageRef.current, { scale: 1, duration: 0.08, ease: 'none', overwrite: 'auto' })
//       }

//       if (introRef.current) {
//         gsap.to(introRef.current, { opacity: 0, duration: 0.08, ease: 'none', overwrite: 'auto' })
//       }

//       if (sliderRef.current) {
//         const maxScroll = sliderRef.current.scrollWidth - window.innerWidth + 40
//         const x = -horizontalProgress * maxScroll
//         gsap.to(sliderRef.current, { x, duration: 0.08, ease: 'none', overwrite: 'auto' })
//       }
//     }

//     window.addEventListener('thirdSlideProgress', handleSlideProgress)
//     window.addEventListener('thirdHorizontalProgress', handleHorizontalProgress)
//     return () => {
//       window.removeEventListener('thirdSlideProgress', handleSlideProgress)
//       window.removeEventListener('thirdHorizontalProgress', handleHorizontalProgress)
//     }
//   }, [])

//   return (
//     <div ref={sectionRef} className="third-section">
//       {/* Top Intro Section (Fills the blank space initially) */}
//       <div ref={introRef} className="third-intro">
//         <h2 className="third-intro-title">MADE FOR THE PROJECT.<span className='third-intro-title-color'>NOT THE CATALOGUE.</span></h2>
//         <p className="third-intro-desc">Every project has its own requirements. We fabricate accordingly.</p>
//       </div>

//       <div ref={sliderRef} className="third-slider">
//         {slides.map((slide, index) => (
//           <div key={slide.id} className="third-slide">
//             <img
//               ref={index === 0 ? firstSlideImageRef : null}
//               src={slide.src}
//               alt={slide.desc}
//               className="slide-image"
//             />
//             <div className="slide-image-overlay" />

//             {/* Dynamic & Random Content Positioning */}
//             <div
//               className="slide-content-box"
//               style={{ top: slide.pos.top, left: slide.pos.left }}
//             >
//               <span className="slide-category">{slide.desc}</span>
//               <h3>{slide.title}</h3>
//               {slide.button && <button className="explore-work-btn">EXPLORE OUR WORK</button>}
//             </div>

//             <div className="slide-counter">
//               <span>{String(slide.id).padStart(2, '0')}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ThirdSection
