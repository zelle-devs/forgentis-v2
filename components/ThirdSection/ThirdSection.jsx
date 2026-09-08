// 'use client'
// import { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import './ThirdSection.css'

// function ThirdSection({ scrollProgressRef }) {
//   const sectionRef = useRef(null)
//   const sliderRef = useRef(null)

//   // Sample images (aap apni images yahan daalo)
//   const images = [
//   { id: 1, src: '/images/chapter1.webp' },
//     { id: 2, src: '/images/chapter1-detail.webp'},
//     { id: 3, src: '/images/Facilities.webp' },
//     { id: 4, src: '/images/laser.webp' },
//     { id: 5, src: '/images/Retail.webp'},
//   ]

//   useEffect(() => {
//     // Entrance animation
//     gsap.fromTo(
//       sectionRef.current,
//       { opacity: 0 },
//       { opacity: 1, duration: 0.8, ease: 'power2.out' }
//     )
//   }, [])

//   // Horizontal scroll handling
//   useEffect(() => {
//     const handleScrollProgress = (e) => {
//       const progress = e.detail.progress

//       if (sliderRef.current) {
//         // Calculate horizontal movement
//         const maxScroll = sliderRef.current.scrollWidth - window.innerWidth
//         const x = -progress * maxScroll
        
//         gsap.to(sliderRef.current, {
//           x: x,
//           duration: 0.3,
//           ease: 'power2.out'
//         })
//       }
//     }

//     window.addEventListener('scrollProgress', handleScrollProgress)

//     return () => {
//       window.removeEventListener('scrollProgress', handleScrollProgress)
//     }
//   }, [])

//   return (
//     <div ref={sectionRef} className="third-section">
//       <div ref={sliderRef} className="third-slider">
//         {images.map((image) => (
//           <div key={image.id} className="third-slide">
//             <img src={image.src} alt={`Project ${image.id}`} className="slide-image" />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ThirdSection

'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './ThirdSection.css'

function ThirdSection({ scrollProgressRef }) {
  const sectionRef = useRef(null)
  const sliderRef = useRef(null)

  const images = [
    { id: 1, src: '/images/1-a.png' },
    { id: 2, src: '/images/1-b.png'},
    { id: 3, src: '/images/1-c.png' },
    { id: 4, src: '/images/1-d.webp' },
  ]

  useEffect(() => {
    // Initial - section neeche
    gsap.set(sectionRef.current, { y: '100%' })
  }, [])

  // Scroll controlled slide up and horizontal
  useEffect(() => {
    const handleScrollProgress = (e) => {
      const progress = e.detail.progress
      
      if (sectionRef.current && sliderRef.current) {
        if (progress <= 0.5) {
          // Phase 1: Slide up (0 to 0.5)
          const slideProgress = progress / 0.5
          const yPos = (1 - slideProgress) * 100
          
          gsap.to(sectionRef.current, {
            y: `${yPos}%`,
            duration: 0.05,
            ease: 'none'
          })
          
          // Slider reset
          gsap.to(sliderRef.current, {
            x: 0,
            duration: 0.05,
            ease: 'none'
          })
        } else {
          // Phase 2: Horizontal scroll (0.5 to 1)
          const horizontalProgress = (progress - 0.5) / 0.5
          
          // Section fully upar
          gsap.to(sectionRef.current, {
            y: '0%',
            duration: 0.05,
            ease: 'none'
          })
          
          // Smooth horizontal movement
          const maxScroll = sliderRef.current.scrollWidth - window.innerWidth + 40
          const x = -horizontalProgress * maxScroll
          
          gsap.to(sliderRef.current, {
            x: x,
            duration: 0.05,
            ease: 'none'
          })
        }
      }
    }

    window.addEventListener('scrollProgress', handleScrollProgress)

    return () => {
      window.removeEventListener('scrollProgress', handleScrollProgress)
    }
  }, [])

  return (
    <div ref={sectionRef} className="third-section">
      <div ref={sliderRef} className="third-slider">
        {images.map((image) => (
          <div key={image.id} className="third-slide">
            <img src={image.src} alt={`Project ${image.id}`} className="slide-image" />
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

// function ThirdSection({ scrollProgressRef }) {
//   const sectionRef = useRef(null)
//   const sliderRef = useRef(null)

//   const images = [
//     { id: 1, src: '/images/chapter1.webp' },
//     { id: 2, src: '/images/chapter1-detail.webp'},
//     { id: 3, src: '/images/Facilities.webp' },
//     { id: 4, src: '/images/laser.webp' },
//     { id: 5, src: '/images/Retail.webp'},
//   ]

//   useEffect(() => {
//     // Initial state - section neeche se start
//     gsap.set(sectionRef.current, { 
//       y: '100%',
//       opacity: 1 
//     })
//   }, [])

//   // Scroll controlled slide up and horizontal
//   useEffect(() => {
//     const handleScrollProgress = (e) => {
//       const progress = e.detail.progress
      
//       if (sectionRef.current && sliderRef.current) {
//         if (progress <= 0.5) {
//           // Phase 1: Slide up (0 to 0.5)
//           const slideProgress = progress / 0.5 // 0 to 1
//           const yPos = (1 - slideProgress) * 100 // 100% to 0%
          
//           gsap.to(sectionRef.current, {
//             y: `${yPos}%`,
//             duration: 0.2,
//             ease: 'power2.out'
//           })
          
//           // Slider ko reset karo
//           gsap.to(sliderRef.current, {
//             x: 0,
//             duration: 0.2,
//             ease: 'power2.out'
//           })
//         } else {
//           // Phase 2: Horizontal scroll (0.5 to 1)
//           const horizontalProgress = (progress - 0.5) / 0.5 // 0 to 1
          
//           // Section ko fully upar rakho
//           gsap.to(sectionRef.current, {
//             y: '0%',
//             duration: 0.2,
//             ease: 'power2.out'
//           })
          
//           // Horizontal movement
//           const maxScroll = sliderRef.current.scrollWidth - window.innerWidth
//           const x = -horizontalProgress * maxScroll
          
//           gsap.to(sliderRef.current, {
//             x: x,
//             duration: 0.2,
//             ease: 'power2.out'
//           })
//         }
//       }
//     }

//     window.addEventListener('scrollProgress', handleScrollProgress)

//     return () => {
//       window.removeEventListener('scrollProgress', handleScrollProgress)
//     }
//   }, [])

//   return (
//     <div ref={sectionRef} className="third-section">
//       <div ref={sliderRef} className="third-slider">
//         {images.map((image) => (
//           <div key={image.id} className="third-slide">
//             <img src={image.src} alt={`Project ${image.id}`} className="slide-image" />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ThirdSection


// 'use client'
// import { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import './ThirdSection.css'

// function ThirdSection({ scrollProgressRef }) {
//   const sectionRef = useRef(null)
//   const sliderRef = useRef(null)
//   const horizontalProgressRef = useRef(0)

//   // Sample images (aap apni images yahan daalo)
//   const images = [
//     { id: 1, src: '/images/chapter1.webp', title: 'Project One' },
//     { id: 2, src: '/images/chapter1-detail.webp', title: 'Project Two' },
//     { id: 3, src: '/images/Facilities.webp', title: 'Project Three' },
//     { id: 4, src: '/images/laser.webp', title: 'Project Four' },
//     { id: 5, src: '/images/Retail.webp', title: 'Project Five' },
//   ]

//   useEffect(() => {
//     // Entrance animation
//     gsap.fromTo(
//       sectionRef.current,
//       { opacity: 0 },
//       { opacity: 1, duration: 0.8, ease: 'power2.out' }
//     )
//   }, [])

//   // Horizontal scroll handling
//   useEffect(() => {
//     const handleScrollProgress = (e) => {
//       const progress = e.detail.progress
//       horizontalProgressRef.current = progress

//       if (sliderRef.current) {
//         // Calculate horizontal movement
//         const maxScroll = sliderRef.current.scrollWidth - window.innerWidth
//         const x = -progress * maxScroll
        
//         gsap.to(sliderRef.current, {
//           x: x,
//           duration: 0.3,
//           ease: 'power2.out'
//         })
//       }
//     }

//     window.addEventListener('scrollProgress', handleScrollProgress)

//     return () => {
//       window.removeEventListener('scrollProgress', handleScrollProgress)
//     }
//   }, [])

//   return (
//     <div ref={sectionRef} className="third-section">
//       <div className="third-section-header">
//         <span className="third-label">Our Work</span>
//         <span className="third-divider"></span>
//         <span className="third-subtitle">Selected Projects</span>
//       </div>

//       <div ref={sliderRef} className="third-slider">
//         {images.map((image) => (
//           <div key={image.id} className="third-slide">
//             <div className="slide-image-wrapper">
//               <img src={image.src} alt={image.title} className="slide-image" />
//               <div className="slide-overlay">
//                 <span className="slide-number">{String(image.id).padStart(2, '0')}</span>
//                 <h3 className="slide-title">{image.title}</h3>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="third-progress-indicator">
//         <div className="third-progress-line"></div>
//         <span className="third-progress-text">Scroll to explore</span>
//       </div>
//     </div>
//   )
// }

// export default ThirdSection