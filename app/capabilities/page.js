'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import HeroSection from '@/components/HeroSection/HeroSection'
import Section01Cap from '@/components/Capababilities/capabilities'
import CapabilitySection from '@/components/CapabilitySection/CapabilitySection'
import NavContent from '@/components/NavContent/NavContent'
import StatsShowcase from '@/components/Stats/stats'
import ContactSection2 from '@/components/ContactSection/ContactSection2'

const STAGE_HERO = 0
const STAGE_CAPABILITY = 1
const STAGE_THREE = 2
const STAGE_STATS = 3
const STAGE_FINAL = 4

const HERO_STEP = 0.08
const CAPABILITY_STEP = 0.005
const SECTION_THREE_STEP = 0.0035
const STATS_STEP = 0.008
const FINAL_STEP = 0.01 // Contact Section scroll speed

const CAPABILITY_SPLIT = 0.2
const SECTION_THREE_SPLIT = 0.2
const STATS_SPLIT = 0.2
const FINAL_SPLIT = 0.2 // Contact section parallax slide split

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

const POINTS = [
    {
        titleFirst: 'MATERIAL',
        titleSecond: '',
        coloredPart: 'second',
        description: 'Material is checked against the project requirement.',
        descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
        images: [
            { src: '/images/precision1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
            { src: '/images/precision3.png', top: '50%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
        ],
        titlePos: { top: '20%', left: '55%' },
    },
    {
        titleFirst: 'FABRICATION',
        titleSecond: '',
        coloredPart: 'second',
        description: 'Critical dimensions and processes are monitored during production.',
        descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
        images: [
            { src: '/images/capability1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
            { src: '/images/capability3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
        ],
        titlePos: { top: '20%', left: '55%' },
    },
    {
        titleFirst: 'ASSEMBLY',
        titleSecond: '',
        coloredPart: 'second',
        description: 'Components are checked for fit and alignment.',
        descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
        images: [
            { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
            { src: '/images/control3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
        ],
        titlePos: { top: '20%', left: '55%' },
    },
    {
        titleFirst: 'FINISHING',
        titleSecond: '',
        coloredPart: 'second',
        description: 'Surface treatment and finish are verified against the requirement.',
        descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
        images: [
            { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
            { src: '/images/control3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
        ],
        titlePos: { top: '20%', left: '55%' },
    },
    {
        titleFirst: 'FINAL',
        titleSecond: 'INSPECTION',
        coloredPart: 'second',
        description: 'Completed work is measured and checked before dispatch.',
        descPos: { top: '70%', left: '10%', maxWidth: '480px', speed: 0.12 },
        images: [
            { src: '/images/control1.png', top: '8%', left: '6%', width: '40%', height: '56%', speed: 0.12 },
            { src: '/images/control3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
        ],
        titlePos: { top: '20%', left: '55%' },
        button: {
            label: 'DISCUSS YOUR REQUIREMENT',
            onClick: () => {
                console.log('Discuss button clicked')
            },
            pos: {
                top: '82%',
                left: '10%',
                speed: 0.12,
            },
            className: 'btn-blue',
        },
    },
]

const STATS_DATA = [
    {
        number: '25K+',
        title: ' SQ. FT.',
        subtitle: 'Production facilities',
    },
    {
        number: '40+',
        title: 'Machines & equipment',
        subtitle: '',
    },
    {
        number: '25',
        title: 'MM',
        subtitle: 'Laser cutting capability',
    },
    {
        number: '10',
        title: 'TON',
        subtitle: 'Lifting capacity',
    },
]

const TOTAL_PANELS = POINTS.length + 1

export default function Home() {
    const [loading, setLoading] = useState(true)
    const [showHero, setShowHero] = useState(false)
    const [showCapability, setShowCapability] = useState(false)
    const [showSectionThree, setShowSectionThree] = useState(false)
    const [showStats, setShowStats] = useState(false)
    const [showFinal, setShowFinal] = useState(false)

    const loadingRef = useRef(true)
    const stageRef = useRef(STAGE_HERO)
    const scrollProgressRef = useRef(0)
    const isTransitioning = useRef(false)
    const lastStageRef = useRef(-1)

    const heroRef = useRef(null)
    const capabilityRef = useRef(null)
    const sectionThreeRef = useRef(null)
    const statsRef = useRef(null)
    const contactRef = useRef(null) // Synced contact ref

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

        // 2. CAPABILITIES (Section01Cap)
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

                    if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
                        mountForward(setShowSectionThree, sectionThreeRef, STAGE_THREE)
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

        // 3. CAPABILITY SECTION (Precision Stage)
        if (stageRef.current === STAGE_THREE) {
            if (direction > 0) {
                scrollProgressRef.current = clamp01(
                    scrollProgressRef.current + SECTION_THREE_STEP * factor
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
                        mountForward(setShowStats, statsRef, STAGE_STATS)
                    }
                }
            } else {
                scrollProgressRef.current = Math.max(
                    0,
                    scrollProgressRef.current - SECTION_THREE_STEP * factor
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

        // 4. STATS & NUMBERS STAGE
        if (stageRef.current === STAGE_STATS) {
            if (direction > 0) {
                scrollProgressRef.current = clamp01(
                    scrollProgressRef.current + STATS_STEP * factor
                )

                if (scrollProgressRef.current <= STATS_SPLIT) {
                    slideParallax(
                        statsRef,
                        sectionThreeRef,
                        scrollProgressRef.current / STATS_SPLIT
                    )
                } else {
                    slideParallax(statsRef, sectionThreeRef, 1)

                    const subProgress =
                        (scrollProgressRef.current - STATS_SPLIT) /
                        (1 - STATS_SPLIT)

                    dispatch('statsProgress', subProgress)

                    // Contact section mount jab stats 100% complete ho
                    if (scrollProgressRef.current >= 1 && !isTransitioning.current) {
                        mountForward(setShowFinal, contactRef, STAGE_FINAL)
                    }
                }
            } else {
                scrollProgressRef.current = Math.max(
                    0,
                    scrollProgressRef.current - STATS_STEP * factor
                )

                if (scrollProgressRef.current <= STATS_SPLIT) {
                    slideParallax(
                        statsRef,
                        sectionThreeRef,
                        scrollProgressRef.current / STATS_SPLIT
                    )
                    dispatch('statsProgress', 0)
                } else {
                    dispatch(
                        'statsProgress',
                        (scrollProgressRef.current - STATS_SPLIT) /
                            (1 - STATS_SPLIT)
                    )
                }

                if (scrollProgressRef.current <= 0 && !isTransitioning.current) {
                    unmountBackward(
                        setShowStats,
                        sectionThreeRef,
                        STAGE_THREE,
                        () => {
                            dispatch('capabilityProgress', 1)
                        }
                    )
                }
            }
            return
        }

        // 5. FINAL (Contact Section)
        if (stageRef.current === STAGE_FINAL) {
            if (direction > 0) {
                scrollProgressRef.current = clamp01(
                    scrollProgressRef.current + FINAL_STEP * factor
                )

                if (scrollProgressRef.current <= FINAL_SPLIT) {
                    slideParallax(
                        contactRef,
                        statsRef,
                        scrollProgressRef.current / FINAL_SPLIT
                    )
                } else {
                    slideParallax(contactRef, statsRef, 1)

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
                        statsRef,
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
                    unmountBackward(
                        setShowFinal,
                        statsRef,
                        STAGE_STATS,
                        () => {
                            dispatch('statsProgress', 1)
                        }
                    )
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
                    <HeroSection headline={<>ENGINEERED TO FABRICATE. EQUIPPED TO <span>DELIVER</span></>} />
                </div>
            )}

            {/* Stage 1: Capabilities */}
            {showCapability && (
                <div
                    ref={capabilityRef}
                    className="second-section-wrapper"
                    style={fixedWrapperStyle(2)}
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

            {/* Stage 3: Numbers & Stats Section */}
            {showStats && (
                <div
                    ref={statsRef}
                    className="fourth-section-wrapper"
                    style={fixedWrapperStyle(4)}
                >
                    <StatsShowcase
                        stats={STATS_DATA}
                        title="THE NUMBERS BEHIND "
                        title_part_2="THE CAPABILITY"
                    />
                </div>
            )}

            {/* Stage 4: Contact Section (zIndex: 5) */}
            {showFinal && (
                <div
                    ref={contactRef}
                    className="contact-section-wrapper"
                    style={fixedWrapperStyle(5)}
                >
                    <ContactSection2 scrollProgressRef={scrollProgressRef} />
                </div>
            )}
        </main>
    )
}