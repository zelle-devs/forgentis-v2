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
//   const circularRevealRef = useRef(null)

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
//         // ============ HERO SECTION -> SECOND SECTION (Circular Reveal) ============
//         if (e.deltaY > 0) {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)

//           const event = new CustomEvent('scrollProgress', {
//             detail: { progress: scrollProgressRef.current }
//           })
//           window.dispatchEvent(event)

//           if (scrollProgressRef.current >= 1) {
//             isTransitioning.current = true

//             if (circularRevealRef.current) {
//               gsap.fromTo(
//                 circularRevealRef.current,
//                 { scale: 0, opacity: 0, borderRadius: '50%' },
//                 {
//                   scale: 3,
//                   opacity: 1,
//                   borderRadius: '0%',
//                   duration: 0.6,
//                   ease: 'power3.inOut',
//                   onComplete: () => {
//                     setShowSecondSection(true)
//                     gsap.set(heroRef.current, { display: 'none' })

//                     gsap.to(circularRevealRef.current, {
//                       opacity: 0,
//                       duration: 0.3,
//                       ease: 'power2.out',
//                       onComplete: () => {
//                         isTransitioning.current = false
//                         scrollProgressRef.current = 0

//                         const resetEvent = new CustomEvent('scrollProgress', {
//                           detail: { progress: 0 }
//                         })
//                         window.dispatchEvent(resetEvent)
//                       }
//                     })
//                   }
//                 }
//               )
//             }
//           }
//         } else {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.1)

//           const event = new CustomEvent('scrollProgress', {
//             detail: { progress: scrollProgressRef.current }
//           })
//           window.dispatchEvent(event)
//         }
//       } else if (showSecondSection && !showThirdSection) {
//         // ============ SECOND SECTION -> THIRD SECTION ============
//         if (e.deltaY > 0) {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)

//           const event = new CustomEvent('scrollProgress', {
//             detail: { progress: scrollProgressRef.current }
//           })
//           window.dispatchEvent(event)

//           if (scrollProgressRef.current >= 1) {
//             isTransitioning.current = true

//             if (circularRevealRef.current) {
//               gsap.fromTo(
//                 circularRevealRef.current,
//                 { scale: 0, opacity: 0, borderRadius: '50%' },
//                 {
//                   scale: 3,
//                   opacity: 1,
//                   borderRadius: '0%',
//                   duration: 0.6,
//                   ease: 'power3.inOut',
//                   onComplete: () => {
//                     setShowThirdSection(true)

//                     requestAnimationFrame(() => {
//                       if (thirdSectionRef.current) {
//                         gsap.set(thirdSectionRef.current, { y: '100%' })
//                       }

//                       gsap.to(circularRevealRef.current, {
//                         opacity: 0,
//                         duration: 0.3,
//                         ease: 'power2.out',
//                         onComplete: () => {
//                           isTransitioning.current = false
//                           scrollProgressRef.current = 0

//                           const slideEvent = new CustomEvent('thirdSlideProgress', {
//                             detail: { progress: 0 }
//                           })
//                           window.dispatchEvent(slideEvent)
//                         }
//                       })
//                     })
//                   }
//                 }
//               )
//             }
//           }
//         } else if (e.deltaY < 0) {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)

//           const event = new CustomEvent('scrollProgress', {
//             detail: { progress: scrollProgressRef.current }
//           })
//           window.dispatchEvent(event)

//           if (scrollProgressRef.current <= 0) {
//             isTransitioning.current = true

//             if (circularRevealRef.current) {
//               gsap.fromTo(
//                 circularRevealRef.current,
//                 { scale: 3, opacity: 0 },
//                 {
//                   scale: 0,
//                   opacity: 1,
//                   borderRadius: '50%',
//                   duration: 0.6,
//                   ease: 'power3.inOut',
//                   onComplete: () => {
//                     setShowSecondSection(false)
//                     gsap.set(heroRef.current, { display: 'block' })
//                     gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
//                     isTransitioning.current = false
//                     scrollProgressRef.current = 1

//                     const resetEvent = new CustomEvent('scrollProgress', {
//                       detail: { progress: 1 }
//                     })
//                     window.dispatchEvent(resetEvent)
//                   }
//                 }
//               )
//             }
//           }
//         }
//       } 
//       else if (showThirdSection) {
//         // ============ THIRD SECTION ============
//         if (e.deltaY > 0) {
//           if (scrollProgressRef.current < 0.5) {
//             scrollProgressRef.current = Math.min(0.5, scrollProgressRef.current + 0.015)

//             const slideProgress = scrollProgressRef.current / 0.5
//             const yPos = (1 - slideProgress) * 100

//             gsap.to(thirdSectionRef.current, {
//               y: `${yPos}%`,
//               duration: 0.08,
//               ease: 'power2.out',
//               overwrite: 'auto',
//             })

//             const slideEvent = new CustomEvent('thirdSlideProgress', {
//               detail: { progress: slideProgress }
//             })
//             window.dispatchEvent(slideEvent)
//           } else {
//             scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.015)

//             const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5

//             const hEvent = new CustomEvent('thirdHorizontalProgress', {
//               detail: { progress: horizontalProgress }
//             })
//             window.dispatchEvent(hEvent)
//           }
//         } else if (e.deltaY < 0) {
//           if (scrollProgressRef.current > 0.5) {
//             scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - 0.015)

//             const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5

//             const hEvent = new CustomEvent('thirdHorizontalProgress', {
//               detail: { progress: horizontalProgress }
//             })
//             window.dispatchEvent(hEvent)
//           } else {
//             if (scrollProgressRef.current > 0) {
//               scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.015)

//               const slideProgress = scrollProgressRef.current / 0.5
//               const yPos = (1 - slideProgress) * 100

//               gsap.to(thirdSectionRef.current, {
//                 y: `${yPos}%`,
//                 duration: 0.08,
//                 ease: 'power2.out',
//                 overwrite: 'auto',
//               })

//               const slideEvent = new CustomEvent('thirdSlideProgress', {
//                 detail: { progress: slideProgress }
//               })
//               window.dispatchEvent(slideEvent)

//               if (scrollProgressRef.current <= 0) {
//                 isTransitioning.current = true

//                 if (circularRevealRef.current) {
//                   gsap.fromTo(
//                     circularRevealRef.current,
//                     { scale: 3, opacity: 0 },
//                     {
//                       scale: 0,
//                       opacity: 1,
//                       borderRadius: '50%',
//                       duration: 0.6,
//                       ease: 'power3.inOut',
//                       onComplete: () => {
//                         setShowThirdSection(false)
//                         gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
//                         isTransitioning.current = false
//                         scrollProgressRef.current = 1

//                         const resetEvent = new CustomEvent('scrollProgress', {
//                           detail: { progress: 1 }
//                         })
//                         window.dispatchEvent(resetEvent)
//                       }
//                     }
//                   )
//                 }
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

//       if (e.key === 'ArrowDown') {
//         e.preventDefault()
//         targetScrollDown()
//       } else if (e.key === 'ArrowUp') {
//         e.preventDefault()
//         targetScrollUp()
//       }
//     }

//     const targetScrollDown = () => {
//       if (!showSecondSection && !showThirdSection) {
//         scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//         if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
//           isTransitioning.current = true
//           if (circularRevealRef.current) {
//             gsap.fromTo(
//               circularRevealRef.current,
//               { scale: 0, opacity: 0, borderRadius: '50%' },
//               {
//                 scale: 3,
//                 opacity: 1,
//                 borderRadius: '0%',
//                 duration: 0.6,
//                 ease: 'power3.inOut',
//                 onComplete: () => {
//                   setShowSecondSection(true)
//                   gsap.set(heroRef.current, { display: 'none' })
//                   gsap.to(circularRevealRef.current, {
//                     opacity: 0,
//                     duration: 0.3,
//                     ease: 'power2.out',
//                     onComplete: () => {
//                       isTransitioning.current = false
//                       scrollProgressRef.current = 0
//                       window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: 0 } }))
//                     }
//                   })
//                 }
//               }
//             )
//           }
//         }
//       } else if (showSecondSection && !showThirdSection) {
//         scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showThirdSection) {
//         if (scrollProgressRef.current < 0.5) {
//           scrollProgressRef.current = Math.min(0.5, scrollProgressRef.current + 0.015)
//           const slideProgress = scrollProgressRef.current / 0.5
//           gsap.to(thirdSectionRef.current, {
//             y: `${(1 - slideProgress) * 100}%`,
//             duration: 0.08,
//             ease: 'power2.out',
//             overwrite: 'auto',
//           })
//           window.dispatchEvent(new CustomEvent('thirdSlideProgress', { detail: { progress: slideProgress } }))
//         } else {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.015)
//           const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
//           window.dispatchEvent(new CustomEvent('thirdHorizontalProgress', { detail: { progress: horizontalProgress } }))
//         }
//       }
//     }

//     const targetScrollUp = () => {
//       if (!showSecondSection && !showThirdSection) {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.1)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showSecondSection && !showThirdSection) {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showThirdSection) {
//         if (scrollProgressRef.current > 0.5) {
//           scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - 0.015)
//           const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
//           window.dispatchEvent(new CustomEvent('thirdHorizontalProgress', { detail: { progress: horizontalProgress } }))
//         } else if (scrollProgressRef.current > 0) {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.015)
//           const slideProgress = scrollProgressRef.current / 0.5
//           gsap.to(thirdSectionRef.current, {
//             y: `${(1 - slideProgress) * 100}%`,
//             duration: 0.08,
//             ease: 'power2.out',
//             overwrite: 'auto',
//           })
//           window.dispatchEvent(new CustomEvent('thirdSlideProgress', { detail: { progress: slideProgress } }))
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
//           <div ref={heroRef} className="hero-wrapper">
//             <HeroSection />
//           </div>

//           {showSecondSection && (
//             <div ref={secondSectionRef} className="second-section-wrapper">
//               <SecondSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showThirdSection && (
//             <div ref={thirdSectionRef} className="third-section-wrapper">
//               <ThirdSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           <div
//             ref={circularRevealRef}
//             className="circular-reveal-overlay"
//             style={{
//               position: 'fixed',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               width: '100vw',
//               height: '100vh',
//               background: 'var(--color-black)',
//               zIndex: 9,
//               pointerEvents: 'none',
//               opacity: 0,
//               scale: 0,
//             }}
//           />
//         </>
//       )}
//     </main>
//   )
// }


    // *************************************
'use client'
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import HeroSection from '@/components/HeroSection/HeroSection'
import SecondSection from '@/components/SecondSection/SecondSection'
import FourthSection from '@/components/FourthSection/FourthSection'
import ThirdSection from '@/components/ThirdSection/ThirdSection'
import CursorTrail from '@/components/CursorTrail/CursorTrail'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [showHero, setShowHero] = useState(false)
  const [showSecondSection, setShowSecondSection] = useState(false)
  const [showFourthSection, setShowFourthSection] = useState(false)
  const [showThirdSection, setShowThirdSection] = useState(false)
  const scrollProgressRef = useRef(0)
  const heroRef = useRef(null)
  const secondSectionRef = useRef(null)
  const fourthSectionRef = useRef(null)
  const thirdSectionRef = useRef(null)
  const isTransitioning = useRef(false)
  const circularRevealRef = useRef(null)

  const handleLoadingComplete = () => {
    setLoading(false)
    setShowHero(true)
  }

  // Scroll handling
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      if (loading || isTransitioning.current) return

      if (!showSecondSection && !showFourthSection && !showThirdSection) {
        // ============ HERO SECTION -> SECOND SECTION ============
        if (e.deltaY > 0) {
          scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)

          const event = new CustomEvent('scrollProgress', {
            detail: { progress: scrollProgressRef.current }
          })
          window.dispatchEvent(event)

          if (scrollProgressRef.current >= 1) {
            isTransitioning.current = true

            if (circularRevealRef.current) {
              gsap.fromTo(
                circularRevealRef.current,
                { scale: 0, opacity: 0, borderRadius: '50%' },
                {
                  scale: 3,
                  opacity: 1,
                  borderRadius: '0%',
                  duration: 0.6,
                  ease: 'power3.inOut',
                  onComplete: () => {
                    setShowSecondSection(true)
                    gsap.set(heroRef.current, { display: 'none' })
                    gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })

                    gsap.to(circularRevealRef.current, {
                      opacity: 0,
                      duration: 0.3,
                      ease: 'power2.out',
                      onComplete: () => {
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
              )
            }
          }
        } else {
          scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.1)

          const event = new CustomEvent('scrollProgress', {
            detail: { progress: scrollProgressRef.current }
          })
          window.dispatchEvent(event)
        }
      } else if (showSecondSection && !showFourthSection && !showThirdSection) {
        // ============ SECOND SECTION -> FOURTH SECTION ============
        if (e.deltaY > 0) {
          scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)

          const event = new CustomEvent('scrollProgress', {
            detail: { progress: scrollProgressRef.current }
          })
          window.dispatchEvent(event)

          if (scrollProgressRef.current >= 1) {
            isTransitioning.current = true

            if (circularRevealRef.current) {
              gsap.fromTo(
                circularRevealRef.current,
                { scale: 0, opacity: 0, borderRadius: '50%' },
                {
                  scale: 3,
                  opacity: 1,
                  borderRadius: '0%',
                  duration: 0.6,
                  ease: 'power3.inOut',
                  onComplete: () => {
                    setShowFourthSection(true)
                    gsap.set(secondSectionRef.current, { display: 'none' })
                    gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })

                    gsap.to(circularRevealRef.current, {
                      opacity: 0,
                      duration: 0.3,
                      ease: 'power2.out',
                      onComplete: () => {
                        isTransitioning.current = false
                        scrollProgressRef.current = 0

                        const resetEvent = new CustomEvent('fourthShapeProgress', {
                          detail: { progress: 0 }
                        })
                        window.dispatchEvent(resetEvent)
                      }
                    })
                  }
                }
              )
            }
          }
        } else if (e.deltaY < 0) {
          scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)

          const event = new CustomEvent('scrollProgress', {
            detail: { progress: scrollProgressRef.current }
          })
          window.dispatchEvent(event)

          if (scrollProgressRef.current <= 0) {
            isTransitioning.current = true

            if (circularRevealRef.current) {
              gsap.fromTo(
                circularRevealRef.current,
                { scale: 3, opacity: 0 },
                {
                  scale: 0,
                  opacity: 1,
                  borderRadius: '50%',
                  duration: 0.6,
                  ease: 'power3.inOut',
                  onComplete: () => {
                    setShowSecondSection(false)
                    gsap.set(heroRef.current, { display: 'block' })
                    gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
                    isTransitioning.current = false
                    scrollProgressRef.current = 1

                    const resetEvent = new CustomEvent('scrollProgress', {
                      detail: { progress: 1 }
                    })
                    window.dispatchEvent(resetEvent)
                  }
                }
              )
            }
          }
        }
      } else if (showFourthSection && !showThirdSection) {
        // ============ FOURTH SECTION (SLOW - Shape + Image + Hold) ============
        if (e.deltaY > 0) {
          // Scroll slow - 0.01 increment
          scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.01)

          // Phase 1: 0 to 0.4 -> Shape building
          const shapeProgress = Math.min(1, scrollProgressRef.current / 0.4)
          const shapeEvent = new CustomEvent('fourthShapeProgress', {
            detail: { progress: shapeProgress }
          })
          window.dispatchEvent(shapeEvent)

          // Phase 2: 0.4 to 0.8 -> Image reveal
          if (scrollProgressRef.current >= 0.4) {
            const imageProgress = Math.min(1, (scrollProgressRef.current - 0.4) / 0.4)
            const imageEvent = new CustomEvent('fourthImageProgress', {
              detail: { progress: imageProgress }
            })
            window.dispatchEvent(imageEvent)
          }

          // Phase 3: 0.8 to 1 -> Hold (screen par rahe)

          // Transition to ThirdSection only at 100%
          if (scrollProgressRef.current >= 1) {
            isTransitioning.current = true

            if (circularRevealRef.current) {
              gsap.fromTo(
                circularRevealRef.current,
                { scale: 0, opacity: 0, borderRadius: '50%' },
                {
                  scale: 3,
                  opacity: 1,
                  borderRadius: '0%',
                  duration: 0.6,
                  ease: 'power3.inOut',
                  onComplete: () => {
                    setShowThirdSection(true)
requestAnimationFrame(() => {
  if (thirdSectionRef.current) {
    gsap.set(thirdSectionRef.current, { y: '100%' })
  }
})
gsap.set(fourthSectionRef.current, { display: 'none' })
                    gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })

                    gsap.to(circularRevealRef.current, {
                      opacity: 0,
                      duration: 0.3,
                      ease: 'power2.out',
                      onComplete: () => {
                        isTransitioning.current = false
                        scrollProgressRef.current = 0

                        const slideEvent = new CustomEvent('thirdSlideProgress', {
                          detail: { progress: 0 }
                        })
                        window.dispatchEvent(slideEvent)
                      }
                    })
                  }
                }
              )
            }
          }
        } else if (e.deltaY < 0) {
          scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.01)

          const shapeProgress = Math.min(1, scrollProgressRef.current / 0.4)
          const shapeEvent = new CustomEvent('fourthShapeProgress', {
            detail: { progress: shapeProgress }
          })
          window.dispatchEvent(shapeEvent)

          if (scrollProgressRef.current >= 0.4) {
            const imageProgress = Math.min(1, (scrollProgressRef.current - 0.4) / 0.4)
            const imageEvent = new CustomEvent('fourthImageProgress', {
              detail: { progress: imageProgress }
            })
            window.dispatchEvent(imageEvent)
          }

          if (scrollProgressRef.current <= 0) {
            isTransitioning.current = true

            if (circularRevealRef.current) {
              gsap.fromTo(
                circularRevealRef.current,
                { scale: 3, opacity: 0 },
                {
                  scale: 0,
                  opacity: 1,
                  borderRadius: '50%',
                  duration: 0.6,
                  ease: 'power3.inOut',
                  onComplete: () => {
                    setShowFourthSection(false)
                    setShowSecondSection(true)
                    gsap.set(fourthSectionRef.current, { display: 'none' })
                    gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
                    isTransitioning.current = false
                    scrollProgressRef.current = 1

                    const resetEvent = new CustomEvent('scrollProgress', {
                      detail: { progress: 1 }
                    })
                    window.dispatchEvent(resetEvent)
                  }
                }
              )
            }
          }
        }
      } else if (showThirdSection) {
        // ============ THIRD SECTION ============
        if (e.deltaY > 0) {
          if (scrollProgressRef.current < 0.5) {
            scrollProgressRef.current = Math.min(0.5, scrollProgressRef.current + 0.015)

            const slideProgress = scrollProgressRef.current / 0.5
            const yPos = (1 - slideProgress) * 100

            gsap.to(thirdSectionRef.current, {
              y: `${yPos}%`,
              duration: 0.08,
              ease: 'power2.out',
              overwrite: 'auto',
            })

            const slideEvent = new CustomEvent('thirdSlideProgress', {
              detail: { progress: slideProgress }
            })
            window.dispatchEvent(slideEvent)
          } else {
            scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.015)

            const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5

            const hEvent = new CustomEvent('thirdHorizontalProgress', {
              detail: { progress: horizontalProgress }
            })
            window.dispatchEvent(hEvent)
          }
        } else if (e.deltaY < 0) {
          if (scrollProgressRef.current > 0.5) {
            scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - 0.015)

            const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5

            const hEvent = new CustomEvent('thirdHorizontalProgress', {
              detail: { progress: horizontalProgress }
            })
            window.dispatchEvent(hEvent)
          } else {
            if (scrollProgressRef.current > 0) {
              scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.015)

              const slideProgress = scrollProgressRef.current / 0.5
              const yPos = (1 - slideProgress) * 100

              gsap.to(thirdSectionRef.current, {
                y: `${yPos}%`,
                duration: 0.08,
                ease: 'power2.out',
                overwrite: 'auto',
              })

              const slideEvent = new CustomEvent('thirdSlideProgress', {
                detail: { progress: slideProgress }
              })
              window.dispatchEvent(slideEvent)

              if (scrollProgressRef.current <= 0) {
                isTransitioning.current = true

                if (circularRevealRef.current) {
                  gsap.fromTo(
                    circularRevealRef.current,
                    { scale: 3, opacity: 0 },
                    {
                      scale: 0,
                      opacity: 1,
                      borderRadius: '50%',
                      duration: 0.6,
                      ease: 'power3.inOut',
                      onComplete: () => {
                        setShowThirdSection(false)
                        setShowFourthSection(true)
                        gsap.set(fourthSectionRef.current, { display: 'block' })
                        gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
                        isTransitioning.current = false
                        scrollProgressRef.current = 1

                        const resetEvent = new CustomEvent('fourthShapeProgress', {
                          detail: { progress: 1 }
                        })
                        window.dispatchEvent(resetEvent)
                      }
                    }
                  )
                }
              }
            }
          }
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [showSecondSection, showFourthSection, showThirdSection, loading])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading || isTransitioning.current) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        targetScrollDown()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        targetScrollUp()
      }
    }

    const targetScrollDown = () => {
      if (!showSecondSection && !showFourthSection && !showThirdSection) {
        scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)
        window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
      } else if (showSecondSection && !showFourthSection && !showThirdSection) {
        scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
        window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
      } else if (showFourthSection && !showThirdSection) {
        scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.01)
        
        const shapeProgress = Math.min(1, scrollProgressRef.current / 0.4)
        window.dispatchEvent(new CustomEvent('fourthShapeProgress', { detail: { progress: shapeProgress } }))
        
        if (scrollProgressRef.current >= 0.4) {
          const imageProgress = Math.min(1, (scrollProgressRef.current - 0.4) / 0.4)
          window.dispatchEvent(new CustomEvent('fourthImageProgress', { detail: { progress: imageProgress } }))
        }
      } else if (showThirdSection) {
        if (scrollProgressRef.current < 0.5) {
          scrollProgressRef.current = Math.min(0.5, scrollProgressRef.current + 0.015)
          const slideProgress = scrollProgressRef.current / 0.5
          gsap.to(thirdSectionRef.current, {
            y: `${(1 - slideProgress) * 100}%`,
            duration: 0.08,
            ease: 'power2.out',
            overwrite: 'auto',
          })
          window.dispatchEvent(new CustomEvent('thirdSlideProgress', { detail: { progress: slideProgress } }))
        } else {
          scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.015)
          const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
          window.dispatchEvent(new CustomEvent('thirdHorizontalProgress', { detail: { progress: horizontalProgress } }))
        }
      }
    }

    const targetScrollUp = () => {
      if (!showSecondSection && !showFourthSection && !showThirdSection) {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.1)
        window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
      } else if (showSecondSection && !showFourthSection && !showThirdSection) {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
        window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
      } else if (showFourthSection && !showThirdSection) {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.01)
        
        const shapeProgress = Math.min(1, scrollProgressRef.current / 0.4)
        window.dispatchEvent(new CustomEvent('fourthShapeProgress', { detail: { progress: shapeProgress } }))
        
        if (scrollProgressRef.current >= 0.4) {
          const imageProgress = Math.min(1, (scrollProgressRef.current - 0.4) / 0.4)
          window.dispatchEvent(new CustomEvent('fourthImageProgress', { detail: { progress: imageProgress } }))
        }
      } else if (showThirdSection) {
        if (scrollProgressRef.current > 0.5) {
          scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - 0.015)
          const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
          window.dispatchEvent(new CustomEvent('thirdHorizontalProgress', { detail: { progress: horizontalProgress } }))
        } else if (scrollProgressRef.current > 0) {
          scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.015)
          const slideProgress = scrollProgressRef.current / 0.5
          gsap.to(thirdSectionRef.current, {
            y: `${(1 - slideProgress) * 100}%`,
            duration: 0.08,
            ease: 'power2.out',
            overwrite: 'auto',
          })
          window.dispatchEvent(new CustomEvent('thirdSlideProgress', { detail: { progress: slideProgress } }))
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSecondSection, showFourthSection, showThirdSection, loading])

  return (
    <main className="main-container">
      {!loading && <CursorTrail />}
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {showHero && (
        <>
          <div ref={heroRef} className="hero-wrapper">
            <HeroSection />
          </div>

          {showSecondSection && (
            <div ref={secondSectionRef} className="second-section-wrapper">
              <SecondSection scrollProgressRef={scrollProgressRef} />
            </div>
          )}

          {showFourthSection && (
            <div ref={fourthSectionRef} className="fourth-section-wrapper">
              <FourthSection />
            </div>
          )}

          {showThirdSection && (
            <div ref={thirdSectionRef} className="third-section-wrapper">
              <ThirdSection scrollProgressRef={scrollProgressRef} />
            </div>
          )}

          <div
            ref={circularRevealRef}
            className="circular-reveal-overlay"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100vw',
              height: '100vh',
              background: 'var(--color-black)',
              zIndex: 9,
              pointerEvents: 'none',
              opacity: 0,
              scale: 0,
            }}
          />
        </>
      )}
    </main>
  )
}

// *************************
    // 'use client'
// import { useState, useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
// import HeroSection from '@/components/HeroSection/HeroSection'
// import SecondSection from '@/components/SecondSection/SecondSection'
// import FourthSection from '@/components/FourthSection/FourthSection'
// import ThirdSection from '@/components/ThirdSection/ThirdSection'
// import CursorTrail from '@/components/CursorTrail/CursorTrail'

// export default function Home() {
//   const [loading, setLoading] = useState(true)
//   const [showHero, setShowHero] = useState(false)
//   const [showSecondSection, setShowSecondSection] = useState(false)
//   const [showFourthSection, setShowFourthSection] = useState(false)
//   const [showThirdSection, setShowThirdSection] = useState(false)
//   const scrollProgressRef = useRef(0)
//   const heroRef = useRef(null)
//   const secondSectionRef = useRef(null)
//   const fourthSectionRef = useRef(null)
//   const thirdSectionRef = useRef(null)
//   const isTransitioning = useRef(false)
//   const circularRevealRef = useRef(null)

//   const handleLoadingComplete = () => {
//     setLoading(false)
//     setShowHero(true)
//   }

//   // Scroll handling
//   useEffect(() => {
//     const handleWheel = (e) => {
//       e.preventDefault()
//       if (loading || isTransitioning.current) return

//       if (!showSecondSection && !showFourthSection && !showThirdSection) {
//         // ============ HERO SECTION -> SECOND SECTION ============
//         if (e.deltaY > 0) {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)

//           const event = new CustomEvent('scrollProgress', {
//             detail: { progress: scrollProgressRef.current }
//           })
//           window.dispatchEvent(event)

//           if (scrollProgressRef.current >= 1) {
//             isTransitioning.current = true

//             if (circularRevealRef.current) {
//               gsap.fromTo(
//                 circularRevealRef.current,
//                 { scale: 0, opacity: 0, borderRadius: '50%' },
//                 {
//                   scale: 3,
//                   opacity: 1,
//                   borderRadius: '0%',
//                   duration: 0.6,
//                   ease: 'power3.inOut',
//                   onComplete: () => {
//                     setShowSecondSection(true)
//                     gsap.set(heroRef.current, { display: 'none' })

//                     gsap.to(circularRevealRef.current, {
//                       opacity: 0,
//                       duration: 0.3,
//                       ease: 'power2.out',
//                       onComplete: () => {
//                         isTransitioning.current = false
//                         scrollProgressRef.current = 0

//                         const resetEvent = new CustomEvent('scrollProgress', {
//                           detail: { progress: 0 }
//                         })
//                         window.dispatchEvent(resetEvent)
//                       }
//                     })
//                   }
//                 }
//               )
//             }
//           }
//         } else {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.1)

//           const event = new CustomEvent('scrollProgress', {
//             detail: { progress: scrollProgressRef.current }
//           })
//           window.dispatchEvent(event)
//         }
//       } else if (showSecondSection && !showFourthSection && !showThirdSection) {
//         // ============ SECOND SECTION -> FOURTH SECTION ============
//         if (e.deltaY > 0) {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)

//           const event = new CustomEvent('scrollProgress', {
//             detail: { progress: scrollProgressRef.current }
//           })
//           window.dispatchEvent(event)

//           if (scrollProgressRef.current >= 1) {
//             isTransitioning.current = true

//             if (circularRevealRef.current) {
//               gsap.fromTo(
//                 circularRevealRef.current,
//                 { scale: 0, opacity: 0, borderRadius: '50%' },
//                 {
//                   scale: 3,
//                   opacity: 1,
//                   borderRadius: '0%',
//                   duration: 0.6,
//                   ease: 'power3.inOut',
//                   onComplete: () => {
//                     setShowFourthSection(true)
//                     gsap.set(secondSectionRef.current, { display: 'none' })

//                     gsap.to(circularRevealRef.current, {
//                       opacity: 0,
//                       duration: 0.3,
//                       ease: 'power2.out',
//                       onComplete: () => {
//                         isTransitioning.current = false
//                         scrollProgressRef.current = 0

//                         const resetEvent = new CustomEvent('fourthShapeProgress', {
//                           detail: { progress: 0 }
//                         })
//                         window.dispatchEvent(resetEvent)
//                       }
//                     })
//                   }
//                 }
//               )
//             }
//           }
//         } else if (e.deltaY < 0) {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)

//           const event = new CustomEvent('scrollProgress', {
//             detail: { progress: scrollProgressRef.current }
//           })
//           window.dispatchEvent(event)

//           if (scrollProgressRef.current <= 0) {
//             isTransitioning.current = true

//             if (circularRevealRef.current) {
//               gsap.fromTo(
//                 circularRevealRef.current,
//                 { scale: 3, opacity: 0 },
//                 {
//                   scale: 0,
//                   opacity: 1,
//                   borderRadius: '50%',
//                   duration: 0.6,
//                   ease: 'power3.inOut',
//                   onComplete: () => {
//                     setShowSecondSection(false)
//                     gsap.set(heroRef.current, { display: 'block' })
//                     gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
//                     isTransitioning.current = false
//                     scrollProgressRef.current = 1

//                     const resetEvent = new CustomEvent('scrollProgress', {
//                       detail: { progress: 1 }
//                     })
//                     window.dispatchEvent(resetEvent)
//                   }
//                 }
//               )
//             }
//           }
//         }
//       } else if (showFourthSection && !showThirdSection) {
//         // ============ FOURTH SECTION (SLOW - Shape + Image + Hold) ============
//         if (e.deltaY > 0) {
//           // Scroll slow - 0.01 increment (pehle 0.02 tha)
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.01)

//           // Phase 1: 0 to 0.4 -> Shape building
//           const shapeProgress = Math.min(1, scrollProgressRef.current / 0.4)
//           const shapeEvent = new CustomEvent('fourthShapeProgress', {
//             detail: { progress: shapeProgress }
//           })
//           window.dispatchEvent(shapeEvent)

//           // Phase 2: 0.4 to 0.8 -> Image reveal
//           if (scrollProgressRef.current >= 0.4) {
//             const imageProgress = Math.min(1, (scrollProgressRef.current - 0.4) / 0.4)
//             const imageEvent = new CustomEvent('fourthImageProgress', {
//               detail: { progress: imageProgress }
//             })
//             window.dispatchEvent(imageEvent)
//           }

//           // Phase 3: 0.8 to 1 -> Hold (screen par rahe)
//           // Kuch nahi karna - bas scroll continue karo

//           // Transition to ThirdSection only at 100%
//           if (scrollProgressRef.current >= 1) {
//             isTransitioning.current = true

//             if (circularRevealRef.current) {
//               gsap.fromTo(
//                 circularRevealRef.current,
//                 { scale: 0, opacity: 0, borderRadius: '50%' },
//                 {
//                   scale: 3,
//                   opacity: 1,
//                   borderRadius: '0%',
//                   duration: 0.6,
//                   ease: 'power3.inOut',
//                   onComplete: () => {
//                     setShowThirdSection(true)
//                     gsap.set(fourthSectionRef.current, { display: 'none' })

//                     gsap.to(circularRevealRef.current, {
//                       opacity: 0,
//                       duration: 0.3,
//                       ease: 'power2.out',
//                       onComplete: () => {
//                         isTransitioning.current = false
//                         scrollProgressRef.current = 0

//                         const slideEvent = new CustomEvent('thirdSlideProgress', {
//                           detail: { progress: 0 }
//                         })
//                         window.dispatchEvent(slideEvent)
//                       }
//                     })
//                   }
//                 }
//               )
//             }
//           }
//         } else if (e.deltaY < 0) {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.01)

//           const shapeProgress = Math.min(1, scrollProgressRef.current / 0.4)
//           const shapeEvent = new CustomEvent('fourthShapeProgress', {
//             detail: { progress: shapeProgress }
//           })
//           window.dispatchEvent(shapeEvent)

//           if (scrollProgressRef.current >= 0.4) {
//             const imageProgress = Math.min(1, (scrollProgressRef.current - 0.4) / 0.4)
//             const imageEvent = new CustomEvent('fourthImageProgress', {
//               detail: { progress: imageProgress }
//             })
//             window.dispatchEvent(imageEvent)
//           }

//           if (scrollProgressRef.current <= 0) {
//             isTransitioning.current = true

//             if (circularRevealRef.current) {
//               gsap.fromTo(
//                 circularRevealRef.current,
//                 { scale: 3, opacity: 0 },
//                 {
//                   scale: 0,
//                   opacity: 1,
//                   borderRadius: '50%',
//                   duration: 0.6,
//                   ease: 'power3.inOut',
//                   onComplete: () => {
//                     setShowFourthSection(false)
//                     setShowSecondSection(true)
//                     gsap.set(fourthSectionRef.current, { display: 'none' })
//                     gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
//                     isTransitioning.current = false
//                     scrollProgressRef.current = 1

//                     const resetEvent = new CustomEvent('scrollProgress', {
//                       detail: { progress: 1 }
//                     })
//                     window.dispatchEvent(resetEvent)
//                   }
//                 }
//               )
//             }
//           }
//         }
//       } else if (showThirdSection) {
//         // ============ THIRD SECTION ============
//         if (e.deltaY > 0) {
//           if (scrollProgressRef.current < 0.5) {
//             scrollProgressRef.current = Math.min(0.5, scrollProgressRef.current + 0.015)

//             const slideProgress = scrollProgressRef.current / 0.5
//             const yPos = (1 - slideProgress) * 100

//             gsap.to(thirdSectionRef.current, {
//               y: `${yPos}%`,
//               duration: 0.08,
//               ease: 'power2.out',
//               overwrite: 'auto',
//             })

//             const slideEvent = new CustomEvent('thirdSlideProgress', {
//               detail: { progress: slideProgress }
//             })
//             window.dispatchEvent(slideEvent)
//           } else {
//             scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.015)

//             const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5

//             const hEvent = new CustomEvent('thirdHorizontalProgress', {
//               detail: { progress: horizontalProgress }
//             })
//             window.dispatchEvent(hEvent)
//           }
//         } else if (e.deltaY < 0) {
//           if (scrollProgressRef.current > 0.5) {
//             scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - 0.015)

//             const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5

//             const hEvent = new CustomEvent('thirdHorizontalProgress', {
//               detail: { progress: horizontalProgress }
//             })
//             window.dispatchEvent(hEvent)
//           } else {
//             if (scrollProgressRef.current > 0) {
//               scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.015)

//               const slideProgress = scrollProgressRef.current / 0.5
//               const yPos = (1 - slideProgress) * 100

//               gsap.to(thirdSectionRef.current, {
//                 y: `${yPos}%`,
//                 duration: 0.08,
//                 ease: 'power2.out',
//                 overwrite: 'auto',
//               })

//               const slideEvent = new CustomEvent('thirdSlideProgress', {
//                 detail: { progress: slideProgress }
//               })
//               window.dispatchEvent(slideEvent)

//               if (scrollProgressRef.current <= 0) {
//                 isTransitioning.current = true

//                 if (circularRevealRef.current) {
//                   gsap.fromTo(
//                     circularRevealRef.current,
//                     { scale: 3, opacity: 0 },
//                     {
//                       scale: 0,
//                       opacity: 1,
//                       borderRadius: '50%',
//                       duration: 0.6,
//                       ease: 'power3.inOut',
//                       onComplete: () => {
//                         setShowThirdSection(false)
//                         setShowFourthSection(true)
//                         gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
//                         isTransitioning.current = false
//                         scrollProgressRef.current = 1

//                         const resetEvent = new CustomEvent('fourthShapeProgress', {
//                           detail: { progress: 1 }
//                         })
//                         window.dispatchEvent(resetEvent)
//                       }
//                     }
//                   )
//                 }
//               }
//             }
//           }
//         }
//       }
//     }

//     window.addEventListener('wheel', handleWheel, { passive: false })
//     return () => window.removeEventListener('wheel', handleWheel)
//   }, [showSecondSection, showFourthSection, showThirdSection, loading])

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (loading || isTransitioning.current) return

//       if (e.key === 'ArrowDown') {
//         e.preventDefault()
//         targetScrollDown()
//       } else if (e.key === 'ArrowUp') {
//         e.preventDefault()
//         targetScrollUp()
//       }
//     }

//     const targetScrollDown = () => {
//       if (!showSecondSection && !showFourthSection && !showThirdSection) {
//         scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showSecondSection && !showFourthSection && !showThirdSection) {
//         scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showFourthSection && !showThirdSection) {
//         // Slow scroll - 0.01 increment
//         scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.01)
        
//         const shapeProgress = Math.min(1, scrollProgressRef.current / 0.4)
//         window.dispatchEvent(new CustomEvent('fourthShapeProgress', { detail: { progress: shapeProgress } }))
        
//         if (scrollProgressRef.current >= 0.4) {
//           const imageProgress = Math.min(1, (scrollProgressRef.current - 0.4) / 0.4)
//           window.dispatchEvent(new CustomEvent('fourthImageProgress', { detail: { progress: imageProgress } }))
//         }
//       } else if (showThirdSection) {
//         if (scrollProgressRef.current < 0.5) {
//           scrollProgressRef.current = Math.min(0.5, scrollProgressRef.current + 0.015)
//           const slideProgress = scrollProgressRef.current / 0.5
//           gsap.to(thirdSectionRef.current, {
//             y: `${(1 - slideProgress) * 100}%`,
//             duration: 0.08,
//             ease: 'power2.out',
//             overwrite: 'auto',
//           })
//           window.dispatchEvent(new CustomEvent('thirdSlideProgress', { detail: { progress: slideProgress } }))
//         } else {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.015)
//           const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
//           window.dispatchEvent(new CustomEvent('thirdHorizontalProgress', { detail: { progress: horizontalProgress } }))
//         }
//       }
//     }

//     const targetScrollUp = () => {
//       if (!showSecondSection && !showFourthSection && !showThirdSection) {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.1)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showSecondSection && !showFourthSection && !showThirdSection) {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showFourthSection && !showThirdSection) {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.01)
        
//         const shapeProgress = Math.min(1, scrollProgressRef.current / 0.4)
//         window.dispatchEvent(new CustomEvent('fourthShapeProgress', { detail: { progress: shapeProgress } }))
        
//         if (scrollProgressRef.current >= 0.4) {
//           const imageProgress = Math.min(1, (scrollProgressRef.current - 0.4) / 0.4)
//           window.dispatchEvent(new CustomEvent('fourthImageProgress', { detail: { progress: imageProgress } }))
//         }
//       } else if (showThirdSection) {
//         if (scrollProgressRef.current > 0.5) {
//           scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - 0.015)
//           const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
//           window.dispatchEvent(new CustomEvent('thirdHorizontalProgress', { detail: { progress: horizontalProgress } }))
//         } else if (scrollProgressRef.current > 0) {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.015)
//           const slideProgress = scrollProgressRef.current / 0.5
//           gsap.to(thirdSectionRef.current, {
//             y: `${(1 - slideProgress) * 100}%`,
//             duration: 0.08,
//             ease: 'power2.out',
//             overwrite: 'auto',
//           })
//           window.dispatchEvent(new CustomEvent('thirdSlideProgress', { detail: { progress: slideProgress } }))
//         }
//       }
//     }

//     window.addEventListener('keydown', handleKeyDown)
//     return () => window.removeEventListener('keydown', handleKeyDown)
//   }, [showSecondSection, showFourthSection, showThirdSection, loading])

//   return (
//     <main className="main-container">
//       {!loading && <CursorTrail />}
//       {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

//       {showHero && (
//         <>
//           <div ref={heroRef} className="hero-wrapper">
//             <HeroSection />
//           </div>

//           {showSecondSection && (
//             <div ref={secondSectionRef} className="second-section-wrapper">
//               <SecondSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showFourthSection && (
//             <div ref={fourthSectionRef} className="fourth-section-wrapper">
//               <FourthSection />
//             </div>
//           )}

//           {showThirdSection && (
//             <div ref={thirdSectionRef} className="third-section-wrapper">
//               <ThirdSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           <div
//             ref={circularRevealRef}
//             className="circular-reveal-overlay"
//             style={{
//               position: 'fixed',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               width: '100vw',
//               height: '100vh',
//               background: 'var(--color-black)',
//               zIndex: 9,
//               pointerEvents: 'none',
//               opacity: 0,
//               scale: 0,
//             }}
//           />
//         </>
//       )}
//     </main>
//   )
// }

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
//   const lightningRef = useRef(null)
//   const circularRevealRef = useRef(null)

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
//         // ============ HERO SECTION ============
//         if (e.deltaY > 0) {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)

//           const event = new CustomEvent('scrollProgress', {
//             detail: { progress: scrollProgressRef.current }
//           })
//           window.dispatchEvent(event)

//           if (scrollProgressRef.current >= 1) {
//             isTransitioning.current = true

//             // Lightning wipe effect - left se right
//             if (lightningRef.current) {
//               gsap.fromTo(
//                 lightningRef.current,
//                 { x: '-100%', opacity: 0 },
//                 {
//                   x: '0%',
//                   opacity: 1,
//                   duration: 0.4,
//                   ease: 'power3.inOut',
//                   onComplete: () => {
//                     gsap.set(heroRef.current, { display: 'none' })
//                     setShowSecondSection(true)

//                     gsap.to(lightningRef.current, {
//                       x: '100%',
//                       opacity: 0,
//                       duration: 0.4,
//                       ease: 'power3.inOut',
//                       onComplete: () => {
//                         isTransitioning.current = false
//                         scrollProgressRef.current = 0

//                         const resetEvent = new CustomEvent('scrollProgress', {
//                           detail: { progress: 0 }
//                         })
//                         window.dispatchEvent(resetEvent)
//                       }
//                     })
//                   }
//                 }
//               )
//             }
//           }
//         } else {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.1)

//           const event = new CustomEvent('scrollProgress', {
//             detail: { progress: scrollProgressRef.current }
//           })
//           window.dispatchEvent(event)
//         }
//       } else if (showSecondSection && !showThirdSection) {
//         // ============ SECOND SECTION ============
//         if (e.deltaY > 0) {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)

//           const event = new CustomEvent('scrollProgress', {
//             detail: { progress: scrollProgressRef.current }
//           })
//           window.dispatchEvent(event)

//           if (scrollProgressRef.current >= 1) {
//             isTransitioning.current = true

//             if (circularRevealRef.current) {
//               gsap.fromTo(
//                 circularRevealRef.current,
//                 { scale: 0, opacity: 0, borderRadius: '50%' },
//                 {
//                   scale: 3,
//                   opacity: 1,
//                   borderRadius: '0%',
//                   duration: 0.6,
//                   ease: 'power3.inOut',
//                   onComplete: () => {
//                     setShowThirdSection(true)

//                     requestAnimationFrame(() => {
//                       if (thirdSectionRef.current) {
//                         gsap.set(thirdSectionRef.current, { y: '100%' })
//                       }

//                       gsap.to(circularRevealRef.current, {
//                         opacity: 0,
//                         duration: 0.3,
//                         ease: 'power2.out',
//                         onComplete: () => {
//                           isTransitioning.current = false
//                           scrollProgressRef.current = 0

//                           // ✅ third section ki initial state (slide progress 0) explicitly bhej do
//                           const slideEvent = new CustomEvent('thirdSlideProgress', {
//                             detail: { progress: 0 }
//                           })
//                           window.dispatchEvent(slideEvent)
//                         }
//                       })
//                     })
//                   }
//                 }
//               )
//             }
//           }
//         } else if (e.deltaY < 0) {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)

//           const event = new CustomEvent('scrollProgress', {
//             detail: { progress: scrollProgressRef.current }
//           })
//           window.dispatchEvent(event)

//           if (scrollProgressRef.current <= 0) {
//             isTransitioning.current = true

//             if (lightningRef.current) {
//               gsap.fromTo(
//                 lightningRef.current,
//                 { x: '100%', opacity: 0 },
//                 {
//                   x: '0%',
//                   opacity: 1,
//                   duration: 0.4,
//                   ease: 'power3.inOut',
//                   onComplete: () => {
//                     setShowSecondSection(false)
//                     gsap.set(heroRef.current, { display: 'block' })

//                     gsap.to(lightningRef.current, {
//                       x: '-100%',
//                       opacity: 0,
//                       duration: 0.4,
//                       ease: 'power3.inOut',
//                       onComplete: () => {
//                         isTransitioning.current = false
//                         scrollProgressRef.current = 1
//                       }
//                     })
//                   }
//                 }
//               )
//             }
//           }
//         }
//       } else if (showThirdSection) {
//         // ============ THIRD SECTION ============
//         if (e.deltaY > 0) {
//           // Scroll down
//           if (scrollProgressRef.current < 0.5) {
//             // Phase 1: Slide up + zoom
//             scrollProgressRef.current = Math.min(0.5, scrollProgressRef.current + 0.015)

//             const slideProgress = scrollProgressRef.current / 0.5
//             const yPos = (1 - slideProgress) * 100

//             gsap.to(thirdSectionRef.current, {
//               y: `${yPos}%`,
//               duration: 0.08,
//               ease: 'power2.out',
//               overwrite: 'auto',
//             })

//             // ✅ sirf slide/zoom listeners ke liye
//             const slideEvent = new CustomEvent('thirdSlideProgress', {
//               detail: { progress: slideProgress }
//             })
//             window.dispatchEvent(slideEvent)
//           } else {
//             // Phase 2: Horizontal scroll
//             scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.015)

//             const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5

//             // ✅ sirf horizontal slider ke liye — ab slide event se conflict nahi karega
//             const hEvent = new CustomEvent('thirdHorizontalProgress', {
//               detail: { progress: horizontalProgress }
//             })
//             window.dispatchEvent(hEvent)
//           }
//         } else if (e.deltaY < 0) {
//           // Scroll up
//           if (scrollProgressRef.current > 0.5) {
//             // Phase 2 reverse
//             scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - 0.015)

//             const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5

//             const hEvent = new CustomEvent('thirdHorizontalProgress', {
//               detail: { progress: horizontalProgress }
//             })
//             window.dispatchEvent(hEvent)
//           } else {
//             // Phase 1 reverse: Slide down + zoom back in
//             if (scrollProgressRef.current > 0) {
//               scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.015)

//               const slideProgress = scrollProgressRef.current / 0.5
//               const yPos = (1 - slideProgress) * 100

//               gsap.to(thirdSectionRef.current, {
//                 y: `${yPos}%`,
//                 duration: 0.08,
//                 ease: 'power2.out',
//                 overwrite: 'auto',
//               })

//               const slideEvent = new CustomEvent('thirdSlideProgress', {
//                 detail: { progress: slideProgress }
//               })
//               window.dispatchEvent(slideEvent)

//               if (scrollProgressRef.current <= 0) {
//                 isTransitioning.current = true

//                 if (circularRevealRef.current) {
//                   gsap.fromTo(
//                     circularRevealRef.current,
//                     { scale: 3, opacity: 0 },
//                     {
//                       scale: 0,
//                       opacity: 1,
//                       borderRadius: '50%',
//                       duration: 0.6,
//                       ease: 'power3.inOut',
//                       onComplete: () => {
//                         setShowThirdSection(false)
//                         gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
//                         isTransitioning.current = false
//                         scrollProgressRef.current = 1

//                         const resetEvent = new CustomEvent('scrollProgress', {
//                           detail: { progress: 1 }
//                         })
//                         window.dispatchEvent(resetEvent)
//                       }
//                     }
//                   )
//                 }
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

//       if (e.key === 'ArrowDown') {
//         e.preventDefault()
//         targetScrollDown()
//       } else if (e.key === 'ArrowUp') {
//         e.preventDefault()
//         targetScrollUp()
//       }
//     }

//     const targetScrollDown = () => {
//       if (!showSecondSection && !showThirdSection) {
//         scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showSecondSection && !showThirdSection) {
//         scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showThirdSection) {
//         if (scrollProgressRef.current < 0.5) {
//           scrollProgressRef.current = Math.min(0.5, scrollProgressRef.current + 0.015)
//           const slideProgress = scrollProgressRef.current / 0.5
//           gsap.to(thirdSectionRef.current, {
//             y: `${(1 - slideProgress) * 100}%`,
//             duration: 0.08,
//             ease: 'power2.out',
//             overwrite: 'auto',
//           })
//           window.dispatchEvent(new CustomEvent('thirdSlideProgress', { detail: { progress: slideProgress } }))
//         } else {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.015)
//           const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
//           window.dispatchEvent(new CustomEvent('thirdHorizontalProgress', { detail: { progress: horizontalProgress } }))
//         }
//       }
//     }

//     const targetScrollUp = () => {
//       if (!showSecondSection && !showThirdSection) {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.1)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showSecondSection && !showThirdSection) {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showThirdSection) {
//         if (scrollProgressRef.current > 0.5) {
//           scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - 0.015)
//           const horizontalProgress = (scrollProgressRef.current - 0.5) / 0.5
//           window.dispatchEvent(new CustomEvent('thirdHorizontalProgress', { detail: { progress: horizontalProgress } }))
//         } else if (scrollProgressRef.current > 0) {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.015)
//           const slideProgress = scrollProgressRef.current / 0.5
//           gsap.to(thirdSectionRef.current, {
//             y: `${(1 - slideProgress) * 100}%`,
//             duration: 0.08,
//             ease: 'power2.out',
//             overwrite: 'auto',
//           })
//           window.dispatchEvent(new CustomEvent('thirdSlideProgress', { detail: { progress: slideProgress } }))
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
//           <div ref={heroRef} className="hero-wrapper">
//             <HeroSection />
//           </div>

//           {showSecondSection && (
//             <div ref={secondSectionRef} className="second-section-wrapper">
//               <SecondSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showThirdSection && (
//             <div ref={thirdSectionRef} className="third-section-wrapper">
//               <ThirdSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           <div
//             ref={lightningRef}
//             className="lightning-overlay"
//             style={{
//               position: 'fixed',
//               top: 0,
//               left: 0,
//               width: '100%',
//               height: '100vh',
//               // background: 'linear-gradient(90deg, transparent, rgba(2, 112, 234, 0.3), rgba(0, 0, 0, 0.5), rgba(2, 112, 234, 0.3), transparent)',
//               background: 'linear-gradient(90deg, transparent,rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5), rgba(2, 112, 234, 0.2),rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5), transparent)',
//               zIndex: 10,
//               pointerEvents: 'none',
//               opacity: 0,
//               filter: 'blur(2px)',
//             }}
//           />

//           <div
//             ref={circularRevealRef}
//             className="circular-reveal-overlay"
//             style={{
//               position: 'fixed',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               width: '100vw',
//               height: '100vh',
//               background: 'var(--color-black)',
//               zIndex: 9,
//               pointerEvents: 'none',
//               opacity: 0,
//               scale: 0,
//             }}
//           />
//         </>
//       )}
//     </main>
//   )
// }
