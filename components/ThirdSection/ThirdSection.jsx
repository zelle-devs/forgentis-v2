'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './ThirdSection.css'

function ThirdSection({ scrollProgressRef }) {
  const sectionRef = useRef(null)
  const sliderRef = useRef(null)
  const firstSlideImageRef = useRef(null)

  const images = [
    { id: 1, src: '/images/1-a.png', title: 'Chapter One', desc: 'The Beginning' },
    { id: 2, src: '/images/1-b.png', title: 'Chapter Two', desc: 'The Journey' },
    { id: 3, src: '/images/1-c.png', title: 'Chapter Three', desc: 'The Craft' },
    { id: 4, src: '/images/1-d.webp', title: 'Chapter Four', desc: 'The Legacy' },
  ]

  useEffect(() => {
    // ✅ sectionRef ab y translate nahi karta — parent wrapper (thirdSectionRef)
    // pehle se hi poore section ko slide karta hai. Yahan sirf zoom ka initial state.
    if (firstSlideImageRef.current) {
      gsap.set(firstSlideImageRef.current, { scale: 1.3 })
    }
  }, [])

  useEffect(() => {
    // ✅ Phase 1 (vertical slide + zoom) — apna alag event
    const handleSlideProgress = (e) => {
      const slideProgress = e.detail.progress // already 0 → 1 normalized

      if (firstSlideImageRef.current) {
        const scaleValue = 1.3 - (slideProgress * 0.3)
        gsap.to(firstSlideImageRef.current, {
          scale: scaleValue,
          duration: 0.08,
          ease: 'none',
          overwrite: 'auto',
        })
      }

      // slider ko reset/rest position pe rakho jab tak horizontal phase shuru na ho
      if (sliderRef.current) {
        gsap.to(sliderRef.current, { x: 0, duration: 0.08, ease: 'none', overwrite: 'auto' })
      }
    }

    // ✅ Phase 2 (horizontal scroll) — apna alag event, ab kabhi progress=0 confuse nahi karega
    const handleHorizontalProgress = (e) => {
      const horizontalProgress = e.detail.progress // 0 → 1

      if (firstSlideImageRef.current) {
        gsap.to(firstSlideImageRef.current, { scale: 1, duration: 0.08, ease: 'none', overwrite: 'auto' })
      }

      if (sliderRef.current) {
        const maxScroll = sliderRef.current.scrollWidth - window.innerWidth + 40
        const x = -horizontalProgress * maxScroll
        gsap.to(sliderRef.current, { x, duration: 0.08, ease: 'none', overwrite: 'auto' })
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
      <div ref={sliderRef} className="third-slider">
        {images.map((image, index) => (
          <div key={image.id} className="third-slide">
            <img
              ref={index === 0 ? firstSlideImageRef : null}
              src={image.src}
              alt={image.title}
              className="slide-image"
            />

            <div className="slide-top-content">
              <div className="slide-left-text">
                <span>{image.desc}</span>
              </div>
              <div className="slide-center-text">
                <h3>
                  {image.title.split(' ')[0]}{' '}
                  <span className="highlight">{image.title.split(' ')[1]}</span>
                </h3>
              </div>
              <div className="slide-right-text">
                <span>{String(image.id).padStart(2, '0')}</span>
              </div>
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

// function ThirdSection({ scrollProgressRef }) {
//   const sectionRef = useRef(null)
//   const sliderRef = useRef(null)
//   const firstSlideImageRef = useRef(null)

//   const images = [
//     { id: 1, src: '/images/1-a.png', title: 'Chapter One', desc: 'The Beginning' },
//     { id: 2, src: '/images/1-b.png', title: 'Chapter Two', desc: 'The Journey' },
//     { id: 3, src: '/images/1-c.png', title: 'Chapter Three', desc: 'The Craft' },
//     { id: 4, src: '/images/1-d.webp', title: 'Chapter Four', desc: 'The Legacy' },
//   ]

//   useEffect(() => {
//     // Initial state - section neeche, first image zoomed
//     gsap.set(sectionRef.current, { y: '100%' })
//     if (firstSlideImageRef.current) {
//       gsap.set(firstSlideImageRef.current, { scale: 1.3 })
//     }
//   }, [])

//   useEffect(() => {
//     const handleScrollProgress = (e) => {
//       const progress = e.detail.progress
      
//       if (sectionRef.current && sliderRef.current) {
//         if (progress <= 0.5) {
//           // Phase 1: Slide up with zoom out
//           const slideProgress = progress / 0.5
//           const yPos = (1 - slideProgress) * 100
          
//           gsap.to(sectionRef.current, {
//             y: `${yPos}%`,
//             duration: 0.05,
//             ease: 'none'
//           })
          
//           // First image zoom out - 1.3 se 1.0
//           if (firstSlideImageRef.current) {
//             const scaleValue = 1.3 - (slideProgress * 0.3)
//             gsap.to(firstSlideImageRef.current, {
//               scale: scaleValue,
//               duration: 0.05,
//               ease: 'none'
//             })
//           }
          
//           gsap.to(sliderRef.current, { x: 0, duration: 0.05, ease: 'none' })
//         } else {
//           // Phase 2: Horizontal scroll
//           const horizontalProgress = (progress - 0.5) / 0.5
          
//           gsap.to(sectionRef.current, { y: '0%', duration: 0.05, ease: 'none' })
          
//           if (firstSlideImageRef.current) {
//             gsap.to(firstSlideImageRef.current, { scale: 1, duration: 0.05, ease: 'none' })
//           }
          
//           const maxScroll = sliderRef.current.scrollWidth - window.innerWidth + 40
//           const x = -horizontalProgress * maxScroll
          
//           gsap.to(sliderRef.current, { x: x, duration: 0.05, ease: 'none' })
//         }
//       }
//     }

//     window.addEventListener('scrollProgress', handleScrollProgress)
//     return () => window.removeEventListener('scrollProgress', handleScrollProgress)
//   }, [])

//   return (
//     <div ref={sectionRef} className="third-section">
//       <div ref={sliderRef} className="third-slider">
//         {images.map((image, index) => (
//           <div key={image.id} className="third-slide">
//             <img 
//               ref={index === 0 ? firstSlideImageRef : null}
//               src={image.src} 
//               alt={image.title} 
//               className="slide-image" 
//             />
            
//             {/* Top Content Overlay */}
//             <div className="slide-top-content">
//               <div className="slide-left-text">
//                 <span>{image.desc}</span>
//               </div>
//               <div className="slide-center-text">
//                 <h3>
//                   {image.title.split(' ')[0]}{' '}
//                   <span className="highlight">{image.title.split(' ')[1]}</span>
//                 </h3>
//               </div>
//               <div className="slide-right-text">
//                 <span>{String(image.id).padStart(2, '0')}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ThirdSection