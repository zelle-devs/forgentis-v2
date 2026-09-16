'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './style.css'

const processCards = [
  {
    id: '01',
    title: 'CUT',
    description: 'Dimensions and profiles checked against the requirement.',
    image: '/images/1cut.webp',
    rotation: -2,
  },
  {
    id: '02',
    title: 'FORM',
    description: 'Bends, angles and formed components verified.',
    image: '/images/step2.webp',
    rotation: 2,
  },
  {
    id: '03',
    title: 'MACHINE',
    description: 'Critical dimensions and features checked.',
    image: '/images/step3.webp',
    rotation: -1.5,
  },
  {
    id: '04',
    title: 'WELD',
    description: 'Joints, appearance and workmanship inspected.',
    image: '/images/step4.webp',
    rotation: 2,
  },
  {
    id: '05',
    title: 'ASSEMBLE',
    description: 'Components checked for fit, alignment and completeness.',
    image: '/images/step5.webp',
    rotation: -1.5,
  },
  {
    id: '06',
    title: 'FINISH',
    description: 'Surface treatment and final appearance verified.',
    image: '/images/step2.webp',
    rotation: 2,
  },
]

export default function ResourceSection() {
  const cardsRef = useRef([])
  const timelineRef = useRef(null)

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean)
    if (!cards.length) return

    const isMobile = window.innerWidth <= 800

    // Initially SABHI cards ko hidden rakhein (opacity: 0) taake koi image pehle na dikhe
    cards.forEach((card, index) => {
      gsap.set(card, {
        xPercent: -50,
        y: isMobile ? 300 : 700,
        scale: 0.94,
        rotation: processCards[index].rotation,
        opacity: 0,
        zIndex: 100 + index,
      })
    })

    const tl = gsap.timeline({ paused: true })
    const STACK_OFFSET = 42

    // Pehli card ki entry ke liye step (Progress 0 se 1 ke beech smoothly aayegi)
    tl.to(cards[0], {
      y: 0,
      scale: 1,
      rotation: processCards[0].rotation,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
    }, 'card-1')

    // Baaki cards ka loop jo ek-ek karke scroll par aayengi
    for (let i = 1; i < cards.length; i++) {
      const label = `card-${i + 1}`

      for (let j = 0; j <= i; j++) {
        const depth = i - j
        tl.to(
          cards[j],
          {
            y: j === i ? 0 : -(depth * STACK_OFFSET),
            scale: j === i ? 1 : (1 - depth * 0.025),
            rotation: processCards[j].rotation + (j % 2 === 0 ? -depth * 0.35 : depth * 0.35),
            opacity: 1,
            duration: 1,
            ease: 'power3.inOut',
          },
          label
        )
      }

      tl.set(cards[i], { zIndex: 100 + i }, label)
    }

    timelineRef.current = tl

    const handleProgress = (event) => {
      const progress = event.detail?.progress ?? 0
      if (!timelineRef.current) return

      gsap.to(timelineRef.current, {
        progress,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    window.addEventListener('thirdHorizontalProgress', handleProgress)

    return () => {
      window.removeEventListener('thirdHorizontalProgress', handleProgress)
      tl.kill()
      timelineRef.current = null
    }
  }, [])

  return (
    <section className="quality-container">
      <div className="quality-grid">
        {/* LEFT CONTENT */}
        <div className="quality-left">
          <span className="quality-tag">Process Control</span>

          <h2 className="quality-heading">
            WE DON'T WAIT UNTIL THE END TO <span>FIND A PROBLEM.</span>
          </h2>

          <p className="quality-description">
            Inspection during production gives us the opportunity to identify and correct issues while the work is still on the floor.
          </p>

          {/* PROCESS LIST */}
          <div className="quality-process">
            {processCards.map((item) => (
              <div key={item.id} className="quality-process-row">
                <span className="quality-process-number">{item.id}</span>
                <span className="quality-process-title">{item.title}</span>
                <span className="quality-process-description">{item.description}</span>
              </div>
            ))}
          </div>

          <div className="quality-statement">
            Quality moves with the part.
          </div>
        </div>

        {/* RIGHT CARDS */}
        <div className="quality-right">
          <div className="quality-cards-stage">
            {processCards.map((card, index) => (
              <div
                key={card.id}
                ref={(element) => {
                  cardsRef.current[index] = element
                }}
                className="quality-card"
                style={{ backgroundImage: `url(${card.image})` }}
              >
                <div className="quality-card-overlay" />

                <div className="quality-card-top">
                  <span className="quality-card-number">{card.id}</span>
                  <span className="quality-card-label">IN-PROCESS INSPECTION</span>
                </div>

                <div className="quality-card-content">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// 'use client'

// import React, { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import './style.css'

// const processCards = [
//   {
//     id: '01',
//     title: 'CUT',
//     description: 'Dimensions and profiles checked against the requirement.',
//     image: '/images/1cut.webp',
//     rotation: -2,
//   },
//   {
//     id: '02',
//     title: 'FORM',
//     description: 'Bends, angles and formed components verified.',
//     image: '/images/step2.webp',
//     rotation: 2,
//   },
//   {
//     id: '03',
//     title: 'MACHINE',
//     description: 'Critical dimensions and features checked.',
//     image: '/images/step3.webp',
//     rotation: -1.5,
//   },
//   {
//     id: '04',
//     title: 'WELD',
//     description: 'Joints, appearance and workmanship inspected.',
//     image: '/images/step4.webp',
//     rotation: 2,
//   },
//   {
//     id: '05',
//     title: 'ASSEMBLE',
//     description: 'Components checked for fit, alignment and completeness.',
//     image: '/images/step5.webp',
//     rotation: -1.5,
//   },
//   {
//     id: '06',
//     title: 'FINISH',
//     description: 'Surface treatment and final appearance verified.',
//     image: '/images/step2.webp',
//     rotation: 2,
//   },
// ]

// export default function ResourceSection() {
//   const cardsRef = useRef([])
//   const timelineRef = useRef(null)

//   useEffect(() => {
//     const cards = cardsRef.current.filter(Boolean)
//     if (!cards.length) return

//     const isMobile = window.innerWidth <= 800

//     cards.forEach((card, index) => {
//       gsap.set(card, {
//         xPercent: -50,
//         y: index === 0 ? 0 : (isMobile ? 300 : 700), // Mobile ke liye offset kam rakha hai
//         scale: index === 0 ? 1 : 0.94,
//         rotation: index === 0 ? processCards[index].rotation : 0,
//         opacity: index === 0 ? 1 : 0,
//         zIndex: 100 + index,
//       })
//     })

//     const tl = gsap.timeline({ paused: true })
//     const STACK_OFFSET = 42

//     for (let i = 1; i < cards.length; i++) {
//       const label = `card-${i}`

//       for (let j = 0; j < i; j++) {
//         const depth = i - j
//         tl.to(
//           cards[j],
//           {
//             y: -(depth * STACK_OFFSET),
//             scale: 1 - depth * 0.025,
//             rotation:
//               processCards[j].rotation +
//               (j % 2 === 0 ? -depth * 0.35 : depth * 0.35),
//             opacity: 1,
//             duration: 1,
//             ease: 'power3.inOut',
//           },
//           label
//         )
//       }

//       tl.to(
//         cards[i],
//         {
//           y: 0,
//           scale: 1,
//           rotation: processCards[i].rotation,
//           opacity: 1,
//           duration: 1,
//           ease: 'power3.out',
//         },
//         label
//       )

//       tl.set(cards[i], { zIndex: 100 + i }, label)
//     }

//     timelineRef.current = tl

//     const handleProgress = (event) => {
//       const progress = event.detail?.progress ?? 0
//       if (!timelineRef.current) return

//       gsap.to(timelineRef.current, {
//         progress,
//         duration: 0.25,
//         ease: 'power2.out',
//         overwrite: true,
//       })
//     }

//     window.addEventListener('thirdHorizontalProgress', handleProgress)

//     gsap.set(cards[0], {
//       y: 0,
//       xPercent: -50,
//       scale: 1,
//       rotation: processCards[0].rotation,
//       opacity: 1,
//       zIndex: 100,
//     })

//     return () => {
//       window.removeEventListener('thirdHorizontalProgress', handleProgress)
//       tl.kill()
//       timelineRef.current = null
//     }
//   }, [])

//   return (
//     <section className="quality-container">
//       <div className="quality-grid">
//         {/* LEFT CONTENT */}
//         <div className="quality-left">
//           <span className="quality-tag">Process Control</span>

//           <h2 className="quality-heading">
//             WE DON'T WAIT UNTIL THE END TO <span>FIND A PROBLEM.</span>
//           </h2>

//           <p className="quality-description">
//             Inspection during production gives us the opportunity to identify and correct issues while the work is still on the floor.
//           </p>

//           {/* PROCESS LIST */}
//           <div className="quality-process">
//             {processCards.map((item) => (
//               <div key={item.id} className="quality-process-row">
//                 <span className="quality-process-number">{item.id}</span>
//                 <span className="quality-process-title">{item.title}</span>
//                 <span className="quality-process-description">{item.description}</span>
//               </div>
//             ))}
//           </div>

//           <div className="quality-statement">
//             Quality moves with the part.
//           </div>
//         </div>

//         {/* RIGHT CARDS */}
//         <div className="quality-right">
//           <div className="quality-cards-stage">
//             {processCards.map((card, index) => (
//               <div
//                 key={card.id}
//                 ref={(element) => {
//                   cardsRef.current[index] = element
//                 }}
//                 className="quality-card"
//                 style={{ backgroundImage: `url(${card.image})` }}
//               >
//                 <div className="quality-card-overlay" />

//                 <div className="quality-card-top">
//                   <span className="quality-card-number">{card.id}</span>
//                   <span className="quality-card-label">IN-PROCESS INSPECTION</span>
//                 </div>

//                 <div className="quality-card-content">
//                   <h3>{card.title}</h3>
//                   <p>{card.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }