'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import HeroSection from '@/components/HeroSection/HeroSection'
import NavContent from '@/components/NavContent/NavContent'
import Projects from '@/components/projects/projects'
import ContactSection2 from '@/components/ContactSection/ContactSection2'

import {
  SPLITS,
  INPUT_CONFIG,
  MOBILE_SLIDE_STEP,
  getStep,
  getHeroStep,
  getCapability1Step,
  getTouchMultiplier,
  isMobileViewport,
} from '@/app/config/qualityScrollConfig'

// ----- Stages: Hero -> Projects -> Contact -----
const STAGE_HERO = 0
const STAGE_PROJECTS = 1
const STAGE_CONTACT = 2

// Projects slide-in over the hero uses the old capability1 split/step (as before)
const PROJECTS_SPLIT = SPLITS.capability1
const getProjectsStep = getCapability1Step

// Contact uses the same split/step as the old "final" contact stage
const CONTACT_SPLIT = SPLITS.final

// Contact scroll speed — higher = fewer scrolls (2 = half the scrolls)
const CONTACT_SPEED = {
  desktop: 2,
  mobile: 2,
}

const clamp01 = (value) => Math.max(0, Math.min(1, value))

const dispatch = (name, progress) => {
  window.dispatchEvent(new CustomEvent(name, { detail: { progress } }))
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

export default function Quality() {
  const [loading, setLoading] = useState(true)
  const [showHero, setShowHero] = useState(false)
  const [showProjects, setShowProjects] = useState(false)
  const [projectsActive, setProjectsActive] = useState(false) // true = Lenis in control
  const [showContact, setShowContact] = useState(false)

  const loadingRef = useRef(true)
  const stageRef = useRef(STAGE_HERO)
  const scrollProgressRef = useRef(0)
  const isTransitioning = useRef(false)
  const lastStageRef = useRef(-1)
  const lenisActiveRef = useRef(false)

  const heroRef = useRef(null)
  const projectsRef = useRef(null)
  const contactRef = useRef(null)

  const wheelAccumRef = useRef(0)
  const rafIdRef = useRef(null)
  const handleScrollStepRef = useRef(null)

  // Touch refs
  const touchLastYRef = useRef(0)
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
  // Lenis hand-over
  // ==========================================================================
  const activateLenis = () => {
    lenisActiveRef.current = true
    wheelAccumRef.current = 0
    setProjectsActive(true)
  }

  // Called by Projects when the user scrolls up at the very top of it
  const exitProjects = () => {
    if (!lenisActiveRef.current) return
    lenisActiveRef.current = false
    setProjectsActive(false)
    wheelAccumRef.current = 0
    // Back to the custom scroll, sitting exactly where Lenis started
    scrollProgressRef.current = PROJECTS_SPLIT
  }

  // Called by Projects when the user scrolls down at the very end of it
  const exitProjectsToContact = () => {
    if (!lenisActiveRef.current || isTransitioning.current) return
    lenisActiveRef.current = false
    setProjectsActive(false)
    wheelAccumRef.current = 0
    mountForward(setShowContact, contactRef, STAGE_CONTACT)
  }

  // ==========================================================================
  // Transition helpers (unchanged)
  // ==========================================================================
  const slideParallax = (overRef, underRef, progress) => {
    const dur = isMobileViewport() ? 0.05 : 0.1

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
      gsap.set(ref.current, { y: '0%', opacity: 1, scale: 1 })
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

    if (onComplete) onComplete()

    requestAnimationFrame(() => {
      isTransitioning.current = false
    })
  }

  // ==========================================================================
  // Core scroll step handler
  // ==========================================================================
  const handleScrollStep = (direction, factor) => {
    if (loadingRef.current || isTransitioning.current) return
    if (lenisActiveRef.current) return // Lenis is scrolling the projects

    // 0. HERO STAGE (unchanged)
    if (stageRef.current === STAGE_HERO) {
      const step = getHeroStep()

      scrollProgressRef.current = clamp01(
        scrollProgressRef.current + direction * step * factor
      )
      dispatch('scrollProgress', scrollProgressRef.current)

      if (direction > 0 && scrollProgressRef.current >= 1 && !isTransitioning.current) {
        mountForward(setShowProjects, projectsRef, STAGE_PROJECTS)
      }
      return
    }

    // 1. PROJECTS STAGE — slide in over the hero (same as before),
    //    then hand over to Lenis once it's fully in view
    if (stageRef.current === STAGE_PROJECTS) {
      const step = getProjectsStep()

      scrollProgressRef.current = Math.max(
        0,
        Math.min(PROJECTS_SPLIT, scrollProgressRef.current + direction * step * factor)
      )

      slideParallax(projectsRef, heroRef, scrollProgressRef.current / PROJECTS_SPLIT)

      if (direction > 0 && scrollProgressRef.current >= PROJECTS_SPLIT) {
        activateLenis()
        return
      }

      if (direction < 0 && scrollProgressRef.current <= 0 && !isTransitioning.current) {
        unmountBackward(setShowProjects, heroRef, STAGE_HERO, () => {
          dispatch('scrollProgress', 1)
        })
      }
      return
    }

    // 2. CONTACT STAGE — slides in over the projects (same as the home page)
    if (stageRef.current === STAGE_CONTACT) {
      // Going back: contact slides away, Lenis resumes at the end of the projects
      const backToProjects = () => {
        unmountBackward(setShowContact, projectsRef, STAGE_PROJECTS, () => {
          scrollProgressRef.current = PROJECTS_SPLIT
          activateLenis()
        })
      }

      if (isMobileViewport()) {
        const step = MOBILE_SLIDE_STEP * CONTACT_SPEED.mobile

        if (direction > 0) {
          scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
          slideParallax(contactRef, projectsRef, scrollProgressRef.current)
          dispatch('contactProgress', 1)
        } else {
          scrollProgressRef.current = Math.max(0, scrollProgressRef.current - step * factor)
          slideParallax(contactRef, projectsRef, scrollProgressRef.current)
          dispatch('contactProgress', 1)

          if (scrollProgressRef.current <= 0) backToProjects()
        }
        return
      }

      const step = getStep('final') * CONTACT_SPEED.desktop

      if (direction > 0) {
        scrollProgressRef.current = clamp01(scrollProgressRef.current + step * factor)
        if (scrollProgressRef.current <= CONTACT_SPLIT) {
          slideParallax(contactRef, projectsRef, scrollProgressRef.current / CONTACT_SPLIT)
        } else {
          slideParallax(contactRef, projectsRef, 1)
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
          slideParallax(contactRef, projectsRef, scrollProgressRef.current / CONTACT_SPLIT)
          dispatch('contactProgress', 0)

          if (scrollProgressRef.current <= 0) backToProjects()
        }
      }
    }
  }

  // ==========================================================================
  // Wheel + Touch + Keyboard listeners (ignored while Lenis is active)
  // ==========================================================================
  useEffect(() => {
    const step = (direction, factor) => handleScrollStepRef.current?.(direction, factor)
    const lenisOn = () => lenisActiveRef.current

    const handleWheel = (event) => {
      if (lenisOn()) return // Lenis handles it
      event.preventDefault()
      if (loadingRef.current) return
      wheelAccumRef.current += event.deltaY
    }

    const handleTouchStart = (e) => {
      if (loadingRef.current) return
      if (document.querySelector('.nav-sidebar')) return

      touchLastYRef.current = e.touches[0].clientY
      isTouchScrollingRef.current = true
    }

    const handleTouchMove = (e) => {
      if (lenisOn()) {
        // keep tracking so the custom scroll continues smoothly after an exit
        touchLastYRef.current = e.touches[0].clientY
        return
      }
      if (!isTouchScrollingRef.current || loadingRef.current) return
      if (document.querySelector('.nav-sidebar')) return

      const currentY = e.touches[0].clientY
      const deltaY = touchLastYRef.current - currentY
      touchLastYRef.current = currentY

      wheelAccumRef.current +=
        deltaY * getTouchMultiplier() * INPUT_CONFIG.touchDeltaMultiplier

      if (e.cancelable) e.preventDefault()
    }

    const handleTouchEnd = () => {
      isTouchScrollingRef.current = false
      touchLastYRef.current = 0
    }

    const handleKeyDown = (event) => {
      if (loadingRef.current || isTransitioning.current || lenisOn()) return

      const key = event.key

      if (key === 'ArrowDown' || key === 'PageDown' || key === ' ') {
        event.preventDefault()
        step(1, key === ' ' ? 1.2 : 1)
      } else if (key === 'ArrowUp' || key === 'PageUp') {
        event.preventDefault()
        step(-1, 1)
      } else if (key === 'Home') {
        event.preventDefault()
        window.dispatchEvent(
          new CustomEvent('travelToStage', { detail: { stage: STAGE_HERO } })
        )
      } else if (key === 'End') {
        event.preventDefault()
        window.dispatchEvent(
          new CustomEvent('travelToStage', { detail: { stage: STAGE_CONTACT } })
        )
      }
    }

    const tick = () => {
      if (isTransitioning.current || lenisOn()) {
        wheelAccumRef.current = 0
      } else if (Math.abs(wheelAccumRef.current) > INPUT_CONFIG.wheelDeadZone) {
        const raw = wheelAccumRef.current
        const direction = raw > 0 ? 1 : -1

        let factor = 1.0
        if (!isMobileViewport()) {
          const magnitude = Math.min(Math.abs(raw), INPUT_CONFIG.wheelMagnitudeCap)
          factor = Math.max(
            INPUT_CONFIG.wheelFactorMin,
            Math.min(INPUT_CONFIG.wheelFactorMax, magnitude / INPUT_CONFIG.wheelFactorDivisor)
          )
        }

        step(direction, factor)

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

      {/* Stage 0: Hero (custom scroll, unchanged) */}
      {showHero && (
        <div ref={heroRef} className="hero-wrapper" style={fixedWrapperStyle(1)}>
          <HeroSection
            headline="SEE WHAT WE’VE BUILT "
            highlightedHeadline="THERE’S MORE TO CUT."
            subtitle='Explore work shaped by precision, capability, and the demands of real-world production.'
          />
        </div>
      )}

      {/* Stage 1: Projects (slides in with custom scroll, then Lenis inside) */}
      {showProjects && (
        <div ref={projectsRef} className="projects-wrapper" style={slideInWrapperStyle(2)}>
          <Projects
            active={projectsActive}
            onExitTop={exitProjects}
            onExitBottom={exitProjectsToContact}
          />
        </div>
      )}

      {/* Stage 2: Contact (custom scroll, slides in over the projects) */}
      {showContact && (
        <div
          ref={contactRef}
          className="contact-section-wrapper"
          style={slideInWrapperStyle(3)}
        >
          <ContactSection2 scrollProgressRef={scrollProgressRef} />
        </div>
      )}
    </main>
  )
}