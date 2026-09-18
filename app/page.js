'use client'
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import HeroSection from '@/components/HeroSection/HeroSection'
import SecondSection from '@/components/SecondSection/SecondSection'
import FourthSection from '@/components/FourthSection/FourthSection'
import CapabilitySection from '@/components/CapabilitySection/CapabilitySection'
import ThirdSection from '@/components/ThirdSection/ThirdSection'
import QualitySection from '@/components/QualitySection/QualitySection'
import ContactSection2 from '@/components/ContactSection/ContactSection2'
import NavContent from '@/components/NavContent/NavContent'
import ProcessSection2 from '@/components/ProcessSection/ProcessSection2'

// ------------------------------------------------------------
// ALL SCROLL CONFIG FROM CENTRAL FILE — no hardcoded numbers
// ------------------------------------------------------------
import {
  SCROLL_STEPS,
  SPLITS,
  INPUT_CONFIG,
  TRAVEL_CONFIG,
  PROCESS_DAMPING,
  MOBILE_SLIDE_STEP,
  getStep,
  getHeroStep,
  getSecondStep,
  getProcessStep,
  getQualityStep,
  getTouchMultiplier,
  isMobileViewport,
} from '@/app/config/scrollConfig'

// ----- Stage constants -----
const STAGE_HERO = 0
const STAGE_SECOND = 1
const STAGE_FOURTH = 2
const STAGE_CAPABILITY = 3
const STAGE_PROCESS = 4
const STAGE_THIRD = 5
const STAGE_QUALITY = 6
const STAGE_CONTACT = 7

// ----- Split shortcuts (pulled from config) -----
const CAPABILITY_SPLIT = SPLITS.capability
const PROCESS_SPLIT = SPLITS.process
const FOURTH_SPLIT = SPLITS.fourth
const THIRD_SPLIT = SPLITS.third
const THIRD_WRAP_SPLIT = SPLITS.thirdWrap
const QUALITY_SPLIT = SPLITS.quality
const CONTACT_SPLIT = SPLITS.contact

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

// Local alias — keep name so rest of file is untouched
const isTouchDeviceLocal = () => {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

const POINTS = [
  {
    titleFirst: 'PRECISION',
    titleSecond: 'AT EVERY DETAIL',
    coloredPart: 'first',
    images: [
      { src: '/optimize/precision1.png', top: '36%', left: '4%', width: '45%', height: '50%', speed: 0.22 },
      { src: '/optimize/precision2.png', top: '-20%', left: '54%', width: '40%', height: '60%', speed: 0.22 },
    ],
    titlePos: { top: '10%', left: '4%' },
    mobileTitlePos: { top: '0%', left: '6%' },
  },
  {
    titleFirst: 'CAPABILITY',
    titleSecond: 'AT EVERY SCALE',
    coloredPart: 'second',
    images: [
      { src: '/optimize/capability1.png', top: '36%', left: '4%', width: '45%', height: '50%', speed: 0.22 },
      { src: '/optimize/capability2.png', top: '-20%', left: '54%', width: '40%', height: '60%', speed: 0.22 },
    ],
    titlePos: { top: '10%', left: '4%' },
    mobileTitlePos: { top: '0%', left: '6%' },
  },
  {
    titleFirst: 'CONTROL',
    titleSecond: 'AT EVERY STAGE',
    coloredPart: 'second',
    images: [
      { src: '/optimize/control1.png', top: '36%', left: '4%', width: '45%', height: '50%', speed: 0.22 },
      { src: '/optimize/control2.png', top: '-20%', left: '54%', width: '40%', height: '60%', speed: 0.22 },
    ],
    titlePos: { top: '10%', left: '4%' },
    mobileTitlePos: { top: '0%', left: '6%' },
  },
  {
    titleFirst: 'COMPLEXITY',
    titleSecond: 'MADE POSSIBLE',
    coloredPart: 'second',
    images: [
      { src: '/optimize/craft1.png', top: '36%', left: '4%', width: '45%', height: '50%', speed: 0.22 },
      { src: '/optimize/craft2.png', top: '-20%', left: '54%', width: '40%', height: '60%', speed: 0.22 },
    ],
    titlePos: { top: '10%', left: '4%' },
    mobileTitlePos: { top: '0%', left: '6%' },
  },
  {
    titleFirst: 'FINISHED',
    titleSecond: 'WITH PURPOSE',
    coloredPart: 'second',
    images: [
      { src: '/optimize/capability1.png', top: '36%', left: '4%', width: '45%', height: '50%', speed: 0.22 },
      { src: '/optimize/capability2.png', top: '-20%', left: '54%', width: '40%', height: '60%', speed: 0.22 },
    ],
    titlePos: { top: '10%', left: '4%' },
    mobileTitlePos: { top: '0%', left: '6%' },
  },
]

const TOTAL_PANELS = POINTS.length + 1

const POINTS_PROCESS = [
  {
    title: 'CNC LASER CUTTING',
    desc: 'Clean, accurate cuts with repeatable precision.',
    image: '/optimize/cap1-mobile.png',
    mobileImage: '/images/cap1.png',
    buttonText: 'EXPLORE LASER',
    buttonUrl: '/capabilities/laser-cutting',
    showButton: false,
  },
  {
    title: '3D PIPE CUTTING',
    desc: 'Complex tube and pipe geometries fabricated to specification.',
    image: '/optimize/cap2-mobile.png',
    mobileImage: '/optimize/cap2.png',
    buttonText: 'VIEW SPECS',
    buttonUrl: '/capabilities/pipe-cutting',
    showButton: false,
  },
  {
    title: 'BENDING & FORMING',
    desc: 'Controlled shaping for precise, consistent results.',
    image: '/optimize/cap3-mobile.png',
    mobileImage: '/optimize/cap3.png',
    showButton: false,
  },
  {
    title: 'MACHINING',
    desc: 'Precision components produced to your required specifications.',
    image: '/optimize/cap4-mobile.png',
    mobileImage: '/images/cap4.png',
    buttonText: 'MACHINING SERVICES',
    buttonUrl: '/capabilities/machining',
    showButton: false,
  },
  {
    title: 'WELDING & ASSEMBLY',
    desc: 'From individual components to complete fabricated assemblies.',
    image: '/optimize/cap5-mobile.png',
    mobileImage: '/optimize/cap5.png',
    buttonText: 'LEARN MORE',
    buttonUrl: '/capabilities/welding',
    showButton: false,
  },
  {
    title: 'FINISHING',
    desc: 'PVD, powder coating, brushed and specialty finishes to complete the result.',
    image: '/optimize/cap6-mobile.png',
    mobileImage: '/optimize/cap6.png',
    buttonText: 'VIEW FINISHES',
    buttonUrl: '/capabilities/finishing',
    showButton: false,
  },
]

const TOTAL_ITEMS_PROCESS = POINTS_PROCESS.length + 1

const project_slides = [
  {
    id: 1,
    src: '/images/vlektra.png',
    mobileSrc: '/images/vlektra_mob.png',
    desc: 'VLEKTRA Precision Fabrication',
    title: 'Custom-fabricated components, precisely cut, formed, finished, and assembled to specification.',
    pos: { bottom: '10%', left: '5%' },
  },
  {
    id: 2,
    src: '/images/kings.png',
    mobileSrc: '/images/kings_mob.png',
    desc: 'KINGS GROUP Architectural Metalwork',
    title: 'Custom laser-cut panels and decorative metal elements, fabricated to project specifications and ready for installation.',
     pos: { top: '12%', left: '53%' },
  },
  {
    id: 3,
    src: '/images/shams.png',
    mobileSrc: '/images/shams_mob.png',
    desc: 'SHAMS POWER Solar Components',
    title: 'Custom-fabricated metal components developed to meet specific solar installation requirements.',
      pos: { bottom: '0%', left: '58%' },
  },
]

const quality_points = [
  { title: 'UNDERSTAND IT FIRST.', desc: 'Quality starts with understanding the requirement.' },
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
    return () =>
      window.removeEventListener(
        'globalLoadingComplete',
        handleGlobalLoadingComplete
      )
  }, [])

  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  // ==========================================================================
  // Stage travel
  // ==========================================================================
  useEffect(() => {
    const handleTravelToStage = (e) => {
      const targetStage = e.detail.stage
      const isInstant = e.detail.instant === true

      if (isTransitioning.current) return
      if (stageRef.current === targetStage) return

      if (isInstant) {
        isTransitioning.current = true

        setShowSecond(false)
        setShowFourth(false)
        setShowCapability(false)
        setShowProcess(false)
        setShowThird(false)
        setShowQuality(false)
        setShowContact(false)
        setShowHero(true)

        stageRef.current = targetStage
        scrollProgressRef.current = 0

        if (heroRef.current)
          gsap.set(heroRef.current, { y: '0%', scale: 1, opacity: 1 })
        if (secondRef.current)
          gsap.set(secondRef.current, { y: '100%', scale: 1, opacity: 1 })
        if (fourthRef.current)
          gsap.set(fourthRef.current, { y: '0%', scale: 1, opacity: 1 })
        if (capabilityRef.current)
          gsap.set(capabilityRef.current, { y: '0%', scale: 1, opacity: 1 })
        if (processRef.current)
          gsap.set(processRef.current, { y: '0%', scale: 1, opacity: 1 })
        if (thirdRef.current)
          gsap.set(thirdRef.current, { y: '0%', scale: 1, opacity: 1 })
        if (qualityRef.current)
          gsap.set(qualityRef.current, { y: '0%', scale: 1, opacity: 1 })
        if (contactRef.current)
          gsap.set(contactRef.current, { y: '0%', scale: 1, opacity: 1 })

        dispatch('scrollProgress', 0)
        dispatch('secondTextProgress', 0)
        dispatch('fourthShapeProgress', 0)
        dispatch('fourthImageProgress', 0)
        dispatch('capabilityProgress', 0)
        dispatch('processProgress', 0)
        dispatch('thirdSlideProgress', 0)
        dispatch('thirdHorizontalProgress', 0)
        dispatch('qualityProgress', 0)
        dispatch('contactProgress', 0)

        window.dispatchEvent(
          new CustomEvent('stageChange', {
            detail: { stage: STAGE_HERO, progress: 0 },
          })
        )
        window.dispatchEvent(
          new CustomEvent('stageProgress', {
            detail: { stage: STAGE_HERO, progress: 0 },
          })
        )

        requestAnimationFrame(() => {
          isTransitioning.current = false
        })

        return
      }

      const STAGE_STEPS = {
        [STAGE_HERO]: getHeroStep(),
        [STAGE_SECOND]: getSecondStep(),
        [STAGE_FOURTH]: getStep('fourth'),
        [STAGE_CAPABILITY]: getStep('capability'),
        [STAGE_PROCESS]: getProcessStep(),
        [STAGE_THIRD]: getStep('third'),
        [STAGE_QUALITY]: getQualityStep(),
        [STAGE_CONTACT]: getStep('contact'),
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

        const step = STAGE_STEPS[stageRef.current] || TRAVEL_CONFIG.fallbackStep
        const factor = TRAVEL_CONFIG.legFactor

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

  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyOverflow = document.body.style.overflow
    const prevBodyOverscroll = document.body.style.overscrollBehavior

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
      document.body.style.overscrollBehavior = prevBodyOverscroll
    }
  }, [])

const slideParallax = (overRef, underRef, progress) => {
  const isMobileDevice = isMobileViewport()
  const dur = isMobileDevice ? 0.05 : 0.1  // mobile par tez

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

  const resetParallaxUnder = (underRef) => {
    if (underRef?.current) {
      gsap.set(underRef.current, { y: '0%', opacity: 1, scale: 1 })
    }
  }

  const runFade = (onSwap) => {
    isTransitioning.current = true
    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioning.current = false
      },
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
      // ✅ Mobile par thoda extra settle time
      setTimeout(() => {
        isTransitioning.current = false
      }, isMobileViewport() ? 80 : 0)
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
      const isMobileDevice = isMobileViewport()

      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
        slideParallax(secondRef, heroRef, scrollProgressRef.current)
        dispatch('secondTextProgress', scrollProgressRef.current)

        if (scrollProgressRef.current >= 1) {
          if (isMobileDevice) {
            mountForward(setShowCapability, capabilityRef, STAGE_CAPABILITY)
          } else {
            stageRef.current = STAGE_FOURTH
            runFade(() => {
              setShowFourth(true)
              scrollProgressRef.current = 0
              requestAnimationFrame(() => {
                if (fourthRef.current)
                  gsap.set(fourthRef.current, { y: '0%', opacity: 1 })
              })
            })
          }
        }
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - step * factor)
        slideParallax(secondRef, heroRef, scrollProgressRef.current)
        dispatch('secondTextProgress', scrollProgressRef.current)
        if (scrollProgressRef.current <= 0) {
          unmountBackward(setShowSecond, heroRef, STAGE_HERO, () =>
            dispatch('scrollProgress', 1)
          )
        }
      }
      return
    }

    // FOURTH
    if (stageRef.current === STAGE_FOURTH) {
      const step = getStep('fourth')
      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
        if (scrollProgressRef.current <= FOURTH_SPLIT) {
          dispatch('fourthShapeProgress', scrollProgressRef.current / FOURTH_SPLIT)
        } else {
          dispatch('fourthShapeProgress', 1)
          dispatch(
            'fourthImageProgress',
            (scrollProgressRef.current - FOURTH_SPLIT) / (1 - FOURTH_SPLIT)
          )
        }
        if (scrollProgressRef.current >= 1) {
          mountForward(setShowCapability, capabilityRef, STAGE_CAPABILITY)
        }
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - step * factor)
        if (scrollProgressRef.current <= FOURTH_SPLIT) {
          dispatch('fourthShapeProgress', scrollProgressRef.current / FOURTH_SPLIT)
          dispatch('fourthImageProgress', 0)
        } else {
          dispatch(
            'fourthImageProgress',
            (scrollProgressRef.current - FOURTH_SPLIT) / (1 - FOURTH_SPLIT)
          )
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
      const step = getStep('capability')
      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
        if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
          slideParallax(
            capabilityRef,
            fourthRef,
            scrollProgressRef.current / CAPABILITY_SPLIT
          )
        } else {
          slideParallax(capabilityRef, fourthRef, 1)
          dispatch(
            'capabilityProgress',
            (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT)
          )
        }
        if (scrollProgressRef.current >= 1) {
          mountForward(setShowProcess, processRef, STAGE_PROCESS)
        }
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - step * factor)
        if (scrollProgressRef.current <= CAPABILITY_SPLIT) {
          slideParallax(
            capabilityRef,
            fourthRef,
            scrollProgressRef.current / CAPABILITY_SPLIT
          )
          dispatch('capabilityProgress', 0)
        } else {
          dispatch(
            'capabilityProgress',
            (scrollProgressRef.current - CAPABILITY_SPLIT) / (1 - CAPABILITY_SPLIT)
          )
        }
        if (scrollProgressRef.current <= 0) {
          const isMobileDevice = isMobileViewport()

          if (isMobileDevice) {
            unmountBackward(setShowCapability, secondRef, STAGE_SECOND, () => {
              dispatch('secondTextProgress', 1)
            })
          } else {
            unmountBackward(setShowCapability, fourthRef, STAGE_FOURTH, () => {
              dispatch('fourthShapeProgress', 1)
              dispatch('fourthImageProgress', 1)
            })
          }
        }
      }
      return
    }

    // PROCESS
    if (stageRef.current === STAGE_PROCESS) {
      const baseStep = getProcessStep()
      const step = baseStep * PROCESS_DAMPING

      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)

        if (scrollProgressRef.current <= PROCESS_SPLIT) {
          slideParallax(
            processRef,
            capabilityRef,
            scrollProgressRef.current / PROCESS_SPLIT
          )
          dispatch('processProgress', 0)
        } else {
          slideParallax(processRef, capabilityRef, 1)
          const internalP =
            (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT)
          dispatch('processProgress', internalP)
        }

        if (scrollProgressRef.current >= 1) {
          mountForward(setShowThird, thirdRef, STAGE_THIRD)
          dispatch('thirdSlideProgress', 0)
        }
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - step * factor)

        if (scrollProgressRef.current <= PROCESS_SPLIT) {
          slideParallax(
            processRef,
            capabilityRef,
            scrollProgressRef.current / PROCESS_SPLIT
          )
          dispatch('processProgress', 0)
        } else {
          const internalP =
            (scrollProgressRef.current - PROCESS_SPLIT) / (1 - PROCESS_SPLIT)
          dispatch('processProgress', internalP)
        }

        if (scrollProgressRef.current <= 0) {
          unmountBackward(setShowProcess, capabilityRef, STAGE_CAPABILITY, () =>
            dispatch('capabilityProgress', 1)
          )
        }
      }
      return
    }

    // THIRD
    if (stageRef.current === STAGE_THIRD) {
      const step = getStep('third')
      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
        if (scrollProgressRef.current <= THIRD_SPLIT) {
          const overallP = scrollProgressRef.current / THIRD_SPLIT
          const wrapP = Math.min(1, overallP / THIRD_WRAP_SPLIT)
          const introP = Math.max(0, (overallP - THIRD_WRAP_SPLIT) / (1 - THIRD_WRAP_SPLIT))
          slideParallax(thirdRef, processRef, wrapP)
          dispatch('thirdSlideProgress', introP)
        } else {
          slideParallax(thirdRef, processRef, 1)
          dispatch('thirdSlideProgress', 1)
          dispatch(
            'thirdHorizontalProgress',
            (scrollProgressRef.current - THIRD_SPLIT) / (1 - THIRD_SPLIT)
          )
        }
        if (scrollProgressRef.current >= 1) {
          mountForward(setShowQuality, qualityRef, STAGE_QUALITY)
        }
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - step * factor)
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
          dispatch(
            'thirdHorizontalProgress',
            (scrollProgressRef.current - THIRD_SPLIT) / (1 - THIRD_SPLIT)
          )
        }
        if (scrollProgressRef.current <= 0) {
          unmountBackward(setShowThird, processRef, STAGE_PROCESS, () =>
            dispatch('processProgress', 1)
          )
        }
      }
      return
    }

    // QUALITY
    if (stageRef.current === STAGE_QUALITY) {
      const isMobileDevice = isMobileViewport()

      if (isMobileDevice) {
        const step = MOBILE_SLIDE_STEP

        if (direction > 0) {
          scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
          slideParallax(qualityRef, thirdRef, scrollProgressRef.current)
          dispatch('qualityProgress', 1)
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

      const step = getQualityStep()

      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
        if (scrollProgressRef.current <= QUALITY_SPLIT) {
          slideParallax(qualityRef, thirdRef, scrollProgressRef.current / QUALITY_SPLIT)
        } else {
          slideParallax(qualityRef, thirdRef, 1)
          dispatch(
            'qualityProgress',
            (scrollProgressRef.current - QUALITY_SPLIT) / (1 - QUALITY_SPLIT)
          )
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
          dispatch(
            'qualityProgress',
            (scrollProgressRef.current - QUALITY_SPLIT) / (1 - QUALITY_SPLIT)
          )
        }
        if (scrollProgressRef.current <= 0) {
          unmountBackward(setShowQuality, thirdRef, STAGE_THIRD, () =>
            dispatch('thirdHorizontalProgress', 1)
          )
        }
      }
      return
    }

    // CONTACT
    if (stageRef.current === STAGE_CONTACT) {
      const isMobileDevice = isMobileViewport()

      if (isMobileDevice) {
        const step = MOBILE_SLIDE_STEP

        if (direction > 0) {
          scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
          slideParallax(contactRef, qualityRef, scrollProgressRef.current)
          dispatch('contactProgress', 1)
        } else {
          scrollProgressRef.current = Math.max(0, scrollProgressRef.current - step * factor)
          slideParallax(contactRef, qualityRef, scrollProgressRef.current)
          dispatch('contactProgress', 1)

          if (scrollProgressRef.current <= 0) {
            unmountBackward(setShowContact, qualityRef, STAGE_QUALITY, () => {
              dispatch('qualityProgress', 1)
            })
          }
        }
        return
      }

      const step = getStep('contact')

      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
        if (scrollProgressRef.current <= CONTACT_SPLIT) {
          slideParallax(contactRef, qualityRef, scrollProgressRef.current / CONTACT_SPLIT)
        } else {
          slideParallax(contactRef, qualityRef, 1)
          dispatch(
            'contactProgress',
            (scrollProgressRef.current - CONTACT_SPLIT) / (1 - CONTACT_SPLIT)
          )
        }
      } else {
        if (scrollProgressRef.current > CONTACT_SPLIT) {
          scrollProgressRef.current = Math.max(
            CONTACT_SPLIT,
            scrollProgressRef.current - step * factor
          )
          dispatch(
            'contactProgress',
            (scrollProgressRef.current - CONTACT_SPLIT) / (1 - CONTACT_SPLIT)
          )
        } else if (scrollProgressRef.current > 0) {
          scrollProgressRef.current = Math.max(0, scrollProgressRef.current - step * factor)
          slideParallax(contactRef, qualityRef, scrollProgressRef.current / CONTACT_SPLIT)
          dispatch('contactProgress', 0)
          if (scrollProgressRef.current <= 0) {
            unmountBackward(setShowContact, qualityRef, STAGE_QUALITY, () =>
              dispatch('qualityProgress', 1)
            )
          }
        }
      }
      return
    }
  }

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      if (loadingRef.current) return
      wheelAccumRef.current += e.deltaY
    }

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
      // wheelAccumRef.current += deltaY * multiplier * INPUT_CONFIG.touchDeltaMultiplier
const touchDelta = deltaY * multiplier * INPUT_CONFIG.touchDeltaMultiplier

  // Accumulate karo, magar har frame mein thoda thoda consume karo
  wheelAccumRef.current += touchDelta

      if (e.cancelable) e.preventDefault()
    }

    const handleTouchEnd = () => {
      isTouchScrollingRef.current = false
      touchStartYRef.current = 0
      touchLastYRef.current = 0
    }

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
        window.dispatchEvent(
          new CustomEvent('travelToStage', { detail: { stage: STAGE_HERO } })
        )
      } else if (key === 'End') {
        e.preventDefault()
        window.dispatchEvent(
          new CustomEvent('travelToStage', { detail: { stage: STAGE_CONTACT } })
        )
      }
    }

     const tick = () => {
  if (isTransitioning.current) {
    wheelAccumRef.current = 0
  } else if (Math.abs(wheelAccumRef.current) > INPUT_CONFIG.wheelDeadZone) {
    const raw = wheelAccumRef.current
    const direction = raw > 0 ? 1 : -1

    // ✅ MOBILE/TABLET: factor ko 1.0 par lock karo (Capability jaisa)
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
  }, [])

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
      }}
    >
      {!loading && <NavContent />}

      {showHero && (
        <>
          <div ref={heroRef} className="hero-wrapper" style={fixedWrapperStyle(1)}>
            <HeroSection 
               headline={<>WE SHAPE <br/> WHAT <span>BUILDS</span></>}
            />
          </div>

          {showSecond && (
            <div
              ref={secondRef}
              className="second-section-wrapper"
              style={slideInWrapperStyle(2)}
            >
              <SecondSection
                scrollProgressRef={scrollProgressRef}
                labelText={''}
                labelText2={''}
                mainText={'EVERY CONCEPT CAN BE SHAPED IN METAL'}
                description={
                  'See what happens when your concept meets the right fabrication partner.'
                }
              />
            </div>
          )}
          {showFourth && (
            <div
              ref={fourthRef}
              className="fourth-section-wrapper"
              style={fixedWrapperStyle(3)}
            >
              <FourthSection scrollProgressRef={scrollProgressRef} />
            </div>
          )}
          {showCapability && (
            <div
              ref={capabilityRef}
              className="capability-section-wrapper"
              style={fixedWrapperStyle(4)}
            >
              <CapabilitySection
                heading_1={'WHAT SHAPES AN IDEA INTO WELL'}
                heading_2={' FABRICATED METAL'}
                paragraph={
                  'The right process turns possibility into something precise, functional and built to last.'
                }
                scrollProgressRef={scrollProgressRef}
                POINTS={POINTS}
                TOTAL_PANELS={TOTAL_PANELS}
              />
            </div>
          )}
          {showProcess && (
            <div
              ref={processRef}
              className="process-section-wrapper"
              style={fixedWrapperStyle(5)}
            >
              <ProcessSection2
                scrollProgressRef={scrollProgressRef}
                POINTS={POINTS_PROCESS}
                TOTAL_ITEMS={TOTAL_ITEMS_PROCESS}
                heading_part_1={'EVERY PROJECT DEMANDS A'}
                heading_part_2={'PRECISE PROCESS'}
                description={
                  'From precision cutting and forming to fabrication and finishing, our capabilities are built around what the final result demands.'
                }
              />
            </div>
          )}
          {showThird && (
            <div
              ref={thirdRef}
              className="third-section-wrapper"
              style={fixedWrapperStyle(6)}
            >
              <ThirdSection
                scrollProgressRef={scrollProgressRef}
                slides={project_slides}
                heading_part_1={'MADE FOR THE PROJECT'}
                heading_part_2={'NOT THE CATALOGUE'}
                description={
                  'Every project has its own requirements. We fabricate accordingly.'
                }
              />
            </div>
          )}
          {showQuality && (
            <div
              ref={qualityRef}
              className="quality-section-wrapper"
              style={fixedWrapperStyle(7)}
            >
              <QualitySection
                scrollProgressRef={scrollProgressRef}
                POINTS={quality_points}
                heading_part_1={"WHEN “GOOD " }
                heading_part_2={''}
                heading_part_3={"ENOUGH” ISN'T."}
                heading_part_4={""}
              />
            </div>
          )}
          {showContact && (
            <div
              ref={contactRef}
              className="contact-section-wrapper"
              style={fixedWrapperStyle(8)}
            >
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
