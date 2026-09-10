'use client'
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import HeroSection from '@/components/HeroSection/HeroSection'
import SecondSection from '@/components/SecondSection/SecondSection'
import FourthSection from '@/components/FourthSection/FourthSection'
import CapabilitySection from '@/components/CapabilitySection/CapabilitySection'
import ProcessSection from '@/components/ProcessSection/ProcessSection'
import ThirdSection from '@/components/ThirdSection/ThirdSection'
import QualitySection from '@/components/QualitySection/QualitySection'
import CursorTrail from '@/components/CursorTrail/CursorTrail'

const HERO_STEP = 0.08
const SECOND_STEP = 0.015
const FOURTH_STEP = 0.012
const CAPABILITY_STEP = 0.015
const PROCESS_STEP = 0.015
const THIRD_STEP = 0.012 // Smoother, more controlled step size
const QUALITY_STEP = 0.02

const CAPABILITY_SPLIT = 0.4
const PROCESS_SPLIT = 0.4
const FOURTH_SPLIT = 0.5 
const THIRD_SPLIT = 0.35 // Clean split for vertical intro vs horizontal scroll

const clamp01 = (v) => Math.max(0, Math.min(1, v))
const dispatch = (name, progress) => {
  window.dispatchEvent(new CustomEvent(name, { detail: { progress } }))
}

const stackedWrapperStyle = (z) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  minHeight: '100dvh',
  height: 'auto',
  zIndex: z,
  backgroundColor: 'var(--color-black, #0a0a0a)',
  willChange: 'transform, opacity',
})

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [showHero, setShowHero] = useState(false)

  const [showSecond, setShowSecond] = useState(false)
  const [showFourth, setShowFourth] = useState(false)
  const [showCapability, setShowCapability] = useState(false)
  const [showProcess, setShowProcess] = useState(false)
  const [showThird, setShowThird] = useState(false)
  const [showQuality, setShowQuality] = useState(false)

  const scrollProgressRef = useRef(0)
  const isTransitioning = useRef(false)

  const heroRef = useRef(null)
  const secondRef = useRef(null)
  const fourthRef = useRef(null)
  const capabilityRef = useRef(null)
  const processRef = useRef(null)
  const thirdRef = useRef(null)
  const qualityRef = useRef(null)

  const circularRevealRef = useRef(null) 
  const fadeOverlayRef = useRef(null)        

  const handleLoadingComplete = () => {
    setLoading(false)
    setShowHero(true)
  }

  const slideParallax = (overRef, underRef, progress) => {
    if (overRef?.current) {
      gsap.to(overRef.current, {
        y: `${(1 - progress) * 100}%`,
        duration: 0.1,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
    if (underRef?.current) {
      gsap.to(underRef.current, {
        y: `${-8 * progress}%`,
        opacity: 1 - 0.3 * progress,
        scale: 1 - 0.03 * progress,
        duration: 0.1,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
  }

  const resetParallaxUnder = (underRef) => {
    if (underRef?.current) {
      gsap.set(underRef.current, { y: '0%', opacity: 1, scale: 1 })
    }
  }

  const runFade = (onSwap) => {
    isTransitioning.current = true
    const tl = gsap.timeline({
      onComplete: () => { isTransitioning.current = false }
    })
    tl.to(fadeOverlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.inOut' })
      .add(onSwap)
      .to(fadeOverlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.inOut' })
  }

  const handleScrollStep = (direction, factor) => {
    if (loading || isTransitioning.current) return

    if (!showSecond) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + HERO_STEP * factor)
        dispatch('scrollProgress', scrollProgressRef.current)

        if (scrollProgressRef.current >= 1) {
          setShowSecond(true)
          scrollProgressRef.current = 0
          requestAnimationFrame(() => {
            if (secondRef.current) gsap.set(secondRef.current, { y: '100%' })
          })
        }
      } else {
        scrollProgressRef.current = clamp01(scrollProgressRef.current - HERO_STEP * factor)
        dispatch('scrollProgress', scrollProgressRef.current)
      }
      return
    }

    if (showSecond && !showFourth) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + SECOND_STEP * factor)

        if (scrollProgressRef.current <= 0.5) {
          slideParallax(secondRef, heroRef, scrollProgressRef.current / 0.5)
        } else {
          slideParallax(secondRef, heroRef, 1)
          dispatch('secondTextProgress', (scrollProgressRef.current - 0.5) / 0.5)
        }

        if (scrollProgressRef.current >= 1) {
          runFade(() => {
            setShowFourth(true)
            scrollProgressRef.current = 0
            requestAnimationFrame(() => {
              if (fourthRef.current) gsap.set(fourthRef.current, { y: '0%', opacity: 1 })
            })
          })
        }
      } else {
        if (scrollProgressRef.current > 0.5) {
          scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - SECOND_STEP * factor)
          dispatch('secondTextProgress', clamp01((scrollProgressRef.current - 0.5) / 0.5))
        } else {
          scrollProgressRef.current = Math.max(0, scrollProgressRef.current - SECOND_STEP * factor)
          slideParallax(secondRef, heroRef, scrollProgressRef.current / 0.5)

          if (scrollProgressRef.current <= 0) {
            setShowSecond(false)
            resetParallaxUnder(heroRef)
            scrollProgressRef.current = 1
            dispatch('scrollProgress', 1)
          }
        }
      }
      return
    }

    if (showFourth && !showCapability) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + FOURTH_STEP * factor)

        if (scrollProgressRef.current <= FOURTH_SPLIT) {
          dispatch('fourthShapeProgress', scrollProgressRef.current / FOURTH_SPLIT)
        } else {
          dispatch('fourthShapeProgress', 1)
          dispatch('fourthImageProgress', (scrollProgressRef.current - FOURTH_SPLIT) / (1 - FOURTH_SPLIT))
        }

        if (scrollProgressRef.current >= 1) {
          setShowCapability(true)
          scrollProgressRef.current = 0
          requestAnimationFrame(() => {
            if (capabilityRef.current) gsap.set(capabilityRef.current, { y: '100%' })
          })
        }
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - FOURTH_STEP * factor)

        if (scrollProgressRef.current <= FOURTH_SPLIT) {
          dispatch('fourthShapeProgress', scrollProgressRef.current / FOURTH_SPLIT)
          dispatch('fourthImageProgress', 0)
        } else {
          dispatch('fourthImageProgress', (scrollProgressRef.current - FOURTH_SPLIT) / (1 - FOURTH_SPLIT))
        }

        if (scrollProgressRef.current <= 0) {
          runFade(() => {
            setShowFourth(false)
            scrollProgressRef.current = 1
            dispatch('secondTextProgress', 1)
          })
        }
      }
      return
    }

    if (showCapability && !showProcess) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + CAPABILITY_STEP * factor)

        if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
          slideParallax(capabilityRef, fourthRef, scrollProgressRef.current / CAPABILITY_SPLIT)
        } else {
          slideParallax(capabilityRef, fourthRef, 1)
          dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
        }

        if (scrollProgressRef.current >= 1) {
          setShowProcess(true)
          scrollProgressRef.current = 0
          requestAnimationFrame(() => {
            if (processRef.current) gsap.set(processRef.current, { y: '100%' })
          })
        }
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - CAPABILITY_STEP * factor)

        if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
          slideParallax(capabilityRef, fourthRef, scrollProgressRef.current / CAPABILITY_SPLIT)
          dispatch('capabilityProgress', 0)
        } else {
          dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
        }

        if (scrollProgressRef.current <= 0) {
          setShowCapability(false)
          resetParallaxUnder(fourthRef)
          scrollProgressRef.current = 1
          dispatch('fourthShapeProgress', 1)
          dispatch('fourthImageProgress', 1)
        }
      }
      return
    }

    if (showProcess && !showThird) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + PROCESS_STEP * factor)

        if (scrollProgressRef.current <= PROCESS_SPLIT) {
          slideParallax(processRef, capabilityRef, scrollProgressRef.current / PROCESS_SPLIT)
        } else {
          slideParallax(processRef, capabilityRef, 1)
          dispatch('processProgress', (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT))
        }

        if (scrollProgressRef.current >= 1) {
          setShowThird(true)
          scrollProgressRef.current = 0
          requestAnimationFrame(() => {
            if (thirdRef.current) gsap.set(thirdRef.current, { y: '100%' })
          })
          dispatch('thirdSlideProgress', 0)
        }
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - PROCESS_STEP * factor)

        if (scrollProgressRef.current <= PROCESS_SPLIT) {
          slideParallax(processRef, capabilityRef, scrollProgressRef.current / PROCESS_SPLIT)
          dispatch('processProgress', 0)
        } else {
          dispatch('processProgress', (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT))
        }

        if (scrollProgressRef.current <= 0) {
          setShowProcess(false)
          resetParallaxUnder(capabilityRef)
          scrollProgressRef.current = 1
          dispatch('capabilityProgress', 1)
        }
      }
      return
    }

    if (showThird && !showQuality) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + THIRD_STEP * factor)

        if (scrollProgressRef.current <= THIRD_SPLIT) {
          // Phase 1: Clean Slide Up Parallax for ThirdSection over ProcessSection
          slideParallax(thirdRef, processRef, scrollProgressRef.current / THIRD_SPLIT)
          dispatch('thirdSlideProgress', scrollProgressRef.current / THIRD_SPLIT)
        } else {
          // Phase 2: Horizontal Scroll Phase
          slideParallax(thirdRef, processRef, 1)
          dispatch('thirdSlideProgress', 1)
          dispatch('thirdHorizontalProgress', (scrollProgressRef.current - THIRD_SPLIT) / (1 - THIRD_SPLIT))
        }

        if (scrollProgressRef.current >= 1) {
          setShowQuality(true)
          scrollProgressRef.current = 0
          requestAnimationFrame(() => {
            if (qualityRef.current) gsap.set(qualityRef.current, { y: '100%' })
          })
        }
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - THIRD_STEP * factor)

        if (scrollProgressRef.current <= THIRD_SPLIT) {
          slideParallax(thirdRef, processRef, scrollProgressRef.current / THIRD_SPLIT)
          dispatch('thirdSlideProgress', scrollProgressRef.current / THIRD_SPLIT)
          dispatch('thirdHorizontalProgress', 0)
        } else {
          slideParallax(thirdRef, processRef, 1)
          dispatch('thirdSlideProgress', 1)
          dispatch('thirdHorizontalProgress', (scrollProgressRef.current - THIRD_SPLIT) / (1 - THIRD_SPLIT))
        }

        if (scrollProgressRef.current <= 0) {
          setShowThird(false)
          resetParallaxUnder(processRef)
          scrollProgressRef.current = 1
          dispatch('processProgress', 1)
        }
      }
      return
    }

    if (showQuality) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + QUALITY_STEP * factor)

        if (scrollProgressRef.current <= 0.4) {
          slideParallax(qualityRef, thirdRef, scrollProgressRef.current / 0.4)
        } else {
          slideParallax(qualityRef, thirdRef, 1)
          dispatch('qualityProgress', (scrollProgressRef.current - 0.4) / 0.6)
        }
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - QUALITY_STEP * factor)

        if (scrollProgressRef.current <= 0.4) {
          slideParallax(qualityRef, thirdRef, scrollProgressRef.current / 0.4)
          dispatch('qualityProgress', 0)
        } else {
          dispatch('qualityProgress', (scrollProgressRef.current - 0.4) / 0.6)
        }

        if (scrollProgressRef.current <= 0) {
          setShowQuality(false)
          resetParallaxUnder(thirdRef)
          scrollProgressRef.current = 1
          dispatch('thirdHorizontalProgress', 1)
        }
      }
      return
    }
  }

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      if (loading || isTransitioning.current) return

      const direction = e.deltaY > 0 ? 1 : -1
      const magnitude = Math.min(Math.abs(e.deltaY), 100)
      const factor = Math.max(0.25, magnitude / 60)

      handleScrollStep(direction, factor)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [showSecond, showFourth, showCapability, showProcess, showThird, showQuality, loading])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading || isTransitioning.current) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        handleScrollStep(1, 1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        handleScrollStep(-1, 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSecond, showFourth, showCapability, showProcess, showThird, showQuality, loading])

  return (
    <main className="main-container" style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>
      {!loading && <CursorTrail />}
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {showHero && (
        <div style={{ position: 'relative', width: '100%', height: '100dvh' }}>
          <div ref={heroRef} className="hero-wrapper" style={stackedWrapperStyle(1)}>
            <HeroSection />
          </div>

          {showSecond && (
            <div ref={secondRef} className="second-section-wrapper" style={stackedWrapperStyle(2)}>
              <SecondSection scrollProgressRef={scrollProgressRef} />
            </div>
          )}

          {showFourth && (
            <div ref={fourthRef} className="fourth-section-wrapper" style={stackedWrapperStyle(3)}>
              <FourthSection scrollProgressRef={scrollProgressRef} />
            </div>
          )}

          {showCapability && (
            <div ref={capabilityRef} className="capability-section-wrapper" style={stackedWrapperStyle(4)}>
              <CapabilitySection scrollProgressRef={scrollProgressRef} />
            </div>
          )}

          {showProcess && (
            <div ref={processRef} className="process-section-wrapper" style={stackedWrapperStyle(5)}>
              <ProcessSection scrollProgressRef={scrollProgressRef} />
            </div>
          )}

          {showThird && (
            <div ref={thirdRef} className="third-section-wrapper" style={stackedWrapperStyle(6)}>
              <ThirdSection scrollProgressRef={scrollProgressRef} />
            </div>
          )}

          {showQuality && (
            <div ref={qualityRef} className="quality-section-wrapper" style={stackedWrapperStyle(7)}>
              <QualitySection scrollProgressRef={scrollProgressRef} />
            </div>
          )}

          <div
            ref={fadeOverlayRef}
            className="fade-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              width: '100%',
              height: '100dvh',
              zIndex: 11,
              pointerEvents: 'none',
              background: 'var(--color-black, #0a0a0a)',
              opacity: 0,
            }}
          />
        </div>
      )}
    </main>
  )
}




// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

// 'use client'
// import { useState, useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
// import HeroSection from '@/components/HeroSection/HeroSection'
// import SecondSection from '@/components/SecondSection/SecondSection'
// import FourthSection from '@/components/FourthSection/FourthSection'
// import CapabilitySection from '@/components/CapabilitySection/CapabilitySection'
// import ProcessSection from '@/components/ProcessSection/ProcessSection'
// import ThirdSection from '@/components/ThirdSection/ThirdSection'
// import QualitySection from '@/components/QualitySection/QualitySection'
// import CursorTrail from '@/components/CursorTrail/CursorTrail'

// const HERO_STEP = 0.08
// const SECOND_STEP = 0.015
// const FOURTH_STEP = 0.012
// const CAPABILITY_STEP = 0.015
// const PROCESS_STEP = 0.015
// const THIRD_STEP = 0.015
// const QUALITY_STEP = 0.02

// const CAPABILITY_SPLIT = 0.4
// const PROCESS_SPLIT = 0.4
// const FOURTH_SPLIT = 0.5 

// const clamp01 = (v) => Math.max(0, Math.min(1, v))
// const dispatch = (name, progress) => {
//   window.dispatchEvent(new CustomEvent(name, { detail: { progress } }))
// }

// const stackedWrapperStyle = (z) => ({
//   position: 'absolute',
//   top: 0,
//   left: 0,
//   width: '100%',
//   minHeight: '100dvh',
//   height: 'auto',
//   zIndex: z,
//   backgroundColor: 'var(--color-black, #0a0a0a)',
//   willChange: 'transform, opacity',
// })

// export default function Home() {
//   const [loading, setLoading] = useState(true)
//   const [showHero, setShowHero] = useState(false)

//   const [showSecond, setShowSecond] = useState(false)
//   const [showFourth, setShowFourth] = useState(false)
//   const [showCapability, setShowCapability] = useState(false)
//   const [showProcess, setShowProcess] = useState(false)
//   const [showThird, setShowThird] = useState(false)
//   const [showQuality, setShowQuality] = useState(false)

//   const scrollProgressRef = useRef(0)
//   const isTransitioning = useRef(false)

//   const heroRef = useRef(null)
//   const secondRef = useRef(null)
//   const fourthRef = useRef(null)
//   const capabilityRef = useRef(null)
//   const processRef = useRef(null)
//   const thirdRef = useRef(null)
//   const qualityRef = useRef(null)

//   const circularRevealRef = useRef(null) 
//   const fadeOverlayRef = useRef(null)     

//   const handleLoadingComplete = () => {
//     setLoading(false)
//     setShowHero(true)
//   }

//   const slideParallax = (overRef, underRef, progress) => {
//     if (overRef?.current) {
//       gsap.to(overRef.current, {
//         y: `${(1 - progress) * 100}%`,
//         duration: 0.1,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }
//     if (underRef?.current) {
//       gsap.to(underRef.current, {
//         y: `${-8 * progress}%`,
//         opacity: 1 - 0.3 * progress,
//         scale: 1 - 0.03 * progress,
//         duration: 0.1,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }
//   }

//   const resetParallaxUnder = (underRef) => {
//     if (underRef?.current) {
//       gsap.set(underRef.current, { y: '0%', opacity: 1, scale: 1 })
//     }
//   }

//   const runFade = (onSwap) => {
//     isTransitioning.current = true
//     const tl = gsap.timeline({
//       onComplete: () => { isTransitioning.current = false }
//     })
//     tl.to(fadeOverlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.inOut' })
//       .add(onSwap)
//       .to(fadeOverlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.inOut' })
//   }

//   const runCircularReveal = (onEnter) => {
//     isTransitioning.current = true
//     if (!circularRevealRef.current) return
//     gsap.fromTo(
//       circularRevealRef.current,
//       { scale: 0, opacity: 0, borderRadius: '50%' },
//       {
//         scale: 3,
//         opacity: 1,
//         borderRadius: '0%',
//         duration: 0.5,
//         ease: 'power3.inOut',
//         onComplete: () => {
//           onEnter()
//           gsap.to(circularRevealRef.current, {
//             opacity: 0,
//             duration: 0.25,
//             ease: 'power2.out',
//             onComplete: () => {
//               isTransitioning.current = false
//               gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
//             }
//           })
//         }
//       }
//     )
//   }

//   const runCircularRevealBack = (onLeave) => {
//     isTransitioning.current = true
//     if (!circularRevealRef.current) return
//     gsap.fromTo(
//       circularRevealRef.current,
//       { scale: 3, opacity: 0 },
//       {
//         scale: 0,
//         opacity: 1,
//         borderRadius: '50%',
//         duration: 0.5,
//         ease: 'power3.inOut',
//         onComplete: () => {
//           onLeave()
//           gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
//           isTransitioning.current = false
//         }
//       }
//     )
//   }

//   const handleScrollStep = (direction, factor) => {
//     if (loading || isTransitioning.current) return

//     if (!showSecond) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + HERO_STEP * factor)
//         dispatch('scrollProgress', scrollProgressRef.current)

//         if (scrollProgressRef.current >= 1) {
//           setShowSecond(true)
//           scrollProgressRef.current = 0
//           requestAnimationFrame(() => {
//             if (secondRef.current) gsap.set(secondRef.current, { y: '100%' })
//           })
//         }
//       } else {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current - HERO_STEP * factor)
//         dispatch('scrollProgress', scrollProgressRef.current)
//       }
//       return
//     }

//     if (showSecond && !showFourth) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + SECOND_STEP * factor)

//         if (scrollProgressRef.current <= 0.5) {
//           slideParallax(secondRef, heroRef, scrollProgressRef.current / 0.5)
//         } else {
//           slideParallax(secondRef, heroRef, 1)
//           dispatch('secondTextProgress', (scrollProgressRef.current - 0.5) / 0.5)
//         }

//         if (scrollProgressRef.current >= 1) {
//           runFade(() => {
//             setShowFourth(true)
//             scrollProgressRef.current = 0
//             requestAnimationFrame(() => {
//               if (fourthRef.current) gsap.set(fourthRef.current, { y: '0%', opacity: 1 })
//             })
//           })
//         }
//       } else {
//         if (scrollProgressRef.current > 0.5) {
//           scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - SECOND_STEP * factor)
//           dispatch('secondTextProgress', clamp01((scrollProgressRef.current - 0.5) / 0.5))
//         } else {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - SECOND_STEP * factor)
//           slideParallax(secondRef, heroRef, scrollProgressRef.current / 0.5)

//           if (scrollProgressRef.current <= 0) {
//             setShowSecond(false)
//             resetParallaxUnder(heroRef)
//             scrollProgressRef.current = 1
//             dispatch('scrollProgress', 1)
//           }
//         }
//       }
//       return
//     }

//     if (showFourth && !showCapability) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + FOURTH_STEP * factor)

//         if (scrollProgressRef.current <= FOURTH_SPLIT) {
//           dispatch('fourthShapeProgress', scrollProgressRef.current / FOURTH_SPLIT)
//         } else {
//           dispatch('fourthShapeProgress', 1)
//           dispatch('fourthImageProgress', (scrollProgressRef.current - FOURTH_SPLIT) / (1 - FOURTH_SPLIT))
//         }

//         if (scrollProgressRef.current >= 1) {
//           setShowCapability(true)
//           scrollProgressRef.current = 0
//           requestAnimationFrame(() => {
//             if (capabilityRef.current) gsap.set(capabilityRef.current, { y: '100%' })
//           })
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - FOURTH_STEP * factor)

//         if (scrollProgressRef.current <= FOURTH_SPLIT) {
//           dispatch('fourthShapeProgress', scrollProgressRef.current / FOURTH_SPLIT)
//           dispatch('fourthImageProgress', 0)
//         } else {
//           dispatch('fourthImageProgress', (scrollProgressRef.current - FOURTH_SPLIT) / (1 - FOURTH_SPLIT))
//         }

//         if (scrollProgressRef.current <= 0) {
//           runFade(() => {
//             setShowFourth(false)
//             scrollProgressRef.current = 1
//             dispatch('secondTextProgress', 1)
//           })
//         }
//       }
//       return
//     }

//     if (showCapability && !showProcess) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + CAPABILITY_STEP * factor)

//         if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//           slideParallax(capabilityRef, fourthRef, scrollProgressRef.current / CAPABILITY_SPLIT)
//         } else {
//           slideParallax(capabilityRef, fourthRef, 1)
//           dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
//         }

//         if (scrollProgressRef.current >= 1) {
//           setShowProcess(true)
//           scrollProgressRef.current = 0
//           requestAnimationFrame(() => {
//             if (processRef.current) gsap.set(processRef.current, { y: '100%' })
//           })
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - CAPABILITY_STEP * factor)

//         if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//           slideParallax(capabilityRef, fourthRef, scrollProgressRef.current / CAPABILITY_SPLIT)
//           dispatch('capabilityProgress', 0)
//         } else {
//           dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
//         }

//         if (scrollProgressRef.current <= 0) {
//           setShowCapability(false)
//           resetParallaxUnder(fourthRef)
//           scrollProgressRef.current = 1
//           dispatch('fourthShapeProgress', 1)
//           dispatch('fourthImageProgress', 1)
//         }
//       }
//       return
//     }

//     if (showProcess && !showThird) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + PROCESS_STEP * factor)

//         if (scrollProgressRef.current <= PROCESS_SPLIT) {
//           slideParallax(processRef, capabilityRef, scrollProgressRef.current / PROCESS_SPLIT)
//         } else {
//           slideParallax(processRef, capabilityRef, 1)
//           dispatch('processProgress', (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT))
//         }

//         if (scrollProgressRef.current >= 1) {
//           runCircularReveal(() => {
//             setShowThird(true)
//             scrollProgressRef.current = 0
//             requestAnimationFrame(() => {
//               if (thirdRef.current) gsap.set(thirdRef.current, { y: '100%' })
//             })
//             dispatch('thirdSlideProgress', 0)
//           })
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - PROCESS_STEP * factor)

//         if (scrollProgressRef.current <= PROCESS_SPLIT) {
//           slideParallax(processRef, capabilityRef, scrollProgressRef.current / PROCESS_SPLIT)
//           dispatch('processProgress', 0)
//         } else {
//           dispatch('processProgress', (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT))
//         }

//         if (scrollProgressRef.current <= 0) {
//           setShowProcess(false)
//           resetParallaxUnder(capabilityRef)
//           scrollProgressRef.current = 1
//           dispatch('capabilityProgress', 1)
//         }
//       }
//       return
//     }

//     if (showThird && !showQuality) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + THIRD_STEP * factor)

//         if (scrollProgressRef.current <= 0.4) {
//           slideParallax(thirdRef, processRef, scrollProgressRef.current / 0.4)
//           dispatch('thirdSlideProgress', scrollProgressRef.current / 0.4)
//         } else {
//           slideParallax(thirdRef, processRef, 1)
//           dispatch('thirdSlideProgress', 1)
//           dispatch('thirdHorizontalProgress', (scrollProgressRef.current - 0.4) / 0.6)
//         }

//         if (scrollProgressRef.current >= 1) {
//           setShowQuality(true)
//           scrollProgressRef.current = 0
//           requestAnimationFrame(() => {
//             if (qualityRef.current) gsap.set(qualityRef.current, { y: '100%' })
//           })
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - THIRD_STEP * factor)

//         if (scrollProgressRef.current <= 0.4) {
//           slideParallax(thirdRef, processRef, scrollProgressRef.current / 0.4)
//           dispatch('thirdSlideProgress', scrollProgressRef.current / 0.4)
//           dispatch('thirdHorizontalProgress', 0)
//         } else {
//           slideParallax(thirdRef, processRef, 1)
//           dispatch('thirdSlideProgress', 1)
//           dispatch('thirdHorizontalProgress', (scrollProgressRef.current - 0.4) / 0.6)
//         }

//         if (scrollProgressRef.current <= 0) {
//           runCircularRevealBack(() => {
//             setShowThird(false)
//             resetParallaxUnder(processRef)
//             scrollProgressRef.current = 1
//             dispatch('processProgress', 1)
//           })
//         }
//       }
//       return
//     }

//     if (showQuality) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + QUALITY_STEP * factor)

//         if (scrollProgressRef.current <= 0.4) {
//           slideParallax(qualityRef, thirdRef, scrollProgressRef.current / 0.4)
//         } else {
//           slideParallax(qualityRef, thirdRef, 1)
//           dispatch('qualityProgress', (scrollProgressRef.current - 0.4) / 0.6)
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - QUALITY_STEP * factor)

//         if (scrollProgressRef.current <= 0.4) {
//           slideParallax(qualityRef, thirdRef, scrollProgressRef.current / 0.4)
//           dispatch('qualityProgress', 0)
//         } else {
//           dispatch('qualityProgress', (scrollProgressRef.current - 0.4) / 0.6)
//         }

//         if (scrollProgressRef.current <= 0) {
//           setShowQuality(false)
//           resetParallaxUnder(thirdRef)
//           scrollProgressRef.current = 1
//           dispatch('thirdHorizontalProgress', 1)
//         }
//       }
//       return
//     }
//   }

//   useEffect(() => {
//     const handleWheel = (e) => {
//       e.preventDefault()
//       if (loading || isTransitioning.current) return

//       const direction = e.deltaY > 0 ? 1 : -1
//       const magnitude = Math.min(Math.abs(e.deltaY), 100)
//       const factor = Math.max(0.25, magnitude / 60)

//       handleScrollStep(direction, factor)
//     }

//     window.addEventListener('wheel', handleWheel, { passive: false })
//     return () => window.removeEventListener('wheel', handleWheel)
//   }, [showSecond, showFourth, showCapability, showProcess, showThird, showQuality, loading])

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (loading || isTransitioning.current) return

//       if (e.key === 'ArrowDown') {
//         e.preventDefault()
//         handleScrollStep(1, 1)
//       } else if (e.key === 'ArrowUp') {
//         e.preventDefault()
//         handleScrollStep(-1, 1)
//       }
//     }

//     window.addEventListener('keydown', handleKeyDown)
//     return () => window.removeEventListener('keydown', handleKeyDown)
//   }, [showSecond, showFourth, showCapability, showProcess, showThird, showQuality, loading])

//   return (
//     <main className="main-container" style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>
//       {!loading && <CursorTrail />}
//       {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

//       {showHero && (
//         <div style={{ position: 'relative', width: '100%', height: '100dvh' }}>
//           <div ref={heroRef} className="hero-wrapper" style={stackedWrapperStyle(1)}>
//             <HeroSection />
//           </div>

//           {showSecond && (
//             <div ref={secondRef} className="second-section-wrapper" style={stackedWrapperStyle(2)}>
//               <SecondSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showFourth && (
//             <div ref={fourthRef} className="fourth-section-wrapper" style={stackedWrapperStyle(3)}>
//               <FourthSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showCapability && (
//             <div ref={capabilityRef} className="capability-section-wrapper" style={stackedWrapperStyle(4)}>
//               <CapabilitySection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showProcess && (
//             <div ref={processRef} className="process-section-wrapper" style={stackedWrapperStyle(5)}>
//               <ProcessSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showThird && (
//             <div ref={thirdRef} className="third-section-wrapper" style={stackedWrapperStyle(6)}>
//               <ThirdSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showQuality && (
//             <div ref={qualityRef} className="quality-section-wrapper" style={stackedWrapperStyle(7)}>
//               <QualitySection scrollProgressRef={scrollProgressRef} />
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
//               background: 'var(--color-black, #0a0a0a)',
//               zIndex: 9,
//               pointerEvents: 'none',
//               opacity: 0,
//               scale: 0,
//             }}
//           />

//           <div
//             ref={fadeOverlayRef}
//             className="fade-overlay"
//             style={{
//               position: 'fixed',
//               inset: 0,
//               width: '100%',
//               height: '100dvh',
//               zIndex: 11,
//               pointerEvents: 'none',
//               background: 'var(--color-black, #0a0a0a)',
//               opacity: 0,
//             }}
//           />
//         </div>
//       )}
//     </main>
//   )
// }



// ***************still issue***************
// 'use client'
// import { useState, useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
// import HeroSection from '@/components/HeroSection/HeroSection'
// import SecondSection from '@/components/SecondSection/SecondSection'
// import FourthSection from '@/components/FourthSection/FourthSection'
// import CapabilitySection from '@/components/CapabilitySection/CapabilitySection'
// import ProcessSection from '@/components/ProcessSection/ProcessSection'
// import ThirdSection from '@/components/ThirdSection/ThirdSection'
// import QualitySection from '@/components/QualitySection/QualitySection'
// import CursorTrail from '@/components/CursorTrail/CursorTrail'

// const HERO_STEP = 0.08
// const SECOND_STEP = 0.015
// const FOURTH_STEP = 0.012
// const CAPABILITY_STEP = 0.015
// const PROCESS_STEP = 0.015
// const THIRD_STEP = 0.012
// const QUALITY_STEP = 0.015

// const CAPABILITY_SPLIT = 0.4
// const PROCESS_SPLIT = 0.4
// const FOURTH_SPLIT = 0.5 
// const QUALITY_WIPE_SPLIT = 0.5 

// const clamp01 = (v) => Math.max(0, Math.min(1, v))
// const dispatch = (name, progress) => {
//   window.dispatchEvent(new CustomEvent(name, { detail: { progress } }))
// }

// const stackedWrapperStyle = (z) => ({
//   position: 'absolute',
//   top: 0,
//   left: 0,
//   width: '100%',
//   minHeight: '100dvh',
//   height: 'auto',
//   zIndex: z,
//   backgroundColor: 'var(--color-black, #0a0a0a)',
//   willChange: 'transform, opacity',
// })

// export default function Home() {
//   const [loading, setLoading] = useState(true)
//   const [showHero, setShowHero] = useState(false)

//   const [showSecond, setShowSecond] = useState(false)
//   const [showFourth, setShowFourth] = useState(false)
//   const [showCapability, setShowCapability] = useState(false)
//   const [showProcess, setShowProcess] = useState(false)
//   const [showThird, setShowThird] = useState(false)
//   const [showQuality, setShowQuality] = useState(false)

//   const scrollProgressRef = useRef(0)
//   const isTransitioning = useRef(false)

//   const heroRef = useRef(null)
//   const secondRef = useRef(null)
//   const fourthRef = useRef(null)
//   const capabilityRef = useRef(null)
//   const processRef = useRef(null)
//   const thirdRef = useRef(null)
//   const qualityRef = useRef(null)

//   const circularRevealRef = useRef(null) 
//   const fadeOverlayRef = useRef(null)     
//   const wipeOverlayRef = useRef(null)     

//   const handleLoadingComplete = () => {
//     setLoading(false)
//     setShowHero(true)
//   }

//   const slideParallax = (overRef, underRef, progress) => {
//     if (overRef?.current) {
//       gsap.to(overRef.current, {
//         y: `${(1 - progress) * 100}%`,
//         duration: 0.1,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }
//     if (underRef?.current) {
//       gsap.to(underRef.current, {
//         y: `${-8 * progress}%`,
//         opacity: 1 - 0.3 * progress,
//         scale: 1 - 0.03 * progress,
//         duration: 0.1,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }
//   }

//   const resetParallaxUnder = (underRef) => {
//     if (underRef?.current) {
//       gsap.set(underRef.current, { y: '0%', opacity: 1, scale: 1 })
//     }
//   }

//   const runFade = (onSwap) => {
//     isTransitioning.current = true
//     const tl = gsap.timeline({
//       onComplete: () => { isTransitioning.current = false }
//     })
//     tl.to(fadeOverlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.inOut' })
//       .add(onSwap)
//       .to(fadeOverlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.inOut' })
//   }

//   const runCircularReveal = (onEnter) => {
//     isTransitioning.current = true
//     if (!circularRevealRef.current) return
//     gsap.fromTo(
//       circularRevealRef.current,
//       { scale: 0, opacity: 0, borderRadius: '50%' },
//       {
//         scale: 3,
//         opacity: 1,
//         borderRadius: '0%',
//         duration: 0.5,
//         ease: 'power3.inOut',
//         onComplete: () => {
//           onEnter()
//           gsap.to(circularRevealRef.current, {
//             opacity: 0,
//             duration: 0.25,
//             ease: 'power2.out',
//             onComplete: () => {
//               isTransitioning.current = false
//               gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
//             }
//           })
//         }
//       }
//     )
//   }

//   const runCircularRevealBack = (onLeave) => {
//     isTransitioning.current = true
//     if (!circularRevealRef.current) return
//     gsap.fromTo(
//       circularRevealRef.current,
//       { scale: 3, opacity: 0 },
//       {
//         scale: 0,
//         opacity: 1,
//         borderRadius: '50%',
//         duration: 0.5,
//         ease: 'power3.inOut',
//         onComplete: () => {
//           onLeave()
//           gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
//           isTransitioning.current = false
//         }
//       }
//     )
//   }

//   const setWipe = (wipeP) => {
//     const xPercent = wipeP <= 0.5
//       ? -100 + wipeP * 2 * 100  
//       : (wipeP - 0.5) * 2 * 100 

//     gsap.to(wipeOverlayRef.current, {
//       xPercent,
//       duration: 0.08,
//       ease: 'power2.out',
//       overwrite: 'auto',
//     })
//     gsap.to(thirdRef.current, {
//       opacity: wipeP <= 0.5 ? 1 : 0,
//       duration: 0.08,
//       ease: 'power2.out',
//       overwrite: 'auto',
//     })
//   }

//   const handleScrollStep = (direction, factor) => {
//     if (loading || isTransitioning.current) return

//     if (!showSecond) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + HERO_STEP * factor)
//         dispatch('scrollProgress', scrollProgressRef.current)

//         if (scrollProgressRef.current >= 1) {
//           setShowSecond(true)
//           scrollProgressRef.current = 0
//           requestAnimationFrame(() => {
//             if (secondRef.current) gsap.set(secondRef.current, { y: '100%' })
//           })
//         }
//       } else {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current - HERO_STEP * factor)
//         dispatch('scrollProgress', scrollProgressRef.current)
//       }
//       return
//     }

//     if (showSecond && !showFourth) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + SECOND_STEP * factor)

//         if (scrollProgressRef.current <= 0.5) {
//           slideParallax(secondRef, heroRef, scrollProgressRef.current / 0.5)
//         } else {
//           slideParallax(secondRef, heroRef, 1)
//           dispatch('secondTextProgress', (scrollProgressRef.current - 0.5) / 0.5)
//         }

//         if (scrollProgressRef.current >= 1) {
//           runFade(() => {
//             setShowFourth(true)
//             scrollProgressRef.current = 0
//             requestAnimationFrame(() => {
//               if (fourthRef.current) gsap.set(fourthRef.current, { y: '0%', opacity: 1 })
//             })
//           })
//         }
//       } else {
//         if (scrollProgressRef.current > 0.5) {
//           scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - SECOND_STEP * factor)
//           dispatch('secondTextProgress', clamp01((scrollProgressRef.current - 0.5) / 0.5))
//         } else {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - SECOND_STEP * factor)
//           slideParallax(secondRef, heroRef, scrollProgressRef.current / 0.5)

//           if (scrollProgressRef.current <= 0) {
//             setShowSecond(false)
//             resetParallaxUnder(heroRef)
//             scrollProgressRef.current = 1
//             dispatch('scrollProgress', 1)
//           }
//         }
//       }
//       return
//     }

//     if (showFourth && !showCapability) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + FOURTH_STEP * factor)

//         if (scrollProgressRef.current <= FOURTH_SPLIT) {
//           dispatch('fourthShapeProgress', scrollProgressRef.current / FOURTH_SPLIT)
//         } else {
//           dispatch('fourthShapeProgress', 1)
//           dispatch('fourthImageProgress', (scrollProgressRef.current - FOURTH_SPLIT) / (1 - FOURTH_SPLIT))
//         }

//         if (scrollProgressRef.current >= 1) {
//           setShowCapability(true)
//           scrollProgressRef.current = 0
//           requestAnimationFrame(() => {
//             if (capabilityRef.current) gsap.set(capabilityRef.current, { y: '100%' })
//           })
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - FOURTH_STEP * factor)

//         if (scrollProgressRef.current <= FOURTH_SPLIT) {
//           dispatch('fourthShapeProgress', scrollProgressRef.current / FOURTH_SPLIT)
//           dispatch('fourthImageProgress', 0)
//         } else {
//           dispatch('fourthImageProgress', (scrollProgressRef.current - FOURTH_SPLIT) / (1 - FOURTH_SPLIT))
//         }

//         if (scrollProgressRef.current <= 0) {
//           runFade(() => {
//             setShowFourth(false)
//             scrollProgressRef.current = 1
//             dispatch('secondTextProgress', 1)
//           })
//         }
//       }
//       return
//     }

//     if (showCapability && !showProcess) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + CAPABILITY_STEP * factor)

//         if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//           slideParallax(capabilityRef, fourthRef, scrollProgressRef.current / CAPABILITY_SPLIT)
//         } else {
//           slideParallax(capabilityRef, fourthRef, 1)
//           dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
//         }

//         if (scrollProgressRef.current >= 1) {
//           setShowProcess(true)
//           scrollProgressRef.current = 0
//           requestAnimationFrame(() => {
//             if (processRef.current) gsap.set(processRef.current, { y: '100%' })
//           })
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - CAPABILITY_STEP * factor)

//         if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//           slideParallax(capabilityRef, fourthRef, scrollProgressRef.current / CAPABILITY_SPLIT)
//           dispatch('capabilityProgress', 0)
//         } else {
//           dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
//         }

//         if (scrollProgressRef.current <= 0) {
//           setShowCapability(false)
//           resetParallaxUnder(fourthRef)
//           scrollProgressRef.current = 1
//           dispatch('fourthShapeProgress', 1)
//           dispatch('fourthImageProgress', 1)
//         }
//       }
//       return
//     }

//     if (showProcess && !showThird) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + PROCESS_STEP * factor)

//         if (scrollProgressRef.current <= PROCESS_SPLIT) {
//           slideParallax(processRef, capabilityRef, scrollProgressRef.current / PROCESS_SPLIT)
//         } else {
//           slideParallax(processRef, capabilityRef, 1)
//           dispatch('processProgress', (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT))
//         }

//         if (scrollProgressRef.current >= 1) {
//           runCircularReveal(() => {
//             setShowThird(true)
//             scrollProgressRef.current = 0
//             requestAnimationFrame(() => {
//               if (thirdRef.current) gsap.set(thirdRef.current, { y: '100%', opacity: 1 })
//             })
//             dispatch('thirdSlideProgress', 0)
//           })
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - PROCESS_STEP * factor)

//         if (scrollProgressRef.current <= PROCESS_SPLIT) {
//           slideParallax(processRef, capabilityRef, scrollProgressRef.current / PROCESS_SPLIT)
//           dispatch('processProgress', 0)
//         } else {
//           dispatch('processProgress', (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT))
//         }

//         if (scrollProgressRef.current <= 0) {
//           setShowProcess(false)
//           resetParallaxUnder(capabilityRef)
//           scrollProgressRef.current = 1
//           dispatch('capabilityProgress', 1)
//         }
//       }
//       return
//     }

//     if (showThird && !showQuality) {
//       if (direction > 0) {
//         if (scrollProgressRef.current < 0.5) {
//           scrollProgressRef.current = Math.min(0.5, scrollProgressRef.current + THIRD_STEP * factor)
//           const slideProgress = scrollProgressRef.current / 0.5
//           gsap.to(thirdRef.current, {
//             y: `${(1 - slideProgress) * 100}%`,
//             duration: 0.1,
//             ease: 'power2.out',
//             overwrite: 'auto',
//           })
//           dispatch('thirdSlideProgress', slideProgress)
//         } else if (scrollProgressRef.current < 1) {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + THIRD_STEP * factor)
//           dispatch('thirdHorizontalProgress', (scrollProgressRef.current - 0.5) / 0.5)
//         } else {
//           setShowQuality(true)
//           scrollProgressRef.current = 0
//           requestAnimationFrame(() => {
//             if (wipeOverlayRef.current) gsap.set(wipeOverlayRef.current, { xPercent: -100 })
//             if (thirdRef.current) gsap.set(thirdRef.current, { opacity: 1 })
//           })
//         }
//       } else {
//         if (scrollProgressRef.current > 0.5) {
//           scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - THIRD_STEP * factor)
//           dispatch('thirdHorizontalProgress', (scrollProgressRef.current - 0.5) / 0.5)
//         } else if (scrollProgressRef.current > 0) {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - THIRD_STEP * factor)
//           const slideProgress = scrollProgressRef.current / 0.5
//           gsap.to(thirdRef.current, {
//             y: `${(1 - slideProgress) * 100}%`,
//             duration: 0.1,
//             ease: 'power2.out',
//             overwrite: 'auto',
//           })
//           dispatch('thirdSlideProgress', slideProgress)

//           if (scrollProgressRef.current <= 0) {
//             runCircularRevealBack(() => {
//               setShowThird(false)
//               resetParallaxUnder(processRef)
//               scrollProgressRef.current = 1
//               dispatch('processProgress', 1)
//             })
//           }
//         }
//       }
//       return
//     }

//     if (showQuality) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + QUALITY_STEP * factor)

//         if (scrollProgressRef.current <= QUALITY_WIPE_SPLIT) {
//           setWipe(scrollProgressRef.current / QUALITY_WIPE_SPLIT)
//         } else {
//           dispatch('qualityProgress', (scrollProgressRef.current - QUALITY_WIPE_SPLIT) / (1 - QUALITY_WIPE_SPLIT))
//         }
//       } else {
//         if (scrollProgressRef.current > QUALITY_WIPE_SPLIT) {
//           scrollProgressRef.current = Math.max(QUALITY_WIPE_SPLIT, scrollProgressRef.current - QUALITY_STEP * factor)
//           dispatch('qualityProgress', (scrollProgressRef.current - QUALITY_WIPE_SPLIT) / (1 - QUALITY_WIPE_SPLIT))
//         } else if (scrollProgressRef.current > 0) {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - QUALITY_STEP * factor)
//           setWipe(scrollProgressRef.current / QUALITY_WIPE_SPLIT)

//           if (scrollProgressRef.current <= 0) {
//             setShowQuality(false)
//             scrollProgressRef.current = 1
//             dispatch('thirdHorizontalProgress', 1)
//           }
//         }
//       }
//       return
//     }
//   }

//   useEffect(() => {
//     const handleWheel = (e) => {
//       e.preventDefault()
//       if (loading || isTransitioning.current) return

//       const direction = e.deltaY > 0 ? 1 : -1
//       const magnitude = Math.min(Math.abs(e.deltaY), 100)
//       const factor = Math.max(0.25, magnitude / 60)

//       handleScrollStep(direction, factor)
//     }

//     window.addEventListener('wheel', handleWheel, { passive: false })
//     return () => window.removeEventListener('wheel', handleWheel)
//   }, [showSecond, showFourth, showCapability, showProcess, showThird, showQuality, loading])

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (loading || isTransitioning.current) return

//       if (e.key === 'ArrowDown') {
//         e.preventDefault()
//         handleScrollStep(1, 1)
//       } else if (e.key === 'ArrowUp') {
//         e.preventDefault()
//         handleScrollStep(-1, 1)
//       }
//     }

//     window.addEventListener('keydown', handleKeyDown)
//     return () => window.removeEventListener('keydown', handleKeyDown)
//   }, [showSecond, showFourth, showCapability, showProcess, showThird, showQuality, loading])

//   return (
//     <main className="main-container" style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>
//       {!loading && <CursorTrail />}
//       {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

//       {showHero && (
//         <div style={{ position: 'relative', width: '100%', height: '100dvh' }}>
          
//           <div ref={heroRef} className="hero-wrapper" style={stackedWrapperStyle(1)}>
//             <HeroSection />
//           </div>

//           {showSecond && (
//             <div ref={secondRef} className="second-section-wrapper" style={stackedWrapperStyle(2)}>
//               <SecondSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showFourth && (
//             <div ref={fourthRef} className="fourth-section-wrapper" style={stackedWrapperStyle(3)}>
//               <FourthSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showCapability && (
//             <div ref={capabilityRef} className="capability-section-wrapper" style={stackedWrapperStyle(4)}>
//               <CapabilitySection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showProcess && (
//             <div ref={processRef} className="process-section-wrapper" style={stackedWrapperStyle(5)}>
//               <ProcessSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showThird && (
//             <div ref={thirdRef} className="third-section-wrapper" style={stackedWrapperStyle(6)}>
//               <ThirdSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showQuality && (
//             <div ref={qualityRef} className="quality-section-wrapper" style={stackedWrapperStyle(7)}>
//               <QualitySection scrollProgressRef={scrollProgressRef} />
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
//               background: 'var(--color-black, #0a0a0a)',
//               zIndex: 9,
//               pointerEvents: 'none',
//               opacity: 0,
//               scale: 0,
//             }}
//           />

//           <div
//             ref={wipeOverlayRef}
//             className="wipe-overlay"
//             style={{
//               position: 'fixed',
//               top: 0,
//               left: 0,
//               width: '100%',
//               height: '100dvh',
//               zIndex: 10,
//               pointerEvents: 'none',
//               transform: 'translateX(-100%)',
//               willChange: 'transform',
//               background:
//                 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 8%, var(--color-black, #0a0a0a) 20%, var(--color-black, #0a0a0a) 100%)',
//             }}
//           />

//           <div
//             ref={fadeOverlayRef}
//             className="fade-overlay"
//             style={{
//               position: 'fixed',
//               inset: 0,
//               width: '100%',
//               height: '100dvh',
//               zIndex: 11,
//               pointerEvents: 'none',
//               background: 'var(--color-black, #0a0a0a)',
//               opacity: 0,
//             }}
//           />
//         </div>
//       )}
//     </main>
//   )
// }


// ******************************* much better but issue***********
// 'use client'
// import { useState, useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
// import HeroSection from '@/components/HeroSection/HeroSection'
// import SecondSection from '@/components/SecondSection/SecondSection'
// import FourthSection from '@/components/FourthSection/FourthSection'
// import CapabilitySection from '@/components/CapabilitySection/CapabilitySection'
// import ProcessSection from '@/components/ProcessSection/ProcessSection'
// import ThirdSection from '@/components/ThirdSection/ThirdSection'
// import QualitySection from '@/components/QualitySection/QualitySection'
// import CursorTrail from '@/components/CursorTrail/CursorTrail'

// // ---------------------------------------------------------------------------
// // Per-stage scroll speed (kitni fast progress badhti hai har wheel tick par)
// // ---------------------------------------------------------------------------
// const HERO_STEP = 0.1
// const SECOND_STEP = 0.02
// const FOURTH_STEP = 0.01
// const CAPABILITY_STEP = 0.02
// const PROCESS_STEP = 0.02
// const THIRD_STEP = 0.015
// const QUALITY_STEP = 0.02

// // Capability/Process ke apne split: [0 - SPLIT] slide-in, [SPLIT - 1] content
// const CAPABILITY_SPLIT = 0.4
// const PROCESS_SPLIT = 0.4
// const FOURTH_SPLIT = 0.5 // shape 0-0.5, image 0.5-1
// const QUALITY_WIPE_SPLIT = 0.5 // 0-0.5 wipe, 0.5-1 content

// const clamp01 = (v) => Math.max(0, Math.min(1, v))
// const dispatch = (name, progress) => {
//   window.dispatchEvent(new CustomEvent(name, { detail: { progress } }))
// }

// const fixedWrapperStyle = (z) => ({
//   position: 'fixed',
//   inset: 0,
//   width: '100%',
//   height: '100dvh',
//   zIndex: z,
//   willChange: 'transform, opacity',
// })

// export default function Home() {
//   const [loading, setLoading] = useState(true)
//   const [showHero, setShowHero] = useState(false)

//   const [showSecond, setShowSecond] = useState(false)
//   const [showFourth, setShowFourth] = useState(false)
//   const [showCapability, setShowCapability] = useState(false)
//   const [showProcess, setShowProcess] = useState(false)
//   const [showThird, setShowThird] = useState(false)
//   const [showQuality, setShowQuality] = useState(false)

//   const scrollProgressRef = useRef(0)
//   const isTransitioning = useRef(false)

//   const heroRef = useRef(null)
//   const secondRef = useRef(null)
//   const fourthRef = useRef(null)
//   const capabilityRef = useRef(null)
//   const processRef = useRef(null)
//   const thirdRef = useRef(null)
//   const qualityRef = useRef(null)

//   const circularRevealRef = useRef(null) // Process -> Third
//   const fadeOverlayRef = useRef(null)     // Second -> Fourth
//   const wipeOverlayRef = useRef(null)     // Third -> Quality

//   const handleLoadingComplete = () => {
//     setLoading(false)
//     setShowHero(true)
//   }

//   // ---------------------------------------------------------------------
//   // Reusable transition helpers
//   // ---------------------------------------------------------------------
//   const slideParallax = (overRef, underRef, progress) => {
//     if (overRef?.current) {
//       gsap.to(overRef.current, {
//         y: `${(1 - progress) * 100}%`,
//         duration: 0.08,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }
//     if (underRef?.current) {
//       gsap.to(underRef.current, {
//         y: `${-8 * progress}%`,
//         opacity: 1 - 0.3 * progress,
//         scale: 1 - 0.03 * progress,
//         duration: 0.08,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }
//   }

//   const resetParallaxUnder = (underRef) => {
//     if (underRef?.current) {
//       gsap.set(underRef.current, { y: '0%', opacity: 1, scale: 1 })
//     }
//   }

//   const runFade = (onSwap) => {
//     isTransitioning.current = true
//     const tl = gsap.timeline({
//       onComplete: () => { isTransitioning.current = false }
//     })
//     tl.to(fadeOverlayRef.current, { opacity: 1, duration: 0.35, ease: 'power2.inOut' })
//       .add(onSwap)
//       .to(fadeOverlayRef.current, { opacity: 0, duration: 0.35, ease: 'power2.inOut' })
//   }

//   const runCircularReveal = (onEnter) => {
//     isTransitioning.current = true
//     if (!circularRevealRef.current) return
//     gsap.fromTo(
//       circularRevealRef.current,
//       { scale: 0, opacity: 0, borderRadius: '50%' },
//       {
//         scale: 3,
//         opacity: 1,
//         borderRadius: '0%',
//         duration: 0.6,
//         ease: 'power3.inOut',
//         onComplete: () => {
//           onEnter()
//           gsap.to(circularRevealRef.current, {
//             opacity: 0,
//             duration: 0.3,
//             ease: 'power2.out',
//             onComplete: () => {
//               isTransitioning.current = false
//               gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
//             }
//           })
//         }
//       }
//     )
//   }

//   const runCircularRevealBack = (onLeave) => {
//     isTransitioning.current = true
//     if (!circularRevealRef.current) return
//     gsap.fromTo(
//       circularRevealRef.current,
//       { scale: 3, opacity: 0 },
//       {
//         scale: 0,
//         opacity: 1,
//         borderRadius: '50%',
//         duration: 0.6,
//         ease: 'power3.inOut',
//         onComplete: () => {
//           onLeave()
//           gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
//           isTransitioning.current = false
//         }
//       }
//     )
//   }

//   const setWipe = (wipeP) => {
//     // wipeP: 0 (fully left, hidden) -> 0.5 (fully covers screen) -> 1 (fully right, gone)
//     const xPercent = wipeP <= 0.5
//       ? -100 + wipeP * 2 * 100   // -100 -> 0
//       : (wipeP - 0.5) * 2 * 100 // 0 -> 100

//     gsap.to(wipeOverlayRef.current, {
//       xPercent,
//       duration: 0.08,
//       ease: 'power2.out',
//       overwrite: 'auto',
//     })
//     gsap.to(thirdRef.current, {
//       opacity: wipeP <= 0.5 ? 1 : 0,
//       duration: 0.08,
//       ease: 'power2.out',
//       overwrite: 'auto',
//     })
//   }

//   // ---------------------------------------------------------------------
//   // Core scroll step — wheel aur keyboard dono isi ko call karte hain
//   // ---------------------------------------------------------------------
//   const handleScrollStep = (direction, factor) => {
//     if (loading || isTransitioning.current) return

//     // ================= STAGE: HERO =================
//     if (!showSecond) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + HERO_STEP * factor)
//         dispatch('scrollProgress', scrollProgressRef.current)

//         if (scrollProgressRef.current >= 1) {
//           setShowSecond(true)
//           scrollProgressRef.current = 0
//           requestAnimationFrame(() => {
//             if (secondRef.current) gsap.set(secondRef.current, { y: '100%' })
//           })
//         }
//       } else {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current - HERO_STEP * factor)
//         dispatch('scrollProgress', scrollProgressRef.current)
//       }
//       return
//     }

//     // ================= STAGE: SECOND (slide 0-0.5, text-fill 0.5-1) =================
//     if (showSecond && !showFourth) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + SECOND_STEP * factor)

//         if (scrollProgressRef.current <= 0.5) {
//           slideParallax(secondRef, heroRef, scrollProgressRef.current / 0.5)
//         } else {
//           slideParallax(secondRef, heroRef, 1)
//           dispatch('secondTextProgress', (scrollProgressRef.current - 0.5) / 0.5)
//         }

//         if (scrollProgressRef.current >= 1) {
//           runFade(() => {
//             setShowFourth(true)
//             scrollProgressRef.current = 0
//           })
//         }
//       } else {
//         if (scrollProgressRef.current > 0.5) {
//           scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - SECOND_STEP * factor)
//           dispatch('secondTextProgress', clamp01((scrollProgressRef.current - 0.5) / 0.5))
//         } else {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - SECOND_STEP * factor)
//           slideParallax(secondRef, heroRef, scrollProgressRef.current / 0.5)

//           if (scrollProgressRef.current <= 0) {
//             setShowSecond(false)
//             resetParallaxUnder(heroRef)
//             scrollProgressRef.current = 1
//             dispatch('scrollProgress', 1)
//           }
//         }
//       }
//       return
//     }

//     // ================= STAGE: FOURTH (shape 0-0.5, image 0.5-1) =================
//     if (showFourth && !showCapability) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + FOURTH_STEP * factor)

//         if (scrollProgressRef.current <= FOURTH_SPLIT) {
//           dispatch('fourthShapeProgress', scrollProgressRef.current / FOURTH_SPLIT)
//         } else {
//           dispatch('fourthShapeProgress', 1)
//           dispatch('fourthImageProgress', (scrollProgressRef.current - FOURTH_SPLIT) / (1 - FOURTH_SPLIT))
//         }

//         if (scrollProgressRef.current >= 1) {
//           setShowCapability(true)
//           scrollProgressRef.current = 0
//           requestAnimationFrame(() => {
//             if (capabilityRef.current) gsap.set(capabilityRef.current, { y: '100%' })
//           })
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - FOURTH_STEP * factor)

//         if (scrollProgressRef.current <= FOURTH_SPLIT) {
//           dispatch('fourthShapeProgress', scrollProgressRef.current / FOURTH_SPLIT)
//           dispatch('fourthImageProgress', 0)
//         } else {
//           dispatch('fourthImageProgress', (scrollProgressRef.current - FOURTH_SPLIT) / (1 - FOURTH_SPLIT))
//         }

//         if (scrollProgressRef.current <= 0) {
//           runFade(() => {
//             setShowFourth(false)
//             scrollProgressRef.current = 1
//             dispatch('secondTextProgress', 1)
//           })
//         }
//       }
//       return
//     }

//     // ================= STAGE: CAPABILITY (slide 0-0.4, content 0.4-1) =================
//     if (showCapability && !showProcess) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + CAPABILITY_STEP * factor)

//         if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//           slideParallax(capabilityRef, fourthRef, scrollProgressRef.current / CAPABILITY_SPLIT)
//         } else {
//           slideParallax(capabilityRef, fourthRef, 1)
//           dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
//         }

//         if (scrollProgressRef.current >= 1) {
//           setShowProcess(true)
//           scrollProgressRef.current = 0
//           requestAnimationFrame(() => {
//             if (processRef.current) gsap.set(processRef.current, { y: '100%' })
//           })
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - CAPABILITY_STEP * factor)

//         if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//           slideParallax(capabilityRef, fourthRef, scrollProgressRef.current / CAPABILITY_SPLIT)
//           dispatch('capabilityProgress', 0)
//         } else {
//           dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
//         }

//         if (scrollProgressRef.current <= 0) {
//           setShowCapability(false)
//           resetParallaxUnder(fourthRef)
//           scrollProgressRef.current = 1
//           dispatch('fourthShapeProgress', 1)
//           dispatch('fourthImageProgress', 1)
//         }
//       }
//       return
//     }

//     // ================= STAGE: PROCESS (slide 0-0.4, content 0.4-1) =================
//     if (showProcess && !showThird) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + PROCESS_STEP * factor)

//         if (scrollProgressRef.current <= PROCESS_SPLIT) {
//           slideParallax(processRef, capabilityRef, scrollProgressRef.current / PROCESS_SPLIT)
//         } else {
//           slideParallax(processRef, capabilityRef, 1)
//           dispatch('processProgress', (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT))
//         }

//         if (scrollProgressRef.current >= 1) {
//           runCircularReveal(() => {
//             setShowThird(true)
//             scrollProgressRef.current = 0
//             requestAnimationFrame(() => {
//               if (thirdRef.current) gsap.set(thirdRef.current, { y: '100%' })
//             })
//             dispatch('thirdSlideProgress', 0)
//           })
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - PROCESS_STEP * factor)

//         if (scrollProgressRef.current <= PROCESS_SPLIT) {
//           slideParallax(processRef, capabilityRef, scrollProgressRef.current / PROCESS_SPLIT)
//           dispatch('processProgress', 0)
//         } else {
//           dispatch('processProgress', (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT))
//         }

//         if (scrollProgressRef.current <= 0) {
//           setShowProcess(false)
//           resetParallaxUnder(capabilityRef)
//           scrollProgressRef.current = 1
//           dispatch('capabilityProgress', 1)
//         }
//       }
//       return
//     }

//     // ================= STAGE: THIRD (slide 0-0.5, horizontal 0.5-1) =================
//     if (showThird && !showQuality) {
//       if (direction > 0) {
//         if (scrollProgressRef.current < 0.5) {
//           scrollProgressRef.current = Math.min(0.5, scrollProgressRef.current + THIRD_STEP * factor)
//           const slideProgress = scrollProgressRef.current / 0.5
//           gsap.to(thirdRef.current, {
//             y: `${(1 - slideProgress) * 100}%`,
//             duration: 0.08,
//             ease: 'power2.out',
//             overwrite: 'auto',
//           })
//           dispatch('thirdSlideProgress', slideProgress)
//         } else if (scrollProgressRef.current < 1) {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + THIRD_STEP * factor)
//           dispatch('thirdHorizontalProgress', (scrollProgressRef.current - 0.5) / 0.5)
//         } else {
//           setShowQuality(true)
//           scrollProgressRef.current = 0
//           requestAnimationFrame(() => {
//             if (wipeOverlayRef.current) gsap.set(wipeOverlayRef.current, { xPercent: -100 })
//             if (thirdRef.current) gsap.set(thirdRef.current, { opacity: 1 })
//           })
//         }
//       } else {
//         if (scrollProgressRef.current > 0.5) {
//           scrollProgressRef.current = Math.max(0.5, scrollProgressRef.current - THIRD_STEP * factor)
//           dispatch('thirdHorizontalProgress', (scrollProgressRef.current - 0.5) / 0.5)
//         } else if (scrollProgressRef.current > 0) {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - THIRD_STEP * factor)
//           const slideProgress = scrollProgressRef.current / 0.5
//           gsap.to(thirdRef.current, {
//             y: `${(1 - slideProgress) * 100}%`,
//             duration: 0.08,
//             ease: 'power2.out',
//             overwrite: 'auto',
//           })
//           dispatch('thirdSlideProgress', slideProgress)

//           if (scrollProgressRef.current <= 0) {
//             runCircularRevealBack(() => {
//               setShowThird(false)
//               resetParallaxUnder(processRef)
//               scrollProgressRef.current = 1
//               dispatch('processProgress', 1)
//             })
//           }
//         }
//       }
//       return
//     }

//     // ================= STAGE: QUALITY (wipe 0-0.5, content 0.5-1) =================
//     if (showQuality) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + QUALITY_STEP * factor)

//         if (scrollProgressRef.current <= QUALITY_WIPE_SPLIT) {
//           setWipe(scrollProgressRef.current / QUALITY_WIPE_SPLIT)
//         } else {
//           dispatch('qualityProgress', (scrollProgressRef.current - QUALITY_WIPE_SPLIT) / (1 - QUALITY_WIPE_SPLIT))
//         }
//       } else {
//         if (scrollProgressRef.current > QUALITY_WIPE_SPLIT) {
//           scrollProgressRef.current = Math.max(QUALITY_WIPE_SPLIT, scrollProgressRef.current - QUALITY_STEP * factor)
//           dispatch('qualityProgress', (scrollProgressRef.current - QUALITY_WIPE_SPLIT) / (1 - QUALITY_WIPE_SPLIT))
//         } else if (scrollProgressRef.current > 0) {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - QUALITY_STEP * factor)
//           setWipe(scrollProgressRef.current / QUALITY_WIPE_SPLIT)

//           if (scrollProgressRef.current <= 0) {
//             setShowQuality(false)
//             scrollProgressRef.current = 1
//             dispatch('thirdHorizontalProgress', 1)
//           }
//         }
//       }
//       return
//     }
//   }

//   // ---------------------------------------------------------------------
//   // Wheel — normalized/clamped taake trackpad ke bade jumps jhatka na den
//   // ---------------------------------------------------------------------
//   useEffect(() => {
//     const handleWheel = (e) => {
//       e.preventDefault()
//       if (loading || isTransitioning.current) return

//       const direction = e.deltaY > 0 ? 1 : -1
//       const magnitude = Math.min(Math.abs(e.deltaY), 100)
//       const factor = Math.max(0.25, magnitude / 60)

//       handleScrollStep(direction, factor)
//     }

//     window.addEventListener('wheel', handleWheel, { passive: false })
//     return () => window.removeEventListener('wheel', handleWheel)
//   }, [showSecond, showFourth, showCapability, showProcess, showThird, showQuality, loading])

//   // ---------------------------------------------------------------------
//   // Keyboard — same core function, fixed step (factor 1)
//   // ---------------------------------------------------------------------
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (loading || isTransitioning.current) return

//       if (e.key === 'ArrowDown') {
//         e.preventDefault()
//         handleScrollStep(1, 1)
//       } else if (e.key === 'ArrowUp') {
//         e.preventDefault()
//         handleScrollStep(-1, 1)
//       }
//     }

//     window.addEventListener('keydown', handleKeyDown)
//     return () => window.removeEventListener('keydown', handleKeyDown)
//   }, [showSecond, showFourth, showCapability, showProcess, showThird, showQuality, loading])

//   return (
//     <main className="main-container">
//       {!loading && <CursorTrail />}
//       {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

//       {showHero && (
//         <>
//           <div ref={heroRef} className="hero-wrapper" style={fixedWrapperStyle(1)}>
//             <HeroSection />
//           </div>

//           {showSecond && (
//             <div ref={secondRef} className="second-section-wrapper" style={fixedWrapperStyle(2)}>
//               <SecondSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showFourth && (
//             <div ref={fourthRef} className="fourth-section-wrapper" style={fixedWrapperStyle(3)}>
//               <FourthSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showCapability && (
//             <div ref={capabilityRef} className="capability-section-wrapper" style={fixedWrapperStyle(4)}>
//               <CapabilitySection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showProcess && (
//             <div ref={processRef} className="process-section-wrapper" style={fixedWrapperStyle(5)}>
//               <ProcessSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showThird && (
//             <div ref={thirdRef} className="third-section-wrapper" style={fixedWrapperStyle(6)}>
//               <ThirdSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showQuality && (
//             <div ref={qualityRef} className="quality-section-wrapper" style={fixedWrapperStyle(7)}>
//               <QualitySection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {/* Process -> Third: circular reveal overlay */}
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

//           {/* Third -> Quality: left-to-right wipe overlay (black shadow) */}
//           <div
//             ref={wipeOverlayRef}
//             className="wipe-overlay"
//             style={{
//               position: 'fixed',
//               top: 0,
//               left: 0,
//               width: '100%',
//               height: '100dvh',
//               zIndex: 10,
//               pointerEvents: 'none',
//               transform: 'translateX(-100%)',
//               willChange: 'transform',
//               background:
//                 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 8%, var(--color-black) 20%, var(--color-black) 100%)',
//             }}
//           />

//           {/* Second -> Fourth: plain fade overlay */}
//           <div
//             ref={fadeOverlayRef}
//             className="fade-overlay"
//             style={{
//               position: 'fixed',
//               inset: 0,
//               width: '100%',
//               height: '100dvh',
//               zIndex: 11,
//               pointerEvents: 'none',
//               background: 'var(--color-black)',
//               opacity: 0,
//             }}
//           />
//         </>
//       )}
//     </main>
//   )
// }




// // ********************  3  *****************
// 'use client'
// import { useState, useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
// import HeroSection from '@/components/HeroSection/HeroSection'
// import SecondSection from '@/components/SecondSection/SecondSection'
// import FourthSection from '@/components/FourthSection/FourthSection'
// import ThirdSection from '@/components/ThirdSection/ThirdSection'
// import CursorTrail from '@/components/CursorTrail/CursorTrail'
// import CapabilitySection from '@/components/CapabilitySection/CapabilitySection'
// import ProcessSection from '@/components/ProcessSection/ProcessSection'
// import QualitySection from '@/components/QualitySection/QualitySection'

// export default function Home() {
//   const [loading, setLoading] = useState(true)
//   const [showHero, setShowHero] = useState(false)
//   const [showSecondSection, setShowSecondSection] = useState(false)
//   const [showFourthSection, setShowFourthSection] = useState(false)
//   const [showProcessSection, setShowProcessSection] = useState(false)
//   const [showThirdSection, setShowThirdSection] = useState(false)
//   const scrollProgressRef = useRef(0)
//   const heroRef = useRef(null)
//   const secondSectionRef = useRef(null)
//   const fourthSectionRef = useRef(null)
//   const processSectionRef = useRef(null)
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

//       if (!showSecondSection && !showFourthSection && !showProcessSection && !showThirdSection) {
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
//                     gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })

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
//       } else if (showSecondSection && !showFourthSection && !showProcessSection && !showThirdSection) {
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
//                     gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })

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
//       } else if (showFourthSection && !showProcessSection && !showThirdSection) {
//         // ============ FOURTH SECTION (SLOW - Shape + Image + Hold) ============
//         if (e.deltaY > 0) {
//           // Scroll slow - 0.01 increment
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

//           // Transition to ProcessSection only at 100%
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
//                     setShowProcessSection(true)
//                     gsap.set(fourthSectionRef.current, { display: 'none' })
//                     gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })

//                     gsap.to(circularRevealRef.current, {
//                       opacity: 0,
//                       duration: 0.3,
//                       ease: 'power2.out',
//                       onComplete: () => {
//                         isTransitioning.current = false
//                         scrollProgressRef.current = 0

//                         const processEvent = new CustomEvent('processProgress', {
//                           detail: { progress: 0 }
//                         })
//                         window.dispatchEvent(processEvent)
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
//       } else if (showProcessSection && !showThirdSection) {
//         // ============ PROCESS SECTION ============
//         const TOTAL_PROCESS_ITEMS = 7
//         if (e.deltaY > 0) {
//           scrollProgressRef.current = Math.min(1, scrollProgressRef.current + (0.015 / TOTAL_PROCESS_ITEMS) * 3)
//           window.dispatchEvent(new CustomEvent('processProgress', {
//             detail: { progress: scrollProgressRef.current }
//           }))
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
//                       if (thirdSectionRef.current) gsap.set(thirdSectionRef.current, { y: '100%' })
//                       gsap.set(processSectionRef.current, { display: 'none' })
//                       gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })

//                       gsap.to(circularRevealRef.current, {
//                         opacity: 0,
//                         duration: 0.3,
//                         ease: 'power2.out',
//                         onComplete: () => {
//                           isTransitioning.current = false
//                           scrollProgressRef.current = 0
//                           window.dispatchEvent(new CustomEvent('thirdSlideProgress', { detail: { progress: 0 } }))
//                         }
//                       })
//                     })
//                   }
//                 }
//               )
//             }
//           }
//         } else {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - (0.015 / TOTAL_PROCESS_ITEMS) * 3)
//           window.dispatchEvent(new CustomEvent('processProgress', { detail: { progress: scrollProgressRef.current } }))
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
//                     setShowProcessSection(false)
//                     setShowFourthSection(true)
//                     gsap.set(processSectionRef.current, { display: 'none' })
//                     gsap.set(fourthSectionRef.current, { display: 'block' })
//                     gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
//                     isTransitioning.current = false
//                     scrollProgressRef.current = 1

//                     const resetEvent = new CustomEvent('fourthShapeProgress', {
//                       detail: { progress: 1 }
//                     })
//                     window.dispatchEvent(resetEvent)
//                     window.dispatchEvent(new CustomEvent('fourthImageProgress', {
//                       detail: { progress: 1 }
//                     }))
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
//                         setShowProcessSection(true)
//                         gsap.set(processSectionRef.current, { display: 'block' })
//                         gsap.set(circularRevealRef.current, { opacity: 0, scale: 0 })
//                         isTransitioning.current = false
//                         scrollProgressRef.current = 1

//                         const resetEvent = new CustomEvent('processProgress', {
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
//   }, [showSecondSection, showFourthSection, showProcessSection, showThirdSection, loading])

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
//       if (!showSecondSection && !showFourthSection && !showProcessSection && !showThirdSection) {
//         scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showSecondSection && !showFourthSection && !showProcessSection && !showThirdSection) {
//         scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.02)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showFourthSection && !showProcessSection && !showThirdSection) {
//         scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.01)
        
//         const shapeProgress = Math.min(1, scrollProgressRef.current / 0.4)
//         window.dispatchEvent(new CustomEvent('fourthShapeProgress', { detail: { progress: shapeProgress } }))
        
//         if (scrollProgressRef.current >= 0.4) {
//           const imageProgress = Math.min(1, (scrollProgressRef.current - 0.4) / 0.4)
//           window.dispatchEvent(new CustomEvent('fourthImageProgress', { detail: { progress: imageProgress } }))
//         }
//       } else if (showProcessSection && !showThirdSection) {
//         const TOTAL_PROCESS_ITEMS = 7
//         scrollProgressRef.current = Math.min(1, scrollProgressRef.current + (0.015 / TOTAL_PROCESS_ITEMS) * 3)
//         window.dispatchEvent(new CustomEvent('processProgress', { detail: { progress: scrollProgressRef.current } }))
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
//       if (!showSecondSection && !showFourthSection && !showProcessSection && !showThirdSection) {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.1)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showSecondSection && !showFourthSection && !showProcessSection && !showThirdSection) {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.02)
//         window.dispatchEvent(new CustomEvent('scrollProgress', { detail: { progress: scrollProgressRef.current } }))
//       } else if (showFourthSection && !showProcessSection && !showThirdSection) {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.01)
        
//         const shapeProgress = Math.min(1, scrollProgressRef.current / 0.4)
//         window.dispatchEvent(new CustomEvent('fourthShapeProgress', { detail: { progress: shapeProgress } }))
        
//         if (scrollProgressRef.current >= 0.4) {
//           const imageProgress = Math.min(1, (scrollProgressRef.current - 0.4) / 0.4)
//           window.dispatchEvent(new CustomEvent('fourthImageProgress', { detail: { progress: imageProgress } }))
//         }
//       } else if (showProcessSection && !showThirdSection) {
//         const TOTAL_PROCESS_ITEMS = 7
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - (0.015 / TOTAL_PROCESS_ITEMS) * 3)
//         window.dispatchEvent(new CustomEvent('processProgress', { detail: { progress: scrollProgressRef.current } }))
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
//   }, [showSecondSection, showFourthSection, showProcessSection, showThirdSection, loading])

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
//               <CapabilitySection scrollProgressRef={scrollProgressRef} />
              
//             </div>
//           )}

//           {showFourthSection && (
//             <div ref={fourthSectionRef} className="fourth-section-wrapper">
//               <FourthSection />
//             </div>
//           )}

//           {showProcessSection && (
//             <div
//               ref={processSectionRef}
//               className="process-section-wrapper"
//               style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 7, willChange: 'transform' }}
//             >
//               <ProcessSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showThirdSection && (
//             <div ref={thirdSectionRef} className="third-section-wrapper">
//               {/* <ThirdSection scrollProgressRef={scrollProgressRef} /> */}
//               <QualitySection scrollProgressRef={scrollProgressRef} />
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
