'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './style.css'

const APPLICATIONS_DATA = [
  {
    tag: '01 — CONSTRUCTION & INFRASTRUCTURE',
    title: 'BUILT FOR THE STRUCTURES THAT <span>KEEP PROJECTS MOVING.</span>',
    desc: 'From structural steel and support frames to railings, access systems and site metalwork, Forgentis provides fabricated components designed to integrate into demanding construction projects.',
    listTitle: 'WE FABRICATE:',
    items: [
      'Structural steel',
      'Frames & supports',
      'Railings & staircases',
      'Access metalwork',
      'Brackets & assemblies',
      'Custom structural components',
    ],
    footer: 'PRECISION THAT FITS. FABRICATION THAT STAYS ON SCHEDULE.',
    button: {
      label: 'DISCUSS A CONSTRUCTION PROJECT',
      onClick: () => console.log('Construction Clicked'),
    },
    image: {
      src: '/optimize/industries/Industries1.png',
      speed: 0.14,
      innerSpeed: 0.1,
    },
  },
  {
    tag: '02 — ARCHITECTURE & INTERIOR',
    title: 'WHERE ENGINEERING <span>MEETS DESIGN.</span>',
    desc: 'Architectural metalwork has to perform technically while meeting the visual intent of the design. Forgentis works from architectural drawings and specifications to create detailed metal elements that bring spaces and facades to life.',
    listTitle: 'WE FABRICATE:',
    items: [
      'Laser-cut screens',
      'Facades & cladding',
      'Feature staircases',
      'Decorative panels',
      'Architectural railings',
      'Custom feature elements',
    ],
    footer: 'From clean contemporary finishes to highly detailed fabrication, every element is built around the design requirement.',
    button: {
      label: 'EXPLORE ARCHITECTURAL WORK',
      onClick: () => console.log('Architecture Clicked'),
    },
    image: {
      src: '/optimize/industries/Industries2.png',
      speed: 0.14,
      innerSpeed: 0.1,
    },
  },
  {
    tag: '03 — INDUSTRIAL & MANUFACTURING',
    title: 'BUILT TO WORK. <span>BUILT TO LAST.</span>',
    desc: 'Industrial fabrication demands more than appearance. Components need to handle load, perform consistently and integrate correctly into the wider system. Forgentis manufactures engineered metal components and assemblies for industrial environments where reliability matters.',
    listTitle: 'WE FABRICATE:',
    items: [
      'Machine frames',
      'Platforms',
      'Guards & enclosures',
      'Brackets',
      'Structural components',
      'Custom assemblies',
    ],
    footer: 'ENGINEERED FOR THE APPLICATION. FABRICATED FOR PERFORMANCE.',
    button: {
      label: 'DISCUSS AN INDUSTRIAL REQUIREMENT',
      onClick: () => console.log('Industrial Clicked'),
    },
    image: {
      src: '/optimize/industries/Industries3.png',
      speed: 0.14,
      innerSpeed: 0.1,
    },
  },
  {
    tag: '04 — RETAIL & COMMERCIAL',
    title: 'METALWORK DESIGNED FOR THE <span>CUSTOMER EXPERIENCE.</span>',
    desc: 'Commercial environments demand precision, consistency and finish. From a single flagship space to a multi-location rollout, Forgentis provides fabricated metalwork designed to meet the visual and practical requirements of commercial projects.',
    listTitle: 'WE FABRICATE:',
    items: [
      'Shopfront elements',
      'Display fixtures',
      'Signage frames',
      'Reception features',
      'Feature structures',
      'Fit-out metalwork',
    ],
    footer: 'ONE FABRICATION PARTNER. CONSISTENT RESULTS ACROSS EVERY LOCATION.',
    image: {
      src: '/optimize/industries/retail_and_com.png',
      speed: 0.14,
      innerSpeed: 0.1,
    },
  },
  {
    tag: '05 — HOSPITALITY',
    title: 'DESIGNED TO BE SEEN. <span>BUILT TO BE USED.</span>',
    desc: 'Hotels, restaurants and hospitality spaces demand metalwork that combines visual impact with durability. Forgentis produces architectural and decorative metal elements designed to withstand daily use while maintaining their intended finish.',
    listTitle: 'WE FABRICATE:',
    items: [
      'Feature metalwork',
      'Screens & partitions',
      'Railings',
      'Fixtures',
      'Decorative elements',
      'Custom architectural pieces',
    ],
    footer: 'PVD, brushed stainless and other finishing options allow the final fabrication to complement the design intent.',
    image: {
      src: '/optimize/industries/Industries4.png',
      speed: 0.14,
      innerSpeed: 0.1,
    },
  },
  {
    tag: '06 — AUTOMOTIVE & ENGINEERING',
    title: 'PRECISION FOR APPLICATIONS THAT <span>DEMAND IT.</span>',
    desc: 'Automotive and engineering projects often require repeatable components, controlled dimensions and fabrication that integrates precisely into a larger system. Forgentis works from drawings, specifications and application requirements to produce components and assemblies built for consistency.',
    listTitle: 'WE FABRICATE:',
    items: [
      'Brackets',
      'Frames',
      'Machine components',
      'Custom parts',
      'Engineered assemblies',
      'Production components',
    ],
    footer: 'PRECISION. REPEATABILITY. CONTROL.',
    image: {
      src: '/optimize/industries/Industries5.png',
      speed: 0.14,
      innerSpeed: 0.1,
    },
  },
  {
    tag: '07 — ENERGY & SOLAR',
    title: 'BUILT FOR DEMANDING <span>ENVIRONMENTS.</span>',
    desc: 'Energy and solar applications require metalwork designed to withstand outdoor exposure and demanding operating conditions. Forgentis fabricates mounting structures, frames, brackets and enclosures around the requirements of the application.',
    listTitle: 'WE FABRICATE:',
    items: [
      'Mounting structures',
      'Frames',
      'Brackets',
      'Enclosures',
      'Support assemblies',
      'Custom components',
    ],
    footer: 'Material selection, fabrication and finishing are considered together to create solutions designed for long-term performance.',
    image: {
      src: '/optimize/industries/Industries6.png',
      speed: 0.14,
      innerSpeed: 0.1,
    },
  }
  ,
  {
    tag: 'SPECIALIZED & CUSTOM APPLICATIONS',
    title: "DON'T SEE YOUR <span>INDUSTRY?</span>",
    desc: "Our capabilities aren't limited to a predefined list of sectors. If you have a drawing, prototype, sample or fabrication challenge, bring it to us. We'll assess the requirement, determine whether it fits our capabilities and recommend the most practical fabrication approach.",
    footer: 'YOUR INDUSTRY MAY BE DIFFERENT. THE REQUIREMENT IS STILL METAL.',
    button: {
      label: 'TALK TO OUR TEAM',
      onClick: () => console.log('Team Clicked'),
    }
    // ,
    // image: {
    //   src: '/images/capability1.png',
    //   speed: 0.14,
    //   innerSpeed: 0.1,
    // },
  },
]

export default function InsustriesSection({
  data = APPLICATIONS_DATA,
  progressEventName = 'capabilityProgress',
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

    // Track translation quickTo
    trackSetter.current = gsap.quickTo(trackRef.current, 'y', {
      duration: 1.1,
      ease: 'power3.out',
    })

    // Outer Image Container Parallax quickTo
    imageSetters.current = imageRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'y', { duration: 1.3, ease: 'power3.out' }) : null
    )

    // Inner <img> tag translation quickTo (internal scroll)
    innerImgSetters.current = innerImgRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }) : null
    )

    // Content Block Parallax quickTo
    contentSetters.current = contentRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }) : null
    )

    // Initial reset
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
        const localOffset = y - panelIndex * vh.current

        // Image container parallax
        const cSetter = imageSetters.current[pIndex]
        if (cSetter) cSetter(-localOffset * (item.image?.speed || 0.14))

        // Inner img element parallax
        const iSetter = innerImgSetters.current[pIndex]
        const innerSpeed = item.image?.innerSpeed || 0.1
        if (iSetter) iSetter(localOffset * innerSpeed)

        // Content panel parallax
        const tSetter = contentSetters.current[pIndex]
        if (tSetter) tSetter(-localOffset * 0.08)
      })

      const newIndex = Math.round(y / (vh.current || 1))
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
      {/* Counter */}
      <div className="app_counter">
        <span className="app_counter_current">
          {String(activeIndex).padStart(2, '0')}
        </span>
        <span className="app_counter_divider" />
        <span className="app_counter_total">
          {String(totalPanels - 1).padStart(2, '0')}
        </span>
      </div>

      {/* Main Track */}
      <div className="app_track" ref={trackRef}>
        {/* Intro Panel */}
        <div className="app_panel app_intro_panel">
          <h2 className="app_intro_title">
            DIFFERENT APPLICATIONS. <span>SAME STANDARD.</span>
          </h2>
          <p className="app_intro_desc">
            Every industry has its own challenges. A structural component has
            different demands from an architectural feature. A production part
            requires different controls from a hospitality installation.
          </p>
          <div className="app_intro_bullets">
            <span>Understand the requirement.</span>
            <span>Engineer the approach.</span>
            <span>Fabricate to specification.</span>
          </div>
        </div>

        {/* 1-Image Alternating Panels */}
        {data.map((item, pIndex) => {
          const isReversed = pIndex % 2 !== 0 // Even index: Image Left, Odd index: Image Right

          return (
            <div
  key={pIndex}
  className={`app_panel app_item_panel ${
    item.image ? (isReversed ? 'row_reverse' : '') : 'no_image_panel'
  }`}
>
             {/* Single Parallax Image (only if image exists) */}
{item.image && (
  <div
    ref={(el) => (imageRefs.current[pIndex] = el)}
    className="app_image_wrap"
  >
    <img
      ref={(el) => (innerImgRefs.current[pIndex] = el)}
      src={item.image.src}
      alt={item.tag}
    />
  </div>
)}

              {/* Side Content Block */}
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

                {item.button && (
                  <button
                    type="button"
                    className="app_action_btn"
                    onClick={item.button.onClick}
                  >
                    <span>{item.button.label}</span>
                    <span className="app_btn_arrow">→</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}