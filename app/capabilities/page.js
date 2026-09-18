// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import gsap from 'gsap'

// import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
// import HeroSection from '@/components/HeroSection/HeroSection'
// import Section01Cap from '@/components/Capababilities/capabilities'
// import CapabilitySection from '@/components/CapabilitySection/CapabilitySection'
// import NavContent from '@/components/NavContent/NavContent'
// import StatsShowcase from '@/components/Stats/stats'
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
//   getCapabilityStep,
//   getTouchMultiplier,
//   isMobileViewport,
// } from '@/app/config/capabilitiesScrollConfig'

// // ----- Stage constants -----
// const STAGE_HERO = 0
// const STAGE_CAPABILITY = 1
// const STAGE_THREE = 2
// const STAGE_STATS = 3
// const STAGE_FINAL = 4

// // ----- Split shortcuts (pulled from config) -----
// const CAPABILITY_SPLIT = SPLITS.capability
// const SECTION_THREE_SPLIT = SPLITS.sectionThree
// const STATS_SPLIT = SPLITS.stats
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

// const POINTS = [
// //   {
// //     titleFirst: 'MATERIAL',
// //     titleSecond: '',
// //     coloredPart: 'second',
// //     description: 'Material is checked against the project requirement.',
// //     descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
// //     images: [
// //       { src: '/images/precision1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
// //       { src: '/images/precision2.png', top: '50%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
// //     ],
// //     titlePos: { top: '20%', left: '55%' },
// //     mobileTitlePos: { top: '0%', left: '6%' },
// //     mobileDescPos: { top: '62%', left: '6%', maxWidth: '100%' },
// //   },
// //   {
// //     titleFirst: 'FABRICATION',
// //     titleSecond: '',
// //     coloredPart: 'second',
// //     description: 'Critical dimensions and processes are monitored during production.',
// //     descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
// //     images: [
// //       { src: '/images/capability1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
// //       { src: '/images/capability2.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
// //     ],
// //     titlePos: { top: '20%', left: '55%' },
// //     mobileTitlePos: { top: '0%', left: '6%' },
// //     mobileDescPos: { top: '62%', left: '6%', maxWidth: '100%' },
// //   },
// //   {
// //     titleFirst: 'ASSEMBLY',
// //     titleSecond: '',
// //     coloredPart: 'second',
// //     description: 'Components are checked for fit and alignment.',
// //     descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
// //     images: [
// //       { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
// //       { src: '/images/control2.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
// //     ],
// //     titlePos: { top: '20%', left: '55%' },
// //     mobileTitlePos: { top: '0%', left: '6%' },
// //     mobileDescPos: { top: '62%', left: '6%', maxWidth: '100%' },
// //   },
// //   {
// //     titleFirst: 'FINISHING',
// //     titleSecond: '',
// //     coloredPart: 'second',
// //     description: 'Surface treatment and finish are verified against the requirement.',
// //     descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
// //     images: [
// //       { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
// //       { src: '/images/control2.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
// //     ],
// //     titlePos: { top: '20%', left: '55%' },
// //     mobileTitlePos: { top: '0%', left: '6%' },
// //     mobileDescPos: { top: '62%', left: '6%', maxWidth: '100%' },
// //   },
// //   {
// //     titleFirst: 'FINAL',
// //     titleSecond: 'INSPECTION',
// //     coloredPart: 'second',
// //     description: 'Completed work is measured and checked before dispatch.',
// //     descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
// //     images: [
// //       { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
// //       { src: '/images/control2.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
// //     ],
// //     titlePos: { top: '20%', left: '55%' },
// //     mobileTitlePos: { top: '0%', left: '6%' },
// //     mobileDescPos: { top: '62%', left: '6%', maxWidth: '100%' },
// //     button: {
// //       label: 'DISCUSS YOUR REQUIREMENT',
// //       onClick: () => {
// //         console.log('Discuss button clicked')
// //       },
// //       pos: {
// //         top: '80%',
// //         left: '10%',
// //         speed: 0.12,
// //       },
// //       className: 'btn-blue',
// //     },
// //   },
// ]

// const STATS_DATA = [
//   {
//     number: '25K+',
//     title: ' SQ. FT.',
//     subtitle: 'Production facilities',
//   },
//   {
//     number: '40+',
//     title: 'Machines & equipment',
//     subtitle: '',
//   },
//   {
//     number: '25',
//     title: 'MM',
//     subtitle: 'Laser cutting capability',
//   },
//   {
//     number: '10',
//     title: 'TON',
//     subtitle: 'Lifting capacity',
//   },
// ]

// const TOTAL_PANELS = POINTS.length + 1

// export default function Home() {
//   const [loading, setLoading] = useState(true)
//   const [showHero, setShowHero] = useState(false)
//   const [showCapability, setShowCapability] = useState(false)
//   const [showSectionThree, setShowSectionThree] = useState(false)
//   const [showStats, setShowStats] = useState(false)
//   const [showFinal, setShowFinal] = useState(false)

//   const loadingRef = useRef(true)
//   const stageRef = useRef(STAGE_HERO)
//   const scrollProgressRef = useRef(0)
//   const isTransitioning = useRef(false)
//   const lastStageRef = useRef(-1)

//   const heroRef = useRef(null)
//   const capabilityRef = useRef(null)
//   const sectionThreeRef = useRef(null)
//   const statsRef = useRef(null)
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

//     // 2. CAPABILITIES (Section01Cap)
//     if (stageRef.current === STAGE_CAPABILITY) {
//       const step = getCapabilityStep()

//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(
//           scrollProgressRef.current + step * factor
//         )

//         if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//           slideParallax(
//             capabilityRef,
//             heroRef,
//             scrollProgressRef.current / CAPABILITY_SPLIT
//           )
//         } else {
//           slideParallax(capabilityRef, heroRef, 1)

//           const subProgress =
//             (scrollProgressRef.current - CAPABILITY_SPLIT) /
//             (1 - CAPABILITY_SPLIT)

//           dispatch('capabilityProgress', subProgress)

//           if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
//             mountForward(setShowSectionThree, sectionThreeRef, STAGE_THREE)
//           }
//         }
//       } else {
//         scrollProgressRef.current = Math.max(
//           0,
//           scrollProgressRef.current - step * factor
//         )

//         if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//           slideParallax(
//             capabilityRef,
//             heroRef,
//             scrollProgressRef.current / CAPABILITY_SPLIT
//           )
//           dispatch('capabilityProgress', 0)
//         } else {
//           dispatch(
//             'capabilityProgress',
//             (scrollProgressRef.current - CAPABILITY_SPLIT) /
//               (1 - CAPABILITY_SPLIT)
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

//     // 3. CAPABILITY SECTION (Precision Stage)
//     if (stageRef.current === STAGE_THREE) {
//       const step = getStep('sectionThree')

//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(
//           scrollProgressRef.current + step * factor
//         )

//         if (scrollProgressRef.current <= SECTION_THREE_SPLIT) {
//           slideParallax(
//             sectionThreeRef,
//             capabilityRef,
//             scrollProgressRef.current / SECTION_THREE_SPLIT
//           )
//         } else {
//           slideParallax(sectionThreeRef, capabilityRef, 1)

//           const subProgress =
//             (scrollProgressRef.current - SECTION_THREE_SPLIT) /
//             (1 - SECTION_THREE_SPLIT)

//           dispatch('capabilityProgress', subProgress)

//           if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
//             mountForward(setShowStats, statsRef, STAGE_STATS)
//           }
//         }
//       } else {
//         scrollProgressRef.current = Math.max(
//           0,
//           scrollProgressRef.current - step * factor
//         )

//         if (scrollProgressRef.current <= SECTION_THREE_SPLIT) {
//           slideParallax(
//             sectionThreeRef,
//             capabilityRef,
//             scrollProgressRef.current / SECTION_THREE_SPLIT
//           )
//           dispatch('capabilityProgress', 0)
//         } else {
//           dispatch(
//             'capabilityProgress',
//             (scrollProgressRef.current - SECTION_THREE_SPLIT) /
//               (1 - SECTION_THREE_SPLIT)
//           )
//         }

//         if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
//           unmountBackward(
//             setShowSectionThree,
//             capabilityRef,
//             STAGE_CAPABILITY,
//             () => {
//               dispatch('capabilityProgress', 1)
//             }
//           )
//         }
//       }
//       return
//     }

//     // 4. STATS & NUMBERS STAGE
//     if (stageRef.current === STAGE_STATS) {
//       const step = getStep('stats')

//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(
//           scrollProgressRef.current + step * factor
//         )

//         if (scrollProgressRef.current <= STATS_SPLIT) {
//           slideParallax(
//             statsRef,
//             sectionThreeRef,
//             scrollProgressRef.current / STATS_SPLIT
//           )
//         } else {
//           slideParallax(statsRef, sectionThreeRef, 1)

//           const subProgress =
//             (scrollProgressRef.current - STATS_SPLIT) /
//             (1 - STATS_SPLIT)

//           dispatch('statsProgress', subProgress)

//           if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
//             mountForward(setShowFinal, contactRef, STAGE_FINAL)
//           }
//         }
//       } else {
//         scrollProgressRef.current = Math.max(
//           0,
//           scrollProgressRef.current - step * factor
//         )

//         if (scrollProgressRef.current <= STATS_SPLIT) {
//           slideParallax(
//             statsRef,
//             sectionThreeRef,
//             scrollProgressRef.current / STATS_SPLIT
//           )
//           dispatch('statsProgress', 0)
//         } else {
//           dispatch(
//             'statsProgress',
//             (scrollProgressRef.current - STATS_SPLIT) /
//               (1 - STATS_SPLIT)
//           )
//         }

//         if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
//           unmountBackward(
//             setShowStats,
//             sectionThreeRef,
//             STAGE_THREE,
//             () => {
//               dispatch('capabilityProgress', 1)
//             }
//           )
//         }
//       }
//       return
//     }

//     // ==========================================================
//     // 5. FINAL (Contact Section)
//     //    MOBILE par simple slide (Home/About jaisa)
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
//           slideParallax(contactRef, statsRef, scrollProgressRef.current)
//           dispatch('contactProgress', 1)
//         } else {
//           scrollProgressRef.current = Math.max(
//             0,
//             scrollProgressRef.current - step * factor
//           )
//           slideParallax(contactRef, statsRef, scrollProgressRef.current)
//           dispatch('contactProgress', 1)

//           if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
//             unmountBackward(setShowFinal, statsRef, STAGE_STATS, () => {
//               dispatch('statsProgress', 1)
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
//             statsRef,
//             scrollProgressRef.current / FINAL_SPLIT
//           )
//         } else {
//           slideParallax(contactRef, statsRef, 1)

//           const subProgress =
//             (scrollProgressRef.current - FINAL_SPLIT) /
//             (1 - FINAL_SPLIT)

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
//             statsRef,
//             scrollProgressRef.current / FINAL_SPLIT
//           )
//           dispatch('contactProgress', 0)
//         } else {
//           dispatch(
//             'contactProgress',
//             (scrollProgressRef.current - FINAL_SPLIT) /
//               (1 - FINAL_SPLIT)
//           )
//         }

//         if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
//           unmountBackward(setShowFinal, statsRef, STAGE_STATS, () => {
//             dispatch('statsProgress', 1)
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
//           <HeroSection
//             headline={<>ENGINEERED TO FABRICATE. EQUIPPED TO <span>DELIVER</span></>}
//           />
//         </div>
//       )}

//       {/* Stage 1: Capabilities */}
//       {showCapability && (
//         <div
//           ref={capabilityRef}
//           className="second-section-wrapper"
//           style={slideInWrapperStyle(2)}
//         >
//           <Section01Cap />
//         </div>
//       )}

//       {/* Stage 2: CapabilitySection */}
//       {showSectionThree && (
//         <div
//           ref={sectionThreeRef}
//           className="third-section-wrapper"
//           style={fixedWrapperStyle(3)}
//         >
//           <CapabilitySection
//             POINTS={POINTS}
//             TOTAL_PANELS={TOTAL_PANELS}
//             heading_1="PRECISION DOESN'T END WHEN"
//             heading_2=" THE MACHINE STOPS"
//             paragraph="Every stage contributes to the final result."
//           />
//         </div>
//       )}

//       {/* Stage 3: Numbers & Stats Section */}
//       {showStats && (
//         <div
//           ref={statsRef}
//           className="fourth-section-wrapper"
//           style={fixedWrapperStyle(4)}
//         >
//           <StatsShowcase
//             stats={STATS_DATA}
//             title="THE NUMBERS BEHIND "
//             title_part_2="THE CAPABILITY"
//           />
//         </div>
//       )}

//       {/* Stage 4: Contact Section */}
//       {showFinal && (
//         <div
//           ref={contactRef}
//           className="contact-section-wrapper"
//           style={fixedWrapperStyle(5)}
//         >
//           <ContactSection2 scrollProgressRef={scrollProgressRef} />
//         </div>
//       )}
//     </main>
//   )
// }



'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import HeroSection from '@/components/HeroSection/HeroSection'
import Section01Cap from '@/components/Capababilities/capabilities'
import CapabilitySection from '@/components/CapabilitySection/CapabilitySection'
import NavContent from '@/components/NavContent/NavContent'
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
  getCapabilityStep,
  getTouchMultiplier,
  isMobileViewport,
} from '@/app/config/capabilitiesScrollConfig'

// ----- Stage constants (Stats hataya — ab 4 stages) -----
const STAGE_HERO = 0
const STAGE_CAPABILITY = 1
const STAGE_THREE = 2
const STAGE_FINAL = 3

// ----- Split shortcuts (pulled from config) -----
const CAPABILITY_SPLIT = SPLITS.capability
const SECTION_THREE_SPLIT = SPLITS.sectionThree
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

const POINTS = [
  // (aapke points commented hain — waise hi rahenge)
]

// STATS_DATA ab use nahi ho raha — comment kar diya
// const STATS_DATA = [
//   { number: '25K+', title: ' SQ. FT.', subtitle: 'Production facilities' },
//   { number: '40+', title: 'Machines & equipment', subtitle: '' },
//   { number: '25', title: 'MM', subtitle: 'Laser cutting capability' },
//   { number: '10', title: 'TON', subtitle: 'Lifting capacity' },
// ]

const TOTAL_PANELS = POINTS.length + 1

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [showHero, setShowHero] = useState(false)
  const [showCapability, setShowCapability] = useState(false)
  const [showSectionThree, setShowSectionThree] = useState(false)
  const [showFinal, setShowFinal] = useState(false)

  const loadingRef = useRef(true)
  const stageRef = useRef(STAGE_HERO)
  const scrollProgressRef = useRef(0)
  const isTransitioning = useRef(false)
  const lastStageRef = useRef(-1)

  const heroRef = useRef(null)
  const capabilityRef = useRef(null)
  const sectionThreeRef = useRef(null)
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
    const dur = isMobileDevice ? 0.05 : 0.1

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

    // 2. CAPABILITIES (Section01Cap)
    if (stageRef.current === STAGE_CAPABILITY) {
      const step = getCapabilityStep()

      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + step * factor
        )

        if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
          slideParallax(
            capabilityRef,
            heroRef,
            scrollProgressRef.current / CAPABILITY_SPLIT
          )
        } else {
          slideParallax(capabilityRef, heroRef, 1)

          const subProgress =
            (scrollProgressRef.current - CAPABILITY_SPLIT) /
            (1 - CAPABILITY_SPLIT)

          dispatch('capabilityProgress', subProgress)

          if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
            mountForward(setShowSectionThree, sectionThreeRef, STAGE_THREE)
          }
        }
      } else {
        scrollProgressRef.current = Math.max(
          0,
          scrollProgressRef.current - step * factor
        )

        if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
          slideParallax(
            capabilityRef,
            heroRef,
            scrollProgressRef.current / CAPABILITY_SPLIT
          )
          dispatch('capabilityProgress', 0)
        } else {
          dispatch(
            'capabilityProgress',
            (scrollProgressRef.current - CAPABILITY_SPLIT) /
              (1 - CAPABILITY_SPLIT)
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

    // 3. CAPABILITY SECTION (Precision Stage) — ab seedha STAGE_FINAL par jayega
    if (stageRef.current === STAGE_THREE) {
      const step = getStep('sectionThree')

      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + step * factor
        )

        if (scrollProgressRef.current <= SECTION_THREE_SPLIT) {
          slideParallax(
            sectionThreeRef,
            capabilityRef,
            scrollProgressRef.current / SECTION_THREE_SPLIT
          )
        } else {
          slideParallax(sectionThreeRef, capabilityRef, 1)

          const subProgress =
            (scrollProgressRef.current - SECTION_THREE_SPLIT) /
            (1 - SECTION_THREE_SPLIT)

          dispatch('capabilityProgress', subProgress)

          if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
            // STAGE_STATS skip — seedha FINAL
            mountForward(setShowFinal, contactRef, STAGE_FINAL)
          }
        }
      } else {
        scrollProgressRef.current = Math.max(
          0,
          scrollProgressRef.current - step * factor
        )

        if (scrollProgressRef.current <= SECTION_THREE_SPLIT) {
          slideParallax(
            sectionThreeRef,
            capabilityRef,
            scrollProgressRef.current / SECTION_THREE_SPLIT
          )
          dispatch('capabilityProgress', 0)
        } else {
          dispatch(
            'capabilityProgress',
            (scrollProgressRef.current - SECTION_THREE_SPLIT) /
              (1 - SECTION_THREE_SPLIT)
          )
        }

        if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
          unmountBackward(
            setShowSectionThree,
            capabilityRef,
            STAGE_CAPABILITY,
            () => {
              dispatch('capabilityProgress', 1)
            }
          )
        }
      }
      return
    }

    // ==========================================================
    // 4. FINAL (Contact Section)
    //    MOBILE par simple slide (Home/About jaisa)
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
          slideParallax(contactRef, sectionThreeRef, scrollProgressRef.current)
          dispatch('contactProgress', 1)
        } else {
          scrollProgressRef.current = Math.max(
            0,
            scrollProgressRef.current - step * factor
          )
          slideParallax(contactRef, sectionThreeRef, scrollProgressRef.current)
          dispatch('contactProgress', 1)

          if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
            // FINAL se peeche → STAGE_THREE par wapas
            unmountBackward(setShowFinal, sectionThreeRef, STAGE_THREE, () => {
              dispatch('capabilityProgress', 1)
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
            sectionThreeRef,
            scrollProgressRef.current / FINAL_SPLIT
          )
        } else {
          slideParallax(contactRef, sectionThreeRef, 1)

          const subProgress =
            (scrollProgressRef.current - FINAL_SPLIT) /
            (1 - FINAL_SPLIT)

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
            sectionThreeRef,
            scrollProgressRef.current / FINAL_SPLIT
          )
          dispatch('contactProgress', 0)
        } else {
          dispatch(
            'contactProgress',
            (scrollProgressRef.current - FINAL_SPLIT) /
              (1 - FINAL_SPLIT)
          )
        }

        if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
          unmountBackward(setShowFinal, sectionThreeRef, STAGE_THREE, () => {
            dispatch('capabilityProgress', 1)
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
            headline={<>ENGINEERED TO FABRICATE. EQUIPPED TO <span>DELIVER</span></>}
          />
        </div>
      )}

      {/* Stage 1: Capabilities */}
      {showCapability && (
        <div
          ref={capabilityRef}
          className="second-section-wrapper"
          style={slideInWrapperStyle(2)}
        >
          <Section01Cap />
        </div>
      )}

      {/* Stage 2: CapabilitySection */}
      {showSectionThree && (
        <div
          ref={sectionThreeRef}
          className="third-section-wrapper"
          style={fixedWrapperStyle(3)}
        >
          <CapabilitySection
            POINTS={POINTS}
            TOTAL_PANELS={TOTAL_PANELS}
            heading_1="PRECISION DOESN'T END WHEN"
            heading_2=" THE MACHINE STOPS"
            paragraph="Every stage contributes to the final result."
          />
        </div>
      )}

      {/* Stage 3: Contact Section (Stats section removed) */}
      {showFinal && (
        <div
          ref={contactRef}
          className="contact-section-wrapper"
          style={fixedWrapperStyle(4)}
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
// import Section01Cap from '@/components/Capababilities/capabilities'
// import CapabilitySection from '@/components/CapabilitySection/CapabilitySection'
// import NavContent from '@/components/NavContent/NavContent'
// import StatsShowcase from '@/components/Stats/stats'
// import ContactSection2 from '@/components/ContactSection/ContactSection2'

// const STAGE_HERO = 0
// const STAGE_CAPABILITY = 1
// const STAGE_THREE = 2
// const STAGE_STATS = 3
// const STAGE_FINAL = 4

// const HERO_STEP = 0.08
// const CAPABILITY_STEP = 0.005      // home page.js same
// const SECTION_THREE_STEP = 0.008   // CapabilitySection = same as CAPABILITY_STEP
// const STATS_STEP = 0.008           // StatsShowcase = same as CAPABILITY_STEP
// const FINAL_STEP = 0.025           // home page.js CONTACT_STEP same

// const CAPABILITY_SPLIT = 0.2       // home page.js same
// const SECTION_THREE_SPLIT = 0.4    // CapabilitySection split
// const STATS_SPLIT = 0.4            // StatsShowcase split
// const FINAL_SPLIT = 0.4            // home page.js CONTACT_SPLIT same
// // ---------------------------------------------------------------------------
// // Mobile-aware step helpers
// // ---------------------------------------------------------------------------
// const getHeroStep = () => {
//     if (typeof window === 'undefined') return HERO_STEP
//     const w = window.innerWidth
//     if (w <= 480) return 0.030
//     if (w <= 768) return 0.035
//     if (w <= 1024) return 0.055
//     return HERO_STEP
// }

// // CapabilitySection — home page.js same (CAPABILITY_STEP = 0.008, no mobile variant)
// const getCapabilityStep = () => {
//     if (typeof window === 'undefined') return CAPABILITY_STEP
//     const w = window.innerWidth
//     if (w <= 480) return 0.0025
//     if (w <= 768) return 0.003
//     if (w <= 1024) return 0.004
//     return CAPABILITY_STEP
// }

// // CapabilitySection — same as capability
// const getSectionThreeStep = () => CAPABILITY_STEP

// // StatsShowcase — same as CapabilitySection
// const getStatsStep = () => CAPABILITY_STEP

// // ContactSection2 — home page.js CONTACT_STEP = 0.025
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

// const POINTS = [
//     {
//         titleFirst: 'MATERIAL',
//         titleSecond: '',
//         coloredPart: 'second',
//         description: 'Material is checked against the project requirement.',
//         descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
//         images: [
//             { src: '/images/precision1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
//             { src: '/images/precision2.png', top: '50%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//         ],
//         titlePos: { top: '20%', left: '55%' },
//         mobileTitlePos: { top: '0%', left: '6%' },
//         mobileDescPos: { top: '62%', left: '6%', maxWidth: '100%' },
//     },
//     {
//         titleFirst: 'FABRICATION',
//         titleSecond: '',
//         coloredPart: 'second',
//         description: 'Critical dimensions and processes are monitored during production.',
//         descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
//         images: [
//             { src: '/images/capability1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
//             { src: '/images/capability2.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//         ],
//         titlePos: { top: '20%', left: '55%' },
//                 mobileTitlePos: { top: '0%', left: '6%' },
//         mobileDescPos: { top: '62%', left: '6%', maxWidth: '100%' },
//     },
//     {
//         titleFirst: 'ASSEMBLY',
//         titleSecond: '',
//         coloredPart: 'second',
//         description: 'Components are checked for fit and alignment.',
//         descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
//         images: [
//             { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
//             { src: '/images/control2.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//         ],
//         titlePos: { top: '20%', left: '55%' },
//                 mobileTitlePos: { top: '0%', left: '6%' },
//         mobileDescPos: { top: '62%', left: '6%', maxWidth: '100%' },
//     },
//     {
//         titleFirst: 'FINISHING',
//         titleSecond: '',
//         coloredPart: 'second',
//         description: 'Surface treatment and finish are verified against the requirement.',
//         descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
//         images: [
//             { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
//             { src: '/images/control2.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//         ],
//         titlePos: { top: '20%', left: '55%' },
//                 mobileTitlePos: { top: '0%', left: '6%' },
//         mobileDescPos: { top: '62%', left: '6%', maxWidth: '100%' },
//     },
//     {
//         titleFirst: 'FINAL',
//         titleSecond: 'INSPECTION',
//         coloredPart: 'second',
//         description: 'Completed work is measured and checked before dispatch.',
//         descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
//         images: [
//             { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
//             { src: '/images/control2.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//         ],
//         titlePos: { top: '20%', left: '55%' },
//                 mobileTitlePos: { top: '0%', left: '6%' },
//         mobileDescPos: { top: '62%', left: '6%', maxWidth: '100%' },
//         button: {
//             label: 'DISCUSS YOUR REQUIREMENT',
//             onClick: () => {
//                 console.log('Discuss button clicked')
//             },
//             pos: {
//                 top: '80%',
//                 left: '10%',
//                 speed: 0.12,
//             },
//             className: 'btn-blue',
//         },
//     },
// ]

// const STATS_DATA = [
//     {
//         number: '25K+',
//         title: ' SQ. FT.',
//         subtitle: 'Production facilities',
//     },
//     {
//         number: '40+',
//         title: 'Machines & equipment',
//         subtitle: '',
//     },
//     {
//         number: '25',
//         title: 'MM',
//         subtitle: 'Laser cutting capability',
//     },
//     {
//         number: '10',
//         title: 'TON',
//         subtitle: 'Lifting capacity',
//     },
// ]

// const TOTAL_PANELS = POINTS.length + 1

// export default function Home() {
//     const [loading, setLoading] = useState(true)
//     const [showHero, setShowHero] = useState(false)
//     const [showCapability, setShowCapability] = useState(false)
//     const [showSectionThree, setShowSectionThree] = useState(false)
//     const [showStats, setShowStats] = useState(false)
//     const [showFinal, setShowFinal] = useState(false)

//     const loadingRef = useRef(true)
//     const stageRef = useRef(STAGE_HERO)
//     const scrollProgressRef = useRef(0)
//     const isTransitioning = useRef(false)
//     const lastStageRef = useRef(-1)

//     const heroRef = useRef(null)
//     const capabilityRef = useRef(null)
//     const sectionThreeRef = useRef(null)
//     const statsRef = useRef(null)
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

//     // Lock browser scroll (mobile + desktop)
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

//         // 1. HERO STAGE
//         if (stageRef.current === STAGE_HERO) {
//             const step = getHeroStep()

//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(
//                     scrollProgressRef.current + step * factor
//                 )
//                 dispatch('scrollProgress', scrollProgressRef.current)

//                 if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
//                     mountForward(setShowCapability, capabilityRef, STAGE_CAPABILITY)
//                 }
//             } else {
//                 scrollProgressRef.current = clamp01(
//                     scrollProgressRef.current - step * factor
//                 )
//                 dispatch('scrollProgress', scrollProgressRef.current)
//             }
//             return
//         }

//         // 2. CAPABILITIES (Section01Cap)
//         if (stageRef.current === STAGE_CAPABILITY) {
//             const step = getCapabilityStep()

//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(
//                     scrollProgressRef.current + step * factor
//                 )

//                 if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//                     slideParallax(
//                         capabilityRef,
//                         heroRef,
//                         scrollProgressRef.current / CAPABILITY_SPLIT
//                     )
//                 } else {
//                     slideParallax(capabilityRef, heroRef, 1)

//                     const subProgress =
//                         (scrollProgressRef.current - CAPABILITY_SPLIT) /
//                         (1 - CAPABILITY_SPLIT)

//                     dispatch('capabilityProgress', subProgress)

//                     if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
//                         mountForward(setShowSectionThree, sectionThreeRef, STAGE_THREE)
//                     }
//                 }
//             } else {
//                 scrollProgressRef.current = Math.max(
//                     0,
//                     scrollProgressRef.current - step * factor
//                 )

//                 if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//                     slideParallax(
//                         capabilityRef,
//                         heroRef,
//                         scrollProgressRef.current / CAPABILITY_SPLIT
//                     )
//                     dispatch('capabilityProgress', 0)
//                 } else {
//                     dispatch(
//                         'capabilityProgress',
//                         (scrollProgressRef.current - CAPABILITY_SPLIT) /
//                         (1 - CAPABILITY_SPLIT)
//                     )
//                 }

//                 if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
//                     unmountBackward(setShowCapability, heroRef, STAGE_HERO, () => {
//                         dispatch('scrollProgress', 1)
//                     })
//                 }
//             }
//             return
//         }

//         // 3. CAPABILITY SECTION (Precision Stage)
//         if (stageRef.current === STAGE_THREE) {
//             const step = getSectionThreeStep()

//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(
//                     scrollProgressRef.current + step * factor
//                 )

//                 if (scrollProgressRef.current <= SECTION_THREE_SPLIT) {
//                     slideParallax(
//                         sectionThreeRef,
//                         capabilityRef,
//                         scrollProgressRef.current / SECTION_THREE_SPLIT
//                     )
//                 } else {
//                     slideParallax(sectionThreeRef, capabilityRef, 1)

//                     const subProgress =
//                         (scrollProgressRef.current - SECTION_THREE_SPLIT) /
//                         (1 - SECTION_THREE_SPLIT)

//                     dispatch('capabilityProgress', subProgress)

//                     if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
//                         mountForward(setShowStats, statsRef, STAGE_STATS)
//                     }
//                 }
//             } else {
//                 scrollProgressRef.current = Math.max(
//                     0,
//                     scrollProgressRef.current - step * factor
//                 )

//                 if (scrollProgressRef.current <= SECTION_THREE_SPLIT) {
//                     slideParallax(
//                         sectionThreeRef,
//                         capabilityRef,
//                         scrollProgressRef.current / SECTION_THREE_SPLIT
//                     )
//                     dispatch('capabilityProgress', 0)
//                 } else {
//                     dispatch(
//                         'capabilityProgress',
//                         (scrollProgressRef.current - SECTION_THREE_SPLIT) /
//                         (1 - SECTION_THREE_SPLIT)
//                     )
//                 }

//                 if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
//                     unmountBackward(
//                         setShowSectionThree,
//                         capabilityRef,
//                         STAGE_CAPABILITY,
//                         () => {
//                             dispatch('capabilityProgress', 1)
//                         }
//                     )
//                 }
//             }
//             return
//         }

//         // 4. STATS & NUMBERS STAGE
//         if (stageRef.current === STAGE_STATS) {
//             const step = getStatsStep()

//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(
//                     scrollProgressRef.current + step * factor
//                 )

//                 if (scrollProgressRef.current <= STATS_SPLIT) {
//                     slideParallax(
//                         statsRef,
//                         sectionThreeRef,
//                         scrollProgressRef.current / STATS_SPLIT
//                     )
//                 } else {
//                     slideParallax(statsRef, sectionThreeRef, 1)

//                     const subProgress =
//                         (scrollProgressRef.current - STATS_SPLIT) /
//                         (1 - STATS_SPLIT)

//                     dispatch('statsProgress', subProgress)

//                     if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
//                         mountForward(setShowFinal, contactRef, STAGE_FINAL)
//                     }
//                 }
//             } else {
//                 scrollProgressRef.current = Math.max(
//                     0,
//                     scrollProgressRef.current - step * factor
//                 )

//                 if (scrollProgressRef.current <= STATS_SPLIT) {
//                     slideParallax(
//                         statsRef,
//                         sectionThreeRef,
//                         scrollProgressRef.current / STATS_SPLIT
//                     )
//                     dispatch('statsProgress', 0)
//                 } else {
//                     dispatch(
//                         'statsProgress',
//                         (scrollProgressRef.current - STATS_SPLIT) /
//                         (1 - STATS_SPLIT)
//                     )
//                 }

//                 if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
//                     unmountBackward(
//                         setShowStats,
//                         sectionThreeRef,
//                         STAGE_THREE,
//                         () => {
//                             dispatch('capabilityProgress', 1)
//                         }
//                     )
//                 }
//             }
//             return
//         }

//         // 5. FINAL (Contact Section)
//         if (stageRef.current === STAGE_FINAL) {
//             const step = getFinalStep()

//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(
//                     scrollProgressRef.current + step * factor
//                 )

//                 if (scrollProgressRef.current <= FINAL_SPLIT) {
//                     slideParallax(
//                         contactRef,
//                         statsRef,
//                         scrollProgressRef.current / FINAL_SPLIT
//                     )
//                 } else {
//                     slideParallax(contactRef, statsRef, 1)

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
//                         statsRef,
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
//                     unmountBackward(
//                         setShowFinal,
//                         statsRef,
//                         STAGE_STATS,
//                         () => {
//                             dispatch('statsProgress', 1)
//                         }
//                     )
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
//                     <HeroSection headline={<>ENGINEERED TO FABRICATE. EQUIPPED TO <span>DELIVER</span></>} />
//                 </div>
//             )}

//             {/* Stage 1: Capabilities */}
//             {showCapability && (
//                 <div
//                     ref={capabilityRef}
//                     className="second-section-wrapper"
//                     style={fixedWrapperStyle(2)}
//                 >
//                     <Section01Cap />
//                 </div>
//             )}

//             {/* Stage 2: CapabilitySection */}
//             {showSectionThree && (
//                 <div
//                     ref={sectionThreeRef}
//                     className="third-section-wrapper"
//                     style={fixedWrapperStyle(3)}
//                 >
//                     <CapabilitySection
//                         POINTS={POINTS}
//                         TOTAL_PANELS={TOTAL_PANELS}
//                         heading_1="PRECISION DOESN'T END WHEN"
//                         heading_2=" THE MACHINE STOPS"
//                         paragraph="Every stage contributes to the final result."
//                     />
//                 </div>
//             )}

//             {/* Stage 3: Numbers & Stats Section */}
//             {showStats && (
//                 <div
//                     ref={statsRef}
//                     className="fourth-section-wrapper"
//                     style={fixedWrapperStyle(4)}
//                 >
//                     <StatsShowcase
//                         stats={STATS_DATA}
//                         title="THE NUMBERS BEHIND "
//                         title_part_2="THE CAPABILITY"
//                     />
//                 </div>
//             )}

//             {/* Stage 4: Contact Section */}
//             {showFinal && (
//                 <div
//                     ref={contactRef}
//                     className="contact-section-wrapper"
//                     style={fixedWrapperStyle(5)}
//                 >
//                     <ContactSection2 scrollProgressRef={scrollProgressRef} />
//                 </div>
//             )}
//         </main>
//     )
// }
