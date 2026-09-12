// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import { usePathname } from 'next/navigation'
// import gsap from 'gsap'
// import './NavContent.css'

// // Section names — apne hisaab se rename kar sakta hai
// const CHAPTERS = [
//   'HERO',
//   'INTRO',
//   'SHOWCASE',
//   'CAPABILITY',
//   'PROCESS',
//   'PROJECTS',
//   'QUALITY',
//   'CONTACT',
// ]

// const TOTAL_CHAPTERS = CHAPTERS.length

// // ======================================================
// // PAGE BUTTONS
// // Yahan har page ke buttons set kar sakte ho
// // ======================================================

// const PAGE_BUTTONS = {
//   '/': [
//     {
//       label: 'MEET FORGENTIS',
//       href: '/about',
//     },
//     {
//       label: 'START A PROJECT',
//       href: '/contact',
//     },
//   ],

//   '/about': [
//     {
//       label: 'EXPLORE OUR WORK',
//       href: '/works',
//     },
//     {
//       label: 'START A PROJECT',
//       href: '/contact',
//     },
//   ],

//   '/works': [
//     {
//       label: 'VIEW CAPABILITIES',
//       href: '/capabilities',
//     },
//     {
//       label: 'START A PROJECT',
//       href: '/contact',
//     },
//   ],

//   '/capabilities': [
//     {
//       label: 'VIEW OUR WORK',
//       href: '/works',
//     },
//     {
//       label: 'START A PROJECT',
//       href: '/contact',
//     },
//   ],

//   '/industries': [
//     {
//       label: 'VIEW OUR WORK',
//       href: '/works',
//     },
//     {
//       label: 'START A PROJECT',
//       href: '/contact',
//     },
//   ],

//   '/quality': [
//     {
//       label: 'EXPLORE FACILITIES',
//       href: '/facilities',
//     },
//     {
//       label: 'START A PROJECT',
//       href: '/contact',
//     },
//   ],

//   '/facilities': [
//     {
//       label: 'OUR CAPABILITIES',
//       href: '/capabilities',
//     },
//     {
//       label: 'START A PROJECT',
//       href: '/contact',
//     },
//   ],

//   '/contact': [
//     {
//       label: 'MEET FORGENTIS',
//       href: '/about',
//     },
//     {
//       label: 'VIEW OUR WORK',
//       href: '/works',
//     },
//   ],
// }

// // Default buttons agar koi page PAGE_BUTTONS mein na ho
// const DEFAULT_BUTTONS = [
//   {
//     label: 'MEET FORGENTIS',
//     href: '/about',
//   },
//   {
//     label: 'START A PROJECT',
//     href: '/contact',
//   },
// ]

// function NavContent() {

//   const pathname = usePathname()
//   const isAboutPage = pathname === '/about'

//   // Current page ke buttons
//   const pageButtons = PAGE_BUTTONS[pathname] || DEFAULT_BUTTONS

//   const navRef = useRef(null)
//   const logoRef = useRef(null)
//   const headingRef = useRef(null)
//   const titleRef = useRef(null)

//   // Multiple buttons ke refs
//   const buttonRefs = useRef([])

//   const chaptersRef = useRef(null)
//   const progressLineRef = useRef(null)
//   const hamburgerRef = useRef(null)
//   const backToTopRef = useRef(null)
//   const footerWrapperRef = useRef(null)
//   const scrollProgressRef = useRef(0)

//   const [menuOpen, setMenuOpen] = useState(false)
//   const [activeChapter, setActiveChapter] = useState(0)
//   const [chapterProgress, setChapterProgress] = useState(0)

//   // ===== Heading char split + intro timeline =====
//   useEffect(() => {
//     if (headingRef.current) {
//       const text = headingRef.current.textContent
//       headingRef.current.innerHTML = ''

//       const words = text.split(' ')

//       words.forEach((word, wordIndex) => {

//         const wordSpan = document.createElement('span')
//         wordSpan.className = 'word'
//         wordSpan.style.display = 'inline-block'
//         wordSpan.style.whiteSpace = 'nowrap'

//         word.split('').forEach((char) => {

//           const charSpan = document.createElement('span')
//           charSpan.textContent = char
//           charSpan.className = 'char'
//           charSpan.style.display = 'inline-block'

//           wordSpan.appendChild(charSpan)

//         })

//         headingRef.current.appendChild(wordSpan)

//         if (wordIndex < words.length - 1) {
//           headingRef.current.appendChild(document.createTextNode(' '))
//         }

//       })
//     }

//     const handleChapterClick = (stageIndex) => {
//       window.dispatchEvent(new CustomEvent('travelToStage', {
//         detail: { stage: stageIndex }
//       }))
//     }

//     const timeline = gsap.timeline({ delay: 4.5 })

//     timeline
//       .fromTo(
//         logoRef.current,
//         { scale: 0, opacity: 0, y: 30, rotate: -180 },
//         {
//           scale: 1,
//           opacity: 1,
//           y: 0,
//           rotate: 0,
//           duration: 0.8,
//           ease: 'back.out(2.5)'
//         }
//       )

//       .fromTo(
//         '.nav-heading .char',
//         { y: 80, opacity: 0, scale: 0.3, rotateX: -90 },
//         {
//           y: 0,
//           opacity: 1,
//           scale: 1,
//           rotateX: 0,
//           duration: 1.5,
//           ease: 'back.out(2)',
//           stagger: 0.04
//         },
//         '+=0.05'
//       )

//       // Animate ALL current page buttons
//       .fromTo(
//         buttonRefs.current,
//         { scale: 0, opacity: 0, y: 30 },
//         {
//           scale: 1,
//           opacity: 1,
//           y: 0,
//           duration: 0.8,
//           ease: 'back.out(2.5)'
//         },
//         '+=0.15'
//       )

//     return () => timeline.kill()

//   }, [pathname])

//   // ===== Hero scroll progress — logo/button/title/footer visibility =====
//   useEffect(() => {

//     const handleScrollProgress = (e) => {

//       const progress = e.detail.progress
//       scrollProgressRef.current = progress

//       if (logoRef.current) {

//         const moveY = -progress * (window.innerHeight * 0.42)

//         gsap.to(logoRef.current, {
//           y: moveY,
//           duration: 0.1,
//           ease: 'none'
//         })

//         // Move ALL page buttons
//         if (buttonRefs.current.length) {
//           gsap.to(buttonRefs.current, {
//             y: moveY,
//             duration: 0.1,
//             ease: 'none'
//           })
//         }

//         if (hamburgerRef.current) {
//           gsap.to(hamburgerRef.current, {
//             y: moveY,
//             duration: 0.1,
//             ease: 'none'
//           })
//         }
//       }

//       if (headingRef.current) {

//         const fadeStart = 0.5
//         const fadeProgress = Math.max(
//           0,
//           Math.min(1, (progress - fadeStart) / 0.5)
//         )

//         gsap.to(headingRef.current, {
//           opacity: 1 - fadeProgress,
//           y: -fadeProgress * 80,
//           scale: 1 - fadeProgress * 0.3,
//           duration: 0.1,
//           ease: 'none',
//         })
//       }

//       if (progress >= 0.5 && hamburgerRef.current) {

//         gsap.to(hamburgerRef.current, {
//           opacity: 1,
//           x: 0,
//           duration: 0.3,
//           ease: 'power2.out',
//           pointerEvents: 'auto',
//         })

//       } else if (progress < 0.5 && hamburgerRef.current) {

//         gsap.to(hamburgerRef.current, {
//           opacity: 0,
//           x: 20,
//           duration: 0.3,
//           ease: 'power2.out',
//           pointerEvents: 'none',
//         })
//       }

//       // Footer — Hero ke start me hidden, 0.5 ke baad show
//       if (footerWrapperRef.current) {

//         const footerOpacity = progress >= 0.5 ? 1 : 0

//         gsap.to(footerWrapperRef.current, {
//           opacity: footerOpacity,
//           duration: 0.4,
//           ease: 'power2.out',
//         })
//       }
//     }

//     window.addEventListener('scrollProgress', handleScrollProgress)

//     return () =>
//       window.removeEventListener(
//         'scrollProgress',
//         handleScrollProgress
//       )

//   }, [])

//   // ===== Stage change + per-chapter progress =====
//   useEffect(() => {

//     const handleStageChange = (e) => {

//       const { stage } = e.detail

//       setActiveChapter(stage)
//     }

//     const handleStageProgress = (e) => {

//       const { stage, progress } = e.detail

//       setActiveChapter(stage)
//       setChapterProgress(progress)

//       // Last chapter pe — footer hide, Back to Top show
//       if (stage === TOTAL_CHAPTERS - 1) {

//         if (chaptersRef.current) {
//           gsap.to(chaptersRef.current, {
//             opacity: 0,
//             y: 20,
//             duration: 0.4,
//             ease: 'power2.out'
//           })
//         }

//         if (progressLineRef.current?.parentElement) {
//           gsap.to(
//             progressLineRef.current.parentElement,
//             {
//               opacity: 0,
//               duration: 0.4,
//               ease: 'power2.out'
//             }
//           )
//         }

//         if (backToTopRef.current) {
//           gsap.to(backToTopRef.current, {
//             opacity: 1,
//             y: 0,
//             duration: 0.4,
//             ease: 'power2.out',
//             pointerEvents: 'auto',
//           })
//         }

//       } else {

//         if (chaptersRef.current) {
//           gsap.to(chaptersRef.current, {
//             opacity: 1,
//             y: 0,
//             duration: 0.4,
//             ease: 'power2.out'
//           })
//         }

//         if (progressLineRef.current?.parentElement) {
//           gsap.to(
//             progressLineRef.current.parentElement,
//             {
//               opacity: 1,
//               duration: 0.4,
//               ease: 'power2.out'
//             }
//           )
//         }

//         if (backToTopRef.current) {
//           gsap.to(backToTopRef.current, {
//             opacity: 0,
//             y: 20,
//             duration: 0.4,
//             ease: 'power2.out',
//             pointerEvents: 'none',
//           })
//         }
//       }
//     }

//     window.addEventListener('stageChange', handleStageChange)
//     window.addEventListener('stageProgress', handleStageProgress)

//     return () => {

//       window.removeEventListener(
//         'stageChange',
//         handleStageChange
//       )

//       window.removeEventListener(
//         'stageProgress',
//         handleStageProgress
//       )

//     }

//   }, [])

//   // ===== Overall progress line update =====
//   useEffect(() => {

//     if (!progressLineRef.current) return

//     const overall =
//       (activeChapter + chapterProgress) /
//       TOTAL_CHAPTERS

//     gsap.to(progressLineRef.current, {
//       scaleX: Math.max(0.02, overall),
//       duration: 0.15,
//       ease: 'power2.out',
//     })

//   }, [activeChapter, chapterProgress])

//   useEffect(() => {

//     if (menuOpen) {

//       gsap.fromTo(
//         '.nav-sidebar',
//         { x: '100%' },
//         {
//           x: '0%',
//           duration: 0.6,
//           ease: 'power3.inOut'
//         }
//       )
//     }

//   }, [menuOpen])

//   // Sidebar ke andar wheel scroll enable karo
//   // Sidebar ke andar smooth wheel scroll
//   useEffect(() => {

//     if (!menuOpen) return

//     const sidebar = document.querySelector('.nav-sidebar')

//     if (!sidebar) return

//     let targetScroll = sidebar.scrollTop
//     let currentScroll = sidebar.scrollTop
//     let rafId = null

//     const smoothScroll = () => {

//       // Lerp — smooth glide
//       currentScroll +=
//         (targetScroll - currentScroll) * 0.12

//       sidebar.scrollTop = currentScroll

//       if (
//         Math.abs(
//           targetScroll - currentScroll
//         ) > 0.5
//       ) {

//         rafId = requestAnimationFrame(
//           smoothScroll
//         )

//       } else {

//         sidebar.scrollTop = targetScroll
//         currentScroll = targetScroll
//         rafId = null
//       }
//     }

//     const handleSidebarWheel = (e) => {

//       e.stopPropagation()
//       e.preventDefault()

//       const maxScroll =
//         sidebar.scrollHeight -
//         sidebar.clientHeight

//       targetScroll = Math.max(
//         0,
//         Math.min(
//           maxScroll,
//           targetScroll + e.deltaY
//         )
//       )

//       if (!rafId) {

//         currentScroll = sidebar.scrollTop

//         rafId =
//           requestAnimationFrame(
//             smoothScroll
//           )
//       }
//     }

//     // Scrollbar drag bhi handle karo — target reset ho
//     const handleScroll = () => {

//       if (!rafId) {

//         targetScroll = sidebar.scrollTop
//         currentScroll = sidebar.scrollTop

//       }
//     }

//     sidebar.addEventListener(
//       'wheel',
//       handleSidebarWheel,
//       { passive: false }
//     )

//     sidebar.addEventListener(
//       'scroll',
//       handleScroll
//     )

//     return () => {

//       sidebar.removeEventListener(
//         'wheel',
//         handleSidebarWheel
//       )

//       sidebar.removeEventListener(
//         'scroll',
//         handleScroll
//       )

//       if (rafId) {
//         cancelAnimationFrame(rafId)
//       }
//     }

//   }, [menuOpen])

//   const toggleMenu = () => {

//     if (menuOpen) {

//       gsap.to(
//         '.nav-sidebar',
//         {
//           x: '100%',
//           duration: 0.6,
//           ease: 'power3.inOut',
//           onComplete: () =>
//             setMenuOpen(false),
//         }
//       )

//     } else {

//       setMenuOpen(true)
//     }
//   }

//   const handleChapterClick = (stageIndex) => {

//     window.dispatchEvent(
//       new CustomEvent(
//         'travelToStage',
//         {
//           detail: {
//             stage: stageIndex
//           }
//         }
//       )
//     )
//   }

//   const handleBackToTop = () => {

//     window.dispatchEvent(
//       new CustomEvent(
//         'travelToStage',
//         {
//           detail: {
//             stage: 0
//           }
//         }
//       )
//     )
//   }

//   const CHAPTER_MENU = [
//     {
//       chapter: 'CHAPTER I',
//       label: 'ABOUT',
//       href: '/about',
//     },

//     {
//       chapter: 'CHAPTER II-IV',
//       label: 'WORKS',
//       href: '/works',
//       expandable: true,
//       subItems: [
//         {
//           label: 'CAPABILITIES',
//           href: '/capabilities'
//         },
//         {
//           label: 'INDUSTRIES',
//           href: '/industries'
//         },
//         {
//           label: 'QUALITY',
//           href: '/quality'
//         },
//         {
//           label: 'FACILITIES',
//           href: '/facilities'
//         },
//       ],
//     },

//     {
//       chapter: 'CHAPTER V',
//       label: 'CONTACT',
//       href: '/contact',
//     },
//   ]

//   return (
//     <>
//       <div
//         ref={navRef}
//         className="nav-content"
//       >

//         <div
//           ref={logoRef}
//           className="nav-logo"
//         >
//           <img
//             src="/images/logo.webp"
//             alt="Logo"
//           />
//         </div>

//         <div className="nav-heading">
//           <h1 ref={headingRef}>
//             {isAboutPage
//               ? "BUILT ON PRECISION. DRIVEN BY PURPOSE"
//               : "we shape what builds"}
//           </h1>
//         </div>

//         <div
//           ref={titleRef}
//           className="nav-title"
//         >
//           <li>25,000+ SQ. FT. FACILITY</li>
//           <li>40+ MACHINES</li>
//           <li>10-TON LIFTING CAPACITY</li>
//           <li>END-TO-END FABRICATION</li>
//         </div>

//         <div className="nav-right-group">

//           {/* ==========================================
//               PAGE BASED BUTTONS
//               ========================================== */}

//           {pageButtons.map((button, index) => (

//             <button
//               key={`${pathname}-${button.label}-${index}`}
//               ref={(el) => {
//                 buttonRefs.current[index] = el
//               }}
//               className="nav-button"
//               onClick={() => {
//                 window.location.href =
//                   button.href
//               }}
//             >
//               {button.label}
//             </button>

//           ))}

//           <button
//             ref={hamburgerRef}
//             className={`nav-hamburger ${
//               menuOpen ? 'active' : ''
//             }`}
//             style={{
//               opacity: 0,
//               pointerEvents: 'none',
//               x: 20
//             }}
//             onClick={toggleMenu}
//           >
//             <span></span>
//             <span></span>
//             <span></span>
//           </button>

//         </div>

//         <div
//           ref={footerWrapperRef}
//           className="nav-footer-wrapper"
//           style={{
//             opacity: 0
//           }}
//         >

//           {/* Chapters — dynamic */}
//           <div
//             ref={chaptersRef}
//             className="nav-chapters"
//           >

//             {CHAPTERS.map((ch, i) => (

//               <div
//                 key={ch}
//                 className={`chapter-item ${
//                   i === activeChapter
//                     ? 'active'
//                     : ''
//                 }`}
//                 onClick={() =>
//                   handleChapterClick(i)
//                 }
//                 style={{
//                   cursor: 'pointer'
//                 }}
//               >
//                 <span className="chapter-label">
//                   {ch}
//                 </span>

//                 <span className="chapter-dot" />
//               </div>

//             ))}

//           </div>

//           {/* Progress line */}
//           <div className="progress-line-container">

//             <div
//               ref={progressLineRef}
//               className="progress-line"
//             ></div>

//           </div>

//           {/* Back to Top button */}
//           <button
//             ref={backToTopRef}
//             className="back-to-top-btn"
//             style={{
//               opacity: 0,
//               pointerEvents: 'none',
//               transform:
//                 'translateY(20px)'
//             }}
//             onClick={handleBackToTop}
//           >
//             BACK TO TOP ↑
//           </button>

//         </div>

//       </div>

//       {menuOpen && (

//         <div className="nav-sidebar">

//           {/* Close button */}
//           <button
//             className="sidebar-close"
//             onClick={toggleMenu}
//           >
//             <span></span>
//             <span></span>
//           </button>

//           {/* Main nav — chapter accordion */}
//           <nav className="sidebar-nav">

//             {CHAPTER_MENU.map(
//               (item, index) => (

//                 <div
//                   key={item.label}
//                   className="sidebar-chapter"
//                 >

//                   <div
//                     className="sidebar-chapter-header"
//                     onClick={() => {

//                       if (item.expandable) {

//                         // Toggle submenu
//                         const el =
//                           document.querySelector(
//                             `.sidebar-submenu-${index}`
//                           )

//                         if (el) {

//                           const isOpen =
//                             el.classList.contains(
//                               'open'
//                             )

//                           if (isOpen) {

//                             gsap.to(
//                               el,
//                               {
//                                 height: 0,
//                                 opacity: 0,
//                                 duration: 0.4,
//                                 ease:
//                                   'power2.inOut'
//                               }
//                             )

//                             el.classList.remove(
//                               'open'
//                             )

//                           } else {

//                             gsap.to(
//                               el,
//                               {
//                                 height: 'auto',
//                                 opacity: 1,
//                                 duration: 0.4,
//                                 ease:
//                                   'power2.inOut',

//                                 onStart: () =>
//                                   el.classList.add(
//                                     'open'
//                                   ),
//                               }
//                             )
//                           }
//                         }

//                       } else {

//                         // Navigate
//                         window.location.href =
//                           item.href
//                       }

//                     }}
//                   >

//                     <span className="sidebar-chapter-label">
//                       {item.chapter}
//                     </span>

//                     <span className="sidebar-chapter-title">
//                       {item.label}
//                     </span>

//                     {item.expandable && (
//                       <span className="sidebar-plus">
//                         +
//                       </span>
//                     )}

//                   </div>

//                   {item.expandable && (

//                     <div
//                       className={`sidebar-submenu sidebar-submenu-${index}`}
//                       style={{
//                         height: 0,
//                         opacity: 0,
//                         overflow: 'hidden'
//                       }}
//                     >

//                       {item.subItems.map(
//                         (sub) => (

//                           <a
//                             key={sub.label}
//                             href={sub.href}
//                             className="sidebar-subitem"
//                             onClick={(e) => {

//                               e.preventDefault()

//                               window.location.href =
//                                 sub.href

//                             }}
//                           >
//                             {sub.label}
//                           </a>

//                         )
//                       )}

//                     </div>

//                   )}

//                 </div>

//               )
//             )}

//           </nav>

//           {/* Bottom contact info */}
//           <div className="sidebar-footer">

//             <div className="sidebar-footer-col">

//               <span className="sidebar-footer-label">
//                 Phone
//               </span>

//               <a
//                 href="tel:+13056801920"
//                 className="sidebar-footer-value"
//               >
//                 +92 21 111 254 111
//                 <span className="sidebar-footer-sub">
//                   (whatsapp)
//                 </span>
//               </a>

//             </div>

//             <div className="sidebar-footer-col">

//               <span className="sidebar-footer-label">
//                 Mail
//               </span>

//               <a
//                 href="mailto:info@forgentisfabrication.com"
//                 className="sidebar-footer-value"
//               >
//                 info@forgentisfabrication.com
//               </a>

//             </div>

//             <div className="sidebar-footer-col">

//               <span className="sidebar-footer-label">
//                 Offices
//               </span>

//               <span className="sidebar-footer-value">
//                 HQ in Miami
//               </span>

//             </div>

//             <div className="sidebar-footer-col">

//               <span className="sidebar-footer-label">
//                 Socials
//               </span>

//               <div className="sidebar-socials">

//                 <a
//                   href="https://instagram.com"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Instagram
//                 </a>

//                 <a
//                   href="https://facebook.com"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Facebook
//                 </a>

//                 <a
//                   href="https://youtube.com"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Youtube
//                 </a>

//                 <a
//                   href="https://linkedin.com"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Linkedin
//                 </a>

//                 <a
//                   href="https://pinterest.com"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Pinterest
//                 </a>

//               </div>

//             </div>

//             <div className="sidebar-footer-bottom">

//               <a href="/privacy">
//                 Privacy Policy
//               </a>

//               <a href="/presentation">
//                 Presentation
//               </a>

//               <span>
//                 © 2024 Forgentis
//               </span>

//             </div>

//           </div>

//         </div>

//       )}

//     </>
//   )
// }

// export default NavContent



'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import './NavContent.css'

// Section names — apne hisaab se rename kar sakta hai
const CHAPTERS = [
  'HERO',
  'INTRO',
  'SHOWCASE',
  'CAPABILITY',
  'PROCESS',
  'PROJECTS',
  'QUALITY',
  'CONTACT',
]

const TOTAL_CHAPTERS = CHAPTERS.length

// ======================================================
// PAGE BUTTONS
// Yahan har page ke buttons set kar sakte ho
// ======================================================

const PAGE_BUTTONS = {
  '/': [
    {
      label: 'MEET FORGENTIS',
      href: '/about',
    },
    {
      label: 'START A PROJECT',
      href: '/contact',
    },
  ],

  '/about': [
    {
      label: 'EXPLORE OUR WORK',
      href: '/works',
    },
    {
      label: 'START A PROJECT',
      href: '/contact',
    },
  ],

  '/works': [
    {
      label: 'VIEW CAPABILITIES',
      href: '/capabilities',
    },
    {
      label: 'START A PROJECT',
      href: '/contact',
    },
  ],

  '/capabilities': [
    {
      label: 'VIEW OUR WORK',
      href: '/works',
    },
    {
      label: 'START A PROJECT',
      href: '/contact',
    },
  ],

  '/industries': [
    {
      label: 'VIEW OUR WORK',
      href: '/works',
    },
    {
      label: 'START A PROJECT',
      href: '/contact',
    },
  ],

  '/quality': [
    {
      label: 'EXPLORE FACILITIES',
      href: '/facilities',
    },
    {
      label: 'START A PROJECT',
      href: '/contact',
    },
  ],

  '/facilities': [
    {
      label: 'OUR CAPABILITIES',
      href: '/capabilities',
    },
    {
      label: 'START A PROJECT',
      href: '/contact',
    },
  ],

  '/contact': [
    {
      label: 'MEET FORGENTIS',
      href: '/about',
    },
    {
      label: 'VIEW OUR WORK',
      href: '/works',
    },
  ],
}

// Default buttons agar koi page PAGE_BUTTONS mein na ho
const DEFAULT_BUTTONS = [
  {
    label: 'MEET FORGENTIS',
    href: '/about',
  },
  {
    label: 'START A PROJECT',
    href: '/capabilities',
  },
  {
    label: 'START A PROJECT',
    href: '/contact',
  },
]

function NavContent() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isAboutPage = pathname === '/about'

  // Current page ke buttons
  const pageButtons = PAGE_BUTTONS[pathname] || DEFAULT_BUTTONS

  const navRef = useRef(null)
  const logoRef = useRef(null)
  const headingRef = useRef(null)
  const titleRef = useRef(null)

  // Multiple buttons ke refs
  const buttonRefs = useRef([])

  const chaptersRef = useRef(null)
  const progressLineRef = useRef(null)
  const hamburgerRef = useRef(null)
  const backToTopRef = useRef(null)
  const footerWrapperRef = useRef(null)
  const scrollProgressRef = useRef(0)

  const [menuOpen, setMenuOpen] = useState(false)
  const [activeChapter, setActiveChapter] = useState(0)
  const [chapterProgress, setChapterProgress] = useState(0)

  // ===== Heading char split + intro timeline =====
  useEffect(() => {
    if (headingRef.current) {
      const text = headingRef.current.textContent
      headingRef.current.innerHTML = ''

      const words = text.split(' ')

      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span')
        wordSpan.className = 'word'
        wordSpan.style.display = 'inline-block'
        wordSpan.style.whiteSpace = 'nowrap'

        word.split('').forEach((char) => {
          const charSpan = document.createElement('span')
          charSpan.textContent = char
          charSpan.className = 'char'
          charSpan.style.display = 'inline-block'

          wordSpan.appendChild(charSpan)
        })

        headingRef.current.appendChild(wordSpan)

        if (wordIndex < words.length - 1) {
          headingRef.current.appendChild(document.createTextNode(' '))
        }
      })
    }

    // Only run entrance intro timeline on the home page
    if (!isHomePage) {
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 0, display: 'none' })
      if (logoRef.current) gsap.set(logoRef.current, { scale: 1, opacity: 1, rotate: 0 })
      if (buttonRefs.current.length) gsap.set(buttonRefs.current, { scale: 1, opacity: 1 })
      return
    }

    const timeline = gsap.timeline({ delay: 2.5 })

    timeline
      .fromTo(
        logoRef.current,
        { scale: 0, opacity: 0, y: 30, rotate: -180 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 0.8,
          ease: 'back.out(2.5)',
        }
      )
      .fromTo(
        '.nav-heading .char',
        { y: 80, opacity: 0, scale: 0.3, rotateX: -90 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 1.5,
          ease: 'back.out(2)',
          stagger: 0.04,
        },
        '+=0.05'
      )
      // Animate ALL current page buttons
      .fromTo(
        buttonRefs.current,
        { scale: 0, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(2.5)',
        },
        '+=0.15'
      )

    return () => timeline.kill()
  }, [pathname, isHomePage])

  // ===== Hero scroll progress — logo/button/title/footer visibility =====
  useEffect(() => {
    // Non-home pages: Lock directly in the final header navbar place
    if (!isHomePage) {
      const fixedHeaderY = -window.innerHeight * 0.42

      if (logoRef.current) {
        gsap.set(logoRef.current, { y: fixedHeaderY })
      }
      if (buttonRefs.current.length) {
        gsap.set(buttonRefs.current, { y: fixedHeaderY })
      }
      if (hamburgerRef.current) {
        gsap.set(hamburgerRef.current, {
          y: fixedHeaderY,
          opacity: 1,
          x: 0,
          pointerEvents: 'auto',
        })
      }
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, display: 'none' })
      }
      if (footerWrapperRef.current) {
        gsap.set(footerWrapperRef.current, { opacity: 1 })
      }
      return
    }

    // Home page: React to scroll progress
    const handleScrollProgress = (e) => {
      const progress = e.detail.progress
      scrollProgressRef.current = progress

      if (logoRef.current) {
        const moveY = -progress * (window.innerHeight * 0.42)

        gsap.to(logoRef.current, {
          y: moveY,
          duration: 0.1,
          ease: 'none',
        })

        // Move ALL page buttons
        if (buttonRefs.current.length) {
          gsap.to(buttonRefs.current, {
            y: moveY,
            duration: 0.1,
            ease: 'none',
          })
        }

        if (hamburgerRef.current) {
          gsap.to(hamburgerRef.current, {
            y: moveY,
            duration: 0.1,
            ease: 'none',
          })
        }
      }

      if (headingRef.current) {
        const fadeStart = 0.5
        const fadeProgress = Math.max(
          0,
          Math.min(1, (progress - fadeStart) / 0.5)
        )

        gsap.to(headingRef.current, {
          opacity: 1 - fadeProgress,
          y: -fadeProgress * 80,
          scale: 1 - fadeProgress * 0.3,
          duration: 0.1,
          ease: 'none',
        })
      }

      if (progress >= 0.5 && hamburgerRef.current) {
        gsap.to(hamburgerRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: 'power2.out',
          pointerEvents: 'auto',
        })
      } else if (progress < 0.5 && hamburgerRef.current) {
        gsap.to(hamburgerRef.current, {
          opacity: 0,
          x: 20,
          duration: 0.3,
          ease: 'power2.out',
          pointerEvents: 'none',
        })
      }

      // Footer — Hero ke start me hidden, 0.5 ke baad show
      if (footerWrapperRef.current) {
        const footerOpacity = progress >= 0.5 ? 1 : 0

        gsap.to(footerWrapperRef.current, {
          opacity: footerOpacity,
          duration: 0.4,
          ease: 'power2.out',
        })
      }
    }

    window.addEventListener('scrollProgress', handleScrollProgress)

    return () =>
      window.removeEventListener('scrollProgress', handleScrollProgress)
  }, [isHomePage])

  // ===== Stage change + per-chapter progress =====
  useEffect(() => {
    const handleStageChange = (e) => {
      const { stage } = e.detail
      setActiveChapter(stage)
    }

    const handleStageProgress = (e) => {
      const { stage, progress } = e.detail

      setActiveChapter(stage)
      setChapterProgress(progress)

      // Last chapter pe — footer hide, Back to Top show
      if (stage === TOTAL_CHAPTERS - 1) {
        if (chaptersRef.current) {
          gsap.to(chaptersRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: 'power2.out',
          })
        }

        if (progressLineRef.current?.parentElement) {
          gsap.to(progressLineRef.current.parentElement, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
          })
        }

        if (backToTopRef.current) {
          gsap.to(backToTopRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            pointerEvents: 'auto',
          })
        }
      } else {
        if (chaptersRef.current) {
          gsap.to(chaptersRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          })
        }

        if (progressLineRef.current?.parentElement) {
          gsap.to(progressLineRef.current.parentElement, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          })
        }

        if (backToTopRef.current) {
          gsap.to(backToTopRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: 'power2.out',
            pointerEvents: 'none',
          })
        }
      }
    }

    window.addEventListener('stageChange', handleStageChange)
    window.addEventListener('stageProgress', handleStageProgress)

    return () => {
      window.removeEventListener('stageChange', handleStageChange)
      window.removeEventListener('stageProgress', handleStageProgress)
    }
  }, [])

  // ===== Overall progress line update =====
  useEffect(() => {
    if (!progressLineRef.current) return

    const overall = (activeChapter + chapterProgress) / TOTAL_CHAPTERS

    gsap.to(progressLineRef.current, {
      scaleX: Math.max(0.02, overall),
      duration: 0.15,
      ease: 'power2.out',
    })
  }, [activeChapter, chapterProgress])

  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        '.nav-sidebar',
        { x: '100%' },
        {
          x: '0%',
          duration: 0.6,
          ease: 'power3.inOut',
        }
      )
    }
  }, [menuOpen])

  // Sidebar ke andar wheel scroll enable karo
  // Sidebar ke andar smooth wheel scroll
  useEffect(() => {
    if (!menuOpen) return

    const sidebar = document.querySelector('.nav-sidebar')
    if (!sidebar) return

    let targetScroll = sidebar.scrollTop
    let currentScroll = sidebar.scrollTop
    let rafId = null

    const smoothScroll = () => {
      currentScroll += (targetScroll - currentScroll) * 0.12
      sidebar.scrollTop = currentScroll

      if (Math.abs(targetScroll - currentScroll) > 0.5) {
        rafId = requestAnimationFrame(smoothScroll)
      } else {
        sidebar.scrollTop = targetScroll
        currentScroll = targetScroll
        rafId = null
      }
    }

    const handleSidebarWheel = (e) => {
      e.stopPropagation()
      e.preventDefault()

      const maxScroll = sidebar.scrollHeight - sidebar.clientHeight

      targetScroll = Math.max(
        0,
        Math.min(maxScroll, targetScroll + e.deltaY)
      )

      if (!rafId) {
        currentScroll = sidebar.scrollTop
        rafId = requestAnimationFrame(smoothScroll)
      }
    }

    const handleScroll = () => {
      if (!rafId) {
        targetScroll = sidebar.scrollTop
        currentScroll = sidebar.scrollTop
      }
    }

    sidebar.addEventListener('wheel', handleSidebarWheel, { passive: false })
    sidebar.addEventListener('scroll', handleScroll)

    return () => {
      sidebar.removeEventListener('wheel', handleSidebarWheel)
      sidebar.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [menuOpen])

  const toggleMenu = () => {
    if (menuOpen) {
      gsap.to('.nav-sidebar', {
        x: '100%',
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => setMenuOpen(false),
      })
    } else {
      setMenuOpen(true)
    }
  }

  const handleChapterClick = (stageIndex) => {
    window.dispatchEvent(
      new CustomEvent('travelToStage', {
        detail: { stage: stageIndex },
      })
    )
  }

  const handleBackToTop = () => {
    window.dispatchEvent(
      new CustomEvent('travelToStage', {
        detail: { stage: 0 },
      })
    )
  }

  const CHAPTER_MENU = [
    {
      chapter: '',
      label: 'ABOUT',
      href: '/about',
    },
    {
      chapter: '',
      label: 'CAPABILITIES',
      href: '/capabilities',
    },
    {
      chapter: '',
      label: 'INDUSTRIES',
      href: '/industries',
    },

    {
      chapter: '',
      label: 'QUALITY',
      href: '/quality',
    },
    {
      chapter: '',
      label: 'FACILITIES',
      href: '/facilities',
    },
  ]

  return (
    <>
      <div ref={navRef} className="nav-content">
        <div onClick={()=>{window.location.href = "/"}} ref={logoRef} className="nav-logo">
          <img src="/images/logo.webp" alt="Logo" />
        </div>

        <div className="nav-heading">
          <h1 ref={headingRef}>
            {isAboutPage
              ? 'BUILT ON PRECISION. DRIVEN BY PURPOSE'
              : 'we shape what builds'}
          </h1>
        </div>

        <div ref={titleRef} className="nav-title">
          <li>25,000+ SQ. FT. FACILITY</li>
          <li>40+ MACHINES</li>
          <li>10-TON LIFTING CAPACITY</li>
          <li>END-TO-END FABRICATION</li>
        </div>

        <div className="nav-right-group">
          {/* ==========================================
              PAGE BASED BUTTONS
              ========================================== */}
          {pageButtons.map((button, index) => (
            <button
              key={`${pathname}-${button.label}-${index}`}
              ref={(el) => {
                buttonRefs.current[index] = el
              }}
              className="nav-button"
              onClick={() => {
                window.location.href = button.href
              }}
            >
              {button.label}
            </button>
          ))}

          <button
            ref={hamburgerRef}
            className={`nav-hamburger ${menuOpen ? 'active' : ''}`}
            style={{
              opacity: isHomePage ? 0 : 1,
              pointerEvents: isHomePage ? 'none' : 'auto',
              transform: isHomePage ? 'translateX(20px)' : 'translateX(0)',
            }}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {isHomePage && <div
          ref={footerWrapperRef}
          className="nav-footer-wrapper"
          style={{
            opacity: isHomePage ? 0 : 1,
          }}
        >
          {/* Chapters — dynamic */}
          <div ref={chaptersRef} className="nav-chapters">
            {CHAPTERS.map((ch, i) => (
              <div
                key={ch}
                className={`chapter-item ${i === activeChapter ? 'active' : ''
                  }`}
                onClick={() => handleChapterClick(i)}
                style={{
                  cursor: 'pointer',
                }}
              >
                <span className="chapter-label">{ch}</span>
                <span className="chapter-dot" />
              </div>
            ))}
          </div>

          {/* Progress line */}
          <div className="progress-line-container">
            <div
              ref={progressLineRef}
              className="progress-line"
            ></div>
          </div>

          {/* Back to Top button */}
          <button
            ref={backToTopRef}
            className="back-to-top-btn"
            style={{
              opacity: 0,
              pointerEvents: 'none',
              transform: 'translateY(20px)',
            }}
            onClick={handleBackToTop}
          >
            BACK TO TOP ↑
          </button>
        </div>}
      </div>

      {menuOpen && (
        <div className="nav-sidebar">
          {/* Close button */}
          <button className="sidebar-close" onClick={toggleMenu}>
            <span></span>
            <span></span>
          </button>

          {/* Main nav — chapter accordion */}
          <nav className="sidebar-nav">
            {CHAPTER_MENU.map((item, index) => (
              <div key={item.label} className="sidebar-chapter">
                <div
                  className="sidebar-chapter-header"
                  onClick={() => {
                    if (item.expandable) {
                      const el = document.querySelector(
                        `.sidebar-submenu-${index}`
                      )
                      if (el) {
                        const isOpen = el.classList.contains('open')
                        if (isOpen) {
                          gsap.to(el, {
                            height: 0,
                            opacity: 0,
                            duration: 0.4,
                            ease: 'power2.inOut',
                          })
                          el.classList.remove('open')
                        } else {
                          gsap.to(el, {
                            height: 'auto',
                            opacity: 1,
                            duration: 0.4,
                            ease: 'power2.inOut',
                            onStart: () => el.classList.add('open'),
                          })
                        }
                      }
                    } else {
                      window.location.href = item.href
                    }
                  }}
                >
                  {/* <span className="sidebar-chapter-label">{item.chapter}</span> */}
                  <span className="sidebar-chapter-title">{item.label}</span>
                  {item.expandable && <span className="sidebar-plus">+</span>}
                </div>

                {item.expandable && (
                  <div
                    className={`sidebar-submenu sidebar-submenu-${index}`}
                    style={{
                      height: 0,
                      opacity: 0,
                      overflow: 'hidden',
                    }}
                  >
                    {item.subItems.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.href}
                        className="sidebar-subitem"
                        onClick={(e) => {
                          e.preventDefault()
                          window.location.href = sub.href
                        }}
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Bottom contact info */}
          <div className="sidebar-footer">
            <div className="sidebar-footer-col">
              <span className="sidebar-footer-label">Phone</span>
              <a
                href="tel:+13056801920"
                className="sidebar-footer-value"
              >
                +92 21 111 254 111
                <span className="sidebar-footer-sub">(whatsapp)</span>
              </a>
            </div>

            <div className="sidebar-footer-col">
              <span className="sidebar-footer-label">Mail</span>
              <a
                href="mailto:info@forgentisfabrication.com"
                className="sidebar-footer-value"
              >
                info@forgentisfabrication.com
              </a>
            </div>

            {/* <div className="sidebar-footer-col">
              <span className="sidebar-footer-label">Offices</span>
              <span className="sidebar-footer-value">HQ in Miami</span>
            </div> */}

            <div className="sidebar-footer-col">
              <span className="sidebar-footer-label">Socials</span>
              <div className="sidebar-socials">
               
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Linkedin
                </a>
              
              </div>
            </div>

            <div className="sidebar-footer-bottom">
              <a href="/privacy">Privacy Policy</a>
              <span>©2026 Forgentis Fabrication</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NavContent