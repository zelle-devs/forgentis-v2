'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './SecondSection.css'

function SecondSection() {
  const sectionRef = useRef(null)
  const leftColumnRef = useRef(null)
  const centerColumnRef = useRef(null)
  const rightColumnRef = useRef(null)
  const headingRef = useRef(null)
  const charRefs = useRef([])
  const lastVisibleCount = useRef(0)

  useEffect(() => {
    if (headingRef.current) {
      const text = headingRef.current.textContent
      headingRef.current.innerHTML = ''
      
      const words = text.split(' ')
      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span')
        wordSpan.className = 'section-word'
        wordSpan.style.display = 'inline-block'
        wordSpan.style.whiteSpace = 'nowrap'
        
        word.split('').forEach((char) => {
          const charSpan = document.createElement('span')
          charSpan.textContent = char
          charSpan.className = 'section-char'
          charSpan.style.display = 'inline-block'
          wordSpan.appendChild(charSpan)
          charRefs.current.push(charSpan)
        })
        
        headingRef.current.appendChild(wordSpan)
        
        if (wordIndex < words.length - 1) {
          headingRef.current.appendChild(document.createTextNode(' '))
        }
      })
      
      charRefs.current.forEach((char) => {
        gsap.set(char, {
          color: 'rgba(157, 160, 161, 0.3)',
          opacity: 0.3,
        })
      })
    }

    const timeline = gsap.timeline()
    timeline
      .fromTo(sectionRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      .fromTo(leftColumnRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.3')
      .fromTo(rightColumnRef.current, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.8')

    return () => {
      timeline.kill()
    }
  }, [])

  // Listen to secondTextProgress which maps cleanly as you scroll through SecondSection
  useEffect(() => {
    const handleSecondTextProgress = (e) => {
      const textProgress = e.detail.progress // 0 -> 1 as you scroll inside SecondSection
      
      const totalChars = charRefs.current.length
      const visibleChars = Math.floor(textProgress * totalChars)
      
      if (visibleChars !== lastVisibleCount.current) {
        charRefs.current.forEach((char, index) => {
          if (index < visibleChars) {
            gsap.to(char, {
              color: '#FFFFFF',
              opacity: 1,
              duration: 0.4,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          } else {
            gsap.to(char, {
              color: 'rgba(157, 160, 161, 0.3)',
              opacity: 0.3,
              duration: 0.4,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          }
        })
        lastVisibleCount.current = visibleChars
      }
    }

    window.addEventListener('secondTextProgress', handleSecondTextProgress)
    return () => window.removeEventListener('secondTextProgress', handleSecondTextProgress)
  }, [])

  return (
    <div ref={sectionRef} className="second-section">
      <div ref={leftColumnRef} className="second-left-column">
        <div className="left-top-content">
          <span className="left-label">Designed</span>
          <span className="left-gap"></span>
          <span className="left-small-text">For Excellence</span>
        </div>
        <div className="left-bottom-content">
          <div className="left-image">
            <img src="/images/object2.webp" alt="Design" />
          </div>
        </div>
      </div>

      <div ref={centerColumnRef} className="second-center-column">
        <h2 ref={headingRef} className="second-heading">
          FROM ENGINEERING REQUIREMENT TO FINISHED METALWORK
        </h2>
      </div>

      <div ref={rightColumnRef} className="second-right-column">
        <p className="right-description">
          A great fabrication partner does more than manufacture parts.
        </p>
      </div>
    </div>
  )
}

export default SecondSection


// 'use client'
// import { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import './SecondSection.css'

// function SecondSection({ scrollProgressRef }) {
//   const sectionRef = useRef(null)
//   const leftColumnRef = useRef(null)
//   const centerColumnRef = useRef(null)
//   const rightColumnRef = useRef(null)
//   const headingRef = useRef(null)
//   const charRefs = useRef([])
//   const localScrollRef = useRef(0)

//   useEffect(() => {
//     // Split center text into characters
//     if (headingRef.current) {
//       const text = headingRef.current.textContent
//       headingRef.current.innerHTML = ''
      
//       const words = text.split(' ')
//       words.forEach((word, wordIndex) => {
//         const wordSpan = document.createElement('span')
//         wordSpan.className = 'section-word'
//         wordSpan.style.display = 'inline-block'
//         wordSpan.style.whiteSpace = 'nowrap'
        
//         word.split('').forEach((char) => {
//           const charSpan = document.createElement('span')
//           charSpan.textContent = char
//           charSpan.className = 'section-char'
//           charSpan.style.display = 'inline-block'
//           wordSpan.appendChild(charSpan)
//           charRefs.current.push(charSpan)
//         })
        
//         headingRef.current.appendChild(wordSpan)
        
//         if (wordIndex < words.length - 1) {
//           headingRef.current.appendChild(document.createTextNode(' '))
//         }
//       })
      
//       // Initially sab characters dull rakho
//       charRefs.current.forEach((char) => {
//         gsap.set(char, {
//           color: 'rgba(157, 160, 161, 0.3)',
//           opacity: 0.3,
//         })
//       })
//     }

//     // Entrance animations
//     const timeline = gsap.timeline()

//     timeline
//       .fromTo(
//         sectionRef.current,
//         { opacity: 0 },
//         { opacity: 1, duration: 0.5, ease: 'power2.out' }
//       )
//       .fromTo(
//         leftColumnRef.current,
//         { x: -100, opacity: 0 },
//         { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
//         '-=0.3'
//       )
//       .fromTo(
//         rightColumnRef.current,
//         { x: 100, opacity: 0 },
//         { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
//         '-=0.8'
//       )

//     return () => {
//       timeline.kill()
//     }
//   }, [])

//   // Bidirectional character fill effect on scroll
//   useEffect(() => {
//     const handleScrollProgress = (e) => {
//       const progress = e.detail.progress
//       localScrollRef.current = progress
      
//       // Progress ko 0 se 1 tak map karo
//       const totalChars = charRefs.current.length
//       const visibleChars = Math.floor(progress * totalChars)
      
//       // Har character ko update karo
//       charRefs.current.forEach((char, index) => {
//         if (index < visibleChars) {
//           // Character white hota hai
//           gsap.to(char, {
//             color: '#FFFFFF',
//             opacity: 1,
//             duration: 0.15,
//             ease: 'power2.out'
//           })
//         } else {
//           // Character dull rehta hai
//           gsap.to(char, {
//             color: 'rgba(157, 160, 161, 0.3)',
//             opacity: 0.3,
//             duration: 0.15,
//             ease: 'power2.out'
//           })
//         }
//       })
//     }

//     window.addEventListener('scrollProgress', handleScrollProgress)

//     return () => {
//       window.removeEventListener('scrollProgress', handleScrollProgress)
//     }
//   }, [])

//   return (
//     <div ref={sectionRef} className="second-section">
//       {/* Left Column - 20% */}
//       <div ref={leftColumnRef} className="second-left-column">
//         <div className="left-top-content">
//           <span className="left-label">Designed</span>
//           <span className="left-gap"></span>
//           <span className="left-small-text">For Excellence</span>
//         </div>
//         <div className="left-bottom-content">
//           <div className="left-image">
//             <img src="/images/object2.webp" alt="Design" />
//           </div>
//         </div>
//       </div>

//       {/* Center Column - 60% */}
//       <div ref={centerColumnRef} className="second-center-column">
//         <h2 ref={headingRef} className="second-heading">
//           Every piece serves as a profound declaration, striking in its design, intentional in its meaning, and undeniably his.
//         </h2>
//       </div>

//       {/* Right Column - 20% */}
//       <div ref={rightColumnRef} className="second-right-column">
//         <p className="right-description">
//           Precision fabrication for architecture, industry, and everything in between. Each creation tells a story of craftsmanship and innovation.
//         </p>
//       </div>
//     </div>
//   )
// }

// export default SecondSection

// **************************************2*********************

// 'use client'
// import { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import './SecondSection.css'

// function SecondSection({ scrollProgressRef }) {
//   const sectionRef = useRef(null)
//   const leftColumnRef = useRef(null)
//   const centerColumnRef = useRef(null)
//   const rightColumnRef = useRef(null)
//   const headingRef = useRef(null)
//   const charRefs = useRef([])
//   const lastVisibleCount = useRef(0)

//   useEffect(() => {
//     // Split center text into characters
//     if (headingRef.current) {
//       const text = headingRef.current.textContent
//       headingRef.current.innerHTML = ''
      
//       const words = text.split(' ')
//       words.forEach((word, wordIndex) => {
//         const wordSpan = document.createElement('span')
//         wordSpan.className = 'section-word'
//         wordSpan.style.display = 'inline-block'
//         wordSpan.style.whiteSpace = 'nowrap'
        
//         word.split('').forEach((char) => {
//           const charSpan = document.createElement('span')
//           charSpan.textContent = char
//           charSpan.className = 'section-char'
//           charSpan.style.display = 'inline-block'
//           wordSpan.appendChild(charSpan)
//           charRefs.current.push(charSpan)
//         })
        
//         headingRef.current.appendChild(wordSpan)
        
//         if (wordIndex < words.length - 1) {
//           headingRef.current.appendChild(document.createTextNode(' '))
//         }
//       })
      
//       // Initially sab characters dull rakho
//       charRefs.current.forEach((char) => {
//         gsap.set(char, {
//           color: 'rgba(157, 160, 161, 0.3)',
//           opacity: 0.3,
//         })
//       })
//     }

//     // Entrance animations
//     const timeline = gsap.timeline()

//     timeline
//       .fromTo(
//         sectionRef.current,
//         { opacity: 0 },
//         { opacity: 1, duration: 0.5, ease: 'power2.out' }
//       )
//       .fromTo(
//         leftColumnRef.current,
//         { x: -100, opacity: 0 },
//         { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
//         '-=0.3'
//       )
//       .fromTo(
//         rightColumnRef.current,
//         { x: 100, opacity: 0 },
//         { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
//         '-=0.8'
//       )

//     return () => {
//       timeline.kill()
//     }
//   }, [])

//   // Ultra smooth letter-by-letter fill
//  // Ultra smooth letter-by-letter fill during second half of scroll progress
//   useEffect(() => {
//     const handleScrollProgress = (e) => {
//       const progress = e.detail.progress
      
//       // Map progress from 0.5 - 1.0 to text fill percentage (0 - 1)
//       const textProgress = progress <= 0.5 ? 0 : (progress - 0.5) / 0.5
      
//       const totalChars = charRefs.current.length
//       const visibleChars = Math.floor(textProgress * totalChars)
      
//       if (visibleChars !== lastVisibleCount.current) {
//         charRefs.current.forEach((char, index) => {
//           if (index < visibleChars) {
//             gsap.to(char, {
//               color: '#FFFFFF',
//               opacity: 1,
//               duration: 0.4,
//               ease: 'power2.out'
//             })
//           } else if (index >= visibleChars && index < lastVisibleCount.current) {
//             gsap.to(char, {
//               color: 'rgba(157, 160, 161, 0.3)',
//               opacity: 0.3,
//               duration: 0.4,
//               ease: 'power2.out'
//             })
//           }
//         })
        
//         lastVisibleCount.current = visibleChars
//       }
//     }

//     window.addEventListener('scrollProgress', handleScrollProgress)
//     return () => window.removeEventListener('scrollProgress', handleScrollProgress)
//   }, [])

//   return (
//     <div ref={sectionRef} className="second-section">
//       {/* Left Column - 20% */}
//       <div ref={leftColumnRef} className="second-left-column">
//         <div className="left-top-content">
//           <span className="left-label">Designed</span>
//           <span className="left-gap"></span>
//           <span className="left-small-text">For Excellence</span>
//         </div>
//         <div className="left-bottom-content">
//           <div className="left-image">
//             <img src="/images/object2.webp" alt="Design" />
//           </div>
//         </div>
//       </div>

//       {/* Center Column - 60% */}
//       <div ref={centerColumnRef} className="second-center-column">
//         <h2 ref={headingRef} className="second-heading">
//           FROM ENGINEERING REQUIREMENT TO FINISHED METALWORK
//         </h2>
//       </div>

//       {/* Right Column - 20% */}
//       <div ref={rightColumnRef} className="second-right-column">
//         <p className="right-description">
// A great fabrication partner does more than manufacture parts.
//         </p>
//       </div>
//     </div>
//   )
// }

// export default SecondSection


// 'use client'
// import { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import './SecondSection.css'

// function SecondSection({ scrollProgressRef }) {
//   const sectionRef = useRef(null)
//   const leftColumnRef = useRef(null)
//   const centerColumnRef = useRef(null)
//   const rightColumnRef = useRef(null)
//   const headingRef = useRef(null)
//   const charRefs = useRef([])

//   useEffect(() => {
//     // Split center text into characters
//     if (headingRef.current) {
//       const text = headingRef.current.textContent
//       headingRef.current.innerHTML = ''
      
//       const words = text.split(' ')
//       words.forEach((word, wordIndex) => {
//         const wordSpan = document.createElement('span')
//         wordSpan.className = 'section-word'
//         wordSpan.style.display = 'inline-block'
//         wordSpan.style.whiteSpace = 'nowrap'
        
//         word.split('').forEach((char) => {
//           const charSpan = document.createElement('span')
//           charSpan.textContent = char
//           charSpan.className = 'section-char'
//           charSpan.style.display = 'inline-block'
//           wordSpan.appendChild(charSpan)
//           charRefs.current.push(charSpan)
//         })
        
//         headingRef.current.appendChild(wordSpan)
        
//         if (wordIndex < words.length - 1) {
//           headingRef.current.appendChild(document.createTextNode(' '))
//         }
//       })
//     }

//     // Entrance animations
//     const timeline = gsap.timeline()

//     timeline
//       .fromTo(
//         sectionRef.current,
//         { opacity: 0 },
//         { opacity: 1, duration: 0.5, ease: 'power2.out' }
//       )
//       .fromTo(
//         leftColumnRef.current,
//         { x: -100, opacity: 0 },
//         { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
//         '-=0.3'
//       )
//       .fromTo(
//         rightColumnRef.current,
//         { x: 100, opacity: 0 },
//         { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
//         '-=0.8'
//       )
//       .fromTo(
//         '.section-char',
//         { 
//           opacity: 0.1,
//           color: 'rgba(157, 160, 161, 0.3)',
//         },
//         { 
//           opacity: 1,
//           color: 'rgba(157, 160, 161, 0.5)',
//           duration: 0.5,
//           stagger: 0.01,
//           ease: 'power2.out'
//         },
//         '-=0.5'
//       )

//     return () => {
//       timeline.kill()
//     }
//   }, [])

//   // Character fill effect on scroll
//   useEffect(() => {
//     const handleScrollProgress = (e) => {
//       const progress = e.detail.progress
      
//       if (progress > 0.5) {
//         const charProgress = Math.max(0, Math.min(1, (progress - 0.5) / 0.5))
//         const totalChars = charRefs.current.length
//         const visibleChars = Math.floor(charProgress * totalChars)
        
//         charRefs.current.forEach((char, index) => {
//           if (index < visibleChars) {
//             gsap.to(char, {
//               color: '#FFFFFF',
//               opacity: 1,
//               duration: 0.3,
//               ease: 'power2.out'
//             })
//           }
//         })
//       }
//     }

//     window.addEventListener('scrollProgress', handleScrollProgress)

//     return () => {
//       window.removeEventListener('scrollProgress', handleScrollProgress)
//     }
//   }, [])

//   return (
//     <div ref={sectionRef} className="second-section">
//       {/* Left Column - 20% */}
//       <div ref={leftColumnRef} className="second-left-column">
//         <div className="left-top-content">
//           <span className="left-label">Designed</span>
//           <span className="left-gap"></span>
//           <span className="left-small-text">For Excellence</span>
//         </div>
//         <div className="left-bottom-content">
//           <div className="left-image">
//             <img src="/images/object2.webp" alt="Design" />
//           </div>
//         </div>
//       </div>

//       {/* Center Column - 60% */}
//       <div ref={centerColumnRef} className="second-center-column">
//         <h2 ref={headingRef} className="second-heading">
//           Every piece serves as a profound declaration, striking in its design, intentional in its meaning, and undeniably his.
//         </h2>
//       </div>

//       {/* Right Column - 20% */}
//       <div ref={rightColumnRef} className="second-right-column">
//         <p className="right-description">
//           Precision fabrication for architecture, industry, and everything in between. Each creation tells a story of craftsmanship and innovation.
//         </p>
//       </div>
//     </div>
//   )
// }

// export default SecondSection