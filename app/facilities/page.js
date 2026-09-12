'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import HeroSection from '@/components/HeroSection/HeroSection'
import NavContent from '@/components/NavContent/NavContent'
import FacilitiesSection from '@/components/Industries/facilities'
import Section01SingleQuality from '@/components/Capababilities/singleQuality'
import ContactSection2 from '@/components/ContactSection/ContactSection2'

// Stages Configuration (Total 4 Stages)
const STAGE_HERO = 0
const STAGE_FACILITIES = 1
const STAGE_SINGLE = 2
const STAGE_FINAL = 3

// Scroll Step sizes per stage
const HERO_STEP = 0.08
const FACILITIES_STEP = 0.02
const SINGLE_STEP = 0.02
const FINAL_STEP = 0.01

// Parallax entrance splits
const FACILITIES_SPLIT = 0.2
const SINGLE_SPLIT = 0.2
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

const singleData = {
    title: "SEE WHERE THE WORK <span>GETS DONE</span>",
    desc: "Show the facility through photography and video—from laser cutting and welding to finishing, inspection and dispatch.",
    footer: "Real fabrication. Real machinery. Real people.",
    buttonText: "VIEW FACILITY GALLERY",
}

export default function Industries() {
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
                    mountForward(setShowFacilities, facilitiesRef, STAGE_FACILITIES)
                }
            } else {
                scrollProgressRef.current = clamp01(
                    scrollProgressRef.current - HERO_STEP * factor
                )
                dispatch('scrollProgress', scrollProgressRef.current)
            }
            return
        }

        // 1. FACILITIES STAGE
        if (stageRef.current === STAGE_FACILITIES) {
            if (direction > 0) {
                scrollProgressRef.current = clamp01(
                    scrollProgressRef.current + FACILITIES_STEP * factor
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
                    scrollProgressRef.current - FACILITIES_STEP * factor
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
            if (direction > 0) {
                scrollProgressRef.current = clamp01(
                    scrollProgressRef.current + SINGLE_STEP * factor
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
                    scrollProgressRef.current - SINGLE_STEP * factor
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

        // 3. FINAL / CONTACT STAGE
        if (stageRef.current === STAGE_FINAL) {
            if (direction > 0) {
                scrollProgressRef.current = clamp01(
                    scrollProgressRef.current + FINAL_STEP * factor
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
                        singleRef,
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
                    unmountBackward(setShowFinal, singleRef, STAGE_SINGLE, () => {
                        dispatch('singleQualityProgress', 1)
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
                    <HeroSection headline={<>WHERE PRECISION BECOMES <span>PRODUCTION</span></>} />
                </div>
            )}

            {/* Stage 1: Facilities */}
            {showFacilities && (
                <div
                    ref={facilitiesRef}
                    className="facilities-section-wrapper"
                    style={fixedWrapperStyle(2)}
                >
                    <FacilitiesSection progressEventName="facilitiesProgress" />
                </div>
            )}
            {/* Stage 2: Single Quality */}
            {showSingle && (
                <div
                    ref={singleRef}
                    className="single-quality-section-wrapper"
                    style={fixedWrapperStyle(3)}
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
                    style={fixedWrapperStyle(4)}
                >
                    <ContactSection2 scrollProgressRef={scrollProgressRef} />
                </div>
            )}
        </main>
    )
}