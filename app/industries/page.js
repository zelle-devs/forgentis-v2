'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import HeroSection from '@/components/HeroSection/HeroSection'
import NavContent from '@/components/NavContent/NavContent'
import InsustriesSection from '@/components/Industries/industries'
import ThirdSection from '@/components/ThirdSection/ThirdSection'
import ContactSection2 from '@/components/ContactSection/ContactSection2'
import ResourceSection from '@/components/resources/resources'

// Stages configuration
const STAGE_HERO = 0
const STAGE_CAPABILITY = 1
const STAGE_THIRD = 2
const STAGE_FINAL = 3

// Scroll Step sizes
const HERO_STEP = 0.08
const CAPABILITY_STEP = 0.005
const THIRD_STEP = 0.015 // Slower for smooth horizontal scroll
const FINAL_STEP = 0.01

// Parallax entrance splits
const CAPABILITY_SPLIT = 0.2
const THIRD_SPLIT = 0.15
const FINAL_SPLIT = 0.2

// ThirdSection internal sub-split:
// Pehle 30% progress par Vertical Slide Shift hoga, baaqi 70% par Horizontal Slider chalega
const THIRD_INTERNAL_VERTICAL_SPLIT = 0.3

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

export default function Industries() {
    const [loading, setLoading] = useState(true)
    const [showHero, setShowHero] = useState(false)
    const [showCapability, setShowCapability] = useState(false)
    const [showThird, setShowThird] = useState(false)
    const [showFinal, setShowFinal] = useState(false)

    const loadingRef = useRef(true)
    const stageRef = useRef(STAGE_HERO)
    const scrollProgressRef = useRef(0)
    const isTransitioning = useRef(false)
    const lastStageRef = useRef(-1)

    const heroRef = useRef(null)
    const capabilityRef = useRef(null)
    const thirdRef = useRef(null)
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

        // 1. HERO STAGE
        if (stageRef.current === STAGE_HERO) {
            if (direction > 0) {
                scrollProgressRef.current = clamp01(
                    scrollProgressRef.current + HERO_STEP * factor
                )
                dispatch('scrollProgress', scrollProgressRef.current)

                if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
                    mountForward(setShowCapability, capabilityRef, STAGE_CAPABILITY)
                }
            } else {
                scrollProgressRef.current = clamp01(
                    scrollProgressRef.current - HERO_STEP * factor
                )
                dispatch('scrollProgress', scrollProgressRef.current)
            }
            return
        }

        // 2. CAPABILITY / INDUSTRIES STAGE
        if (stageRef.current === STAGE_CAPABILITY) {
            if (direction > 0) {
                scrollProgressRef.current = clamp01(
                    scrollProgressRef.current + CAPABILITY_STEP * factor
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

                    // Jab Industries Section ka scroll 100% complete ho tab ThirdSection mount ho
                    if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
                        mountForward(setShowThird, thirdRef, STAGE_THIRD)
                    }
                }
            } else {
                scrollProgressRef.current = Math.max(
                    0,
                    scrollProgressRef.current - CAPABILITY_STEP * factor
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

        // 3. THIRD SECTION (Vertical Intro Shift + Horizontal Slider)
        if (stageRef.current === STAGE_THIRD) {
            if (direction > 0) {
                scrollProgressRef.current = clamp01(
                    scrollProgressRef.current + THIRD_STEP * factor
                )

                // Parallax entrance: Third Section slides over Capability
                if (scrollProgressRef.current <= THIRD_SPLIT) {
                    slideParallax(
                        thirdRef,
                        capabilityRef,
                        scrollProgressRef.current / THIRD_SPLIT
                    )
                    dispatch('thirdSlideProgress', 0)
                    dispatch('thirdHorizontalProgress', 0)
                } else {
                    // Lock ThirdSection completely covering the screen
                    slideParallax(thirdRef, capabilityRef, 1)

                    const activeProgress =
                        (scrollProgressRef.current - THIRD_SPLIT) /
                        (1 - THIRD_SPLIT)

                    // Phase 1: Intro view se Slider view shift
                    if (activeProgress <= THIRD_INTERNAL_VERTICAL_SPLIT) {
                        const verticalProgress =
                            activeProgress / THIRD_INTERNAL_VERTICAL_SPLIT
                        dispatch('thirdSlideProgress', verticalProgress)
                        dispatch('thirdHorizontalProgress', 0)
                    } 
                    // Phase 2: Horizontal slides run
                    else {
                        dispatch('thirdSlideProgress', 1)
                        const horizontalProgress =
                            (activeProgress - THIRD_INTERNAL_VERTICAL_SPLIT) /
                            (1 - THIRD_INTERNAL_VERTICAL_SPLIT)
                        dispatch('thirdHorizontalProgress', horizontalProgress)
                    }

                    if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
                        mountForward(setShowFinal, contactRef, STAGE_FINAL)
                    }
                }
            } else {
                scrollProgressRef.current = Math.max(
                    0,
                    scrollProgressRef.current - THIRD_STEP * factor
                )

                if (scrollProgressRef.current <= THIRD_SPLIT) {
                    slideParallax(
                        thirdRef,
                        capabilityRef,
                        scrollProgressRef.current / THIRD_SPLIT
                    )
                    dispatch('thirdSlideProgress', 0)
                    dispatch('thirdHorizontalProgress', 0)
                } else {
                    slideParallax(thirdRef, capabilityRef, 1)

                    const activeProgress =
                        (scrollProgressRef.current - THIRD_SPLIT) /
                        (1 - THIRD_SPLIT)

                    if (activeProgress <= THIRD_INTERNAL_VERTICAL_SPLIT) {
                        const verticalProgress =
                            activeProgress / THIRD_INTERNAL_VERTICAL_SPLIT
                        dispatch('thirdSlideProgress', verticalProgress)
                        dispatch('thirdHorizontalProgress', 0)
                    } else {
                        dispatch('thirdSlideProgress', 1)
                        const horizontalProgress =
                            (activeProgress - THIRD_INTERNAL_VERTICAL_SPLIT) /
                            (1 - THIRD_INTERNAL_VERTICAL_SPLIT)
                        dispatch('thirdHorizontalProgress', horizontalProgress)
                    }
                }

                if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
                    unmountBackward(setShowThird, capabilityRef, STAGE_CAPABILITY, () => {
                        dispatch('capabilityProgress', 1)
                    })
                }
            }
            return
        }

        // 4. FINAL / CONTACT STAGE
        if (stageRef.current === STAGE_FINAL) {
            if (direction > 0) {
                scrollProgressRef.current = clamp01(
                    scrollProgressRef.current + FINAL_STEP * factor
                )

                if (scrollProgressRef.current <= FINAL_SPLIT) {
                    slideParallax(
                        contactRef,
                        thirdRef,
                        scrollProgressRef.current / FINAL_SPLIT
                    )
                } else {
                    slideParallax(contactRef, thirdRef, 1)

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
                        thirdRef,
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
                    unmountBackward(setShowFinal, thirdRef, STAGE_THIRD, () => {
                        dispatch('thirdSlideProgress', 1)
                        dispatch('thirdHorizontalProgress', 1)
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
                    <HeroSection headline={<>FABRICATION FOR THE TEAMS THAT <span>BUILD</span></>} />
                </div>
            )}

            {/* Stage 1: Industries / Applications Section */}
            {showCapability && (
                <div
                    ref={capabilityRef}
                    className="second-section-wrapper"
                    style={fixedWrapperStyle(2)}
                >
                    <InsustriesSection />
                </div>
            )}

            {/* Stage 2: ThirdSection (Intro Slide + Horizontal Scroll) */}
            {showThird && (
                <div
                    ref={thirdRef}
                    className="third-section-wrapper"
                    style={fixedWrapperStyle(3)}
                >
                    {/* <ThirdSection
                        heading_part_1="MADE FOR THE PROJECT"
                        heading_part_2="NOT THE CATALOGUE"
                        description="Every project has its own requirements. We fabricate accordingly."
                        slides={project_slides}
                    /> */}
                    <ResourceSection/>
                </div>
            )}

            {/* Stage 3: Final / Contact Section */}
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