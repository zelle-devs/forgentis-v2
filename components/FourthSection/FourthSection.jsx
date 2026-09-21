

// 'use client'
// import { useEffect, useRef, useMemo, useState } from 'react'
// import gsap from 'gsap'
// import './FourthSection.css'

// // ============================================================
// // 🔧 GRID CONFIG
// // ============================================================
// const GRID = {
//   cols: 6,
//   rows: 3,
//   gap: 0,
//   marginX: 0,
//   marginY: 0,
//   strokeWidth: 2,
// }

// const IMAGES = {
//   first: '/optimize/1.png',
//   second: '/optimize/2.png',
// }

// // ---------------------------------------------------------------------------
// // Poora grid — Green border, Red vertical dividers, Blue internal facets
// // ---------------------------------------------------------------------------
// function buildTrianglePattern(viewBoxW, viewBoxH) {
//   const { cols, rows, gap, marginX, marginY } = GRID

//   const availW = viewBoxW - marginX * 2 - gap * (cols - 1)
//   const availH = viewBoxH - marginY * 2 - gap * (rows - 1)

//   const tileW = availW / cols
//   const tileH = availH / rows

//   const startX = marginX
//   const startY = marginY

//   const lines = []

//   // 1. GREEN: Outer Border Lines
//   lines.push(
//     { id: 'border-top', x1: startX, y1: startY, x2: startX + availW, y2: startY, color: '#FFFFFF', tileIndex: 0 },
//     { id: 'border-right', x1: startX + availW, y1: startY, x2: startX + availW, y2: startY + availH, color: '#FFFFFF', tileIndex: 0 },
//     { id: 'border-bottom', x1: startX + availW, y1: startY + availH, x2: startX, y2: startY + availH, color: '#FFFFFF', tileIndex: 0 },
//     { id: 'border-left', x1: startX, y1: startY + availH, x2: startX, y2: startY, color: '#FFFFFF', tileIndex: 0 }
//   )

//   let tileId = 0
//   for (let r = 0; r < rows; r++) {
//     for (let c = 0; c < cols; c++) {
//       const x = startX + c * (tileW + gap)
//       const y = startY + r * (tileH + gap)

//       const isEvenCol = c % 2 === 0
//       const peakX = isEvenCol ? x + tileW : x
//       const peakY = y + tileH / 2
//       const oppX = isEvenCol ? x : x + tileW

//       const P = [
//         [x, y],                 // 0 top-left
//         [x + tileW, y],         // 1 top-right
//         [x + tileW, y + tileH], // 2 bottom-right
//         [x, y + tileH],         // 3 bottom-left
//       ]

//       // BLUE: Horizontal top edge
//       if (r > 0) {
//         lines.push({
//           id: `t${tileId}-edge-top`,
//           x1: P[0][0], y1: P[0][1],
//           x2: P[1][0], y2: P[1][1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         })
//       }
//       // BLUE: Horizontal bottom edge
//       if (r < rows - 1) {
//         lines.push({
//           id: `t${tileId}-edge-bottom`,
//           x1: P[3][0], y1: P[3][1],
//           x2: P[2][0], y2: P[2][1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         })
//       }

//       // RED: Right vertical edge (Internal column divider highlighted in red)
//       if (c < cols - 1) {
//         lines.push({
//           id: `t${tileId}-edge-right-red`,
//           x1: P[1][0], y1: P[1][1],
//           x2: P[2][0], y2: P[2][1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         })
//       }

//       // BLUE: Left vertical edge
//       if (c > 0) {
//         lines.push({
//           id: `t${tileId}-edge-left-blue`,
//           x1: P[0][0], y1: P[0][1],
//           x2: P[3][0], y2: P[3][1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         })
//       }

//       // BLUE: Centerline
//       lines.push({
//         id: `t${tileId}-centerline`,
//         x1: peakX, y1: peakY,
//         x2: oppX, y2: peakY,
//         color: '#FFFFFF',
//         tileIndex: tileId,
//       })

//       // BLUE: Diagonals
//       const targetCorners = isEvenCol ? [P[0], P[3]] : [P[1], P[2]]
//       targetCorners.forEach((tc, i) => {
//         lines.push({
//           id: `t${tileId}-diag${i}`,
//           x1: peakX, y1: peakY,
//           x2: tc[0], y2: tc[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         })
//       })

//       tileId++
//     }
//   }

//   return lines
// }

// export default function FourthSection() {
//   const containerRef = useRef(null)
//   const groupRef = useRef(null)
//   const imageRef = useRef(null)
//   const image2Ref = useRef(null)
//   const dividerRef = useRef(null)
//   const strokeGroupRef = useRef(null)
//   const lineRefs = useRef([])
//   const [viewBox, setViewBox] = useState({ w: 1920, h: 1080 })

//   // ---------------------------------------------------------------------------
//   // Container ka actual size detect karna taaki bilkul accurate fit aaye
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     const updateDimensions = () => {
//       if (containerRef.current) {
//         const { width, height } = containerRef.current.getBoundingClientRect()
//         if (width > 0 && height > 0) {
//           setViewBox({ w: width, h: height })
//         }
//       }
//     }

//     updateDimensions()
//     const resizeObserver = new ResizeObserver(() => {
//       updateDimensions()
//     })

//     if (containerRef.current) {
//       resizeObserver.observe(containerRef.current)
//     }

//     return () => {
//       resizeObserver.disconnect()
//     }
//   }, [])

//   const allLines = useMemo(
//     () => buildTrianglePattern(viewBox.w, viewBox.h),
//     [viewBox]
//   )

//   const totalTiles = GRID.cols * GRID.rows

//   // ---------------------------------------------------------------------------
//   // Initial state
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     gsap.set(groupRef.current, { transformOrigin: '50% 50%', scale: 1 })
//     gsap.set(imageRef.current, { opacity: 0, scale: 1 })
//     gsap.set(image2Ref.current, { xPercent: 100 })
//     gsap.set(dividerRef.current, { xPercent: 100, opacity: 0 })
//     gsap.set(strokeGroupRef.current, { opacity: 1 })

//     lineRefs.current.forEach((line) => {
//       if (!line) return
//       const x1 = parseFloat(line.getAttribute('x1'))
//       const y1 = parseFloat(line.getAttribute('y1'))
//       const x2 = parseFloat(line.getAttribute('x2'))
//       const y2 = parseFloat(line.getAttribute('y2'))
//       const length = Math.hypot(x2 - x1, y2 - y1)
//       line.style.strokeDasharray = `${length}`
//       line.style.strokeDashoffset = `${length}`
//       line.dataset.length = length
//     })
//   }, [viewBox, allLines])

//   // ---------------------------------------------------------------------------
//   // Animation listeners
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     // Phase 1 — pattern draw-in
//     const handleShape = (e) => {
//       const progress = e.detail.progress

//       const staggerSpan = 0.6

//       lineRefs.current.forEach((line, i) => {
//         if (!line) return
//         const tileIndex = parseInt(line.dataset.tileIndex || 0, 10)
//         const start = (tileIndex / totalTiles) * staggerSpan
//         const local = Math.max(
//           0,
//           Math.min(1, (progress - start) / (1 - staggerSpan))
//         )
//         const length = parseFloat(line.dataset.length)
//         gsap.to(line, {
//           strokeDashoffset: length * (1 - local),
//           duration: 0.08,
//           ease: 'none',
//           overwrite: 'auto',
//         })
//       })
//     }

//     // Phase 2 — pattern fade-out, image1 fade-in
//     const handleImage = (e) => {
//       const progress = e.detail.progress
//       gsap.to(imageRef.current, {
//         opacity: progress,
//         duration: 0.15,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//       gsap.to(strokeGroupRef.current, {
//         opacity: 1 - progress,
//         duration: 0.15,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }

//     // Phase 3 — image2 right se left slide
//     const handleImage2 = (e) => {
//       const progress = e.detail.progress
//       gsap.to(image2Ref.current, {
//         xPercent: 100 - progress * 100,
//         duration: 0.15,
//         ease: 'power3.out',
//         overwrite: 'auto',
//       })
//       gsap.to(dividerRef.current, {
//         xPercent: 100 - progress * 100,
//         opacity: progress > 0.01 && progress < 0.99 ? 1 : 0,
//         duration: 0.15,
//         ease: 'power3.out',
//         overwrite: 'auto',
//       })
//     }

//     window.addEventListener('fourthShapeProgress', handleShape)
//     window.addEventListener('fourthImageProgress', handleImage)
//     window.addEventListener('fourthImage2Progress', handleImage2)
//     return () => {
//       window.removeEventListener('fourthShapeProgress', handleShape)
//       window.removeEventListener('fourthImageProgress', handleImage)
//       window.removeEventListener('fourthImage2Progress', handleImage2)
//     }
//   }, [totalTiles])

//   return (
//     <div className="fourth-section" ref={containerRef}>
//       {/* Image 1 */}
//       <div className="image-container" ref={imageRef}>
//         <img src={IMAGES.first} alt="Panel Design 1" className="revealed-image" />
//       </div>

//       {/* Image 2 — slider */}
//       <div className="image-container image-container-2" ref={image2Ref}>
//         <img src={IMAGES.second} alt="Panel Design 2" className="revealed-image" />
//       </div>

//       {/* Slider divider */}
//       <div className="slider-divider" ref={dividerRef} />

//       {/* SVG Overlay */}
//       <div className="svg-wrapper">
//         <svg
//           className="fourth-svg"
//           viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
//           preserveAspectRatio="none"
//         >
//           <g ref={groupRef}>
//             <g ref={strokeGroupRef}>
//               {allLines.map((l, i) => (
//                 <line
//                   key={l.id}
//                   ref={(el) => (lineRefs.current[i] = el)}
//                   x1={l.x1}
//                   y1={l.y1}
//                   x2={l.x2}
//                   y2={l.y2}
//                   stroke={l.color}
//                   strokeWidth={GRID.strokeWidth}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   data-tile-index={l.tileIndex}
//                 />
//               ))}
//             </g>
//           </g>
//         </svg>
//       </div>
//     </div>
//   )
// }




// ((((((((((((((((((((((((((((((((((((((((((((done-2))))))))))))))))))))))))))))))))))))))))))))

// 'use client'
// import { useEffect, useRef, useMemo, useState } from 'react'
// import gsap from 'gsap'
// import './FourthSection.css'

// // ============================================================
// // 🔧 GRID & PATTERN CONFIG
// // ============================================================
// const GRID = {
//   cols: 6,
//   rows: 2.65,
//   gap: 0,
//   marginX: 0,
//   marginY: 0,
//   strokeWidth: 2,
// }

// const PATTERN_CONFIG = {
//   peakXType: 'alternating',
//   peakYRatio: 0.50,
// }

// const IMAGES = {
//   first: '/optimize/1.png',
//   second: '/optimize/2.png',
// }

// // ---------------------------------------------------------------------------
// // Continuous Triangle & Facet Pattern Generator
// // ---------------------------------------------------------------------------
// function buildTrianglePattern(viewBoxW, viewBoxH) {
//   const { cols, rows, gap, marginX, marginY } = GRID

//   const availW = viewBoxW - marginX * 2 - gap * (cols - 1)
//   const availH = viewBoxH - marginY * 2 - gap * (rows - 1)

//   const tileW = availW / cols
//   const tileH = availH / rows

//   const startX = marginX
//   const startY = marginY

//   const lines = []

//   // 1. Outer Border Lines (Frame)
//   lines.push(
//     { id: 'border-top', x1: startX, y1: startY, x2: startX + availW, y2: startY, color: '#FFFFFF', tileIndex: 0 },
//     { id: 'border-right', x1: startX + availW, y1: startY, x2: startX + availW, y2: startY + availH, color: '#FFFFFF', tileIndex: 0 },
//     { id: 'border-bottom', x1: startX + availW, y1: startY + availH, x2: startX, y2: startY + availH, color: '#FFFFFF', tileIndex: 0 },
//     { id: 'border-left', x1: startX, y1: startY + availH, x2: startX, y2: startY, color: '#FFFFFF', tileIndex: 0 }
//   )

//   let tileId = 0
//   for (let r = 0; r < rows; r++) {
//     for (let c = 0; c < cols; c++) {
//       const x = startX + c * (tileW + gap)
//       const y = startY + r * (tileH + gap)

//       const P = [
//         [x, y],                 // 0 top-left
//         [x + tileW, y],         // 1 top-right
//         [x + tileW, y + tileH], // 2 bottom-right
//         [x, y + tileH],         // 3 bottom-left
//       ]

//       // 🚫 Inner Horizontal Lines (Top/Bottom) yahan se remove kar di gayi hain
//       // Sirf Vertical Column Boundaries rakhi hain agar zaroorat ho:
//       if (c < cols - 1) {
//         lines.push({ id: `t${tileId}-right`, x1: P[1][0], y1: P[1][1], x2: P[2][0], y2: P[2][1], color: '#FFFFFF', tileIndex: tileId })
//       }
//       if (c > 0) {
//         lines.push({ id: `t${tileId}-left`, x1: P[0][0], y1: P[0][1], x2: P[3][0], y2: P[3][1], color: '#FFFFFF', tileIndex: tileId })
//       }

//       const isEvenCol = c % 2 === 0
//       let peakX = x + tileW * 0.5
//       if (PATTERN_CONFIG.peakXType === 'alternating') {
//         peakX = isEvenCol ? x + tileW : x
//       }
//       const peakY = y + tileH * PATTERN_CONFIG.peakYRatio

//       // Diagonals jo corners ko peak se join karte hain
//       const targetCorners = isEvenCol ? [P[0], P[3]] : [P[1], P[2]]
//       targetCorners.forEach((tc, i) => {
//         lines.push({
//           id: `t${tileId}-diag${i}`,
//           x1: peakX, y1: peakY,
//           x2: tc[0], y2: tc[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         })
//       })

//       tileId++
//     }
//   }

//   return lines
// }

// export default function FourthSection() {
//   const containerRef = useRef(null)
//   const groupRef = useRef(null)
//   const imageRef = useRef(null)
//   const image2Ref = useRef(null)
//   const dividerRef = useRef(null)
//   const strokeGroupRef = useRef(null)
//   const lineRefs = useRef([])
//   const [viewBox, setViewBox] = useState({ w: 1920, h: 1080 })

//   useEffect(() => {
//     const updateDimensions = () => {
//       if (containerRef.current) {
//         const { width, height } = containerRef.current.getBoundingClientRect()
//         if (width > 0 && height > 0) {
//           setViewBox({ w: width, h: height })
//         }
//       }
//     }

//     updateDimensions()
//     const resizeObserver = new ResizeObserver(() => {
//       updateDimensions()
//     })

//     if (containerRef.current) {
//       resizeObserver.observe(containerRef.current)
//     }

//     return () => {
//       resizeObserver.disconnect()
//     }
//   }, [])

//   const allLines = useMemo(
//     () => buildTrianglePattern(viewBox.w, viewBox.h),
//     [viewBox]
//   )

//   const totalTiles = GRID.cols * GRID.rows

//   useEffect(() => {
//     gsap.set(groupRef.current, { transformOrigin: '50% 50%', scale: 1 })
//     gsap.set(imageRef.current, { opacity: 0, scale: 1 })
//     gsap.set(image2Ref.current, { xPercent: 100 })
//     gsap.set(dividerRef.current, { xPercent: 100, opacity: 0 })
//     gsap.set(strokeGroupRef.current, { opacity: 1 })

//     lineRefs.current.forEach((line) => {
//       if (!line) return
//       const x1 = parseFloat(line.getAttribute('x1'))
//       const y1 = parseFloat(line.getAttribute('y1'))
//       const x2 = parseFloat(line.getAttribute('x2'))
//       const y2 = parseFloat(line.getAttribute('y2'))
//       const length = Math.hypot(x2 - x1, y2 - y1)
//       line.style.strokeDasharray = `${length}`
//       line.style.strokeDashoffset = `${length}`
//       line.dataset.length = length
//     })
//   }, [viewBox, allLines])

//   useEffect(() => {
//     const handleShape = (e) => {
//       const progress = e.detail.progress
//       const staggerSpan = 0.6

//       lineRefs.current.forEach((line, i) => {
//         if (!line) return
//         const tileIndex = parseInt(line.dataset.tileIndex || 0, 10)
//         const start = (tileIndex / totalTiles) * staggerSpan
//         const local = Math.max(
//           0,
//           Math.min(1, (progress - start) / (1 - staggerSpan))
//         )
//         const length = parseFloat(line.dataset.length)
//         gsap.to(line, {
//           strokeDashoffset: length * (1 - local),
//           duration: 0.08,
//           ease: 'none',
//           overwrite: 'auto',
//         })
//       })
//     }

//     const handleImage = (e) => {
//       const progress = e.detail.progress
//       gsap.to(imageRef.current, {
//         opacity: progress,
//         duration: 0.15,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//       gsap.to(strokeGroupRef.current, {
//         opacity: 1 - progress,
//         duration: 0.15,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }

//     const handleImage2 = (e) => {
//       const progress = e.detail.progress
//       gsap.to(image2Ref.current, {
//         xPercent: 100 - progress * 100,
//         duration: 0.15,
//         ease: 'power3.out',
//         overwrite: 'auto',
//       })
//       gsap.to(dividerRef.current, {
//         xPercent: 100 - progress * 100,
//         opacity: progress > 0.01 && progress < 0.99 ? 1 : 0,
//         duration: 0.15,
//         ease: 'power3.out',
//         overwrite: 'auto',
//       })
//     }

//     window.addEventListener('fourthShapeProgress', handleShape)
//     window.addEventListener('fourthImageProgress', handleImage)
//     window.addEventListener('fourthImage2Progress', handleImage2)
//     return () => {
//       window.removeEventListener('fourthShapeProgress', handleShape)
//       window.removeEventListener('fourthImageProgress', handleImage)
//       window.removeEventListener('fourthImage2Progress', handleImage2)
//     }
//   }, [totalTiles])

//   return (
//     <div className="fourth-section" ref={containerRef}>
//       <div className="image-container" ref={imageRef}>
//         <img src={IMAGES.first} alt="Panel Design 1" className="revealed-image" />
//       </div>

//       <div className="image-container image-container-2" ref={image2Ref}>
//         <img src={IMAGES.second} alt="Panel Design 2" className="revealed-image" />
//       </div>

//       <div className="slider-divider" ref={dividerRef} />

//       <div className="svg-wrapper">
//         <svg
//           className="fourth-svg"
//           viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
//           preserveAspectRatio="none"
//         >
//           <g ref={groupRef}>
//             <g ref={strokeGroupRef}>
//               {allLines.map((l, i) => (
//                 <line
//                   key={l.id}
//                   ref={(el) => (lineRefs.current[i] = el)}
//                   x1={l.x1}
//                   y1={l.y1}
//                   x2={l.x2}
//                   y2={l.y2}
//                   stroke={l.color}
//                   strokeWidth={GRID.strokeWidth}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   data-tile-index={l.tileIndex}
//                 />
//               ))}
//             </g>
//           </g>
//         </svg>
//       </div>
//     </div>
//   )
// }




// *****************************


'use client'

import { useEffect, useRef, useMemo, useState } from 'react'
import gsap from 'gsap'
import './FourthSection.css'

// ============================================================
// GRID & PATTERN CONFIG
// ============================================================

const GRID = {
  cols: 6,
  rows: 2.55,
  gap: 0,
  marginX: 0,
  marginY: 0,
  strokeWidth: 2,
}

const PATTERN_CONFIG = {
  peakXType: 'alternating',
  peakYRatio: 0.5,

  // Inner facet point position
  innerXRatio: 0.38,
  innerYRatio: 0.5,
}

const IMAGES = {
  first: '/optimize/1.png',
  second: '/optimize/2.png',
}

// ============================================================
// TRIANGULAR FACET PATTERN GENERATOR
// ============================================================

function buildTrianglePattern(viewBoxW, viewBoxH) {
  const { cols, rows, gap, marginX, marginY } = GRID

  const availW =
    viewBoxW - marginX * 2 - gap * (cols - 1)

  const availH =
    viewBoxH - marginY * 2 - gap * (rows - 1)

  const tileW = availW / cols
  const tileH = availH / rows

  const startX = marginX
  const startY = marginY

  const lines = []

  // ============================================================
  // OUTER FRAME
  // ============================================================

  lines.push(
    {
      id: 'border-top',
      x1: startX,
      y1: startY,
      x2: startX + availW,
      y2: startY,
      color: '#FFFFFF',
      tileIndex: 0,
    },
    {
      id: 'border-right',
      x1: startX + availW,
      y1: startY,
      x2: startX + availW,
      y2: startY + availH,
      color: '#FFFFFF',
      tileIndex: 0,
    },
    {
      id: 'border-bottom',
      x1: startX + availW,
      y1: startY + availH,
      x2: startX,
      y2: startY + availH,
      color: '#FFFFFF',
      tileIndex: 0,
    },
    {
      id: 'border-left',
      x1: startX,
      y1: startY + availH,
      x2: startX,
      y2: startY,
      color: '#FFFFFF',
      tileIndex: 0,
    }
  )

  // ============================================================
  // TILE GENERATION
  // ============================================================

  let tileId = 0

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (tileW + gap)
      const y = startY + r * (tileH + gap)

      // --------------------------------------------------------
      // TILE CORNERS
      // --------------------------------------------------------

      const TL = [x, y]
      const TR = [x + tileW, y]
      const BR = [x + tileW, y + tileH]
      const BL = [x, y + tileH]

      const isEvenCol = c % 2 === 0

      // --------------------------------------------------------
      // MAIN PEAK
      // Alternates between left and right
      // --------------------------------------------------------

      const peakX = isEvenCol
        ? x + tileW
        : x

      const peakY =
        y + tileH * PATTERN_CONFIG.peakYRatio

      const PEAK = [peakX, peakY]

      // --------------------------------------------------------
      // INNER FACET POINT
      // --------------------------------------------------------

      const innerX = isEvenCol
        ? x + tileW * PATTERN_CONFIG.innerXRatio
        : x + tileW * (1 - PATTERN_CONFIG.innerXRatio)

      const innerY =
        y + tileH * PATTERN_CONFIG.innerYRatio

      const INNER = [innerX, innerY]

      // --------------------------------------------------------
      // OUTER TRIANGLE
      // --------------------------------------------------------

      const outerTriangle = isEvenCol
        ? [TL, PEAK, BL]
        : [TR, PEAK, BR]

      const TOP = outerTriangle[0]
      const BOTTOM = outerTriangle[2]

      // ========================================================
      // VERTICAL COLUMN BOUNDARIES
      // ========================================================

      // Right boundary
      if (c < cols - 1) {
        lines.push({
          id: `t${tileId}-right`,
          x1: TR[0],
          y1: TR[1],
          x2: BR[0],
          y2: BR[1],
          color: '#FFFFFF',
          tileIndex: tileId,
        })
      }

      // Left boundary
      if (c > 0) {
        lines.push({
          id: `t${tileId}-left`,
          x1: TL[0],
          y1: TL[1],
          x2: BL[0],
          y2: BL[1],
          color: '#FFFFFF',
          tileIndex: tileId,
        })
      }

      // ========================================================
      // OUTER TRIANGLE EDGES
      // ========================================================

      lines.push(
        {
          id: `t${tileId}-outer-top`,
          x1: TOP[0],
          y1: TOP[1],
          x2: PEAK[0],
          y2: PEAK[1],
          color: '#FFFFFF',
          tileIndex: tileId,
        },
        {
          id: `t${tileId}-outer-bottom`,
          x1: PEAK[0],
          y1: PEAK[1],
          x2: BOTTOM[0],
          y2: BOTTOM[1],
          color: '#FFFFFF',
          tileIndex: tileId,
        }
      )

      // ========================================================
      // INNER FACET LINES
      // Creates the smaller triangles inside the main triangle
      // ========================================================

     // ========================================================
// 🔺 THREE INTERNAL LINES IN EVERY TRIANGLE
// ========================================================

// Inner point → Top corner
lines.push({
  id: `t${tileId}-inner-top`,
  x1: INNER[0],
  y1: INNER[1],
  x2: TOP[0],
  y2: TOP[1],
  color: '#FFFFFF',
  tileIndex: tileId,
})

// Inner point → Bottom corner
lines.push({
  id: `t${tileId}-inner-bottom`,
  x1: INNER[0],
  y1: INNER[1],
  x2: BOTTOM[0],
  y2: BOTTOM[1],
  color: '#FFFFFF',
  tileIndex: tileId,
})

// Inner point → Peak
lines.push({
  id: `t${tileId}-inner-peak`,
  x1: INNER[0],
  y1: INNER[1],
  x2: PEAK[0],
  y2: PEAK[1],
  color: '#FFFFFF',
  tileIndex: tileId,
})


      // ========================================================
      // ADDITIONAL DIAGONAL FACETS
      // Creates a more detailed industrial geometric look
      // ========================================================

      const upperInner = [
        x + tileW * (isEvenCol ? 0.2 : 0.8),
        y + tileH * 0.25,
      ]

      const lowerInner = [
        x + tileW * (isEvenCol ? 0.2 : 0.8),
        y + tileH * 0.75,
      ]

      // Upper facet
      lines.push({
        id: `t${tileId}-upper-facet`,
        x1: upperInner[0],
        y1: upperInner[1],
        x2: INNER[0],
        y2: INNER[1],
        color: '#FFFFFF',
        tileIndex: tileId,
      })

      // Lower facet
      lines.push({
        id: `t${tileId}-lower-facet`,
        x1: lowerInner[0],
        y1: lowerInner[1],
        x2: INNER[0],
        y2: INNER[1],
        color: '#FFFFFF',
        tileIndex: tileId,
      })

      tileId++
    }
  }

  return lines
}

// ============================================================
// FOURTH SECTION COMPONENT
// ============================================================

export default function FourthSection() {
  const containerRef = useRef(null)
  const groupRef = useRef(null)
  const imageRef = useRef(null)
  const image2Ref = useRef(null)
  const dividerRef = useRef(null)
  const strokeGroupRef = useRef(null)
  const lineRefs = useRef([])

  const [viewBox, setViewBox] = useState({
    w: 1920,
    h: 1080,
  })

  // ============================================================
  // RESPONSIVE VIEWBOX
  // ============================================================

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return

      const { width, height } =
        containerRef.current.getBoundingClientRect()

      if (width > 0 && height > 0) {
        setViewBox({
          w: width,
          h: height,
        })
      }
    }

    updateDimensions()

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    window.addEventListener('resize', updateDimensions)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  // ============================================================
  // GENERATE ALL SVG LINES
  // ============================================================

  const allLines = useMemo(
    () => buildTrianglePattern(viewBox.w, viewBox.h),
    [viewBox]
  )

  const totalTiles = GRID.cols * GRID.rows

  // ============================================================
  // INITIAL SVG STATE
  // ============================================================

  useEffect(() => {
    if (!groupRef.current) return

    gsap.set(groupRef.current, {
      transformOrigin: '50% 50%',
      scale: 1,
    })

    gsap.set(imageRef.current, {
      opacity: 0,
      scale: 1,
    })

    gsap.set(image2Ref.current, {
      xPercent: 100,
    })

    gsap.set(dividerRef.current, {
      xPercent: 100,
      opacity: 0,
    })

    gsap.set(strokeGroupRef.current, {
      opacity: 1,
    })

    // Reset line drawing
    lineRefs.current.forEach((line) => {
      if (!line) return

      const x1 = parseFloat(line.getAttribute('x1'))
      const y1 = parseFloat(line.getAttribute('y1'))
      const x2 = parseFloat(line.getAttribute('x2'))
      const y2 = parseFloat(line.getAttribute('y2'))

      const length = Math.hypot(
        x2 - x1,
        y2 - y1
      )

      line.style.strokeDasharray = `${length}`
      line.style.strokeDashoffset = `${length}`
      line.dataset.length = length
    })
  }, [viewBox, allLines])

  // ============================================================
  // GSAP SCROLL ANIMATIONS
  // ============================================================

  useEffect(() => {
    // ----------------------------------------------------------
    // PHASE 1 — TRIANGLE PATTERN DRAW-IN
    // ----------------------------------------------------------

    const handleShape = (e) => {
      const progress = e.detail.progress
      const staggerSpan = 0.6

      lineRefs.current.forEach((line) => {
        if (!line) return

        const tileIndex = parseInt(
          line.dataset.tileIndex || '0',
          10
        )

        const start =
          (tileIndex / totalTiles) * staggerSpan

        const local = Math.max(
          0,
          Math.min(
            1,
            (progress - start) / (1 - staggerSpan)
          )
        )

        const length = parseFloat(line.dataset.length)

        if (!Number.isFinite(length)) return

        gsap.to(line, {
          strokeDashoffset: length * (1 - local),
          duration: 0.08,
          ease: 'none',
          overwrite: 'auto',
        })
      })
    }

    // ----------------------------------------------------------
    // PHASE 2 — PATTERN FADE-OUT + IMAGE 1 REVEAL
    // ----------------------------------------------------------

    const handleImage = (e) => {
      const progress = e.detail.progress

      gsap.to(imageRef.current, {
        opacity: progress,
        duration: 0.15,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      gsap.to(strokeGroupRef.current, {
        opacity: 1 - progress,
        duration: 0.15,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    // ----------------------------------------------------------
    // PHASE 3 — IMAGE 2 SLIDE FROM RIGHT TO LEFT
    // ----------------------------------------------------------

    const handleImage2 = (e) => {
      const progress = e.detail.progress

      gsap.to(image2Ref.current, {
        xPercent: 100 - progress * 100,
        duration: 0.15,
        ease: 'power3.out',
        overwrite: 'auto',
      })

      gsap.to(dividerRef.current, {
        xPercent: 100 - progress * 100,
        opacity:
          progress > 0.01 && progress < 0.99
            ? 1
            : 0,
        duration: 0.15,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    window.addEventListener(
      'fourthShapeProgress',
      handleShape
    )

    window.addEventListener(
      'fourthImageProgress',
      handleImage
    )

    window.addEventListener(
      'fourthImage2Progress',
      handleImage2
    )

    return () => {
      window.removeEventListener(
        'fourthShapeProgress',
        handleShape
      )

      window.removeEventListener(
        'fourthImageProgress',
        handleImage
      )

      window.removeEventListener(
        'fourthImage2Progress',
        handleImage2
      )
    }
  }, [totalTiles])

  // ============================================================
  // JSX
  // ============================================================

  return (
    <div
      className="fourth-section"
      ref={containerRef}
    >
      {/* IMAGE 1 */}

      <div
        className="image-container"
        ref={imageRef}
      >
        <img
          src={IMAGES.first}
          alt="Panel Design 1"
          className="revealed-image"
        />
      </div>

      {/* IMAGE 2 */}

      <div
        className="image-container image-container-2"
        ref={image2Ref}
      >
        <img
          src={IMAGES.second}
          alt="Panel Design 2"
          className="revealed-image"
        />
      </div>

      {/* SLIDER DIVIDER */}

      <div
        className="slider-divider"
        ref={dividerRef}
      />

      {/* SVG PATTERN */}

      <div className="svg-wrapper">
        <svg
          className="fourth-svg"
          viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
          preserveAspectRatio="none"
        >
          <g ref={groupRef}>
            <g ref={strokeGroupRef}>
              {allLines.map((line, index) => (
                <line
                  key={line.id}
                  ref={(el) => {
                    lineRefs.current[index] = el
                  }}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={line.color}
                  strokeWidth={GRID.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  data-tile-index={line.tileIndex}
                />
              ))}
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}












// (((((((((((((((((((((((((((((done -1 )))))))))))))))))))))))))))))


// 'use client'
// import { useEffect, useRef, useMemo, useState } from 'react'
// import gsap from 'gsap'
// import './FourthSection.css'

// // ============================================================
// // 🔧 GRID CONFIG
// // ============================================================
// const GRID = {
//   cols: 6,
//   rows: 3,
//   gap: 0,
//   marginX: 0,
//   marginY: 0,
//   strokeWidth: 2,
// }

// const IMAGES = {
//   first: '/optimize/1.png',
//   second: '/optimize/2.png',
// }

// // ---------------------------------------------------------------------------
// // Poora grid — Offset Peak Pattern (Screenshot ke mutabiq)
// // ---------------------------------------------------------------------------
// function buildTrianglePattern(viewBoxW, viewBoxH) {
//   const { cols, rows, gap, marginX, marginY } = GRID

//   const availW = viewBoxW - marginX * 2 - gap * (cols - 1)
//   const availH = viewBoxH - marginY * 2 - gap * (rows - 1)

//   const tileW = availW / cols
//   const tileH = availH / rows

//   const startX = marginX
//   const startY = marginY

//   const lines = []

//   let tileId = 0
//   for (let r = 0; r < rows; r++) {
//     for (let c = 0; c < cols; c++) {
//       const x = startX + c * (tileW + gap)
//       const y = startY + r * (tileH + gap)

//       // 4 corner points
//       const P = [
//         [x, y],                 // 0 top-left
//         [x + tileW, y],         // 1 top-right
//         [x + tileW, y + tileH], // 2 bottom-right
//         [x, y + tileH],         // 3 bottom-left
//       ]

//       // 4 rectangle edges
//       P.forEach((p, i) => {
//         const n = P[(i + 1) % P.length]
//         lines.push({
//           id: `t${tileId}-edge${i}`,
//           x1: p[0], y1: p[1],
//           x2: n[0], y2: n[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         })
//       })

//       // Offset peak point (jaise screenshot mein red dot dikhaya gaya hai)[cite: 10]
//       const isEvenCol = c % 2 === 0
//       const peakX = isEvenCol ? x + tileW * 0.65 : x + tileW * 0.35
//       const peakY = y + tileH * 0.5

//       // Peak se 4 corners tak radial lines (spokes)
//       P.forEach((p, i) => {
//         lines.push({
//           id: `t${tileId}-spoke${i}`,
//           x1: peakX, y1: peakY,
//           x2: p[0], y2: p[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         })
//       })

//       tileId++
//     }
//   }

//   return lines
// }

// export default function FourthSection() {
//   const containerRef = useRef(null)
//   const groupRef = useRef(null)
//   const imageRef = useRef(null)
//   const image2Ref = useRef(null)
//   const dividerRef = useRef(null)
//   const strokeGroupRef = useRef(null)
//   const lineRefs = useRef([])
//   const [viewBox, setViewBox] = useState({ w: 1920, h: 1080 })

//   // ---------------------------------------------------------------------------
//   // Container ka actual size detect karna taaki accurate fit aaye
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     const updateDimensions = () => {
//       if (containerRef.current) {
//         const { width, height } = containerRef.current.getBoundingClientRect()
//         if (width > 0 && height > 0) {
//           setViewBox({ w: width, h: height })
//         }
//       }
//     }

//     updateDimensions()
//     const resizeObserver = new ResizeObserver(() => {
//       updateDimensions()
//     })

//     if (containerRef.current) {
//       resizeObserver.observe(containerRef.current)
//     }

//     return () => {
//       resizeObserver.disconnect()
//     }
//   }, [])

//   const allLines = useMemo(
//     () => buildTrianglePattern(viewBox.w, viewBox.h),
//     [viewBox]
//   )

//   const totalTiles = GRID.cols * GRID.rows

//   // ---------------------------------------------------------------------------
//   // Initial state
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     gsap.set(groupRef.current, { transformOrigin: '50% 50%', scale: 1 })
//     gsap.set(imageRef.current, { opacity: 0, scale: 1 })
//     gsap.set(image2Ref.current, { xPercent: 100 })
//     gsap.set(dividerRef.current, { xPercent: 100, opacity: 0 })
//     gsap.set(strokeGroupRef.current, { opacity: 1 })

//     lineRefs.current.forEach((line) => {
//       if (!line) return
//       const x1 = parseFloat(line.getAttribute('x1'))
//       const y1 = parseFloat(line.getAttribute('y1'))
//       const x2 = parseFloat(line.getAttribute('x2'))
//       const y2 = parseFloat(line.getAttribute('y2'))
//       const length = Math.hypot(x2 - x1, y2 - y1)
//       line.style.strokeDasharray = `${length}`
//       line.style.strokeDashoffset = `${length}`
//       line.dataset.length = length
//     })
//   }, [viewBox, allLines])

//   // ---------------------------------------------------------------------------
//   // Animation listeners
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     // Phase 1 — pattern draw-in
//     const handleShape = (e) => {
//       const progress = e.detail.progress

//       const staggerSpan = 0.6

//       lineRefs.current.forEach((line, i) => {
//         if (!line) return
//         const tileIndex = parseInt(line.dataset.tileIndex || 0, 10)
//         const start = (tileIndex / totalTiles) * staggerSpan
//         const local = Math.max(
//           0,
//           Math.min(1, (progress - start) / (1 - staggerSpan))
//         )
//         const length = parseFloat(line.dataset.length)
//         gsap.to(line, {
//           strokeDashoffset: length * (1 - local),
//           duration: 0.08,
//           ease: 'none',
//           overwrite: 'auto',
//         })
//       })
//     }

//     // Phase 2 — pattern fade-out, image1 fade-in
//     const handleImage = (e) => {
//       const progress = e.detail.progress
//       gsap.to(imageRef.current, {
//         opacity: progress,
//         duration: 0.15,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//       gsap.to(strokeGroupRef.current, {
//         opacity: 1 - progress,
//         duration: 0.15,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }

//     // Phase 3 — image2 right se left slide
//     const handleImage2 = (e) => {
//       const progress = e.detail.progress
//       gsap.to(image2Ref.current, {
//         xPercent: 100 - progress * 100,
//         duration: 0.15,
//         ease: 'power3.out',
//         overwrite: 'auto',
//       })
//       gsap.to(dividerRef.current, {
//         xPercent: 100 - progress * 100,
//         opacity: progress > 0.01 && progress < 0.99 ? 1 : 0,
//         duration: 0.15,
//         ease: 'power3.out',
//         overwrite: 'auto',
//       })
//     }

//     window.addEventListener('fourthShapeProgress', handleShape)
//     window.addEventListener('fourthImageProgress', handleImage)
//     window.addEventListener('fourthImage2Progress', handleImage2)
//     return () => {
//       window.removeEventListener('fourthShapeProgress', handleShape)
//       window.removeEventListener('fourthImageProgress', handleImage)
//       window.removeEventListener('fourthImage2Progress', handleImage2)
//     }
//   }, [totalTiles])

//   return (
//     <div className="fourth-section" ref={containerRef}>
//       {/* Image 1 */}
//       <div className="image-container" ref={imageRef}>
//         <img src={IMAGES.first} alt="Panel Design 1" className="revealed-image" />
//       </div>

//       {/* Image 2 — slider */}
//       <div className="image-container image-container-2" ref={image2Ref}>
//         <img src={IMAGES.second} alt="Panel Design 2" className="revealed-image" />
//       </div>

//       {/* Slider divider */}
//       <div className="slider-divider" ref={dividerRef} />

//       {/* SVG Overlay */}
//       <div className="svg-wrapper">
//         <svg
//           className="fourth-svg"
//           viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
//           preserveAspectRatio="none"
//         >
//           <g ref={groupRef}>
//             <g ref={strokeGroupRef}>
//               {allLines.map((l, i) => (
//                 <line
//                   key={l.id}
//                   ref={(el) => (lineRefs.current[i] = el)}
//                   x1={l.x1}
//                   y1={l.y1}
//                   x2={l.x2}
//                   y2={l.y2}
//                   stroke={l.color}
//                   strokeWidth={GRID.strokeWidth}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   data-tile-index={l.tileIndex}
//                 />
//               ))}
//             </g>
//           </g>
//         </svg>
//       </div>
//     </div>
//   )
// }



// // // ((((((((((((((((((((((((((((((((version 1))))))))))))))))))))))))))))))))



// 'use client'
// import { useEffect, useRef, useMemo, useState } from 'react'
// import gsap from 'gsap'
// import './FourthSection.css'

// // ============================================================
// // 🔧 GRID CONFIG
// // ============================================================
// const GRID = {
//   cols: 3,
//   rows: 2,
//   gap: 0,
//   marginX: 0,
//   marginY: 0,
//   // Reference image jaisa blue stroke
//   strokeColor: 'rgba(255, 255, 255,0.9)',
//   strokeWidth: 2,
// }

// const IMAGES = {
//   first: '/optimize/1.png',
//   second: '/optimize/2.png',
// }

// const BASE_W = 1920
// const BASE_H = 1080

// // ---------------------------------------------------------------------------
// // Ek tile ke andar 16 lines:
// //   - 8 lines: center -> boundary points (spokes)
// //   - 8 lines: octagon ring (boundary point -> next boundary point)
// // ---------------------------------------------------------------------------
// function buildTileLinesRect(x, y, w, h, tileId) {
//   const cx = x + w / 2
//   const cy = y + h / 2

//   // 8 boundary points — clockwise from top-mid
//   const P = [
//     [cx, y],           // 0 top-mid
//     [x + w, y],        // 1 top-right
//     [x + w, cy],       // 2 right-mid
//     [x + w, y + h],    // 3 bottom-right
//     [cx, y + h],       // 4 bottom-mid
//     [x, y + h],        // 5 bottom-left
//     [x, cy],           // 6 left-mid
//     [x, y],            // 7 top-left
//   ]

//   const lines = []

//   // 8 radial spokes: center -> boundary
//   P.forEach((p, i) => {
//     lines.push({
//       id: `${tileId}-c${i}`,
//       tileId,
//       x1: cx,
//       y1: cy,
//       x2: p[0],
//       y2: p[1],
//     })
//   })

//   // 8 octagon edges: boundary point -> next boundary point
//   P.forEach((p, i) => {
//     const n = P[(i + 1) % P.length]
//     lines.push({
//       id: `${tileId}-o${i}`,
//       tileId,
//       x1: p[0],
//       y1: p[1],
//       x2: n[0],
//       y2: n[1],
//     })
//   })

//   return lines
// }

// // ---------------------------------------------------------------------------
// // Poora grid — rectangular tiles, full bleed
// // ---------------------------------------------------------------------------
// function buildTrianglePattern(viewBoxW, viewBoxH) {
//   const { cols, rows, gap, marginX, marginY } = GRID

//   const availW = viewBoxW - marginX * 2 - gap * (cols - 1)
//   const availH = viewBoxH - marginY * 2 - gap * (rows - 1)

//   const tileW = availW / cols
//   const tileH = availH / rows

//   const startX = marginX
//   const startY = marginY

//   const tiles = []
//   let tileId = 0

//   for (let r = 0; r < rows; r++) {
//     for (let c = 0; c < cols; c++) {
//       const x = startX + c * (tileW + gap)
//       const y = startY + r * (tileH + gap)
//       tiles.push({
//         id: tileId,
//         lines: buildTileLinesRect(x, y, tileW, tileH, tileId),
//       })
//       tileId++
//     }
//   }

//   return tiles
// }

// export default function FourthSection() {
//   const groupRef = useRef(null)
//   const imageRef = useRef(null)
//   const image2Ref = useRef(null)
//   const dividerRef = useRef(null)
//   const strokeGroupRef = useRef(null)
//   const lineRefs = useRef([])
//   const [viewBox, setViewBox] = useState({ w: BASE_W, h: BASE_H })

//   const tiles = useMemo(
//     () => buildTrianglePattern(viewBox.w, viewBox.h),
//     [viewBox]
//   )

//   const allLines = useMemo(() => tiles.flatMap((t) => t.lines), [tiles])

//   // ---------------------------------------------------------------------------
//   // Image load → actual viewBox set karo
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     const img = new Image()
//     img.src = IMAGES.first
//     img.onload = () => {
//       setViewBox({ w: img.naturalWidth, h: img.naturalHeight })
//     }
//   }, [])

//   // ---------------------------------------------------------------------------
//   // Initial state
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     gsap.set(groupRef.current, { transformOrigin: '50% 50%', scale: 1.4 })
//     gsap.set(imageRef.current, { opacity: 0, scale: 1.1 })
//     gsap.set(image2Ref.current, { xPercent: 100 })
//     gsap.set(dividerRef.current, { xPercent: 100, opacity: 0 })
//     gsap.set(strokeGroupRef.current, { opacity: 1 })

//     lineRefs.current.forEach((line) => {
//       if (!line) return
//       const x1 = parseFloat(line.getAttribute('x1'))
//       const y1 = parseFloat(line.getAttribute('y1'))
//       const x2 = parseFloat(line.getAttribute('x2'))
//       const y2 = parseFloat(line.getAttribute('y2'))
//       const length = Math.hypot(x2 - x1, y2 - y1)
//       line.style.strokeDasharray = `${length}`
//       line.style.strokeDashoffset = `${length}`
//       line.dataset.length = length
//     })
//   }, [viewBox, tiles])

//   // ---------------------------------------------------------------------------
//   // Animation listeners
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     // Phase 1 — pattern draw-in
//     const handleShape = (e) => {
//       const progress = e.detail.progress

//       gsap.to(groupRef.current, {
//         scale: 1.4 - progress * 0.4,
//         duration: 0.08,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })

//       const totalTiles = tiles.length
//       const staggerSpan = 0.6
//       const LINES_PER_TILE = 16   // 👈 16 lines per tile

//       lineRefs.current.forEach((line, i) => {
//         if (!line) return
//         const tileIndex = Math.floor(i / LINES_PER_TILE)
//         const start = (tileIndex / totalTiles) * staggerSpan
//         const local = Math.max(
//           0,
//           Math.min(1, (progress - start) / (1 - staggerSpan))
//         )
//         const length = parseFloat(line.dataset.length)
//         gsap.to(line, {
//           strokeDashoffset: length * (1 - local),
//           duration: 0.08,
//           ease: 'none',
//           overwrite: 'auto',
//         })
//       })
//     }

//     // Phase 2 — pattern fade-out, image1 fade-in
//     const handleImage = (e) => {
//       const progress = e.detail.progress
//       gsap.to(imageRef.current, {
//         opacity: progress,
//         scale: 1.1 - progress * 0.1,
//         duration: 0.15,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//       gsap.to(strokeGroupRef.current, {
//         opacity: 1 - progress,
//         duration: 0.15,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }

//     // Phase 3 — image2 right se left slide
//     const handleImage2 = (e) => {
//       const progress = e.detail.progress
//       gsap.to(image2Ref.current, {
//         xPercent: 100 - progress * 100,
//         duration: 0.15,
//         ease: 'power3.out',
//         overwrite: 'auto',
//       })
//       gsap.to(dividerRef.current, {
//         xPercent: 100 - progress * 100,
//         opacity: progress > 0.01 && progress < 0.99 ? 1 : 0,
//         duration: 0.15,
//         ease: 'power3.out',
//         overwrite: 'auto',
//       })
//     }

//     window.addEventListener('fourthShapeProgress', handleShape)
//     window.addEventListener('fourthImageProgress', handleImage)
//     window.addEventListener('fourthImage2Progress', handleImage2)
//     return () => {
//       window.removeEventListener('fourthShapeProgress', handleShape)
//       window.removeEventListener('fourthImageProgress', handleImage)
//       window.removeEventListener('fourthImage2Progress', handleImage2)
//     }
//   }, [tiles])

//   return (
//     <div className="fourth-section">
//       {/* Image 1 */}
//       <div className="image-container" ref={imageRef}>
//         <img src={IMAGES.first} alt="Panel Design 1" className="revealed-image" />
//       </div>

//       {/* Image 2 — slider */}
//       <div className="image-container image-container-2" ref={image2Ref}>
//         <img src={IMAGES.second} alt="Panel Design 2" className="revealed-image" />
//       </div>

//       {/* Slider divider */}
//       <div className="slider-divider" ref={dividerRef} />

//       {/* SVG Overlay */}
//       <div className="svg-wrapper">
//         <svg
//   className="fourth-svg"
//   viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
//   preserveAspectRatio="none"
// >
//           <g ref={groupRef}>
//             <g ref={strokeGroupRef}>
//               {allLines.map((l, i) => (
//                 <line
//                   key={l.id}
//                   ref={(el) => (lineRefs.current[i] = el)}
//                   x1={l.x1}
//                   y1={l.y1}
//                   x2={l.x2}
//                   y2={l.y2}
//                   stroke={GRID.strokeColor}
//                   strokeWidth={GRID.strokeWidth}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               ))}
//             </g>
//           </g>
//         </svg>
//       </div>
//     </div>
//   )
// }


// // ((((((((((((((((((((((((((((((((version 1))))))))))))))))))))))))))))))))



// 'use client'
// import { useEffect, useRef, useMemo, useState } from 'react'
// import gsap from 'gsap'
// import './FourthSection.css'

// // ============================================================
// // 🔧 GRID CONFIG
// // ============================================================
// const GRID = {
//   cols: 6,
//   rows: 4,
//   gap: 0,
//   marginX: 0,        // 0 = full bleed, koi half column nahi
//   marginY: 0,
//   strokeColor: 'rgba(255, 255, 255, 0.9)',   // 👈 blue reference jaisa
//   strokeWidth: 2,
// }

// const IMAGES = {
//   first: '/optimize/2.png',
//   second: '/optimize/1.png',
// }

// const BASE_W = 1920
// const BASE_H = 1080

// // ---------------------------------------------------------------------------
// // Ek tile ke andar 16 lines:
// //   - 8 lines: center -> boundary points (spokes)
// //   - 8 lines: octagon ring (boundary point -> next boundary point)
// // ---------------------------------------------------------------------------
// function buildTileLinesRect(x, y, w, h, tileId) {
//   const cx = x + w / 1.5
//   const cy = y + h / 2.2

//   // 8 boundary points — clockwise from top-mid
//   const P = [
//     [cx, y],           // 0 top-mid
//     [x + w, y],        // 1 top-right
//     [x + w, cy],       // 2 right-mid
//     [x + w, y + h],    // 3 bottom-right
//     [cx, y + h],       // 4 bottom-mid
//     [x, y + h],        // 5 bottom-left
//     [x, cy],           // 6 left-mid
//     [x, y],            // 7 top-left
//   ]

//   const lines = []

//   // 8 radial spokes: center -> boundary
//   P.forEach((p, i) => {
//     lines.push({
//       id: `${tileId}-c${i}`,
//       tileId,
//       x1: cx,
//       y1: cy,
//       x2: p[0],
//       y2: p[1],
//     })
//   })

//   // 8 octagon edges: boundary point -> next boundary point
//   P.forEach((p, i) => {
//     const n = P[(i + 1) % P.length]
//     lines.push({
//       id: `${tileId}-o${i}`,
//       tileId,
//       x1: p[0],
//       y1: p[1],
//       x2: n[0],
//       y2: n[1],
//     })
//   })

//   return lines
// }

// // ---------------------------------------------------------------------------
// // Poora grid — rectangular tiles, full bleed
// // ---------------------------------------------------------------------------
// function buildTrianglePattern(viewBoxW, viewBoxH) {
//   const { cols, rows, gap, marginX, marginY } = GRID

//   const availW = viewBoxW - marginX * 2 - gap * (cols - 1)
//   const availH = viewBoxH - marginY * 2 - gap * (rows - 1)

//   const tileW = availW / cols
//   const tileH = availH / rows

//   const startX = marginX
//   const startY = marginY

//   const tiles = []
//   let tileId = 0

//   for (let r = 0; r < rows; r++) {
//     for (let c = 0; c < cols; c++) {
//       const x = startX + c * (tileW + gap)
//       const y = startY + r * (tileH + gap)
//       tiles.push({
//         id: tileId,
//         lines: buildTileLinesRect(x, y, tileW, tileH, tileId),
//       })
//       tileId++
//     }
//   }

//   return tiles
// }

// export default function FourthSection() {
//   const groupRef = useRef(null)
//   const imageRef = useRef(null)
//   const image2Ref = useRef(null)
//   const dividerRef = useRef(null)
//   const strokeGroupRef = useRef(null)
//   const lineRefs = useRef([])
//   const [viewBox, setViewBox] = useState({ w: BASE_W, h: BASE_H })

//   const tiles = useMemo(
//     () => buildTrianglePattern(viewBox.w, viewBox.h),
//     [viewBox]
//   )

//   const allLines = useMemo(() => tiles.flatMap((t) => t.lines), [tiles])

//   // ---------------------------------------------------------------------------
//   // Image load → actual viewBox set karo
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     const img = new Image()
//     img.src = IMAGES.first
//     img.onload = () => {
//       setViewBox({ w: img.naturalWidth, h: img.naturalHeight })
//     }
//   }, [])

//   // ---------------------------------------------------------------------------
//   // Initial state
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     gsap.set(groupRef.current, { transformOrigin: '50% 50%', scale: 1.4 })
//     gsap.set(imageRef.current, { opacity: 0, scale: 1.1 })
//     gsap.set(image2Ref.current, { xPercent: 100 })
//     gsap.set(dividerRef.current, { xPercent: 100, opacity: 0 })
//     gsap.set(strokeGroupRef.current, { opacity: 1 })

//     lineRefs.current.forEach((line) => {
//       if (!line) return
//       const x1 = parseFloat(line.getAttribute('x1'))
//       const y1 = parseFloat(line.getAttribute('y1'))
//       const x2 = parseFloat(line.getAttribute('x2'))
//       const y2 = parseFloat(line.getAttribute('y2'))
//       const length = Math.hypot(x2 - x1, y2 - y1)
//       line.style.strokeDasharray = `${length}`
//       line.style.strokeDashoffset = `${length}`
//       line.dataset.length = length
//     })
//   }, [viewBox, tiles])

//   // ---------------------------------------------------------------------------
//   // Animation listeners
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     // Phase 1 — pattern draw-in
//     const handleShape = (e) => {
//       const progress = e.detail.progress

//       gsap.to(groupRef.current, {
//         scale: 1.4 - progress * 0.4,
//         duration: 0.08,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })

//       const totalTiles = tiles.length
//       const staggerSpan = 0.6
//       const LINES_PER_TILE = 16   // 👈 16 lines per tile

//       lineRefs.current.forEach((line, i) => {
//         if (!line) return
//         const tileIndex = Math.floor(i / LINES_PER_TILE)
//         const start = (tileIndex / totalTiles) * staggerSpan
//         const local = Math.max(
//           0,
//           Math.min(1, (progress - start) / (1 - staggerSpan))
//         )
//         const length = parseFloat(line.dataset.length)
//         gsap.to(line, {
//           strokeDashoffset: length * (1 - local),
//           duration: 0.08,
//           ease: 'none',
//           overwrite: 'auto',
//         })
//       })
//     }

//     // Phase 2 — pattern fade-out, image1 fade-in
//     const handleImage = (e) => {
//       const progress = e.detail.progress
//       gsap.to(imageRef.current, {
//         opacity: progress,
//         scale: 1.1 - progress * 0.1,
//         duration: 0.15,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//       gsap.to(strokeGroupRef.current, {
//         opacity: 1 - progress,
//         duration: 0.15,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }

//     // Phase 3 — image2 right se left slide
//     const handleImage2 = (e) => {
//       const progress = e.detail.progress
//       gsap.to(image2Ref.current, {
//         xPercent: 100 - progress * 100,
//         duration: 0.15,
//         ease: 'power3.out',
//         overwrite: 'auto',
//       })
//       gsap.to(dividerRef.current, {
//         xPercent: 100 - progress * 100,
//         opacity: progress > 0.01 && progress < 0.99 ? 1 : 0,
//         duration: 0.15,
//         ease: 'power3.out',
//         overwrite: 'auto',
//       })
//     }

//     window.addEventListener('fourthShapeProgress', handleShape)
//     window.addEventListener('fourthImageProgress', handleImage)
//     window.addEventListener('fourthImage2Progress', handleImage2)
//     return () => {
//       window.removeEventListener('fourthShapeProgress', handleShape)
//       window.removeEventListener('fourthImageProgress', handleImage)
//       window.removeEventListener('fourthImage2Progress', handleImage2)
//     }
//   }, [tiles])

//   return (
//     <div className="fourth-section">
//       {/* Image 1 */}
//       <div className="image-container" ref={imageRef}>
//         <img src={IMAGES.first} alt="Panel Design 1" className="revealed-image" />
//       </div>

//       {/* Image 2 — slider */}
//       <div className="image-container image-container-2" ref={image2Ref}>
//         <img src={IMAGES.second} alt="Panel Design 2" className="revealed-image" />
//       </div>

//       {/* Slider divider */}
//       <div className="slider-divider" ref={dividerRef} />

//       {/* SVG Overlay */}
//       <div className="svg-wrapper">
//         <svg
//           className="fourth-svg"
//           viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
//           preserveAspectRatio="xMidYMid slice"
//         >
//           <g ref={groupRef}>
//             <g ref={strokeGroupRef}>
//               {allLines.map((l, i) => (
//                 <line
//                   key={l.id}
//                   ref={(el) => (lineRefs.current[i] = el)}
//                   x1={l.x1}
//                   y1={l.y1}
//                   x2={l.x2}
//                   y2={l.y2}
//                   stroke={GRID.strokeColor}
//                   strokeWidth={GRID.strokeWidth}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               ))}
//             </g>
//           </g>
//         </svg>
//       </div>
//     </div>
//   )
// }







// // ((((((((((((((((((((((((((((((((version 1))))))))))))))))))))))))))))))))



// 'use client'
// import { useEffect, useRef, useMemo, useState } from 'react'
// import gsap from 'gsap'
// import './FourthSection.css'

// // ============================================================
// // 🔧 GRID CONFIG
// // ============================================================
// const GRID = {
//   cols: 6,
//   rows: 4,
//   gap: 0,
//   marginX: 0,        // 0 = full bleed, koi half column nahi
//   marginY: 0,
//   strokeColor: 'rgba(255, 255, 255, 0.9)',   // 👈 blue reference jaisa
//   strokeWidth: 2,
// }

// const IMAGES = {
//   first: '/optimize/1.png',
//   second: '/optimize/2.png',
// }

// const BASE_W = 1920
// const BASE_H = 1080

// // ---------------------------------------------------------------------------
// // Ek tile ke andar 16 lines:
// //   - 8 lines: center -> boundary points (spokes)
// //   - 8 lines: octagon ring (boundary point -> next boundary point)
// // ---------------------------------------------------------------------------
// function buildTileLinesRect(x, y, w, h, tileId) {
//   const cx = x + w / 2
//   const cy = y + h / 2

//   // 8 boundary points — clockwise from top-mid
//   const P = [
//     [cx, y],           // 0 top-mid
//     [x + w, y],        // 1 top-right
//     [x + w, cy],       // 2 right-mid
//     [x + w, y + h],    // 3 bottom-right
//     [cx, y + h],       // 4 bottom-mid
//     [x, y + h],        // 5 bottom-left
//     [x, cy],           // 6 left-mid
//     [x, y],            // 7 top-left
//   ]

//   const lines = []

//   // 8 radial spokes: center -> boundary
//   P.forEach((p, i) => {
//     lines.push({
//       id: `${tileId}-c${i}`,
//       tileId,
//       x1: cx,
//       y1: cy,
//       x2: p[0],
//       y2: p[1],
//     })
//   })

//   // 8 octagon edges: boundary point -> next boundary point
//   P.forEach((p, i) => {
//     const n = P[(i + 1) % P.length]
//     lines.push({
//       id: `${tileId}-o${i}`,
//       tileId,
//       x1: p[0],
//       y1: p[1],
//       x2: n[0],
//       y2: n[1],
//     })
//   })

//   return lines
// }

// // ---------------------------------------------------------------------------
// // Poora grid — rectangular tiles, full bleed
// // ---------------------------------------------------------------------------
// function buildTrianglePattern(viewBoxW, viewBoxH) {
//   const { cols, rows, gap, marginX, marginY } = GRID

//   const availW = viewBoxW - marginX * 2 - gap * (cols - 1)
//   const availH = viewBoxH - marginY * 2 - gap * (rows - 1)

//   const tileW = availW / cols
//   const tileH = availH / rows

//   const startX = marginX
//   const startY = marginY

//   const tiles = []
//   let tileId = 0

//   for (let r = 0; r < rows; r++) {
//     for (let c = 0; c < cols; c++) {
//       const x = startX + c * (tileW + gap)
//       const y = startY + r * (tileH + gap)
//       tiles.push({
//         id: tileId,
//         lines: buildTileLinesRect(x, y, tileW, tileH, tileId),
//       })
//       tileId++
//     }
//   }

//   return tiles
// }

// export default function FourthSection() {
//   const groupRef = useRef(null)
//   const imageRef = useRef(null)
//   const image2Ref = useRef(null)
//   const dividerRef = useRef(null)
//   const strokeGroupRef = useRef(null)
//   const lineRefs = useRef([])
//   const [viewBox, setViewBox] = useState({ w: BASE_W, h: BASE_H })

//   const tiles = useMemo(
//     () => buildTrianglePattern(viewBox.w, viewBox.h),
//     [viewBox]
//   )

//   const allLines = useMemo(() => tiles.flatMap((t) => t.lines), [tiles])

//   // ---------------------------------------------------------------------------
//   // Image load → actual viewBox set karo
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     const img = new Image()
//     img.src = IMAGES.first
//     img.onload = () => {
//       setViewBox({ w: img.naturalWidth, h: img.naturalHeight })
//     }
//   }, [])

//   // ---------------------------------------------------------------------------
//   // Initial state
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     gsap.set(groupRef.current, { transformOrigin: '50% 50%', scale: 1.4 })
//     gsap.set(imageRef.current, { opacity: 0, scale: 1.1 })
//     gsap.set(image2Ref.current, { xPercent: 100 })
//     gsap.set(dividerRef.current, { xPercent: 100, opacity: 0 })
//     gsap.set(strokeGroupRef.current, { opacity: 1 })

//     lineRefs.current.forEach((line) => {
//       if (!line) return
//       const x1 = parseFloat(line.getAttribute('x1'))
//       const y1 = parseFloat(line.getAttribute('y1'))
//       const x2 = parseFloat(line.getAttribute('x2'))
//       const y2 = parseFloat(line.getAttribute('y2'))
//       const length = Math.hypot(x2 - x1, y2 - y1)
//       line.style.strokeDasharray = `${length}`
//       line.style.strokeDashoffset = `${length}`
//       line.dataset.length = length
//     })
//   }, [viewBox, tiles])

//   // ---------------------------------------------------------------------------
//   // Animation listeners
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     // Phase 1 — pattern draw-in
//     const handleShape = (e) => {
//       const progress = e.detail.progress

//       gsap.to(groupRef.current, {
//         scale: 1.4 - progress * 0.4,
//         duration: 0.08,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })

//       const totalTiles = tiles.length
//       const staggerSpan = 0.6
//       const LINES_PER_TILE = 16   // 👈 16 lines per tile

//       lineRefs.current.forEach((line, i) => {
//         if (!line) return
//         const tileIndex = Math.floor(i / LINES_PER_TILE)
//         const start = (tileIndex / totalTiles) * staggerSpan
//         const local = Math.max(
//           0,
//           Math.min(1, (progress - start) / (1 - staggerSpan))
//         )
//         const length = parseFloat(line.dataset.length)
//         gsap.to(line, {
//           strokeDashoffset: length * (1 - local),
//           duration: 0.08,
//           ease: 'none',
//           overwrite: 'auto',
//         })
//       })
//     }

//     // Phase 2 — pattern fade-out, image1 fade-in
//     const handleImage = (e) => {
//       const progress = e.detail.progress
//       gsap.to(imageRef.current, {
//         opacity: progress,
//         scale: 1.1 - progress * 0.1,
//         duration: 0.15,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//       gsap.to(strokeGroupRef.current, {
//         opacity: 1 - progress,
//         duration: 0.15,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }

//     // Phase 3 — image2 right se left slide
//     const handleImage2 = (e) => {
//       const progress = e.detail.progress
//       gsap.to(image2Ref.current, {
//         xPercent: 100 - progress * 100,
//         duration: 0.15,
//         ease: 'power3.out',
//         overwrite: 'auto',
//       })
//       gsap.to(dividerRef.current, {
//         xPercent: 100 - progress * 100,
//         opacity: progress > 0.01 && progress < 0.99 ? 1 : 0,
//         duration: 0.15,
//         ease: 'power3.out',
//         overwrite: 'auto',
//       })
//     }

//     window.addEventListener('fourthShapeProgress', handleShape)
//     window.addEventListener('fourthImageProgress', handleImage)
//     window.addEventListener('fourthImage2Progress', handleImage2)
//     return () => {
//       window.removeEventListener('fourthShapeProgress', handleShape)
//       window.removeEventListener('fourthImageProgress', handleImage)
//       window.removeEventListener('fourthImage2Progress', handleImage2)
//     }
//   }, [tiles])

//   return (
//     <div className="fourth-section">
//       {/* Image 1 */}
//       <div className="image-container" ref={imageRef}>
//         <img src={IMAGES.first} alt="Panel Design 1" className="revealed-image" />
//       </div>

//       {/* Image 2 — slider */}
//       <div className="image-container image-container-2" ref={image2Ref}>
//         <img src={IMAGES.second} alt="Panel Design 2" className="revealed-image" />
//       </div>

//       {/* Slider divider */}
//       <div className="slider-divider" ref={dividerRef} />

//       {/* SVG Overlay */}
//       <div className="svg-wrapper">
//         <svg
//           className="fourth-svg"
//           viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
//           preserveAspectRatio="xMidYMid slice"
//         >
//           <g ref={groupRef}>
//             <g ref={strokeGroupRef}>
//               {allLines.map((l, i) => (
//                 <line
//                   key={l.id}
//                   ref={(el) => (lineRefs.current[i] = el)}
//                   x1={l.x1}
//                   y1={l.y1}
//                   x2={l.x2}
//                   y2={l.y2}
//                   stroke={GRID.strokeColor}
//                   strokeWidth={GRID.strokeWidth}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               ))}
//             </g>
//           </g>
//         </svg>
//       </div>
//     </div>
//   )
// }
















// 'use client'
// import { useEffect, useRef, useMemo, useState } from 'react'
// import gsap from 'gsap'
// import './FourthSection.css'

// const BASE_W = 1920
// const BASE_H = 1080

// // Top offset — image me shelf top se kitna neeche shuru hota hai
// const TOP_OFFSET = 170

// // Har column: x (left position), w (width), heights array, gaps array
// // Image dekh ke approximate values — tu fine-tune kar sakta hai
// const COLUMNS = [
//   // Col 1 — full height tall piece (top to bottom)
//   { x: 140, w: 180, heights: [480, 140, 250], gaps: [0, 0] },

//   // Col 2 — tall oval on top, circle, oval
//   { x: 325, w: 180, heights: [190, 410, 150, 150], gaps: [0, 0, 0] },

//   // Col 3 — 2 tall pieces
//   { x: 510, w: 180, heights: [340, 340, 200], gaps: [0, 0] },

//   // Col 4 — 4 pieces (oval, circle, oval, circle)
//   { x: 695, w: 180, heights: [150, 320, 150, 250], gaps: [0, 0, 0, 0] },

//   // Col 5 — oval, circle, tall oval, circle
//   { x: 880, w: 180, heights: [280, 150, 460], gaps: [0, 0, 0] },

//   // Col 6 — same pattern
//   { x: 1065, w: 180, heights: [460, 150, 280], gaps: [0, 0, 0] },

//   // Col 7 — tall dark, circle, oval
//   { x: 1250, w: 180, heights: [200, 400, 150, 150], gaps: [0, 0, 0] },

//   // Col 8 — oval, oval, tall green, circle
//   { x: 1435, w: 180, heights: [350, 350, 200], gaps: [0, 0, 0] },

//   // Col 9 — tall dark, circle, oval
//   { x: 1620, w: 180, heights: [150, 350, 150, 250], gaps: [0, 0, 0] },

//   // Col 10 — circle, tall oval, wood piece
//   { x: 1805, w: 180, heights: [300, 150, 450], gaps: [0, 0, 0] },
// ]

// function buildShapes() {
//   const shapes = []
//   let id = 0

//   COLUMNS.forEach((col) => {
//     let y = TOP_OFFSET
//     col.heights.forEach((h, i) => {
//       shapes.push({
//         id: id++,
//         x: col.x,
//         y,
//         w: col.w,
//         h,
//         rx: col.w / 2,
//       })
//       y += h + (col.gaps[i] ?? 25)
//     })
//   })

//   return shapes
// }

// export default function FourthSection() {
//   const groupRef = useRef(null)
//   const imageRef = useRef(null)
//   const strokeGroupRef = useRef(null)
//   const rectStrokeRefs = useRef([])
//   const [viewBox, setViewBox] = useState({ w: BASE_W, h: BASE_H })

//   const shapes = useMemo(() => buildShapes(), [])

//   // ---------------------------------------------------------------------------
//   // Image load hone pe actual aspect ratio nikaal, viewBox update kar
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     const img = new Image()
//     img.src = '/images/desire-1.webp'
//     img.onload = () => {
//       setViewBox({ w: img.naturalWidth, h: img.naturalHeight })
//     }
//   }, [])

//   // ---------------------------------------------------------------------------
//   // Initial state
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     gsap.set(groupRef.current, { transformOrigin: '50% 50%', scale: 1.4 })
//     gsap.set(imageRef.current, { opacity: 0, scale: 1.1 })
//     gsap.set(strokeGroupRef.current, { opacity: 1 })

//     rectStrokeRefs.current.forEach((rect) => {
//       if (!rect) return
//       const w = parseFloat(rect.getAttribute('width'))
//       const h = parseFloat(rect.getAttribute('height'))
//       const rx = parseFloat(rect.getAttribute('rx'))
//       const perimeter = 2 * (w - 2 * rx) + 2 * (h - 2 * rx) + 2 * Math.PI * rx
//       rect.style.strokeDasharray = `${perimeter}`
//       rect.style.strokeDashoffset = `${perimeter}`
//       rect.dataset.perimeter = perimeter
//     })
//   }, [viewBox])

//   // ---------------------------------------------------------------------------
//   // Animations
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     const handleShape = (e) => {
//       const progress = e.detail.progress

//       gsap.to(groupRef.current, {
//         scale: 1.4 - progress * 0.4,
//         duration: 0.08,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })

//       const total = rectStrokeRefs.current.length
//       const staggerSpan = 0.6
//       rectStrokeRefs.current.forEach((rect, i) => {
//         if (!rect) return
//         const start = (i / total) * staggerSpan
//         const local = Math.max(0, Math.min(1, (progress - start) / (1 - staggerSpan)))
//         const perimeter = parseFloat(rect.dataset.perimeter)
//         gsap.to(rect, {
//           strokeDashoffset: perimeter * (1 - local),
//           duration: 0.08,
//           ease: 'none',
//           overwrite: 'auto',
//         })
//       })
//     }

//     const handleImage = (e) => {
//       const progress = e.detail.progress
//       gsap.to(imageRef.current, {
//         opacity: progress,
//         scale: 1.1 - progress * 0.1,
//         duration: 0.15,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//       gsap.to(strokeGroupRef.current, {
//         opacity: 1 - progress,
//         duration: 0.15,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//     }

//     window.addEventListener('fourthShapeProgress', handleShape)
//     window.addEventListener('fourthImageProgress', handleImage)
//     return () => {
//       window.removeEventListener('fourthShapeProgress', handleShape)
//       window.removeEventListener('fourthImageProgress', handleImage)
//     }
//   }, [])

//   return (
//     <div className="fourth-section">
//       {/* Background Image — same viewBox aspect */}
//       <div className="image-container" ref={imageRef}>
//         <img
//           src="/optimize/desire-1.png"
//           alt="Revealed Section"
//           className="revealed-image"
//         />
//       </div>

//       {/* SVG Overlay — same aspect, same position */}
//       <div className="svg-wrapper">
//         <svg
//           className="fourth-svg"
//           viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
//           preserveAspectRatio="xMidYMid slice"
//         >
//           <g ref={groupRef}>
//             <g ref={strokeGroupRef}>
//               {shapes.map((s, i) => (
//                 <rect
//                   key={s.id}
//                   ref={(el) => (rectStrokeRefs.current[i] = el)}
//                   x={s.x}
//                   y={s.y}
//                   width={s.w}
//                   height={s.h}
//                   rx={s.rx}
//                   ry={s.rx}
//                   fill="none"
//                   stroke="rgba(255, 255, 255, 0.85)"
//                   strokeWidth="1.5"
//                 />
//               ))}
//             </g>
//           </g>
//         </svg>
//       </div>
//     </div>
//   )
// }
