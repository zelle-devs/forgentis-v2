'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './HeroSection.css'

function HeroSection({
  eyebrow = '',
  headline = '',             // Normal text part
  highlightedHeadline = '',  // Colored/Highlighted text part
  subtitle = '',

  titleColor = '#fff',
  titleWeight = 500,

  highlightColor = '#337CC7',
  highlightWeight = 700,

  eyebrowColor = '',
  subtitleColor = '',
}) {
  const sectionRef = useRef(null)
  const eyebrowRef = useRef(null)
  const headlineRef = useRef(null)
  const subtitleRef = useRef(null)

  const [heroImage, setHeroImage] = useState('/optimize/hero_1.png')

  useEffect(() => {
    const updateImage = () => {
      setHeroImage(
        window.innerWidth <= 768
          ? '/optimize/hero_mob_1.jpg'
          : '/optimize/hero_1.png'
      )
    }

    updateImage()
    window.addEventListener('resize', updateImage)

    return () => window.removeEventListener('resize', updateImage)
  }, [])

  useEffect(() => {
    if (!heroImage) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.fromTo(
        sectionRef.current,
        { opacity: 0, scale: 1.05 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
        }
      )

      const elements = [
        eyebrowRef.current,
        headlineRef.current,
        subtitleRef.current,
      ].filter(Boolean)

      if (elements.length) {
        tl.fromTo(
          elements,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
          },
          '-=0.6'
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [heroImage])

  return (
    <div
      ref={sectionRef}
      className="hero-section"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero-overlay" />

      <div className="hero-content">

        {/* EYEBROW */}
        {eyebrow && (
          <div
            ref={eyebrowRef}
            className="hero-eyebrow"
            style={{ color: eyebrowColor || undefined }}
          >
            <span className="hero-eyebrow-line" />
            <span>{eyebrow}</span>
          </div>
        )}

        {/* HEADLINE */}
        {(headline || highlightedHeadline) && (
          <h1
            ref={headlineRef}
            className="hero-headline"
            style={{
              color: titleColor,
              fontWeight: titleWeight,
            }}
          >
            {headline && (
              <span className="hero-normal-word">{headline}</span>
            )}
            {headline && highlightedHeadline ? ' ' : ''}
            {highlightedHeadline && (
              <span
                className="hero-highlight-word"
                style={{
                  color: highlightColor,
                  fontWeight: highlightWeight,
                }}
              >
                {highlightedHeadline}
              </span>
            )}
          </h1>
        )}

        {/* SUBTITLE */}
        {subtitle && (
          <p
            ref={subtitleRef}
            className="hero-subtitle"
            style={{ color: subtitleColor || undefined }}
          >
            {subtitle}
          </p>
        )}

      </div>
    </div>
  )
}

export default HeroSection





// 'use client'
// import { useEffect, useRef, useState } from 'react'
// import gsap from 'gsap'
// import './HeroSection.css'

// function HeroSection({ headline }) {
//   const sectionRef = useRef(null)
//   const headlineRef = useRef(null)
//   const [heroImage, setHeroImage] = useState('/optimize/hero_1.png')

//   // Mobile ke liye alag image select karo
//   useEffect(() => {
//     const isMobile = window.innerWidth <= 768
//     setHeroImage(isMobile ? '/optimize/hero_mob_1.jpg' : '/optimize/hero_1.png')
//   }, [])

//   useEffect(() => {
//     if (!heroImage) return

//     const timeline = gsap.timeline()
    
//     // Section smooth fade-in + subtle scale effect
//     timeline.fromTo(
//       sectionRef.current,
//       { opacity: 0, scale: 1.05 },
//       { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
//     )

//     // Headline fade in
//     if (headlineRef.current) {
//       timeline.to(
//         headlineRef.current,
//         { opacity: 1, duration: 0.8, ease: 'power2.out' },
//         '-=0.6'
//       )
//     }

//     return () => timeline.kill()
//   }, [heroImage])

//   return (
//     <div 
//       ref={sectionRef} 
//       className="hero-section"
//       style={{ backgroundImage: `url(${heroImage})` }}
//     >
//       <div className="hero-overlay"></div>

//       {headline && (
//         <div className="hero-content">
//           <h1 ref={headlineRef} className="hero-headline">
//             {headline}
//           </h1>
//         </div>
//       )}
//     </div>
//   )
// }

// export default HeroSection 
