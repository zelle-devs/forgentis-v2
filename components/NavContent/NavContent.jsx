'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './NavContent.css'

function NavContent() {
  const navRef = useRef(null)
  const logoRef = useRef(null)
  const nameRef = useRef(null)
  const headingRef = useRef(null)
  const titleRef = useRef(null)
  const buttonRef = useRef(null)
  const chaptersRef = useRef(null)
  const scrollProgressRef = useRef(0)

  useEffect(() => {
    // Premium Split Text Animation - Heading
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

    // Premium Split Text Animation - Title
    if (titleRef.current) {
      const text = titleRef.current.textContent
      titleRef.current.innerHTML = ''
      
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
        
        titleRef.current.appendChild(wordSpan)
        
        if (wordIndex < words.length - 1) {
          titleRef.current.appendChild(document.createTextNode(' '))
        }
      })
    }

    // Premium Split Text Animation - Name
    if (nameRef.current) {
      const text = nameRef.current.textContent
      nameRef.current.innerHTML = ''
      
      text.split('').forEach((char) => {
        const charSpan = document.createElement('span')
        charSpan.textContent = char
        charSpan.className = 'name-char'
        charSpan.style.display = 'inline-block'
        nameRef.current.appendChild(charSpan)
      })
    }

    const timeline = gsap.timeline({ delay: 2.5 })

    timeline
      .fromTo(
        navRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      )
      .fromTo(
        logoRef.current,
        { scale: 0, opacity: 0, y: 30, rotate: -180 },
        { scale: 1, opacity: 1, y: 0, rotate: 0, duration: 0.8, ease: 'back.out(2.5)' },
        '-=0.2'
      )
      .fromTo(
        '.nav-name .name-char',
        { y: 50, opacity: 0, scale: 0.5 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2)', stagger: 0.06 },
        '-=0.8'
      )
      .fromTo(
        '.nav-heading .char',
        { y: 80, opacity: 0, scale: 0.3, rotateX: -90 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.5, ease: 'back.out(2)', stagger: 0.04 },
        '-=0.5'
      )
      .fromTo(
        '.nav-title .title-char',
        { y: 40, opacity: 0, scale: 0.3, rotateX: -90 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1, ease: 'back.out(2)', stagger: 0.03 },
        '-=0.8'
      )
      .fromTo(
        buttonRef.current,
        { scale: 0, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(2.5)' },
        '-=0.5'
      )

    // Scroll progress listener
    const handleScrollProgress = (e) => {
      const progress = e.detail.progress
      scrollProgressRef.current = progress
      
      // Logo aur button ko bilkul top par le jao (navbar position)
      if (logoRef.current && buttonRef.current) {
        // Current position (center) se top par move karo
        const moveY = -progress * (window.innerHeight * 0.42) // 42% upar (center se top)
        gsap.to(logoRef.current, { 
          y: moveY, 
          duration: 0.3, 
          ease: 'power2.out' 
        })
        gsap.to(buttonRef.current, { 
          y: moveY, 
          duration: 0.3, 
          ease: 'power2.out' 
        })
      }
      
      // Content tabhi fade hoga jab logo aur button 80% upar pahunch jayen
      if (headingRef.current && titleRef.current && nameRef.current) {
        const fadeStart = 0.8 // 80% scroll par fade shuru
        const fadeProgress = Math.max(0, Math.min(1, (progress - fadeStart) / 0.2))
        
        gsap.to([headingRef.current, titleRef.current, nameRef.current], {
          opacity: 1 - fadeProgress,
          y: -fadeProgress * 80,
          scale: 1 - fadeProgress * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
      
      // Chapters bilkul bottom mein show honge jab content fade ho jaye
      if (chaptersRef.current) {
        const chapterStart = 0.85 // 85% scroll par chapters show
        const chapterProgress = Math.max(0, Math.min(1, (progress - chapterStart) / 0.15))
        
        gsap.to(chaptersRef.current, {
          opacity: chapterProgress,
          y: (1 - chapterProgress) * 50,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    }

    window.addEventListener('scrollProgress', handleScrollProgress)

    return () => {
      timeline.kill()
      window.removeEventListener('scrollProgress', handleScrollProgress)
    }
  }, [])

  return (
    <div ref={navRef} className="nav-content">
      {/* Logo */}
      <div ref={logoRef} className="nav-logo">
        <img src="/images/forgentis_icon.webp" alt="Logo" />
      </div>

      {/* Website Name */}
      <div className="nav-name">
        <h2 ref={nameRef}>Forgentis</h2>
      </div>

      {/* Big Heading */}
      <div className="nav-heading">
        <h1 ref={headingRef}>Can design shape how we feel?</h1>
      </div>

      {/* Title */}
      <div className="nav-title">
        <p ref={titleRef}>Precision fabrication for architecture, industry, and everything in between.</p>
      </div>

      {/* Button */}
      <button ref={buttonRef} className="nav-button">
        Get in Touch
      </button>

      {/* Chapters - Fixed Bottom */}
      <div ref={chaptersRef} className="nav-chapters">
        <span className="chapter active">Chapter 1</span>
        <span className="chapter-divider"></span>
        <span className="chapter">Chapter 2</span>
        <span className="chapter-divider"></span>
        <span className="chapter">Chapter 3</span>
  
      </div>
    </div>
  )
}

export default NavContent

// 'use client'
// import { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import './NavContent.css'

// function NavContent() {
//   const navRef = useRef(null)
//   const logoRef = useRef(null)
//   const nameRef = useRef(null)
//   const headingRef = useRef(null)
//   const titleRef = useRef(null)
//   const buttonRef = useRef(null)
//   const chaptersRef = useRef(null)
//   const scrollProgressRef = useRef(0)

//   useEffect(() => {
//     // Premium Split Text Animation - Heading
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

//     // Premium Split Text Animation - Title
//     if (titleRef.current) {
//       const text = titleRef.current.textContent
//       titleRef.current.innerHTML = ''
      
//       const words = text.split(' ')
//       words.forEach((word, wordIndex) => {
//         const wordSpan = document.createElement('span')
//         wordSpan.className = 'title-word'
//         wordSpan.style.display = 'inline-block'
//         wordSpan.style.whiteSpace = 'nowrap'
        
//         word.split('').forEach((char) => {
//           const charSpan = document.createElement('span')
//           charSpan.textContent = char
//           charSpan.className = 'title-char'
//           charSpan.style.display = 'inline-block'
//           wordSpan.appendChild(charSpan)
//         })
        
//         titleRef.current.appendChild(wordSpan)
        
//         if (wordIndex < words.length - 1) {
//           titleRef.current.appendChild(document.createTextNode(' '))
//         }
//       })
//     }

//     // Premium Split Text Animation - Name
//     if (nameRef.current) {
//       const text = nameRef.current.textContent
//       nameRef.current.innerHTML = ''
      
//       text.split('').forEach((char) => {
//         const charSpan = document.createElement('span')
//         charSpan.textContent = char
//         charSpan.className = 'name-char'
//         charSpan.style.display = 'inline-block'
//         nameRef.current.appendChild(charSpan)
//       })
//     }

//     const timeline = gsap.timeline({ delay: 2.5 })

//     timeline
//       .fromTo(
//         navRef.current,
//         { opacity: 0 },
//         { opacity: 1, duration: 0.5, ease: 'power2.out' }
//       )
//       .fromTo(
//         logoRef.current,
//         { scale: 0, opacity: 0, y: 30, rotate: -180 },
//         { scale: 1, opacity: 1, y: 0, rotate: 0, duration: 0.8, ease: 'back.out(2.5)' },
//         '-=0.2'
//       )
//       .fromTo(
//         '.nav-name .name-char',
//         { y: 50, opacity: 0, scale: 0.5 },
//         { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2)', stagger: 0.06 },
//         '-=0.8'
//       )
//       .fromTo(
//         '.nav-heading .char',
//         { y: 80, opacity: 0, scale: 0.3, rotateX: -90 },
//         { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.5, ease: 'back.out(2)', stagger: 0.04 },
//         '-=0.5'
//       )
//       .fromTo(
//         '.nav-title .title-char',
//         { y: 40, opacity: 0, scale: 0.3, rotateX: -90 },
//         { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1, ease: 'back.out(2)', stagger: 0.03 },
//         '-=0.8'
//       )
//       .fromTo(
//         buttonRef.current,
//         { scale: 0, opacity: 0, y: 30 },
//         { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(2.5)' },
//         '-=0.5'
//       )

//     // Scroll progress listener
//     const handleScrollProgress = (e) => {
//       const progress = e.detail.progress
//       scrollProgressRef.current = progress
      
//       // Logo aur button ko upar move karo (smooth)
//       if (logoRef.current && buttonRef.current) {
//         const moveY = -progress * (window.innerHeight * 0.35)
//         gsap.to(logoRef.current, { 
//           y: moveY, 
//           duration: 0.3, 
//           ease: 'power2.out' 
//         })
//         gsap.to(buttonRef.current, { 
//           y: moveY, 
//           duration: 0.3, 
//           ease: 'power2.out' 
//         })
//       }
      
//       // Heading, title, name fade out when progress > 0.3
//       if (headingRef.current && titleRef.current && nameRef.current) {
//         const fadeProgress = Math.max(0, Math.min(1, (progress - 0.3) / 0.7))
//         gsap.to([headingRef.current, titleRef.current, nameRef.current], {
//           opacity: 1 - fadeProgress,
//           y: -fadeProgress * 50,
//           scale: 1 - fadeProgress * 0.2,
//           duration: 0.3,
//           ease: 'power2.out'
//         })
//       }
      
//       // Chapters show when progress > 0.5
//       if (chaptersRef.current) {
//         const chapterProgress = Math.max(0, Math.min(1, (progress - 0.5) / 0.5))
//         gsap.to(chaptersRef.current, {
//           opacity: chapterProgress,
//           y: (1 - chapterProgress) * 30,
//           duration: 0.3,
//           ease: 'power2.out'
//         })
//       }
//     }

//     window.addEventListener('scrollProgress', handleScrollProgress)

//     return () => {
//       timeline.kill()
//       window.removeEventListener('scrollProgress', handleScrollProgress)
//     }
//   }, [])

//   return (
//     <div ref={navRef} className="nav-content">
//       {/* Logo */}
//       <div ref={logoRef} className="nav-logo">
//         <img src="/images/forgentis_icon.webp" alt="Logo" />
//       </div>

//       {/* Website Name */}
//       <div className="nav-name">
//         <h2 ref={nameRef}>Forgentis</h2>
//       </div>

//       {/* Big Heading */}
//       <div className="nav-heading">
//         <h1 ref={headingRef}>Can design shape how we feel?</h1>
//       </div>

//       {/* Title */}
//       <div className="nav-title">
//         <p ref={titleRef}>Precision fabrication for architecture, industry, and everything in between.</p>
//       </div>

//       {/* Button */}
//       <button ref={buttonRef} className="nav-button">
//         Get in Touch
//       </button>

//       {/* Chapters - Bottom */}
//       <div ref={chaptersRef} className="nav-chapters">
//         <span className="chapter active">Chapter 1</span>
//         <span className="chapter-divider"></span>
//         <span className="chapter">Chapter 2</span>
//         <span className="chapter-divider"></span>
//         <span className="chapter">Chapter 3</span>
//       </div>
//     </div>
//   )
// }

// export default NavContent


// ******************************************



// 'use client'
// import { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import './NavContent.css'

// function NavContent() {
//   const navRef = useRef(null)
//   const logoRef = useRef(null)
//   const nameRef = useRef(null)
//   const headingRef = useRef(null)
//   const titleRef = useRef(null)
//   const buttonRef = useRef(null)

//   useEffect(() => {
//     // Premium Split Text Animation - Heading
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

//     // Premium Split Text Animation - Title
//     if (titleRef.current) {
//       const text = titleRef.current.textContent
//       titleRef.current.innerHTML = ''
      
//       const words = text.split(' ')
//       words.forEach((word, wordIndex) => {
//         const wordSpan = document.createElement('span')
//         wordSpan.className = 'title-word'
//         wordSpan.style.display = 'inline-block'
//         wordSpan.style.whiteSpace = 'nowrap'
        
//         word.split('').forEach((char) => {
//           const charSpan = document.createElement('span')
//           charSpan.textContent = char
//           charSpan.className = 'title-char'
//           charSpan.style.display = 'inline-block'
//           wordSpan.appendChild(charSpan)
//         })
        
//         titleRef.current.appendChild(wordSpan)
        
//         if (wordIndex < words.length - 1) {
//           titleRef.current.appendChild(document.createTextNode(' '))
//         }
//       })
//     }

//     // Premium Split Text Animation - Name
//     if (nameRef.current) {
//       const text = nameRef.current.textContent
//       nameRef.current.innerHTML = ''
      
//       text.split('').forEach((char) => {
//         const charSpan = document.createElement('span')
//         charSpan.textContent = char
//         charSpan.className = 'name-char'
//         charSpan.style.display = 'inline-block'
//         nameRef.current.appendChild(charSpan)
//       })
//     }

//     const timeline = gsap.timeline({ delay: 2.5 })

//     timeline
//       // Container fade in
//       .fromTo(
//         navRef.current,
//         { opacity: 0 },
//         { opacity: 1, duration: 0.5, ease: 'power2.out' }
//       )
//       // Logo - Button jaisi premium animation (scale + rotate + glow)
//       .fromTo(
//         logoRef.current,
//         { 
//           scale: 0,
//           opacity: 0,
//           y: 30,
//           rotate: -180,
//         },
//         { 
//           scale: 1,
//           opacity: 1,
//           y: 0,
//           rotate: 0,
//           duration: 0.8,
//           ease: 'back.out(2.5)'
//         },
//         '-=0.2'
//       )
//       // Logo glow effect
//       .fromTo(
//         logoRef.current,
//         { boxShadow: '0 0 0px rgba(2, 112, 234, 0)' },
//         { 
//           // boxShadow: '0 0 40px rgba(2, 112, 234, 0.6)',
//           duration: 1.5,
//           ease: 'power2.out'
//         },
//         '-=0.3'
//       )
//       // Website Name - Character by character animation
//       .fromTo(
//         '.nav-name .name-char',
//         { 
//           y: 50,
//           opacity: 0,
//           scale: 0.5,
//         },
//         { 
//           y: 0,
//           opacity: 1,
//           scale: 1,
//           duration: 0.8,
//           ease: 'back.out(2)',
//           stagger: 0.06
//         },
//         '-=0.8'
//       )
//       // Heading - Premium word by word, char by char
//       .fromTo(
//         '.nav-heading .char',
//         { 
//           y: 80,
//           opacity: 0,
//           scale: 0.3,
//           rotateX: -90,
//         },
//         { 
//           y: 0,
//           opacity: 1,
//           scale: 1,
//           rotateX: 0,
//           duration: 1.5,
//           ease: 'back.out(2)',
//           stagger: 0.04
//         },
//         '-=0.5'
//       )
//       // Title - Word by word animation
//       .fromTo(
//         '.nav-title .title-char',
//         { 
//           y: 40,
//           opacity: 0,
//           scale: 0.3,
//           rotateX: -90,
//         },
//         { 
//           y: 0,
//           opacity: 1,
//           scale: 1,
//           rotateX: 0,
//           duration: 1,
//           ease: 'back.out(2)',
//           stagger: 0.03
//         },
//         '-=0.8'
//       )
//       // Button - Premium scale + glow
//       .fromTo(
//         buttonRef.current,
//         { 
//           scale: 0,
//           opacity: 0,
//           y: 30,
//         },
//         { 
//           scale: 1,
//           opacity: 1,
//           y: 0,
//           duration: 0.8,
//           ease: 'back.out(2.5)'
//         },
//         '-=0.5'
//       )
//       // Button glow effect
//       .fromTo(
//         buttonRef.current,
//         { boxShadow: '0 0 0px rgba(2, 112, 234, 0)' },
//         { 
//           boxShadow: '0 0 40px rgba(2, 112, 234, 0.6)',
//           duration: 1.5,
//           ease: 'power2.out'
//         },
//         '-=0.3'
//       )

//     return () => {
//       timeline.kill()
//     }
//   }, [])

//   return (
//     <div ref={navRef} className="nav-content">
//       {/* Logo */}
//       <div ref={logoRef} className="nav-logo">
//         <img src="/images/forgentis_icon.webp" alt="Logo" />
//       </div>

//       {/* Website Name */}
//       <div className="nav-name">
//         <h2 ref={nameRef}>Forgentis</h2>
//       </div>

//       {/* Divider */}
//       {/* <div className="nav-divider"></div> */}

//       {/* Big Heading - Large size */}
//       <div className="nav-heading">
//         <h1 ref={headingRef}>Can design shape how we feel?</h1>
//       </div>

//       {/* Title */}
//       <div className="nav-title">
//         <p ref={titleRef}>Precision fabrication for architecture, industry, and everything in between.</p>
//       </div>

//       {/* Button */}
//       <button ref={buttonRef} className="nav-button">
//         Get in Touch
//       </button>
//     </div>
//   )
// }

// export default NavContent
