'use client'
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import HeroSection from '@/components/HeroSection/HeroSection'
import SecondSection from '@/components/SecondSection/SecondSection'
import CapabilitySection from '@/components/CapabilitySection/CapabilitySection'
import ProcessSection from '@/components/ProcessSection/ProcessSection'
import ThirdSection from '@/components/ThirdSection/ThirdSection'
import QualitySection from '@/components/QualitySection/QualitySection'
import ContactSection2 from '@/components/ContactSection/ContactSection2'
import CursorTrail from '@/components/CursorTrail/CursorTrail'
import NavContent from '@/components/NavContent/NavContent'

const STAGE_HERO = 0
const STAGE_SECOND = 1
const STAGE_CAPABILITY = 2
const STAGE_PROCESS = 3
const STAGE_THIRD = 4
const STAGE_QUALITY = 5
const STAGE_CONTACT = 6

const HERO_STEP = 0.08
// Mobile pe Hero slow
const getHeroStep = () => {
  if (typeof window === 'undefined') return HERO_STEP
  const w = window.innerWidth
  if (w <= 480) return 0.030
  if (w <= 768) return 0.035
  if (w <= 1024) return 0.055
  return HERO_STEP
}

const SECOND_STEP = 0.015
// Mobile pe Second faster
const getSecondStep = () => {
  if (typeof window === 'undefined') return SECOND_STEP
  return window.innerWidth <= 768 ? 0.022 : SECOND_STEP
}

const CAPABILITY_STEP = 0.008

const PROCESS_STEP = 0.010
// Mobile pe Process slow
const getProcessStep = () => {
  if (typeof window === 'undefined') return PROCESS_STEP
  const w = window.innerWidth
  if (w <= 480) return 0.005
  if (w <= 768) return 0.006
  if (w <= 1024) return 0.008
  return PROCESS_STEP
}

const THIRD_STEP = 0.012
const THIRD_WRAP_SPLIT = 0.35

const QUALITY_STEP = 0.01
// Mobile pe Quality faster
const getQualityStep = () => {
  if (typeof window === 'undefined') return QUALITY_STEP
  const w = window.innerWidth
  if (w <= 480) return 0.014
  if (w <= 768) return 0.016
  if (w <= 1024) return 0.018
  return QUALITY_STEP
}

const CONTACT_STEP = 0.015

const CAPABILITY_SPLIT = 0.4
const PROCESS_SPLIT = 0.4
const THIRD_SPLIT = 0.55
const QUALITY_SPLIT = 0.25
const CONTACT_SPLIT = 0.4

const clamp01 = (v) => Math.max(0, Math.min(1, v))
const dispatch = (name, progress) => {
  window.dispatchEvent(new CustomEvent(name, { detail: { progress } }))
}

const fixedWrapperStyle = (z) => ({
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100dvh',
  zIndex: z,
  overflow: 'hidden',
  backgroundColor: 'var(--color-black, #0a0a0a)',
  willChange: 'transform, opacity',
})

// ---------------------------------------------------------------------------
// Device helpers — touch detection
// ---------------------------------------------------------------------------
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

// ---------------------------------------------------------------------------
// Touch sensitivity — mobile me zyada, tablet me medium
// ---------------------------------------------------------------------------
const getTouchMultiplier = () => {
  if (typeof window === 'undefined') return 1.2
  const w = window.innerWidth
  if (w < 480) return 1.6
  if (w < 768) return 1.4
  if (w < 1024) return 1.2
  return 1.0
}

const POINTS = [
  {
    titleFirst: 'REVIEW THE',
    titleSecond: 'DRAWINGS',
    coloredPart: 'second',
    description: 'Because small inaccuracies can become major problems on site.',
    descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
    images: [
      { src: '/images/precision1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
      { src: '/images/precision3.png', top: '50%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
    ],
    titlePos: { top: '20%', left: '55%' },
  },
  {
    titleFirst: 'UNDERSTAND',
    titleSecond: 'SPECIFICATION',
    coloredPart: 'second',
    description: 'Because quality is easier to maintain when the process is properly managed.',
    descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
    images: [
      { src: '/images/capability1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
      { src: '/images/capability3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
    ],
    titlePos: { top: '20%', left: '55%' },
  },
  {
    titleFirst: 'PLAN THE',
    titleSecond: 'MATERIAL',
    coloredPart: 'second',
    description: 'Procuring and staging certified grade metals prior to production.',
    descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
    images: [
      { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
      { src: '/images/control3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
    ],
    titlePos: { top: '20%', left: '55%' },
  },
  {
    titleFirst: 'CONSIDER',
    titleSecond: 'FABRICATION PROCESS',
    coloredPart: 'second',
    description: 'Procuring and staging certified grade metals prior to production.',
    descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
    images: [
      { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
      { src: '/images/control3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
    ],
    titlePos: { top: '20%', left: '55%' },
  },
]

const TOTAL_PANELS = POINTS.length + 1

const POINTS_PROCESS = [
  { title: 'UNDERSTAND', desc: 'We review your drawings, specifications and project requirements.', image: '/images/cap1.png', pos: { top: '70%', left: '2%' } },
  { title: 'PLAN', desc: 'Materials, processes and production requirements are defined before fabrication begins.', image: '/images/cap2.png', pos: { top: '70%', left: '75%' } },
  { title: 'FABRICATE', desc: 'Our teams combine advanced machinery with skilled fabrication to produce the required components or assemblies.', image: '/images/cap3.png', pos: { top: '70%', left: '75%' } },
  { title: 'FINISH', desc: 'The work is prepared with the required surface treatment, finish or assembly.', image: '/images/cap4.png', pos: { top: '20%', left: '5%' } },
  { title: 'VERIFY', desc: 'Quality and dimensional checks are carried out against the required specifications.', image: '/images/cap5.png', pos: { top: '65%', left: '5%' } },
  { title: 'DELIVER', desc: 'The completed work is prepared for delivery, installation or integration into your project.', image: '/images/cap6.png', pos: { top: '60%', left: '70%' }, button: true },
]

const TOTAL_ITEMS_PROCESS = POINTS_PROCESS.length + 1

const project_steps = [
  {
    id: 1,
    src: '/images/build1.png',
    desc: 'CLEAR COMMUNICATION',
    title: 'Straightforward coordination from requirement to delivery.',
    pos: { top: '15%', left: '5%' },
  },
  {
    id: 2,
    src: '/images/build2.jpeg',
    desc: 'TECHNICAL UNDERSTANDING',
    title: 'Fabrication decisions made with the project specification in mind.',
    pos: { top: '75%', left: '65%' },
  },
  {
    id: 3,
    src: '/images/build3.jpeg',
    desc: 'DOCUMENTED QUALITY',
    title: 'Inspection and material documentation where required.',
    pos: { top: '75%', left: '42%' },
  },
  {
    id: 4,
    src: '/images/build4.jpeg',
    desc: 'DELIVERY FOCUS',
    title: 'Production planned around real project timelines.',
    pos: { top: '20%', left: '1%' },
    button: true,
  },
]

const quality_points = [
  { title: 'PRECISION THAT FITS', desc: 'Built around drawings, specifications and real project requirements.' },
  { title: 'CAPABILITY THAT SCALES', desc: 'Equipped to handle individual components, assemblies and larger fabrication requirements.' },
  { title: 'ONE POINT OF CONTACT', desc: 'A coordinated workflow from initial requirement through delivery.' },
  { title: 'QUALITY YOU CAN VERIFY', desc: 'Controlled processes and inspection at every critical stage.' },
  { title: 'A PARTNER, NOT JUST A SUPPLIER', desc: 'We work alongside your team to understand the requirement and deliver the right fabrication solution.' },
]

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [showHero, setShowHero] = useState(false)
  const [showSecond, setShowSecond] = useState(false)
  const [showCapability, setShowCapability] = useState(false)
  const [showProcess, setShowProcess] = useState(false)
  const [showThird, setShowThird] = useState(false)
  const [showQuality, setShowQuality] = useState(false)
  const [showContact, setShowContact] = useState(false)

  const loadingRef = useRef(true)
  const stageRef = useRef(STAGE_HERO)
  const scrollProgressRef = useRef(0)
  const isTransitioning = useRef(false)
  const lastStageRef = useRef(-1)

  const heroRef = useRef(null)
  const secondRef = useRef(null)
  const capabilityRef = useRef(null)
  const processRef = useRef(null)
  const thirdRef = useRef(null)
  const qualityRef = useRef(null)
  const contactRef = useRef(null)

  const fadeOverlayRef = useRef(null)
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
            detail: { stage: STAGE_HERO, progress: 0 },
          })
        )
      }, 100)
    }

    window.addEventListener('globalLoadingComplete', handleGlobalLoadingComplete)
    return () => window.removeEventListener('globalLoadingComplete', handleGlobalLoadingComplete)
  }, [])

  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  // Stage travel
  useEffect(() => {
    const handleTravelToStage = (e) => {
      const targetStage = e.detail.stage
      if (isTransitioning.current) return
      if (stageRef.current === targetStage) return

      const STAGE_STEPS = {
        [STAGE_HERO]: HERO_STEP,
        [STAGE_SECOND]: SECOND_STEP,
        [STAGE_CAPABILITY]: CAPABILITY_STEP,
        [STAGE_PROCESS]: PROCESS_STEP,
        [STAGE_THIRD]: THIRD_STEP,
        [STAGE_QUALITY]: QUALITY_STEP,
        [STAGE_CONTACT]: CONTACT_STEP,
      }

      const direction = targetStage > stageRef.current ? 1 : -1

      const dispatchStageChange = () => {
        window.dispatchEvent(
          new CustomEvent('stageChange', {
            detail: { stage: stageRef.current, progress: scrollProgressRef.current },
          })
        )
        window.dispatchEvent(
          new CustomEvent('stageProgress', {
            detail: { stage: stageRef.current, progress: scrollProgressRef.current },
          })
        )
      }

      const advanceOneLeg = () => {
        if (stageRef.current === targetStage) {
          if (direction > 0) scrollProgressRef.current = 0
          else scrollProgressRef.current = 1
          dispatchStageChange()
          return
        }

        const step = STAGE_STEPS[stageRef.current] || 0.015
        const factor = 1.8

        if (direction > 0) {
          scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
        } else {
          scrollProgressRef.current = clamp01(scrollProgressRef.current - step * factor)
        }

        handleScrollStepRef.current?.(direction, factor)

        if (stageRef.current !== lastStageRef.current) {
          lastStageRef.current = stageRef.current
          window.dispatchEvent(
            new CustomEvent('stageChange', {
              detail: { stage: stageRef.current, progress: scrollProgressRef.current },
            })
          )
        }

        if (stageRef.current !== targetStage) {
          requestAnimationFrame(advanceOneLeg)
        } else {
          if (direction > 0) scrollProgressRef.current = 0
          else scrollProgressRef.current = 1
          dispatchStageChange()
        }
      }

      requestAnimationFrame(advanceOneLeg)
    }

    window.addEventListener('travelToStage', handleTravelToStage)
    return () => window.removeEventListener('travelToStage', handleTravelToStage)
  }, [])

  // Lock browser scroll
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyOverflow = document.body.style.overflow
    const prevBodyOverscroll = document.body.style.overscrollBehavior
    const prevBodyPosition = document.body.style.position

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.height = '100%'

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
      document.body.style.overscrollBehavior = prevBodyOverscroll
      document.body.style.position = prevBodyPosition
      document.body.style.width = ''
      document.body.style.height = ''
    }
  }, [])

  // Transition helpers
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

  const mountForward = (setter, ref, nextStage) => {
    isTransitioning.current = true
    stageRef.current = nextStage
    setter(true)
    scrollProgressRef.current = 0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (ref?.current) gsap.set(ref.current, { y: '100%' })
        isTransitioning.current = false
      })
    })
  }

  const unmountBackward = (setter, underRef, prevStage, extraDispatch) => {
    isTransitioning.current = true
    setter(false)
    resetParallaxUnder(underRef)
    stageRef.current = prevStage
    scrollProgressRef.current = 1
    if (extraDispatch) extraDispatch()
    requestAnimationFrame(() => {
      isTransitioning.current = false
    })
  }

  // Core step
  const handleScrollStep = (direction, factor) => {
    if (loadingRef.current || isTransitioning.current) return

    // HERO
    if (stageRef.current === STAGE_HERO) {
      const step = getHeroStep()

      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
        dispatch('scrollProgress', scrollProgressRef.current)
        if (scrollProgressRef.current >= 1) {
          mountForward(setShowSecond, secondRef, STAGE_SECOND)
        }
      } else {
        scrollProgressRef.current = clamp01(scrollProgressRef.current - step * factor)
        dispatch('scrollProgress', scrollProgressRef.current)
      }
      return
    }

    // SECOND -> CAPABILITY
    if (stageRef.current === STAGE_SECOND) {
      const step = getSecondStep()

      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
        slideParallax(secondRef, heroRef, scrollProgressRef.current)
        dispatch('secondTextProgress', scrollProgressRef.current)
        if (scrollProgressRef.current >= 1) {
          mountForward(setShowCapability, capabilityRef, STAGE_CAPABILITY)
        }
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - step * factor)
        slideParallax(secondRef, heroRef, scrollProgressRef.current)
        dispatch('secondTextProgress', scrollProgressRef.current)
        if (scrollProgressRef.current <= 0) {
          unmountBackward(setShowSecond, heroRef, STAGE_HERO, () => dispatch('scrollProgress', 1))
        }
      }
      return
    }

    // CAPABILITY
    if (stageRef.current === STAGE_CAPABILITY) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + CAPABILITY_STEP * factor)
        if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
          slideParallax(capabilityRef, secondRef, scrollProgressRef.current / CAPABILITY_SPLIT)
        } else {
          slideParallax(capabilityRef, secondRef, 1)
          dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
        }
        if (scrollProgressRef.current >= 1) {
          mountForward(setShowProcess, processRef, STAGE_PROCESS)
        }
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - CAPABILITY_STEP * factor)
        if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
          slideParallax(capabilityRef, secondRef, scrollProgressRef.current / CAPABILITY_SPLIT)
          dispatch('capabilityProgress', 0)
        } else {
          dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
        }
        if (scrollProgressRef.current <= 0) {
          unmountBackward(setShowCapability, secondRef, STAGE_SECOND, () => {
            dispatch('secondTextProgress', 1)
          })
        }
      }
      return
    }

    // PROCESS
    if (stageRef.current === STAGE_PROCESS) {
      const step = getProcessStep()

      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
        if (scrollProgressRef.current <= PROCESS_SPLIT) {
          slideParallax(processRef, capabilityRef, scrollProgressRef.current / PROCESS_SPLIT)
        } else {
          slideParallax(processRef, capabilityRef, 1)
          dispatch('processProgress', (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT))
        }
        if (scrollProgressRef.current >= 1) {
          mountForward(setShowThird, thirdRef, STAGE_THIRD)
          dispatch('thirdSlideProgress', 0)
        }
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - step * factor)
        if (scrollProgressRef.current <= PROCESS_SPLIT) {
          slideParallax(processRef, capabilityRef, scrollProgressRef.current / PROCESS_SPLIT)
          dispatch('processProgress', 0)
        } else {
          dispatch('processProgress', (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT))
        }
        if (scrollProgressRef.current <= 0) {
          unmountBackward(setShowProcess, capabilityRef, STAGE_CAPABILITY, () => dispatch('capabilityProgress', 1))
        }
      }
      return
    }

    // THIRD
    if (stageRef.current === STAGE_THIRD) {
  if (direction > 0) {
    scrollProgressRef.current = clamp01(scrollProgressRef.current + THIRD_STEP * factor)
    if (scrollProgressRef.current <= THIRD_SPLIT) {
      const overallP = scrollProgressRef.current / THIRD_SPLIT
      const wrapP = Math.min(1, overallP / THIRD_WRAP_SPLIT)
      const introP = Math.max(0, (overallP - THIRD_WRAP_SPLIT) / (1 - THIRD_WRAP_SPLIT))
      slideParallax(thirdRef, processRef, wrapP)
      dispatch('thirdSlideProgress', introP)
    } else {
      slideParallax(thirdRef, processRef, 1)
      dispatch('thirdSlideProgress', 1)
      dispatch('thirdHorizontalProgress', (scrollProgressRef.current - THIRD_SPLIT) / (1 - THIRD_SPLIT))
    }
    if (scrollProgressRef.current >= 1) {
      mountForward(setShowQuality, qualityRef, STAGE_QUALITY)
    }
  } else {
    scrollProgressRef.current = Math.max(0, scrollProgressRef.current - THIRD_STEP * factor)
    if (scrollProgressRef.current <= THIRD_SPLIT) {
      const overallP = scrollProgressRef.current / THIRD_SPLIT
      const wrapP = Math.min(1, overallP / THIRD_WRAP_SPLIT)
      const introP = Math.max(0, (overallP - THIRD_WRAP_SPLIT) / (1 - THIRD_WRAP_SPLIT))
      slideParallax(thirdRef, processRef, wrapP)
      dispatch('thirdSlideProgress', introP)
      dispatch('thirdHorizontalProgress', 0)
    } else {
      slideParallax(thirdRef, processRef, 1)
      dispatch('thirdSlideProgress', 1)
      dispatch('thirdHorizontalProgress', (scrollProgressRef.current - THIRD_SPLIT) / (1 - THIRD_SPLIT))
    }
    if (scrollProgressRef.current <= 0) {
      unmountBackward(setShowThird, processRef, STAGE_PROCESS, () => dispatch('processProgress', 1))
    }
  }
  return
}

    // QUALITY
    if (stageRef.current === STAGE_QUALITY) {
      const step = getQualityStep()

      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
        if (scrollProgressRef.current <= QUALITY_SPLIT) {
          slideParallax(qualityRef, thirdRef, scrollProgressRef.current / QUALITY_SPLIT)
        } else {
          slideParallax(qualityRef, thirdRef, 1)
          dispatch('qualityProgress', (scrollProgressRef.current - QUALITY_SPLIT) / (1 - QUALITY_SPLIT))
        }
        if (scrollProgressRef.current >= 1) {
          mountForward(setShowContact, contactRef, STAGE_CONTACT)
        }
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - step * factor)
        if (scrollProgressRef.current <= QUALITY_SPLIT) {
          slideParallax(qualityRef, thirdRef, scrollProgressRef.current / QUALITY_SPLIT)
          dispatch('qualityProgress', 0)
        } else {
          dispatch('qualityProgress', (scrollProgressRef.current - QUALITY_SPLIT) / (1 - QUALITY_SPLIT))
        }
        if (scrollProgressRef.current <= 0) {
          unmountBackward(setShowQuality, thirdRef, STAGE_THIRD, () => dispatch('thirdHorizontalProgress', 1))
        }
      }
      return
    }

    // CONTACT (LAST)
    if (stageRef.current === STAGE_CONTACT) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + CONTACT_STEP * factor)
        if (scrollProgressRef.current <= CONTACT_SPLIT) {
          slideParallax(contactRef, qualityRef, scrollProgressRef.current / CONTACT_SPLIT)
        } else {
          slideParallax(contactRef, qualityRef, 1)
          dispatch('contactProgress', (scrollProgressRef.current - CONTACT_SPLIT) / (1 - CONTACT_SPLIT))
        }
      } else {
        if (scrollProgressRef.current > CONTACT_SPLIT) {
          scrollProgressRef.current = Math.max(CONTACT_SPLIT, scrollProgressRef.current - CONTACT_STEP * factor)
          dispatch('contactProgress', (scrollProgressRef.current - CONTACT_SPLIT) / (1 - CONTACT_SPLIT))
        } else if (scrollProgressRef.current > 0) {
          scrollProgressRef.current = Math.max(0, scrollProgressRef.current - CONTACT_STEP * factor)
          slideParallax(contactRef, qualityRef, scrollProgressRef.current / CONTACT_SPLIT)
          dispatch('contactProgress', 0)
          if (scrollProgressRef.current <= 0) {
            unmountBackward(setShowContact, qualityRef, STAGE_QUALITY, () => dispatch('qualityProgress', 1))
          }
        }
      }
      return
    }
  }

  // ---------------------------------------------------------------------
  // Wheel + Touch + Keyboard listeners
  // ---------------------------------------------------------------------
  useEffect(() => {
    // ---- Wheel ----
    const handleWheel = (e) => {
      e.preventDefault()
      if (loadingRef.current) return
      wheelAccumRef.current += e.deltaY
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
      wheelAccumRef.current += deltaY * multiplier * 2.5

      if (e.cancelable) e.preventDefault()
    }

    const handleTouchEnd = () => {
      isTouchScrollingRef.current = false
      touchStartYRef.current = 0
      touchLastYRef.current = 0
    }

    // ---- Keyboard ----
    const handleKeyDown = (e) => {
      if (loadingRef.current || isTransitioning.current) return

      const key = e.key

      if (key === 'ArrowDown' || key === 'PageDown' || key === ' ') {
        e.preventDefault()
        handleScrollStep(1, key === ' ' ? 1.2 : 1)
      } else if (key === 'ArrowUp' || key === 'PageUp') {
        e.preventDefault()
        handleScrollStep(-1, 1)
      } else if (key === 'Home') {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('travelToStage', { detail: { stage: STAGE_HERO } }))
      } else if (key === 'End') {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('travelToStage', { detail: { stage: STAGE_CONTACT } }))
      }
    }

    // ---- rAF tick ----
    const tick = () => {
      if (isTransitioning.current) {
        wheelAccumRef.current = 0
      } else if (Math.abs(wheelAccumRef.current) > 0.5) {
        const raw = wheelAccumRef.current
        const direction = raw > 0 ? 1 : -1
        const magnitude = Math.min(Math.abs(raw), 120)
        const factor = Math.max(0.2, Math.min(1.6, magnitude / 55))
        handleScrollStep(direction, factor)
        wheelAccumRef.current -= raw * 0.55
        if (Math.abs(wheelAccumRef.current) < 0.5) wheelAccumRef.current = 0
      }

      if (stageRef.current !== lastStageRef.current) {
        lastStageRef.current = stageRef.current
        window.dispatchEvent(
          new CustomEvent('stageChange', {
            detail: { stage: stageRef.current, progress: scrollProgressRef.current },
          })
        )
      }

      window.dispatchEvent(
        new CustomEvent('stageProgress', {
          detail: { stage: stageRef.current, progress: scrollProgressRef.current },
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

  // Resize handling
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
      {!loading && <NavContent />}

      {showHero && (
        <>
          <div ref={heroRef} className="hero-wrapper" style={fixedWrapperStyle(1)}>
            <HeroSection
              headline={<>BUILT ON PRECISION. DRIVEN BY <span>PURPOSE</span></>}
              subtitle={''}
              buttonText={''}
              onButtonClick={() => {}}
            />
          </div>

          {showSecond && (
            <div ref={secondRef} className="second-section-wrapper" style={fixedWrapperStyle(2)}>
              <SecondSection
                scrollProgressRef={scrollProgressRef}
                labelText={'Our Story'}
                labelText2={'It Started with Simple Idea'}
                mainText={'Get it right the first time. Create with intention. Deliver without compromise.'}
                description={'Forgentis was built around a straightforward belief: great fabrication should not require compromise between precision, quality and delivery.'}
              />
            </div>
          )}

          {showCapability && (
            <div ref={capabilityRef} className="capability-section-wrapper" style={fixedWrapperStyle(3)}>
              <CapabilitySection
                heading_1={'GOOD FABRICATION STARTS'}
                heading_2={'BEFORE THE FIRST CUT'}
                paragraph={'Every successful project begins with understanding.'}
                scrollProgressRef={scrollProgressRef}
                POINTS={POINTS}
                TOTAL_PANELS={TOTAL_PANELS}
              />
            </div>
          )}

          {showProcess && (
            <div ref={processRef} className="process-section-wrapper" style={fixedWrapperStyle(4)}>
              <ProcessSection
                scrollProgressRef={scrollProgressRef}
                POINTS={POINTS_PROCESS}
                TOTAL_ITEMS={TOTAL_ITEMS_PROCESS}
                heading_part_1={'ONE TEAM. ONE WORKFLOW.'}
                heading_part_2={' ONE STANDARD'}
                description={'We keep the critical stages of fabrication connected so there is less room for miscommunication and more control over the final result.'}
              />
            </div>
          )}

          {showThird && (
            <div ref={thirdRef} className="third-section-wrapper" style={fixedWrapperStyle(5)}>
              <ThirdSection
                scrollProgressRef={scrollProgressRef}
                slides={project_steps}
                heading_part_1={'WE UNDERSTAND HOW PROJECTS '}
                heading_part_2={'ACTUALLY WORK'}
                description={'Forgentis is built to work alongside the people responsible for getting projects delivered.'}
              />
            </div>
          )}

          {showQuality && (
            <div ref={qualityRef} className="quality-section-wrapper" style={fixedWrapperStyle(6)}>
              <QualitySection
                scrollProgressRef={scrollProgressRef}
                POINTS={quality_points}
                heading_part_1={'WHEN'}
                heading_part_2={'DIFFERENCE'}
                heading_part_3={'MEANS'}
                heading_part_4={'BETTER'}
              />
            </div>
          )}

          {showContact && (
            <div ref={contactRef} className="contact-section-wrapper" style={fixedWrapperStyle(7)}>
              <ContactSection2 scrollProgressRef={scrollProgressRef} />
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
// import CapabilitySection from '@/components/CapabilitySection/CapabilitySection'
// import ProcessSection from '@/components/ProcessSection/ProcessSection'
// import ThirdSection from '@/components/ThirdSection/ThirdSection'
// import QualitySection from '@/components/QualitySection/QualitySection'
// import ContactSection2 from '@/components/ContactSection/ContactSection2'
// import CursorTrail from '@/components/CursorTrail/CursorTrail'
// import NavContent from '@/components/NavContent/NavContent'

// const STAGE_HERO = 0
// const STAGE_SECOND = 1
// const STAGE_CAPABILITY = 2
// const STAGE_PROCESS = 3
// const STAGE_THIRD = 4
// const STAGE_QUALITY = 5
// const STAGE_CONTACT = 6

// const HERO_STEP = 0.08
// // Mobile pe Hero slow
// const getHeroStep = () => {
//   if (typeof window === 'undefined') return HERO_STEP
//   const w = window.innerWidth
//   if (w <= 480) return 0.030
//   if (w <= 768) return 0.035
//   if (w <= 1024) return 0.055
//   return HERO_STEP
// }

// const SECOND_STEP = 0.015
// // Mobile pe Second faster
// const getSecondStep = () => {
//   if (typeof window === 'undefined') return SECOND_STEP
//   return window.innerWidth <= 768 ? 0.022 : SECOND_STEP
// }

// const CAPABILITY_STEP = 0.008

// const PROCESS_STEP = 0.010
// // Mobile pe Process slow
// const getProcessStep = () => {
//   if (typeof window === 'undefined') return PROCESS_STEP
//   const w = window.innerWidth
//   if (w <= 480) return 0.005
//   if (w <= 768) return 0.006
//   if (w <= 1024) return 0.008
//   return PROCESS_STEP
// }

// const THIRD_STEP = 0.012
// const QUALITY_STEP = 0.01
// const CONTACT_STEP = 0.015

// const CAPABILITY_SPLIT = 0.4
// const PROCESS_SPLIT = 0.4
// const THIRD_SPLIT = 0.55
// const QUALITY_SPLIT = 0.25
// const CONTACT_SPLIT = 0.4

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
//   overflow: 'hidden',
//   backgroundColor: 'var(--color-black, #0a0a0a)',
//   willChange: 'transform, opacity',
// })

// // ---------------------------------------------------------------------------
// // Device helpers — touch detection
// // ---------------------------------------------------------------------------
// const isTouchDevice = () => {
//   if (typeof window === 'undefined') return false
//   return (
//     'ontouchstart' in window ||
//     navigator.maxTouchPoints > 0 ||
//     navigator.msMaxTouchPoints > 0
//   )
// }

// // ---------------------------------------------------------------------------
// // Touch sensitivity — mobile me zyada, tablet me medium
// // ---------------------------------------------------------------------------
// const getTouchMultiplier = () => {
//   if (typeof window === 'undefined') return 1.2
//   const w = window.innerWidth
//   if (w < 480) return 1.6
//   if (w < 768) return 1.4
//   if (w < 1024) return 1.2
//   return 1.0
// }

// const POINTS = [
//   {
//     titleFirst: 'REVIEW THE',
//     titleSecond: 'DRAWINGS',
//     coloredPart: 'second',
//     description: 'Because small inaccuracies can become major problems on site.',
//     descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
//     images: [
//       { src: '/images/precision1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
//       { src: '/images/precision3.png', top: '50%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//     ],
//     titlePos: { top: '20%', left: '55%' },
//   },
//   {
//     titleFirst: 'UNDERSTAND',
//     titleSecond: 'SPECIFICATION',
//     coloredPart: 'second',
//     description: 'Because quality is easier to maintain when the process is properly managed.',
//     descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
//     images: [
//       { src: '/images/capability1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
//       { src: '/images/capability3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//     ],
//     titlePos: { top: '20%', left: '55%' },
//   },
//   {
//     titleFirst: 'PLAN THE',
//     titleSecond: 'MATERIAL',
//     coloredPart: 'second',
//     description: 'Procuring and staging certified grade metals prior to production.',
//     descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
//     images: [
//       { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
//       { src: '/images/control3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//     ],
//     titlePos: { top: '20%', left: '55%' },
//   },
//   {
//     titleFirst: 'CONSIDER',
//     titleSecond: 'FABRICATION PROCESS',
//     coloredPart: 'second',
//     description: 'Procuring and staging certified grade metals prior to production.',
//     descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
//     images: [
//       { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
//       { src: '/images/control3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//     ],
//     titlePos: { top: '20%', left: '55%' },
//   },
// ]

// const TOTAL_PANELS = POINTS.length + 1

// const POINTS_PROCESS = [
//   { title: 'UNDERSTAND', desc: 'We review your drawings, specifications and project requirements.', image: '/images/cap1.png', pos: { top: '70%', left: '2%' } },
//   { title: 'PLAN', desc: 'Materials, processes and production requirements are defined before fabrication begins.', image: '/images/cap2.png', pos: { top: '70%', left: '75%' } },
//   { title: 'FABRICATE', desc: 'Our teams combine advanced machinery with skilled fabrication to produce the required components or assemblies.', image: '/images/cap3.png', pos: { top: '70%', left: '75%' } },
//   { title: 'FINISH', desc: 'The work is prepared with the required surface treatment, finish or assembly.', image: '/images/cap4.png', pos: { top: '20%', left: '5%' } },
//   { title: 'VERIFY', desc: 'Quality and dimensional checks are carried out against the required specifications.', image: '/images/cap5.png', pos: { top: '65%', left: '5%' } },
//   { title: 'DELIVER', desc: 'The completed work is prepared for delivery, installation or integration into your project.', image: '/images/cap6.png', pos: { top: '60%', left: '70%' }, button: true },
// ]

// const TOTAL_ITEMS_PROCESS = POINTS_PROCESS.length + 1

// const project_steps = [
//   {
//     id: 1,
//     src: '/images/build1.png',
//     desc: 'CLEAR COMMUNICATION',
//     title: 'Straightforward coordination from requirement to delivery.',
//     pos: { top: '15%', left: '5%' },
//   },
//   {
//     id: 2,
//     src: '/images/build2.jpeg',
//     desc: 'TECHNICAL UNDERSTANDING',
//     title: 'Fabrication decisions made with the project specification in mind.',
//     pos: { top: '75%', left: '65%' },
//   },
//   {
//     id: 3,
//     src: '/images/build3.jpeg',
//     desc: 'DOCUMENTED QUALITY',
//     title: 'Inspection and material documentation where required.',
//     pos: { top: '75%', left: '42%' },
//   },
//   {
//     id: 4,
//     src: '/images/build4.jpeg',
//     desc: 'DELIVERY FOCUS',
//     title: 'Production planned around real project timelines.',
//     pos: { top: '20%', left: '1%' },
//     button: true,
//   },
// ]

// const quality_points = [
//   { title: 'PRECISION THAT FITS', desc: 'Built around drawings, specifications and real project requirements.' },
//   { title: 'CAPABILITY THAT SCALES', desc: 'Equipped to handle individual components, assemblies and larger fabrication requirements.' },
//   { title: 'ONE POINT OF CONTACT', desc: 'A coordinated workflow from initial requirement through delivery.' },
//   { title: 'QUALITY YOU CAN VERIFY', desc: 'Controlled processes and inspection at every critical stage.' },
//   { title: 'A PARTNER, NOT JUST A SUPPLIER', desc: 'We work alongside your team to understand the requirement and deliver the right fabrication solution.' },
// ]

// export default function Home() {
//   const [loading, setLoading] = useState(true)
//   const [showHero, setShowHero] = useState(false)
//   const [showSecond, setShowSecond] = useState(false)
//   const [showCapability, setShowCapability] = useState(false)
//   const [showProcess, setShowProcess] = useState(false)
//   const [showThird, setShowThird] = useState(false)
//   const [showQuality, setShowQuality] = useState(false)
//   const [showContact, setShowContact] = useState(false)

//   const loadingRef = useRef(true)
//   const stageRef = useRef(STAGE_HERO)
//   const scrollProgressRef = useRef(0)
//   const isTransitioning = useRef(false)
//   const lastStageRef = useRef(-1)

//   const heroRef = useRef(null)
//   const secondRef = useRef(null)
//   const capabilityRef = useRef(null)
//   const processRef = useRef(null)
//   const thirdRef = useRef(null)
//   const qualityRef = useRef(null)
//   const contactRef = useRef(null)

//   const fadeOverlayRef = useRef(null)
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
//             detail: { stage: STAGE_HERO, progress: 0 },
//           })
//         )
//       }, 100)
//     }

//     window.addEventListener('globalLoadingComplete', handleGlobalLoadingComplete)
//     return () => window.removeEventListener('globalLoadingComplete', handleGlobalLoadingComplete)
//   }, [])

//   useEffect(() => {
//     loadingRef.current = loading
//   }, [loading])

//   // Stage travel
//   useEffect(() => {
//     const handleTravelToStage = (e) => {
//       const targetStage = e.detail.stage
//       if (isTransitioning.current) return
//       if (stageRef.current === targetStage) return

//       const STAGE_STEPS = {
//         [STAGE_HERO]: HERO_STEP,
//         [STAGE_SECOND]: SECOND_STEP,
//         [STAGE_CAPABILITY]: CAPABILITY_STEP,
//         [STAGE_PROCESS]: PROCESS_STEP,
//         [STAGE_THIRD]: THIRD_STEP,
//         [STAGE_QUALITY]: QUALITY_STEP,
//         [STAGE_CONTACT]: CONTACT_STEP,
//       }

//       const direction = targetStage > stageRef.current ? 1 : -1

//       const dispatchStageChange = () => {
//         window.dispatchEvent(
//           new CustomEvent('stageChange', {
//             detail: { stage: stageRef.current, progress: scrollProgressRef.current },
//           })
//         )
//         window.dispatchEvent(
//           new CustomEvent('stageProgress', {
//             detail: { stage: stageRef.current, progress: scrollProgressRef.current },
//           })
//         )
//       }

//       const advanceOneLeg = () => {
//         if (stageRef.current === targetStage) {
//           if (direction > 0) scrollProgressRef.current = 0
//           else scrollProgressRef.current = 1
//           dispatchStageChange()
//           return
//         }

//         const step = STAGE_STEPS[stageRef.current] || 0.015
//         const factor = 1.8

//         if (direction > 0) {
//           scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
//         } else {
//           scrollProgressRef.current = clamp01(scrollProgressRef.current - step * factor)
//         }

//         handleScrollStepRef.current?.(direction, factor)

//         if (stageRef.current !== lastStageRef.current) {
//           lastStageRef.current = stageRef.current
//           window.dispatchEvent(
//             new CustomEvent('stageChange', {
//               detail: { stage: stageRef.current, progress: scrollProgressRef.current },
//             })
//           )
//         }

//         if (stageRef.current !== targetStage) {
//           requestAnimationFrame(advanceOneLeg)
//         } else {
//           if (direction > 0) scrollProgressRef.current = 0
//           else scrollProgressRef.current = 1
//           dispatchStageChange()
//         }
//       }

//       requestAnimationFrame(advanceOneLeg)
//     }

//     window.addEventListener('travelToStage', handleTravelToStage)
//     return () => window.removeEventListener('travelToStage', handleTravelToStage)
//   }, [])

//   // Lock browser scroll
//   useEffect(() => {
//     const prevHtmlOverflow = document.documentElement.style.overflow
//     const prevBodyOverflow = document.body.style.overflow
//     const prevBodyOverscroll = document.body.style.overscrollBehavior
//     const prevBodyPosition = document.body.style.position

//     document.documentElement.style.overflow = 'hidden'
//     document.body.style.overflow = 'hidden'
//     document.body.style.overscrollBehavior = 'none'
//     document.body.style.position = 'fixed'
//     document.body.style.width = '100%'
//     document.body.style.height = '100%'

//     return () => {
//       document.documentElement.style.overflow = prevHtmlOverflow
//       document.body.style.overflow = prevBodyOverflow
//       document.body.style.overscrollBehavior = prevBodyOverscroll
//       document.body.style.position = prevBodyPosition
//       document.body.style.width = ''
//       document.body.style.height = ''
//     }
//   }, [])

//   // Transition helpers
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

//   const mountForward = (setter, ref, nextStage) => {
//     isTransitioning.current = true
//     stageRef.current = nextStage
//     setter(true)
//     scrollProgressRef.current = 0
//     requestAnimationFrame(() => {
//       requestAnimationFrame(() => {
//         if (ref?.current) gsap.set(ref.current, { y: '100%' })
//         isTransitioning.current = false
//       })
//     })
//   }

//   const unmountBackward = (setter, underRef, prevStage, extraDispatch) => {
//     isTransitioning.current = true
//     setter(false)
//     resetParallaxUnder(underRef)
//     stageRef.current = prevStage
//     scrollProgressRef.current = 1
//     if (extraDispatch) extraDispatch()
//     requestAnimationFrame(() => {
//       isTransitioning.current = false
//     })
//   }

//   // Core step
//   const handleScrollStep = (direction, factor) => {
//     if (loadingRef.current || isTransitioning.current) return

//     // HERO
//     if (stageRef.current === STAGE_HERO) {
//       const step = getHeroStep()

//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
//         dispatch('scrollProgress', scrollProgressRef.current)
//         if (scrollProgressRef.current >= 1) {
//           mountForward(setShowSecond, secondRef, STAGE_SECOND)
//         }
//       } else {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current - step * factor)
//         dispatch('scrollProgress', scrollProgressRef.current)
//       }
//       return
//     }

//     // SECOND -> CAPABILITY
//     if (stageRef.current === STAGE_SECOND) {
//       const step = getSecondStep()

//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
//         slideParallax(secondRef, heroRef, scrollProgressRef.current)
//         dispatch('secondTextProgress', scrollProgressRef.current)
//         if (scrollProgressRef.current >= 1) {
//           mountForward(setShowCapability, capabilityRef, STAGE_CAPABILITY)
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - step * factor)
//         slideParallax(secondRef, heroRef, scrollProgressRef.current)
//         dispatch('secondTextProgress', scrollProgressRef.current)
//         if (scrollProgressRef.current <= 0) {
//           unmountBackward(setShowSecond, heroRef, STAGE_HERO, () => dispatch('scrollProgress', 1))
//         }
//       }
//       return
//     }

//     // CAPABILITY
//     if (stageRef.current === STAGE_CAPABILITY) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + CAPABILITY_STEP * factor)
//         if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//           slideParallax(capabilityRef, secondRef, scrollProgressRef.current / CAPABILITY_SPLIT)
//         } else {
//           slideParallax(capabilityRef, secondRef, 1)
//           dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
//         }
//         if (scrollProgressRef.current >= 1) {
//           mountForward(setShowProcess, processRef, STAGE_PROCESS)
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - CAPABILITY_STEP * factor)
//         if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//           slideParallax(capabilityRef, secondRef, scrollProgressRef.current / CAPABILITY_SPLIT)
//           dispatch('capabilityProgress', 0)
//         } else {
//           dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
//         }
//         if (scrollProgressRef.current <= 0) {
//           unmountBackward(setShowCapability, secondRef, STAGE_SECOND, () => {
//             dispatch('secondTextProgress', 1)
//           })
//         }
//       }
//       return
//     }

//     // PROCESS
//     if (stageRef.current === STAGE_PROCESS) {
//       const step = getProcessStep()

//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
//         if (scrollProgressRef.current <= PROCESS_SPLIT) {
//           slideParallax(processRef, capabilityRef, scrollProgressRef.current / PROCESS_SPLIT)
//         } else {
//           slideParallax(processRef, capabilityRef, 1)
//           dispatch('processProgress', (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT))
//         }
//         if (scrollProgressRef.current >= 1) {
//           mountForward(setShowThird, thirdRef, STAGE_THIRD)
//           dispatch('thirdSlideProgress', 0)
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - step * factor)
//         if (scrollProgressRef.current <= PROCESS_SPLIT) {
//           slideParallax(processRef, capabilityRef, scrollProgressRef.current / PROCESS_SPLIT)
//           dispatch('processProgress', 0)
//         } else {
//           dispatch('processProgress', (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT))
//         }
//         if (scrollProgressRef.current <= 0) {
//           unmountBackward(setShowProcess, capabilityRef, STAGE_CAPABILITY, () => dispatch('capabilityProgress', 1))
//         }
//       }
//       return
//     }

//     // THIRD
//     if (stageRef.current === STAGE_THIRD) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + THIRD_STEP * factor)
//         if (scrollProgressRef.current <= THIRD_SPLIT) {
//           slideParallax(thirdRef, processRef, scrollProgressRef.current / THIRD_SPLIT)
//           dispatch('thirdSlideProgress', scrollProgressRef.current / THIRD_SPLIT)
//         } else {
//           slideParallax(thirdRef, processRef, 1)
//           dispatch('thirdSlideProgress', 1)
//           dispatch('thirdHorizontalProgress', (scrollProgressRef.current - THIRD_SPLIT) / (1 - THIRD_SPLIT))
//         }
//         if (scrollProgressRef.current >= 1) {
//           mountForward(setShowQuality, qualityRef, STAGE_QUALITY)
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - THIRD_STEP * factor)
//         if (scrollProgressRef.current <= THIRD_SPLIT) {
//           slideParallax(thirdRef, processRef, scrollProgressRef.current / THIRD_SPLIT)
//           dispatch('thirdSlideProgress', scrollProgressRef.current / THIRD_SPLIT)
//           dispatch('thirdHorizontalProgress', 0)
//         } else {
//           slideParallax(thirdRef, processRef, 1)
//           dispatch('thirdSlideProgress', 1)
//           dispatch('thirdHorizontalProgress', (scrollProgressRef.current - THIRD_SPLIT) / (1 - THIRD_SPLIT))
//         }
//         if (scrollProgressRef.current <= 0) {
//           unmountBackward(setShowThird, processRef, STAGE_PROCESS, () => dispatch('processProgress', 1))
//         }
//       }
//       return
//     }

//     // QUALITY
//     if (stageRef.current === STAGE_QUALITY) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + QUALITY_STEP * factor)
//         if (scrollProgressRef.current <= QUALITY_SPLIT) {
//           slideParallax(qualityRef, thirdRef, scrollProgressRef.current / QUALITY_SPLIT)
//         } else {
//           slideParallax(qualityRef, thirdRef, 1)
//           dispatch('qualityProgress', (scrollProgressRef.current - QUALITY_SPLIT) / (1 - QUALITY_SPLIT))
//         }
//         if (scrollProgressRef.current >= 1) {
//           mountForward(setShowContact, contactRef, STAGE_CONTACT)
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - QUALITY_STEP * factor)
//         if (scrollProgressRef.current <= QUALITY_SPLIT) {
//           slideParallax(qualityRef, thirdRef, scrollProgressRef.current / QUALITY_SPLIT)
//           dispatch('qualityProgress', 0)
//         } else {
//           dispatch('qualityProgress', (scrollProgressRef.current - QUALITY_SPLIT) / (1 - QUALITY_SPLIT))
//         }
//         if (scrollProgressRef.current <= 0) {
//           unmountBackward(setShowQuality, thirdRef, STAGE_THIRD, () => dispatch('thirdHorizontalProgress', 1))
//         }
//       }
//       return
//     }

//     // CONTACT (LAST)
//     if (stageRef.current === STAGE_CONTACT) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + CONTACT_STEP * factor)
//         if (scrollProgressRef.current <= CONTACT_SPLIT) {
//           slideParallax(contactRef, qualityRef, scrollProgressRef.current / CONTACT_SPLIT)
//         } else {
//           slideParallax(contactRef, qualityRef, 1)
//           dispatch('contactProgress', (scrollProgressRef.current - CONTACT_SPLIT) / (1 - CONTACT_SPLIT))
//         }
//       } else {
//         if (scrollProgressRef.current > CONTACT_SPLIT) {
//           scrollProgressRef.current = Math.max(CONTACT_SPLIT, scrollProgressRef.current - CONTACT_STEP * factor)
//           dispatch('contactProgress', (scrollProgressRef.current - CONTACT_SPLIT) / (1 - CONTACT_SPLIT))
//         } else if (scrollProgressRef.current > 0) {
//           scrollProgressRef.current = Math.max(0, scrollProgressRef.current - CONTACT_STEP * factor)
//           slideParallax(contactRef, qualityRef, scrollProgressRef.current / CONTACT_SPLIT)
//           dispatch('contactProgress', 0)
//           if (scrollProgressRef.current <= 0) {
//             unmountBackward(setShowContact, qualityRef, STAGE_QUALITY, () => dispatch('qualityProgress', 1))
//           }
//         }
//       }
//       return
//     }
//   }

//   // ---------------------------------------------------------------------
//   // Wheel + Touch + Keyboard listeners
//   // ---------------------------------------------------------------------
//   useEffect(() => {
//     // ---- Wheel ----
//     const handleWheel = (e) => {
//       e.preventDefault()
//       if (loadingRef.current) return
//       wheelAccumRef.current += e.deltaY
//     }

//     // ---- Touch ----
//     const handleTouchStart = (e) => {
//       if (loadingRef.current) return
//       // Agar sidebar open hai toh skip (NavContent handle karega)
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
//       wheelAccumRef.current += deltaY * multiplier * 2.5

//       // Prevent browser default (pull-to-refresh, page scroll)
//       if (e.cancelable) e.preventDefault()
//     }

//     const handleTouchEnd = () => {
//       isTouchScrollingRef.current = false
//       touchStartYRef.current = 0
//       touchLastYRef.current = 0
//     }

//     // ---- Keyboard ----
//     const handleKeyDown = (e) => {
//       if (loadingRef.current || isTransitioning.current) return

//       const key = e.key

//       if (key === 'ArrowDown' || key === 'PageDown' || key === ' ') {
//         e.preventDefault()
//         handleScrollStep(1, key === ' ' ? 1.2 : 1)
//       } else if (key === 'ArrowUp' || key === 'PageUp') {
//         e.preventDefault()
//         handleScrollStep(-1, 1)
//       } else if (key === 'Home') {
//         e.preventDefault()
//         window.dispatchEvent(new CustomEvent('travelToStage', { detail: { stage: STAGE_HERO } }))
//       } else if (key === 'End') {
//         e.preventDefault()
//         window.dispatchEvent(new CustomEvent('travelToStage', { detail: { stage: STAGE_CONTACT } }))
//       }
//     }

//     // ---- rAF tick ----
//     const tick = () => {
//       if (isTransitioning.current) {
//         wheelAccumRef.current = 0
//       } else if (Math.abs(wheelAccumRef.current) > 0.5) {
//         const raw = wheelAccumRef.current
//         const direction = raw > 0 ? 1 : -1
//         const magnitude = Math.min(Math.abs(raw), 120)
//         const factor = Math.max(0.2, Math.min(1.6, magnitude / 55))
//         handleScrollStep(direction, factor)
//         wheelAccumRef.current -= raw * 0.55
//         if (Math.abs(wheelAccumRef.current) < 0.5) wheelAccumRef.current = 0
//       }

//       if (stageRef.current !== lastStageRef.current) {
//         lastStageRef.current = stageRef.current
//         window.dispatchEvent(
//           new CustomEvent('stageChange', {
//             detail: { stage: stageRef.current, progress: scrollProgressRef.current },
//           })
//         )
//       }

//       window.dispatchEvent(
//         new CustomEvent('stageProgress', {
//           detail: { stage: stageRef.current, progress: scrollProgressRef.current },
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

//   // Resize handling
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
//       {!loading && <NavContent />}

//       {showHero && (
//         <>
//           <div ref={heroRef} className="hero-wrapper" style={fixedWrapperStyle(1)}>
//             <HeroSection
//               headline={<>BUILT ON PRECISION. DRIVEN BY <span>PURPOSE</span></>}
//               subtitle={''}
//               buttonText={''}
//               onButtonClick={() => {}}
//             />
//           </div>

//           {showSecond && (
//             <div ref={secondRef} className="second-section-wrapper" style={fixedWrapperStyle(2)}>
//               <SecondSection
//                 scrollProgressRef={scrollProgressRef}
//                 labelText={'Our Story'}
//                 labelText2={'It Started with Simple Idea'}
//                 mainText={'Get it right the first time. Create with intention. Deliver without compromise.'}
//                 description={'Forgentis was built around a straightforward belief: great fabrication should not require compromise between precision, quality and delivery.'}
//               />
//             </div>
//           )}

//           {showCapability && (
//             <div ref={capabilityRef} className="capability-section-wrapper" style={fixedWrapperStyle(3)}>
//               <CapabilitySection
//                 heading_1={'GOOD FABRICATION STARTS'}
//                 heading_2={'BEFORE THE FIRST CUT'}
//                 paragraph={'Every successful project begins with understanding.'}
//                 scrollProgressRef={scrollProgressRef}
//                 POINTS={POINTS}
//                 TOTAL_PANELS={TOTAL_PANELS}
//               />
//             </div>
//           )}

//           {showProcess && (
//             <div ref={processRef} className="process-section-wrapper" style={fixedWrapperStyle(4)}>
//               <ProcessSection
//                 scrollProgressRef={scrollProgressRef}
//                 POINTS={POINTS_PROCESS}
//                 TOTAL_ITEMS={TOTAL_ITEMS_PROCESS}
//                 heading_part_1={'ONE TEAM. ONE WORKFLOW.'}
//                 heading_part_2={' ONE STANDARD'}
//                 description={'We keep the critical stages of fabrication connected so there is less room for miscommunication and more control over the final result.'}
//               />
//             </div>
//           )}

//           {showThird && (
//             <div ref={thirdRef} className="third-section-wrapper" style={fixedWrapperStyle(5)}>
//               <ThirdSection
//                 scrollProgressRef={scrollProgressRef}
//                 slides={project_steps}
//                 heading_part_1={'WE UNDERSTAND HOW PROJECTS '}
//                 heading_part_2={'ACTUALLY WORK'}
//                 description={'Forgentis is built to work alongside the people responsible for getting projects delivered.'}
//               />
//             </div>
//           )}

//           {showQuality && (
//             <div ref={qualityRef} className="quality-section-wrapper" style={fixedWrapperStyle(6)}>
//               <QualitySection
//                 scrollProgressRef={scrollProgressRef}
//                 POINTS={quality_points}
//                 heading_part_1={'WHEN'}
//                 heading_part_2={'DIFFERENCE'}
//                 heading_part_3={'MEANS'}
//                 heading_part_4={'BETTER'}
//               />
//             </div>
//           )}

//           {showContact && (
//             <div ref={contactRef} className="contact-section-wrapper" style={fixedWrapperStyle(7)}>
//               <ContactSection2 scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

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
//         </>
//       )}
//     </main>
//   )
// }

// ***********************************************

// 'use client'
// import { useState, useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
// import HeroSection from '@/components/HeroSection/HeroSection'
// import SecondSection from '@/components/SecondSection/SecondSection'
// import CapabilitySection from '@/components/CapabilitySection/CapabilitySection'
// import ProcessSection from '@/components/ProcessSection/ProcessSection'
// import ThirdSection from '@/components/ThirdSection/ThirdSection'
// import QualitySection from '@/components/QualitySection/QualitySection'
// import ContactSection2 from '@/components/ContactSection/ContactSection2'
// import CursorTrail from '@/components/CursorTrail/CursorTrail'
// import NavContent from '@/components/NavContent/NavContent'

// const STAGE_HERO = 0
// const STAGE_SECOND = 1
// const STAGE_CAPABILITY = 2
// const STAGE_PROCESS = 3
// const STAGE_THIRD = 4
// const STAGE_QUALITY = 5
// const STAGE_CONTACT = 6

// const HERO_STEP = 0.08
// const SECOND_STEP = 0.015
// const CAPABILITY_STEP = 0.015
// const PROCESS_STEP = 0.015
// const THIRD_STEP = 0.012
// const QUALITY_STEP = 0.01
// const CONTACT_STEP = 0.015

// const CAPABILITY_SPLIT = 0.4
// const PROCESS_SPLIT = 0.4
// const THIRD_SPLIT = 0.55
// const QUALITY_SPLIT = 0.25
// const CONTACT_SPLIT = 0.4

// const clamp01 = (v) => Math.max(0, Math.min(1, v))
// const dispatch = (name, progress) => {
//     window.dispatchEvent(new CustomEvent(name, { detail: { progress } }))
// }

// const fixedWrapperStyle = (z) => ({
//     position: 'fixed',
//     inset: 0,
//     width: '100%',
//     height: '100dvh',
//     zIndex: z,
//     overflow: 'hidden',
//     backgroundColor: 'var(--color-black, #0a0a0a)',
//     willChange: 'transform, opacity',
// })




// const POINTS = [
//     {
//         titleFirst: 'REVIEW THE',
//         titleSecond: 'DRAWINGS',
//         coloredPart: 'second',
//         description: 'Because small inaccuracies can become major problems on site.',
//         descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 }, // Custom adjustable position
//         images: [
//             { src: '/images/precision1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
//             { src: '/images/precision3.png', top: '50%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//         ],
//         titlePos: { top: '20%', left: '55%' },
//     },
//     {
//         titleFirst: 'UNDERSTAND',
//         titleSecond: 'SPECIFICATION',
//         coloredPart: 'second',
//         description: "Because quality is easier to maintain when the process is properly managed.",
//         descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 }, // Custom adjustable position

//         // Neither description nor descPos is provided here
//         images: [
//             { src: '/images/capability1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
//             { src: '/images/capability3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//         ],
//         titlePos: { top: '20%', left: '55%' },
//     },
//     {
//         titleFirst: 'PLAN THE',
//         titleSecond: 'MATERIAL',
//         coloredPart: 'second',
//         description: 'Procuring and staging certified grade metals prior to production.',
//         descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 }, // Custom adjustable position
//         images: [
//             { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
//             { src: '/images/control3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//         ],
//         titlePos: { top: '20%', left: '55%' },
//     },
//     {
//         titleFirst: 'CONSIDER',
//         titleSecond: 'FABRICATION PROCESS',
//         coloredPart: 'second',
//         description: 'Procuring and staging certified grade metals prior to production.',
//         descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 }, // Custom adjustable position
//         images: [
//             { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
//             { src: '/images/control3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//         ],
//         titlePos: { top: '20%', left: '55%' },
//     }
// ]

// const TOTAL_PANELS = POINTS.length + 1




// const POINTS_PROCESS = [
//     { title: 'UNDERSTAND', desc: 'We review your drawings, specifications and project requirements.', image: '/images/cap1.png', pos: { top: '70%', left: '2%' } },
//     { title: 'PLAN', desc: 'Materials, processes and production requirements are defined before fabrication begins.', image: '/images/cap2.png', pos: { top: '70%', left: '75%' } },
//     { title: 'FABRICATE', desc: 'Our teams combine advanced machinery with skilled fabrication to produce the required components or assemblies.', image: '/images/cap3.png', pos: { top: '70%', left: '75%' } },
//     { title: 'FINISH', desc: 'The work is prepared with the required surface treatment, finish or assembly.', image: '/images/cap4.png', pos: { top: '20%', left: '5%' } },
//     { title: 'VERIFY', desc: 'Quality and dimensional checks are carried out against the required specifications.', image: '/images/cap5.png', pos: { top: '65%', left: '5%' } },
//     { title: 'DELIVER', desc: 'The completed work is prepared for delivery, installation or integration into your project.', image: '/images/cap6.png', pos: { top: '60%', left: '70%' }, button: true },
// ]

// const TOTAL_ITEMS_PROCESS = POINTS_PROCESS.length + 1



// const project_steps = [
//     {
//       id: 1,
//       src: '/images/build1.png',
//       desc: 'CLEAR COMMUNICATION',
//       title: 'Straightforward coordination from requirement to delivery.',
//       pos: { top: '15%', left: '5%' },
//     },
//     {
//       id: 2,
//       src: '/images/build2.jpeg',
//       desc: 'TECHNICAL UNDERSTANDING',
//       title: 'Fabrication decisions made with the project specification in mind.',
//       pos: { top: '75%', left: '65%' },
//     },
//     {
//       id: 3,
//       src: '/images/build3.jpeg',
//       desc: 'DOCUMENTED QUALITY',
//       title: 'Inspection and material documentation where required.',
//       pos: { top: '75%', left: '42%' },
//     },
//     {
//       id: 4,
//       src: '/images/build4.jpeg',
//       desc: 'DELIVERY FOCUS',
//       title: 'Production planned around real project timelines.',
//       pos: { top: '20%', left: '1%' },
//       button: true,
//     },
//   ]


  
// const quality_points = [
//   { title: 'PRECISION THAT FITS', desc: 'Built around drawings, specifications and real project requirements.' },
//   { title: 'CAPABILITY THAT SCALES', desc: 'Equipped to handle individual components, assemblies and larger fabrication requirements.' },
//   { title: 'ONE POINT OF CONTACT', desc: 'A coordinated workflow from initial requirement through delivery.' },
//   { title: 'QUALITY YOU CAN VERIFY', desc: 'Controlled processes and inspection at every critical stage.' },
//   { title: 'A PARTNER, NOT JUST A SUPPLIER', desc: 'We work alongside your team to understand the requirement and deliver the right fabrication solution.' },

// ]




// export default function Home() {
//     const [loading, setLoading] = useState(true)
//     const [showHero, setShowHero] = useState(false)
//     const [showSecond, setShowSecond] = useState(false)
//     const [showCapability, setShowCapability] = useState(false)
//     const [showProcess, setShowProcess] = useState(false)
//     const [showThird, setShowThird] = useState(false)
//     const [showQuality, setShowQuality] = useState(false)
//     const [showContact, setShowContact] = useState(false)

//     const loadingRef = useRef(true)
//     const stageRef = useRef(STAGE_HERO)
//     const scrollProgressRef = useRef(0)
//     const isTransitioning = useRef(false)
//     const lastStageRef = useRef(-1)

//     const heroRef = useRef(null)
//     const secondRef = useRef(null)
//     const capabilityRef = useRef(null)
//     const processRef = useRef(null)
//     const thirdRef = useRef(null)
//     const qualityRef = useRef(null)
//     const contactRef = useRef(null)

//     const fadeOverlayRef = useRef(null)
//     const wheelAccumRef = useRef(0)
//     const rafIdRef = useRef(null)
//     const handleScrollStepRef = useRef(null)

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

//     // Stage travel
//     useEffect(() => {
//         const handleTravelToStage = (e) => {
//             const targetStage = e.detail.stage
//             if (isTransitioning.current) return
//             if (stageRef.current === targetStage) return

//             const STAGE_STEPS = {
//                 [STAGE_HERO]: HERO_STEP,
//                 [STAGE_SECOND]: SECOND_STEP,
//                 [STAGE_CAPABILITY]: CAPABILITY_STEP,
//                 [STAGE_PROCESS]: PROCESS_STEP,
//                 [STAGE_THIRD]: THIRD_STEP,
//                 [STAGE_QUALITY]: QUALITY_STEP,
//                 [STAGE_CONTACT]: CONTACT_STEP,
//             }

//             const direction = targetStage > stageRef.current ? 1 : -1

//             const dispatchStageChange = () => {
//                 window.dispatchEvent(
//                     new CustomEvent('stageChange', {
//                         detail: { stage: stageRef.current, progress: scrollProgressRef.current },
//                     })
//                 )
//                 window.dispatchEvent(
//                     new CustomEvent('stageProgress', {
//                         detail: { stage: stageRef.current, progress: scrollProgressRef.current },
//                     })
//                 )
//             }

//             const advanceOneLeg = () => {
//                 if (stageRef.current === targetStage) {
//                     if (direction > 0) scrollProgressRef.current = 0
//                     else scrollProgressRef.current = 1
//                     dispatchStageChange()
//                     return
//                 }

//                 const step = STAGE_STEPS[stageRef.current] || 0.015
//                 const factor = 1.8

//                 if (direction > 0) {
//                     scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
//                 } else {
//                     scrollProgressRef.current = clamp01(scrollProgressRef.current - step * factor)
//                 }

//                 handleScrollStepRef.current?.(direction, factor)

//                 if (stageRef.current !== lastStageRef.current) {
//                     lastStageRef.current = stageRef.current
//                     window.dispatchEvent(
//                         new CustomEvent('stageChange', {
//                             detail: { stage: stageRef.current, progress: scrollProgressRef.current },
//                         })
//                     )
//                 }

//                 if (stageRef.current !== targetStage) {
//                     requestAnimationFrame(advanceOneLeg)
//                 } else {
//                     if (direction > 0) scrollProgressRef.current = 0
//                     else scrollProgressRef.current = 1
//                     dispatchStageChange()
//                 }
//             }

//             requestAnimationFrame(advanceOneLeg)
//         }

//         window.addEventListener('travelToStage', handleTravelToStage)
//         return () => window.removeEventListener('travelToStage', handleTravelToStage)
//     }, [])

//     // Lock browser scroll
//     useEffect(() => {
//         const prevHtmlOverflow = document.documentElement.style.overflow
//         const prevBodyOverflow = document.body.style.overflow
//         const prevBodyOverscroll = document.body.style.overscrollBehavior

//         document.documentElement.style.overflow = 'hidden'
//         document.body.style.overflow = 'hidden'
//         document.body.style.overscrollBehavior = 'none'

//         return () => {
//             document.documentElement.style.overflow = prevHtmlOverflow
//             document.body.style.overflow = prevBodyOverflow
//             document.body.style.overscrollBehavior = prevBodyOverscroll
//         }
//     }, [])

//     // Transition helpers
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

//     const resetParallaxUnder = (underRef) => {
//         if (underRef?.current) {
//             gsap.set(underRef.current, { y: '0%', opacity: 1, scale: 1 })
//         }
//     }

//     const mountForward = (setter, ref, nextStage) => {
//         isTransitioning.current = true
//         stageRef.current = nextStage
//         setter(true)
//         scrollProgressRef.current = 0
//         requestAnimationFrame(() => {
//             requestAnimationFrame(() => {
//                 if (ref?.current) gsap.set(ref.current, { y: '100%' })
//                 isTransitioning.current = false
//             })
//         })
//     }

//     const unmountBackward = (setter, underRef, prevStage, extraDispatch) => {
//         isTransitioning.current = true
//         setter(false)
//         resetParallaxUnder(underRef)
//         stageRef.current = prevStage
//         scrollProgressRef.current = 1
//         if (extraDispatch) extraDispatch()
//         requestAnimationFrame(() => {
//             isTransitioning.current = false
//         })
//     }

//     // Core step
//     const handleScrollStep = (direction, factor) => {
//         if (loadingRef.current || isTransitioning.current) return

//         // HERO
//         if (stageRef.current === STAGE_HERO) {
//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(scrollProgressRef.current + HERO_STEP * factor)
//                 dispatch('scrollProgress', scrollProgressRef.current)
//                 if (scrollProgressRef.current >= 1) {
//                     mountForward(setShowSecond, secondRef, STAGE_SECOND)
//                 }
//             } else {
//                 scrollProgressRef.current = clamp01(scrollProgressRef.current - HERO_STEP * factor)
//                 dispatch('scrollProgress', scrollProgressRef.current)
//             }
//             return
//         }

//         // SECOND -> Leads directly into CAPABILITY
//         if (stageRef.current === STAGE_SECOND) {
//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(scrollProgressRef.current + SECOND_STEP * factor)
//                 slideParallax(secondRef, heroRef, scrollProgressRef.current)
//                 dispatch('secondTextProgress', scrollProgressRef.current)
//                 if (scrollProgressRef.current >= 1) {
//                     mountForward(setShowCapability, capabilityRef, STAGE_CAPABILITY)
//                 }
//             } else {
//                 scrollProgressRef.current = Math.max(0, scrollProgressRef.current - SECOND_STEP * factor)
//                 slideParallax(secondRef, heroRef, scrollProgressRef.current)
//                 dispatch('secondTextProgress', scrollProgressRef.current)
//                 if (scrollProgressRef.current <= 0) {
//                     unmountBackward(setShowSecond, heroRef, STAGE_HERO, () => dispatch('scrollProgress', 1))
//                 }
//             }
//             return
//         }

//         // CAPABILITY -> Parallaxes over SECOND
//         if (stageRef.current === STAGE_CAPABILITY) {
//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(scrollProgressRef.current + CAPABILITY_STEP * factor)
//                 if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//                     slideParallax(capabilityRef, secondRef, scrollProgressRef.current / CAPABILITY_SPLIT)
//                 } else {
//                     slideParallax(capabilityRef, secondRef, 1)
//                     dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
//                 }
//                 if (scrollProgressRef.current >= 1) {
//                     mountForward(setShowProcess, processRef, STAGE_PROCESS)
//                 }
//             } else {
//                 scrollProgressRef.current = Math.max(0, scrollProgressRef.current - CAPABILITY_STEP * factor)
//                 if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//                     slideParallax(capabilityRef, secondRef, scrollProgressRef.current / CAPABILITY_SPLIT)
//                     dispatch('capabilityProgress', 0)
//                 } else {
//                     dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
//                 }
//                 if (scrollProgressRef.current <= 0) {
//                     unmountBackward(setShowCapability, secondRef, STAGE_SECOND, () => {
//                         dispatch('secondTextProgress', 1)
//                     })
//                 }
//             }
//             return
//         }

//         // PROCESS -> Parallaxes over CAPABILITY
//         if (stageRef.current === STAGE_PROCESS) {
//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(scrollProgressRef.current + PROCESS_STEP * factor)
//                 if (scrollProgressRef.current <= PROCESS_SPLIT) {
//                     slideParallax(processRef, capabilityRef, scrollProgressRef.current / PROCESS_SPLIT)
//                 } else {
//                     slideParallax(processRef, capabilityRef, 1)
//                     dispatch('processProgress', (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT))
//                 }
//                 if (scrollProgressRef.current >= 1) {
//                     mountForward(setShowThird, thirdRef, STAGE_THIRD)
//                     dispatch('thirdSlideProgress', 0)
//                 }
//             } else {
//                 scrollProgressRef.current = Math.max(0, scrollProgressRef.current - PROCESS_STEP * factor)
//                 if (scrollProgressRef.current <= PROCESS_SPLIT) {
//                     slideParallax(processRef, capabilityRef, scrollProgressRef.current / PROCESS_SPLIT)
//                     dispatch('processProgress', 0)
//                 } else {
//                     dispatch('processProgress', (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT))
//                 }
//                 if (scrollProgressRef.current <= 0) {
//                     unmountBackward(setShowProcess, capabilityRef, STAGE_CAPABILITY, () => dispatch('capabilityProgress', 1))
//                 }
//             }
//             return
//         }

//         // THIRD
//         if (stageRef.current === STAGE_THIRD) {
//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(scrollProgressRef.current + THIRD_STEP * factor)
//                 if (scrollProgressRef.current <= THIRD_SPLIT) {
//                     slideParallax(thirdRef, processRef, scrollProgressRef.current / THIRD_SPLIT)
//                     dispatch('thirdSlideProgress', scrollProgressRef.current / THIRD_SPLIT)
//                 } else {
//                     slideParallax(thirdRef, processRef, 1)
//                     dispatch('thirdSlideProgress', 1)
//                     dispatch('thirdHorizontalProgress', (scrollProgressRef.current - THIRD_SPLIT) / (1 - THIRD_SPLIT))
//                 }
//                 if (scrollProgressRef.current >= 1) {
//                     mountForward(setShowQuality, qualityRef, STAGE_QUALITY)
//                 }
//             } else {
//                 scrollProgressRef.current = Math.max(0, scrollProgressRef.current - THIRD_STEP * factor)
//                 if (scrollProgressRef.current <= THIRD_SPLIT) {
//                     slideParallax(thirdRef, processRef, scrollProgressRef.current / THIRD_SPLIT)
//                     dispatch('thirdSlideProgress', scrollProgressRef.current / THIRD_SPLIT)
//                     dispatch('thirdHorizontalProgress', 0)
//                 } else {
//                     slideParallax(thirdRef, processRef, 1)
//                     dispatch('thirdSlideProgress', 1)
//                     dispatch('thirdHorizontalProgress', (scrollProgressRef.current - THIRD_SPLIT) / (1 - THIRD_SPLIT))
//                 }
//                 if (scrollProgressRef.current <= 0) {
//                     unmountBackward(setShowThird, processRef, STAGE_PROCESS, () => dispatch('processProgress', 1))
//                 }
//             }
//             return
//         }

//         // QUALITY
//         if (stageRef.current === STAGE_QUALITY) {
//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(scrollProgressRef.current + QUALITY_STEP * factor)
//                 if (scrollProgressRef.current <= QUALITY_SPLIT) {
//                     slideParallax(qualityRef, thirdRef, scrollProgressRef.current / QUALITY_SPLIT)
//                 } else {
//                     slideParallax(qualityRef, thirdRef, 1)
//                     dispatch('qualityProgress', (scrollProgressRef.current - QUALITY_SPLIT) / (1 - QUALITY_SPLIT))
//                 }
//                 if (scrollProgressRef.current >= 1) {
//                     mountForward(setShowContact, contactRef, STAGE_CONTACT)
//                 }
//             } else {
//                 scrollProgressRef.current = Math.max(0, scrollProgressRef.current - QUALITY_STEP * factor)
//                 if (scrollProgressRef.current <= QUALITY_SPLIT) {
//                     slideParallax(qualityRef, thirdRef, scrollProgressRef.current / QUALITY_SPLIT)
//                     dispatch('qualityProgress', 0)
//                 } else {
//                     dispatch('qualityProgress', (scrollProgressRef.current - QUALITY_SPLIT) / (1 - QUALITY_SPLIT))
//                 }
//                 if (scrollProgressRef.current <= 0) {
//                     unmountBackward(setShowQuality, thirdRef, STAGE_THIRD, () => dispatch('thirdHorizontalProgress', 1))
//                 }
//             }
//             return
//         }

//         // CONTACT (LAST)
//         if (stageRef.current === STAGE_CONTACT) {
//             if (direction > 0) {
//                 scrollProgressRef.current = clamp01(scrollProgressRef.current + CONTACT_STEP * factor)
//                 if (scrollProgressRef.current <= CONTACT_SPLIT) {
//                     slideParallax(contactRef, qualityRef, scrollProgressRef.current / CONTACT_SPLIT)
//                 } else {
//                     slideParallax(contactRef, qualityRef, 1)
//                     dispatch('contactProgress', (scrollProgressRef.current - CONTACT_SPLIT) / (1 - CONTACT_SPLIT))
//                 }
//             } else {
//                 if (scrollProgressRef.current > CONTACT_SPLIT) {
//                     scrollProgressRef.current = Math.max(CONTACT_SPLIT, scrollProgressRef.current - CONTACT_STEP * factor)
//                     dispatch('contactProgress', (scrollProgressRef.current - CONTACT_SPLIT) / (1 - CONTACT_SPLIT))
//                 } else if (scrollProgressRef.current > 0) {
//                     scrollProgressRef.current = Math.max(0, scrollProgressRef.current - CONTACT_STEP * factor)
//                     slideParallax(contactRef, qualityRef, scrollProgressRef.current / CONTACT_SPLIT)
//                     dispatch('contactProgress', 0)
//                     if (scrollProgressRef.current <= 0) {
//                         unmountBackward(setShowContact, qualityRef, STAGE_QUALITY, () => dispatch('qualityProgress', 1))
//                     }
//                 }
//             }
//             return
//         }
//     }

//     // Wheel listener + rAF tick
//     useEffect(() => {
//         const handleWheel = (e) => {
//             e.preventDefault()
//             if (loadingRef.current) return
//             wheelAccumRef.current += e.deltaY
//         }

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
//                 if (Math.abs(wheelAccumRef.current) < 0.5) wheelAccumRef.current = 0
//             }

//             if (stageRef.current !== lastStageRef.current) {
//                 lastStageRef.current = stageRef.current
//                 window.dispatchEvent(
//                     new CustomEvent('stageChange', {
//                         detail: { stage: stageRef.current, progress: scrollProgressRef.current },
//                     })
//                 )
//             }

//             window.dispatchEvent(
//                 new CustomEvent('stageProgress', {
//                     detail: { stage: stageRef.current, progress: scrollProgressRef.current },
//                 })
//             )

//             rafIdRef.current = requestAnimationFrame(tick)
//         }

//         window.addEventListener('wheel', handleWheel, { passive: false })
//         rafIdRef.current = requestAnimationFrame(tick)

//         return () => {
//             window.removeEventListener('wheel', handleWheel)
//             if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
//         }
//     }, [])

//     // Keyboard
//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             if (loadingRef.current || isTransitioning.current) return
//             if (e.key === 'ArrowDown') {
//                 e.preventDefault()
//                 handleScrollStep(1, 1)
//             } else if (e.key === 'ArrowUp') {
//                 e.preventDefault()
//                 handleScrollStep(-1, 1)
//             }
//         }
//         window.addEventListener('keydown', handleKeyDown)
//         return () => window.removeEventListener('keydown', handleKeyDown)
//     }, [])

//     return (
//         <main
//             className="main-container"
//             style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden', overscrollBehavior: 'none' }}
//         >
//             {!loading && <NavContent />}

//             {showHero && (
//                 <>
//                     <div ref={heroRef} className="hero-wrapper" style={fixedWrapperStyle(1)}>
//                         <HeroSection headline={<>BUILT ON PRECISION. DRIVEN BY <span>PURPOSE</span></>} subtitle={""} buttonText={""} onButtonClick={()=>{}} />
//                     </div>

//                     {showSecond && (
//                         <div ref={secondRef} className="second-section-wrapper" style={fixedWrapperStyle(2)}>
//                             <SecondSection
//                                 scrollProgressRef={scrollProgressRef}
//                                 labelText={"Our Story"}
//                                 labelText2={"It Started with Simple Idea"}
//                                 mainText={"Get it right the first time. Create with intention. Deliver without compromise."}
//                                 description={"Forgentis was built around a straightforward belief: great fabrication should not require compromise between precision, quality and delivery."}
//                             />
//                         </div>
//                     )}

//                     {showCapability && (
//                         <div ref={capabilityRef} className="capability-section-wrapper" style={fixedWrapperStyle(3)}>
//                             <CapabilitySection heading_1={"GOOD FABRICATION STARTS"} heading_2={"BEFORE THE FIRST CUT"} paragraph={"Every successful project begins with understanding."} scrollProgressRef={scrollProgressRef} POINTS={POINTS} TOTAL_PANELS={TOTAL_PANELS} />
//                         </div>
//                     )}

//                     {showProcess && (
//                         <div ref={processRef} className="process-section-wrapper" style={fixedWrapperStyle(4)}>
//                             <ProcessSection scrollProgressRef={scrollProgressRef} POINTS={POINTS_PROCESS} TOTAL_ITEMS={TOTAL_ITEMS_PROCESS} heading_part_1={'ONE TEAM. ONE WORKFLOW.'} heading_part_2={" ONE STANDARD"} description={"We keep the critical stages of fabrication connected so there is less room for miscommunication and more control over the final result."} />

//                         </div>
//                     )}

//                     {showThird && (
//                         <div ref={thirdRef} className="third-section-wrapper" style={fixedWrapperStyle(5)}>
//                             <ThirdSection scrollProgressRef={scrollProgressRef} slides={project_steps} heading_part_1={"WE UNDERSTAND HOW PROJECTS "} heading_part_2={"ACTUALLY WORK"} description={"Forgentis is built to work alongside the people responsible for getting projects delivered."} />
//                         </div>
//                     )}

//                     {showQuality && (
//                         <div ref={qualityRef} className="quality-section-wrapper" style={fixedWrapperStyle(6)}>
//                             <QualitySection scrollProgressRef={scrollProgressRef} POINTS={quality_points} heading_part_1={"WHEN"} heading_part_2={"DIFFERENCE"} heading_part_3={"MEANS"} heading_part_4={"BETTER"} />
//                         </div>
//                     )}

//                     {showContact && (
//                         <div ref={contactRef} className="contact-section-wrapper" style={fixedWrapperStyle(7)}>
//                             <ContactSection2 scrollProgressRef={scrollProgressRef} />
//                         </div>
//                     )}

//                     <div
//                         ref={fadeOverlayRef}
//                         className="fade-overlay"
//                         style={{
//                             position: 'fixed',
//                             inset: 0,
//                             width: '100%',
//                             height: '100dvh',
//                             zIndex: 11,
//                             pointerEvents: 'none',
//                             background: 'var(--color-black, #0a0a0a)',
//                             opacity: 0,
//                         }}
//                     />
//                 </>
//             )}
//         </main>
//     )
// }