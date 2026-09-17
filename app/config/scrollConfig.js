// ============================================================
// lib/scrollConfig.js
// ------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for every scroll-related number in the
// entire site. Change values here only — never inside page.js
// or any section component.
//
// DESKTOP values are already tuned & must stay untouched.
// MOBILE values are all aligned to match CapabilitySection's
// feel (flat 0.008, uniform multiplier, no per-section override).
// ============================================================

const MOBILE_BREAKPOINT = 768

export const isMobileViewport = () =>
  typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT

// ------------------------------------------------------------
// 1) PER-SECTION SCROLL STEP (progress-per-tick)
// ------------------------------------------------------------
export const SCROLL_STEPS = {
  hero:       { desktop: 0.08,  mobile: 0.008 },
  second:     { desktop: 0.015, mobile: 0.008 },
  fourth:     { desktop: 0.012, mobile: 0.008 },
  capability: { desktop: 0.008, mobile: 0.008 }, // reference — unchanged
  process:    { desktop: 0.010, mobile: 0.022 },
  third:      { desktop: 0.012, mobile: 0.024 },
  quality:    { desktop: 0.010, mobile: 0.022 },
  contact:    { desktop: 0.025, mobile: 0.028 },
}

// Legacy per-viewport fine-tune map (hero/second/process/quality
// already use responsive getters). Kept so page.js can keep its
// existing responsive behaviour on desktop without change.
export const RESPONSIVE_STEPS = {
  hero: {
    desktop: 0.08,
    tablet: 0.055,
    mobile: 0.035,
    small: 0.030,
  },
  second: {
    desktop: 0.015,
    mobile: 0.022,
  },
  process: {
    desktop: 0.006,
    tablet: 0.020,
    mobile: 0.022,
    small: 0.020,
  },
  quality: {
    desktop: 0.01,
    tablet: 0.018,
    mobile: 0.022,
    small: 0.020,
  },
}

// ------------------------------------------------------------
// 2) SPLIT POINTS (phase boundaries within a section)
// ------------------------------------------------------------
export const SPLITS = {
  capability: 0.4,
  process: 0.15,
  fourth: 0.5,
  third: 0.55,
  thirdWrap: 0.35,
  quality: 0.25,
  contact: 0.4,
}

// ------------------------------------------------------------
// 3) WHEEL / TOUCH SENSITIVITY
// ------------------------------------------------------------
export const INPUT_CONFIG = {
  // Wheel accumulation decay per tick (was hardcoded 0.55)
  wheelDecay: 0.55,
  // Wheel magnitude cap (was hardcoded 120)
  wheelMagnitudeCap: 120,
  // Wheel factor divisor (was hardcoded 55)
  wheelFactorDivisor: 55,
  // Wheel factor min/max (was hardcoded 0.2 / 1.6)
  wheelFactorMin: 0.2,
  wheelFactorMax: 1.6,
  // Dead-zone — ignore tiny deltas (was hardcoded 0.5)
  wheelDeadZone: 0.5,
  // Touch delta multiplier applied inside touchmove (was 2.5)
  touchDeltaMultiplier: 2.5,
}

// Wheel/touch delta multiplier — Capability jaisa uniform (1.0 sab jagah).
export const getTouchMultiplier = () => {
  if (typeof window === 'undefined') return 1.0
  const w = window.innerWidth
  if (w < 480) return 1.0
  if (w < 768) return 1.0
  if (w < 1024) return 1.0
  return 1.0
}

// ------------------------------------------------------------
// 4) MOBILE SLIDE MODEL (Quality/Contact simplified branch)
// ------------------------------------------------------------
export const MOBILE_SLIDE_STEP = 0.045

// ------------------------------------------------------------
// 5) TRAVEL-TO-STAGE (nav / keyboard instant navigation)
// ------------------------------------------------------------
export const TRAVEL_CONFIG = {
  // Advance-one-leg factor (was hardcoded 1.8)
  legFactor: 1.8,
  // Fallback step if section key missing (was hardcoded 0.015)
  fallbackStep: 0.015,
}

// ------------------------------------------------------------
// 6) PROCESS EXTRA DAMPING
// ------------------------------------------------------------
export const PROCESS_DAMPING = 0.65

// ------------------------------------------------------------
// 7) PUBLIC HELPERS (use these in page.js)
// ------------------------------------------------------------
export const getStep = (sectionKey) => {
  const cfg = SCROLL_STEPS[sectionKey]
  if (!cfg) return SCROLL_STEPS.capability.mobile
  return isMobileViewport() ? cfg.mobile : cfg.desktop
}

// Legacy responsive getters (kept so page.js's existing
// responsive behaviour is preserved identically on desktop).
export const getHeroStep = () => {
  if (typeof window === 'undefined') return RESPONSIVE_STEPS.hero.desktop
  const w = window.innerWidth
  if (w <= 480) return RESPONSIVE_STEPS.hero.small
  if (w <= 768) return RESPONSIVE_STEPS.hero.mobile
  if (w <= 1024) return RESPONSIVE_STEPS.hero.tablet
  return RESPONSIVE_STEPS.hero.desktop
}

export const getSecondStep = () => {
  if (typeof window === 'undefined') return RESPONSIVE_STEPS.second.desktop
  return window.innerWidth <= 768
    ? RESPONSIVE_STEPS.second.mobile
    : RESPONSIVE_STEPS.second.desktop
}

export const getProcessStep = () => {
  if (typeof window === 'undefined') return RESPONSIVE_STEPS.process.desktop
  const w = window.innerWidth
  if (w <= 480) return RESPONSIVE_STEPS.process.small
  if (w <= 768) return RESPONSIVE_STEPS.process.mobile
  if (w <= 1024) return RESPONSIVE_STEPS.process.tablet
  return RESPONSIVE_STEPS.process.desktop
}

export const getQualityStep = () => {
  if (typeof window === 'undefined') return RESPONSIVE_STEPS.quality.desktop
  const w = window.innerWidth
  if (w <= 480) return RESPONSIVE_STEPS.quality.small
  if (w <= 768) return RESPONSIVE_STEPS.quality.mobile
  if (w <= 1024) return RESPONSIVE_STEPS.quality.tablet
  return RESPONSIVE_STEPS.quality.desktop
}

// ------------------------------------------------------------
// 8) DEVICE DETECTION (used by page.js)
// ------------------------------------------------------------
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}