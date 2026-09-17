'use client'

import { useEffect, useState } from 'react'
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import CursorTrail from '@/components/CursorTrail/CursorTrail'

// Isi key se pata chalta hai ke animation is (tab) session mein already dikh chuki hai ya nahi.
// sessionStorage istemal kiya hai — matlab: tab band/refresh karke naya tab khologe to phir se
// chalegi, lekin isi tab mein switch karke wapas aane par NAHI chalegi.
// Agar chahiye ke bilkul sirf "pehli baar EVER" chale (browser band karne ke baad bhi dobara na
// chale), to neeche 'sessionStorage' ko 'localStorage' se replace kar dena.
const LOADING_FLAG_KEY = 'forgentis_loading_shown'

export default function GlobalEffects({ children }) {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)
  const [skipAnimation, setSkipAnimation] = useState(false)

  useEffect(() => {
    let alreadyShown = false
    try {
      alreadyShown = sessionStorage.getItem(LOADING_FLAG_KEY) === 'true'
    } catch (err) {
      // sessionStorage blocked (private/incognito mode etc.) — fallback: animation chalne do
      alreadyShown = false
    }

    if (alreadyShown) {
      // Pehle hi dikha chuke hain isi session/tab mein — GSAP timeline ko turant rok kar
      // seedha "complete" state par le jao, dobara poora animation na chale
      setSkipAnimation(true)
    }
  }, [])

  const handleLoadingComplete = () => {
    try {
      sessionStorage.setItem(LOADING_FLAG_KEY, 'true')
    } catch (err) {
      // storage available nahi — bas ignore karo, sirf is baar flag save nahi hoga
    }
    setShowLoadingScreen(false)
    window.dispatchEvent(new CustomEvent('globalLoadingComplete'))
  }

  return (
    <>
      {showLoadingScreen && (
        <LoadingScreen onComplete={handleLoadingComplete} skipAnimation={skipAnimation} />
      )}

      <CursorTrail />

      {children}
    </>
  )
}

// 'use client'

// import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
// import CursorTrail from '@/components/CursorTrail/CursorTrail'

// export default function GlobalEffects({ children }) {
//   const handleLoadingComplete = () => {
//     window.dispatchEvent(
//       new CustomEvent('globalLoadingComplete')
//     )
//   }

//   return (
//     <>
//       <LoadingScreen onComplete={handleLoadingComplete} />

//       <CursorTrail />

//       {children}
//     </>
//   )
// }