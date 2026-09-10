'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './NavContent.css'

function NavContent() {
  const navRef = useRef(null)
  const logoRef = useRef(null)
  const headingRef = useRef(null)
  const titleRef = useRef(null)
  const buttonRef = useRef(null)
  const chaptersRef = useRef(null)
  const progressLineRef = useRef(null)
  const hamburgerRef = useRef(null)
  const scrollProgressRef = useRef(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (headingRef.current) {
      const text = headingRef.current.textContent
      headingRef.current.innerHTML = ''

      const words = text.split(' ')
      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span')
        wordSpan.className = 'word'
        wordSpan.style.display = 'inline-block'
        wordSpan.style.whiteSpace = 'nowrap'

        word.split('').forEach((char) => {
          const charSpan = document.createElement('span')
          charSpan.textContent = char
          charSpan.className = 'char'
          charSpan.style.display = 'inline-block'
          wordSpan.appendChild(charSpan)
        })

        headingRef.current.appendChild(wordSpan)

        if (wordIndex < words.length - 1) {
          headingRef.current.appendChild(document.createTextNode(' '))
        }
      })
    }

    if (titleRef.current) {
      const listItems = titleRef.current.querySelectorAll('li')
      listItems.forEach((item) => {
        const text = item.textContent
        item.innerHTML = ''

        const words = text.split(' ')
        words.forEach((word, wordIndex) => {
          const wordSpan = document.createElement('span')
          wordSpan.className = 'title-word'
          wordSpan.style.display = 'inline-block'
          wordSpan.style.whiteSpace = 'nowrap'

          word.split('').forEach((char) => {
            const charSpan = document.createElement('span')
            charSpan.textContent = char
            charSpan.className = 'title-char'
            charSpan.style.display = 'inline-block'
            wordSpan.appendChild(charSpan)
          })

          item.appendChild(wordSpan)

          if (wordIndex < words.length - 1) {
            item.appendChild(document.createTextNode(' '))
          }
        })
      })
    }

    const timeline = gsap.timeline({
      delay: 4.5
    })

    timeline
      .fromTo(logoRef.current,
        { scale: 0, opacity: 0, y: 30, rotate: -180 },
        { scale: 1, opacity: 1, y: 0, rotate: 0, duration: 0.8, ease: 'back.out(2.5)' }
      )
      .fromTo('.nav-heading .char',
        { y: 80, opacity: 0, scale: 0.3, rotateX: -90 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.5, ease: 'back.out(2)', stagger: 0.04 },
        '+=0.05'
      )
      .fromTo('.nav-title .title-char',
        { y: 40, opacity: 0, scale: 0.3, rotateX: -90 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1, ease: 'back.out(2)', stagger: 0.025 },
        '+=0.15'
      )
      .fromTo(buttonRef.current,
        { scale: 0, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(2.5)' },
        '+=0.15'
      )

    return () => timeline.kill()
  }, [])

  useEffect(() => {
    const handleScrollProgress = (e) => {
      const progress = e.detail.progress
      scrollProgressRef.current = progress

      if (logoRef.current && buttonRef.current) {
        const moveY = -progress * (window.innerHeight * 0.42)
        gsap.to(logoRef.current, { y: moveY, duration: 0.1, ease: 'none' })
        gsap.to(buttonRef.current, { y: moveY, duration: 0.1, ease: 'none' })
        if (hamburgerRef.current) {
          gsap.to(hamburgerRef.current, { y: moveY, duration: 0.1, ease: 'none' })
        }
      }

      if (headingRef.current && titleRef.current) {
        const fadeStart = 0.7
        const fadeProgress = Math.max(0, Math.min(1, (progress - fadeStart) / 0.3))
        gsap.to([headingRef.current, titleRef.current], {
          opacity: 1 - fadeProgress,
          y: -fadeProgress * 80,
          scale: 1 - fadeProgress * 0.3,
          duration: 0.1,
          ease: 'none'
        })
      }

      if (progress >= 0.8 && hamburgerRef.current) {
        gsap.to(hamburgerRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: 'power2.out',
          pointerEvents: 'auto'
        })
      } else if (progress < 0.8 && hamburgerRef.current) {
        gsap.to(hamburgerRef.current, {
          opacity: 0,
          x: 20,
          duration: 0.3,
          ease: 'power2.out',
          pointerEvents: 'none'
        })
      }

      if (chaptersRef.current) {
        const chapterStart = 0.7
        const chapterProgress = Math.max(0, Math.min(1, (progress - chapterStart) / 0.3))
        gsap.to(chaptersRef.current, {
          opacity: chapterProgress,
          y: (1 - chapterProgress) * 50,
          duration: 0.1,
          ease: 'none'
        })
      }

      if (progressLineRef.current) {
        gsap.to(progressLineRef.current, {
          scaleX: progress,
          duration: 0.1,
          ease: 'none'
        })
      }
    }

    window.addEventListener('scrollProgress', handleScrollProgress)
    return () => window.removeEventListener('scrollProgress', handleScrollProgress)
  }, [])

  const toggleMenu = () => {
    if (menuOpen) {
      gsap.to('.nav-sidebar', {
        x: '100%',
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => setMenuOpen(false)
      })
    } else {
      setMenuOpen(true)
      gsap.fromTo('.nav-sidebar',
        { x: '100%', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      )
    }
  }

  const menuItems = [
    'Home',
    'About',
    'Capabilities',
    'Industries',
    'Quality',
    'Facilities'
  ]

  return (
    <>
      <div ref={navRef} className="nav-content">
        <div ref={logoRef} className="nav-logo">
          <img src="/images/forgentis_icon.webp" alt="Logo" />
        </div>

        <div className="nav-heading">
          <h1 ref={headingRef}>
            we shape what builds
            {/* We <br />
            Shape <br />
            What <br />
            Builds <br /> */}
          </h1>
        </div>

        <div ref={titleRef} className="nav-title">
          <li>25,000+ SQ. FT. FACILITY</li>
          <li>40+ MACHINES</li>
          <li>10-TON LIFTING CAPACITY</li>
          <li>END-TO-END FABRICATION</li>
        </div>

        <div className="nav-right-group">
          <button ref={buttonRef} className="nav-button">
            START A PROJECT
          </button>
    
          <button
            ref={hamburgerRef}
            className={`nav-hamburger ${menuOpen ? 'active' : ''}`}
            style={{ opacity: 0, pointerEvents: 'none', x: 20 }}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className="nav-footer-wrapper">
          <div
            ref={chaptersRef}
            className="nav-chapters"
            style={{ opacity: 0, y: 50 }}
          >
            <span className="chapter active">Chapter I</span>
            <span className="chapter-divider"></span>
            <span className="chapter">Chapter II</span>
            <span className="chapter-divider"></span>
            <span className="chapter">Chapter III</span>
            <span className="chapter-divider"></span>
            <span className="chapter">Chapter IV</span>
            <span className="chapter-divider"></span>
            <span className="chapter">Chapter V</span>
          </div>

          <div className="progress-line-container">
            <div ref={progressLineRef} className="progress-line"></div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-sidebar">
          <button className="sidebar-close" onClick={toggleMenu}>×</button>
          
          <nav className="sidebar-nav">
            {menuItems.map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="sidebar-link"
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu()
                }}
              >
                <span className="sidebar-number">0{index + 1}</span>
                {item}
              </a>
            ))}
          </nav>

          <div className="sidebar-footer">
            <p>© 2024 Forgentis</p>
            <div className="sidebar-socials">
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
              <a href="#">Twitter</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NavContent

// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import gsap from 'gsap'
// import './NavContent.css'

// function NavContent() {
//   const navRef = useRef(null)
//   const logoRef = useRef(null)
//   const headingRef = useRef(null)
//   const titleRef = useRef(null)
//   const buttonRef = useRef(null)
//   const chaptersRef = useRef(null)
//   const progressLineRef = useRef(null)
//   const hamburgerRef = useRef(null)
//   const scrollProgressRef = useRef(0)
//   const [menuOpen, setMenuOpen] = useState(false)

//   useEffect(() => {
//     // ==========================================
//     // SPLIT HEADING TEXT
//     // ==========================================
//     if (headingRef.current) {
//       const text = headingRef.current.textContent
//       headingRef.current.innerHTML = ''

//       const words = text.split(' ')
//       words.forEach((word, wordIndex) => {
//         const wordSpan = document.createElement('span')
//         wordSpan.className = 'word'
//         wordSpan.style.display = 'inline-block'
//         wordSpan.style.whiteSpace = 'nowrap'

//         word.split('').forEach((char) => {
//           const charSpan = document.createElement('span')
//           charSpan.textContent = char
//           charSpan.className = 'char'
//           charSpan.style.display = 'inline-block'
//           wordSpan.appendChild(charSpan)
//         })

//         headingRef.current.appendChild(wordSpan)

//         if (wordIndex < words.length - 1) {
//           headingRef.current.appendChild(document.createTextNode(' '))
//         }
//       })
//     }

//     // ==========================================
//     // SPLIT ALL LIST ITEMS
//     // ==========================================
//     if (titleRef.current) {
//       const listItems = titleRef.current.querySelectorAll('li')
//       listItems.forEach((item) => {
//         const text = item.textContent
//         item.innerHTML = ''

//         const words = text.split(' ')
//         words.forEach((word, wordIndex) => {
//           const wordSpan = document.createElement('span')
//           wordSpan.className = 'title-word'
//           wordSpan.style.display = 'inline-block'
//           wordSpan.style.whiteSpace = 'nowrap'

//           word.split('').forEach((char) => {
//             const charSpan = document.createElement('span')
//             charSpan.textContent = char
//             charSpan.className = 'title-char'
//             charSpan.style.display = 'inline-block'
//             wordSpan.appendChild(charSpan)
//           })

//           item.appendChild(wordSpan)

//           if (wordIndex < words.length - 1) {
//             item.appendChild(document.createTextNode(' '))
//           }
//         })
//       })
//     }

//     // ==========================================
//     // ENTRANCE TIMELINE
//     // ==========================================
//     const timeline = gsap.timeline({
//       delay: 4.5
//     })

//     timeline
//       .fromTo(logoRef.current,
//         { scale: 0, opacity: 0, y: 30, rotate: -180 },
//         { scale: 1, opacity: 1, y: 0, rotate: 0, duration: 0.8, ease: 'back.out(2.5)' }
//       )
//       .fromTo('.nav-heading .char',
//         { y: 80, opacity: 0, scale: 0.3, rotateX: -90 },
//         { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.5, ease: 'back.out(2)', stagger: 0.04 },
//         '+=0.05'
//       )
//       .fromTo('.nav-title .title-char',
//         { y: 40, opacity: 0, scale: 0.3, rotateX: -90 },
//         { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1, ease: 'back.out(2)', stagger: 0.025 },
//         '+=0.15'
//       )
//       .fromTo(buttonRef.current,
//         { scale: 0, opacity: 0, y: 30 },
//         { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(2.5)' },
//         '+=0.15'
//       )

//     return () => timeline.kill()
//   }, [])

//   // ==========================================
//   // SCROLL PROGRESS HANDLER
//   // ==========================================
//   useEffect(() => {
//     const handleScrollProgress = (e) => {
//       const progress = e.detail.progress
//       scrollProgressRef.current = progress

//       // LOGO + BUTTON MOVE UP (Sticky position)
//       if (logoRef.current && buttonRef.current) {
//         const moveY = -progress * (window.innerHeight * 0.42)
//         gsap.to(logoRef.current, { y: moveY, duration: 0.1, ease: 'none' })
//         gsap.to(buttonRef.current, { y: moveY, duration: 0.1, ease: 'none' })
//       }

//       // CONTENT DISAPPEAR (heading + titles)
//       if (headingRef.current && titleRef.current) {
//         const fadeStart = 0.6
//         const fadeProgress = Math.max(0, Math.min(1, (progress - fadeStart) / 0.3))
//         gsap.to([headingRef.current, titleRef.current], {
//           opacity: 1 - fadeProgress,
//           y: -fadeProgress * 80,
//           scale: 1 - fadeProgress * 0.3,
//           duration: 0.1,
//           ease: 'none'
//         })
//       }

//       // HAMBURGER SHOW (jab progress >= 0.8)
//       if (progress >= 0.8 && hamburgerRef.current) {
//         gsap.to(hamburgerRef.current, {
//           opacity: 1,
//           x: 0,
//           duration: 0.3,
//           ease: 'power2.out',
//           pointerEvents: 'auto'
//         })
//       } else if (progress < 0.8 && hamburgerRef.current) {
//         gsap.to(hamburgerRef.current, {
//           opacity: 0,
//           x: 20,
//           duration: 0.3,
//           ease: 'power2.out',
//           pointerEvents: 'none'
//         })
//       }

//       // CHAPTERS SHOW (Footer)
//       if (chaptersRef.current) {
//         const chapterStart = 0.7
//         const chapterProgress = Math.max(0, Math.min(1, (progress - chapterStart) / 0.3))
//         gsap.to(chaptersRef.current, {
//           opacity: chapterProgress,
//           y: (1 - chapterProgress) * 50,
//           duration: 0.1,
//           ease: 'none'
//         })
//       }

//       // PROGRESS LINE
//       if (progressLineRef.current) {
//         gsap.to(progressLineRef.current, {
//           scaleX: progress,
//           duration: 0.1,
//           ease: 'none'
//         })
//       }
//     }

//     window.addEventListener('scrollProgress', handleScrollProgress)
//     return () => window.removeEventListener('scrollProgress', handleScrollProgress)
//   }, [])

//   // ==========================================
//   // SIDEBAR MENU TOGGLE (Right side se open)
//   // ==========================================
//   const toggleMenu = () => {
//     if (menuOpen) {
//       gsap.to('.nav-sidebar', {
//         x: '100%',
//         opacity: 0,
//         duration: 0.4,
//         ease: 'power3.in',
//         onComplete: () => setMenuOpen(false)
//       })
//     } else {
//       setMenuOpen(true)
//       gsap.fromTo('.nav-sidebar',
//         { x: '100%', opacity: 0 },
//         { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
//       )
//     }
//   }

//   const menuItems = [
//     'Home',
//     'About',
//     'Capabilities',
//     'Industries',
//     'Quality',
//     'Facilities'
//   ]

//   return (
//     <>
//       <div ref={navRef} className="nav-content">
//         {/* LOGO */}
//         <div ref={logoRef} className="nav-logo">
//           <img src="/images/forgentis_icon.webp" alt="Logo" />
//         </div>

//         {/* MAIN HEADING */}
//         <div className="nav-heading">
//           <h1 ref={headingRef}>
//             PRECISION <br />
//             FABRICATION.<br />
//             BUILT <br />
//             FOR <br />
//             WHAT'S <br />
//             NEXT
//           </h1>
//         </div>

//         {/* FACILITY LIST */}
//         <div ref={titleRef} className="nav-title">
//           <li>25,000+ SQ. FT. FACILITY</li>
//           <li>40+ MACHINES</li>
//           <li>10-TON LIFTING CAPACITY</li>
//           <li>END-TO-END FABRICATION</li>
//         </div>

//         {/* BUTTON + HAMBURGER (sath me) */}
//         <div className="nav-right-group">
//           <button ref={buttonRef} className="nav-button">
//             GET IN TOUCH
//           </button>
    
//           <button
//             ref={hamburgerRef}
//             className={`nav-hamburger ${menuOpen ? 'active' : ''}`}
//             style={{ opacity: 0, pointerEvents: 'none', x: 20 }}
//             onClick={toggleMenu}
//           >
            
//             <span></span>
//             <span></span>
//             <span></span>
//           </button>
 
//         </div>

//         {/* FOOTER / CHAPTERS (full width) */}
//         <div className="nav-footer-wrapper">
//           <div
//             ref={chaptersRef}
//             className="nav-chapters"
//             style={{ opacity: 0, y: 50 }}
//           >
//             <span className="chapter active">Chapter I</span>
//             <span className="chapter-divider"></span>
//             <span className="chapter">Chapter II</span>
//             <span className="chapter-divider"></span>
//             <span className="chapter">Chapter III</span>
//             <span className="chapter-divider"></span>
//             <span className="chapter">Chapter IV</span>
//             <span className="chapter-divider"></span>
//             <span className="chapter">Chapter V</span>
//           </div>

//           <div className="progress-line-container">
//             <div ref={progressLineRef} className="progress-line"></div>
//           </div>
//         </div>
//       </div>

//       {/* SIDEBAR MENU (Right side) */}
//       {menuOpen && (
//         <div className="nav-sidebar">
//           <button className="sidebar-close" onClick={toggleMenu}>×</button>
          
//           <nav className="sidebar-nav">
//             {menuItems.map((item, index) => (
//               <a
//                 key={item}
//                 href={`#${item.toLowerCase()}`}
//                 className="sidebar-link"
//                 onClick={(e) => {
//                   e.preventDefault()
//                   toggleMenu()
//                 }}
//               >
//                 <span className="sidebar-number">0{index + 1}</span>
//                 {item}
//               </a>
//             ))}
//           </nav>

//           <div className="sidebar-footer">
//             <p>© 2024 Forgentis</p>
//             <div className="sidebar-socials">
//               <a href="#">Instagram</a>
//               <a href="#">LinkedIn</a>
//               <a href="#">Twitter</a>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export default NavContent