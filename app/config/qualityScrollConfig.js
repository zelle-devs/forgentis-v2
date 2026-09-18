// ============================================================
// app/quality/qualityScrollConfig.js
// ------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for every scroll-related number on the
// QUALITY page. Mirrors app/about/aboutScrollConfig.js and
// lib/scrollConfig.js (Home) so all pages feel identical on
// desktop AND mobile.
//
// DESKTOP values are already tuned & must stay untouched.
// MOBILE values are tuned per-section:
//   - Hero         → 0.15  (fast — ek scroll = ek section)
//   - Capability1  → 0.008 (liquid feel)
//   - Resource     → 0.012 (smooth)
//   - Process      → 0.008 (slow, liquid)
//   - Capability2  → 0.008 (liquid feel)
//   - Final        → 0.030 (extra sensitive)
// ============================================================

const MOBILE_BREAKPOINT = 768

export const isMobileViewport = () =>
  typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT

// ------------------------------------------------------------
// 1) PER-SECTION SCROLL STEP (progress-per-tick)
// ------------------------------------------------------------
export const SCROLL_STEPS = {
  hero:        { desktop: 0.08,  mobile: 0.15 },
  capability1: { desktop: 0.008, mobile: 0.008 }, // liquid feel
  resource:    { desktop: 0.006, mobile: 0.012 }, // smooth
  process:     { desktop: 0.012, mobile: 0.008 }, // slow, liquid
  capability2: { desktop: 0.008, mobile: 0.008 }, // liquid feel
  final:       { desktop: 0.025, mobile: 0.030 }, // extra sensitive
}

// Legacy per-viewport fine-tune map (kept so quality/page.js's
// existing responsive behaviour is preserved identically on desktop).
export const RESPONSIVE_STEPS = {
  hero: {
    desktop: 0.08,   // untouched
    tablet:  0.075,  // untouched
    mobile:  0.15,   // ek scroll = ek section
    small:   0.15,   // chhoti screen bhi fast
  },
  capability1: {
    desktop: 0.008,  // untouched
    tablet:  0.007,  // untouched
    mobile:  0.008,  // liquid feel
    small:   0.008,  // chhoti screen bhi slow
  },
  resource: {
    desktop: 0.006,  // untouched
    tablet:  0.013,  // untouched
    mobile:  0.012,  // smooth
    small:   0.012,  // chhoti screen bhi smooth
  },
  process: {
    desktop: 0.012,  // untouched
    tablet:  0.009,  // untouched
    mobile:  0.008,  // slow, liquid
    small:   0.008,  // chhoti screen bhi slow
  },
  capability2: {
    desktop: 0.008,  // untouched
    tablet:  0.007,  // untouched
    mobile:  0.008,  // liquid feel
    small:   0.008,  // chhoti screen bhi slow
  },
}

// ------------------------------------------------------------
// 2) SPLIT POINTS (phase boundaries within a section)
// ------------------------------------------------------------
export const SPLITS = {
  capability1: 0.4,
  resource:    0.15,
  process:     0.4,
  capability2: 0.4,
  final:       0.4,
}

// ------------------------------------------------------------
// 3) WHEEL / TOUCH SENSITIVITY
// ------------------------------------------------------------
export const INPUT_CONFIG = {
  wheelDecay: 0.55,
  wheelMagnitudeCap: 120,
  wheelFactorDivisor: 55,
  wheelFactorMin: 0.2,
  wheelFactorMax: 1.6,
  wheelDeadZone: 0.5,
  touchDeltaMultiplier: 2.2,
}

export const getTouchMultiplier = () => {
  if (typeof window === 'undefined') return 1.0
  const w = window.innerWidth
  if (w < 480) return 1.5
  if (w < 768) return 1.5
  if (w < 1024) return 1.5
  return 1.0
}

// ------------------------------------------------------------
// 4) MOBILE SLIDE MODEL (Final/Contact simplified branch)
// ------------------------------------------------------------
export const MOBILE_SLIDE_STEP = 0.030

// ------------------------------------------------------------
// 5) TRAVEL-TO-STAGE (nav / keyboard instant navigation)
// ------------------------------------------------------------
export const TRAVEL_CONFIG = {
  legFactor: 1.8,
  fallbackStep: 0.015,
}

// ------------------------------------------------------------
// 6) PUBLIC HELPERS (use these in quality/page.js)
// ------------------------------------------------------------
export const getStep = (sectionKey) => {
  const cfg = SCROLL_STEPS[sectionKey]
  if (!cfg) return SCROLL_STEPS.capability1.mobile
  return isMobileViewport() ? cfg.mobile : cfg.desktop
}

// Legacy responsive getters (preserve desktop behaviour exactly)
export const getHeroStep = () => {
  if (typeof window === 'undefined') return RESPONSIVE_STEPS.hero.desktop
  const w = window.innerWidth
  if (w <= 480) return RESPONSIVE_STEPS.hero.small
  if (w <= 768) return RESPONSIVE_STEPS.hero.mobile
  if (w <= 1024) return RESPONSIVE_STEPS.hero.tablet
  return RESPONSIVE_STEPS.hero.desktop
}

export const getCapability1Step = () => {
  if (typeof window === 'undefined') return RESPONSIVE_STEPS.capability1.desktop
  const w = window.innerWidth
  if (w <= 480) return RESPONSIVE_STEPS.capability1.small
  if (w <= 768) return RESPONSIVE_STEPS.capability1.mobile
  if (w <= 1024) return RESPONSIVE_STEPS.capability1.tablet
  return RESPONSIVE_STEPS.capability1.desktop
}

export const getResourceStep = () => {
  if (typeof window === 'undefined') return RESPONSIVE_STEPS.resource.desktop
  const w = window.innerWidth
  if (w <= 480) return RESPONSIVE_STEPS.resource.small
  if (w <= 768) return RESPONSIVE_STEPS.resource.mobile
  if (w <= 1024) return RESPONSIVE_STEPS.resource.tablet
  return RESPONSIVE_STEPS.resource.desktop
}

export const getProcessStep = () => {
  if (typeof window === 'undefined') return RESPONSIVE_STEPS.process.desktop
  const w = window.innerWidth
  if (w <= 480) return RESPONSIVE_STEPS.process.small
  if (w <= 768) return RESPONSIVE_STEPS.process.mobile
  if (w <= 1024) return RESPONSIVE_STEPS.process.tablet
  return RESPONSIVE_STEPS.process.desktop
}

export const getCapability2Step = () => {
  if (typeof window === 'undefined') return RESPONSIVE_STEPS.capability2.desktop
  const w = window.innerWidth
  if (w <= 480) return RESPONSIVE_STEPS.capability2.small
  if (w <= 768) return RESPONSIVE_STEPS.capability2.mobile
  if (w <= 1024) return RESPONSIVE_STEPS.capability2.tablet
  return RESPONSIVE_STEPS.capability2.desktop
}

// ------------------------------------------------------------
// 7) DEVICE DETECTION (used by quality/page.js)
// ------------------------------------------------------------
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}