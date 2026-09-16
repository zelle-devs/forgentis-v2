'use client'
import { useEffect, useRef, useMemo, useState } from 'react'
import gsap from 'gsap'
import './FourthSection.css'

const BASE_W = 1920
const BASE_H = 1080

// Top offset — image me shelf top se kitna neeche shuru hota hai
const TOP_OFFSET = 170

// Har column: x (left position), w (width), heights array, gaps array
// Image dekh ke approximate values — tu fine-tune kar sakta hai
const COLUMNS = [
  // Col 1 — full height tall piece (top to bottom)
  { x: 140, w: 180, heights: [480, 140, 250], gaps: [0, 0] },

  // Col 2 — tall oval on top, circle, oval
  { x: 325, w: 180, heights: [190, 410, 150, 150], gaps: [0, 0, 0] },

  // Col 3 — 2 tall pieces
  { x: 510, w: 180, heights: [340, 340, 200], gaps: [0, 0] },

  // Col 4 — 4 pieces (oval, circle, oval, circle)
  { x: 695, w: 180, heights: [150, 320, 150, 250], gaps: [0, 0, 0, 0] },

  // Col 5 — oval, circle, tall oval, circle
  { x: 880, w: 180, heights: [280, 150, 460], gaps: [0, 0, 0] },

  // Col 6 — same pattern
  { x: 1065, w: 180, heights: [460, 150, 280], gaps: [0, 0, 0] },

  // Col 7 — tall dark, circle, oval
  { x: 1250, w: 180, heights: [200, 400, 150, 150], gaps: [0, 0, 0] },

  // Col 8 — oval, oval, tall green, circle
  { x: 1435, w: 180, heights: [350, 350, 200], gaps: [0, 0, 0] },

  // Col 9 — tall dark, circle, oval
  { x: 1620, w: 180, heights: [150, 350, 150, 250], gaps: [0, 0, 0] },

  // Col 10 — circle, tall oval, wood piece
  { x: 1805, w: 180, heights: [300, 150, 450], gaps: [0, 0, 0] },
]

function buildShapes() {
  const shapes = []
  let id = 0

  COLUMNS.forEach((col) => {
    let y = TOP_OFFSET
    col.heights.forEach((h, i) => {
      shapes.push({
        id: id++,
        x: col.x,
        y,
        w: col.w,
        h,
        rx: col.w / 2,
      })
      y += h + (col.gaps[i] ?? 25)
    })
  })

  return shapes
}

export default function FourthSection() {
  const groupRef = useRef(null)
  const imageRef = useRef(null)
  const strokeGroupRef = useRef(null)
  const rectStrokeRefs = useRef([])
  const [viewBox, setViewBox] = useState({ w: BASE_W, h: BASE_H })

  const shapes = useMemo(() => buildShapes(), [])

  // ---------------------------------------------------------------------------
  // Image load hone pe actual aspect ratio nikaal, viewBox update kar
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const img = new Image()
    img.src = '/images/desire-1.webp'
    img.onload = () => {
      setViewBox({ w: img.naturalWidth, h: img.naturalHeight })
    }
  }, [])

  // ---------------------------------------------------------------------------
  // Initial state
  // ---------------------------------------------------------------------------
  useEffect(() => {
    gsap.set(groupRef.current, { transformOrigin: '50% 50%', scale: 1.4 })
    gsap.set(imageRef.current, { opacity: 0, scale: 1.1 })
    gsap.set(strokeGroupRef.current, { opacity: 1 })

    rectStrokeRefs.current.forEach((rect) => {
      if (!rect) return
      const w = parseFloat(rect.getAttribute('width'))
      const h = parseFloat(rect.getAttribute('height'))
      const rx = parseFloat(rect.getAttribute('rx'))
      const perimeter = 2 * (w - 2 * rx) + 2 * (h - 2 * rx) + 2 * Math.PI * rx
      rect.style.strokeDasharray = `${perimeter}`
      rect.style.strokeDashoffset = `${perimeter}`
      rect.dataset.perimeter = perimeter
    })
  }, [viewBox])

  // ---------------------------------------------------------------------------
  // Animations
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleShape = (e) => {
      const progress = e.detail.progress

      gsap.to(groupRef.current, {
        scale: 1.4 - progress * 0.4,
        duration: 0.08,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      const total = rectStrokeRefs.current.length
      const staggerSpan = 0.6
      rectStrokeRefs.current.forEach((rect, i) => {
        if (!rect) return
        const start = (i / total) * staggerSpan
        const local = Math.max(0, Math.min(1, (progress - start) / (1 - staggerSpan)))
        const perimeter = parseFloat(rect.dataset.perimeter)
        gsap.to(rect, {
          strokeDashoffset: perimeter * (1 - local),
          duration: 0.08,
          ease: 'none',
          overwrite: 'auto',
        })
      })
    }

    const handleImage = (e) => {
      const progress = e.detail.progress
      gsap.to(imageRef.current, {
        opacity: progress,
        scale: 1.1 - progress * 0.1,
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

    window.addEventListener('fourthShapeProgress', handleShape)
    window.addEventListener('fourthImageProgress', handleImage)
    return () => {
      window.removeEventListener('fourthShapeProgress', handleShape)
      window.removeEventListener('fourthImageProgress', handleImage)
    }
  }, [])

  return (
    <div className="fourth-section">
      {/* Background Image — same viewBox aspect */}
      <div className="image-container" ref={imageRef}>
        <img
          src="/images/desire-1.png"
          alt="Revealed Section"
          className="revealed-image"
        />
      </div>

      {/* SVG Overlay — same aspect, same position */}
      <div className="svg-wrapper">
        <svg
          className="fourth-svg"
          viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
          preserveAspectRatio="xMidYMid slice"
        >
          <g ref={groupRef}>
            <g ref={strokeGroupRef}>
              {shapes.map((s, i) => (
                <rect
                  key={s.id}
                  ref={(el) => (rectStrokeRefs.current[i] = el)}
                  x={s.x}
                  y={s.y}
                  width={s.w}
                  height={s.h}
                  rx={s.rx}
                  ry={s.rx}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.85)"
                  strokeWidth="4"
                />
              ))}
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}


// 'use client'
// import { useEffect, useRef, useMemo } from 'react'
// import gsap from 'gsap'
// import './FourthSection.css'

// const COLS = 8
// const GAP = 14
// const VB_W = 1050
// const VB_H = 640

// const HEIGHT_PATTERN = [
//   [140, 200, 160],
//   [180, 140, 190],
//   [130, 220, 150],
//   [190, 150, 180],
//   [160, 180, 140],
//   [200, 130, 190],
//   [150, 190, 150],
//   [180, 160, 170],
// ]

// function buildShapes() {
//   const colWidth = (VB_W - GAP * (COLS - 1)) / COLS
//   const shapes = []
//   let id = 0
//   for (let col = 0; col < COLS; col++) {
//     const heights = HEIGHT_PATTERN[col % HEIGHT_PATTERN.length]
//     let y = col % 2 === 1 ? 30 : 0
//     heights.forEach((h) => {
//       shapes.push({ 
//         id: id++, 
//         x: col * (colWidth + GAP), 
//         y, 
//         w: colWidth, 
//         h, 
//         rx: colWidth / 2 
//       })
//       y += h + GAP
//     })
//   }
//   return shapes
// }

// export default function FourthSection() {
//   const groupRef = useRef(null)
//   const imageRef = useRef(null)
//   const strokeGroupRef = useRef(null)
//   const rectStrokeRefs = useRef([])
//   const shapes = useMemo(() => buildShapes(), [])

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
//   }, [])

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
//         scale: 1.1 - (progress * 0.1),
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
//       {/* Image puri background screen par rhegi */}
//       <div className="image-container" ref={imageRef}>
//         <img src="/images/desire-1.webp" alt="Revealed Section" className="revealed-image" />
//       </div>

//       {/* Sirf SVG shape/border center mein 30px padding ke sath fit hoga */}
//       <div className="svg-wrapper">
//         <svg className="fourth-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet">
//           <g ref={groupRef}>
//             <g ref={strokeGroupRef}>
//               {shapes.map((s, i) => (
//                 <rect
//                   key={`s-${s.id}`}
//                   ref={(el) => (rectStrokeRefs.current[i] = el)}
//                   x={s.x} 
//                   y={s.y} 
//                   width={s.w} 
//                   height={s.h} 
//                   rx={s.rx} 
//                   ry={s.rx}
//                   fill="none" 
//                   stroke="rgba(255, 255, 255, 0.85)" 
//                   strokeWidth="2"
//                 />
//               ))}
//             </g>
//           </g>
//         </svg>
//       </div>
//     </div>
//   )
// }
