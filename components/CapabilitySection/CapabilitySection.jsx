'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './CapabilitySection.css'

function CapabilitySection({
  POINTS,
  TOTAL_PANELS,
  heading_1,
  heading_2,
  paragraph,
}) {
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)
  const imageRefs = useRef([])
  const innerImgRefs = useRef([])
  const descRefs = useRef([])
  const btnRefs = useRef([])

  const trackSetter = useRef(null)
  const imageSetters = useRef([])
  const innerImgSetters = useRef([])
  const descSetters = useRef([])
  const btnSetters = useRef([])

  const scrollTarget = useRef(0)
  const vh = useRef(0)
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    vh.current = window.innerHeight

    // Track smooth quickTo
    trackSetter.current = gsap.quickTo(trackRef.current, 'y', {
      duration: 1.1,
      ease: 'power3.out',
    })

    // Container position quickTo
    imageSetters.current = imageRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'y', { duration: 1.3, ease: 'power3.out' }) : null
    )

    // Inner <img> translation quickTo
    innerImgSetters.current = innerImgRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }) : null
    )

    // Description text quickTo
    descSetters.current = descRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }) : null
    )

    // Action button quickTo
    btnSetters.current = btnRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }) : null
    )

    // Initial reset
    gsap.set(trackRef.current, { y: 0 })
    imageRefs.current.forEach((el) => el && gsap.set(el, { y: 0 }))
    innerImgRefs.current.forEach((el) => el && gsap.set(el, { y: 0 }))
    descRefs.current.forEach((el) => el && gsap.set(el, { y: 0 }))
    btnRefs.current.forEach((el) => el && gsap.set(el, { y: 0 }))

    scrollTarget.current = 0
    activeIndexRef.current = 0
    setActiveIndex(0)

    const handleResize = () => {
      vh.current = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const applyScroll = () => {
      const y = scrollTarget.current
      if (trackSetter.current) trackSetter.current(-y)

      let flatImageIndex = 0
      POINTS.forEach((point, pIndex) => {
        const panelIndex = pIndex + 1
        const localOffset = y - panelIndex * vh.current

        // Image container parallax + internal <img> scroll
        point.images.forEach((img) => {
          const containerSetter = imageSetters.current[flatImageIndex]
          const internalImgSetter = innerImgSetters.current[flatImageIndex]

          if (containerSetter) containerSetter(-localOffset * img.speed)

          const innerSpeed = img.innerSpeed ?? img.speed * 0.7
          if (internalImgSetter) internalImgSetter(localOffset * innerSpeed)

          flatImageIndex++
        })

        // Description parallax
        if (point.description) {
          const descSpeed = point.descPos?.speed ?? 0.08
          const dSetter = descSetters.current[pIndex]
          if (dSetter) dSetter(-localOffset * descSpeed)
        }

        // Button parallax
        if (point.button) {
          const btnSpeed = point.button.pos?.speed ?? point.descPos?.speed ?? 0.08
          const bSetter = btnSetters.current[pIndex]
          if (bSetter) bSetter(-localOffset * btnSpeed)
        }
      })

      const newIndex = Math.round(y / (vh.current || 1))
      if (newIndex !== activeIndexRef.current) {
        activeIndexRef.current = newIndex
        setActiveIndex(newIndex)
      }
    }

    const handleCapabilityProgress = (e) => {
      const progress = e.detail?.progress ?? 0
      const currentVh = vh.current || window.innerHeight
      const maxScroll = (TOTAL_PANELS - 1) * currentVh
      scrollTarget.current = progress * maxScroll
      applyScroll()
    }

    window.addEventListener('capabilityProgress', handleCapabilityProgress)
    return () => window.removeEventListener('capabilityProgress', handleCapabilityProgress)
  }, [POINTS, TOTAL_PANELS])

  return (
    <div ref={wrapperRef} className="capability-section">
      <div className="capability-counter">
        <span className="capability-counter-current">
          {String(activeIndex).padStart(2, '0')}
        </span>
        <span className="capability-counter-divider" />
        <span className="capability-counter-total">
          {String(TOTAL_PANELS - 1).padStart(2, '0')}
        </span>
      </div>

      <div className="capability-track" ref={trackRef}>
        {/* Intro panel */}
        <div className="capability-panels capability-intro-panel">
          <h2 className="capability-main-title">
            <span className="title-part-white">
              {heading_1}{' '}
              <span className="title-part-color">{heading_2}</span>
            </span>
          </h2>
          <p className="capability-main-desc">{paragraph}</p>
        </div>

        {/* Point panels */}
        {POINTS.map((point, pIndex) => {
          const isEven = pIndex % 2 === 0
          return (
            <div key={point.titleFirst} className="capability-panel">
              {point.images.map((img, i) => {
                const flatIndex =
                  POINTS.slice(0, pIndex).reduce(
                    (acc, p) => acc + p.images.length,
                    0
                  ) + i
                return (
                  <div
                    key={img.src}
                    ref={(el) => (imageRefs.current[flatIndex] = el)}
                    className="capability-image"
                    style={{
                      top: img.top,
                      left: img.left,
                      width: img.width,
                      height: img.height,
                    }}
                  >
                    <img
                      ref={(el) => (innerImgRefs.current[flatIndex] = el)}
                      src={img.src}
                      alt={point.titleFirst}
                    />
                  </div>
                )
              })}

              {/* Point Title */}
              <h2
                className="capability-point-title"
                style={{ top: point.titlePos.top, left: point.titlePos.left }}
              >
                <span className={isEven ? 'highlight-white' : 'highlight-blue'}>
                  {point.titleFirst}
                </span>{' '}
                <span className={isEven ? 'highlight-blue' : 'highlight-white'}>
                  {point.titleSecond}
                </span>
              </h2>

              {/* Parallax Description */}
              {point.description && (
                <p
                  ref={(el) => (descRefs.current[pIndex] = el)}
                  className="capability-point-desc"
                  style={{
                    position: 'absolute',
                    top: point.descPos?.top || `calc(${point.titlePos.top} + 8%)`,
                    left: point.descPos?.left || point.titlePos.left,
                    maxWidth: point.descPos?.maxWidth || '400px',
                    ...(point.descPos?.right && { right: point.descPos.right }),
                    ...(point.descPos?.bottom && { bottom: point.descPos.bottom }),
                  }}
                >
                  {point.description}
                </p>
              )}

              {/* Dynamic Action Button */}
              {point.button && (
                <button
                  type="button"
                  ref={(el) => (btnRefs.current[pIndex] = el)}
                  className={`capability-point-btn ${point.button.className || ''}`}
                  onClick={point.button.onClick}
                  style={{
                    position: 'absolute',
                    top: point.button.pos?.top,
                    left: point.button.pos?.left,
                    ...(point.button.pos?.right && { right: point.button.pos.right }),
                    ...(point.button.pos?.bottom && { bottom: point.button.pos.bottom }),
                    zIndex: 10,
                  }}
                >
                  {point.button.label}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CapabilitySection