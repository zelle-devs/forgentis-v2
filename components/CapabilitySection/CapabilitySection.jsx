'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import './CapabilitySection.css';
import Link from 'next/link';

function CapabilitySection({
  POINTS = [],
  visiblePoints, // ✅ NEW: kitne points dikhane hain (0 = koi nahi). Na do to sab dikhenge
  heading_1,
  heading_2,
  paragraph,
  buttonText, // ✅ CTA text (optional)
  buttonHref, // ✅ CTA link (optional) — dono hon tabhi button dikhega
}) {
  const showIntroCta = Boolean(buttonText && buttonHref)

  // ===== Points normalize =====
  // visiblePoints = 0  -> koi point panel nahi
  // visiblePoints = 2  -> sirf pehle 2
  // undefined          -> saare POINTS
  const points = useMemo(() => {
    const list = Array.isArray(POINTS) ? POINTS : []
    const count =
      typeof visiblePoints === 'number'
        ? Math.max(0, Math.min(visiblePoints, list.length))
        : list.length
    return list.slice(0, count)
  }, [POINTS, visiblePoints])

  const hasPoints = points.length > 0
  // ✅ TOTAL_PANELS ab khud calculate hota hai: 1 intro + points
  const totalPanels = points.length + 1
  const totalImages = points.reduce((acc, p) => acc + (p.images?.length || 0), 0)

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
  const [isMobile, setIsMobile] = useState(false)

  // ===== Mobile detection =====
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // ===== Setup (points change hon to dobara chalega) =====
  useEffect(() => {
    // Purane refs jo ab render nahi ho rahe, hata do
    imageRefs.current.length = totalImages
    innerImgRefs.current.length = totalImages
    descRefs.current.length = points.length
    btnRefs.current.length = points.length

    const getRawVh = () =>
      window.visualViewport?.height ||
      window.innerHeight ||
      document.documentElement.clientHeight

    const getPanelHeight = () =>
      window.innerWidth <= 768 ? getRawVh() * 0.75 : getRawVh()

    vh.current = getPanelHeight()

    const isMob = window.innerWidth <= 768
    const trackDur = isMob ? 0.35 : 1.1
    const imgDur = isMob ? 0.35 : 1.3
    const innerDur = isMob ? 0.35 : 1.4
    const descDur = isMob ? 0.3 : 1.2

    trackSetter.current = trackRef.current
      ? gsap.quickTo(trackRef.current, 'y', { duration: trackDur, ease: 'power3.out' })
      : null

    const makeSetters = (els, dur) =>
      els.map((el) =>
        el ? gsap.quickTo(el, 'y', { duration: dur, ease: 'power3.out' }) : null
      )

    imageSetters.current = makeSetters(imageRefs.current, imgDur)
    innerImgSetters.current = makeSetters(innerImgRefs.current, innerDur)
    descSetters.current = makeSetters(descRefs.current, descDur)
    btnSetters.current = makeSetters(btnRefs.current, descDur)

    // Initial reset
    trackRef.current && gsap.set(trackRef.current, { y: 0 })
    ;[imageRefs, innerImgRefs, descRefs, btnRefs].forEach((r) =>
      r.current.forEach((el) => el && gsap.set(el, { y: 0 }))
    )

    scrollTarget.current = 0
    activeIndexRef.current = 0
    setActiveIndex(0)

    const handleResize = () => {
      vh.current = getPanelHeight()
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [points, totalImages])

  // ===== Scroll apply =====
  useEffect(() => {
    // ✅ Koi point nahi -> scroll listen hi mat karo, track y:0 pe rahega
    if (!hasPoints) return

    const applyScroll = () => {
      const y = scrollTarget.current
      trackSetter.current?.(-y)

      let flatImageIndex = 0
      points.forEach((point, pIndex) => {
        const panelIndex = pIndex + 1
        const localOffset = y - panelIndex * vh.current
        const isMobileNow = window.innerWidth <= 768

        point.images?.forEach((img) => {
          const containerSetter = imageSetters.current[flatImageIndex]
          const internalImgSetter = innerImgSetters.current[flatImageIndex]

          // Container — mobile pe fixed, desktop pe parallax
          containerSetter?.(isMobileNow ? 0 : -localOffset * img.speed)

          // Inner <img> — dono pe move (overflow:hidden se clipped)
          const innerSpeed = img.innerSpeed ?? img.speed * 0.7
          internalImgSetter?.(localOffset * innerSpeed)

          flatImageIndex++
        })

        if (point.description) {
          const descSpeed = point.descPos?.speed ?? 0.08
          descSetters.current[pIndex]?.(-localOffset * descSpeed)
        }

        if (point.button) {
          const btnSpeed = point.button.pos?.speed ?? point.descPos?.speed ?? 0.08
          btnSetters.current[pIndex]?.(-localOffset * btnSpeed)
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
      const rawVh =
        window.visualViewport?.height ||
        window.innerHeight ||
        document.documentElement.clientHeight
      const panelHeight = window.innerWidth <= 768 ? rawVh * 0.75 : rawVh
      vh.current = panelHeight

      const maxScroll = (totalPanels - 1) * panelHeight
      scrollTarget.current = progress * maxScroll
      applyScroll()
    }

    window.addEventListener('capabilityProgress', handleCapabilityProgress)
    return () =>
      window.removeEventListener('capabilityProgress', handleCapabilityProgress)
  }, [points, totalPanels, hasPoints])

  // Image ka flat index nikalne ke liye
  let flatCounter = 0

  return (
    <div
      ref={wrapperRef}
      className={`capability-section ${!hasPoints ? 'capability-section--no-points' : ''}`}
    >
      {/* ✅ Counter sirf tab jab points hon */}
      {hasPoints && (
        <div className="capability-counter">
          <span className="capability-counter-current">
            {String(activeIndex).padStart(2, '0')}
          </span>
          <span className="capability-counter-divider" />
          <span className="capability-counter-total">
            {String(totalPanels - 1).padStart(2, '0')}
          </span>
        </div>
      )}

      <div className="capability-track" ref={trackRef}>
        {/* Intro panel */}
        <div className="capability-panels capability-intro-panel">
          <h2 className="capability-main-title">
            <span className="title-part-white">
              {heading_1}{' '}
              <span className="title-part-color">{heading_2}</span>
            </span>
          </h2>
          {paragraph && <p className="capability-main-desc">{paragraph}</p>}

          {showIntroCta && (
            <div className="capability-main-cta">
              <a href={buttonHref} className="contact-btn-var-2">
                {buttonText}
              </a>
            </div>
          )}
        </div>

        {/* ✅ Point panels — 0 points = kuch render nahi, koi height nahi */}
        {points.map((point, pIndex) => (
          <div key={point.titleFirst} className="capability-panel">
            {point.images?.map((img) => {
              const flatIndex = flatCounter++
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

            <h2
              className="capability-point-title"
              style={{
                top: isMobile ? point.mobileTitlePos?.top || '52%' : point.titlePos?.top,
                left: isMobile ? point.mobileTitlePos?.left || '6%' : point.titlePos?.left,
                right: isMobile ? point.mobileTitlePos?.right : undefined,
                bottom: isMobile ? point.mobileTitlePos?.bottom : undefined,
              }}
            >
              <span className={point.coloredPart === 'first' ? 'highlight-blue' : 'highlight-white'}>
                {point.titleFirst}
              </span>
              <br />
              <span className={point.coloredPart === 'second' ? 'highlight-blue' : 'highlight-white'}>
                {point.titleSecond}
              </span>
            </h2>

            {point.description && (
              <p
                ref={(el) => (descRefs.current[pIndex] = el)}
                className="capability-point-desc"
                style={{
                  position: 'absolute',
                  top: isMobile
                    ? point.mobileDescPos?.top || '72%'
                    : point.descPos?.top || `calc(${point.titlePos?.top} + 8%)`,
                  left: isMobile
                    ? point.mobileDescPos?.left || '6%'
                    : point.descPos?.left || point.titlePos?.left,
                  maxWidth: isMobile
                    ? point.mobileDescPos?.maxWidth || '85%'
                    : point.descPos?.maxWidth || '400px',
                  ...(!isMobile && point.descPos?.right && { right: point.descPos.right }),
                  ...(!isMobile && point.descPos?.bottom && { bottom: point.descPos.bottom }),
                  ...(isMobile && point.mobileDescPos?.right && { right: point.mobileDescPos.right }),
                  ...(isMobile && point.mobileDescPos?.bottom && { bottom: point.mobileDescPos.bottom }),
                }}
              >
                {point.description}
              </p>
            )}

            {point.button && (
              <button
                type="button"
                ref={(el) => (btnRefs.current[pIndex] = el)}
                className={`capability-point-btn ${point.button.className || ''}`}
                onClick={point.button.onClick}
                style={{
                  position: 'absolute',
                  top: isMobile ? point.button.mobilePos?.top || '86%' : point.button.pos?.top,
                  left: isMobile ? point.button.mobilePos?.left || '6%' : point.button.pos?.left,
                  ...(!isMobile && point.button.pos?.right && { right: point.button.pos.right }),
                  ...(!isMobile && point.button.pos?.bottom && { bottom: point.button.pos.bottom }),
                  ...(isMobile && point.button.mobilePos?.right && { right: point.button.mobilePos.right }),
                  ...(isMobile && point.button.mobilePos?.bottom && { bottom: point.button.mobilePos.bottom }),
                  zIndex: 10,
                }}
              >
                {point.button.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CapabilitySection