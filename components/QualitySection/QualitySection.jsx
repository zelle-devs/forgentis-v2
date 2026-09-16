'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './QualitySection.css'

function QualitySection({
  POINTS,
  heading_part_1,
  heading_part_2,
  heading_part_3,
  heading_part_4,
}) {
  const wrapperRef = useRef(null)
  const imageWrapRef = useRef(null)
  const imageRef = useRef(null)
  const titleRef = useRef(null)
  const itemRefs = useRef([])
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  // ===== Mobile detection =====
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    setMounted(true)
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // ===== Entrance animation =====
  useEffect(() => {
    if (!mounted) return

    if (isMobile) {
      if (imageWrapRef.current) {
        gsap.set(imageWrapRef.current, {
          xPercent: 0,
          opacity: 1,
          clearProps: 'transform,opacity',
        })
      }
      if (imageRef.current) {
        gsap.set(imageRef.current, {
          yPercent: 0,
          clearProps: 'transform',
        })
      }

      if (titleRef.current) {
        gsap.set(titleRef.current, {
          opacity: 1,
          clearProps: 'transform,opacity',
        })
        const titleLines = titleRef.current.querySelectorAll(
          '.quality-title-line'
        )
        titleLines.forEach((line) => {
          gsap.set(line, {
            opacity: 1,
            y: 0,
            clearProps: 'transform,opacity',
          })
        })
      }

      itemRefs.current.forEach((el) => {
        if (el) {
          gsap.set(el, {
            opacity: 1,
            y: 0,
            clearProps: 'transform,opacity',
          })
        }
      })

      return
    }

    // ===== Desktop animation =====
    gsap.set(itemRefs.current, { opacity: 0, y: 40 })
    gsap.set(imageRef.current, { yPercent: 0 })

    const tl = gsap.timeline({ delay: 0.15 })
    tl.fromTo(
      imageWrapRef.current,
      { xPercent: 100, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }
    ).fromTo(
      titleRef.current.querySelectorAll('.quality-title-line'),
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out' },
      '-=0.7'
    )

    return () => tl.kill()
  }, [isMobile, mounted])

  // ===== Scroll progress animation (Dynamic calculation) =====
  useEffect(() => {
    if (isMobile) {
      if (imageRef.current) {
        gsap.set(imageRef.current, {
          yPercent: 0,
          clearProps: 'transform',
        })
      }
      itemRefs.current.forEach((el) => {
        if (el) {
          gsap.set(el, {
            opacity: 1,
            y: 0,
            clearProps: 'transform,opacity',
          })
        }
      })
      return
    }

    const applyProgress = (progress) => {
      gsap.to(imageRef.current, {
        yPercent: -progress * 22,
        duration: 0.08,
        ease: 'none',
        overwrite: 'auto',
      })

      // Dynamically calculate interval steps based on total points length
      const totalPoints = POINTS.length
      const step = 1 / totalPoints

      POINTS.forEach((_, i) => {
        const start = i * step
        const windowSize = step * 1.2 // slight overlap for smoother appearance
        const itemProgress = Math.max(0, Math.min(1, (progress - start) / windowSize))
        const el = itemRefs.current[i]
        
        if (!el) return
        gsap.to(el, {
          opacity: itemProgress,
          y: (1 - itemProgress) * 30,
          duration: 0.08,
          ease: 'none',
          overwrite: 'auto',
        })
      })
    }

    const handleQualityProgress = (e) => {
      applyProgress(e.detail.progress)
    }

    window.addEventListener('qualityProgress', handleQualityProgress)
    return () =>
      window.removeEventListener('qualityProgress', handleQualityProgress)
  }, [isMobile, POINTS])

  return (
    <div ref={wrapperRef} className="quality-section">
      <div ref={imageWrapRef} className="quality-image-wrap">
        <img
          ref={imageRef}
          src="/optimize/when_good_enough.png"
          alt="Craftsmanship"
        />
      </div>

      <h2 ref={titleRef} className="quality-title">
        <span className="quality-title-line">
          {heading_part_1} <span className="accent">{heading_part_2}</span>
        </span>
        <span className="quality-title-line">{heading_part_3}</span>
        <span className="quality-title-line accent">{heading_part_4}</span>
      </h2>

      <div className="quality-list">
        {POINTS.map((point, i) => (
          <div
            key={point.title || i}
            ref={(el) => (itemRefs.current[i] = el)}
            className="quality-item"
          >
            <span className="quality-item-number">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="quality-item-text">
              <h3>{point.title}</h3>
              <p>{point.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QualitySection

// 'use client'
// import { useEffect, useRef, useState } from 'react'
// import gsap from 'gsap'
// import './QualitySection.css'

// function QualitySection({
//   POINTS,
//   heading_part_1,
//   heading_part_2,
//   heading_part_3,
//   heading_part_4,
// }) {
//   const wrapperRef = useRef(null)
//   const imageWrapRef = useRef(null)
//   const imageRef = useRef(null)
//   const titleRef = useRef(null)
//   const itemRefs = useRef([])
//   const progressRef = useRef(0)
//   const [isMobile, setIsMobile] = useState(false)
//   const [mounted, setMounted] = useState(false)

//   // ===== Mobile detection =====
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth <= 768)
//     checkMobile()
//     setMounted(true)
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   // ===== Entrance animation =====
//   useEffect(() => {
//     // Pehle check karo ki component mount hua ya nahi
//     if (!mounted) return

//     // Mobile pe — sab kuch visible, koi animation nahi
//     if (isMobile) {
//       if (imageWrapRef.current) {
//         gsap.set(imageWrapRef.current, {
//           xPercent: 0,
//           opacity: 1,
//           clearProps: 'transform,opacity',
//         })
//       }
//       if (imageRef.current) {
//         gsap.set(imageRef.current, {
//           yPercent: 0,
//           clearProps: 'transform',
//         })
//       }

//       // ✅ Title + uske lines ko reset kar
//       if (titleRef.current) {
//         gsap.set(titleRef.current, {
//           opacity: 1,
//           clearProps: 'transform,opacity',
//         })
//         const titleLines = titleRef.current.querySelectorAll(
//           '.quality-title-line'
//         )
//         titleLines.forEach((line) => {
//           gsap.set(line, {
//             opacity: 1,
//             y: 0,
//             clearProps: 'transform,opacity',
//           })
//         })
//       }

//       // Items reset
//       itemRefs.current.forEach((el) => {
//         if (el) {
//           gsap.set(el, {
//             opacity: 1,
//             y: 0,
//             clearProps: 'transform,opacity',
//           })
//         }
//       })

//       return
//     }

//     // ===== Desktop animation =====
//     gsap.set(itemRefs.current, { opacity: 0, y: 40 })
//     gsap.set(imageRef.current, { yPercent: 0 })

//     const tl = gsap.timeline({ delay: 0.15 })
//     tl.fromTo(
//       imageWrapRef.current,
//       { xPercent: 100, opacity: 0 },
//       { xPercent: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }
//     ).fromTo(
//       titleRef.current.querySelectorAll('.quality-title-line'),
//       { y: 60, opacity: 0 },
//       { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out' },
//       '-=0.7'
//     )

//     return () => tl.kill()
//   }, [isMobile, mounted])

//   // ===== Scroll progress animation =====
//   useEffect(() => {
//     // Mobile pe skip
//     if (isMobile) {
//       if (imageRef.current) {
//         gsap.set(imageRef.current, {
//           yPercent: 0,
//           clearProps: 'transform',
//         })
//       }
//       itemRefs.current.forEach((el) => {
//         if (el) {
//           gsap.set(el, {
//             opacity: 1,
//             y: 0,
//             clearProps: 'transform,opacity',
//           })
//         }
//       })
//       return
//     }

//     const applyProgress = (progress) => {
//       gsap.to(imageRef.current, {
//         yPercent: -progress * 22,
//         duration: 0.08,
//         ease: 'none',
//         overwrite: 'auto',
//       })

//       POINTS.forEach((_, i) => {
//         const start = i * 0.25
//         const itemProgress = Math.max(0, Math.min(1, (progress - start) / 0.2))
//         const el = itemRefs.current[i]
//         if (!el) return
//         gsap.to(el, {
//           opacity: itemProgress,
//           y: (1 - itemProgress) * 40,
//           duration: 0.08,
//           ease: 'none',
//           overwrite: 'auto',
//         })
//       })
//     }

//     const handleQualityProgress = (e) => {
//       applyProgress(e.detail.progress)
//     }

//     window.addEventListener('qualityProgress', handleQualityProgress)
//     return () =>
//       window.removeEventListener('qualityProgress', handleQualityProgress)
//   }, [isMobile])

//   return (
//     <div ref={wrapperRef} className="quality-section">
//       <div ref={imageWrapRef} className="quality-image-wrap">
//         <img
//           ref={imageRef}
//           src="/images/when_good_enough.jpeg"
//           alt="Craftsmanship"
//         />
//       </div>

//       <h2 ref={titleRef} className="quality-title">
//         <span className="quality-title-line">
//           {heading_part_1} <span className="accent">{heading_part_2}</span>
//         </span>
//         <span className="quality-title-line">{heading_part_3}</span>
//         <span className="quality-title-line accent">{heading_part_4}</span>
//       </h2>

//       <div className="quality-list">
//         {POINTS.map((point, i) => (
//           <div
//             key={point.title}
//             ref={(el) => (itemRefs.current[i] = el)}
//             className="quality-item"
//           >
//             <span className="quality-item-number">
//               {String(i + 1).padStart(2, '0')}
//             </span>
//             <div className="quality-item-text">
//               <h3>{point.title}</h3>
//               <p>{point.desc}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default QualitySection
