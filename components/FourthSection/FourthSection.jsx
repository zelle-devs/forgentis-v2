// 'use client'
// import { useEffect, useRef, useMemo } from 'react'
// import gsap from 'gsap'
// import './FourthSection.css'

// const COLS = 8
// const GAP = 14
// const VB_W = 1200
// const VB_H = 700

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
//     // Initial states: Group scale aur image ko thoda zoom (scale 1.15) aur invisible rakha hai
//     gsap.set(groupRef.current, { transformOrigin: '50% 50%', scale: 1.4 })
//     gsap.set(imageRef.current, { opacity: 0, scale: 1.15 })
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

//       // Grid zoom out effect
//       gsap.to(groupRef.current, {
//         scale: 1.4 - progress * 0.4,
//         duration: 0.08,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })

//       // Pencil-like stroke drawing animation
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
      
//       // Image halke halke visible hogi aur saath hi scale 1.15 se normal (1.0) par aayegi
//       gsap.to(imageRef.current, {
//         opacity: progress,
//         scale: 1.15 - (progress * 0.15),
//         duration: 0.08,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
      
//       // Jaise jaise image visible ho rahi hai, outlines/borders smooth tarike se fade out ho rahi hain (no sudden cut)
//       gsap.to(strokeGroupRef.current, {
//         opacity: 1 - progress,
//         duration: 0.08,
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
//       {/* Background full image jo pencil shapes ke fade out hone par smoothly reveal hogi */}
//       <div className="image-container" ref={imageRef}>
//         <img src="/images/1-c.png" alt="Revealed Section" className="revealed-image" />
//       </div>

//       {/* Sirf borders/outlines wala SVG grid bina kisi black background ke */}
//       <svg className="fourth-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid slice">
//         <g ref={groupRef}>
//           <g ref={strokeGroupRef}>
//             {shapes.map((s, i) => (
//               <rect
//                 key={`s-${s.id}`}
//                 ref={(el) => (rectStrokeRefs.current[i] = el)}
//                 x={s.x} 
//                 y={s.y} 
//                 width={s.w} 
//                 height={s.h} 
//                 rx={s.rx} 
//                 ry={s.rx}
//                 fill="none" 
//                 stroke="rgba(255, 255, 255, 0.85)" 
//                 strokeWidth="2"
//               />
//             ))}
//           </g>
//         </g>
//       </svg>
//     </div>
//   )
// }

'use client'
import { useEffect, useRef, useMemo } from 'react'
import gsap from 'gsap'
import './FourthSection.css'

const COLS = 8
const GAP = 14
const VB_W = 1050
const VB_H = 640

const HEIGHT_PATTERN = [
  [140, 200, 160],
  [180, 140, 190],
  [130, 220, 150],
  [190, 150, 180],
  [160, 180, 140],
  [200, 130, 190],
  [150, 190, 150],
  [180, 160, 170],
]

function buildShapes() {
  const colWidth = (VB_W - GAP * (COLS - 1)) / COLS
  const shapes = []
  let id = 0
  for (let col = 0; col < COLS; col++) {
    const heights = HEIGHT_PATTERN[col % HEIGHT_PATTERN.length]
    let y = col % 2 === 1 ? 30 : 0
    heights.forEach((h) => {
      shapes.push({ 
        id: id++, 
        x: col * (colWidth + GAP), 
        y, 
        w: colWidth, 
        h, 
        rx: colWidth / 2 
      })
      y += h + GAP
    })
  }
  return shapes
}

export default function FourthSection() {
  const groupRef = useRef(null)
  const imageRef = useRef(null)
  const strokeGroupRef = useRef(null)
  const rectStrokeRefs = useRef([])
  const shapes = useMemo(() => buildShapes(), [])

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
  }, [])

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
        scale: 1.1 - (progress * 0.1),
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
      {/* Image puri background screen par rhegi */}
      <div className="image-container" ref={imageRef}>
        <img src="/images/1-c.png" alt="Revealed Section" className="revealed-image" />
      </div>

      {/* Sirf SVG shape/border center mein 30px padding ke sath fit hoga */}
      <div className="svg-wrapper">
        <svg className="fourth-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet">
          <g ref={groupRef}>
            <g ref={strokeGroupRef}>
              {shapes.map((s, i) => (
                <rect
                  key={`s-${s.id}`}
                  ref={(el) => (rectStrokeRefs.current[i] = el)}
                  x={s.x} 
                  y={s.y} 
                  width={s.w} 
                  height={s.h} 
                  rx={s.rx} 
                  ry={s.rx}
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.85)" 
                  strokeWidth="2"
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
// const VB_W = 1000
// const VB_H = 560

// // Har column ki pill heights — organic/brick jaisa pattern
// const HEIGHT_PATTERN = [
//   [160, 220, 140],
//   [200, 150, 190],
//   [140, 240, 130],
//   [210, 160, 170],
//   [150, 200, 150],
//   [220, 140, 180],
//   [160, 190, 160],
//   [190, 150, 200],
// ]

// function buildShapes() {
//   const colWidth = (VB_W - GAP * (COLS - 1)) / COLS
//   const shapes = []
//   let id = 0
//   for (let col = 0; col < COLS; col++) {
//     const heights = HEIGHT_PATTERN[col % HEIGHT_PATTERN.length]
//     let y = col % 2 === 1 ? 40 : 0 // odd columns thodi offset — brick look
//     heights.forEach((h) => {
//       shapes.push({ id: id++, x: col * (colWidth + GAP), y, w: colWidth, h, rx: colWidth / 2 })
//       y += h + GAP
//     })
//   }
//   return shapes
// }

// function FourthSection() {
//   const groupRef = useRef(null)
//   const imageRef = useRef(null)
//   const strokeGroupRef = useRef(null)
//   const rectStrokeRefs = useRef([])
//   const shapes = useMemo(() => buildShapes(), [])

//   // Initial state: zoomed-in (focused), image hidden, outlines undrawn
//   useEffect(() => {
//     gsap.set(groupRef.current, { transformOrigin: '50% 50%', scale: 1.6 })
//     gsap.set(imageRef.current, { opacity: 0 })
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
//     // Phase B: shape building — zoom-out + staggered outline draw
//     const handleShape = (e) => {
//       const progress = e.detail.progress

//       gsap.to(groupRef.current, {
//         scale: 1.6 - progress * 0.6, // 1.6 -> 1.0
//         duration: 0.08,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })

//       const total = rectStrokeRefs.current.length
//       const staggerSpan = 0.5
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

//     // Phase C: image reveal + outlines fade out
//     const handleImage = (e) => {
//       const progress = e.detail.progress
//       gsap.to(imageRef.current, {
//         opacity: progress,
//         duration: 0.08,
//         ease: 'power2.out',
//         overwrite: 'auto',
//       })
//       gsap.to(strokeGroupRef.current, {
//         opacity: 1 - progress,
//         duration: 0.08,
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
//       <svg className="fourth-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid slice">
//         <defs>
//           <mask id="fourthGridMask">
//             {shapes.map((s) => (
//               <rect key={`m-${s.id}`} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} ry={s.rx} fill="#fff" />
//             ))}
//           </mask>
//         </defs>

//         <g ref={groupRef}>
//           {/* Image sirf pill shapes ke andar dikhegi */}
//           <image
//             ref={imageRef}
//             href="/images/1-c.png"
//             x="0" y="0" width={VB_W} height={VB_H}
//             preserveAspectRatio="xMidYMid slice"
//             mask="url(#fourthGridMask)"
//           />

//           {/* Outline layer — "shape banta ja raha" wala effect */}
//           <g ref={strokeGroupRef}>
//             {shapes.map((s, i) => (
//               <rect
//                 key={`s-${s.id}`}
//                 ref={(el) => (rectStrokeRefs.current[i] = el)}
//                 x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} ry={s.rx}
//                 fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5"
//               />
//             ))}
//           </g>
//         </g>
//       </svg>
//     </div>
//   )
// }

// export default FourthSection