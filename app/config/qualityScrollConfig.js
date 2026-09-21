// ============================================================
// app/quality/qualityScrollConfig.js
// ------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for every scroll-related number on the
// QUALITY page. Mirrors app/about/aboutScrollConfig.js and
// lib/scrollConfig.js (Home) so all pages feel identical on
// desktop AND mobile.
//
// DESKTOP values are UNTOUCHED — confirmed perfect, do not edit.
//
// MOBILE + TABLET RETUNE (buttery pass, same as other pages):
//   1) touchDeltaMultiplier 2.2 → 1.7 + tiered getTouchMultiplier
//      — same global change as Home/About/Capabilities/Industries.
//   2) SCROLL_STEPS now carries a real tablet tier for every
//      section (was falling back to desktop at tablet width
//      before, same missing-tier bug as the other pages had) —
//      pulled from this page's own already-tuned
//      RESPONSIVE_STEPS tablet numbers, then given the same
//      light buttery nudge as mobile.
//   3) capability1 / process / capability2 nudged up slightly on
//      mobile — process especially was slower on mobile (0.008)
//      than on desktop (0.012), which read as sluggish.
//   4) final (Contact-equivalent) tuned the same way Contact/
//      Final was tuned on the other pages.
// ============================================================

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export const isMobileViewport = () =>
  typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT

export const isTabletViewport = () =>
  typeof window !== 'undefined' &&
  window.innerWidth > MOBILE_BREAKPOINT &&
  window.innerWidth <= TABLET_BREAKPOINT

// ------------------------------------------------------------
// 1) PER-SECTION SCROLL STEP (progress-per-tick)
// ------------------------------------------------------------
export const SCROLL_STEPS = {
  hero:        { desktop: 0.08,  tablet: 0.13,  mobile: 0.15  },
  capability1: { desktop: 0.008, tablet: 0.0075, mobile: 0.009 }, // ← buttery pass
  resource:    { desktop: 0.006, tablet: 0.012,  mobile: 0.011 }, // ← buttery pass
  process:     { desktop: 0.012, tablet: 0.0095, mobile: 0.010 }, // ← un-slowed, still gentle
  capability2: { desktop: 0.008, tablet: 0.0075, mobile: 0.009 }, // ← buttery pass
  final:       { desktop: 0.025, tablet: 0.026,  mobile: 0.026 }, // extra sensitive, tuned like Contact
}

// Legacy per-viewport fine-tune map (kept so quality/page.js's
// existing responsive behaviour is preserved identically on desktop).
export const RESPONSIVE_STEPS = {
  hero: {
    desktop: 0.08,   // untouched
    tablet:  0.13,  // untouched
    mobile:  0.30,   // ek scroll = ek section
    small:   0.32,   // chhoti screen bhi fast
  },
  capability1: {
    desktop: 0.008,  // untouched
    tablet:  0.0075, // ← buttery pass (was 0.007)
    mobile:  0.009,  // ← buttery pass (was 0.008)
    small:   0.009,  // ← buttery pass (was 0.008)
  },
  resource: {
    desktop: 0.006,  // untouched
    tablet:  0.012,  // ← buttery pass (was 0.013)
    mobile:  0.011,  // ← buttery pass (was 0.012)
    small:   0.011,  // ← buttery pass (was 0.012)
  },
  process: {
    desktop: 0.012,  // untouched
    tablet:  0.0095, // ← buttery pass (was 0.009)
    mobile:  0.010,  // ← buttery pass (was 0.008)
    small:   0.010,  // ← buttery pass (was 0.008)
  },
  capability2: {
    desktop: 0.008,  // untouched
    tablet:  0.0075, // ← buttery pass (was 0.007)
    mobile:  0.009,  // ← buttery pass (was 0.008)
    small:   0.009,  // ← buttery pass (was 0.008)
  },
}

// ------------------------------------------------------------
// 2) SPLIT POINTS (phase boundaries within a section) — untouched
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
  // Wheel accumulation decay per tick — desktop mouse wheel,
  // untouched.
  wheelDecay: 0.55,
  wheelMagnitudeCap: 120,
  wheelFactorDivisor: 55,
  wheelFactorMin: 0.2,
  wheelFactorMax: 1.6,
  wheelDeadZone: 0.5,
  // Touch delta multiplier applied inside touchmove.
  // ← buttery pass: was 2.2 (too much delta per finger move),
  // matches Home/About/Capabilities/Industries.
  touchDeltaMultiplier: 1.7,
}

// Wheel/touch delta multiplier — re-tuned per tier, same as the
// other pages. Desktop stays 1.0 (untouched).
export const getTouchMultiplier = () => {
  if (typeof window === 'undefined') return 1.0
  const w = window.innerWidth
  if (w < 480) return 1.35   // small phones
  if (w < 768) return 1.3    // phones
  if (w < 1024) return 1.2   // tablets — more physical travel per swipe
  return 1.0                 // desktop, untouched
}

// ------------------------------------------------------------
// 4) MOBILE SLIDE MODEL (Final/Contact simplified branch)
// ------------------------------------------------------------
export const MOBILE_SLIDE_STEP = 0.026 // ← buttery pass (was 0.030)

// ------------------------------------------------------------
// 5) TRAVEL-TO-STAGE (nav / keyboard instant navigation) — untouched
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
  if (isMobileViewport()) return cfg.mobile
  if (isTabletViewport()) return cfg.tablet ?? cfg.mobile
  return cfg.desktop
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
// 7) DEVICE DETECTION (used by quality/page.js) — untouched
// ------------------------------------------------------------
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}


// // ============================================================
// // app/quality/qualityScrollConfig.js
// // ------------------------------------------------------------
// // SINGLE SOURCE OF TRUTH for every scroll-related number on the
// // QUALITY page. Mirrors app/about/aboutScrollConfig.js and
// // lib/scrollConfig.js (Home) so all pages feel identical on
// // desktop AND mobile.
// //
// // DESKTOP values are already tuned & must stay untouched.
// // MOBILE values are tuned per-section:
// //   - Hero         → 0.15  (fast — ek scroll = ek section)
// //   - Capability1  → 0.008 (liquid feel)
// //   - Resource     → 0.012 (smooth)
// //   - Process      → 0.008 (slow, liquid)
// //   - Capability2  → 0.008 (liquid feel)
// //   - Final        → 0.030 (extra sensitive)
// // ============================================================

// const MOBILE_BREAKPOINT = 768

// export const isMobileViewport = () =>
//   typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT

// // ------------------------------------------------------------
// // 1) PER-SECTION SCROLL STEP (progress-per-tick)
// // ------------------------------------------------------------
// export const SCROLL_STEPS = {
//   hero:        { desktop: 0.08,  mobile: 0.15 },
//   capability1: { desktop: 0.008, mobile: 0.008 }, // liquid feel
//   resource:    { desktop: 0.006, mobile: 0.012 }, // smooth
//   process:     { desktop: 0.012, mobile: 0.008 }, // slow, liquid
//   capability2: { desktop: 0.008, mobile: 0.008 }, // liquid feel
//   final:       { desktop: 0.025, mobile: 0.030 }, // extra sensitive
// }

// // Legacy per-viewport fine-tune map (kept so quality/page.js's
// // existing responsive behaviour is preserved identically on desktop).
// export const RESPONSIVE_STEPS = {
//   hero: {
//     desktop: 0.08,   // untouched
//     tablet:  0.075,  // untouched
//     mobile:  0.15,   // ek scroll = ek section
//     small:   0.15,   // chhoti screen bhi fast
//   },
//   capability1: {
//     desktop: 0.008,  // untouched
//     tablet:  0.007,  // untouched
//     mobile:  0.008,  // liquid feel
//     small:   0.008,  // chhoti screen bhi slow
//   },
//   resource: {
//     desktop: 0.006,  // untouched
//     tablet:  0.013,  // untouched
//     mobile:  0.012,  // smooth
//     small:   0.012,  // chhoti screen bhi smooth
//   },
//   process: {
//     desktop: 0.012,  // untouched
//     tablet:  0.009,  // untouched
//     mobile:  0.008,  // slow, liquid
//     small:   0.008,  // chhoti screen bhi slow
//   },
//   capability2: {
//     desktop: 0.008,  // untouched
//     tablet:  0.007,  // untouched
//     mobile:  0.008,  // liquid feel
//     small:   0.008,  // chhoti screen bhi slow
//   },
// }

// // ------------------------------------------------------------
// // 2) SPLIT POINTS (phase boundaries within a section)
// // ------------------------------------------------------------
// export const SPLITS = {
//   capability1: 0.4,
//   resource:    0.15,
//   process:     0.4,
//   capability2: 0.4,
//   final:       0.4,
// }

// // ------------------------------------------------------------
// // 3) WHEEL / TOUCH SENSITIVITY
// // ------------------------------------------------------------
// export const INPUT_CONFIG = {
//   wheelDecay: 0.55,
//   wheelMagnitudeCap: 120,
//   wheelFactorDivisor: 55,
//   wheelFactorMin: 0.2,
//   wheelFactorMax: 1.6,
//   wheelDeadZone: 0.5,
//   touchDeltaMultiplier: 2.2,
// }

// export const getTouchMultiplier = () => {
//   if (typeof window === 'undefined') return 1.0
//   const w = window.innerWidth
//   if (w < 480) return 1.5
//   if (w < 768) return 1.5
//   if (w < 1024) return 1.5
//   return 1.0
// }

// // ------------------------------------------------------------
// // 4) MOBILE SLIDE MODEL (Final/Contact simplified branch)
// // ------------------------------------------------------------
// export const MOBILE_SLIDE_STEP = 0.030

// // ------------------------------------------------------------
// // 5) TRAVEL-TO-STAGE (nav / keyboard instant navigation)
// // ------------------------------------------------------------
// export const TRAVEL_CONFIG = {
//   legFactor: 1.8,
//   fallbackStep: 0.015,
// }

// // ------------------------------------------------------------
// // 6) PUBLIC HELPERS (use these in quality/page.js)
// // ------------------------------------------------------------
// export const getStep = (sectionKey) => {
//   const cfg = SCROLL_STEPS[sectionKey]
//   if (!cfg) return SCROLL_STEPS.capability1.mobile
//   return isMobileViewport() ? cfg.mobile : cfg.desktop
// }

// // Legacy responsive getters (preserve desktop behaviour exactly)
// export const getHeroStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.hero.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.hero.small
//   if (w <= 768) return RESPONSIVE_STEPS.hero.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.hero.tablet
//   return RESPONSIVE_STEPS.hero.desktop
// }

// export const getCapability1Step = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.capability1.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.capability1.small
//   if (w <= 768) return RESPONSIVE_STEPS.capability1.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.capability1.tablet
//   return RESPONSIVE_STEPS.capability1.desktop
// }

// export const getResourceStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.resource.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.resource.small
//   if (w <= 768) return RESPONSIVE_STEPS.resource.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.resource.tablet
//   return RESPONSIVE_STEPS.resource.desktop
// }

// export const getProcessStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.process.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.process.small
//   if (w <= 768) return RESPONSIVE_STEPS.process.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.process.tablet
//   return RESPONSIVE_STEPS.process.desktop
// }

// export const getCapability2Step = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.capability2.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.capability2.small
//   if (w <= 768) return RESPONSIVE_STEPS.capability2.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.capability2.tablet
//   return RESPONSIVE_STEPS.capability2.desktop
// }

// // ------------------------------------------------------------
// // 7) DEVICE DETECTION (used by quality/page.js)
// // ------------------------------------------------------------
// export const isTouchDevice = () => {
//   if (typeof window === 'undefined') return false
//   return (
//     'ontouchstart' in window ||
//     navigator.maxTouchPoints > 0 ||
//     navigator.msMaxTouchPoints > 0
//   )
// }