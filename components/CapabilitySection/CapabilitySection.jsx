'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './CapabilitySection.css'

const POINTS = [
  {
    titleFirst: 'PRECISION',
    titleSecond: 'IN METAL',
    coloredPart: 'second', // Doosra word blue color ka hoga
    images: [
      { src: '/images/precision1.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
      { src: '/images/precision3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
      { src: '/images/precision2.png', top: '-20%', left: '44%', width: '40%', height: '60%', speed: 0.22 },
    ],
    titlePos: { top: '70%', left: '4%' },
  },
  {
    titleFirst: 'FULL',
    titleSecond: 'CAPABILITY',
    coloredPart: 'second',
    // images: [
    //   { src: '/images/1-c.png', top: '10%', left: '48%', width: '36%', height: '52%', speed: 0.18 },
    //   { src: '/images/1-d.webp', top: '54%', left: '10%', width: '26%', height: '36%', speed: 0.1 },
    // ],
    images: [
      { src: '/images/capability1.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
      { src: '/images/capability3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
      { src: '/images/capability2.png', top: '-20%', left: '44%', width: '40%', height: '60%', speed: 0.22 },
    ],
    // titlePos: { top: '14%', left: '36%' },
    titlePos: { top: '70%', left: '4%' },
  },
  {
    titleFirst: 'TOTAL',
    titleSecond: 'CONTROL',
    coloredPart: 'second',
    // images: [
    //   { src: '/images/1-a.png', top: '14%', left: '10%', width: '26%', height: '64%', speed: 0.14 },
    //   { src: '/images/1-b.png', top: '10%', left: '60%', width: '30%', height: '34%', speed: 0.2 },
    // ],
    images: [
      { src: '/images/control1.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
      { src: '/images/control3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
      { src: '/images/control2.png', top: '-20%', left: '44%', width: '40%', height: '60%', speed: 0.22 },
    ],
    // titlePos: { top: '16%', left: '18%' },
titlePos: { top: '70%', left: '4%' },
  },
  {
    titleFirst: 'EXPERT',
    titleSecond: 'CRAFT',
    coloredPart: 'second',
    // images: [
    //   { src: '/images/1-c.png', top: '50%', left: '8%', width: '30%', height: '42%', speed: 0.16 },
    //   { src: '/images/1-d.webp', top: '8%', left: '44%', width: '34%', height: '48%', speed: 0.1 },
    // ],
     images: [
      { src: '/images/craft1.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
      { src: '/images/craft3.png', top: '46%', left: '50%', width: '45%', height: '50%', speed: 0.22 },
      { src: '/images/craft2.png', top: '-20%', left: '44%', width: '40%', height: '60%', speed: 0.22 },
    ],
    // titlePos: { top: '4%', left: '44%' },
    titlePos: { top: '70%', left: '4%' },
  },
]

const TOTAL_PANELS = POINTS.length + 1

function CapabilitySection() {
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)
  const imageRefs = useRef([])
  const trackSetter = useRef(null)
  const imageSetters = useRef([])

  const scrollTarget = useRef(0)
  const vh = useRef(0)
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    vh.current = window.innerHeight

    trackSetter.current = gsap.quickTo(trackRef.current, 'y', {
      duration: 1.1,
      ease: 'power3.out',
    })

    imageSetters.current = imageRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'y', { duration: 1.3, ease: 'power3.out' }) : null
    )

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

      let flatIndex = 0
      POINTS.forEach((point, pIndex) => {
        const panelIndex = pIndex + 1
        point.images.forEach((img) => {
          const localOffset = y - panelIndex * vh.current
          const setter = imageSetters.current[flatIndex]
          if (setter) setter(-localOffset * img.speed)
          flatIndex++
        })
      })

      const newIndex = Math.round(y / vh.current)
      if (newIndex !== activeIndexRef.current) {
        activeIndexRef.current = newIndex
        setActiveIndex(newIndex)
      }
    }

    const handleWheel = (e) => {
      const maxScroll = (TOTAL_PANELS - 1) * vh.current
      scrollTarget.current = Math.max(0, Math.min(maxScroll, scrollTarget.current + e.deltaY))
      applyScroll()
    }

    const node = wrapperRef.current
    if (!node) return
    node.addEventListener('wheel', handleWheel, { passive: true })
    return () => node.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div ref={wrapperRef} className="capability-section">
      <div className="capability-counter">
        <span className="capability-counter-current">{String(activeIndex).padStart(2, '0')}</span>
        <span className="capability-counter-divider" />
        <span className="capability-counter-total">{String(TOTAL_PANELS - 1).padStart(2, '0')}</span>
      </div>

      <div className="capability-track" ref={trackRef}>
        {/* Intro panel */}
        <div className="capability-panels capability-intro-panel">
          <h2 className="capability-main-title">
            <span className="title-part-white">BUILT BEYOND THE <span className="title-part-color">STANDARD</span></span>{' '}
            
          </h2>
          <p className="capability-main-desc">
           We don't just fabricate what's been done before.
            We take drawings,
            specifications and ambitious requirements — and turn them into
            metalwork built to perform.
          </p>
        </div>

        {/* Point panels */}
        {POINTS.map((point, pIndex) => {
          // Alternate point colors: Even indexes white first, Odd indexes blue first (ya jo bhi aap chaho)
          const isEven = pIndex % 2 === 0
          return (
            <div key={point.titleFirst} className="capability-panel">
              {point.images.map((img, i) => {
                const flatIndex =
                  POINTS.slice(0, pIndex).reduce((acc, p) => acc + p.images.length, 0) + i
                return (
                  <div
                    key={img.src}
                    ref={(el) => (imageRefs.current[flatIndex] = el)}
                    className="capability-image"
                    style={{ top: img.top, left: img.left, width: img.width, height: img.height }}
                  >
                    <img src={img.src} alt={point.titleFirst} />
                  </div>
                )
              })}

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
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CapabilitySection




// 'use client'
// import { useEffect, useRef, useState } from 'react'
// import gsap from 'gsap'
// import './CapabilitySection.css'

// const POINTS = [
//   {
//     title: 'PRECISION',
//     images: [
//       { src: '/images/1-a.png', top: '8%', left: '6%', width: '34%', height: '56%', speed: 0.12 },
//       { src: '/images/1-b.png', top: '46%', left: '54%', width: '28%', height: '40%', speed: 0.22 },
//     ],
//     titlePos: { top: '60%', left: '4%' },
//   },
//   {
//     title: 'CAPABILITY',
//     images: [
//       { src: '/images/1-c.png', top: '10%', left: '48%', width: '36%', height: '52%', speed: 0.18 },
//       { src: '/images/1-d.webp', top: '54%', left: '10%', width: '26%', height: '36%', speed: 0.1 },
//     ],
//     titlePos: { top: '4%', left: '6%' },
//   },
//   {
//     title: 'CONTROL',
//     images: [
//       { src: '/images/1-a.png', top: '14%', left: '10%', width: '26%', height: '64%', speed: 0.14 },
//       { src: '/images/1-b.png', top: '10%', left: '60%', width: '30%', height: '34%', speed: 0.2 },
//     ],
//     titlePos: { top: '56%', left: '8%' },
//   },
//   {
//     title: 'CRAFT',
//     images: [
//       { src: '/images/1-c.png', top: '50%', left: '8%', width: '30%', height: '42%', speed: 0.16 },
//       { src: '/images/1-d.webp', top: '8%', left: '44%', width: '34%', height: '48%', speed: 0.1 },
//     ],
//     titlePos: { top: '4%', left: '44%' },
//   },
// ]

// const TOTAL_PANELS = POINTS.length + 1 // +1 intro panel ke liye

// function CapabilitySection() {
//   const wrapperRef = useRef(null)
//   const trackRef = useRef(null)
//   const imageRefs = useRef([]) // flattened, 2 per point
//   const trackSetter = useRef(null)
//   const imageSetters = useRef([])

//   const scrollTarget = useRef(0)
//   const vh = useRef(0)
//   const activeIndexRef = useRef(0)
//   const [activeIndex, setActiveIndex] = useState(0)

//   useEffect(() => {
//     vh.current = window.innerHeight

//     trackSetter.current = gsap.quickTo(trackRef.current, 'y', {
//       duration: 1.1,
//       ease: 'power3.out',
//     })

//     imageSetters.current = imageRefs.current.map((el) =>
//       el ? gsap.quickTo(el, 'y', { duration: 1.3, ease: 'power3.out' }) : null
//     )

//     const handleResize = () => {
//       vh.current = window.innerHeight
//     }
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   useEffect(() => {
//     const applyScroll = () => {
//       const y = scrollTarget.current
//       if (trackSetter.current) trackSetter.current(-y)

//       let flatIndex = 0
//       POINTS.forEach((point, pIndex) => {
//         const panelIndex = pIndex + 1 // intro panel index 0 hai
//         point.images.forEach((img) => {
//           const localOffset = y - panelIndex * vh.current
//           const setter = imageSetters.current[flatIndex]
//           if (setter) setter(-localOffset * img.speed)
//           flatIndex++
//         })
//       })

//       const newIndex = Math.round(y / vh.current)
//       if (newIndex !== activeIndexRef.current) {
//         activeIndexRef.current = newIndex
//         setActiveIndex(newIndex)
//       }
//     }

//     const handleWheel = (e) => {
//       const maxScroll = (TOTAL_PANELS - 1) * vh.current
//       scrollTarget.current = Math.max(0, Math.min(maxScroll, scrollTarget.current + e.deltaY))
//       applyScroll()
//     }

//     const node = wrapperRef.current
//     if (!node) return
//     node.addEventListener('wheel', handleWheel, { passive: true })
//     return () => node.removeEventListener('wheel', handleWheel)
//   }, [])

//   return (
//     <div ref={wrapperRef} className="capability-section">
//       <div className="capability-counter">
//         <span className="capability-counter-current">{String(activeIndex).padStart(2, '0')}</span>
//         <span className="capability-counter-divider" />
//         <span className="capability-counter-total">{String(TOTAL_PANELS - 1).padStart(2, '0')}</span>
//       </div>

//       <div className="capability-track" ref={trackRef}>
//         {/* Intro panel — title + description */}
//         <div className="capability-panels capability-intro-panel">
//           <h2 className="capability-main-title">BUILT BEYOND THE STANDARD.</h2>
//           <p className="capability-main-desc">
//             We don't just fabricate what's been done before. We take drawings,
//             specifications and ambitious requirements — and turn them into
//             metalwork built to perform.
//           </p>
//         </div>

//         {/* Point panels */}
//         {POINTS.map((point, pIndex) => (
//           <div key={point.title} className="capability-panel">
//             {point.images.map((img, i) => {
//               const flatIndex =
//                 POINTS.slice(0, pIndex).reduce((acc, p) => acc + p.images.length, 0) + i
//               return (
//                 <div
//                   key={img.src}
//                   ref={(el) => (imageRefs.current[flatIndex] = el)}
//                   className="capability-image"
//                   style={{ top: img.top, left: img.left, width: img.width, height: img.height }}
//                 >
//                   <img src={img.src} alt={point.title} />
//                 </div>
//               )
//             })}

//             <h2
//               className="capability-point-title"
//               style={{ top: point.titlePos.top, left: point.titlePos.left }}
//             >
//               {point.title}
//             </h2>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default CapabilitySection
