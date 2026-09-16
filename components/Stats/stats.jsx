'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './style.css'

export default function StatsShowcase({
  stats = [],
  title = "Our Impact & Milestones",
  title_part_2
}) {
  const scrollTrackRef = useRef(null)
  const lineRef = useRef(null)
  const mobileLineRef = useRef(null)
  const headerRef = useRef(null)
  const rowRefs = useRef([])

  useEffect(() => {
    const track = scrollTrackRef.current
    if (!track) return

    const calculateDistance = () => {
      const vh = window.innerHeight
      const trackHeight = track.scrollHeight
      return Math.max(0, trackHeight - vh * 0.82)
    }

    let maxDist = calculateDistance()

    const yTo = gsap.quickTo(track, 'y', { duration: 0.8, ease: 'power2.out' })

    // Header reveal
    const headerOpacityTo = headerRef.current
      ? gsap.quickTo(headerRef.current, 'opacity', { duration: 0.4, ease: 'power2.out' })
      : null
    const headerYTo = headerRef.current
      ? gsap.quickTo(headerRef.current, 'y', { duration: 0.5, ease: 'power3.out' })
      : null

    // Per-row reveal quickTo's
    const rowOpacityTo = rowRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'opacity', { duration: 0.4, ease: 'power2.out' }) : null
    )
    const rowYTo = rowRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }) : null
    )

    // Desktop line draw setup
    let lineLength = 0
    if (lineRef.current) {
      lineLength = lineRef.current.getTotalLength()
      lineRef.current.style.strokeDasharray = lineLength
      lineRef.current.style.strokeDashoffset = lineLength
    }
    const lineTo = lineRef.current
      ? gsap.quickTo(lineRef.current, 'strokeDashoffset', { duration: 0.5, ease: 'power2.out' })
      : null

    // Mobile line draw setup
    let mobileLineLength = 0
    if (mobileLineRef.current) {
      mobileLineLength = mobileLineRef.current.getTotalLength()
      mobileLineRef.current.style.strokeDasharray = mobileLineLength
      mobileLineRef.current.style.strokeDashoffset = mobileLineLength
    }
    const mobileLineTo = mobileLineRef.current
      ? gsap.quickTo(mobileLineRef.current, 'strokeDashoffset', { duration: 0.5, ease: 'power2.out' })
      : null

    const rowCount = Math.max(1, rowRefs.current.length)

    const handleProgress = (e) => {
      const p = e.detail?.progress ?? 0

      // Whole track scroll
      yTo(-p * maxDist)

      // Header fades in during first 15% of scroll
      const headerP = Math.max(0, Math.min(1, p / 0.15))
      if (headerOpacityTo) headerOpacityTo(headerP)
      if (headerYTo) headerYTo((1 - headerP) * 30)

      // Line draws in sync with overall progress
      if (lineTo) lineTo(lineLength * (1 - p))
      if (mobileLineTo) mobileLineTo(mobileLineLength * (1 - p))

      // Each row reveals in its own staggered progress window
      rowRefs.current.forEach((el, i) => {
        if (!el) return
        const start = 0.1 + (i / rowCount) * 0.75
        const end = start + (0.75 / rowCount) * 1.4
        let localP = (p - start) / (end - start)
        localP = Math.max(0, Math.min(1, localP))
        if (rowOpacityTo[i]) rowOpacityTo[i](localP)
        if (rowYTo[i]) rowYTo[i]((1 - localP) * 50)
      })
    }

    const handleResize = () => {
      maxDist = calculateDistance()
      if (lineRef.current) lineLength = lineRef.current.getTotalLength()
      if (mobileLineRef.current) mobileLineLength = mobileLineRef.current.getTotalLength()
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('statsProgress', handleProgress)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('statsProgress', handleProgress)
    }
  }, [stats])

  return (
    <section className="stats_section_wrapper">
      <div ref={scrollTrackRef} className="stats_scroll_track">

        {/* Desktop Smooth Continuous Horizontal Snake Wave SVG */}
        <svg className="stats_flow_line desktop_flow_line" viewBox="0 0 2000 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="silverLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="50%" stopColor="rgba(200,200,210,0.85)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>
          </defs>
          <path
            ref={lineRef}
            d="M 50 150 C 500 450, 700 50, 1100 450 C 1400 750, 1700 250, 1950 650"
            fill="none"
            stroke="url(#silverLineGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Dedicated Professional Mobile Background Line */}
        <svg className="stats_flow_line mobile_flow_line" viewBox="0 0 400 1200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mobileLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
              <stop offset="50%" stopColor="rgba(200,200,210,0.35)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>
          </defs>
          <path
            ref={mobileLineRef}
            d="M 320 50 C 350 400, 50 600, 50 900 C 50 1100, 350 1150, 350 1350"
            fill="none"
            stroke="url(#mobileLineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div ref={headerRef} className="stats_header_wrap">
          <h2 className="stats_section_heading">
            {title} <span>{title_part_2}</span>
          </h2>
        </div>

        <div className="stats_container">
          {stats.map((item, index) => {
            const isReversed = index % 2 !== 0
            return (
              <div
                key={index}
                ref={(el) => (rowRefs.current[index] = el)}
                className={`stat_row ${isReversed ? 'row_reverse' : ''}`}
              >
                <div className="stat_number_wrap">
                  <span className="stat_number">{item.number}</span>
                </div>
                <div className="stat_text_wrap">
                  <h3 className="stat_title">{item.title}</h3>
                  <p className="stat_subtitle">{item.subtitle}</p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}


// 'use client'

// import React, { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import './style.css'

// export default function StatsShowcase({
//   stats = [],
//   title = "Our Impact & Milestones",
//   title_part_2
// }) {
//   const scrollTrackRef = useRef(null)
//   const lineRef = useRef(null)
//   const headerRef = useRef(null)
//   const rowRefs = useRef([])

//   useEffect(() => {
//     const track = scrollTrackRef.current
//     if (!track) return

//     const calculateDistance = () => {
//       const vh = window.innerHeight
//       const trackHeight = track.scrollHeight
//       return Math.max(0, trackHeight - vh * 0.82)
//     }

//     let maxDist = calculateDistance()

//     const yTo = gsap.quickTo(track, 'y', { duration: 0.8, ease: 'power2.out' })

//     // Header reveal
//     const headerOpacityTo = headerRef.current
//       ? gsap.quickTo(headerRef.current, 'opacity', { duration: 0.4, ease: 'power2.out' })
//       : null
//     const headerYTo = headerRef.current
//       ? gsap.quickTo(headerRef.current, 'y', { duration: 0.5, ease: 'power3.out' })
//       : null

//     // Per-row reveal quickTo's
//     const rowOpacityTo = rowRefs.current.map((el) =>
//       el ? gsap.quickTo(el, 'opacity', { duration: 0.4, ease: 'power2.out' }) : null
//     )
//     const rowYTo = rowRefs.current.map((el) =>
//       el ? gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }) : null
//     )

//     // Silver line draw setup (Smooth Continuous Snake Wave)
//     let lineLength = 0
//     if (lineRef.current) {
//       lineLength = lineRef.current.getTotalLength()
//       lineRef.current.style.strokeDasharray = lineLength
//       lineRef.current.style.strokeDashoffset = lineLength
//     }
//     const lineTo = lineRef.current
//       ? gsap.quickTo(lineRef.current, 'strokeDashoffset', { duration: 0.5, ease: 'power2.out' })
//       : null

//     const rowCount = Math.max(1, rowRefs.current.length)

//     const handleProgress = (e) => {
//       const p = e.detail?.progress ?? 0

//       // Whole track scroll
//       yTo(-p * maxDist)

//       // Header fades in during first 15% of scroll
//       const headerP = Math.max(0, Math.min(1, p / 0.15))
//       if (headerOpacityTo) headerOpacityTo(headerP)
//       if (headerYTo) headerYTo((1 - headerP) * 30)

//       // Line draws in sync with overall progress
//       if (lineTo) lineTo(lineLength * (1 - p))

//       // Each row reveals in its own staggered progress window
//       rowRefs.current.forEach((el, i) => {
//         if (!el) return
//         const start = 0.1 + (i / rowCount) * 0.75
//         const end = start + (0.75 / rowCount) * 1.4
//         let localP = (p - start) / (end - start)
//         localP = Math.max(0, Math.min(1, localP))
//         if (rowOpacityTo[i]) rowOpacityTo[i](localP)
//         if (rowYTo[i]) rowYTo[i]((1 - localP) * 50)
//       })
//     }

//     const handleResize = () => {
//       maxDist = calculateDistance()
//       if (lineRef.current) lineLength = lineRef.current.getTotalLength()
//     }

//     window.addEventListener('resize', handleResize)
//     window.addEventListener('statsProgress', handleProgress)

//     return () => {
//       window.removeEventListener('resize', handleResize)
//       window.removeEventListener('statsProgress', handleProgress)
//     }
//   }, [stats])

//   return (
//     <section className="stats_section_wrapper">
//       <div ref={scrollTrackRef} className="stats_scroll_track">

//         {/* Smooth Continuous Horizontal Snake Wave SVG */}
//         <svg className="stats_flow_line" viewBox="0 0 2000 800" preserveAspectRatio="none">
//           <defs>
//             <linearGradient id="silverLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
//               <stop offset="50%" stopColor="rgba(200,200,210,0.85)" />
//               <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
//             </linearGradient>
//           </defs>
//           <path
//             ref={lineRef}
//             d="M 50 150 C 500 450, 700 50, 1100 450 C 1400 750, 1700 250, 1950 650"
//             fill="none"
//             stroke="url(#silverLineGrad)"
//             strokeWidth="5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             vectorEffect="non-scaling-stroke"
//           />
//         </svg>

//         <div ref={headerRef} className="stats_header_wrap">
//           <h2 className="stats_section_heading">
//             {title} <span>{title_part_2}</span>
//           </h2>
//         </div>

//         <div className="stats_container">
//           {stats.map((item, index) => {
//             const isReversed = index % 2 !== 0
//             return (
//               <div
//                 key={index}
//                 ref={(el) => (rowRefs.current[index] = el)}
//                 className={`stat_row ${isReversed ? 'row_reverse' : ''}`}
//               >
//                 <div className="stat_number_wrap">
//                   <span className="stat_number">{item.number}</span>
//                 </div>
//                 <div className="stat_text_wrap">
//                   <h3 className="stat_title">{item.title}</h3>
//                   <p className="stat_subtitle">{item.subtitle}</p>
//                 </div>
//               </div>
//             )
//           })}
//         </div>

//       </div>
//     </section>
//   )
// }

// 'use client'

// import React, { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import './style.css'

// export default function StatsShowcase({
//   stats = [],
//   title = "Our Impact & Milestones",
//   title_part_2
// }) {
//   const scrollTrackRef = useRef(null)
//   const lineRef = useRef(null)
//   const headerRef = useRef(null)
//   const rowRefs = useRef([])

//   useEffect(() => {
//     const track = scrollTrackRef.current
//     if (!track) return

//     const calculateDistance = () => {
//       const vh = window.innerHeight
//       const trackHeight = track.scrollHeight
//       return Math.max(0, trackHeight - vh * 0.82)
//     }

//     let maxDist = calculateDistance()

//     const yTo = gsap.quickTo(track, 'y', { duration: 0.8, ease: 'power2.out' })

//     // Header reveal
//     const headerOpacityTo = headerRef.current
//       ? gsap.quickTo(headerRef.current, 'opacity', { duration: 0.4, ease: 'power2.out' })
//       : null
//     const headerYTo = headerRef.current
//       ? gsap.quickTo(headerRef.current, 'y', { duration: 0.5, ease: 'power3.out' })
//       : null

//     // Per-row reveal quickTo's
//     const rowOpacityTo = rowRefs.current.map((el) =>
//       el ? gsap.quickTo(el, 'opacity', { duration: 0.4, ease: 'power2.out' }) : null
//     )
//     const rowYTo = rowRefs.current.map((el) =>
//       el ? gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }) : null
//     )

//     // Silver line draw setup (Horizontal Snake Wave)
//     let lineLength = 0
//     if (lineRef.current) {
//       lineLength = lineRef.current.getTotalLength()
//       lineRef.current.style.strokeDasharray = lineLength
//       lineRef.current.style.strokeDashoffset = lineLength
//     }
//     const lineTo = lineRef.current
//       ? gsap.quickTo(lineRef.current, 'strokeDashoffset', { duration: 0.5, ease: 'power2.out' })
//       : null

//     const rowCount = Math.max(1, rowRefs.current.length)

//     const handleProgress = (e) => {
//       const p = e.detail?.progress ?? 0

//       // Whole track scroll
//       yTo(-p * maxDist)

//       // Header fades in during first 15% of scroll
//       const headerP = Math.max(0, Math.min(1, p / 0.15))
//       if (headerOpacityTo) headerOpacityTo(headerP)
//       if (headerYTo) headerYTo((1 - headerP) * 30)

//       // Line draws in sync with overall progress (horizontal snake path)
//       if (lineTo) lineTo(lineLength * (1 - p))

//       // Each row reveals in its own staggered progress window
//       rowRefs.current.forEach((el, i) => {
//         if (!el) return
//         const start = 0.1 + (i / rowCount) * 0.75
//         const end = start + (0.75 / rowCount) * 1.4
//         let localP = (p - start) / (end - start)
//         localP = Math.max(0, Math.min(1, localP))
//         if (rowOpacityTo[i]) rowOpacityTo[i](localP)
//         if (rowYTo[i]) rowYTo[i]((1 - localP) * 50)
//       })
//     }

//     const handleResize = () => {
//       maxDist = calculateDistance()
//       if (lineRef.current) lineLength = lineRef.current.getTotalLength()
//     }

//     window.addEventListener('resize', handleResize)
//     window.addEventListener('statsProgress', handleProgress)

//     return () => {
//       window.removeEventListener('resize', handleResize)
//       window.removeEventListener('statsProgress', handleProgress)
//     }
//   }, [stats])

//   return (
//     <section className="stats_section_wrapper">
//       <div ref={scrollTrackRef} className="stats_scroll_track">

//         {/* Horizontal Snake Wave SVG */}
//         <svg className="stats_flow_line" viewBox="0 0 2000 600" preserveAspectRatio="none">
//           <defs>
//             <linearGradient id="silverLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
//               <stop offset="50%" stopColor="rgba(200,200,210,0.9)" />
//               <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
//             </linearGradient>
//           </defs>
//           <path
//             ref={lineRef}
//             d="M 0 100 C 400 500, 800 -100, 1200 400 C 1500 600, 1700 100, 2000 300"
//             fill="none"
//             stroke="url(#silverLineGrad)"
//             strokeWidth="5"
//             strokeLinecap="round"
//             vectorEffect="non-scaling-stroke"
//           />
//         </svg>

//         <div ref={headerRef} className="stats_header_wrap">
//           <h2 className="stats_section_heading">
//             {title} <span>{title_part_2}</span>
//           </h2>
//         </div>

//         <div className="stats_container">
//           {stats.map((item, index) => {
//             const isReversed = index % 2 !== 0
//             return (
//               <div
//                 key={index}
//                 ref={(el) => (rowRefs.current[index] = el)}
//                 className={`stat_row ${isReversed ? 'row_reverse' : ''}`}
//               >
//                 <div className="stat_number_wrap">
//                   <span className="stat_number">{item.number}</span>
//                 </div>
//                 <div className="stat_text_wrap">
//                   <h3 className="stat_title">{item.title}</h3>
//                   <p className="stat_subtitle">{item.subtitle}</p>
//                 </div>
//               </div>
//             )
//           })}
//         </div>

//       </div>
//     </section>
//   )
// }

// 'use client'

// import React, { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import './style.css'

// export default function StatsShowcase({ 
//   stats = [], 
//   title = "Our Impact & Milestones",
//   title_part_2 
// }) {
//   const scrollTrackRef = useRef(null)

//   useEffect(() => {
//     const track = scrollTrackRef.current
//     if (!track) return

//     // Exact scroll calculation: content ki actual height minus viewport
//     const calculateDistance = () => {
//       const vh = window.innerHeight
//       const trackHeight = track.scrollHeight
//       // Max travel distance utna hi hona chahiye jitna content screen se bahar hai
//       return Math.max(0, trackHeight - vh * 0.82)
//     }

//     let maxDist = calculateDistance()

//     const yTo = gsap.quickTo(track, 'y', {
//       duration: 0.8,
//       ease: 'power2.out',
//     })

//     const handleProgress = (e) => {
//       const p = e.detail?.progress ?? 0
//       yTo(-p * maxDist)
//     }

//     const handleResize = () => {
//       maxDist = calculateDistance()
//     }

//     window.addEventListener('resize', handleResize)
//     window.addEventListener('statsProgress', handleProgress)

//     return () => {
//       window.removeEventListener('resize', handleResize)
//       window.removeEventListener('statsProgress', handleProgress)
//     }
//   }, [stats])

//   return (
//     <section className="stats_section_wrapper">
//       {/* Moving Track contains both Heading + Stats so heading scrolls up with content */}
//       <div ref={scrollTrackRef} className="stats_scroll_track">
        
//         {/* Section Heading */}
//         <div className="stats_header_wrap">
//           <h2 className="stats_section_heading">
//             {title} <span>{title_part_2}</span>
//           </h2>
//         </div>

//         {/* Stats Container */}
//         <div className="stats_container">
//           {stats.map((item, index) => {
//             const isReversed = index % 2 !== 0

//             return (
//               <div
//                 key={index}
//                 className={`stat_row ${isReversed ? 'row_reverse' : ''}`}
//               >
//                 <div className="stat_number_wrap">
//                   <span className="stat_number">{item.number}</span>
//                 </div>

//                 <div className="stat_text_wrap">
//                   <h3 className="stat_title">{item.title}</h3>
//                   {item.subtitle && (
//                     <p className="stat_subtitle">{item.subtitle}</p>
//                   )}
//                 </div>
//               </div>
//             )
//           })}
//         </div>

//       </div>
//     </section>
//   )
// }