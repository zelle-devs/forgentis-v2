'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './HeroSection.css'

function HeroSection({ headline }) {
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const [heroImage, setHeroImage] = useState('/optimize/hero_1.png')

  // Mobile ke liye alag image select karo
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    setHeroImage(isMobile ? '/optimize/hero_mob_1.png' : '/optimize/hero_1.png')
  }, [])

  useEffect(() => {
    if (!heroImage) return

    const timeline = gsap.timeline()
    
    // Section smooth fade-in + subtle scale effect
    timeline.fromTo(
      sectionRef.current,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
    )

    // Headline fade in
    if (headlineRef.current) {
      timeline.to(
        headlineRef.current,
        { opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
    }

    return () => timeline.kill()
  }, [heroImage])

  return (
    <div 
      ref={sectionRef} 
      className="hero-section"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero-overlay"></div>

      {headline && (
        <div className="hero-content">
          <h1 ref={headlineRef} className="hero-headline">
            {headline}
          </h1>
        </div>
      )}
    </div>
  )
}

export default HeroSection 


// 'use client'
// import { useEffect, useRef, useState } from 'react'
// import gsap from 'gsap'
// import ImageSplit from '../ImageSplit/ImageSplit'
// import './HeroSection.css'

// function HeroSection({headline}) {
//   const sectionRef = useRef(null)
//   const headlineRef = useRef(null)
//   const subtitleRef = useRef(null)

//   useEffect(() => {
//     const timeline = gsap.timeline()
//     timeline.fromTo(
//       sectionRef.current,
//       { opacity: 0, scale: 1.1 },
//       { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
//     )
//     return () => timeline.kill()
//   }, [])

//   const handleImageAnimationComplete = () => {
//     gsap.to(headlineRef.current, {
//       opacity: 1,
//       duration: 0.8,
//       ease: 'power2.out'
//     })
//     gsap.to(subtitleRef.current, {
//       opacity: 1,
//       duration: 0.8,
//       ease: 'power2.out',
//       delay: 0.2
//     })
//   }

//   return (
//     <div ref={sectionRef} className="hero-section">
//       <ImageSplit onComplete={handleImageAnimationComplete} />
//       <div className="hero-overlay"></div>

//       {headline && <div className="hero-content">
//         <h1 ref={headlineRef} className="hero-headline">
//           {headline}
//         </h1>
//       </div>}
//     </div>
//   )
// }

// export default HeroSection