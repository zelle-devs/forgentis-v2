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

  useEffect(() => {
    const track = scrollTrackRef.current
    if (!track) return

    // Exact scroll calculation: content ki actual height minus viewport
    const calculateDistance = () => {
      const vh = window.innerHeight
      const trackHeight = track.scrollHeight
      // Max travel distance utna hi hona chahiye jitna content screen se bahar hai
      return Math.max(0, trackHeight - vh * 0.82)
    }

    let maxDist = calculateDistance()

    const yTo = gsap.quickTo(track, 'y', {
      duration: 0.8,
      ease: 'power2.out',
    })

    const handleProgress = (e) => {
      const p = e.detail?.progress ?? 0
      yTo(-p * maxDist)
    }

    const handleResize = () => {
      maxDist = calculateDistance()
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
      {/* Moving Track contains both Heading + Stats so heading scrolls up with content */}
      <div ref={scrollTrackRef} className="stats_scroll_track">
        
        {/* Section Heading */}
        <div className="stats_header_wrap">
          <h2 className="stats_section_heading">
            {title} <span>{title_part_2}</span>
          </h2>
        </div>

        {/* Stats Container */}
        <div className="stats_container">
          {stats.map((item, index) => {
            const isReversed = index % 2 !== 0

            return (
              <div
                key={index}
                className={`stat_row ${isReversed ? 'row_reverse' : ''}`}
              >
                <div className="stat_number_wrap">
                  <span className="stat_number">{item.number}</span>
                </div>

                <div className="stat_text_wrap">
                  <h3 className="stat_title">{item.title}</h3>
                  {item.subtitle && (
                    <p className="stat_subtitle">{item.subtitle}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}