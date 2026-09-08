// 'use client'
// import { useState, useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
// import HeroSection from '@/components/HeroSection/HeroSection'
// import SecondSection from '@/components/SecondSection/SecondSection'
// import ThirdSection from '@/components/ThirdSection/ThirdSection'
// import CursorTrail from '@/components/CursorTrail/CursorTrail'

// export default function Home() {
//   const [loading, setLoading] = useState(true)
//   const [showHero, setShowHero] = useState(false)
//   const [showSecondSection, setShowSecondSection] = useState(false)
//   const [showThirdSection, setShowThirdSection] = useState(false)
//   const scrollProgressRef = useRef(0)
//   const heroRef = useRef(null)
//   const secondSectionRef = useRef(null)
//   const thirdSectionRef = useRef(null)
//   const isTransitioning = useRef(false)

//   const handleLoadingComplete = () => {
//     setLoading(false)
//     setShowHero(true)
//   }

//   // Scroll handling
//   useEffect(() => {
//     const handleWheel = (e) => {
//       e.preventDefault()
//       if (loading || isTransitioning.current) return

//       if (!showSecondSection && !showThirdSection) {
//         // Hero section mein
//         if (e.deltaY > 0) {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
          
//           if (scrollProgressRef.current >= 1) {
//             isTransitioning.current = true
//             setShowSecondSection(true)
            
//             gsap.to(heroRef.current, {
//               opacity: 0,
//               scale: 0.95,
//               duration: 0.8,
//               ease: 'power2.inOut',
//               onComplete: () => {
//                 gsap.set(heroRef.current, { display: 'none' })
//                 isTransitioning.current = false
//                 scrollProgressRef.current = 0
                
//                 const resetEvent = new CustomEvent('scrollProgress', { 
//                   detail: { progress: 0 } 
//                 })
//                 window.dispatchEvent(resetEvent)
//               }
//             })
//           }
//         } else {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.1)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
//         }
//       } else if (showSecondSection && !showThirdSection) {
//         // Second section mein - yahan scroll se text fill hoga
//         if (e.deltaY > 0) {
//           // Scroll down - text fill hota hai
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
          
//           // Agar progress 1 ho jaye toh third section
//           if (scrollProgressRef.current >= 1) {
//             isTransitioning.current = true
//             setShowThirdSection(true)
            
//             gsap.to(secondSectionRef.current, {
//               opacity: 0,
//               duration: 0.8,
//               ease: 'power2.inOut',
//               onComplete: () => {
//                 gsap.set(secondSectionRef.current, { display: 'none' })
//                 isTransitioning.current = false
//                 scrollProgressRef.current = 0
                
//                 const resetEvent = new CustomEvent('scrollProgress', { 
//                   detail: { progress: 0 } 
//                 })
//                 window.dispatchEvent(resetEvent)
//               }
//             })
//           }
//         } else if (e.deltaY < 0) {
//           // Scroll up - text dull hota hai
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
          
//           // Agar bilkul upar pahunch gaye toh wapas hero section
//           if (scrollProgressRef.current <= 0) {
//             isTransitioning.current = true
//             setShowSecondSection(false)
            
//             gsap.set(heroRef.current, { display: 'block' })
//             gsap.to(heroRef.current, {
//               opacity: 1,
//               scale: 1,
//               duration: 0.8,
//               ease: 'power2.inOut',
//               onComplete: () => {
//                 isTransitioning.current = false
//                 scrollProgressRef.current = 1
//               }
//             })
//           }
//         }
//       } else if (showThirdSection) {
//         // Third section mein - horizontal slider
//         if (e.deltaY > 0) {
//           // Scroll down - horizontal scroll right
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
//         } else if (e.deltaY < 0) {
//           // Scroll up - horizontal scroll left
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
          
//           // Agar bilkul upar pahunch gaye toh wapas second section
//           if (scrollProgressRef.current <= 0) {
//             isTransitioning.current = true
//             setShowThirdSection(false)
            
//             gsap.set(secondSectionRef.current, { display: 'block' })
//             gsap.to(secondSectionRef.current, {
//               opacity: 1,
//               duration: 0.8,
//               ease: 'power2.inOut',
//               onComplete: () => {
//                 isTransitioning.current = false
//                 scrollProgressRef.current = 1
//               }
//             })
//           }
//         }
//       }
//     }

//     window.addEventListener('wheel', handleWheel, { passive: false })
//     return () => window.removeEventListener('wheel', handleWheel)
//   }, [showSecondSection, showThirdSection, loading])

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (loading || isTransitioning.current) return
      
//       if (!showSecondSection && !showThirdSection) {
//         // Hero section
//         if (e.key === 'ArrowDown') {
//           e.preventDefault()
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
          
//           if (scrollProgressRef.current >= 1) {
//             isTransitioning.current = true
//             setShowSecondSection(true)
            
//             gsap.to(heroRef.current, {
//               opacity: 0,
//               scale: 0.95,
//               duration: 0.8,
//               ease: 'power2.inOut',
//               onComplete: () => {
//                 gsap.set(heroRef.current, { display: 'none' })
//                 isTransitioning.current = false
//                 scrollProgressRef.current = 0
                
//                 const resetEvent = new CustomEvent('scrollProgress', { 
//                   detail: { progress: 0 } 
//                 })
//                 window.dispatchEvent(resetEvent)
//               }
//             })
//           }
//         }
//       } else if (showSecondSection && !showThirdSection) {
//         // Second section
//         if (e.key === 'ArrowDown') {
//           e.preventDefault()
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
          
//           if (scrollProgressRef.current >= 1) {
//             isTransitioning.current = true
//             setShowThirdSection(true)
            
//             gsap.to(secondSectionRef.current, {
//               opacity: 0,
//               duration: 0.8,
//               ease: 'power2.inOut',
//               onComplete: () => {
//                 gsap.set(secondSectionRef.current, { display: 'none' })
//                 isTransitioning.current = false
//                 scrollProgressRef.current = 0
                
//                 const resetEvent = new CustomEvent('scrollProgress', { 
//                   detail: { progress: 0 } 
//                 })
//                 window.dispatchEvent(resetEvent)
//               }
//             })
//           }
//         } else if (e.key === 'ArrowUp') {
//           e.preventDefault()
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
          
//           if (scrollProgressRef.current <= 0) {
//             isTransitioning.current = true
//             setShowSecondSection(false)
            
//             gsap.set(heroRef.current, { display: 'block' })
//             gsap.to(heroRef.current, {
//               opacity: 1,
//               scale: 1,
//               duration: 0.8,
//               ease: 'power2.inOut',
//               onComplete: () => {
//                 isTransitioning.current = false
//                 scrollProgressRef.current = 1
//               }
//             })
//           }
//         }
//       } else if (showThirdSection) {
//         // Third section
//         if (e.key === 'ArrowDown') {
//           e.preventDefault()
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
//         } else if (e.key === 'ArrowUp') {
//           e.preventDefault()
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
          
//           if (scrollProgressRef.current <= 0) {
//             isTransitioning.current = true
//             setShowThirdSection(false)
            
//             gsap.set(secondSectionRef.current, { display: 'block' })
//             gsap.to(secondSectionRef.current, {
//               opacity: 1,
//               duration: 0.8,
//               ease: 'power2.inOut',
//               onComplete: () => {
//                 isTransitioning.current = false
//                 scrollProgressRef.current = 1
//               }
//             })
//           }
//         }
//       }
//     }

//     window.addEventListener('keydown', handleKeyDown)
//     return () => window.removeEventListener('keydown', handleKeyDown)
//   }, [showSecondSection, showThirdSection, loading])

//   return (
//     <main className="main-container">
//       {!loading && <CursorTrail />}
//       {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      
//       {showHero && (
//         <>
//           {/* Hero Section */}
//           <div ref={heroRef} className="hero-wrapper">
//             <HeroSection />
//           </div>
          
//           {/* Second Section */}
//           {showSecondSection && (
//             <div ref={secondSectionRef} className="second-section-wrapper">
//               <SecondSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}
          
//           {/* Third Section - Horizontal Slider */}
//           {showThirdSection && (
//             <div ref={thirdSectionRef} className="third-section-wrapper">
//               <ThirdSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}
//         </>
//       )}
//     </main>
//   )
// }


'use client'
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import HeroSection from '@/components/HeroSection/HeroSection'
import SecondSection from '@/components/SecondSection/SecondSection'
import ThirdSection from '@/components/ThirdSection/ThirdSection'
import CursorTrail from '@/components/CursorTrail/CursorTrail'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [showHero, setShowHero] = useState(false)
  const [showSecondSection, setShowSecondSection] = useState(false)
  const [showThirdSection, setShowThirdSection] = useState(false)
  const scrollProgressRef = useRef(0)
  const heroRef = useRef(null)
  const secondSectionRef = useRef(null)
  const thirdSectionRef = useRef(null)
  const isTransitioning = useRef(false)

  const handleLoadingComplete = () => {
    setLoading(false)
    setShowHero(true)
  }

  // Scroll handling
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      if (loading || isTransitioning.current) return

      if (!showSecondSection && !showThirdSection) {
        // Hero section mein
        if (e.deltaY > 0) {
          scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)
          
          const event = new CustomEvent('scrollProgress', { 
            detail: { progress: scrollProgressRef.current } 
          })
          window.dispatchEvent(event)
          
          if (scrollProgressRef.current >= 1) {
            isTransitioning.current = true
            setShowSecondSection(true)
            
            gsap.to(heroRef.current, {
              opacity: 0,
              scale: 0.95,
              duration: 0.8,
              ease: 'power2.inOut',
              onComplete: () => {
                gsap.set(heroRef.current, { display: 'none' })
                isTransitioning.current = false
                scrollProgressRef.current = 0
                
                const resetEvent = new CustomEvent('scrollProgress', { 
                  detail: { progress: 0 } 
                })
                window.dispatchEvent(resetEvent)
              }
            })
          }
        } else {
          scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.1)
          
          const event = new CustomEvent('scrollProgress', { 
            detail: { progress: scrollProgressRef.current } 
          })
          window.dispatchEvent(event)
        }
      } else if (showSecondSection && !showThirdSection) {
        // Second section mein - yahan scroll se text fill hoga
        if (e.deltaY > 0) {
          scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
          
          const event = new CustomEvent('scrollProgress', { 
            detail: { progress: scrollProgressRef.current } 
          })
          window.dispatchEvent(event)
          
          // Jab progress 1 ho jaye, third section show karo - SMOOTH TRANSITION
          if (scrollProgressRef.current >= 1) {
            setShowThirdSection(true)
            
            // Third section ko initially neeche rakho
            requestAnimationFrame(() => {
              if (thirdSectionRef.current) {
                gsap.set(thirdSectionRef.current, { y: '100%' })
                isTransitioning.current = false
              }
            })
            
            // Scroll progress ko 0 se start karo for slide up
            scrollProgressRef.current = 0
            
            const resetEvent = new CustomEvent('scrollProgress', { 
              detail: { progress: 0 } 
            })
            window.dispatchEvent(resetEvent)
          }
        } else if (e.deltaY < 0) {
          scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
          
          const event = new CustomEvent('scrollProgress', { 
            detail: { progress: scrollProgressRef.current } 
          })
          window.dispatchEvent(event)
          
          if (scrollProgressRef.current <= 0) {
            isTransitioning.current = true
            setShowSecondSection(false)
            
            gsap.set(heroRef.current, { display: 'block' })
            gsap.to(heroRef.current, {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'power2.inOut',
              onComplete: () => {
                isTransitioning.current = false
                scrollProgressRef.current = 1
              }
            })
          }
        }
      } else if (showThirdSection) {
        // Third section mein - scroll controlled
        if (e.deltaY > 0) {
          // Scroll down
          if (scrollProgressRef.current < 0.5) {
            // Phase 1: Slide up (0 to 0.5)
            scrollProgressRef.current = Math.min(0.5, scrollProgressRef.current + 0.015)
            
            const event = new CustomEvent('scrollProgress', { 
              detail: { progress: scrollProgressRef.current } 
            })
            window.dispatchEvent(event)
            
            // Third section ko scroll ke saath upar lao
            const slideProgress = scrollProgressRef.current / 0.5
            const yPos = (1 - slideProgress) * 100
            
            gsap.to(thirdSectionRef.current, {
              y: `${yPos}%`,
              duration: 0.05,
              ease: 'none'
            })
          } else {
            // Phase 2: Horizontal scroll (0.5 to 1)
            scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.015)
            
            const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
            
            const event = new CustomEvent('scrollProgress', { 
              detail: { progress: horizontalProgress } 
            })
            window.dispatchEvent(event)
          }
        } else if (e.deltaY < 0) {
          // Scroll up
          if (scrollProgressRef.current > 0.5) {
            // Phase 2 reverse: Horizontal scroll reverse
            scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - 0.015)
            
            const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
            
            const event = new CustomEvent('scrollProgress', { 
              detail: { progress: horizontalProgress } 
            })
            window.dispatchEvent(event)
          } else {
            // Phase 1 reverse: Slide down
            if (scrollProgressRef.current > 0) {
              scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.015)
              
              const event = new CustomEvent('scrollProgress', { 
                detail: { progress: scrollProgressRef.current } 
              })
              window.dispatchEvent(event)
              
              const slideProgress = scrollProgressRef.current / 0.5
              const yPos = (1 - slideProgress) * 100
              
              gsap.to(thirdSectionRef.current, {
                y: `${yPos}%`,
                duration: 0.05,
                ease: 'none'
              })
              
              // Agar bilkul neeche pahunch gaye
              if (scrollProgressRef.current <= 0) {
                setShowThirdSection(false)
                scrollProgressRef.current = 1
                
                const resetEvent = new CustomEvent('scrollProgress', { 
                  detail: { progress: 1 } 
                })
                window.dispatchEvent(resetEvent)
              }
            }
          }
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [showSecondSection, showThirdSection, loading])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading || isTransitioning.current) return
      
      if (!showSecondSection && !showThirdSection) {
        // Hero section
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)
          
          const event = new CustomEvent('scrollProgress', { 
            detail: { progress: scrollProgressRef.current } 
          })
          window.dispatchEvent(event)
          
          if (scrollProgressRef.current >= 1) {
            isTransitioning.current = true
            setShowSecondSection(true)
            
            gsap.to(heroRef.current, {
              opacity: 0,
              scale: 0.95,
              duration: 0.8,
              ease: 'power2.inOut',
              onComplete: () => {
                gsap.set(heroRef.current, { display: 'none' })
                isTransitioning.current = false
                scrollProgressRef.current = 0
                
                const resetEvent = new CustomEvent('scrollProgress', { 
                  detail: { progress: 0 } 
                })
                window.dispatchEvent(resetEvent)
              }
            })
          }
        }
      } else if (showSecondSection && !showThirdSection) {
        // Second section
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
          
          const event = new CustomEvent('scrollProgress', { 
            detail: { progress: scrollProgressRef.current } 
          })
          window.dispatchEvent(event)
          
          if (scrollProgressRef.current >= 1) {
            setShowThirdSection(true)
            
            requestAnimationFrame(() => {
              if (thirdSectionRef.current) {
                gsap.set(thirdSectionRef.current, { y: '100%' })
                isTransitioning.current = false
              }
            })
            
            scrollProgressRef.current = 0
            
            const resetEvent = new CustomEvent('scrollProgress', { 
              detail: { progress: 0 } 
            })
            window.dispatchEvent(resetEvent)
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
          
          const event = new CustomEvent('scrollProgress', { 
            detail: { progress: scrollProgressRef.current } 
          })
          window.dispatchEvent(event)
          
          if (scrollProgressRef.current <= 0) {
            isTransitioning.current = true
            setShowSecondSection(false)
            
            gsap.set(heroRef.current, { display: 'block' })
            gsap.to(heroRef.current, {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'power2.inOut',
              onComplete: () => {
                isTransitioning.current = false
                scrollProgressRef.current = 1
              }
            })
          }
        }
      } else if (showThirdSection) {
        // Third section
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          if (scrollProgressRef.current < 0.5) {
            scrollProgressRef.current = Math.min(0.5, scrollProgressRef.current + 0.015)
            
            const event = new CustomEvent('scrollProgress', { 
              detail: { progress: scrollProgressRef.current } 
            })
            window.dispatchEvent(event)
            
            const slideProgress = scrollProgressRef.current / 0.5
            const yPos = (1 - slideProgress) * 100
            
            gsap.to(thirdSectionRef.current, {
              y: `${yPos}%`,
              duration: 0.05,
              ease: 'none'
            })
          } else {
            scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.015)
            
            const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
            
            const event = new CustomEvent('scrollProgress', { 
              detail: { progress: horizontalProgress } 
            })
            window.dispatchEvent(event)
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          if (scrollProgressRef.current > 0.5) {
            scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - 0.015)
            
            const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
            
            const event = new CustomEvent('scrollProgress', { 
              detail: { progress: horizontalProgress } 
            })
            window.dispatchEvent(event)
          } else {
            if (scrollProgressRef.current > 0) {
              scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.015)
              
              const event = new CustomEvent('scrollProgress', { 
                detail: { progress: scrollProgressRef.current } 
              })
              window.dispatchEvent(event)
              
              const slideProgress = scrollProgressRef.current / 0.5
              const yPos = (1 - slideProgress) * 100
              
              gsap.to(thirdSectionRef.current, {
                y: `${yPos}%`,
                duration: 0.05,
                ease: 'none'
              })
              
              if (scrollProgressRef.current <= 0) {
                setShowThirdSection(false)
                scrollProgressRef.current = 1
                
                const resetEvent = new CustomEvent('scrollProgress', { 
                  detail: { progress: 1 } 
                })
                window.dispatchEvent(resetEvent)
              }
            }
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSecondSection, showThirdSection, loading])

  return (
    <main className="main-container">
      {!loading && <CursorTrail />}
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      
      {showHero && (
        <>
          {/* Hero Section */}
          <div ref={heroRef} className="hero-wrapper">
            <HeroSection />
          </div>
          
          {/* Second Section - Always visible when third showing */}
          {showSecondSection && (
            <div ref={secondSectionRef} className="second-section-wrapper">
              <SecondSection scrollProgressRef={scrollProgressRef} />
            </div>
          )}
          
          {/* Third Section - Scroll Controlled Slide Up */}
          {showThirdSection && (
            <div ref={thirdSectionRef} className="third-section-wrapper">
              <ThirdSection scrollProgressRef={scrollProgressRef} />
            </div>
          )}
        </>
      )}
    </main>
  )
}

// 'use client'
// import { useState, useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
// import HeroSection from '@/components/HeroSection/HeroSection'
// import SecondSection from '@/components/SecondSection/SecondSection'
// import ThirdSection from '@/components/ThirdSection/ThirdSection'
// import CursorTrail from '@/components/CursorTrail/CursorTrail'

// export default function Home() {
//   const [loading, setLoading] = useState(true)
//   const [showHero, setShowHero] = useState(false)
//   const [showSecondSection, setShowSecondSection] = useState(false)
//   const [showThirdSection, setShowThirdSection] = useState(false)
//   const scrollProgressRef = useRef(0)
//   const heroRef = useRef(null)
//   const secondSectionRef = useRef(null)
//   const thirdSectionRef = useRef(null)
//   const isTransitioning = useRef(false)

//   const handleLoadingComplete = () => {
//     setLoading(false)
//     setShowHero(true)
//   }

//   // Scroll handling
//   useEffect(() => {
//     const handleWheel = (e) => {
//       e.preventDefault()
//       if (loading || isTransitioning.current) return

//       if (!showSecondSection && !showThirdSection) {
//         // Hero section mein
//         if (e.deltaY > 0) {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
          
//           if (scrollProgressRef.current >= 1) {
//             isTransitioning.current = true
//             setShowSecondSection(true)
            
//             gsap.to(heroRef.current, {
//               opacity: 0,
//               scale: 0.95,
//               duration: 0.8,
//               ease: 'power2.inOut',
//               onComplete: () => {
//                 gsap.set(heroRef.current, { display: 'none' })
//                 isTransitioning.current = false
//                 scrollProgressRef.current = 0
                
//                 const resetEvent = new CustomEvent('scrollProgress', { 
//                   detail: { progress: 0 } 
//                 })
//                 window.dispatchEvent(resetEvent)
//               }
//             })
//           }
//         } else {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.1)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
//         }
//       } else if (showSecondSection && !showThirdSection) {
//         // Second section mein - yahan scroll se text fill hoga
//         if (e.deltaY > 0) {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
          
//           // Jab progress 1 ho jaye, third section show karo
//           if (scrollProgressRef.current >= 1) {
//             setShowThirdSection(true)
            
//             // Third section ko initially neeche rakho
//             gsap.set(thirdSectionRef.current, { y: '100%' })
            
//             // Scroll progress ko 0 se start karo for slide up
//             scrollProgressRef.current = 0
            
//             const resetEvent = new CustomEvent('scrollProgress', { 
//               detail: { progress: 0 } 
//             })
//             window.dispatchEvent(resetEvent)
//           }
//         } else if (e.deltaY < 0) {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
          
//           if (scrollProgressRef.current <= 0) {
//             isTransitioning.current = true
//             setShowSecondSection(false)
            
//             gsap.set(heroRef.current, { display: 'block' })
//             gsap.to(heroRef.current, {
//               opacity: 1,
//               scale: 1,
//               duration: 0.8,
//               ease: 'power2.inOut',
//               onComplete: () => {
//                 isTransitioning.current = false
//                 scrollProgressRef.current = 1
//               }
//             })
//           }
//         }
//       } else if (showThirdSection) {
//         // Third section mein - scroll controlled
//         if (e.deltaY > 0) {
//           // Scroll down
//           if (scrollProgressRef.current < 0.5) {
//             // Phase 1: Slide up (0 to 0.5)
//             scrollProgressRef.current = Math.min(0.5, scrollProgressRef.current + 0.02)
            
//             const event = new CustomEvent('scrollProgress', { 
//               detail: { progress: scrollProgressRef.current } 
//             })
//             window.dispatchEvent(event)
            
//             // Third section ko scroll ke saath upar lao
//             const slideProgress = scrollProgressRef.current / 0.5
//             const yPos = (1 - slideProgress) * 100
            
//             gsap.to(thirdSectionRef.current, {
//               y: `${yPos}%`,
//               duration: 0.1,
//               ease: 'power2.out'
//             })
//           } else {
//             // Phase 2: Horizontal scroll (0.5 to 1)
//             scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
            
//             const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
            
//             const event = new CustomEvent('scrollProgress', { 
//               detail: { progress: horizontalProgress } 
//             })
//             window.dispatchEvent(event)
//           }
//         } else if (e.deltaY < 0) {
//           // Scroll up
//           if (scrollProgressRef.current > 0.5) {
//             // Phase 2 reverse: Horizontal scroll reverse
//             scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - 0.02)
            
//             const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
            
//             const event = new CustomEvent('scrollProgress', { 
//               detail: { progress: horizontalProgress } 
//             })
//             window.dispatchEvent(event)
//           } else {
//             // Phase 1 reverse: Slide down
//             if (scrollProgressRef.current > 0) {
//               scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
              
//               const event = new CustomEvent('scrollProgress', { 
//                 detail: { progress: scrollProgressRef.current } 
//               })
//               window.dispatchEvent(event)
              
//               const slideProgress = scrollProgressRef.current / 0.5
//               const yPos = (1 - slideProgress) * 100
              
//               gsap.to(thirdSectionRef.current, {
//                 y: `${yPos}%`,
//                 duration: 0.1,
//                 ease: 'power2.out'
//               })
              
//               // Agar bilkul neeche pahunch gaye
//               if (scrollProgressRef.current <= 0) {
//                 setShowThirdSection(false)
//                 scrollProgressRef.current = 1
                
//                 const resetEvent = new CustomEvent('scrollProgress', { 
//                   detail: { progress: 1 } 
//                 })
//                 window.dispatchEvent(resetEvent)
//               }
//             }
//           }
//         }
//       }
//     }

//     window.addEventListener('wheel', handleWheel, { passive: false })
//     return () => window.removeEventListener('wheel', handleWheel)
//   }, [showSecondSection, showThirdSection, loading])

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (loading || isTransitioning.current) return
      
//       if (!showSecondSection && !showThirdSection) {
//         // Hero section
//         if (e.key === 'ArrowDown') {
//           e.preventDefault()
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
          
//           if (scrollProgressRef.current >= 1) {
//             isTransitioning.current = true
//             setShowSecondSection(true)
            
//             gsap.to(heroRef.current, {
//               opacity: 0,
//               scale: 0.95,
//               duration: 0.8,
//               ease: 'power2.inOut',
//               onComplete: () => {
//                 gsap.set(heroRef.current, { display: 'none' })
//                 isTransitioning.current = false
//                 scrollProgressRef.current = 0
                
//                 const resetEvent = new CustomEvent('scrollProgress', { 
//                   detail: { progress: 0 } 
//                 })
//                 window.dispatchEvent(resetEvent)
//               }
//             })
//           }
//         }
//       } else if (showSecondSection && !showThirdSection) {
//         // Second section
//         if (e.key === 'ArrowDown') {
//           e.preventDefault()
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
          
//           if (scrollProgressRef.current >= 1) {
//             setShowThirdSection(true)
//             gsap.set(thirdSectionRef.current, { y: '100%' })
//             scrollProgressRef.current = 0
            
//             const resetEvent = new CustomEvent('scrollProgress', { 
//               detail: { progress: 0 } 
//             })
//             window.dispatchEvent(resetEvent)
//           }
//         } else if (e.key === 'ArrowUp') {
//           e.preventDefault()
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
          
//           const event = new CustomEvent('scrollProgress', { 
//             detail: { progress: scrollProgressRef.current } 
//           })
//           window.dispatchEvent(event)
          
//           if (scrollProgressRef.current <= 0) {
//             isTransitioning.current = true
//             setShowSecondSection(false)
            
//             gsap.set(heroRef.current, { display: 'block' })
//             gsap.to(heroRef.current, {
//               opacity: 1,
//               scale: 1,
//               duration: 0.8,
//               ease: 'power2.inOut',
//               onComplete: () => {
//                 isTransitioning.current = false
//                 scrollProgressRef.current = 1
//               }
//             })
//           }
//         }
//       } else if (showThirdSection) {
//         // Third section
//         if (e.key === 'ArrowDown') {
//           e.preventDefault()
//           if (scrollProgressRef.current < 0.5) {
//             scrollProgressRef.current = Math.min(0.5, scrollProgressRef.current + 0.02)
            
//             const event = new CustomEvent('scrollProgress', { 
//               detail: { progress: scrollProgressRef.current } 
//             })
//             window.dispatchEvent(event)
            
//             const slideProgress = scrollProgressRef.current / 0.5
//             const yPos = (1 - slideProgress) * 100
            
//             gsap.to(thirdSectionRef.current, {
//               y: `${yPos}%`,
//               duration: 0.1,
//               ease: 'power2.out'
//             })
//           } else {
//             scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
            
//             const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
            
//             const event = new CustomEvent('scrollProgress', { 
//               detail: { progress: horizontalProgress } 
//             })
//             window.dispatchEvent(event)
//           }
//         } else if (e.key === 'ArrowUp') {
//           e.preventDefault()
//           if (scrollProgressRef.current > 0.5) {
//             scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - 0.02)
            
//             const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
            
//             const event = new CustomEvent('scrollProgress', { 
//               detail: { progress: horizontalProgress } 
//             })
//             window.dispatchEvent(event)
//           } else {
//             if (scrollProgressRef.current > 0) {
//               scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
              
//               const event = new CustomEvent('scrollProgress', { 
//                 detail: { progress: scrollProgressRef.current } 
//               })
//               window.dispatchEvent(event)
              
//               const slideProgress = scrollProgressRef.current / 0.5
//               const yPos = (1 - slideProgress) * 100
              
//               gsap.to(thirdSectionRef.current, {
//                 y: `${yPos}%`,
//                 duration: 0.1,
//                 ease: 'power2.out'
//               })
              
//               if (scrollProgressRef.current <= 0) {
//                 setShowThirdSection(false)
//                 scrollProgressRef.current = 1
                
//                 const resetEvent = new CustomEvent('scrollProgress', { 
//                   detail: { progress: 1 } 
//                 })
//                 window.dispatchEvent(resetEvent)
//               }
//             }
//           }
//         }
//       }
//     }

//     window.addEventListener('keydown', handleKeyDown)
//     return () => window.removeEventListener('keydown', handleKeyDown)
//   }, [showSecondSection, showThirdSection, loading])

//   return (
//     <main className="main-container">
//       {!loading && <CursorTrail />}
//       {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      
//       {showHero && (
//         <>
//           {/* Hero Section */}
//           <div ref={heroRef} className="hero-wrapper">
//             <HeroSection />
//           </div>
          
//           {/* Second Section - Always visible when third showing */}
//           {showSecondSection && (
//             <div ref={secondSectionRef} className="second-section-wrapper">
//               <SecondSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}
          
//           {/* Third Section - Scroll Controlled Slide Up */}
//           {showThirdSection && (
//             <div ref={thirdSectionRef} className="third-section-wrapper">
//               <ThirdSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}
//         </>
//       )}
//     </main>
//   )
// }
