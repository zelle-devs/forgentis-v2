'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './WipeTransition.css'

function WipeTransition() {
  const wipeRef = useRef(null)

  useEffect(() => {
    // Wipe in animation
    const handleWipeIn = () => {
      gsap.fromTo(
        wipeRef.current,
        { 
          x: '-100%',
          opacity: 0,
        },
        { 
          x: '0%',
          opacity: 1,
          duration: 0.8,
          ease: 'power3.inOut'
        }
      )
    }

    // Wipe out animation
    const handleWipeOut = () => {
      gsap.to(
        wipeRef.current,
        { 
          x: '100%',
          opacity: 0,
          duration: 0.8,
          ease: 'power3.inOut'
        }
      )
    }

    window.addEventListener('wipeIn', handleWipeIn)
    window.addEventListener('wipeOut', handleWipeOut)

    return () => {
      window.removeEventListener('wipeIn', handleWipeIn)
      window.removeEventListener('wipeOut', handleWipeOut)
    }
  }, [])

  return (
    <div ref={wipeRef} className="wipe-transition">
      <div className="wipe-blur"></div>
    </div>
  )
}

export default WipeTransition