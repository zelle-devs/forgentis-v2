'use client'

import { useEffect, useRef } from 'react'
import './CursorTrail.css'

function CursorTrail() {
  const canvasRef = useRef(null)
  const pointsRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const lastMouseRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr

      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY

      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
      })

      lastMouseRef.current.x = e.clientX
      lastMouseRef.current.y = e.clientY

      if (pointsRef.current.length > 30) {
        pointsRef.current.shift()
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      pointsRef.current = pointsRef.current.filter((point) => {
        point.life -= 0.04
        return point.life > 0
      })

      // ==========================================
      // CURSOR TRAIL
      // ==========================================

      if (pointsRef.current.length > 2) {
        for (let i = 1; i < pointsRef.current.length - 1; i++) {
          const current = pointsRef.current[i]
          const next = pointsRef.current[i + 1]
          const previous = pointsRef.current[i - 1]

          const midX = (current.x + next.x) / 2
          const midY = (current.y + next.y) / 2

          const alpha = current.life
          const lineWidth = 3 * current.life + 0.5

          // ==========================================
          // OUTER GLOW - Deep Warm Brown
          // ==========================================

          ctx.beginPath()
          ctx.moveTo(previous.x, previous.y)
          ctx.quadraticCurveTo(
            current.x,
            current.y,
            midX,
            midY
          )

// ctx.strokeStyle = `rgba(92, 58, 37, ${alpha * 0.18})`

ctx.strokeStyle = `rgba(10, 30, 43, ${alpha * 0.18})`
          ctx.lineWidth = lineWidth * 4
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.stroke()

          // ==========================================
          // MIDDLE GLOW - Main Brown
          // ==========================================

          ctx.beginPath()
          ctx.moveTo(previous.x, previous.y)
          ctx.quadraticCurveTo(
            current.x,
            current.y,
            midX,
            midY
          )

    
// ctx.strokeStyle = `rgba(138, 90, 59, ${alpha * 0.5})`
ctx.strokeStyle = `rgba(23, 52, 74, ${alpha * 0.5})`
          ctx.lineWidth = lineWidth * 2
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.stroke()

          // ==========================================
          // MAIN LINE - #946854
          // ==========================================

          ctx.beginPath()
          ctx.moveTo(previous.x, previous.y)
          ctx.quadraticCurveTo(
            current.x,
            current.y,
            midX,
            midY
          )

    
// ctx.strokeStyle = `rgba(138, 90, 59, ${alpha * 0.9})`
ctx.strokeStyle = `rgba(23, 52, 74, ${alpha * 0.9})`
          ctx.lineWidth = lineWidth
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.stroke()

          // ==========================================
          // INNER CORE - Warm White
          // ==========================================

          ctx.beginPath()
          ctx.moveTo(previous.x, previous.y)
          ctx.quadraticCurveTo(
            current.x,
            current.y,
            midX,
            midY
          )

          
          // ctx.strokeStyle = `rgba(255, 242, 230, ${alpha * 0.55})`
          ctx.strokeStyle = `rgba(225, 240, 248, ${alpha * 0.55})`
          ctx.lineWidth = lineWidth * 0.35
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.stroke()
        }
      }

      // ==========================================
      // CURSOR GLOW
      // ==========================================

      if (pointsRef.current.length > 0) {
        const lastPoint =
          pointsRef.current[pointsRef.current.length - 1]

        // ==========================================
        // LARGE SOFT OUTER GLOW
        // ==========================================

        const outerGlow = ctx.createRadialGradient(
          lastPoint.x,
          lastPoint.y,
          0,
          lastPoint.x,
          lastPoint.y,
          15
        )

       
//         outerGlow.addColorStop(
//   0,
//   'rgba(190, 145, 110, 0.65)'
// )

// outerGlow.addColorStop(
//   0.4,
//   'rgba(138, 90, 59, 0.32)'
// )

// outerGlow.addColorStop(
//   1,
//   'rgba(92, 58, 37, 0)'
// )


outerGlow.addColorStop(
  0,
  'rgba(100, 145, 170, 0.65)'
)

outerGlow.addColorStop(
  0.4,
  'rgba(23, 52, 74, 0.32)'
)

outerGlow.addColorStop(
  1,
  'rgba(10, 30, 43, 0)'
)
        ctx.beginPath()
        ctx.arc(
          lastPoint.x,
          lastPoint.y,
          15,
          0,
          Math.PI * 2
        )

        ctx.fillStyle = outerGlow
        ctx.fill()

        // ==========================================
        // MEDIUM GLOW
        // ==========================================

        const midGlow = ctx.createRadialGradient(
          lastPoint.x,
          lastPoint.y,
          0,
          lastPoint.x,
          lastPoint.y,
          8
        )

//         midGlow.addColorStop(
//   0,
//   'rgba(255, 242, 230, 0.95)'
// )

// midGlow.addColorStop(
//   0.4,
//   'rgba(190, 145, 110, 0.75)'
// )

// midGlow.addColorStop(
//   1,
//   'rgba(138, 90, 59, 0.35)'
// )

midGlow.addColorStop(
  0,
  'rgba(235, 247, 255, 0.95)'
)

midGlow.addColorStop(
  0.4,
  'rgba(100, 145, 170, 0.75)'
)

midGlow.addColorStop(
  1,
  'rgba(23, 52, 74, 0.35)'
)


        ctx.beginPath()
        ctx.arc(
          lastPoint.x,
          lastPoint.y,
          8,
          0,
          Math.PI * 2
        )

        ctx.fillStyle = midGlow
        ctx.fill()

        // ==========================================
        // CORE DOT
        // ==========================================

        const coreDot = ctx.createRadialGradient(
          lastPoint.x - 1,
          lastPoint.y - 1,
          0,
          lastPoint.x,
          lastPoint.y,
          3
        )

//         coreDot.addColorStop(
//   0,
//   'rgba(255, 248, 240, 1)'
// )

// coreDot.addColorStop(
//   0.6,
//   'rgba(225, 190, 165, 0.95)'
// )

// coreDot.addColorStop(
//   1,
//   'rgba(138, 90, 59, 0.65)'
// )

coreDot.addColorStop(
  0,
  'rgba(245, 250, 255, 1)'
)

coreDot.addColorStop(
  0.6,
  'rgba(190, 215, 230, 0.95)'
)

coreDot.addColorStop(
  1,
  'rgba(23, 52, 74, 0.65)'
)

        ctx.beginPath()
        ctx.arc(
          lastPoint.x,
          lastPoint.y,
          3,
          0,
          Math.PI * 2
        )

        ctx.fillStyle = coreDot
        ctx.fill()
      }

      animationFrameRef.current =
        requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener(
        'resize',
        resizeCanvas
      )

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      )

      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current
        )
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="cursor-trail-canvas"
    />
  )
}

export default CursorTrail

// 'use client'

// import { useEffect, useRef } from 'react'
// import './CursorTrail.css'

// function CursorTrail() {
//   const canvasRef = useRef(null)
//   const pointsRef = useRef([])
//   const mouseRef = useRef({ x: 0, y: 0 })
//   const lastMouseRef = useRef({ x: 0, y: 0 })
//   const animationFrameRef = useRef(null)

//   useEffect(() => {
//     const canvas = canvasRef.current
//     const ctx = canvas.getContext('2d')

//     const resizeCanvas = () => {
//       const dpr = Math.min(window.devicePixelRatio || 1, 2)

//       canvas.width = window.innerWidth * dpr
//       canvas.height = window.innerHeight * dpr

//       canvas.style.width = `${window.innerWidth}px`
//       canvas.style.height = `${window.innerHeight}px`

//       ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
//     }

//     resizeCanvas()
//     window.addEventListener('resize', resizeCanvas)

//     const handleMouseMove = (e) => {
//       mouseRef.current.x = e.clientX
//       mouseRef.current.y = e.clientY

//       // Add point with velocity info
//       pointsRef.current.push({
//         x: e.clientX,
//         y: e.clientY,
//         life: 1,
//       })

//       lastMouseRef.current.x = e.clientX
//       lastMouseRef.current.y = e.clientY

//       // Limit points - shorter trail (30 points max)
//       if (pointsRef.current.length > 30) {
//         pointsRef.current.shift()
//       }
//     }

//     window.addEventListener('mousemove', handleMouseMove)

//     const animate = () => {
//       ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

//       // Update life
//       pointsRef.current = pointsRef.current.filter((point) => {
//         point.life -= 0.04 // Faster fade
//         return point.life > 0
//       })

//       // Draw smooth continuous line using quadratic curves
//       if (pointsRef.current.length > 2) {
//         for (let i = 1; i < pointsRef.current.length - 1; i++) {
//           const current = pointsRef.current[i]
//           const next = pointsRef.current[i + 1]
//           const previous = pointsRef.current[i - 1]
          
//           const midX = (current.x + next.x) / 2
//           const midY = (current.y + next.y) / 2
          
//           const alpha = current.life
//           const lineWidth = 3 * current.life + 0.5

//           // =========================
//           // OUTER GLOW (Soft Blue)
//           // =========================
//           ctx.beginPath()
//           ctx.moveTo(previous.x, previous.y)
//           ctx.quadraticCurveTo(current.x, current.y, midX, midY)
//           ctx.strokeStyle = `rgba(2, 112, 234, ${alpha * 0.2})`
//           ctx.lineWidth = lineWidth * 4
//           ctx.lineCap = 'round'
//           ctx.lineJoin = 'round'
//           ctx.stroke()

//           // =========================
//           // MIDDLE GLOW (Brighter Blue)
//           // =========================
//           ctx.beginPath()
//           ctx.moveTo(previous.x, previous.y)
//           ctx.quadraticCurveTo(current.x, current.y, midX, midY)
//           ctx.strokeStyle = `rgba(52, 140, 237, ${alpha * 0.5})`
//           ctx.lineWidth = lineWidth * 2
//           ctx.lineCap = 'round'
//           ctx.lineJoin = 'round'
//           ctx.stroke()

//           // =========================
//           // MAIN LINE (Electric Blue)
//           // =========================
//           ctx.beginPath()
//           ctx.moveTo(previous.x, previous.y)
//           ctx.quadraticCurveTo(current.x, current.y, midX, midY)
//           ctx.strokeStyle = `rgba(2, 112, 234, ${alpha * 0.9})`
//           ctx.lineWidth = lineWidth
//           ctx.lineCap = 'round'
//           ctx.lineJoin = 'round'
//           ctx.stroke()

//           // =========================
//           // INNER CORE (White)
//           // =========================
//           ctx.beginPath()
//           ctx.moveTo(previous.x, previous.y)
//           ctx.quadraticCurveTo(current.x, current.y, midX, midY)
//           ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`
//           ctx.lineWidth = lineWidth * 0.35
//           ctx.lineCap = 'round'
//           ctx.lineJoin = 'round'
//           ctx.stroke()
//         }
//       }

//       // Draw premium glowing dot at cursor
//       if (pointsRef.current.length > 0) {
//         const lastPoint = pointsRef.current[pointsRef.current.length - 1]
        
//         // Large soft outer glow
//         const outerGlow = ctx.createRadialGradient(
//           lastPoint.x, lastPoint.y, 0,
//           lastPoint.x, lastPoint.y, 15
//         )
//         outerGlow.addColorStop(0, 'rgba(126, 181, 242, 0.6)')
//         outerGlow.addColorStop(0.4, 'rgba(52, 140, 237, 0.3)')
//         outerGlow.addColorStop(1, 'rgba(0, 101, 213, 0)')
        
//         ctx.beginPath()
//         ctx.arc(lastPoint.x, lastPoint.y, 15, 0, Math.PI * 2)
//         ctx.fillStyle = outerGlow
//         ctx.fill()

//         // Medium glow
//         const midGlow = ctx.createRadialGradient(
//           lastPoint.x, lastPoint.y, 0,
//           lastPoint.x, lastPoint.y, 8
//         )
//         midGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
//         midGlow.addColorStop(0.4, 'rgba(126, 181, 242, 0.7)')
//         midGlow.addColorStop(1, 'rgba(2, 112, 234, 0.3)')
        
//         ctx.beginPath()
//         ctx.arc(lastPoint.x, lastPoint.y, 8, 0, Math.PI * 2)
//         ctx.fillStyle = midGlow
//         ctx.fill()

//         // Core dot
//         const coreDot = ctx.createRadialGradient(
//           lastPoint.x - 1, lastPoint.y - 1, 0,
//           lastPoint.x, lastPoint.y, 3
//         )
//         coreDot.addColorStop(0, 'rgba(255, 255, 255, 1)')
//         coreDot.addColorStop(0.6, 'rgba(126, 181, 242, 0.9)')
//         coreDot.addColorStop(1, 'rgba(2, 112, 234, 0.6)')
        
//         ctx.beginPath()
//         ctx.arc(lastPoint.x, lastPoint.y, 3, 0, Math.PI * 2)
//         ctx.fillStyle = coreDot
//         ctx.fill()
//       }

//       animationFrameRef.current = requestAnimationFrame(animate)
//     }

//     animate()

//     return () => {
//       window.removeEventListener('resize', resizeCanvas)
//       window.removeEventListener('mousemove', handleMouseMove)

//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current)
//       }
//     }
//   }, [])

//   return (
//     <canvas
//       ref={canvasRef}
//       className="cursor-trail-canvas"
//     />
//   )
// }

// export default CursorTrail
