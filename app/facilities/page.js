'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import HeroSection from '@/components/HeroSection/HeroSection'
import NavContent from '@/components/NavContent/NavContent'
import FacilitiesSection from '@/components/Industries/facilities'
import Section01SingleQuality from '@/components/Capababilities/singleQuality'
import ContactSection2 from '@/components/ContactSection/ContactSection2'

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
  getFacilitiesStep,
  getSingleStep,
  getTouchMultiplier,
  isMobileViewport,
} from '@/app/config/facilityScrollConfig'

// ----- Stage constants (total 4 stages) -----
const STAGE_HERO = 0
const STAGE_FACILITIES = 1
const STAGE_SINGLE = 2
const STAGE_FINAL = 3

// ----- Split shortcuts (pulled from config) -----
const FACILITIES_SPLIT = SPLITS.facilities
const SINGLE_SPLIT = SPLITS.single
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

const singleData = {
  title: 'SEE WHERE THE WORK <span>GETS DONE</span>',
  desc: 'Show the facility through photography and video—from laser cutting and welding to finishing, inspection and dispatch.',
  footer: 'Real fabrication. Real machinery. Real people.',
  buttonText: 'VIEW FACILITY GALLERY',
  buttonLink: '',
}

export default function Facility() {
  const [loading, setLoading] = useState(true)
  const [showHero, setShowHero] = useState(false)
  const [showFacilities, setShowFacilities] = useState(false)
  const [showSingle, setShowSingle] = useState(false)
  const [showFinal, setShowFinal] = useState(false)

  const loadingRef = useRef(true)
  const stageRef = useRef(STAGE_HERO)
  const scrollProgressRef = useRef(0)
  const isTransitioning = useRef(false)
  const lastStageRef = useRef(-1)

  // Stage element refs
  const heroRef = useRef(null)
  const facilitiesRef = useRef(null)
  const singleRef = useRef(null)
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
  // Lock root scroll (mobile + desktop)
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

    // 0. HERO STAGE
    if (stageRef.current === STAGE_HERO) {
      const step = getHeroStep()

      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + step * factor
        )
        dispatch('scrollProgress', scrollProgressRef.current)

        if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
          mountForward(setShowFacilities, facilitiesRef, STAGE_FACILITIES)
        }
      } else {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current - step * factor
        )
        dispatch('scrollProgress', scrollProgressRef.current)
      }
      return
    }

    // 1. FACILITIES STAGE
    if (stageRef.current === STAGE_FACILITIES) {
      const step = getFacilitiesStep()

      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + step * factor
        )

        if (scrollProgressRef.current <= FACILITIES_SPLIT) {
          slideParallax(
            facilitiesRef,
            heroRef,
            scrollProgressRef.current / FACILITIES_SPLIT
          )
        } else {
          slideParallax(facilitiesRef, heroRef, 1)

          const subProgress =
            (scrollProgressRef.current - FACILITIES_SPLIT) /
            (1 - FACILITIES_SPLIT)

          dispatch('facilitiesProgress', subProgress)

          if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
            mountForward(setShowSingle, singleRef, STAGE_SINGLE)
          }
        }
      } else {
        scrollProgressRef.current = Math.max(
          0,
          scrollProgressRef.current - step * factor
        )

        if (scrollProgressRef.current <= FACILITIES_SPLIT) {
          slideParallax(
            facilitiesRef,
            heroRef,
            scrollProgressRef.current / FACILITIES_SPLIT
          )
          dispatch('facilitiesProgress', 0)
        } else {
          dispatch(
            'facilitiesProgress',
            (scrollProgressRef.current - FACILITIES_SPLIT) /
              (1 - FACILITIES_SPLIT)
          )
        }

        if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
          unmountBackward(setShowFacilities, heroRef, STAGE_HERO, () => {
            dispatch('scrollProgress', 1)
          })
        }
      }
      return
    }

    // 2. SINGLE QUALITY STAGE
    if (stageRef.current === STAGE_SINGLE) {
      const step = getSingleStep()

      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + step * factor
        )

        if (scrollProgressRef.current <= SINGLE_SPLIT) {
          slideParallax(
            singleRef,
            facilitiesRef,
            scrollProgressRef.current / SINGLE_SPLIT
          )
          dispatch('singleQualityProgress', 0)
        } else {
          slideParallax(singleRef, facilitiesRef, 1)

          const activeProgress =
            (scrollProgressRef.current - SINGLE_SPLIT) /
            (1 - SINGLE_SPLIT)

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
            facilitiesRef,
            scrollProgressRef.current / SINGLE_SPLIT
          )
          dispatch('singleQualityProgress', 0)
        } else {
          slideParallax(singleRef, facilitiesRef, 1)

          const activeProgress =
            (scrollProgressRef.current - SINGLE_SPLIT) /
            (1 - SINGLE_SPLIT)

          dispatch('singleQualityProgress', activeProgress)
        }

        if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
          unmountBackward(setShowSingle, facilitiesRef, STAGE_FACILITIES, () => {
            dispatch('facilitiesProgress', 1)
          })
        }
      }
      return
    }

    // ==========================================================
    // 3. FINAL / CONTACT STAGE
    //    MOBILE par simple slide (Home/About/Capabilities jaisa)
    //    DESKTOP par fade + split (jaisa abhi hai)
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
            unmountBackward(setShowFinal, singleRef, STAGE_SINGLE, () => {
              dispatch('singleQualityProgress', 1)
            })
          }
        }
        return
      }

      // ----- DESKTOP: fade + split (unchanged) -----
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
            headline={<>WHERE PRECISION BECOMES <span>PRODUCTION</span></>}
          />
        </div>
      )}

      {/* Stage 1: Facilities */}
      {showFacilities && (
        <div
          ref={facilitiesRef}
          className="facilities-section-wrapper"
          style={slideInWrapperStyle(2)}
        >
          <FacilitiesSection progressEventName="facilitiesProgress" />
        </div>
      )}

      {/* Stage 2: Single Quality */}
      {showSingle && (
        <div
          ref={singleRef}
          className="single-quality-section-wrapper"
          style={slideInWrapperStyle(3)}
        >
          <Section01SingleQuality
            data={singleData}
            eventName="singleQualityProgress"
          />
        </div>
      )}

      {/* Stage 3: Final / Contact Section */}
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
// import FacilitiesSection from '@/components/Industries/facilities'
// import Section01SingleQuality from '@/components/Capababilities/singleQuality'
// import ContactSection2 from '@/components/ContactSection/ContactSection2'

// // Stages Configuration (Total 4 Stages)
// const STAGE_HERO = 0
// const STAGE_FACILITIES = 1
// const STAGE_SINGLE = 2
// const STAGE_FINAL = 3

// // Scroll Step sizes per stage (desktop baseline)
// const HERO_STEP = 0.08
// const FACILITIES_STEP = 0.012
// const SINGLE_STEP = 0.02
// const FINAL_STEP = 0.025

// // Parallax entrance splits
// const FACILITIES_SPLIT = 0.3
// const SINGLE_SPLIT = 0.2
// const FINAL_SPLIT = 0.4

// // ---------------------------------------------------------------------------
// // Mobile-aware step helpers
// // ---------------------------------------------------------------------------
// const getHeroStep = () => {
//     if (typeof window === 'undefined') return HERO_STEP
//     const w = window.innerWidth
//     if (w <= 480) return 0.080    // tez — hero jaldi khatam
//     if (w <= 768) return 0.085
//     if (w <= 1024) return 0.075
//     return HERO_STEP
// }

// const getFacilitiesStep = () => {
//     if (typeof window === 'undefined') return FACILITIES_STEP
//     const w = window.innerWidth
//     if (w <= 480) return 0.006    // 0.010 → 0.006 (slow)
//     if (w <= 768) return 0.008    // 0.012 → 0.008 (slow)
//     if (w <= 1024) return 0.010   // 0.016 → 0.010
//     return FACILITIES_STEP         // desktop 0.012
// }

// const getSingleStep = () => {
//     if (typeof window === 'undefined') return SINGLE_STEP
//     const w = window.innerWidth
//     if (w <= 480) return 0.010
//     if (w <= 768) return 0.012
//     if (w <= 1024) return 0.016
//     return SINGLE_STEP
// }

// // ContactSection2 — same as home page.js
// const getFinalStep = () => FINAL_STEP

// // ---------------------------------------------------------------------------
// // Touch sensitivity
// // ---------------------------------------------------------------------------
// const getTouchMultiplier = () => {
//     if (typeof window === 'undefined') return 1.2
//     const w = window.innerWidth
//     if (w < 480) return 1.6
//     if (w < 768) return 1.4
//     if (w < 1024) return 1.2
//     return 1.0
// }

// const clamp01 = (value) => Math.max(0, Math.min(1, value))

// const dispatch = (name, progress) => {
//     window.dispatchEvent(
//         new CustomEvent(name, {
//             detail: { progress },
//         })
//     )
// }

// const fixedWrapperStyle = (zIndex) => ({
//     position: 'fixed',
//     inset: 0,
//     width: '100%',
//     height: '100dvh',
//     zIndex,
//     overflow: 'hidden',
//     backgroundColor: 'var(--color-black, #0a0a0a)',
//     willChange: 'transform, opacity',
// })

// const singleData = {
//     title: 'SEE WHERE THE WORK <span>GETS DONE</span>',
//     desc: 'Show the facility through photography and video—from laser cutting and welding to finishing, inspection and dispatch.',
//     footer: 'Real fabrication. Real machinery. Real people.',
//     buttonText: 'VIEW FACILITY GALLERY',
// }

// export default function Industries() {
//     const [loading, setLoading] = useState(true)
//     const [showHero, setShowHero] = useState(false)
//     const [showFacilities, setShowFacilities] = useState(false)
//     const [showSingle, setShowSingle] = useState(false)
//     const [showFinal, setShowFinal] = useState(false)

//     const loadingRef = useRef(true)
//     const stageRef = useRef(STAGE_HERO)
//     const scrollProgressRef = useRef(0)
//     const isTransitioning = useRef(false)
//     const lastStageRef = useRef(-1)

//     // Stage element refs
//     const heroRef = useRef(null)
//     const facilitiesRef = useRef(null)
//     const singleRef = useRef(null)
//     const contactRef = useRef(null)

//     const wheelAccumRef = useRef(0)
//     const rafIdRef = useRef(null)
//     const handleScrollStepRef = useRef(null)

//     // Touch refs
//     const touchStartYRef = useRef(0)
//     const touchLastYRef = useRef(0)
//     const touchAccumRef = useRef(0)
//     const isTouchScrollingRef = useRef(false)

//     useEffect(() => {
//         handleScrollStepRef.current = handleScrollStep
//     })

//     useEffect(() => {
//         const handleGlobalLoadingComplete = () => {
//             setLoading(false)
//             setShowHero(true)

//             setTimeout(() => {
//                 window.dispatchEvent(
//                     new CustomEvent('stageChange', {
//                         detail: {
//                             stage: STAGE_HERO,
//                             progress: 0,
//                         },
//                     })
//                 )
//             }, 100)
//         }

//         window.addEventListener('globalLoadingComplete', handleGlobalLoadingComplete)
//         return () => window.removeEventListener('globalLoadingComplete', handleGlobalLoadingComplete)
//     }, [])

//     useEffect(() => {
//         loadingRef.current = loading
//     }, [loading])

//     // Lock root scroll (mobile + desktop)
//     useEffect(() => {
//         const previousHtmlOverflow = document.documentElement.style.overflow
//         const previousBodyOverflow = document.body.style.overflow
//         const previousBodyOverscroll = document.body.style.overscrollBehavior
//         const previousBodyPosition = document.body.style.position

//         document.documentElement.style.overflow = 'hidden'
//         document.body.style.overflow = 'hidden'
//         document.body.style.overscrollBehavior = 'none'
//         document.body.style.position = 'fixed'
//         document.body.style.width = '100%'
//         document.body.style.height = '100%'

//         return () => {
//             document.documentElement.style.overflow = previousHtmlOverflow
//             document.body.style.overflow = previousBodyOverflow
//             document.body.style.overscrollBehavior = previousBodyOverscroll
//             document.body.style.position = previousBodyPosition
//             document.body.style.width = ''
//             document.body.style.height = ''
//         }
//     }, [])

//     const slideParallax = (overRef, underRef, progress) => {
//         if (overRef?.current) {
//             gsap.to(overRef.current, {
//                 y: `${(1 - progress) * 100}%`,
//                 duration: 0.1,
//                 ease: 'power2.out',
//                 overwrite: 'auto',
//             })
//         }

//         if (underRef?.current) {
//             gsap.to(underRef.current, {
//                 y: `${-8 * progress}%`,
//                 scale: 1 - 0.03 * progress,
//                 duration: 0.1,
//                 ease: 'power2.out',
//                 overwrite: 'auto',
//             })
//         }
//     }

//     const resetParallaxUnder = (ref) => {
//         if (ref?.current) {
//             gsap.set(ref.current, {
//                 y: '0%',
//                 opacity: 1,
//                 scale: 1,
//             })
//         }
//     }

//     const mountForward = (setter, ref, nextStage) => {
//         isTransitioning.current = true
//         stageRef.current = nextStage
//         setter(true)
//         scrollProgressRef.current = 0

//         requestAnimationFrame(() => {
//             requestAnimationFrame(() => {
//                 if (ref?.current) {
//                     gsap.set(ref.current, { y: '100%' })
//                 }
//                 isTransitioning.current = false
//             })
//         })
//     }

//     const unmountBackward = (setter, underRef, previousStage, onComplete) => {
//         isTransitioning.current = true
//         setter(false)
//         resetParallaxUnder(underRef)
//         stageRef.current = previousStage
//         scrollProgressRef.current = 1

//         if (onComplete) {
//             onComplete()
//         }

//         requestAnimationFrame(() => {
//             isTransitioning.current = false
//         })
//     }

//     const handleScrollStep = (direction, factor) => {
//         if (loadingRef.current || isTransitioning.current) return

//         // 0. HERO STAGE
//         if (stageRef.current === STAGE_HERO) {
//             const step = getHeroStep()

//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(
//                     scrollProgressRef.current + step * factor
//                 )
//                 dispatch('scrollProgress', scrollProgressRef.current)

//                 if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
//                     mountForward(setShowFacilities, facilitiesRef, STAGE_FACILITIES)
//                 }
//             } else {
//                 scrollProgressRef.current = clamp01(
//                     scrollProgressRef.current - step * factor
//                 )
//                 dispatch('scrollProgress', scrollProgressRef.current)
//             }
//             return
//         }

//         // 1. FACILITIES STAGE
//         if (stageRef.current === STAGE_FACILITIES) {
//             const step = getFacilitiesStep()

//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(
//                     scrollProgressRef.current + step * factor
//                 )

//                 if (scrollProgressRef.current <= FACILITIES_SPLIT) {
//                     slideParallax(
//                         facilitiesRef,
//                         heroRef,
//                         scrollProgressRef.current / FACILITIES_SPLIT
//                     )
//                 } else {
//                     slideParallax(facilitiesRef, heroRef, 1)

//                     const subProgress =
//                         (scrollProgressRef.current - FACILITIES_SPLIT) /
//                         (1 - FACILITIES_SPLIT)

//                     dispatch('facilitiesProgress', subProgress)

//                     if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
//                         mountForward(setShowSingle, singleRef, STAGE_SINGLE)
//                     }
//                 }
//             } else {
//                 scrollProgressRef.current = Math.max(
//                     0,
//                     scrollProgressRef.current - step * factor
//                 )

//                 if (scrollProgressRef.current <= FACILITIES_SPLIT) {
//                     slideParallax(
//                         facilitiesRef,
//                         heroRef,
//                         scrollProgressRef.current / FACILITIES_SPLIT
//                     )
//                     dispatch('facilitiesProgress', 0)
//                 } else {
//                     dispatch(
//                         'facilitiesProgress',
//                         (scrollProgressRef.current - FACILITIES_SPLIT) /
//                         (1 - FACILITIES_SPLIT)
//                     )
//                 }

//                 if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
//                     unmountBackward(setShowFacilities, heroRef, STAGE_HERO, () => {
//                         dispatch('scrollProgress', 1)
//                     })
//                 }
//             }
//             return
//         }

//         // 2. SINGLE QUALITY STAGE
//         if (stageRef.current === STAGE_SINGLE) {
//             const step = getSingleStep()

//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(
//                     scrollProgressRef.current + step * factor
//                 )

//                 if (scrollProgressRef.current <= SINGLE_SPLIT) {
//                     slideParallax(
//                         singleRef,
//                         facilitiesRef,
//                         scrollProgressRef.current / SINGLE_SPLIT
//                     )
//                     dispatch('singleQualityProgress', 0)
//                 } else {
//                     slideParallax(singleRef, facilitiesRef, 1)

//                     const activeProgress =
//                         (scrollProgressRef.current - SINGLE_SPLIT) /
//                         (1 - SINGLE_SPLIT)

//                     dispatch('singleQualityProgress', activeProgress)

//                     if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
//                         mountForward(setShowFinal, contactRef, STAGE_FINAL)
//                     }
//                 }
//             } else {
//                 scrollProgressRef.current = Math.max(
//                     0,
//                     scrollProgressRef.current - step * factor
//                 )

//                 if (scrollProgressRef.current <= SINGLE_SPLIT) {
//                     slideParallax(
//                         singleRef,
//                         facilitiesRef,
//                         scrollProgressRef.current / SINGLE_SPLIT
//                     )
//                     dispatch('singleQualityProgress', 0)
//                 } else {
//                     slideParallax(singleRef, facilitiesRef, 1)

//                     const activeProgress =
//                         (scrollProgressRef.current - SINGLE_SPLIT) /
//                         (1 - SINGLE_SPLIT)

//                     dispatch('singleQualityProgress', activeProgress)
//                 }

//                 if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
//                     unmountBackward(setShowSingle, facilitiesRef, STAGE_FACILITIES, () => {
//                         dispatch('facilitiesProgress', 1)
//                     })
//                 }
//             }
//             return
//         }

//         // 3. FINAL / CONTACT STAGE
//         if (stageRef.current === STAGE_FINAL) {
//             const step = getFinalStep()

//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(
//                     scrollProgressRef.current + step * factor
//                 )

//                 if (scrollProgressRef.current <= FINAL_SPLIT) {
//                     slideParallax(
//                         contactRef,
//                         singleRef,
//                         scrollProgressRef.current / FINAL_SPLIT
//                     )
//                 } else {
//                     slideParallax(contactRef, singleRef, 1)

//                     const subProgress =
//                         (scrollProgressRef.current - FINAL_SPLIT) /
//                         (1 - FINAL_SPLIT)

//                     dispatch('contactProgress', subProgress)
//                 }
//             } else {
//                 scrollProgressRef.current = Math.max(
//                     0,
//                     scrollProgressRef.current - step * factor
//                 )

//                 if (scrollProgressRef.current <= FINAL_SPLIT) {
//                     slideParallax(
//                         contactRef,
//                         singleRef,
//                         scrollProgressRef.current / FINAL_SPLIT
//                     )
//                     dispatch('contactProgress', 0)
//                 } else {
//                     dispatch(
//                         'contactProgress',
//                         (scrollProgressRef.current - FINAL_SPLIT) /
//                         (1 - FINAL_SPLIT)
//                     )
//                 }

//                 if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
//                     unmountBackward(setShowFinal, singleRef, STAGE_SINGLE, () => {
//                         dispatch('singleQualityProgress', 1)
//                     })
//                 }
//             }
//             return
//         }
//     }

//     // ---------------------------------------------------------------------
//     // Wheel + Touch + Keyboard listeners
//     // ---------------------------------------------------------------------
//     useEffect(() => {
//         // ---- Wheel ----
//         const handleWheel = (event) => {
//             event.preventDefault()
//             if (loadingRef.current) return
//             wheelAccumRef.current += event.deltaY
//         }

//         // ---- Touch ----
//         const handleTouchStart = (e) => {
//             if (loadingRef.current) return
//             if (document.querySelector('.nav-sidebar')) return

//             touchStartYRef.current = e.touches[0].clientY
//             touchLastYRef.current = e.touches[0].clientY
//             touchAccumRef.current = 0
//             isTouchScrollingRef.current = true
//         }

//         const handleTouchMove = (e) => {
//             if (!isTouchScrollingRef.current) return
//             if (loadingRef.current) return
//             if (document.querySelector('.nav-sidebar')) return

//             const currentY = e.touches[0].clientY
//             const deltaY = touchLastYRef.current - currentY
//             touchLastYRef.current = currentY

//             const multiplier = getTouchMultiplier()
//             wheelAccumRef.current += deltaY * multiplier * 2.5

//             if (e.cancelable) e.preventDefault()
//         }

//         const handleTouchEnd = () => {
//             isTouchScrollingRef.current = false
//             touchStartYRef.current = 0
//             touchLastYRef.current = 0
//         }

//         // ---- Keyboard ----
//         const handleKeyDown = (event) => {
//             if (loadingRef.current || isTransitioning.current) return

//             const key = event.key

//             if (key === 'ArrowDown' || key === 'PageDown' || key === ' ') {
//                 event.preventDefault()
//                 handleScrollStep(1, key === ' ' ? 1.2 : 1)
//             } else if (key === 'ArrowUp' || key === 'PageUp') {
//                 event.preventDefault()
//                 handleScrollStep(-1, 1)
//             } else if (key === 'Home') {
//                 event.preventDefault()
//                 window.dispatchEvent(new CustomEvent('travelToStage', { detail: { stage: STAGE_HERO } }))
//             } else if (key === 'End') {
//                 event.preventDefault()
//                 window.dispatchEvent(new CustomEvent('travelToStage', { detail: { stage: STAGE_FINAL } }))
//             }
//         }

//         // ---- rAF tick ----
//         const tick = () => {
//             if (isTransitioning.current) {
//                 wheelAccumRef.current = 0
//             } else if (Math.abs(wheelAccumRef.current) > 0.5) {
//                 const raw = wheelAccumRef.current
//                 const direction = raw > 0 ? 1 : -1
//                 const magnitude = Math.min(Math.abs(raw), 120)
//                 const factor = Math.max(0.2, Math.min(1.6, magnitude / 55))

//                 handleScrollStep(direction, factor)

//                 wheelAccumRef.current -= raw * 0.55

//                 if (Math.abs(wheelAccumRef.current) < 0.5) {
//                     wheelAccumRef.current = 0
//                 }
//             }

//             if (stageRef.current !== lastStageRef.current) {
//                 lastStageRef.current = stageRef.current
//                 window.dispatchEvent(
//                     new CustomEvent('stageChange', {
//                         detail: {
//                             stage: stageRef.current,
//                             progress: scrollProgressRef.current,
//                         },
//                     })
//                 )
//             }

//             window.dispatchEvent(
//                 new CustomEvent('stageProgress', {
//                     detail: {
//                         stage: stageRef.current,
//                         progress: scrollProgressRef.current,
//                     },
//                 })
//             )

//             rafIdRef.current = requestAnimationFrame(tick)
//         }

//         window.addEventListener('wheel', handleWheel, { passive: false })
//         window.addEventListener('touchstart', handleTouchStart, { passive: true })
//         window.addEventListener('touchmove', handleTouchMove, { passive: false })
//         window.addEventListener('touchend', handleTouchEnd, { passive: true })
//         window.addEventListener('touchcancel', handleTouchEnd, { passive: true })
//         window.addEventListener('keydown', handleKeyDown)

//         rafIdRef.current = requestAnimationFrame(tick)

//         return () => {
//             window.removeEventListener('wheel', handleWheel)
//             window.removeEventListener('touchstart', handleTouchStart)
//             window.removeEventListener('touchmove', handleTouchMove)
//             window.removeEventListener('touchend', handleTouchEnd)
//             window.removeEventListener('touchcancel', handleTouchEnd)
//             window.removeEventListener('keydown', handleKeyDown)
//             if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])

//     // Resize handling
//     useEffect(() => {
//         let resizeTimer = null
//         const handleResize = () => {
//             if (resizeTimer) clearTimeout(resizeTimer)
//             resizeTimer = setTimeout(() => {
//                 wheelAccumRef.current = 0
//             }, 150)
//         }
//         window.addEventListener('resize', handleResize)
//         window.addEventListener('orientationchange', handleResize)
//         return () => {
//             window.removeEventListener('resize', handleResize)
//             window.removeEventListener('orientationchange', handleResize)
//             if (resizeTimer) clearTimeout(resizeTimer)
//         }
//     }, [])

//     return (
//         <main
//             className="main-container"
//             style={{
//                 position: 'relative',
//                 width: '100%',
//                 maxWidth: '100vw',
//                 height: '100dvh',
//                 overflow: 'hidden',
//                 overscrollBehavior: 'none',
//                 touchAction: 'none',
//             }}
//         >
//             {loading && <LoadingScreen />}

//             {!loading && <NavContent />}

//             {/* Stage 0: Hero */}
//             {showHero && (
//                 <div
//                     ref={heroRef}
//                     className="hero-wrapper"
//                     style={fixedWrapperStyle(1)}
//                 >
//                     <HeroSection headline={<>WHERE PRECISION BECOMES <span>PRODUCTION</span></>} />
//                 </div>
//             )}

//             {/* Stage 1: Facilities */}
//             {showFacilities && (
//                 <div
//                     ref={facilitiesRef}
//                     className="facilities-section-wrapper"
//                     style={fixedWrapperStyle(2)}
//                 >
//                     <FacilitiesSection progressEventName="facilitiesProgress" />
//                 </div>
//             )}

//             {/* Stage 2: Single Quality */}
//             {showSingle && (
//                 <div
//                     ref={singleRef}
//                     className="single-quality-section-wrapper"
//                     style={fixedWrapperStyle(3)}
//                 >
//                     <Section01SingleQuality
//                         data={singleData}
//                         eventName="singleQualityProgress"
//                     />
//                 </div>
//             )}

//             {/* Stage 3: Final / Contact Section */}
//             {showFinal && (
//                 <div
//                     ref={contactRef}
//                     className="contact-section-wrapper"
//                     style={fixedWrapperStyle(4)}
//                 >
//                     <ContactSection2 scrollProgressRef={scrollProgressRef} />
//                 </div>
//             )}
//         </main>
//     )
// }
