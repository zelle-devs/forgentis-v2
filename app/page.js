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
import ContactSection2 from '@/components/ContactSection/ContactSection2'
import CursorTrail from '@/components/CursorTrail/CursorTrail'
import NavContent from '@/components/NavContent/NavContent'

const STAGE_HERO = 0
const STAGE_SECOND = 1
const STAGE_FOURTH = 2
const STAGE_CAPABILITY = 3
const STAGE_PROCESS = 4
const STAGE_THIRD = 5
const STAGE_QUALITY = 6
const STAGE_CONTACT = 7

const HERO_STEP = 0.08
// Mobile pe Hero slow
const getHeroStep = () => {
  if (typeof window === 'undefined') return HERO_STEP
  const w = window.innerWidth
  if (w <= 480) return 0.030    // small mobile — slow
  if (w <= 768) return 0.035    // mobile — slow
  if (w <= 1024) return 0.055   // tablet — medium
  return HERO_STEP               // desktop — same
}
const SECOND_STEP = 0.015
// Mobile pe second section zyada fast
const getSecondStep = () => {
  if (typeof window === 'undefined') return SECOND_STEP
  return window.innerWidth <= 768 ? 0.022 : SECOND_STEP
}

const FOURTH_STEP = 0.012
const CAPABILITY_STEP = 0.008
const PROCESS_STEP = 0.010
// Mobile pe Process slow
const getProcessStep = () => {
  if (typeof window === 'undefined') return PROCESS_STEP
  const w = window.innerWidth
  if (w <= 480) return 0.005    // small mobile — bahut slow
  if (w <= 768) return 0.006    // mobile — slow
  if (w <= 1024) return 0.008   // tablet — medium
  return PROCESS_STEP            // desktop
}
const THIRD_STEP = 0.012
const THIRD_WRAP_SPLIT = 0.35
const QUALITY_STEP = 0.01
// Mobile pe Quality faster (content already visible hai)
const getQualityStep = () => {
  if (typeof window === 'undefined') return QUALITY_STEP
  const w = window.innerWidth
  if (w <= 480) return 0.014    // small mobile — jaldi complete
  if (w <= 768) return 0.016    // mobile
  if (w <= 1024) return 0.018   // tablet
  return QUALITY_STEP            // desktop
}

const CONTACT_STEP = 0.025

const CAPABILITY_SPLIT = 0.4
const PROCESS_SPLIT = 0.4
const FOURTH_SPLIT = 0.5
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
const slideInWrapperStyle = (z) => ({
  ...fixedWrapperStyle(z),
  transform: 'translateY(100%)',
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
  if (w < 480) return 1.6    // mobile — zyada sensitive
  if (w < 768) return 1.4    // bada mobile
  if (w < 1024) return 1.2   // tablet
  return 1.0
}

const POINTS = [
  {
    titleFirst: 'PRECISION',
    titleSecond: 'AT EVERY DETAIL',
    coloredPart: 'first',
    images: [
      // { src: '/images/precision1.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
      { src: '/images/precision1.png', top: '36%', left: '4%', width: '45%', height: '50%', speed: 0.22 },
      { src: '/images/precision2.png', top: '-20%', left: '54%', width: '40%', height: '60%', speed: 0.22 },
    ],
    titlePos: { top: '10%', left: '4%' },
  },
  {
    titleFirst: 'CAPABILITY',
    titleSecond: 'AT EVERY SCALE',
    coloredPart: 'second',
    // images: [
    //   { src: '/images/capability1.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
    //   { src: '/images/capability3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
    //   { src: '/images/capability2.png', top: '-20%', left: '44%', width: '40%', height: '60%', speed: 0.22 },
    // ],
    // titlePos: { top: '70%', left: '4%' },
      images: [
      // { src: '/images/precision1.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
      { src: '/images/capability1.png', top: '36%', left: '4%', width: '45%', height: '50%', speed: 0.22 },
      { src: '/images/capability2.png', top: '-20%', left: '54%', width: '40%', height: '60%', speed: 0.22 },
    ],
    titlePos: { top: '10%', left: '4%' },
  },
  {
    titleFirst: 'CONTROL',
    titleSecond: 'AT EVERY STAGE',
    coloredPart: 'second',
    images: [
      { src: '/images/control1.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
      { src: '/images/control3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
      { src: '/images/control2.png', top: '-20%', left: '44%', width: '40%', height: '60%', speed: 0.22 },
    ],
    titlePos: { top: '70%', left: '4%' },
  },
  {
    titleFirst: 'COMPLEXITY',
    titleSecond: 'MADE POSSIBLE',
    coloredPart: 'second',
    images: [
      { src: '/images/craft1.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
      { src: '/images/craft3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
      { src: '/images/craft2.png', top: '-20%', left: '44%', width: '40%', height: '60%', speed: 0.22 },
    ],
    titlePos: { top: '70%', left: '4%' },
  },
  ,
  {
    titleFirst: 'FINISHED',
    titleSecond: 'WITH PURPOSE',
    coloredPart: 'second',
    images: [
      { src: '/images/craft1.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
      { src: '/images/craft3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
      { src: '/images/craft2.png', top: '-20%', left: '44%', width: '40%', height: '60%', speed: 0.22 },
    ],
    titlePos: { top: '70%', left: '4%' },
  },
]

const TOTAL_PANELS = POINTS.length + 1

const POINTS_PROCESS = [
  { title: 'CNC LASER CUTTING', desc: 'Clean, accurate cuts with repeatable precision.', image: '/images/cap1.png',mobileImage: '/images/cap1-mobile.jpg', pos: { top: '70%', left: '2%' },mobilePos: { top: '65%', left: '5%' } },
  { title: '3D PIPE CUTTING', desc: 'Complex tube and pipe geometries fabricated to specification.', image: '/images/cap2.png',mobileImage: '/images/cap2-mobile.jpg', pos: { top: '70%', left: '75%' } },
  { title: 'BENDING & FORMING', desc: 'Controlled shaping for precise, consistent results.', image: '/images/cap3.png',mobileImage: '/images/cap3-mobile.jpg', pos: { top: '70%', left: '75%' } },
  { title: 'MACHINING', desc: 'Precision components produced to your required specifications.', image: '/images/cap4.png',mobileImage: '/images/cap4-mobile.jpg', pos: { top: '20%', left: '5%' } },
  { title: 'WELDING & ASSEMBLY', desc: 'From individual components to complete fabricated assemblies.', image: '/images/cap5.png',mobileImage: '/images/cap5-mobile.jpg', pos: { top: '65%', left: '5%' } },
  { title: 'FINISHING', desc: 'PVD, powder coating, brushed and specialty finishes to complete the result.', image: '/images/cap6.png',mobileImage: '/images/cap6-mobile.jpg', pos: { top: '60%', left: '70%' }, button: true },
]

const TOTAL_ITEMS_PROCESS = POINTS_PROCESS.length + 1

const project_slides = [
  {
    id: 1,
    src: '/images/build1.png',
    mobileSrc: '/images/build1-mobile.jpg',
    desc: 'ARCHITECTURAL METALWORK',
    title: 'Facades, screens, railings, staircases and feature elements.',
    pos: { top: '15%', left: '5%' },
    // mobilePos:{ top: '65%', left: '5%' }
  },
  {
    id: 2,
    src: '/images/build2.jpeg',
    mobileSrc: '/images/build2-mobile.jpg',
    desc: 'COMMERCIAL & INTERIOR',
    title: 'Furniture bases, signage, panels and custom interior metalwork.',
    pos: { top: '75%', left: '65%' },
  },
  {
    id: 3,
    src: '/images/build3.jpeg',
    mobileSrc: '/images/build3-mobile.jpg',
    desc: 'INDUSTRIAL FABRICATION',
    title: 'Engineered components, structural assemblies and production parts.',
    pos: { top: '75%', left: '42%' },
  },
  {
    id: 4,
    src: '/images/build4.jpeg',
    mobileSrc: '/images/build4-mobile.jpg',
    desc: 'CUSTOM FABRICATION',
    title: 'Complex requirements transformed into practical, precisely fabricated solutions.',
    pos: { top: '20%', left: '1%' },
    button: true,
  },
]

const quality_points = [
  { title: 'UNDERSTAND IT FIRST.', desc: 'uality starts with understanding the requirement.' },
  { title: 'CONTROL THE PROCESS.', desc: 'Every stage stays coordinated from drawing to production.' },
  { title: 'CHECK WHAT MATTERS.', desc: 'Quality is verified throughout, not just at the end.' },
  { title: 'DELIVER AS EXPECTED.', desc: 'Built Precisely & Delivered.' },
]

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [showHero, setShowHero] = useState(false)
  const [showSecond, setShowSecond] = useState(false)
  const [showFourth, setShowFourth] = useState(false)
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
  const fourthRef = useRef(null)
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
            detail: { stage: STAGE_HERO, progress: 0 }
          })
        )
      }, 100)
    }

    window.addEventListener('globalLoadingComplete', handleGlobalLoadingComplete)
    return () => window.removeEventListener('globalLoadingComplete', handleGlobalLoadingComplete)
  }, [])

  useEffect(() => { loadingRef.current = loading }, [loading])

  // Stage travel
  useEffect(() => {
    const handleTravelToStage = (e) => {
      const targetStage = e.detail.stage
      if (isTransitioning.current) return
      if (stageRef.current === targetStage) return

      const STAGE_STEPS = {
        [STAGE_HERO]: HERO_STEP,
        [STAGE_SECOND]: SECOND_STEP,
        [STAGE_FOURTH]: FOURTH_STEP,
        [STAGE_CAPABILITY]: CAPABILITY_STEP,
        [STAGE_PROCESS]: PROCESS_STEP,
        [STAGE_THIRD]: THIRD_STEP,
        [STAGE_QUALITY]: QUALITY_STEP,
        [STAGE_CONTACT]: CONTACT_STEP,
      }

      const direction = targetStage > stageRef.current ? 1 : -1

      const dispatchStageChange = () => {
        window.dispatchEvent(new CustomEvent('stageChange', {
          detail: { stage: stageRef.current, progress: scrollProgressRef.current }
        }))
        window.dispatchEvent(new CustomEvent('stageProgress', {
          detail: { stage: stageRef.current, progress: scrollProgressRef.current }
        }))
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
          window.dispatchEvent(new CustomEvent('stageChange', {
            detail: { stage: stageRef.current, progress: scrollProgressRef.current }
          }))
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

  // Real browser/page scroll kabhi trigger na ho
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyOverflow = document.body.style.overflow
    const prevBodyOverscroll = document.body.style.overscrollBehavior
    const prevBodyPosition = document.body.style.position

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    // Mobile pe bhi body fixed — pull-to-refresh rok
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

  const runFade = (onSwap) => {
    isTransitioning.current = true
    const tl = gsap.timeline({
      onComplete: () => { isTransitioning.current = false }
    })
    tl.to(fadeOverlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.inOut' })
      .add(onSwap)
      .to(fadeOverlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.inOut' })
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
    requestAnimationFrame(() => { isTransitioning.current = false })
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

   // SECOND
if (stageRef.current === STAGE_SECOND) {
  const step = getSecondStep()

  if (direction > 0) {
    scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
    slideParallax(secondRef, heroRef, scrollProgressRef.current)
    dispatch('secondTextProgress', scrollProgressRef.current)
    if (scrollProgressRef.current >= 1) {
      stageRef.current = STAGE_FOURTH
      runFade(() => {
        setShowFourth(true)
        scrollProgressRef.current = 0
        requestAnimationFrame(() => {
          if (fourthRef.current) gsap.set(fourthRef.current, { y: '0%', opacity: 1 })
        })
      })
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

    // FOURTH
    if (stageRef.current === STAGE_FOURTH) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + FOURTH_STEP * factor)
        if (scrollProgressRef.current <= FOURTH_SPLIT) {
          dispatch('fourthShapeProgress', scrollProgressRef.current / FOURTH_SPLIT)
        } else {
          dispatch('fourthShapeProgress', 1)
          dispatch('fourthImageProgress', (scrollProgressRef.current - FOURTH_SPLIT) / (1 - FOURTH_SPLIT))
        }
        if (scrollProgressRef.current >= 1) {
          mountForward(setShowCapability, capabilityRef, STAGE_CAPABILITY)
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
          stageRef.current = STAGE_SECOND
          runFade(() => {
            setShowFourth(false)
            scrollProgressRef.current = 1
            dispatch('secondTextProgress', 1)
          })
        }
      }
      return
    }

    // CAPABILITY
    if (stageRef.current === STAGE_CAPABILITY) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + CAPABILITY_STEP * factor)
        if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
          slideParallax(capabilityRef, fourthRef, scrollProgressRef.current / CAPABILITY_SPLIT)
        } else {
          slideParallax(capabilityRef, fourthRef, 1)
          dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
        }
        if (scrollProgressRef.current >= 1) {
          mountForward(setShowProcess, processRef, STAGE_PROCESS)
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
          unmountBackward(setShowCapability, fourthRef, STAGE_FOURTH, () => {
            dispatch('fourthShapeProgress', 1)
            dispatch('fourthImageProgress', 1)
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
  const isMobileDevice =
    typeof window !== 'undefined' && window.innerWidth <= 768

  if (isMobileDevice) {
    // Mobile: sirf ek chhota slide-in, phir seedha Contact
    const step = 0.06   // ← bada step — jaldi slide ho

    if (direction > 0) {
      scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)

      // Slide-in — Quality apni jagah pe aa raha
      slideParallax(qualityRef, thirdRef, scrollProgressRef.current)

      // Content already visible hai (QualitySection.jsx me mobile pe skip)
      dispatch('qualityProgress', 1)

      // Slide poora hone pe → Contact
      if (scrollProgressRef.current >= 1) {
        mountForward(setShowContact, contactRef, STAGE_CONTACT)
      }
    } else {
      scrollProgressRef.current = Math.max(0, scrollProgressRef.current - step * factor)

      slideParallax(qualityRef, thirdRef, scrollProgressRef.current)
      dispatch('qualityProgress', 1)

      if (scrollProgressRef.current <= 0) {
        unmountBackward(setShowQuality, thirdRef, STAGE_THIRD, () => {
          dispatch('thirdHorizontalProgress', 1)
          dispatch('thirdSlideProgress', 1)
        })
      }
    }
    return
  }

  // ===== DESKTOP: same as before =====
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
      // Agar sidebar open hai toh skip (NavContent handle karega)
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

      // Prevent browser default (pull-to-refresh, page scroll)
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
        window.dispatchEvent(new CustomEvent('stageChange', {
          detail: { stage: stageRef.current, progress: scrollProgressRef.current }
        }))
      }

      window.dispatchEvent(new CustomEvent('stageProgress', {
        detail: { stage: stageRef.current, progress: scrollProgressRef.current }
      }))

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

  // Resize handling — mobile orientation change pe reset
  useEffect(() => {
    let resizeTimer = null
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        // Just reset wheel accumulator, GSAP handles rest
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
        touchAction: 'none', // Mobile pe browser default touch rok
      }}
    >
      {!loading && <NavContent />}

      {showHero && (
        <>
          <div ref={heroRef} className="hero-wrapper" style={fixedWrapperStyle(1)}>
            <HeroSection />
          </div>

          {showSecond && (
            <div ref={secondRef} className="second-section-wrapper" style={slideInWrapperStyle(2)}>
              <SecondSection scrollProgressRef={scrollProgressRef} labelText={""} labelText2={""} mainText={"EVERY CONCEPT CAN BE SHAPED IN METAL"} description={"See what happens when your concept meets the right fabrication partner."} />
            </div>
          )}

          {showFourth && (
            <div ref={fourthRef} className="fourth-section-wrapper" style={fixedWrapperStyle(3)}>
              <FourthSection scrollProgressRef={scrollProgressRef} />
            </div>
          )}

          {showCapability && (
            <div ref={capabilityRef} className="capability-section-wrapper" style={fixedWrapperStyle(4)}>
              <CapabilitySection heading_1={"WHAT SHAPES AN IDEA INTO WELL"} heading_2={" FABRICATED METAL"} paragraph={"The right process turns possibility into something precise, functional and built to last."} scrollProgressRef={scrollProgressRef} POINTS={POINTS} TOTAL_PANELS={TOTAL_PANELS} />
            </div>
          )}

          {showProcess && (
            <div ref={processRef} className="process-section-wrapper" style={fixedWrapperStyle(5)}>
              <ProcessSection scrollProgressRef={scrollProgressRef} POINTS={POINTS_PROCESS} TOTAL_ITEMS={TOTAL_ITEMS_PROCESS} heading_part_1={'EVERY PROJECT DEMANDS A'} heading_part_2={"PRECISE PROCESS"} description={"From precision cutting and forming to fabrication and finishing, our capabilities are built around what the final result demands."} />
            </div>
          )}

          {showThird && (
            <div ref={thirdRef} className="third-section-wrapper" style={fixedWrapperStyle(6)}>
              <ThirdSection scrollProgressRef={scrollProgressRef} slides={project_slides} heading_part_1={"MADE FOR THE PROJECT"} heading_part_2={"NOT THE CATALOGUE"} description={"Every project has its own requirements. We fabricate accordingly."} />
            </div>
          )}

          {showQuality && (
            <div ref={qualityRef} className="quality-section-wrapper" style={fixedWrapperStyle(7)}>
              <QualitySection scrollProgressRef={scrollProgressRef} POINTS={quality_points} heading_part_1={"QUALITY"} heading_part_2={'DOESN’T'} heading_part_3={', LEAVE ROOM FOR'} heading_part_4={"“GOOD ENOUGH”"} />
            </div>
          )}

          {showContact && (
            <div ref={contactRef} className="contact-section-wrapper" style={fixedWrapperStyle(8)}>
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
// import FourthSection from '@/components/FourthSection/FourthSection'
// import CapabilitySection from '@/components/CapabilitySection/CapabilitySection'
// import ProcessSection from '@/components/ProcessSection/ProcessSection'
// import ThirdSection from '@/components/ThirdSection/ThirdSection'
// import QualitySection from '@/components/QualitySection/QualitySection'
// import ContactSection2 from '@/components/ContactSection/ContactSection2'
// import CursorTrail from '@/components/CursorTrail/CursorTrail'
// import NavContent from '@/components/NavContent/NavContent'

// const STAGE_HERO = 0
// const STAGE_SECOND = 1
// const STAGE_FOURTH = 2
// const STAGE_CAPABILITY = 3
// const STAGE_PROCESS = 4
// const STAGE_THIRD = 5
// const STAGE_QUALITY = 6
// const STAGE_CONTACT = 7

// const HERO_STEP = 0.08
// const SECOND_STEP = 0.015
// const FOURTH_STEP = 0.012
// const CAPABILITY_STEP = 0.015
// const PROCESS_STEP = 0.015
// const THIRD_STEP = 0.012
// const QUALITY_STEP = 0.01
// const CONTACT_STEP = 0.015

// const CAPABILITY_SPLIT = 0.4
// const PROCESS_SPLIT = 0.4
// const FOURTH_SPLIT = 0.5
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


// const POINTS = [
//   {
//     titleFirst: 'PRECISION',
//     titleSecond: 'IN METAL',
//     coloredPart: 'second',
//     images: [
//       { src: '/images/precision1.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
//       { src: '/images/precision3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//       { src: '/images/precision2.png', top: '-20%', left: '44%', width: '40%', height: '60%', speed: 0.22 },
//     ],
//     titlePos: { top: '70%', left: '4%' },
//   },
//   {
//     titleFirst: 'FULL',
//     titleSecond: 'CAPABILITY',
//     coloredPart: 'second',
//     images: [
//       { src: '/images/capability1.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
//       { src: '/images/capability3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//       { src: '/images/capability2.png', top: '-20%', left: '44%', width: '40%', height: '60%', speed: 0.22 },
//     ],
//     titlePos: { top: '70%', left: '4%' },
//   },
//   {
//     titleFirst: 'TOTAL',
//     titleSecond: 'CONTROL',
//     coloredPart: 'second',
//     images: [
//       { src: '/images/control1.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
//       { src: '/images/control3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//       { src: '/images/control2.png', top: '-20%', left: '44%', width: '40%', height: '60%', speed: 0.22 },
//     ],
//     titlePos: { top: '70%', left: '4%' },
//   },
//   {
//     titleFirst: 'EXPERT',
//     titleSecond: 'CRAFT',
//     coloredPart: 'second',
//     images: [
//       { src: '/images/craft1.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
//       { src: '/images/craft3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
//       { src: '/images/craft2.png', top: '-20%', left: '44%', width: '40%', height: '60%', speed: 0.22 },
//     ],
//     titlePos: { top: '70%', left: '4%' },
//   },
// ]

// const TOTAL_PANELS = POINTS.length + 1





// const POINTS_PROCESS = [
//   { title: 'CNC LASER CUTTING', desc: 'Clean, accurate cuts with repeatable precision.', image: '/images/cap1.png', pos: { top: '70%', left: '2%' } },
//   { title: '3D PIPE CUTTING', desc: 'Complex tube and pipe geometries fabricated to specification.', image: '/images/cap2.png', pos: { top: '70%', left: '75%' } },
//   { title: 'BENDING & FORMING', desc: 'Controlled shaping for precise, consistent results.', image: '/images/cap3.png', pos: { top: '70%', left: '75%' } },
//   { title: 'MACHINING', desc: 'Precision components produced to your required specifications.', image: '/images/cap4.png', pos: { top: '20%', left: '5%' } },
//   { title: 'WELDING & ASSEMBLY', desc: 'From individual components to complete fabricated assemblies.', image: '/images/cap5.png', pos: { top: '65%', left: '5%' } },
//   { title: 'FINISHING', desc: 'PVD, powder coating, brushed and specialty finishes to complete the result.', image: '/images/cap6.png', pos: { top: '60%', left: '70%' }, button: true },
// ]

// const TOTAL_ITEMS_PROCESS = POINTS_PROCESS.length + 1



// const project_slides = [
//     {
//       id: 1,
//       src: '/images/build1.png',
//       desc: 'ARCHITECTURAL METALWORK',
//       title: 'Facades, screens, railings, staircases and feature elements.',
//       pos: { top: '15%', left: '5%' },
//     },
//     {
//       id: 2,
//       src: '/images/build2.jpeg',
//       desc: 'COMMERCIAL & INTERIOR',
//       title: 'Furniture bases, signage, panels and custom interior metalwork.',
//       pos: { top: '75%', left: '65%' },
//     },
//     {
//       id: 3,
//       src: '/images/build3.jpeg',
//       desc: 'INDUSTRIAL FABRICATION',
//       title: 'Engineered components, structural assemblies and production parts.',
//       pos: { top: '75%', left: '42%' },
//     },
//     {
//       id: 4,
//       src: '/images/build4.jpeg',
//       desc: 'CUSTOM FABRICATION',
//       title: 'Complex requirements transformed into practical, precisely fabricated solutions.',
//       pos: { top: '20%', left: '1%' },
//       button: true,
//     },
//   ]


// const quality_points = [
//   { title: 'GET IT RIGHT.', desc: 'Precision starts with understanding the requirement.' },
//   { title: 'KEEP CONTROL.', desc: 'One coordinated workflow from drawing to delivery.' },
//   { title: 'BUILD WITH CONFIDENCE.', desc: 'Quality checks throughout production.' },
//   { title: 'DELIVER WITH PURPOSE.', desc: 'Because your timeline matters as much as the fabrication.' },
// ]



// export default function Home() {
//   const [loading, setLoading] = useState(true)
//   const [showHero, setShowHero] = useState(false)
//   const [showSecond, setShowSecond] = useState(false)
//   const [showFourth, setShowFourth] = useState(false)
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
//   const fourthRef = useRef(null)
//   const capabilityRef = useRef(null)
//   const processRef = useRef(null)
//   const thirdRef = useRef(null)
//   const qualityRef = useRef(null)
//   const contactRef = useRef(null)

//   const fadeOverlayRef = useRef(null)
//   const wheelAccumRef = useRef(0)
//   const rafIdRef = useRef(null)
//   const handleScrollStepRef = useRef(null)

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
//               progress: 0
//             }
//           })
//         )
//       }, 100)
//     }

//     window.addEventListener(
//       'globalLoadingComplete',
//       handleGlobalLoadingComplete
//     )

//     return () => {
//       window.removeEventListener(
//         'globalLoadingComplete',
//         handleGlobalLoadingComplete
//       )
//     }
//   }, [])

//   useEffect(() => { loadingRef.current = loading }, [loading])

//   // Stage travel
//   useEffect(() => {
//     const handleTravelToStage = (e) => {
//       const targetStage = e.detail.stage
//       if (isTransitioning.current) return
//       if (stageRef.current === targetStage) return

//       const STAGE_STEPS = {
//         [STAGE_HERO]: HERO_STEP,
//         [STAGE_SECOND]: SECOND_STEP,
//         [STAGE_FOURTH]: FOURTH_STEP,
//         [STAGE_CAPABILITY]: CAPABILITY_STEP,
//         [STAGE_PROCESS]: PROCESS_STEP,
//         [STAGE_THIRD]: THIRD_STEP,
//         [STAGE_QUALITY]: QUALITY_STEP,
//         [STAGE_CONTACT]: CONTACT_STEP,
//       }

//       const direction = targetStage > stageRef.current ? 1 : -1

//       const dispatchStageChange = () => {
//         window.dispatchEvent(new CustomEvent('stageChange', {
//           detail: { stage: stageRef.current, progress: scrollProgressRef.current }
//         }))
//         window.dispatchEvent(new CustomEvent('stageProgress', {
//           detail: { stage: stageRef.current, progress: scrollProgressRef.current }
//         }))
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
//           window.dispatchEvent(new CustomEvent('stageChange', {
//             detail: { stage: stageRef.current, progress: scrollProgressRef.current }
//           }))
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

//   // Real browser/page scroll kabhi trigger na ho
//   useEffect(() => {
//     const prevHtmlOverflow = document.documentElement.style.overflow
//     const prevBodyOverflow = document.body.style.overflow
//     const prevBodyOverscroll = document.body.style.overscrollBehavior

//     document.documentElement.style.overflow = 'hidden'
//     document.body.style.overflow = 'hidden'
//     document.body.style.overscrollBehavior = 'none'

//     return () => {
//       document.documentElement.style.overflow = prevHtmlOverflow
//       document.body.style.overflow = prevBodyOverflow
//       document.body.style.overscrollBehavior = prevBodyOverscroll
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

//   const runFade = (onSwap) => {
//     isTransitioning.current = true
//     const tl = gsap.timeline({
//       onComplete: () => { isTransitioning.current = false }
//     })
//     tl.to(fadeOverlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.inOut' })
//       .add(onSwap)
//       .to(fadeOverlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.inOut' })
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
//     requestAnimationFrame(() => { isTransitioning.current = false })
//   }

//   // Core step
//   const handleScrollStep = (direction, factor) => {
//     if (loadingRef.current || isTransitioning.current) return

//     // HERO
//     if (stageRef.current === STAGE_HERO) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + HERO_STEP * factor)
//         dispatch('scrollProgress', scrollProgressRef.current)
//         if (scrollProgressRef.current >= 1) {
//           mountForward(setShowSecond, secondRef, STAGE_SECOND)
//         }
//       } else {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current - HERO_STEP * factor)
//         dispatch('scrollProgress', scrollProgressRef.current)
//       }
//       return
//     }

//     // SECOND
//     if (stageRef.current === STAGE_SECOND) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + SECOND_STEP * factor)
//         slideParallax(secondRef, heroRef, scrollProgressRef.current)
//         dispatch('secondTextProgress', scrollProgressRef.current)
//         if (scrollProgressRef.current >= 1) {
//           stageRef.current = STAGE_FOURTH
//           runFade(() => {
//             setShowFourth(true)
//             scrollProgressRef.current = 0
//             requestAnimationFrame(() => {
//               if (fourthRef.current) gsap.set(fourthRef.current, { y: '0%', opacity: 1 })
//             })
//           })
//         }
//       } else {
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - SECOND_STEP * factor)
//         slideParallax(secondRef, heroRef, scrollProgressRef.current)
//         dispatch('secondTextProgress', scrollProgressRef.current)
//         if (scrollProgressRef.current <= 0) {
//           unmountBackward(setShowSecond, heroRef, STAGE_HERO, () => dispatch('scrollProgress', 1))
//         }
//       }
//       return
//     }

//     // FOURTH
//     if (stageRef.current === STAGE_FOURTH) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + FOURTH_STEP * factor)
//         if (scrollProgressRef.current <= FOURTH_SPLIT) {
//           dispatch('fourthShapeProgress', scrollProgressRef.current / FOURTH_SPLIT)
//         } else {
//           dispatch('fourthShapeProgress', 1)
//           dispatch('fourthImageProgress', (scrollProgressRef.current - FOURTH_SPLIT) / (1 - FOURTH_SPLIT))
//         }
//         if (scrollProgressRef.current >= 1) {
//           mountForward(setShowCapability, capabilityRef, STAGE_CAPABILITY)
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
//           stageRef.current = STAGE_SECOND
//           runFade(() => {
//             setShowFourth(false)
//             scrollProgressRef.current = 1
//             dispatch('secondTextProgress', 1)
//           })
//         }
//       }
//       return
//     }

//     // CAPABILITY
//     if (stageRef.current === STAGE_CAPABILITY) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + CAPABILITY_STEP * factor)
//         if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
//           slideParallax(capabilityRef, fourthRef, scrollProgressRef.current / CAPABILITY_SPLIT)
//         } else {
//           slideParallax(capabilityRef, fourthRef, 1)
//           dispatch('capabilityProgress', (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT))
//         }
//         if (scrollProgressRef.current >= 1) {
//           mountForward(setShowProcess, processRef, STAGE_PROCESS)
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
//           unmountBackward(setShowCapability, fourthRef, STAGE_FOURTH, () => {
//             dispatch('fourthShapeProgress', 1)
//             dispatch('fourthImageProgress', 1)
//           })
//         }
//       }
//       return
//     }

//     // PROCESS
//     if (stageRef.current === STAGE_PROCESS) {
//       if (direction > 0) {
//         scrollProgressRef.current = clamp01(scrollProgressRef.current + PROCESS_STEP * factor)
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
//         scrollProgressRef.current = Math.max(0, scrollProgressRef.current - PROCESS_STEP * factor)
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

//   // Wheel listener + rAF tick
//   useEffect(() => {
//     const handleWheel = (e) => {
//       e.preventDefault()
//       if (loadingRef.current) return
//       wheelAccumRef.current += e.deltaY
//     }

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
//         window.dispatchEvent(new CustomEvent('stageChange', {
//           detail: { stage: stageRef.current, progress: scrollProgressRef.current }
//         }))
//       }

//       window.dispatchEvent(new CustomEvent('stageProgress', {
//         detail: { stage: stageRef.current, progress: scrollProgressRef.current }
//       }))

//       rafIdRef.current = requestAnimationFrame(tick)
//     }

//     window.addEventListener('wheel', handleWheel, { passive: false })
//     rafIdRef.current = requestAnimationFrame(tick)

//     return () => {
//       window.removeEventListener('wheel', handleWheel)
//       if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   // Keyboard
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (loadingRef.current || isTransitioning.current) return
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
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   return (
//     <main
//       className="main-container"
//       style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden', overscrollBehavior: 'none' }}
//     >
//       {!loading && <NavContent />}

//       {showHero && (
//         <>
//           <div ref={heroRef} className="hero-wrapper" style={fixedWrapperStyle(1)}>
//             <HeroSection />
//           </div>

//           {showSecond && (
//             <div ref={secondRef} className="second-section-wrapper" style={fixedWrapperStyle(2)}>
//               <SecondSection scrollProgressRef={scrollProgressRef} labelText={""}  labelText2={""} mainText={"FROM ENGINEERING REQUIREMENT TO FINISHED METALWORK."} description={"A great fabrication partner does more than manufacture parts."}  />
//             </div>
//           )}

//           {showFourth && (
//             <div ref={fourthRef} className="fourth-section-wrapper" style={fixedWrapperStyle(3)}>
//               <FourthSection scrollProgressRef={scrollProgressRef} />
//             </div>
//           )}

//           {showCapability && (
//             <div ref={capabilityRef} className="capability-section-wrapper" style={fixedWrapperStyle(4)}>
//               <CapabilitySection heading_1={"BUILT BEYOND THE "} heading_2={"STANDARD"} paragraph={"We take drawings, specifications and ambitious requirements—and turn them into metalwork built to perform."} scrollProgressRef={scrollProgressRef} POINTS={POINTS} TOTAL_PANELS={TOTAL_PANELS} />
//             </div>
//           )}

//           {showProcess && (
//             <div ref={processRef} className="process-section-wrapper" style={fixedWrapperStyle(5)}>
//               <ProcessSection scrollProgressRef={scrollProgressRef} POINTS={POINTS_PROCESS} TOTAL_ITEMS={TOTAL_ITEMS_PROCESS} heading_part_1={'BUILT TO FABRICATE'} heading_part_2={"EQUIPPED TO DELIVER"} description={"From precision cutting to final finishing, our capabilities are built to handle demanding architectural, commercial and industrial requirements."} />
//             </div>
//           )}

//           {showThird && (
//             <div ref={thirdRef} className="third-section-wrapper" style={fixedWrapperStyle(6)}>
//               <ThirdSection scrollProgressRef={scrollProgressRef} slides={project_slides} heading_part_1={"MADE FOR THE PROJECT"} heading_part_2={"NOT THE CATALOGUE"} description={"Every project has its own requirements. We fabricate accordingly."} />
//             </div>
//           )}

//           {showQuality && (
//             <div ref={qualityRef} className="quality-section-wrapper" style={fixedWrapperStyle(7)}>
//               <QualitySection scrollProgressRef={scrollProgressRef} POINTS={quality_points} heading_part_1={"WHEN"} heading_part_2={'"GOOD'}  heading_part_3={'ENOUGH"'} heading_part_4={"ISN'T"} />
//             </div>
//           )}

//           {showContact && (
//             <div ref={contactRef} className="contact-section-wrapper" style={fixedWrapperStyle(8)}>
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