'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './style.css'

const APPLICATIONS_DATA = [
  {
    title: 'THE RIGHT TOOLS FOR <span>DEMANDING WORK.</span>',
    desc: 'Our facility combines advanced equipment with skilled operators to handle precision components, architectural metalwork, structural fabrication and repeat production.',
    listTitle: 'EQUIPMENT',
    items: [
      'FIBER LASER — Up to 25mm* · 3000 × 1500mm bed',
      'PRESS BRAKE — 250-ton capacity · Up to 4000mm',
      'CNC MACHINING — Precision machining to project requirements',
      'WELDING — MIG · TIG · Spot',
      'FINISHING — PVD · Powder Coating · Brushed & Matte',
    ],
    image: {
      src: '/images/precision2.png',
      speed: 0.14,
      innerSpeed: 0.1,
    },
  },
  {
    title: 'BIG ENOUGH FOR COMPLEX. <span>PRECISE ENOUGH FOR THE DETAIL.</span>',
    desc: "Whether it's a single custom component or a repeat production run, our facility is built to maintain control over dimensions, fabrication and finishing throughout the process.",
    listTitle: 'BUILT AROUND',
    items: [
      'PRECISION — Controlled dimensions.',
      'REPEATABILITY — Consistent production.',
      'QUALITY — Inspection throughout.',
      'CAPACITY — Infrastructure for demanding work.',
    ],
    image: {
      src: '/images/precision3.png',
      speed: 0.14,
      innerSpeed: 0.1,
    },
  },
]

export default function FacilitiesSection({
  data = APPLICATIONS_DATA,
  progressEventName = 'facilitiesProgress', // <-- Fix: Default matched with parent controller
}) {
  const totalPanels = data.length + 1
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)
  const imageRefs = useRef([])
  const innerImgRefs = useRef([])
  const contentRefs = useRef([])

  const trackSetter = useRef(null)
  const imageSetters = useRef([])
  const innerImgSetters = useRef([])
  const contentSetters = useRef([])

  const scrollTarget = useRef(0)
  const vh = useRef(0)
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    vh.current = window.innerHeight

    trackSetter.current = gsap.quickTo(trackRef.current, 'y', {
      duration: 0.4,
      ease: 'power2.out',
    })

    imageSetters.current = imageRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power2.out' }) : null
    )

    innerImgSetters.current = innerImgRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power2.out' }) : null
    )

    contentSetters.current = contentRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' }) : null
    )

    gsap.set(trackRef.current, { y: 0 })
    imageRefs.current.forEach((el) => el && gsap.set(el, { y: 0 }))
    innerImgRefs.current.forEach((el) => el && gsap.set(el, { y: 0 }))
    contentRefs.current.forEach((el) => el && gsap.set(el, { y: 0 }))

    scrollTarget.current = 0
    activeIndexRef.current = 0
    setActiveIndex(0)

    const handleResize = () => {
      vh.current = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [data.length])

  useEffect(() => {
    const applyScroll = () => {
      const y = scrollTarget.current
      if (trackSetter.current) trackSetter.current(-y)

      data.forEach((item, pIndex) => {
        const panelIndex = pIndex + 1
        const localOffset = y - panelIndex * (vh.current || window.innerHeight)

        const cSetter = imageSetters.current[pIndex]
        if (cSetter) cSetter(-localOffset * (item.image?.speed || 0.14))

        const iSetter = innerImgSetters.current[pIndex]
        const innerSpeed = item.image?.innerSpeed || 0.1
        if (iSetter) iSetter(localOffset * innerSpeed)

        const tSetter = contentSetters.current[pIndex]
        if (tSetter) tSetter(-localOffset * 0.08)
      })

      const newIndex = Math.min(
        totalPanels - 1,
        Math.max(0, Math.round(y / (vh.current || window.innerHeight || 1)))
      )
      if (newIndex !== activeIndexRef.current) {
        activeIndexRef.current = newIndex
        setActiveIndex(newIndex)
      }
    }

    const handleProgress = (e) => {
      const progress = e.detail?.progress ?? 0
      const currentVh = vh.current || window.innerHeight
      const maxScroll = (totalPanels - 1) * currentVh
      scrollTarget.current = progress * maxScroll
      applyScroll()
    }

    window.addEventListener(progressEventName, handleProgress)
    return () => window.removeEventListener(progressEventName, handleProgress)
  }, [data, totalPanels, progressEventName])

  return (
    <div ref={wrapperRef} className="app_section">
      <div className="app_counter">
        <span className="app_counter_current">
          {String(activeIndex).padStart(2, '0')}
        </span>
        <span className="app_counter_divider" />
        <span className="app_counter_total">
          {String(totalPanels - 1).padStart(2, '0')}
        </span>
      </div>

      <div className="app_track" ref={trackRef}>
        {/* Panel 0: Intro */}
        <div className="app_panel app_intro_panel">
          <h2 className="app_intro_title">
            ONE FACILITY. <span>COMPLETE CONTROL</span>
          </h2>
          <p className="app_intro_desc">
            From cutting and forming to machining, welding, finishing and inspection, our production floor is designed to keep the entire fabrication process connected.
          </p>
          <div className="app_intro_bullets">
            <span>CUT</span>
            <span>FORM</span>
            <span>MACHINE</span>
            <span>WELD</span>
            <span>FINISH</span>
            <span>CHECK</span>
            <span>DELIVER</span>
          </div>
        </div>

        {/* Panel 1 & 2: Items */}
        {data.map((item, pIndex) => {
          const isReversed = pIndex % 2 !== 0

          return (
            <div
              key={pIndex}
              className={`app_panel app_item_panel ${
                isReversed ? 'row_reverse' : ''
              }`}
            >
              <div
                ref={(el) => (imageRefs.current[pIndex] = el)}
                className="app_image_wrap"
              >
                <img
                  ref={(el) => (innerImgRefs.current[pIndex] = el)}
                  src={item.image.src}
                  alt={item.title?.replace(/<[^>]*>/g, '') || 'facility image'}
                />
              </div>

              <div
                ref={(el) => (contentRefs.current[pIndex] = el)}
                className="app_content_wrap"
              >
                {item.tag && <span className="app_tag">{item.tag}</span>}

                <h3
                  className="app_title"
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />

                <p className="app_desc">{item.desc}</p>

                {item.items && (
                  <div className="app_list_wrap">
                    {item.listTitle && (
                      <span className="app_list_title">{item.listTitle}</span>
                    )}
                    <div className="app_items_grid">
                      {item.items.map((it, idx) => (
                        <div key={idx} className="app_badge">
                          {it}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.footer && (
                  <div className="app_footer_statement">{item.footer}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}