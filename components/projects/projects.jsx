'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Lenis from 'lenis'
import './style.css'

// ------------------------------------------------------------
// PROJECT LIST — add / remove projects here
// ------------------------------------------------------------
export const PROJECTS = [
  {
    clientName: 'VLEKTRA',
    clientLogo: '/optimize/vlektra.png',
    heading1: 'VLEKTRA',
    heading2: 'PROJECT',
    image: '/optimize/vlektra1.png',
    mobileImage: '/optimize/vlektra_mob.png',
    description:
      'Custom-fabricated components, precisely cut, formed, finished, and assembled to specification.',
  },
  {
    clientName: 'KINGS GROUP',
    clientLogo: '/optimize/king.png',
    heading1: 'KINGS GROUP',
    heading2: 'PROJECT',
    image: '/optimize/kings.png',
    mobileImage: '/optimize/kings_mob.png',
    description:
      'Custom laser-cut panels and decorative metal elements, fabricated to project specifications and ready for installation.',
  },
  {
    clientName: 'SHAMS POWER',
    clientLogo: '/optimize/shams2.png',
    heading1: 'SHAMS POWER',
    heading2: 'PROJECT',
    image: '/optimize/shams1.png',
    mobileImage: '/optimize/shams_mob.png',
    description:
      'Custom-fabricated metal components developed to meet specific solar installation requirements.',
  },
    {
    clientName: 'MALIR INDUSTRIAL PARK',
    clientLogo: '/optimize/mip_w.png',
    heading1: 'MALIR INDUSTRIAL PARK',
    heading2: 'PROJECT',
    image: '/optimize/mip_4.png',
    mobileImage: '/optimize/mip_2.jpg',
    description:
      'Custom-fabricated architectural signage, precisely engineered, cut, finished, and assembled for on-site installation.',
  },
]

// ------------------------------------------------------------
// TIMING — share of scroll for each part (bigger = more scroll)
// ------------------------------------------------------------
//  [ intro ][ content ][ hold ][ slide ] → [ intro ][ content ][ hold ][ slide ] → ...
const TIMING = {
  intro: 0.25,  // wait on the centred titles before the image starts growing
  content: 1,   // image reveal + titles + description of one project
  hold: 0.35,   // pause on the full image + description before moving
  slide: 1,     // the move to the next screen
}

// Phases INSIDE the content part (0 → 1)
const PHASE = {
  reveal: [0, 0.75],      // image grows from centre, titles push apart
  titleOut: [0.6, 0.75],  // titles fade out as they reach the edges
  descIn: [0.75, 1],      // description fades in over the full image
}

// ------------------------------------------------------------
// LENIS — the scroll of this section
// ------------------------------------------------------------
const LENIS = {
  vhPerUnit: 100,       // screen-heights of scroll per TIMING unit (raise = slower)
  lerp: 0.08,           // smoothness: lower = lazier (0.05), higher = tighter (0.15)
  wheelMultiplier: 1,   // desktop wheel speed (lower = slower)
  touchMultiplier: 1,   // mobile swipe speed  (lower = slower)
  syncTouchLerp: 0.06,  // mobile smoothness after the finger lifts
}

// Swipe distance (px) at the top / bottom that leaves the section
// (down at the top → hero, up at the bottom → contact)
const EXIT_SWIPE = 60

// Screens at or below this width use mobileImage
const MOBILE_BREAKPOINT = 768

const N = PROJECTS.length
const BLOCK = TIMING.intro + TIMING.content + TIMING.hold + TIMING.slide
const TOTAL_UNITS =
  N * (TIMING.intro + TIMING.content) + (N - 1) * (TIMING.hold + TIMING.slide)

const CLOSED = 'inset(50% 50% 50% 50%)'
const OPEN = 'inset(0% 0% 0% 0%)'

export default function Projects({ active = false, onExitTop, onExitBottom }) {
  const scrollerRef = useRef(null)
  const contentRef = useRef(null)
  const stageRef = useRef(null)
  const trackRef = useRef(null)
  const layersRef = useRef([])

  const lenisRef = useRef(null)
  const activeRef = useRef(active)
  const onExitTopRef = useRef(onExitTop)
  const onExitBottomRef = useRef(onExitBottom)

  useEffect(() => {
    onExitTopRef.current = onExitTop
    onExitBottomRef.current = onExitBottom
  })

  // ----- Build timeline + Lenis once -----
  useEffect(() => {
    const scroller = scrollerRef.current
    const content = contentRef.current
    let tl

    const ctx = gsap.context(() => {
      tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })

      const c = TIMING.content
      const [r0, r1] = PHASE.reveal
      const [t0, t1] = PHASE.titleOut
      const [d0, d1] = PHASE.descIn

      layersRef.current.forEach((layer, i) => {
        if (!layer) return
        const { image, top, bottom, desc } = layer
        const start = i * BLOCK + TIMING.intro

        tl.fromTo(
          image,
          { clipPath: CLOSED },
          { clipPath: OPEN, duration: (r1 - r0) * c, ease: 'power2.inOut' },
          start + r0 * c
        )
        tl.fromTo(
          top,
          { y: 0 },
          { y: () => -window.innerHeight * 0.5, duration: (r1 - r0) * c, ease: 'power2.inOut' },
          start + r0 * c
        )
        tl.fromTo(
          bottom,
          { y: 0 },
          { y: () => window.innerHeight * 0.5, duration: (r1 - r0) * c, ease: 'power2.inOut' },
          start + r0 * c
        )
        tl.fromTo(
          [top, bottom],
          { opacity: 1 },
          { opacity: 0, duration: (t1 - t0) * c },
          start + t0 * c
        )
        tl.fromTo(
          desc,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: (d1 - d0) * c, ease: 'power2.out' },
          start + d0 * c
        )

        if (i < N - 1) {
          tl.to(
            trackRef.current,
            { yPercent: -100 * (i + 1), duration: TIMING.slide, ease: 'power2.inOut' },
            start + c + TIMING.hold
          )
        }
      })

      tl.progress(0)
    }, stageRef)

    // Lenis scrolls ONLY inside this section
    const lenis = new Lenis({
      wrapper: scroller,
      content,
      lerp: LENIS.lerp,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: LENIS.syncTouchLerp,
      wheelMultiplier: LENIS.wheelMultiplier,
      touchMultiplier: LENIS.touchMultiplier,
    })
    lenisRef.current = lenis
    lenis.stop() // waits until the section has fully slid in

    // Lenis scroll position → timeline progress
    lenis.on('scroll', ({ progress }) => {
      tl.progress(Math.max(0, Math.min(1, progress || 0)))
    })

    // Drive Lenis from GSAP's ticker (same frame loop as the animations)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)

    // ----- Leaving the section: up to the hero / down to the contact -----
    // Small tolerance so the exit doesn't wait for Lenis to settle the last pixels
    const EDGE = 8
    const atTop = () => lenis.scroll <= EDGE
    const atBottom = () => lenis.scroll >= lenis.limit - EDGE

    const handleWheel = (e) => {
      if (!activeRef.current) return
      // Top: still wait for Lenis to stop, so a fast scroll-up doesn't jump to the hero
      if (e.deltaY < -2 && atTop() && !lenis.isScrolling) {
        onExitTopRef.current?.()
      } else if (e.deltaY > 2 && atBottom()) {
        // Bottom: go straight to the contact, no extra scrolls needed
        onExitBottomRef.current?.()
      }
    }

    let touchStartY = 0
    let startedAtTop = false
    let startedAtBottom = false
    let exitFired = false

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
      startedAtTop = atTop()
      startedAtBottom = atBottom()
      exitFired = false
    }

    const handleTouchMove = (e) => {
      if (!activeRef.current || exitFired) return
      const moved = e.touches[0].clientY - touchStartY

      if (startedAtTop && moved > EXIT_SWIPE) {
        exitFired = true
        onExitTopRef.current?.()
      } else if (startedAtBottom && moved < -EXIT_SWIPE) {
        exitFired = true
        onExitBottomRef.current?.()
      }
    }

    const handleResize = () => {
      lenis.resize()
      const p = tl.progress()
      tl.invalidate().progress(p)
    }

    scroller.addEventListener('wheel', handleWheel, { passive: true })
    scroller.addEventListener('touchstart', handleTouchStart, { passive: true })
    scroller.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      scroller.removeEventListener('wheel', handleWheel)
      scroller.removeEventListener('touchstart', handleTouchStart)
      scroller.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', handleResize)
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
      ctx.revert()
    }
  }, [])

  // ----- Start / stop Lenis when the page hands over control -----
  useEffect(() => {
    activeRef.current = active
    const lenis = lenisRef.current
    if (!lenis) return
    if (active) lenis.start()
    else lenis.stop()
  }, [active])

  const setRef = (i, key) => (el) => {
    if (!layersRef.current[i]) layersRef.current[i] = {}
    layersRef.current[i][key] = el
  }

  return (
    <div className="projects_scroller" ref={scrollerRef}>
      <div
        className="projects_content"
        ref={contentRef}
        style={{ height: `${100 + TOTAL_UNITS * LENIS.vhPerUnit}dvh` }}
      >
        <div className="all_projects_main" ref={stageRef}>
          <div className="projects_track" ref={trackRef}>
            {PROJECTS.map((project, i) => (
              <section
                className="project_screen"
                style={{ top: `${i * 100}%` }}
                key={i}
              >
                <div className="project_image_wrap" ref={setRef(i, 'image')}>
                  <picture>
                    {project.mobileImage && (
                      <source
                        media={`(max-width: ${MOBILE_BREAKPOINT}px)`}
                        srcSet={project.mobileImage}
                      />
                    )}
                    <img
                      className="project_image"
                      src={project.image}
                      alt={`${project.heading1} ${project.heading2}`}
                      draggable={false}
                    />
                  </picture>

                  <div className="project_desc" ref={setRef(i, 'desc')}>
                    {project.clientLogo && (
                      <img
                        className="project_client_logo"
                        src={project.clientLogo}
                        alt={project.clientName}
                        style={{ height: '50px', width: 'auto' }}
                        draggable={false}
                      />
                    )}
                    <p>{project.description}</p>
                  </div>
                </div>

                <div className="project_titles">
                  <h2 className={i===3 ? "heading_1_ptp small" : "heading_1_ptp"} ref={setRef(i, 'top')}>
                    {project.heading1}
                  </h2>
                  <h2 className="heading_2_ptp" ref={setRef(i, 'bottom')}>
                    {project.heading2}
                  </h2>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}