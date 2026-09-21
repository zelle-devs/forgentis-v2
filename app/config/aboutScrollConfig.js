// ============================================================
// app/about/aboutScrollConfig.js
// ------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for every scroll-related number on the
// ABOUT page. Mirrors lib/scrollConfig.js (Home) exactly so both
// pages feel identical on desktop AND mobile — minus fourth/
// process/third, which don't exist on this page.
//
// DESKTOP values are UNTOUCHED — confirmed perfect, do not edit.
//
// MOBILE + TABLET RETUNE (buttery pass, same as Home):
//   1) touchDeltaMultiplier 2.2 → 1.7 — smaller, calmer delta
//      per finger move, removes the jumpy feeling.
//   2) getTouchMultiplier() re-tuned per width tier instead of
//      one flat 1.5 for everything under 1024px.
//   3) Real TABLET tier added to SCROLL_STEPS (was silently
//      falling back to desktop numbers before).
//   4) capability/quality nudged toward each other instead of
//      one section (capability) being forced slow on its own.
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
// desktop → untouched. tablet → new tier (buttery, still touch
// input). mobile → re-tuned to match Home.
export const SCROLL_STEPS = {
  hero:       { desktop: 0.08,  tablet: 0.13,  mobile: 0.15  },
  second:     { desktop: 0.015, tablet: 0.019, mobile: 0.020 },
  capability: { desktop: 0.008, tablet: 0.0085, mobile: 0.009 },
  quality:    { desktop: 0.010, tablet: 0.024, mobile: 0.026 },
  contact:    { desktop: 0.025, tablet: 0.026, mobile: 0.026 },
}

// Legacy per-viewport fine-tune map (hero/quality already use
// responsive getters). Kept so about/page.js keeps its existing
// responsive behaviour on desktop without change.
// NOTE: quality's tablet/mobile values here (0.10) are on a
// different scale than SCROLL_STEPS.quality — left untouched,
// same as Home, since it's unclear if this legacy path is still
// wired into about/page.js.
export const RESPONSIVE_STEPS = {
  hero: {
    desktop: 0.08,   // untouched
    tablet: 0.013,   // ← buttery pass (was 0.010)
    mobile: 0.30,    // ek scroll = ek section
    small: 0.32,     // chhoti screen aur fast
  },
  quality: {
    desktop: 0.01,
    tablet: 0.10,
    mobile: 0.10,   // extra sensitive
    small: 0.10,    // chhoti screen bhi sensitive
  },
}

// ------------------------------------------------------------
// 2) SPLIT POINTS (phase boundaries within a section) — untouched
// ------------------------------------------------------------
export const SPLITS = {
  capability: 0.4,
  quality: 0.25,
  contact: 0.4,
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
  // ← buttery pass: was 2.2 (too much delta per finger move).
  // 1.7 = smoother, more controllable, still responsive.
  touchDeltaMultiplier: 1.7,
}

// Wheel/touch delta multiplier — re-tuned per tier. Desktop
// stays 1.0 (untouched).
export const getTouchMultiplier = () => {
  if (typeof window === 'undefined') return 1.0
  const w = window.innerWidth
  if (w < 480) return 1.35   // small phones
  if (w < 768) return 1.3    // phones
  if (w < 1024) return 1.2   // tablets — more physical travel per swipe
  return 1.0                 // desktop, untouched
}

// ------------------------------------------------------------
// 4) MOBILE SLIDE MODEL (Quality/Contact simplified branch)
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
// 6) PUBLIC HELPERS (use these in about/page.js)
// ------------------------------------------------------------
export const getStep = (sectionKey) => {
  const cfg = SCROLL_STEPS[sectionKey]
  if (!cfg) return SCROLL_STEPS.capability.mobile
  if (isMobileViewport()) return cfg.mobile
  if (isTabletViewport()) return cfg.tablet ?? cfg.mobile
  return cfg.desktop
}

// Legacy responsive getters (kept so about/page.js's existing
// responsive behaviour is preserved identically on desktop).
export const getHeroStep = () => {
  if (typeof window === 'undefined') return RESPONSIVE_STEPS.hero.desktop
  const w = window.innerWidth
  if (w <= 480) return RESPONSIVE_STEPS.hero.small
  if (w <= 768) return RESPONSIVE_STEPS.hero.mobile
  if (w <= 1024) return RESPONSIVE_STEPS.hero.tablet
  return RESPONSIVE_STEPS.hero.desktop
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
// 7) DEVICE DETECTION (used by about/page.js) — untouched
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
// // app/about/aboutScrollConfig.js
// // ------------------------------------------------------------
// // SINGLE SOURCE OF TRUTH for every scroll-related number on the
// // ABOUT page. Mirrors lib/scrollConfig.js (Home) exactly so both
// // pages feel identical on desktop AND mobile.
// //
// // DESKTOP values are already tuned & must stay untouched.
// // MOBILE values are tuned per-section (same as Home):
// //   - Capability → 0.005 (SLOWED — liquid feel smooth)
// //   - Quality    → 0.10  (extra sensitive)
// //   - Contact    → 0.030 (extra sensitive)
// //   - Others     → 0.022 (premium sensitive baseline)
// // ============================================================

// const MOBILE_BREAKPOINT = 768

// export const isMobileViewport = () =>
//   typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT

// // ------------------------------------------------------------
// // 1) PER-SECTION SCROLL STEP (progress-per-tick)
// // ------------------------------------------------------------
// // MOBILE:
// //   hero       → 0.15   (fast — ek scroll = ek section)
// //   second     → 0.022
// //   capability → 0.005  ← SLOWED (liquid feel)
// //   quality    → 0.10   ← extra sensitive
// //   contact    → 0.030  ← extra sensitive
// export const SCROLL_STEPS = {
//   hero:       { desktop: 0.08,  mobile: 0.15 },
//   second:     { desktop: 0.015, mobile: 0.022 },
//   capability: { desktop: 0.008, mobile: 0.007 }, // ← SLOWED
//   quality:    { desktop: 0.010, mobile: 0.10 },  // extra sensitive
//   contact:    { desktop: 0.025, mobile: 0.030 }, // extra sensitive
// }

// // Legacy per-viewport fine-tune map (hero/quality already use
// // responsive getters). Kept so about/page.js keeps its existing
// // responsive behaviour on desktop without change.
// export const RESPONSIVE_STEPS = {
//   hero: {
//     desktop: 0.08,   // untouched
//     tablet: 0.010,   // untouched
//     mobile: 0.30,    // ek scroll = ek section
//     small: 0.32,     // chhoti screen aur fast
//   },
//   quality: {
//     desktop: 0.01,
//     tablet: 0.10,
//     mobile: 0.10,   // extra sensitive
//     small: 0.10,    // chhoti screen bhi sensitive
//   },
// }

// // ------------------------------------------------------------
// // 2) SPLIT POINTS (phase boundaries within a section)
// // ------------------------------------------------------------
// export const SPLITS = {
//   capability: 0.4,
//   quality: 0.25,
//   contact: 0.4,
// }

// // ------------------------------------------------------------
// // 3) WHEEL / TOUCH SENSITIVITY
// // ------------------------------------------------------------
// export const INPUT_CONFIG = {
//   // Wheel accumulation decay per tick
//   wheelDecay: 0.55,
//   // Wheel magnitude cap
//   wheelMagnitudeCap: 120,
//   // Wheel factor divisor
//   wheelFactorDivisor: 55,
//   // Wheel factor min/max
//   wheelFactorMin: 0.2,
//   wheelFactorMax: 1.6,
//   // Dead-zone — ignore tiny deltas
//   wheelDeadZone: 0.5,
//   // Touch delta multiplier applied inside touchmove.
//   // 2.2 = finger ka chhota move bhi section aage badhata hai.
//   touchDeltaMultiplier: 2.2,
// }

// // Wheel/touch delta multiplier — MOBILE par 1.5 (premium
// // sensitive), desktop par 1.0 (unchanged).
// export const getTouchMultiplier = () => {
//   if (typeof window === 'undefined') return 1.0
//   const w = window.innerWidth
//   if (w < 480) return 1.5
//   if (w < 768) return 1.5
//   if (w < 1024) return 1.5
//   return 1.0
// }

// // ------------------------------------------------------------
// // 4) MOBILE SLIDE MODEL (Quality/Contact simplified branch)
// // ------------------------------------------------------------
// // 0.030 — Quality/Contact extra sensitive.
// export const MOBILE_SLIDE_STEP = 0.030

// // ------------------------------------------------------------
// // 5) TRAVEL-TO-STAGE (nav / keyboard instant navigation)
// // ------------------------------------------------------------
// export const TRAVEL_CONFIG = {
//   // Advance-one-leg factor (was hardcoded 1.8)
//   legFactor: 1.8,
//   // Fallback step if section key missing (was hardcoded 0.015)
//   fallbackStep: 0.015,
// }

// // ------------------------------------------------------------
// // 6) PUBLIC HELPERS (use these in about/page.js)
// // ------------------------------------------------------------
// export const getStep = (sectionKey) => {
//   const cfg = SCROLL_STEPS[sectionKey]
//   if (!cfg) return SCROLL_STEPS.capability.mobile
//   return isMobileViewport() ? cfg.mobile : cfg.desktop
// }

// // Legacy responsive getters (kept so about/page.js's existing
// // responsive behaviour is preserved identically on desktop).
// export const getHeroStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.hero.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.hero.small
//   if (w <= 768) return RESPONSIVE_STEPS.hero.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.hero.tablet
//   return RESPONSIVE_STEPS.hero.desktop
// }

// export const getQualityStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.quality.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.quality.small
//   if (w <= 768) return RESPONSIVE_STEPS.quality.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.quality.tablet
//   return RESPONSIVE_STEPS.quality.desktop
// }

// // ------------------------------------------------------------
// // 7) DEVICE DETECTION (used by about/page.js)
// // ------------------------------------------------------------
// export const isTouchDevice = () => {
//   if (typeof window === 'undefined') return false
//   return (
//     'ontouchstart' in window ||
//     navigator.maxTouchPoints > 0 ||
//     navigator.msMaxTouchPoints > 0
//   )
// }