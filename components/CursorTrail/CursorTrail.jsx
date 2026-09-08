'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './CursorTrail.css'

function CursorTrail() {
  const canvasRef = useRef(null)
  const pointsRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
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
        size: 3.5 + Math.random() * 2.5,
      })

      if (pointsRef.current.length > 100) {
        pointsRef.current.shift()
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      )

      pointsRef.current = pointsRef.current.filter((point) => {
        point.life -= 0.018

        // Very subtle organic movement
        point.x += (Math.random() - 0.5) * 0.25
        point.y += (Math.random() - 0.5) * 0.25

        if (point.life <= 0) return false

        const alpha = point.life
        const radius = point.size * (0.7 + point.life * 0.5)

        // =========================
        // OUTER BLUE GLOW
        // =========================

        const glow = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          radius * 4
        )

        glow.addColorStop(
          0,
          `rgba(126, 181, 242, ${alpha * 0.45})`
        )

        glow.addColorStop(
          0.35,
          `rgba(52, 140, 237, ${alpha * 0.25})`
        )

        glow.addColorStop(
          1,
          `rgba(0, 101, 213, 0)`
        )

        ctx.beginPath()
        ctx.arc(
          point.x,
          point.y,
          radius * 4,
          0,
          Math.PI * 2
        )

        ctx.fillStyle = glow
        ctx.fill()

        // =========================
        // MAIN GRADIENT DOT
        // =========================

        const gradient = ctx.createRadialGradient(
          point.x - radius * 0.35,
          point.y - radius * 0.35,
          0,
          point.x,
          point.y,
          radius
        )

        gradient.addColorStop(
          0,
          `rgba(255, 255, 255, ${alpha})`
        )

        gradient.addColorStop(
          0.18,
          `rgba(126, 181, 242, ${alpha})`
        )

        gradient.addColorStop(
          0.55,
          `rgba(52, 140, 237, ${alpha * 0.95})`
        )

        gradient.addColorStop(
          1,
          `rgba(0, 101, 213, ${alpha * 0.8})`
        )

        ctx.beginPath()
        ctx.arc(
          point.x,
          point.y,
          radius,
          0,
          Math.PI * 2
        )

        ctx.fillStyle = gradient
        ctx.fill()

        return true
      })

      animationFrameRef.current =
        requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
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

