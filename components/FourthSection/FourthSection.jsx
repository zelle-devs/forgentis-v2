'use client'

import { useEffect, useRef, useMemo, useState } from 'react'
import gsap from 'gsap'
import './FourthSection.css'

// ============================================================
// GRID & PATTERN CONFIG
// ============================================================

const GRID = {
  cols: 6,
  rows: 2.5,
  gap: 0,
  marginX: 0,
  marginY: 0,
  strokeWidth: 2,
}

const PATTERN_CONFIG = {
  peakXType: 'alternating',
  peakYRatio: 0.5,

  innerXRatio: 0.38,
  innerYRatio: 0.47,

  referenceLeft: 0.14,
  referenceWidth: 0.745,
  referenceTop: 0.02,
  referenceHeight: 1,
}

const IMAGES = {
  first: '/optimize/forgentis.jpeg',
  second: '/optimize/2.png',
}

// ============================================================
// REMOVE EXACT DUPLICATE SVG LINES
// ============================================================

function removeDuplicateLines(lines) {
  const seen = new Set()

  return lines.filter((line) => {
    const x1 = Number(line.x1).toFixed(4)
    const y1 = Number(line.y1).toFixed(4)
    const x2 = Number(line.x2).toFixed(4)
    const y2 = Number(line.y2).toFixed(4)

    const pointA = `${x1},${y1}`
    const pointB = `${x2},${y2}`

    const key =
      pointA < pointB
        ? `${pointA}|${pointB}`
        : `${pointB}|${pointA}`

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

// ============================================================
// TRIANGULAR FACET PATTERN GENERATOR
// ============================================================

function buildTrianglePattern(viewBoxW, viewBoxH) {
  const { cols, rows, gap, marginX, marginY } = GRID

  const availW =
    viewBoxW -
    marginX * 2 -
    gap * (cols - 1)

  const availH =
    viewBoxH -
    marginY * 2 -
    gap * (rows - 1)

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
      const x =
        startX +
        c * (tileW + gap)

      const y =
        startY +
        r * (tileH + gap)

      const OPPOSITE_Y_OFFSET_RATIO = 0.5053

      const oppositeYOffset =
        tileH * OPPOSITE_Y_OFFSET_RATIO

      const TL = [x, y]

      const TR = [
        x + tileW,
        y,
      ]

      const BR = [
        x + tileW,
        y + tileH,
      ]

      const BL = [
        x,
        y + tileH,
      ]

      const isEvenCol = c % 2 === 0

      const peakX = isEvenCol
        ? x + tileW
        : x

      const peakY =
        y +
        tileH *
          PATTERN_CONFIG.peakYRatio

      const PEAK = [
        peakX,
        peakY,
      ]

      const innerX = isEvenCol
        ? x +
          tileW *
            PATTERN_CONFIG.innerXRatio
        : x +
          tileW *
            (1 -
              PATTERN_CONFIG.innerXRatio)

      const innerY =
        y +
        tileH *
          PATTERN_CONFIG.innerYRatio

      const INNER = [
        innerX,
        innerY,
      ]

      const mainTop = isEvenCol
        ? TL
        : TR

      const mainBottom = isEvenCol
        ? BL
        : BR

      // ========================================================
      // VERTICAL COLUMN BOUNDARIES
      // ========================================================

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
      // MAIN TRIANGLE OUTER EDGES
      // ========================================================

      lines.push(
        {
          id: `t${tileId}-main-top`,
          x1: mainTop[0],
          y1: mainTop[1],
          x2: PEAK[0],
          y2: PEAK[1],
          color: '#FFFFFF',
          tileIndex: tileId,
        },
        {
          id: `t${tileId}-main-bottom`,
          x1: PEAK[0],
          y1: PEAK[1],
          x2: mainBottom[0],
          y2: mainBottom[1],
          color: '#FFFFFF',
          tileIndex: tileId,
        }
      )

      // ========================================================
      // MAIN TRIANGLE — 3 INTERNAL LINES
      // ========================================================

      lines.push(
        {
          id: `t${tileId}-main-inner-top`,
          x1: INNER[0],
          y1: INNER[1],
          x2: mainTop[0],
          y2: mainTop[1],
          color: '#FFFFFF',
          tileIndex: tileId,
        },
        {
          id: `t${tileId}-main-inner-bottom`,
          x1: INNER[0],
          y1: INNER[1],
          x2: mainBottom[0],
          y2: mainBottom[1],
          color: '#FFFFFF',
          tileIndex: tileId,
        },
        {
          id: `t${tileId}-main-inner-peak`,
          x1: INNER[0],
          y1: INNER[1],
          x2: PEAK[0],
          y2: PEAK[1],
          color: '#FFFFFF',
          tileIndex: tileId,
        }
      )

      // ========================================================
      // OPPOSITE TRIANGLE
      // ========================================================

      const oppositePeakX = isEvenCol
        ? x
        : x + tileW

      const OPPOSITE_PEAK = [
        oppositePeakX,
        peakY + oppositeYOffset,
      ]

      const oppositeTop = isEvenCol
        ? [
            TR[0],
            TR[1] +
              oppositeYOffset,
          ]
        : [
            TL[0],
            TL[1] +
              oppositeYOffset,
          ]

      const oppositeBottom = isEvenCol
        ? [
            BR[0],
            BR[1] +
              oppositeYOffset,
          ]
        : [
            BL[0],
            BL[1] +
              oppositeYOffset,
          ]

      // ========================================================
      // OPPOSITE TRIANGLE OUTER EDGES
      // ========================================================

      lines.push(
        {
          id: `t${tileId}-opposite-top`,
          x1: oppositeTop[0],
          y1: oppositeTop[1],
          x2: OPPOSITE_PEAK[0],
          y2: OPPOSITE_PEAK[1],
          color: '#FFFFFF',
          tileIndex: tileId,
        },
        {
          id: `t${tileId}-opposite-bottom`,
          x1: OPPOSITE_PEAK[0],
          y1: OPPOSITE_PEAK[1],
          x2: oppositeBottom[0],
          y2: oppositeBottom[1],
          color: '#FFFFFF',
          tileIndex: tileId,
        }
      )

      // ========================================================
      // OPPOSITE INNER POINT
      // ========================================================

      const oppositeInnerX = isEvenCol
        ? x +
          tileW *
            (1 -
              PATTERN_CONFIG.innerXRatio)
        : x +
          tileW *
            PATTERN_CONFIG.innerXRatio

      const OPPOSITE_INNER = [
        oppositeInnerX,
        innerY + oppositeYOffset,
      ]

      // ========================================================
      // OPPOSITE TRIANGLE — 3 INTERNAL LINES
      // ========================================================

      lines.push(
        {
          id: `t${tileId}-opposite-inner-top`,
          x1: OPPOSITE_INNER[0],
          y1: OPPOSITE_INNER[1],
          x2: oppositeTop[0],
          y2: oppositeTop[1],
          color: '#FFFFFF',
          tileIndex: tileId,
        },
        {
          id: `t${tileId}-opposite-inner-bottom`,
          x1: OPPOSITE_INNER[0],
          y1: OPPOSITE_INNER[1],
          x2: oppositeBottom[0],
          y2: oppositeBottom[1],
          color: '#FFFFFF',
          tileIndex: tileId,
        },
        {
          id: `t${tileId}-opposite-inner-peak`,
          x1: OPPOSITE_INNER[0],
          y1: OPPOSITE_INNER[1],
          x2: OPPOSITE_PEAK[0],
          y2: OPPOSITE_PEAK[1],
          color: '#FFFFFF',
          tileIndex: tileId,
        }
      )

      tileId++
    }
  }

  return removeDuplicateLines(lines)
}

// ============================================================
// FOURTH SECTION
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

      const {
        width,
        height,
      } =
        containerRef.current.getBoundingClientRect()

      if (
        width > 0 &&
        height > 0
      ) {
        setViewBox({
          w: width,
          h: height,
        })
      }
    }

    updateDimensions()

    const resizeObserver =
      new ResizeObserver(() => {
        updateDimensions()
      })

    if (containerRef.current) {
      resizeObserver.observe(
        containerRef.current
      )
    }

    window.addEventListener(
      'resize',
      updateDimensions
    )

    return () => {
      resizeObserver.disconnect()

      window.removeEventListener(
        'resize',
        updateDimensions
      )
    }
  }, [])

  // ============================================================
  // GENERATE SVG
  // ============================================================

  const allLines = useMemo(
    () =>
      buildTrianglePattern(
        viewBox.w,
        viewBox.h
      ),
    [viewBox]
  )

  const totalTiles =
    GRID.cols * GRID.rows

  // ============================================================
  // INITIAL SVG STATE
  // ============================================================

  useEffect(() => {
    if (!groupRef.current) return

    // ----------------------------------------------------------
    // IMPORTANT:
    // Image starts completely hidden.
    // ----------------------------------------------------------

    gsap.set(groupRef.current, {
      transformOrigin: '50% 50%',
      scale: 1,
    })

    gsap.set(imageRef.current, {
      opacity: 0,
      xPercent: 0,
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

    // ==========================================================
    // RESET LINE DRAWING
    // ==========================================================

    lineRefs.current.forEach(
      (line) => {
        if (!line) return

        const x1 = parseFloat(
          line.getAttribute('x1')
        )

        const y1 = parseFloat(
          line.getAttribute('y1')
        )

        const x2 = parseFloat(
          line.getAttribute('x2')
        )

        const y2 = parseFloat(
          line.getAttribute('y2')
        )

        const length = Math.hypot(
          x2 - x1,
          y2 - y1
        )

        line.style.strokeDasharray =
          `${length}`

        line.style.strokeDashoffset =
          `${length}`

        line.dataset.length =
          length
      }
    )
  }, [viewBox, allLines])

  // ============================================================
  // GSAP SCROLL ANIMATIONS
  // ============================================================

  useEffect(() => {
    // ----------------------------------------------------------
    // PHASE 1
    // SVG DRAW + IMAGE 1 OVERLAP
    // ----------------------------------------------------------

    const handleShape = (e) => {
      const progress =
        e.detail.progress

      const staggerSpan = 0.6

      // ========================================================
      // IMAGE 1 STARTS WHEN SVG IS 50% DRAWN
      // ========================================================

      const IMAGE_START = 0.5

      const imageProgress =
        progress <= IMAGE_START
          ? 0
          : Math.min(
              1,
              (progress - IMAGE_START) /
                (1 - IMAGE_START)
            )

      // --------------------------------------------------------
      // Smooth image fade-in
      // --------------------------------------------------------

      gsap.to(imageRef.current, {
        opacity: imageProgress,
        duration: 0.18,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      // --------------------------------------------------------
      // SVG fades only as image becomes visible
      // --------------------------------------------------------

      gsap.to(strokeGroupRef.current, {
        opacity: 1 - imageProgress,
        duration: 0.18,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      // ========================================================
      // SVG LINE DRAWING
      // ========================================================

      lineRefs.current.forEach(
        (line) => {
          if (!line) return

          const tileIndex =
            parseInt(
              line.dataset.tileIndex ||
                '0',
              10
            )

          const start =
            (tileIndex / totalTiles) *
            staggerSpan

          const local =
            Math.max(
              0,
              Math.min(
                1,
                (progress - start) /
                  (1 - staggerSpan)
              )
            )

          const length =
            parseFloat(
              line.dataset.length
            )

          if (
            !Number.isFinite(length)
          ) {
            return
          }

          gsap.to(line, {
            strokeDashoffset:
              length *
              (1 - local),

            duration: 0.08,

            ease: 'none',

            overwrite: 'auto',
          })
        }
      )
    }

    // ----------------------------------------------------------
    // IMPORTANT
    //
    // Image 1 is NO LONGER controlled here.
    //
    // Previously this event was changing opacity again and
    // causing the image to blink/jump.
    //
    // Image 1 is now controlled ONLY by handleShape().
    // ----------------------------------------------------------

    const handleImage = () => {
      return
    }

    // ----------------------------------------------------------
    // PHASE 3 — IMAGE 2 SLIDE
    // ----------------------------------------------------------

    const handleImage2 = (e) => {
      const progress =
        e.detail.progress

      // Image 1 moves out to the LEFT
      gsap.to(imageRef.current, {
        xPercent:
          -progress * 100,

        duration: 0.15,

        ease: 'power3.out',

        overwrite: 'auto',
      })

      // Image 2 enters from the RIGHT
      gsap.to(image2Ref.current, {
        xPercent:
          100 -
          progress * 100,

        duration: 0.15,

        ease: 'power3.out',

        overwrite: 'auto',
      })

      // Divider follows the joining edge
      gsap.to(dividerRef.current, {
        xPercent:
          100 -
          progress * 100,

        opacity:
          progress > 0.01 &&
          progress < 0.99
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
      {/* ======================================================
          IMAGE 1
          ====================================================== */}

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

      {/* ======================================================
          IMAGE 2
          ====================================================== */}

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

      {/* ======================================================
          SLIDER DIVIDER
          ====================================================== */}

      <div
        className="slider-divider"
        ref={dividerRef}
      />

      {/* ======================================================
          SVG PATTERN
          ====================================================== */}

      <div className="svg-wrapper">
        <svg
          className="fourth-svg"
          viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
          preserveAspectRatio="none"
        >
          <g ref={groupRef}>
            <g ref={strokeGroupRef}>
              {allLines.map(
                (line, index) => (
                  <line
                    key={line.id}
                    ref={(el) => {
                      lineRefs.current[
                        index
                      ] = el
                    }}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={line.color}
                    strokeWidth={
                      GRID.strokeWidth
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    data-tile-index={
                      line.tileIndex
                    }
                  />
                )
              )}
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}




// 'use client'

// import { useEffect, useRef, useMemo, useState } from 'react'
// import gsap from 'gsap'
// import './FourthSection.css'

// // ============================================================
// // GRID & PATTERN CONFIG
// // ============================================================

// const GRID = {
//   cols: 6,
//   rows: 2.5,
//   gap: 0,
//   marginX: 0,
//   marginY: 0,
//   strokeWidth: 2,
// }

// const PATTERN_CONFIG = {
//   peakXType: 'alternating',
//   peakYRatio: 0.5,

//   innerXRatio: 0.38,
//   innerYRatio: 0.47,

//   // ----------------------------------------------------------
//   // REFERENCE POSITION
//   // ----------------------------------------------------------

//   referenceLeft: 0.14,
//   referenceWidth: 0.745,
//   referenceTop: 0.02,
//   referenceHeight: 1,
// }

// const IMAGES = {
//   first: '/optimize/1.png',
//   second: '/optimize/2.png',
// }

// // ============================================================
// // REMOVE EXACT DUPLICATE SVG LINES
// // ============================================================

// function removeDuplicateLines(lines) {
//   const seen = new Set()

//   return lines.filter((line) => {
//     const x1 = Number(line.x1).toFixed(4)
//     const y1 = Number(line.y1).toFixed(4)
//     const x2 = Number(line.x2).toFixed(4)
//     const y2 = Number(line.y2).toFixed(4)

//     // Same line should count as duplicate even if
//     // its direction is reversed.
//     const pointA = `${x1},${y1}`
//     const pointB = `${x2},${y2}`

//     const key =
//       pointA < pointB
//         ? `${pointA}|${pointB}`
//         : `${pointB}|${pointA}`

//     if (seen.has(key)) {
//       return false
//     }

//     seen.add(key)
//     return true
//   })
// }

// // ============================================================
// // TRIANGULAR FACET PATTERN GENERATOR
// // ============================================================

// function buildTrianglePattern(viewBoxW, viewBoxH) {
//   const { cols, rows, gap, marginX, marginY } = GRID

//   const availW =
//     viewBoxW -
//     marginX * 2 -
//     gap * (cols - 1)

//   const availH =
//     viewBoxH -
//     marginY * 2 -
//     gap * (rows - 1)

//   const tileW = availW / cols
//   const tileH = availH / rows

//   const startX = marginX
//   const startY = marginY

//   const lines = []

//   // ============================================================
//   // OUTER FRAME
//   // ============================================================

//   lines.push(
//     {
//       id: 'border-top',
//       x1: startX,
//       y1: startY,
//       x2: startX + availW,
//       y2: startY,
//       color: '#FFFFFF',
//       tileIndex: 0,
//     },
//     {
//       id: 'border-right',
//       x1: startX + availW,
//       y1: startY,
//       x2: startX + availW,
//       y2: startY + availH,
//       color: '#FFFFFF',
//       tileIndex: 0,
//     },
//     {
//       id: 'border-bottom',
//       x1: startX + availW,
//       y1: startY + availH,
//       x2: startX,
//       y2: startY + availH,
//       color: '#FFFFFF',
//       tileIndex: 0,
//     },
//     {
//       id: 'border-left',
//       x1: startX,
//       y1: startY + availH,
//       x2: startX,
//       y2: startY,
//       color: '#FFFFFF',
//       tileIndex: 0,
//     }
//   )

//   // ============================================================
//   // TILE GENERATION
//   // ============================================================

//   let tileId = 0

//   for (let r = 0; r < rows; r++) {
//     for (let c = 0; c < cols; c++) {
//       const x =
//         startX +
//         c * (tileW + gap)

//       const y =
//         startY +
//         r * (tileH + gap)

//       // --------------------------------------------------------
//       // OPPOSITE TRIANGLE OFFSET
//       // --------------------------------------------------------

//       const OPPOSITE_Y_OFFSET_RATIO = 0.5053

//       const oppositeYOffset =
//         tileH * OPPOSITE_Y_OFFSET_RATIO

//       // --------------------------------------------------------
//       // TILE CORNERS
//       // --------------------------------------------------------

//       const TL = [x, y]

//       const TR = [
//         x + tileW,
//         y,
//       ]

//       const BR = [
//         x + tileW,
//         y + tileH,
//       ]

//       const BL = [
//         x,
//         y + tileH,
//       ]

//       const isEvenCol = c % 2 === 0

//       // --------------------------------------------------------
//       // MAIN PEAK
//       // --------------------------------------------------------

//       const peakX = isEvenCol
//         ? x + tileW
//         : x

//       const peakY =
//         y +
//         tileH *
//           PATTERN_CONFIG.peakYRatio

//       const PEAK = [
//         peakX,
//         peakY,
//       ]

//       // --------------------------------------------------------
//       // MAIN INNER POINT
//       // --------------------------------------------------------

//       const innerX = isEvenCol
//         ? x +
//           tileW *
//             PATTERN_CONFIG.innerXRatio
//         : x +
//           tileW *
//             (1 -
//               PATTERN_CONFIG.innerXRatio)

//       const innerY =
//         y +
//         tileH *
//           PATTERN_CONFIG.innerYRatio

//       const INNER = [
//         innerX,
//         innerY,
//       ]

//       // --------------------------------------------------------
//       // MAIN TRIANGLE
//       // --------------------------------------------------------

//       const mainTop = isEvenCol
//         ? TL
//         : TR

//       const mainBottom = isEvenCol
//         ? BL
//         : BR

//       // ========================================================
//       // VERTICAL COLUMN BOUNDARIES
//       // ========================================================

//       if (c < cols - 1) {
//         lines.push({
//           id: `t${tileId}-right`,
//           x1: TR[0],
//           y1: TR[1],
//           x2: BR[0],
//           y2: BR[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         })
//       }

//       if (c > 0) {
//         lines.push({
//           id: `t${tileId}-left`,
//           x1: TL[0],
//           y1: TL[1],
//           x2: BL[0],
//           y2: BL[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         })
//       }

//       // ========================================================
//       // MAIN TRIANGLE OUTER EDGES
//       // ========================================================

//       lines.push(
//         {
//           id: `t${tileId}-main-top`,
//           x1: mainTop[0],
//           y1: mainTop[1],
//           x2: PEAK[0],
//           y2: PEAK[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         },
//         {
//           id: `t${tileId}-main-bottom`,
//           x1: PEAK[0],
//           y1: PEAK[1],
//           x2: mainBottom[0],
//           y2: mainBottom[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         }
//       )

//       // ========================================================
//       // MAIN TRIANGLE — 3 INTERNAL LINES
//       // ========================================================

//       lines.push(
//         {
//           id: `t${tileId}-main-inner-top`,
//           x1: INNER[0],
//           y1: INNER[1],
//           x2: mainTop[0],
//           y2: mainTop[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         },
//         {
//           id: `t${tileId}-main-inner-bottom`,
//           x1: INNER[0],
//           y1: INNER[1],
//           x2: mainBottom[0],
//           y2: mainBottom[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         },
//         {
//           id: `t${tileId}-main-inner-peak`,
//           x1: INNER[0],
//           y1: INNER[1],
//           x2: PEAK[0],
//           y2: PEAK[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         }
//       )

//       // ========================================================
//       // OPPOSITE TRIANGLE
//       // ========================================================

//       const oppositePeakX = isEvenCol
//         ? x
//         : x + tileW

//       const OPPOSITE_PEAK = [
//         oppositePeakX,
//         peakY + oppositeYOffset,
//       ]

//       // --------------------------------------------------------
//       // OPPOSITE CORNERS
//       // --------------------------------------------------------

//       const oppositeTop = isEvenCol
//         ? [
//             TR[0],
//             TR[1] +
//               oppositeYOffset,
//           ]
//         : [
//             TL[0],
//             TL[1] +
//               oppositeYOffset,
//           ]

//       const oppositeBottom = isEvenCol
//         ? [
//             BR[0],
//             BR[1] +
//               oppositeYOffset,
//           ]
//         : [
//             BL[0],
//             BL[1] +
//               oppositeYOffset,
//           ]

//       // ========================================================
//       // OPPOSITE TRIANGLE OUTER EDGES
//       // ========================================================

//       lines.push(
//         {
//           id: `t${tileId}-opposite-top`,
//           x1: oppositeTop[0],
//           y1: oppositeTop[1],
//           x2: OPPOSITE_PEAK[0],
//           y2: OPPOSITE_PEAK[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         },
//         {
//           id: `t${tileId}-opposite-bottom`,
//           x1: OPPOSITE_PEAK[0],
//           y1: OPPOSITE_PEAK[1],
//           x2: oppositeBottom[0],
//           y2: oppositeBottom[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         }
//       )

//       // ========================================================
//       // OPPOSITE INNER POINT
//       // ========================================================

//       const oppositeInnerX = isEvenCol
//         ? x +
//           tileW *
//             (1 -
//               PATTERN_CONFIG.innerXRatio)
//         : x +
//           tileW *
//             PATTERN_CONFIG.innerXRatio

//       const OPPOSITE_INNER = [
//         oppositeInnerX,
//         innerY + oppositeYOffset,
//       ]

//       // ========================================================
//       // OPPOSITE TRIANGLE — 3 INTERNAL LINES
//       // ========================================================

//       lines.push(
//         {
//           id: `t${tileId}-opposite-inner-top`,
//           x1: OPPOSITE_INNER[0],
//           y1: OPPOSITE_INNER[1],
//           x2: oppositeTop[0],
//           y2: oppositeTop[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         },
//         {
//           id: `t${tileId}-opposite-inner-bottom`,
//           x1: OPPOSITE_INNER[0],
//           y1: OPPOSITE_INNER[1],
//           x2: oppositeBottom[0],
//           y2: oppositeBottom[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         },
//         {
//           id: `t${tileId}-opposite-inner-peak`,
//           x1: OPPOSITE_INNER[0],
//           y1: OPPOSITE_INNER[1],
//           x2: OPPOSITE_PEAK[0],
//           y2: OPPOSITE_PEAK[1],
//           color: '#FFFFFF',
//           tileIndex: tileId,
//         }
//       )

//       // ========================================================
//       // ADDITIONAL DIAGONAL FACETS
//       // ========================================================

//       const upperInner = [
//         x +
//           tileW *
//             (isEvenCol
//               ? 0.2
//               : 0.8),

//         y +
//           tileH * 0.25,
//       ]

//       const lowerInner = [
//         x +
//           tileW *
//             (isEvenCol
//               ? 0.2
//               : 0.8),

//         y +
//           tileH * 0.75,
//       ]

//       // --------------------------------------------------------
//       // Upper facet
//       // --------------------------------------------------------

//       // lines.push({
//       //   id: `t${tileId}-upper-facet`,
//       //   x1: upperInner[0],
//       //   y1: upperInner[1],
//       //   x2: INNER[0],
//       //   y2: INNER[1],
//       //   color: '#e60707',
//       //   tileIndex: tileId,
//       // })

//       // --------------------------------------------------------
//       // Lower facet
//       // --------------------------------------------------------

//       // lines.push({
//       //   id: `t${tileId}-lower-facet`,
//       //   x1: lowerInner[0],
//       //   y1: lowerInner[1],
//       //   x2: INNER[0],
//       //   y2: INNER[1],
//       //   color: '#FFFFFF',
//       //   tileIndex: tileId,
//       // })

//       // ========================================================
//       // OPPOSITE ADDITIONAL FACETS
//       // ========================================================

//       const oppositeUpperInner = [
//         x +
//           tileW *
//             (isEvenCol
//               ? 0.8
//               : 0.2),

//         y +
//           tileH * 0.25 +
//           oppositeYOffset,
//       ]

//       const oppositeLowerInner = [
//         x +
//           tileW *
//             (isEvenCol
//               ? 0.8
//               : 0.2),

//         y +
//           tileH * 0.75 +
//           oppositeYOffset,
//       ]

//       // --------------------------------------------------------
//       // Opposite upper facet
//       // --------------------------------------------------------

//       // lines.push({
//       //   id: `t${tileId}-opposite-upper-facet`,
//       //   x1: oppositeUpperInner[0],
//       //   y1: oppositeUpperInner[1],
//       //   x2: OPPOSITE_INNER[0],
//       //   y2: OPPOSITE_INNER[1],
//       //   color: '#FFFFFF',
//       //   tileIndex: tileId,
//       // })

//       // --------------------------------------------------------
//       // Opposite lower facet
//       // --------------------------------------------------------

//       // lines.push({
//       //   id: `t${tileId}-opposite-lower-facet`,
//       //   x1: oppositeLowerInner[0],
//       //   y1: oppositeLowerInner[1],
//       //   x2: OPPOSITE_INNER[0],
//       //   y2: OPPOSITE_INNER[1],
//       //   color: '#FFFFFF',
//       //   tileIndex: tileId,
//       // })

//       tileId++
//     }
//   }

//   // ============================================================
//   // IMPORTANT:
//   // REMOVE ALL EXACTLY OVERLAPPING / DOUBLED LINES
//   // ============================================================

//   return removeDuplicateLines(lines)
// }

// // ============================================================
// // FOURTH SECTION
// // ============================================================

// export default function FourthSection() {
//   const containerRef = useRef(null)

//   const groupRef = useRef(null)
//   const imageRef = useRef(null)
//   const image2Ref = useRef(null)
//   const dividerRef = useRef(null)
//   const strokeGroupRef = useRef(null)
//   const lineRefs = useRef([])

//   const [viewBox, setViewBox] = useState({
//     w: 1920,
//     h: 1080,
//   })

//   // ============================================================
//   // RESPONSIVE VIEWBOX
//   // ============================================================

//   useEffect(() => {
//     const updateDimensions = () => {
//       if (!containerRef.current) return

//       const {
//         width,
//         height,
//       } =
//         containerRef.current.getBoundingClientRect()

//       if (
//         width > 0 &&
//         height > 0
//       ) {
//         setViewBox({
//           w: width,
//           h: height,
//         })
//       }
//     }

//     updateDimensions()

//     const resizeObserver =
//       new ResizeObserver(() => {
//         updateDimensions()
//       })

//     if (containerRef.current) {
//       resizeObserver.observe(
//         containerRef.current
//       )
//     }

//     window.addEventListener(
//       'resize',
//       updateDimensions
//     )

//     return () => {
//       resizeObserver.disconnect()

//       window.removeEventListener(
//         'resize',
//         updateDimensions
//       )
//     }
//   }, [])

//   // ============================================================
//   // GENERATE SVG
//   // ============================================================

//   const allLines = useMemo(
//     () =>
//       buildTrianglePattern(
//         viewBox.w,
//         viewBox.h
//       ),
//     [viewBox]
//   )

//   const totalTiles =
//     GRID.cols * GRID.rows

//   // ============================================================
//   // INITIAL SVG STATE
//   // ============================================================

//   useEffect(() => {
//     if (!groupRef.current) return

//     gsap.set(groupRef.current, {
//       transformOrigin: '50% 50%',
//       scale: 1,
//     })

//     gsap.set(imageRef.current, {
//       opacity: 0,
//       scale: 1,
//     })

//     gsap.set(image2Ref.current, {
//       xPercent: 100,
//     })

//     gsap.set(dividerRef.current, {
//       xPercent: 100,
//       opacity: 0,
//     })

//     gsap.set(strokeGroupRef.current, {
//       opacity: 1,
//     })

//     // ==========================================================
//     // RESET LINE DRAWING
//     // ==========================================================

//     lineRefs.current.forEach(
//       (line) => {
//         if (!line) return

//         const x1 = parseFloat(
//           line.getAttribute('x1')
//         )

//         const y1 = parseFloat(
//           line.getAttribute('y1')
//         )

//         const x2 = parseFloat(
//           line.getAttribute('x2')
//         )

//         const y2 = parseFloat(
//           line.getAttribute('y2')
//         )

//         const length = Math.hypot(
//           x2 - x1,
//           y2 - y1
//         )

//         line.style.strokeDasharray =
//           `${length}`

//         line.style.strokeDashoffset =
//           `${length}`

//         line.dataset.length =
//           length
//       }
//     )
//   }, [viewBox, allLines])

//   // ============================================================
//   // GSAP SCROLL ANIMATIONS
//   // ============================================================

//   useEffect(() => {
//     // ----------------------------------------------------------
//     // PHASE 1 — TRIANGLE PATTERN DRAW-IN
//     // ----------------------------------------------------------

//     const handleShape = (e) => {
//       const progress =
//         e.detail.progress

//       const staggerSpan = 0.6

//       lineRefs.current.forEach(
//         (line) => {
//           if (!line) return

//           const tileIndex =
//             parseInt(
//               line.dataset.tileIndex ||
//                 '0',
//               10
//             )

//           const start =
//             (tileIndex / totalTiles) *
//             staggerSpan

//           const local =
//             Math.max(
//               0,
//               Math.min(
//                 1,
//                 (progress - start) /
//                   (1 - staggerSpan)
//               )
//             )

//           const length =
//             parseFloat(
//               line.dataset.length
//             )

//           if (
//             !Number.isFinite(length)
//           ) {
//             return
//           }

//           gsap.to(line, {
//             strokeDashoffset:
//               length *
//               (1 - local),

//             duration: 0.08,

//             ease: 'none',

//             overwrite: 'auto',
//           })
//         }
//       )
//     }

//     // ----------------------------------------------------------
//     // PHASE 2 — PATTERN FADE OUT + IMAGE 1
//     // ----------------------------------------------------------

//     const handleImage = (e) => {
//       const progress =
//         e.detail.progress

//       gsap.to(imageRef.current, {
//         opacity: progress,

//         duration: 0.15,

//         ease: 'power2.out',

//         overwrite: 'auto',
//       })

//       gsap.to(
//         strokeGroupRef.current,
//         {
//           opacity: 1 - progress,

//           duration: 0.15,

//           ease: 'power2.out',

//           overwrite: 'auto',
//         }
//       )
//     }

//     // ----------------------------------------------------------
//     // PHASE 3 — IMAGE 2 SLIDE
//     // ----------------------------------------------------------

//    const handleImage2 = (e) => {
//   const progress = e.detail.progress

//   // Image 1 moves out to the LEFT
//   gsap.to(imageRef.current, {
//     xPercent: -progress * 100,
//     duration: 0.15,
//     ease: 'power3.out',
//     overwrite: 'auto',
//   })

//   // Image 2 enters from the RIGHT
//   gsap.to(image2Ref.current, {
//     xPercent: 100 - progress * 100,
//     duration: 0.15,
//     ease: 'power3.out',
//     overwrite: 'auto',
//   })

//   // Divider follows the joining edge
//   gsap.to(dividerRef.current, {
//     xPercent: 100 - progress * 100,
//     opacity:
//       progress > 0.01 && progress < 0.99
//         ? 1
//         : 0,
//     duration: 0.15,
//     ease: 'power3.out',
//     overwrite: 'auto',
//   })
// }

//     window.addEventListener(
//       'fourthShapeProgress',
//       handleShape
//     )

//     window.addEventListener(
//       'fourthImageProgress',
//       handleImage
//     )

//     window.addEventListener(
//       'fourthImage2Progress',
//       handleImage2
//     )

//     return () => {
//       window.removeEventListener(
//         'fourthShapeProgress',
//         handleShape
//       )

//       window.removeEventListener(
//         'fourthImageProgress',
//         handleImage
//       )

//       window.removeEventListener(
//         'fourthImage2Progress',
//         handleImage2
//       )
//     }
//   }, [totalTiles])

//   // ============================================================
//   // JSX
//   // ============================================================

//   return (
//     <div
//       className="fourth-section"
//       ref={containerRef}
//     >
//       {/* ======================================================
//           IMAGE 1
//           ====================================================== */}

//       <div
//         className="image-container"
//         ref={imageRef}
//       >
//         <img
//           src={IMAGES.first}
//           alt="Panel Design 1"
//           className="revealed-image"
//         />
//       </div>

//       {/* ======================================================
//           IMAGE 2
//           ====================================================== */}

//       <div
//         className="image-container image-container-2"
//         ref={image2Ref}
//       >
//         <img
//           src={IMAGES.second}
//           alt="Panel Design 2"
//           className="revealed-image"
//         />
//       </div>

//       {/* ======================================================
//           SLIDER DIVIDER
//           ====================================================== */}

//       <div
//         className="slider-divider"
//         ref={dividerRef}
//       />

//       {/* ======================================================
//           SVG PATTERN
//           ====================================================== */}

//       <div className="svg-wrapper">
//         <svg
//           className="fourth-svg"
//           viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
//           preserveAspectRatio="none"
//         >
//           <g ref={groupRef}>
//             <g ref={strokeGroupRef}>
//               {allLines.map(
//                 (line, index) => (
//                   <line
//                     key={line.id}
//                     ref={(el) => {
//                       lineRefs.current[
//                         index
//                       ] = el
//                     }}
//                     x1={line.x1}
//                     y1={line.y1}
//                     x2={line.x2}
//                     y2={line.y2}
//                     stroke={line.color}
//                     strokeWidth={
//                       GRID.strokeWidth
//                     }
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     data-tile-index={
//                       line.tileIndex
//                     }
//                   />
//                 )
//               )}
//             </g>
//           </g>
//         </svg>
//       </div>
//     </div>
//   )
// }
