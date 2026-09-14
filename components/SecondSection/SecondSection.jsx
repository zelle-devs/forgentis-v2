'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './SecondSection.css'

function SecondSection({labelText,labelText2,mainText,description}) {
  const sectionRef = useRef(null)
  const leftColumnRef = useRef(null)
  const centerColumnRef = useRef(null)
  const rightColumnRef = useRef(null)
  const headingRef = useRef(null)
  const charRefs = useRef([])
  const clamp01 = (v) => Math.max(0, Math.min(1, v))
  const lastVisibleCount = useRef(0)

  useEffect(() => {
    if (headingRef.current) {
      const text = headingRef.current.textContent
      headingRef.current.innerHTML = ''
      
      const words = text.split(' ')
      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span')
        wordSpan.className = 'section-word'
        wordSpan.style.display = 'inline-block'
        wordSpan.style.whiteSpace = 'nowrap'
        
        word.split('').forEach((char) => {
          const charSpan = document.createElement('span')
          charSpan.textContent = char
          charSpan.className = 'section-char'
          charSpan.style.display = 'inline-block'
          wordSpan.appendChild(charSpan)
          charRefs.current.push(charSpan)
        })
        
        headingRef.current.appendChild(wordSpan)
        
        if (wordIndex < words.length - 1) {
          headingRef.current.appendChild(document.createTextNode(' '))
        }
      })
      
      charRefs.current.forEach((char) => {
        gsap.set(char, {
          color: 'rgba(157, 160, 161, 0.3)',
          opacity: 0.3,
        })
      })
    }

    const timeline = gsap.timeline()
    timeline
      .fromTo(sectionRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      .fromTo(leftColumnRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.3')
      .fromTo(rightColumnRef.current, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.8')

    return () => {
      timeline.kill()
    }
  }, [])



  useEffect(() => {
  const handleSecondTextProgress = (e) => {
    const textProgress = e.detail.progress // 0 -> 1 (ab slide ke saath sync)

    const totalChars = charRefs.current.length
    const visibleChars = textProgress * totalChars // float rakho, floor mat karo

    charRefs.current.forEach((char, index) => {
      // Har char ka apna local progress — smooth gradient fill
      const charProgress = clamp01(visibleChars - index)

      gsap.to(char, {
        // color: charProgress > 0
        //   ? `rgba(255, 255, 255, ${0.3 + 0.7 * charProgress})`
        //   : 'rgba(157, 160, 161, 0.3)',

        // **********brown********
  //       color: charProgress > 0
  // ? `rgba(148, 104, 84, ${0.3 + 0.7 * charProgress})`
  // : 'rgba(157, 160, 161, 0.3)',

  color: charProgress > 0
  ? `#f1f1f1, ${0.3 + 0.7 * charProgress})`
  : 'rgba(157, 160, 161, 0.3)',

        opacity: 0.3 + 0.7 * charProgress,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })
  }

  window.addEventListener('secondTextProgress', handleSecondTextProgress)
  return () => window.removeEventListener('secondTextProgress', handleSecondTextProgress)
}, [])

  return (
    <div ref={sectionRef} className="second-section">
      <div ref={leftColumnRef} className="second-left-column">
        <div className="left-top-content">
          <span className="left-label">{labelText}</span>
          <span className="left-gap"></span>
          <span className="left-small-text">{labelText2}</span>
        </div>
        <div className="left-bottom-content">
          <div className="left-image">
            <img src="/images/from_eng_to.png" alt="Design" />
          </div>
        </div>
      </div>

      <div ref={centerColumnRef} className="second-center-column">
        <h2 ref={headingRef} className="second-heading">
          {mainText}
        </h2>
      </div>

      <div ref={rightColumnRef} className="second-right-column">
        <p className="right-description">
          {description}
        </p>
      </div>
    </div>
  )
}

export default SecondSection
