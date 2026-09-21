// ============================================================
// app/facility/facilityScrollConfig.js
// ------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for every scroll-related number on the
// FACILITY page. Mirrors app/about/aboutScrollConfig.js and
// lib/scrollConfig.js (Home) so all pages feel identical on
// desktop AND mobile.
//
// DESKTOP values are UNTOUCHED — confirmed perfect, do not edit.
//
// MOBILE + TABLET RETUNE (buttery pass, same as other pages):
//   1) touchDeltaMultiplier 2.2 → 1.7 + tiered getTouchMultiplier
//      — same global change as every other page.
//   2) SCROLL_STEPS now carries a real tablet tier for every
//      section (was falling back to desktop at tablet width
//      before) — pulled from this page's own already-tuned
//      RESPONSIVE_STEPS tablet numbers, then given the same
//      light buttery nudge as mobile.
//   3) facilities (liquid/slow) and single (smooth) bumped up
//      further on request — same direction Capability got tuned
//      on Home (closer to its own desktop value instead of
//      staying well under it), still smoother than before but
//      no longer reading as sluggish.
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
  hero:       { desktop: 0.08,  tablet: 0.075,  mobile: 0.15  },
  facilities: { desktop: 0.008, tablet: 0.0085, mobile: 0.009 }, // ← faster pass, Capability-style
  single:     { desktop: 0.02,  tablet: 0.017,  mobile: 0.013 }, // ← faster pass
  final:      { desktop: 0.025, tablet: 0.026,  mobile: 0.026 }, // extra sensitive, tuned like Contact
}

// Legacy per-viewport fine-tune map (kept so facility/page.js's
// existing responsive behaviour is preserved identically on desktop).
export const RESPONSIVE_STEPS = {
  hero: {
    desktop: 0.08,   // untouched
    tablet:  0.075,  // untouched
    mobile:  0.15,   // ek scroll = ek section
    small:   0.15,   // chhoti screen bhi fast
  },
  facilities: {
    desktop: 0.022,  // untouched
    tablet:  0.0125, // ← faster pass (was 0.0095)
    mobile:  0.013,  // ← faster pass (was 0.009)
    small:   0.0105, // ← faster pass (was 0.007)
  },
  single: {
    desktop: 0.02,   // untouched
    tablet:  0.017,  // ← faster pass (was 0.015)
    mobile:  0.013,  // ← faster pass (was 0.011)
    small:   0.011,  // ← faster pass (was 0.0095)
  },
}

// ------------------------------------------------------------
// 2) SPLIT POINTS (phase boundaries within a section) — untouched
// ------------------------------------------------------------
export const SPLITS = {
  facilities: 0.4,
  single:     0.2,
  final:      0.4,
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
  // matches every other page.
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
// 6) PUBLIC HELPERS (use these in facility/page.js)
// ------------------------------------------------------------
export const getStep = (sectionKey) => {
  const cfg = SCROLL_STEPS[sectionKey]
  if (!cfg) return SCROLL_STEPS.facilities.mobile
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

export const getFacilitiesStep = () => {
  if (typeof window === 'undefined') return RESPONSIVE_STEPS.facilities.desktop
  const w = window.innerWidth
  if (w <= 480) return RESPONSIVE_STEPS.facilities.small
  if (w <= 768) return RESPONSIVE_STEPS.facilities.mobile
  if (w <= 1024) return RESPONSIVE_STEPS.facilities.tablet
  return RESPONSIVE_STEPS.facilities.desktop
}

export const getSingleStep = () => {
  if (typeof window === 'undefined') return RESPONSIVE_STEPS.single.desktop
  const w = window.innerWidth
  if (w <= 480) return RESPONSIVE_STEPS.single.small
  if (w <= 768) return RESPONSIVE_STEPS.single.mobile
  if (w <= 1024) return RESPONSIVE_STEPS.single.tablet
  return RESPONSIVE_STEPS.single.desktop
}

// ------------------------------------------------------------
// 7) DEVICE DETECTION (used by facility/page.js) — untouched
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
// // app/facility/facilityScrollConfig.js
// // ------------------------------------------------------------
// // SINGLE SOURCE OF TRUTH for every scroll-related number on the
// // FACILITY page. Mirrors app/about/aboutScrollConfig.js and
// // lib/scrollConfig.js (Home) so all pages feel identical on
// // desktop AND mobile.
// //
// // DESKTOP values are already tuned & must stay untouched.
// // MOBILE values are tuned per-section:
// //   - Hero       → 0.15   (fast — ek scroll = ek section)
// //   - Facilities → 0.008  (SLOWED — liquid feel)
// //   - Single     → 0.012  (smooth)
// //   - Final      → 0.030  (extra sensitive)
// // ============================================================

// const MOBILE_BREAKPOINT = 768

// export const isMobileViewport = () =>
//   typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT

// // ------------------------------------------------------------
// // 1) PER-SECTION SCROLL STEP (progress-per-tick)
// // ------------------------------------------------------------
// // MOBILE:
// //   hero       → 0.15   (fast)
// //   facilities → 0.008  ← SLOWED (liquid feel)
// //   single     → 0.012  (smooth)
// //   final      → 0.030  ← extra sensitive
// export const SCROLL_STEPS = {
//   hero:       { desktop: 0.08,  mobile: 0.15 },
//   facilities: { desktop: 0.012, mobile: 0.008 }, // ← MOBILE SLOWED
//   single:     { desktop: 0.02,  mobile: 0.012 }, // smooth
//   final:      { desktop: 0.025, mobile: 0.030 }, // extra sensitive
// }

// // Legacy per-viewport fine-tune map (kept so facility/page.js's
// // existing responsive behaviour is preserved identically on desktop).
// export const RESPONSIVE_STEPS = {
//   hero: {
//     desktop: 0.08,   // untouched
//     tablet:  0.075,  // untouched
//     mobile:  0.15,   // ek scroll = ek section
//     small:   0.15,   // chhoti screen bhi fast
//   },
//   facilities: {
//     desktop: 0.012,  // untouched
//     tablet:  0.010,  // tablet bhi slow
//     mobile:  0.008,  // liquid feel
//     small:   0.006,  // chhoti screen bhi slow
//   },
//   single: {
//     desktop: 0.02,   // untouched
//     tablet:  0.016,  // untouched
//     mobile:  0.012,  // smooth
//     small:   0.010,  // chhoti screen bhi smooth
//   },
// }

// // ------------------------------------------------------------
// // 2) SPLIT POINTS (phase boundaries within a section)
// // ------------------------------------------------------------
// export const SPLITS = {
//   facilities: 0.3,
//   single:     0.2,
//   final:      0.4,
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
// // 6) PUBLIC HELPERS (use these in facility/page.js)
// // ------------------------------------------------------------
// export const getStep = (sectionKey) => {
//   const cfg = SCROLL_STEPS[sectionKey]
//   if (!cfg) return SCROLL_STEPS.facilities.mobile
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

// export const getFacilitiesStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.facilities.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.facilities.small
//   if (w <= 768) return RESPONSIVE_STEPS.facilities.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.facilities.tablet
//   return RESPONSIVE_STEPS.facilities.desktop
// }

// export const getSingleStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.single.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.single.small
//   if (w <= 768) return RESPONSIVE_STEPS.single.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.single.tablet
//   return RESPONSIVE_STEPS.single.desktop
// }

// // ------------------------------------------------------------
// // 7) DEVICE DETECTION (used by facility/page.js)
// // ------------------------------------------------------------
// export const isTouchDevice = () => {
//   if (typeof window === 'undefined') return false
//   return (
//     'ontouchstart' in window ||
//     navigator.maxTouchPoints > 0 ||
//     navigator.msMaxTouchPoints > 0
//   )
// }