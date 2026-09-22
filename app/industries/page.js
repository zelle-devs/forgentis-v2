'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import HeroSection from '@/components/HeroSection/HeroSection'
import NavContent from '@/components/NavContent/NavContent'
import InsustriesSection from '@/components/Industries/industries'
import ContactSection2 from '@/components/ContactSection/ContactSection2'
// NEW: same Single Quality section already used on Capabilities/page.js
import Section02SingleQuality from '@/components/Capababilities/Section02SingleQuality'

// ------------------------------------------------------------
// ALL SCROLL CONFIG FROM CENTRAL FILE — no hardcoded numbers
// ------------------------------------------------------------
import {
  SPLITS,
  INPUT_CONFIG,
  TRAVEL_CONFIG,
  MOBILE_SLIDE_STEP,
  getStep,
  getHeroStep,
  getIndustriesStep,
  getIndustriesSplit,
  getTouchMultiplier,
  isMobileViewport,
} from '@/app/config/industriesScrollConfig'

// ----- Stage constants -----
// NEW: STAGE_SINGLE inserted between capability and final, exactly like
// Capabilities/page.js (STAGE_HERO -> STAGE_CAPABILITY -> STAGE_SINGLE -> STAGE_FINAL)
const STAGE_HERO = 0
const STAGE_CAPABILITY = 1
const STAGE_SINGLE = 2
const STAGE_FINAL = 3

// ----- Split shortcuts (pulled from config) -----
const SINGLE_SPLIT = SPLITS.single || 0.5 // same fallback as Capabilities/page.js
const FINAL_SPLIT = SPLITS.final

const clamp01 = (value) => Math.max(0, Math.min(1, value))

const dispatch = (name, progress) => {
  window.dispatchEvent(
    new CustomEvent(name, {
      detail: { progress },
    })
  )
}

const fixedWrapperStyle = (zIndex) => ({
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100dvh',
  zIndex,
  overflow: 'hidden',
  backgroundColor: 'var(--color-black, #0a0a0a)',
  willChange: 'transform, opacity',
})

const slideInWrapperStyle = (zIndex) => ({
  ...fixedWrapperStyle(zIndex),
  transform: 'translateY(100%)',
})

const project_slides = [
  {
    id: 1,
    src: '/images/build1.png',
    desc: 'ARCHITECTURAL METALWORK',
    title: 'Facades, screens, railings, staircases and feature elements.',
    pos: { top: '15%', left: '5%' },
  },
  {
    id: 2,
    src: '/images/build2.jpeg',
    desc: 'COMMERCIAL & INTERIOR',
    title: 'Furniture bases, signage, panels and custom interior metalwork.',
    pos: { top: '75%', left: '65%' },
  },
  {
    id: 3,
    src: '/images/build3.jpeg',
    desc: 'INDUSTRIAL FABRICATION',
    title: 'Engineered components, structural assemblies and production parts.',
    pos: { top: '75%', left: '42%' },
  },
  {
    id: 4,
    src: '/images/build4.jpeg',
    desc: 'CUSTOM FABRICATION',
    title: 'Complex requirements transformed into practical, precisely fabricated solutions.',
    pos: { top: '20%', left: '1%' },
    button: true,
  },
]

// NEW: same shape of data object Capabilities/page.js passes to Section02SingleQuality
const singleData = {
  eyebrow: "SPECIALIZED & CUSTOM APPLICATIONS", // Yahan eyebrow aa jayegi (Title ke upar)
  title: "DON'T SEE YOUR <span>INDUSTRY?</span>",
  desc: "Our capabilities aren't limited to a predefined list of sectors. If you have a drawing, prototype, sample or fabrication challenge, bring it to us. We'll assess the requirement, determine whether it fits our capabilities and recommend the most practical fabrication approach.",
  footer: "YOUR INDUSTRY MAY BE DIFFERENT. THE REQUIREMENT IS STILL METAL.", // Yahan footer aa jayega (Rich Grid/Content ke niche)
  buttonText: "Talk To Our Team", // Button ke andar ka text
  buttonLink: "/consultation", // Button ka URL / route (Optional, default '#' hai)
}

export default function Industries() {
  const [loading, setLoading] = useState(true)
  const [showHero, setShowHero] = useState(false)
  const [showCapability, setShowCapability] = useState(false)
  const [showSingle, setShowSingle] = useState(false) // NEW
  const [showFinal, setShowFinal] = useState(false)

  const loadingRef = useRef(true)
  const stageRef = useRef(STAGE_HERO)
  const scrollProgressRef = useRef(0)
  const isTransitioning = useRef(false)
  const lastStageRef = useRef(-1)

  const heroRef = useRef(null)
  const capabilityRef = useRef(null)
  const singleRef = useRef(null) // NEW
  const contactRef = useRef(null)

  const wheelAccumRef = useRef(0)
  const rafIdRef = useRef(null)
  const handleScrollStepRef = useRef(null)

  // Touch refs
  const touchStartYRef = useRef(0)
  const touchLastYRef = useRef(0)
  const touchAccumRef = useRef(0)
  const isTouchScrollingRef = useRef(false)

  useEffect(() => {
    handleScrollStepRef.current = handleScrollStep
  })

  useEffect(() => {
    const handleGlobalLoadingComplete = () => {
      setLoading(false)
      setShowHero(true)

      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('stageChange', {
            detail: {
              stage: STAGE_HERO,
              progress: 0,
            },
          })
        )
      }, 100)
    }

    window.addEventListener('globalLoadingComplete', handleGlobalLoadingComplete)
    return () =>
      window.removeEventListener('globalLoadingComplete', handleGlobalLoadingComplete)
  }, [])

  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  // ==========================================================================
  // Lock browser scroll (mobile + desktop)
  // ==========================================================================
  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    const previousBodyOverscroll = document.body.style.overscrollBehavior
    const previousBodyPosition = document.body.style.position

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.height = '100%'

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
      document.body.style.overscrollBehavior = previousBodyOverscroll
      document.body.style.position = previousBodyPosition
      document.body.style.width = ''
      document.body.style.height = ''
    }
  }, [])

  // ==========================================================================
  // Transition helpers
  // ==========================================================================
  const slideParallax = (overRef, underRef, progress) => {
    const isMobileDevice = isMobileViewport()
    const dur = isMobileDevice ? 0.05 : 0.1 // mobile par tez

    if (overRef?.current) {
      gsap.to(overRef.current, {
        y: `${(1 - progress) * 100}%`,
        duration: dur,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    if (underRef?.current) {
      gsap.to(underRef.current, {
        y: `${-8 * progress}%`,
        scale: 1 - 0.03 * progress,
        duration: dur,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
  }

  const resetParallaxUnder = (ref) => {
    if (ref?.current) {
      gsap.set(ref.current, {
        y: '0%',
        opacity: 1,
        scale: 1,
      })
    }
  }

  const mountForward = (setter, ref, nextStage) => {
    isTransitioning.current = true
    stageRef.current = nextStage
    setter(true)
    scrollProgressRef.current = 0

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (ref?.current) {
          gsap.set(ref.current, { y: '100%' })
        }
        // Mobile par thoda extra settle time
        setTimeout(
          () => {
            isTransitioning.current = false
          },
          isMobileViewport() ? 80 : 0
        )
      })
    })
  }

  const unmountBackward = (setter, underRef, previousStage, onComplete) => {
    isTransitioning.current = true
    setter(false)
    resetParallaxUnder(underRef)
    stageRef.current = previousStage
    scrollProgressRef.current = 1

    if (onComplete) {
      onComplete()
    }

    requestAnimationFrame(() => {
      isTransitioning.current = false
    })
  }

  // ==========================================================================
  // Core scroll step handler
  // ==========================================================================
  const handleScrollStep = (direction, factor) => {
    if (loadingRef.current || isTransitioning.current) return

    // 1. HERO STAGE
    if (stageRef.current === STAGE_HERO) {
      const step = getHeroStep()

      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + step * factor
        )
        dispatch('scrollProgress', scrollProgressRef.current)

        if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
          mountForward(setShowCapability, capabilityRef, STAGE_CAPABILITY)
        }
      } else {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current - step * factor
        )
        dispatch('scrollProgress', scrollProgressRef.current)
      }
      return
    }

    // 2. CAPABILITY / INDUSTRIES STAGE
    if (stageRef.current === STAGE_CAPABILITY) {
      const step = getIndustriesStep()
      const capSplit = getIndustriesSplit()

      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + step * factor
        )

        if (scrollProgressRef.current <= capSplit) {
          slideParallax(
            capabilityRef,
            heroRef,
            scrollProgressRef.current / capSplit
          )
        } else {
          slideParallax(capabilityRef, heroRef, 1)

          const subProgress =
            (scrollProgressRef.current - capSplit) / (1 - capSplit)

          dispatch('capabilityProgress', subProgress)

          // CHANGED: was mountForward(setShowFinal, contactRef, STAGE_FINAL)
          // Now goes to the new Single Quality stage first, matching
          // Capabilities/page.js. This is what closes the blank gap —
          // there's no more "dead" scroll range waiting for progress to
          // hit 1 with nothing new mounting; Single mounts immediately.
          if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
            mountForward(setShowSingle, singleRef, STAGE_SINGLE)
          }
        }
      } else {
        scrollProgressRef.current = Math.max(
          0,
          scrollProgressRef.current - step * factor
        )

        if (scrollProgressRef.current <= capSplit) {
          slideParallax(
            capabilityRef,
            heroRef,
            scrollProgressRef.current / capSplit
          )
          dispatch('capabilityProgress', 0)
        } else {
          dispatch(
            'capabilityProgress',
            (scrollProgressRef.current - capSplit) / (1 - capSplit)
          )
        }

        if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
          unmountBackward(setShowCapability, heroRef, STAGE_HERO, () => {
            dispatch('scrollProgress', 1)
          })
        }
      }
      return
    }

    // 3. SINGLE QUALITY STAGE (NEW — mirrors Capabilities/page.js exactly)
    if (stageRef.current === STAGE_SINGLE) {
      const step = getStep('singleQuality')

      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + step * factor
        )

        if (scrollProgressRef.current <= SINGLE_SPLIT) {
          slideParallax(
            singleRef,
            capabilityRef,
            scrollProgressRef.current / SINGLE_SPLIT
          )
          dispatch('singleQualityProgress', 0)
        } else {
          slideParallax(singleRef, capabilityRef, 1)

          const activeProgress =
            (scrollProgressRef.current - SINGLE_SPLIT) / (1 - SINGLE_SPLIT)

          dispatch('singleQualityProgress', activeProgress)

          if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
            mountForward(setShowFinal, contactRef, STAGE_FINAL)
          }
        }
      } else {
        scrollProgressRef.current = Math.max(
          0,
          scrollProgressRef.current - step * factor
        )

        if (scrollProgressRef.current <= SINGLE_SPLIT) {
          slideParallax(
            singleRef,
            capabilityRef,
            scrollProgressRef.current / SINGLE_SPLIT
          )
          dispatch('singleQualityProgress', 0)
        } else {
          slideParallax(singleRef, capabilityRef, 1)

          const activeProgress =
            (scrollProgressRef.current - SINGLE_SPLIT) / (1 - SINGLE_SPLIT)

          dispatch('singleQualityProgress', activeProgress)
        }

        if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
          unmountBackward(setShowSingle, capabilityRef, STAGE_CAPABILITY, () => {
            dispatch('capabilityProgress', 1)
          })
        }
      }
      return
    }

    // ==========================================================
    // 4. FINAL / CONTACT STAGE
    //    MOBILE par simple slide (Home/About/Capabilities jaisa)
    //    DESKTOP par fade + split (jaisa pehle tha)
    // ==========================================================
    if (stageRef.current === STAGE_FINAL) {
      const isMobileDevice = isMobileViewport()

      // ----- MOBILE: simple slide -----
      if (isMobileDevice) {
        const step = MOBILE_SLIDE_STEP

        if (direction > 0) {
          scrollProgressRef.current = clamp01(
            scrollProgressRef.current + step * factor
          )
          // CHANGED: underRef is now singleRef (was capabilityRef)
          slideParallax(contactRef, singleRef, scrollProgressRef.current)
          dispatch('contactProgress', 1)
        } else {
          scrollProgressRef.current = Math.max(
            0,
            scrollProgressRef.current - step * factor
          )
          slideParallax(contactRef, singleRef, scrollProgressRef.current)
          dispatch('contactProgress', 1)

          if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
            // CHANGED: back-target is STAGE_SINGLE (was STAGE_CAPABILITY)
            unmountBackward(setShowFinal, singleRef, STAGE_SINGLE, () => {
              dispatch('singleQualityProgress', 1)
            })
          }
        }
        return
      }

      // ----- DESKTOP: fade + split -----
      const step = getStep('final')

      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + step * factor
        )

        if (scrollProgressRef.current <= FINAL_SPLIT) {
          slideParallax(
            contactRef,
            singleRef,
            scrollProgressRef.current / FINAL_SPLIT
          )
        } else {
          slideParallax(contactRef, singleRef, 1)

          const subProgress =
            (scrollProgressRef.current - FINAL_SPLIT) / (1 - FINAL_SPLIT)

          dispatch('contactProgress', subProgress)
        }
      } else {
        scrollProgressRef.current = Math.max(
          0,
          scrollProgressRef.current - step * factor
        )

        if (scrollProgressRef.current <= FINAL_SPLIT) {
          slideParallax(
            contactRef,
            singleRef,
            scrollProgressRef.current / FINAL_SPLIT
          )
          dispatch('contactProgress', 0)
        } else {
          dispatch(
            'contactProgress',
            (scrollProgressRef.current - FINAL_SPLIT) / (1 - FINAL_SPLIT)
          )
        }

        if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
          unmountBackward(setShowFinal, singleRef, STAGE_SINGLE, () => {
            dispatch('singleQualityProgress', 1)
          })
        }
      }
      return
    }
  }

  // ==========================================================================
  // Wheel + Touch + Keyboard listeners
  // ==========================================================================
  useEffect(() => {
    // ---- Wheel ----
    const handleWheel = (event) => {
      event.preventDefault()
      if (loadingRef.current) return
      wheelAccumRef.current += event.deltaY
    }

    // ---- Touch ----
    const handleTouchStart = (e) => {
      if (loadingRef.current) return
      if (document.querySelector('.nav-sidebar')) return

      touchStartYRef.current = e.touches[0].clientY
      touchLastYRef.current = e.touches[0].clientY
      touchAccumRef.current = 0
      isTouchScrollingRef.current = true
    }

    const handleTouchMove = (e) => {
      if (!isTouchScrollingRef.current) return
      if (loadingRef.current) return
      if (document.querySelector('.nav-sidebar')) return

      const currentY = e.touches[0].clientY
      const deltaY = touchLastYRef.current - currentY
      touchLastYRef.current = currentY

      const multiplier = getTouchMultiplier()
      const touchDelta = deltaY * multiplier * INPUT_CONFIG.touchDeltaMultiplier

      wheelAccumRef.current += touchDelta

      if (e.cancelable) e.preventDefault()
    }

    const handleTouchEnd = () => {
      isTouchScrollingRef.current = false
      touchStartYRef.current = 0
      touchLastYRef.current = 0
    }

    // ---- Keyboard ----
    const handleKeyDown = (event) => {
      if (loadingRef.current || isTransitioning.current) return

      const key = event.key

      if (key === 'ArrowDown' || key === 'PageDown' || key === ' ') {
        event.preventDefault()
        handleScrollStep(1, key === ' ' ? 1.2 : 1)
      } else if (key === 'ArrowUp' || key === 'PageUp') {
        event.preventDefault()
        handleScrollStep(-1, 1)
      } else if (key === 'Home') {
        event.preventDefault()
        window.dispatchEvent(
          new CustomEvent('travelToStage', { detail: { stage: STAGE_HERO } })
        )
      } else if (key === 'End') {
        event.preventDefault()
        window.dispatchEvent(
          new CustomEvent('travelToStage', { detail: { stage: STAGE_FINAL } })
        )
      }
    }

    // ---- rAF tick ----
    const tick = () => {
      if (isTransitioning.current) {
        wheelAccumRef.current = 0
      } else if (Math.abs(wheelAccumRef.current) > INPUT_CONFIG.wheelDeadZone) {
        const raw = wheelAccumRef.current
        const direction = raw > 0 ? 1 : -1

        // MOBILE/TABLET: factor ko 1.0 par lock karo (Capability jaisa smooth)
        const isMobileDevice = isMobileViewport()
        let factor
        if (isMobileDevice) {
          factor = 1.0
        } else {
          const magnitude = Math.min(Math.abs(raw), INPUT_CONFIG.wheelMagnitudeCap)
          factor = Math.max(
            INPUT_CONFIG.wheelFactorMin,
            Math.min(INPUT_CONFIG.wheelFactorMax, magnitude / INPUT_CONFIG.wheelFactorDivisor)
          )
        }

        handleScrollStep(direction, factor)

        wheelAccumRef.current -= raw * INPUT_CONFIG.wheelDecay

        if (Math.abs(wheelAccumRef.current) < INPUT_CONFIG.wheelDeadZone) {
          wheelAccumRef.current = 0
        }
      }

      if (stageRef.current !== lastStageRef.current) {
        lastStageRef.current = stageRef.current
        window.dispatchEvent(
          new CustomEvent('stageChange', {
            detail: {
              stage: stageRef.current,
              progress: scrollProgressRef.current,
            },
          })
        )
      }

      window.dispatchEvent(
        new CustomEvent('stageProgress', {
          detail: {
            stage: stageRef.current,
            progress: scrollProgressRef.current,
          },
        })
      )

      rafIdRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    rafIdRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ==========================================================================
  // Resize handling
  // ==========================================================================
  useEffect(() => {
    let resizeTimer = null
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        wheelAccumRef.current = 0
      }, 150)
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
      if (resizeTimer) clearTimeout(resizeTimer)
    }
  }, [])

  // ==========================================================================
  // Render
  // ==========================================================================
  return (
    <main
      className="main-container"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        overscrollBehavior: 'none',
        touchAction: 'none',
      }}
    >
      {loading && <LoadingScreen />}

      {!loading && <NavContent />}

      {/* Stage 0: Hero */}
      {showHero && (
        <div ref={heroRef} className="hero-wrapper" style={fixedWrapperStyle(1)}>
          <HeroSection
            headline="FABRICATION FOR THE TEAMS THAT"
            highlightedHeadline="BUILD"
          />
        </div>
      )}

      {/* Stage 1: Industries */}
      {showCapability && (
        <div
          ref={capabilityRef}
          className="second-section-wrapper"
          style={slideInWrapperStyle(2)}
        >
          <InsustriesSection />
        </div>
      )}

      {/* Stage 2: Single Quality (NEW) */}
      {showSingle && (
        <div
          ref={singleRef}
          className="single-quality-section-wrapper"
          style={slideInWrapperStyle(3)}
        >
          <Section02SingleQuality
            data={singleData}
            eventName="singleQualityProgress"
          />
        </div>
      )}

      {/* Stage 3 (Final): Contact — zIndex bumped 3 -> 4 since Single now sits at 3 */}
      {showFinal && (
        <div
          ref={contactRef}
          className="contact-section-wrapper"
          style={slideInWrapperStyle(4)}
        >
          <ContactSection2 scrollProgressRef={scrollProgressRef} />
        </div>
      )}
    </main>
  )
}


// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import gsap from 'gsap'

// import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
// import HeroSection from '@/components/HeroSection/HeroSection'
// import NavContent from '@/components/NavContent/NavContent'
// import InsustriesSection from '@/components/Industries/industries'
// import ContactSection2 from '@/components/ContactSection/ContactSection2'

// // ------------------------------------------------------------
// // ALL SCROLL CONFIG FROM CENTRAL FILE — no hardcoded numbers
// // ------------------------------------------------------------
// import {
//   SPLITS,
//   INPUT_CONFIG,
//   TRAVEL_CONFIG,
//   MOBILE_SLIDE_STEP,
//   getStep,
//   getHeroStep,
//   getIndustriesStep,
//   getIndustriesSplit,
//   getTouchMultiplier,
//   isMobileViewport,
// } from '@/app/config/industriesScrollConfig'

// // ----- Stage constants (sirf 3 stages) -----
// const STAGE_HERO = 0
// const STAGE_CAPABILITY = 1
// const STAGE_FINAL = 2

// // ----- Split shortcuts (pulled from config) -----
// const FINAL_SPLIT = SPLITS.final

// const clamp01 = (value) => Math.max(0, Math.min(1, value))

// const dispatch = (name, progress) => {
//   window.dispatchEvent(
//     new CustomEvent(name, {
//       detail: { progress },
//     })
//   )
// }

// const fixedWrapperStyle = (zIndex) => ({
//   position: 'fixed',
//   inset: 0,
//   width: '100%',
//   height: '100dvh',
//   zIndex,
//   overflow: 'hidden',
//   backgroundColor: 'var(--color-black, #0a0a0a)',
//   willChange: 'transform, opacity',
// })

// const slideInWrapperStyle = (zIndex) => ({
//   ...fixedWrapperStyle(zIndex),
//   transform: 'translateY(100%)',
// })

// const project_slides = [
//   {
//     id: 1,
//     src: '/images/build1.png',
//     desc: 'ARCHITECTURAL METALWORK',
//     title: 'Facades, screens, railings, staircases and feature elements.',
//     pos: { top: '15%', left: '5%' },
//   },
//   {
//     id: 2,
//     src: '/images/build2.jpeg',
//     desc: 'COMMERCIAL & INTERIOR',
//     title: 'Furniture bases, signage, panels and custom interior metalwork.',
//     pos: { top: '75%', left: '65%' },
//   },
//   {
//     id: 3,
//     src: '/images/build3.jpeg',
//     desc: 'INDUSTRIAL FABRICATION',
//     title: 'Engineered components, structural assemblies and production parts.',
//     pos: { top: '75%', left: '42%' },
//   },
//   {
//     id: 4,
//     src: '/images/build4.jpeg',
//     desc: 'CUSTOM FABRICATION',
//     title: 'Complex requirements transformed into practical, precisely fabricated solutions.',
//     pos: { top: '20%', left: '1%' },
//     button: true,
//   },
// ]

// export default function Industries() {
//   const [loading, setLoading] = useState(true)
//   const [showHero, setShowHero] = useState(false)
//   const [showCapability, setShowCapability] = useState(false)
//   const [showFinal, setShowFinal] = useState(false)

//   const loadingRef = useRef(true)
//   const stageRef = useRef(STAGE_HERO)
//   const scrollProgressRef = useRef(0)
//   const isTransitioning = useRef(false)
//   const lastStageRef = useRef(-1)

//   const heroRef = useRef(null)
//   const capabilityRef = useRef(null)
//   const contactRef = useRef(null)

//   const wheelAccumRef = useRef(0)
//   const rafIdRef = useRef(null)
//   const handleScrollStepRef = useRef(null)

//   // Touch refs
//   const touchStartYRef = useRef(0)
//   const touchLastYRef = useRef(0)
//   const touchAccumRef = useRef(0)
//   const isTouchScrollingRef = useRef(false)

//   useEffect(() => {
//     handleScrollStepRef.current = handleScrollStep
//   })

//   useEffect(() => {
//     const handleGlobalLoadingComplete = () => {
//       setLoading(false)
//       setShowHero(true)

//       setTimeout(() => {
//         window.dispatchEvent(
//           new CustomEvent('stageChange', {
//             detail: {
//               stage: STAGE_HERO,
//               progress: 0,
//             },
//           })
//         )
//       }, 100)
//     }

//     window.addEventListener('globalLoadingComplete', handleGlobalLoadingComplete)
//     return () =>
//       window.removeEventListener('globalLoadingComplete', handleGlobalLoadingComplete)
//   }, [])

//   useEffect(() => {
//     loadingRef.current = loading
//   }, [loading])

//   // ==========================================================================
//   // Lock browser scroll (mobile + desktop)
//   // ==========================================================================
//   useEffect(() => {
//     const previousHtmlOverflow = document.documentElement.style.overflow
//     const previousBodyOverflow = document.body.style.overflow
//     const previousBodyOverscroll = document.body.style.overscrollBehavior
//     const previousBodyPosition = document.body.style.position

//     document.documentElement.style.overflow = 'hidden'
//     document.body.style.overflow = 'hidden'
//     document.body.style.overscrollBehavior = 'none'
//     document.body.style.position = 'fixed'
//     document.body.style.width = '100%'
//     document.body.style.height = '100%'

//     return () => {
//       document.documentElement.style.overflow = previousHtmlOverflow
//       document.body.style.overflow = previousBodyOverflow
//       document.body.style.overscrollBehavior = previousBodyOverscroll
//       document.body.style.position = previousBodyPosition
//       document.body.style.width = ''
//       document.body.style.height = ''
//     }
//   }, [])

//   // ==========================================================================
//   // Transition helpers
//   // ==========================================================================
//   const slideParallax = (overRef, underRef, progress) => {
//     const isMobileDevice = isMobileViewport()
//     const dur = isMobileDevice ? 0.05 : 0.1 // mobile par tez

//     if (overRef?.current) {
//       gsap.to(overRef.current, {
//         y: `${(1 - progress) * 100}%`,
//         duration: dur,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }

//     if (underRef?.current) {
//       gsap.to(underRef.current, {
//         y: `${-8 * progress}%`,
//         scale: 1 - 0.03 * progress,
//         duration: dur,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }
//   }

//   const resetParallaxUnder = (ref) => {
//     if (ref?.current) {
//       gsap.set(ref.current, {
//         y: '0%',
//         opacity: 1,
//         scale: 1,
//       })
//     }
//   }

//   const mountForward = (setter, ref, nextStage) => {
//     isTransitioning.current = true
//     stageRef.current = nextStage
//     setter(true)
//     scrollProgressRef.current = 0

//     requestAnimationFrame(() => {
//       requestAnimationFrame(() => {
//         if (ref?.current) {
//           gsap.set(ref.current, { y: '100%' })
//         }
//         // Mobile par thoda extra settle time
//         setTimeout(
//           () => {
//             isTransitioning.current = false
//           },
//           isMobileViewport() ? 80 : 0
//         )
//       })
//     })
//   }

//   const unmountBackward = (setter, underRef, previousStage, onComplete) => {
//     isTransitioning.current = true
//     setter(false)
//     resetParallaxUnder(underRef)
//     stageRef.current = previousStage
//     scrollProgressRef.current = 1

//     if (onComplete) {
//       onComplete()
//     }

//     requestAnimationFrame(() => {
//       isTransitioning.current = false
//     })
//   }

//   // ==========================================================================
//   // Core scroll step handler
//   // ==========================================================================
//   const handleScrollStep = (direction, factor) => {
//     if (loadingRef.current || isTransitioning.current) return

//     // 1. HERO STAGE
//     if (stageRef.current === STAGE_HERO) {
//       const step = getHeroStep()

//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(
//           scrollProgressRef.current + step * factor
//         )
//         dispatch('scrollProgress', scrollProgressRef.current)

//         if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
//           mountForward(setShowCapability, capabilityRef, STAGE_CAPABILITY)
//         }
//       } else {
//         scrollProgressRef.current = clamp01(
//           scrollProgressRef.current - step * factor
//         )
//         dispatch('scrollProgress', scrollProgressRef.current)
//       }
//       return
//     }

//     // 2. CAPABILITY / INDUSTRIES STAGE
//     if (stageRef.current === STAGE_CAPABILITY) {
//       const step = getIndustriesStep()
//       const capSplit = getIndustriesSplit()

//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(
//           scrollProgressRef.current + step * factor
//         )

//         if (scrollProgressRef.current <= capSplit) {
//           slideParallax(
//             capabilityRef,
//             heroRef,
//             scrollProgressRef.current / capSplit
//           )
//         } else {
//           slideParallax(capabilityRef, heroRef, 1)

//           const subProgress =
//             (scrollProgressRef.current - capSplit) / (1 - capSplit)

//           dispatch('capabilityProgress', subProgress)

//           if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
//             mountForward(setShowFinal, contactRef, STAGE_FINAL)
//           }
//         }
//       } else {
//         scrollProgressRef.current = Math.max(
//           0,
//           scrollProgressRef.current - step * factor
//         )

//         if (scrollProgressRef.current <= capSplit) {
//           slideParallax(
//             capabilityRef,
//             heroRef,
//             scrollProgressRef.current / capSplit
//           )
//           dispatch('capabilityProgress', 0)
//         } else {
//           dispatch(
//             'capabilityProgress',
//             (scrollProgressRef.current - capSplit) / (1 - capSplit)
//           )
//         }

//         if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
//           unmountBackward(setShowCapability, heroRef, STAGE_HERO, () => {
//             dispatch('scrollProgress', 1)
//           })
//         }
//       }
//       return
//     }

//     // ==========================================================
//     // 3. FINAL / CONTACT STAGE
//     //    MOBILE par simple slide (Home/About/Capabilities jaisa)
//     //    DESKTOP par fade + split (jaisa abhi hai)
//     // ==========================================================
//     if (stageRef.current === STAGE_FINAL) {
//       const isMobileDevice = isMobileViewport()

//       // ----- MOBILE: simple slide -----
//       if (isMobileDevice) {
//         const step = MOBILE_SLIDE_STEP

//         if (direction > 0) {
//           scrollProgressRef.current = clamp01(
//             scrollProgressRef.current + step * factor
//           )
//           slideParallax(contactRef, capabilityRef, scrollProgressRef.current)
//           dispatch('contactProgress', 1)
//         } else {
//           scrollProgressRef.current = Math.max(
//             0,
//             scrollProgressRef.current - step * factor
//           )
//           slideParallax(contactRef, capabilityRef, scrollProgressRef.current)
//           dispatch('contactProgress', 1)

//           if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
//             unmountBackward(setShowFinal, capabilityRef, STAGE_CAPABILITY, () => {
//               dispatch('capabilityProgress', 1)
//             })
//           }
//         }
//         return
//       }

//       // ----- DESKTOP: fade + split (unchanged) -----
//       const step = getStep('final')

//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(
//           scrollProgressRef.current + step * factor
//         )

//         if (scrollProgressRef.current <= FINAL_SPLIT) {
//           slideParallax(
//             contactRef,
//             capabilityRef,
//             scrollProgressRef.current / FINAL_SPLIT
//           )
//         } else {
//           slideParallax(contactRef, capabilityRef, 1)

//           const subProgress =
//             (scrollProgressRef.current - FINAL_SPLIT) / (1 - FINAL_SPLIT)

//           dispatch('contactProgress', subProgress)
//         }
//       } else {
//         scrollProgressRef.current = Math.max(
//           0,
//           scrollProgressRef.current - step * factor
//         )

//         if (scrollProgressRef.current <= FINAL_SPLIT) {
//           slideParallax(
//             contactRef,
//             capabilityRef,
//             scrollProgressRef.current / FINAL_SPLIT
//           )
//           dispatch('contactProgress', 0)
//         } else {
//           dispatch(
//             'contactProgress',
//             (scrollProgressRef.current - FINAL_SPLIT) / (1 - FINAL_SPLIT)
//           )
//         }

//         if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
//           unmountBackward(setShowFinal, capabilityRef, STAGE_CAPABILITY, () => {
//             dispatch('capabilityProgress', 1)
//           })
//         }
//       }
//       return
//     }
//   }

//   // ==========================================================================
//   // Wheel + Touch + Keyboard listeners
//   // ==========================================================================
//   useEffect(() => {
//     // ---- Wheel ----
//     const handleWheel = (event) => {
//       event.preventDefault()
//       if (loadingRef.current) return
//       wheelAccumRef.current += event.deltaY
//     }

//     // ---- Touch ----
//     const handleTouchStart = (e) => {
//       if (loadingRef.current) return
//       if (document.querySelector('.nav-sidebar')) return

//       touchStartYRef.current = e.touches[0].clientY
//       touchLastYRef.current = e.touches[0].clientY
//       touchAccumRef.current = 0
//       isTouchScrollingRef.current = true
//     }

//     const handleTouchMove = (e) => {
//       if (!isTouchScrollingRef.current) return
//       if (loadingRef.current) return
//       if (document.querySelector('.nav-sidebar')) return

//       const currentY = e.touches[0].clientY
//       const deltaY = touchLastYRef.current - currentY
//       touchLastYRef.current = currentY

//       const multiplier = getTouchMultiplier()
//       const touchDelta = deltaY * multiplier * INPUT_CONFIG.touchDeltaMultiplier

//       wheelAccumRef.current += touchDelta

//       if (e.cancelable) e.preventDefault()
//     }

//     const handleTouchEnd = () => {
//       isTouchScrollingRef.current = false
//       touchStartYRef.current = 0
//       touchLastYRef.current = 0
//     }

//     // ---- Keyboard ----
//     const handleKeyDown = (event) => {
//       if (loadingRef.current || isTransitioning.current) return

//       const key = event.key

//       if (key === 'ArrowDown' || key === 'PageDown' || key === ' ') {
//         event.preventDefault()
//         handleScrollStep(1, key === ' ' ? 1.2 : 1)
//       } else if (key === 'ArrowUp' || key === 'PageUp') {
//         event.preventDefault()
//         handleScrollStep(-1, 1)
//       } else if (key === 'Home') {
//         event.preventDefault()
//         window.dispatchEvent(
//           new CustomEvent('travelToStage', { detail: { stage: STAGE_HERO } })
//         )
//       } else if (key === 'End') {
//         event.preventDefault()
//         window.dispatchEvent(
//           new CustomEvent('travelToStage', { detail: { stage: STAGE_FINAL } })
//         )
//       }
//     }

//     // ---- rAF tick ----
//     const tick = () => {
//       if (isTransitioning.current) {
//         wheelAccumRef.current = 0
//       } else if (Math.abs(wheelAccumRef.current) > INPUT_CONFIG.wheelDeadZone) {
//         const raw = wheelAccumRef.current
//         const direction = raw > 0 ? 1 : -1

//         // MOBILE/TABLET: factor ko 1.0 par lock karo (Capability jaisa smooth)
//         const isMobileDevice = isMobileViewport()
//         let factor
//         if (isMobileDevice) {
//           factor = 1.0
//         } else {
//           const magnitude = Math.min(Math.abs(raw), INPUT_CONFIG.wheelMagnitudeCap)
//           factor = Math.max(
//             INPUT_CONFIG.wheelFactorMin,
//             Math.min(INPUT_CONFIG.wheelFactorMax, magnitude / INPUT_CONFIG.wheelFactorDivisor)
//           )
//         }

//         handleScrollStep(direction, factor)

//         wheelAccumRef.current -= raw * INPUT_CONFIG.wheelDecay

//         if (Math.abs(wheelAccumRef.current) < INPUT_CONFIG.wheelDeadZone) {
//           wheelAccumRef.current = 0
//         }
//       }

//       if (stageRef.current !== lastStageRef.current) {
//         lastStageRef.current = stageRef.current
//         window.dispatchEvent(
//           new CustomEvent('stageChange', {
//             detail: {
//               stage: stageRef.current,
//               progress: scrollProgressRef.current,
//             },
//           })
//         )
//       }

//       window.dispatchEvent(
//         new CustomEvent('stageProgress', {
//           detail: {
//             stage: stageRef.current,
//             progress: scrollProgressRef.current,
//           },
//         })
//       )

//       rafIdRef.current = requestAnimationFrame(tick)
//     }

//     window.addEventListener('wheel', handleWheel, { passive: false })
//     window.addEventListener('touchstart', handleTouchStart, { passive: true })
//     window.addEventListener('touchmove', handleTouchMove, { passive: false })
//     window.addEventListener('touchend', handleTouchEnd, { passive: true })
//     window.addEventListener('touchcancel', handleTouchEnd, { passive: true })
//     window.addEventListener('keydown', handleKeyDown)

//     rafIdRef.current = requestAnimationFrame(tick)

//     return () => {
//       window.removeEventListener('wheel', handleWheel)
//       window.removeEventListener('touchstart', handleTouchStart)
//       window.removeEventListener('touchmove', handleTouchMove)
//       window.removeEventListener('touchend', handleTouchEnd)
//       window.removeEventListener('touchcancel', handleTouchEnd)
//       window.removeEventListener('keydown', handleKeyDown)
//       if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   // ==========================================================================
//   // Resize handling
//   // ==========================================================================
//   useEffect(() => {
//     let resizeTimer = null
//     const handleResize = () => {
//       if (resizeTimer) clearTimeout(resizeTimer)
//       resizeTimer = setTimeout(() => {
//         wheelAccumRef.current = 0
//       }, 150)
//     }
//     window.addEventListener('resize', handleResize)
//     window.addEventListener('orientationchange', handleResize)
//     return () => {
//       window.removeEventListener('resize', handleResize)
//       window.removeEventListener('orientationchange', handleResize)
//       if (resizeTimer) clearTimeout(resizeTimer)
//     }
//   }, [])

//   // ==========================================================================
//   // Render
//   // ==========================================================================
//   return (
//     <main
//       className="main-container"
//       style={{
//         position: 'relative',
//         width: '100%',
//         maxWidth: '100vw',
//         height: '100dvh',
//         overflow: 'hidden',
//         overscrollBehavior: 'none',
//         touchAction: 'none',
//       }}
//     >
//       {loading && <LoadingScreen />}

//       {!loading && <NavContent />}

//       {/* Stage 0: Hero */}
//       {showHero && (
//         <div ref={heroRef} className="hero-wrapper" style={fixedWrapperStyle(1)}>
//           {/* <HeroSection
//             headline={<>FABRICATION FOR<br/> THE TEAMS THAT BUILD</>}
//           /> */}
//          <HeroSection
//   // eyebrow="METAL FABRICATION EXCELLENCE"
//   headline="FABRICATION FOR THE TEAMS THAT"
//   highlightedHeadline="BUILD"
// />
//         </div>
//       )}

//       {/* Stage 1: Industries */}
//       {showCapability && (
//         <div
//           ref={capabilityRef}
//           className="second-section-wrapper"
//           style={slideInWrapperStyle(2)}
//         >
//           <InsustriesSection />
//         </div>
//       )}

//       {/* Stage 2 (Final): Contact */}
//       {showFinal && (
//         <div
//           ref={contactRef}
//           className="contact-section-wrapper"
//           style={slideInWrapperStyle(3)}
//         >
//           <ContactSection2 scrollProgressRef={scrollProgressRef} />
//         </div>
//       )}
//     </main>
//   )
// }
