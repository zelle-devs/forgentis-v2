'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import HeroSection from '@/components/HeroSection/HeroSection'
import NavContent from '@/components/NavContent/NavContent'
import ContactSection2 from '@/components/ContactSection/ContactSection2'
import ResourceSection from '@/components/resources/resources'
import Section01Quality from '@/components/Capababilities/qualities'
import ProcessSection from '@/components/ProcessSection/ProcessSection'

// Stages Configuration (Total 6 Stages)
const STAGE_HERO = 0
const STAGE_CAPABILITY_1 = 1
const STAGE_RESOURCE = 2
const STAGE_PROCESS = 3
const STAGE_CAPABILITY_2 = 4
const STAGE_FINAL = 5

// Scroll Step sizes per stage
const HERO_STEP = 0.08
const CAPABILITY_1_STEP = 0.005
const RESOURCE_STEP = 0.015
const PROCESS_STEP = 0.012
const CAPABILITY_2_STEP = 0.005
const FINAL_STEP = 0.01

// Parallax entrance splits
const CAPABILITY_1_SPLIT = 0.2
const RESOURCE_SPLIT = 0.15
const PROCESS_SPLIT = 0.2
const CAPABILITY_2_SPLIT = 0.2
const FINAL_SPLIT = 0.2

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

const POINTS_PROCESS = [
  { title: 'DIMENSIONS', desc: 'Key measurements verified', image: '/images/cap1.png', pos: { top: '70%', left: '2%' } },
  { title: 'WELDS', desc: 'Workmanship and specified requirements checked.', image: '/images/cap2.png', pos: { top: '70%', left: '75%' } },
  { title: 'ASSEMBLY', desc: 'Fit, alignment and completeness confirmed.', image: '/images/cap3.png', pos: { top: '70%', left: '75%' } },
  { title: 'FINISH', desc: 'Surface treatment and appearance reviewed.', image: '/images/cap4.png', pos: { top: '20%', left: '5%' } },
  { title: 'DOCUMENTATION', desc: 'Required records prepared.', image: '/images/cap5.png', pos: { top: '65%', left: '5%' } },
]

const TOTAL_ITEMS_PROCESS = POINTS_PROCESS.length + 1

const qualityData = [
  {
    title: "THE DRAWING IS THE <span>STANDARD.</span>",
    desc: "Every project starts with understanding exactly what needs to be built.",
    secondaryDesc:
      "These aren't suggestions. They define the result. Our production and inspection processes are built around those requirements so that what leaves our facility matches what was specified.",
    processTitle: "SPECIFICATION • PRODUCTION • VERIFICATION • DELIVERY",
    footer: "One standard. Applied throughout.",
  },
  {
    title: "BEFORE WE MAKE IT, WE MAKE SURE WE <span>UNDERSTAND IT.</span>",
    desc: "Quality begins long before the first cut. Our teams review the fabrication requirements, identify critical dimensions and understand the materials, processes and finishing requirements needed for the job. This early review helps us identify potential issues before they become production problems.",
    footer: "Get the process right. Then make the part.",
  },
  {
    title: "THE RIGHT PART STARTS WITH THE <span>RIGHT MATERIAL.</span>",
    desc: "Quality cannot be added later if the foundation is wrong. When material arrives, we verify it against the project requirements, including relevant grade, thickness, finish and certification. Where documentation is required, material certificates and traceability records are maintained as part of the job documentation.",
    footer: "Right material in. Right fabrication out.",
  },
  {
    title: "PRECISION IS WHAT MAKES <span>FABRICATION FIT.</span>",
    desc: "A fabricated component doesn't exist in isolation. It has to fit with another component. It has to align with a drawing. It has to work on site. It has to perform as intended. That's why critical dimensions are checked throughout production—not simply assumed to be correct.",
    processTitle: "MEASURE. VERIFY. CORRECT.",
    secondaryDesc:
      "Key dimensions are checked against the approved drawing and applicable project requirements. Where a specific tolerance is required, inspection is carried out against that requirement.",
    footer: "Because the best fabrication is the fabrication you don't have to fix on site.",
  },
]

const qualityData2 = [
  {
    title: "IF IT MATTERS, <span>DOCUMENT IT.</span>",
    desc: "For professional projects, quality isn't only about what you can see. It's also about being able to demonstrate what was done. Where required, Forgentis maintains job documentation covering relevant material certificates, inspection records and final checks.",
    secondaryDesc: "This creates a clearer chain from:",
    processTitle: "MATERIAL → FABRICATION → INSPECTION → DELIVERY",
    footer: "Giving project teams greater confidence in what they receive.",
  },
  {
    title: "EVERY PROJECT DESERVES THE <span>SAME STANDARD.</span>",
    desc: "A large production order doesn't automatically deserve more attention than a custom component. At Forgentis, the principle is simple:",
    processTitle: "IF IT DOESN'T MEET THE REQUIREMENT, IT ISN'T FINISHED.",
    secondaryDesc: "Whether we're producing one custom piece, a complex assembly or a repeat production run, our objective remains the same:",
    footer: "Meet the specification. Protect the quality. Deliver what was promised.",
  },
  {
    title: "WE DON'T HIDE PROBLEMS. <span>WE SOLVE THEM.</span>",
    desc: "Manufacturing is a controlled process—but control also means responding when something doesn't go as planned. If a part does not meet the agreed requirement, it is identified, assessed and addressed before delivery.",
    secondaryDesc: "Because quality isn't about pretending that problems never happen.",
    processTitle: "IDENTIFY → ASSESS → CORRECT → PREVENT",
    footer: "It's about having the discipline to catch them, correct them and prevent them from becoming someone else's problem.",
  },
]

export default function Industries() {
  const [loading, setLoading] = useState(true)
  const [showHero, setShowHero] = useState(false)
  const [showCapability1, setShowCapability1] = useState(false)
  const [showResource, setShowResource] = useState(false)
  const [showProcess, setShowProcess] = useState(false)
  const [showCapability2, setShowCapability2] = useState(false)
  const [showFinal, setShowFinal] = useState(false)

  const loadingRef = useRef(true)
  const stageRef = useRef(STAGE_HERO)
  const scrollProgressRef = useRef(0)
  const isTransitioning = useRef(false)
  const lastStageRef = useRef(-1)

  // Stage element refs
  const heroRef = useRef(null)
  const capability1Ref = useRef(null)
  const resourceRef = useRef(null)
  const processRef = useRef(null)
  const capability2Ref = useRef(null)
  const contactRef = useRef(null)

  const wheelAccumRef = useRef(0)
  const rafIdRef = useRef(null)
  const handleScrollStepRef = useRef(null)

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
    return () => window.removeEventListener('globalLoadingComplete', handleGlobalLoadingComplete)
  }, [])

  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  // Lock root scroll
  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    const previousBodyOverscroll = document.body.style.overscrollBehavior

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
      document.body.style.overscrollBehavior = previousBodyOverscroll
    }
  }, [])

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
        isTransitioning.current = false
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

  const handleScrollStep = (direction, factor) => {
    if (loadingRef.current || isTransitioning.current) return

    // 0. HERO STAGE
    if (stageRef.current === STAGE_HERO) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + HERO_STEP * factor
        )
        dispatch('scrollProgress', scrollProgressRef.current)

        if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
          mountForward(setShowCapability1, capability1Ref, STAGE_CAPABILITY_1)
        }
      } else {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current - HERO_STEP * factor
        )
        dispatch('scrollProgress', scrollProgressRef.current)
      }
      return
    }

    // 1. CAPABILITY SECTION 1
    if (stageRef.current === STAGE_CAPABILITY_1) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + CAPABILITY_1_STEP * factor
        )

        if (scrollProgressRef.current <= CAPABILITY_1_SPLIT) {
          slideParallax(
            capability1Ref,
            heroRef,
            scrollProgressRef.current / CAPABILITY_1_SPLIT
          )
        } else {
          slideParallax(capability1Ref, heroRef, 1)

          const subProgress =
            (scrollProgressRef.current - CAPABILITY_1_SPLIT) /
            (1 - CAPABILITY_1_SPLIT)

          dispatch('capabilityProgress', subProgress)

          if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
            mountForward(setShowResource, resourceRef, STAGE_RESOURCE)
          }
        }
      } else {
        scrollProgressRef.current = Math.max(
          0,
          scrollProgressRef.current - CAPABILITY_1_STEP * factor
        )

        if (scrollProgressRef.current <= CAPABILITY_1_SPLIT) {
          slideParallax(
            capability1Ref,
            heroRef,
            scrollProgressRef.current / CAPABILITY_1_SPLIT
          )
          dispatch('capabilityProgress', 0)
        } else {
          dispatch(
            'capabilityProgress',
            (scrollProgressRef.current - CAPABILITY_1_SPLIT) /
              (1 - CAPABILITY_1_SPLIT)
          )
        }

        if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
          unmountBackward(setShowCapability1, heroRef, STAGE_HERO, () => {
            dispatch('scrollProgress', 1)
          })
        }
      }
      return
    }

    // 2. RESOURCE SECTION (Stacked Cards Slider)
    if (stageRef.current === STAGE_RESOURCE) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + RESOURCE_STEP * factor
        )

        if (scrollProgressRef.current <= RESOURCE_SPLIT) {
          slideParallax(
            resourceRef,
            capability1Ref,
            scrollProgressRef.current / RESOURCE_SPLIT
          )
          dispatch('thirdHorizontalProgress', 0)
        } else {
          slideParallax(resourceRef, capability1Ref, 1)

          const activeProgress =
            (scrollProgressRef.current - RESOURCE_SPLIT) /
            (1 - RESOURCE_SPLIT)

          dispatch('thirdHorizontalProgress', activeProgress)

          if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
            mountForward(setShowProcess, processRef, STAGE_PROCESS)
          }
        }
      } else {
        scrollProgressRef.current = Math.max(
          0,
          scrollProgressRef.current - RESOURCE_STEP * factor
        )

        if (scrollProgressRef.current <= RESOURCE_SPLIT) {
          slideParallax(
            resourceRef,
            capability1Ref,
            scrollProgressRef.current / RESOURCE_SPLIT
          )
          dispatch('thirdHorizontalProgress', 0)
        } else {
          slideParallax(resourceRef, capability1Ref, 1)

          const activeProgress =
            (scrollProgressRef.current - RESOURCE_SPLIT) /
            (1 - RESOURCE_SPLIT)

          dispatch('thirdHorizontalProgress', activeProgress)
        }

        if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
          unmountBackward(setShowResource, capability1Ref, STAGE_CAPABILITY_1, () => {
            dispatch('capabilityProgress', 1)
          })
        }
      }
      return
    }

    // 3. PROCESS SECTION (Steps Progression)
    if (stageRef.current === STAGE_PROCESS) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + PROCESS_STEP * factor
        )

        if (scrollProgressRef.current <= PROCESS_SPLIT) {
          slideParallax(
            processRef,
            resourceRef,
            scrollProgressRef.current / PROCESS_SPLIT
          )
          dispatch('processProgress', 0)
        } else {
          slideParallax(processRef, resourceRef, 1)

          const activeProgress =
            (scrollProgressRef.current - PROCESS_SPLIT) /
            (1 - PROCESS_SPLIT)

          dispatch('processProgress', activeProgress)

          if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
            mountForward(setShowCapability2, capability2Ref, STAGE_CAPABILITY_2)
          }
        }
      } else {
        scrollProgressRef.current = Math.max(
          0,
          scrollProgressRef.current - PROCESS_STEP * factor
        )

        if (scrollProgressRef.current <= PROCESS_SPLIT) {
          slideParallax(
            processRef,
            resourceRef,
            scrollProgressRef.current / PROCESS_SPLIT
          )
          dispatch('processProgress', 0)
        } else {
          slideParallax(processRef, resourceRef, 1)

          const activeProgress =
            (scrollProgressRef.current - PROCESS_SPLIT) /
            (1 - PROCESS_SPLIT)

          dispatch('processProgress', activeProgress)
        }

        if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
          unmountBackward(setShowProcess, resourceRef, STAGE_RESOURCE, () => {
            dispatch('thirdHorizontalProgress', 1)
          })
        }
      }
      return
    }

    // 4. CAPABILITY SECTION 2 (qualityData2)
    if (stageRef.current === STAGE_CAPABILITY_2) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + CAPABILITY_2_STEP * factor
        )

        if (scrollProgressRef.current <= CAPABILITY_2_SPLIT) {
          slideParallax(
            capability2Ref,
            processRef,
            scrollProgressRef.current / CAPABILITY_2_SPLIT
          )
        } else {
          slideParallax(capability2Ref, processRef, 1)

          const subProgress =
            (scrollProgressRef.current - CAPABILITY_2_SPLIT) /
            (1 - CAPABILITY_2_SPLIT)

          dispatch('capabilityProgress2', subProgress)

          if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
            mountForward(setShowFinal, contactRef, STAGE_FINAL)
          }
        }
      } else {
        scrollProgressRef.current = Math.max(
          0,
          scrollProgressRef.current - CAPABILITY_2_STEP * factor
        )

        if (scrollProgressRef.current <= CAPABILITY_2_SPLIT) {
          slideParallax(
            capability2Ref,
            processRef,
            scrollProgressRef.current / CAPABILITY_2_SPLIT
          )
          dispatch('capabilityProgress2', 0)
        } else {
          dispatch(
            'capabilityProgress2',
            (scrollProgressRef.current - CAPABILITY_2_SPLIT) /
              (1 - CAPABILITY_2_SPLIT)
          )
        }

        if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
          unmountBackward(setShowCapability2, processRef, STAGE_PROCESS, () => {
            dispatch('processProgress', 1)
          })
        }
      }
      return
    }

    // 5. FINAL / CONTACT STAGE
    if (stageRef.current === STAGE_FINAL) {
      if (direction > 0) {
        scrollProgressRef.current = clamp01(
          scrollProgressRef.current + FINAL_STEP * factor
        )

        if (scrollProgressRef.current <= FINAL_SPLIT) {
          slideParallax(
            contactRef,
            capability2Ref,
            scrollProgressRef.current / FINAL_SPLIT
          )
        } else {
          slideParallax(contactRef, capability2Ref, 1)

          const subProgress =
            (scrollProgressRef.current - FINAL_SPLIT) /
            (1 - FINAL_SPLIT)

          dispatch('contactProgress', subProgress)
        }
      } else {
        scrollProgressRef.current = Math.max(
          0,
          scrollProgressRef.current - FINAL_STEP * factor
        )

        if (scrollProgressRef.current <= FINAL_SPLIT) {
          slideParallax(
            contactRef,
            capability2Ref,
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
          unmountBackward(setShowFinal, capability2Ref, STAGE_CAPABILITY_2, () => {
            dispatch('capabilityProgress2', 1)
          })
        }
      }
      return
    }
  }

  // Wheel & RAF Loop
  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault()
      if (loadingRef.current) return
      wheelAccumRef.current += event.deltaY
    }

    const tick = () => {
      if (isTransitioning.current) {
        wheelAccumRef.current = 0
      } else if (Math.abs(wheelAccumRef.current) > 0.5) {
        const raw = wheelAccumRef.current
        const direction = raw > 0 ? 1 : -1
        const magnitude = Math.min(Math.abs(raw), 120)
        const factor = Math.max(0.2, Math.min(1.6, magnitude / 55))

        handleScrollStep(direction, factor)

        wheelAccumRef.current -= raw * 0.75

        if (Math.abs(wheelAccumRef.current) < 0.5) {
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
    rafIdRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (loadingRef.current || isTransitioning.current) return

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        handleScrollStep(1, 1)
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        handleScrollStep(-1, 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <main
      className="main-container"
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        overscrollBehavior: 'none',
      }}
    >
      {loading && <LoadingScreen />}

      {!loading && <NavContent />}

      {/* Stage 0: Hero */}
      {showHero && (
        <div
          ref={heroRef}
          className="hero-wrapper"
          style={fixedWrapperStyle(1)}
        >
          <HeroSection headline={<>QUALITY ISN'T THE LAST STEP. <span>IT'S EVERY STEP</span></>} />
        </div>
      )}

      {/* Stage 1: Quality / Capability Part 1 */}
      {showCapability1 && (
        <div
          ref={capability1Ref}
          className="capability-section-wrapper"
          style={fixedWrapperStyle(2)}
        >
          <Section01Quality qualityData={qualityData} eventName="capabilityProgress" />
        </div>
      )}

      {/* Stage 2: Resource Section (Cards Stack) */}
      {showResource && (
        <div
          ref={resourceRef}
          className="resource-section-wrapper"
          style={fixedWrapperStyle(3)}
        >
          <ResourceSection />
        </div>
      )}

      {/* Stage 3: Process Section */}
      {showProcess && (
        <div
          ref={processRef}
          className="process-section-wrapper"
          style={fixedWrapperStyle(4)}
        >
          <ProcessSection
            heading_part_1="NOTHING LEAVES WITHOUT A"
            heading_part_2="FINAL CHECK"
            description="Before dispatch, completed fabrication is reviewed against the relevant project requirements."
            POINTS={POINTS_PROCESS}
            TOTAL_ITEMS={TOTAL_ITEMS_PROCESS}
          />
        </div>
      )}

      {/* Stage 4: Quality / Capability Part 2 */}
      {showCapability2 && (
        <div
          ref={capability2Ref}
          className="capability-section-wrapper"
          style={fixedWrapperStyle(5)}
        >
          <Section01Quality qualityData={qualityData2} eventName="capabilityProgress2" />
        </div>
      )}

      {/* Stage 5: Final / Contact Section */}
      {showFinal && (
        <div
          ref={contactRef}
          className="contact-section-wrapper"
          style={fixedWrapperStyle(6)}
        >
          <ContactSection2 scrollProgressRef={scrollProgressRef} />
        </div>
      )}
    </main>
  )
}