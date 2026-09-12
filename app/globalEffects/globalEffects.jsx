'use client'

import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import CursorTrail from '@/components/CursorTrail/CursorTrail'

export default function GlobalEffects({ children }) {
  const handleLoadingComplete = () => {
    window.dispatchEvent(
      new CustomEvent('globalLoadingComplete')
    )
  }

  return (
    <>
      <LoadingScreen onComplete={handleLoadingComplete} />

      <CursorTrail />

      {children}
    </>
  )
}