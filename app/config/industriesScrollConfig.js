// ============================================================
// app/industries/industriesScrollConfig.js
// ------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for every scroll-related number on the
// INDUSTRIES page. Mirrors app/about/aboutScrollConfig.js and
// lib/scrollConfig.js (Home) so all pages feel identical on
// desktop AND mobile.
//
// DESKTOP values are UNTOUCHED — confirmed perfect, do not edit.
//
// HERO + FINAL (Contact-equivalent): speed intentionally kept
// EXACTLY the same as before at every breakpoint — including at
// tablet width, where they now explicitly point at their own
// desktop value (that's what getStep() already fell back to
// pre-tablet-tier, so this preserves identical behaviour rather
// than silently changing it).
//
// INDUSTRIES (the liquid/slow section): given the same buttery
// smoothing pass as Capability got on the other pages — small
// mobile/tablet bump, nothing structural.
//
// Global: touchDeltaMultiplier 2.2 → 1.7 + tiered
// getTouchMultiplier — same change as Home/About/Capabilities,
// this is what actually removes the jumpy touch feel.
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
  // hero speed untouched — tablet = desktop, exactly matching
  // what getStep() already returned for tablet widths before.
  hero:       { desktop: 0.08,  tablet: 0.08,   mobile: 0.15 },
  // industries — buttery pass, still slow/liquid on purpose.
  industries: { desktop: 0.008, tablet: 0.0085, mobile: 0.009 },
  // final speed untouched — tablet = desktop, same reasoning as hero.
  final:      { desktop: 0.025, tablet: 0.025,  mobile: 0.030 },
}

// Legacy per-viewport fine-tune map (hero/industries keep their
// fine-tuned per-breakpoint values, matching Home page behaviour).
// hero left fully untouched per "speed same rakhna."
export const RESPONSIVE_STEPS = {
  hero: {
    desktop: 0.08,   // untouched
    tablet: 0.060,   // untouched
    mobile: 0.15,    // ek scroll = ek section
    small: 0.15,     // chhoti screen bhi fast
  },
  industries: {
    desktop: 0.0052,  // untouched
    tablet: 0.0055,  // ← buttery pass (was 0.005)
    mobile: 0.003,   // ← buttery pass (was 0.0035)
    small: 0.003,    // ← buttery pass (was 0.0035)
  },
}

// ------------------------------------------------------------
// 2) SPLIT POINTS (phase boundaries within a section) — untouched
// ------------------------------------------------------------
export const SPLITS = {
  industries: 0.2,
  final: 0.4,
}

// Mobile ke liye Industries ka split alag (0.35) — untouched
export const getIndustriesSplit = () => {
  if (typeof window === 'undefined') return SPLITS.industries
  return window.innerWidth <= 768 ? 0.35 : SPLITS.industries
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
  // matches Home/About/Capabilities.
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
// Left at 0.030 — Final's speed stays exactly the same, per
// "contact ki speed same rakhna."
export const MOBILE_SLIDE_STEP = 0.030

// ------------------------------------------------------------
// 5) TRAVEL-TO-STAGE (nav / keyboard instant navigation) — untouched
// ------------------------------------------------------------
export const TRAVEL_CONFIG = {
  legFactor: 1.8,
  fallbackStep: 0.015,
}

// ------------------------------------------------------------
// 6) PUBLIC HELPERS (use these in industries/page.js)
// ------------------------------------------------------------
export const getStep = (sectionKey) => {
  const cfg = SCROLL_STEPS[sectionKey]
  if (!cfg) return SCROLL_STEPS.industries.mobile
  if (isMobileViewport()) return cfg.mobile
  if (isTabletViewport()) return cfg.tablet ?? cfg.mobile
  return cfg.desktop
}

// Legacy responsive getters (kept so industries/page.js's
// existing responsive behaviour is preserved identically on desktop).
export const getHeroStep = () => {
  if (typeof window === 'undefined') return RESPONSIVE_STEPS.hero.desktop
  const w = window.innerWidth
  if (w <= 480) return RESPONSIVE_STEPS.hero.small
  if (w <= 768) return RESPONSIVE_STEPS.hero.mobile
  if (w <= 1024) return RESPONSIVE_STEPS.hero.tablet
  return RESPONSIVE_STEPS.hero.desktop
}

export const getIndustriesStep = () => {
  if (typeof window === 'undefined') return RESPONSIVE_STEPS.industries.desktop
  const w = window.innerWidth
  if (w <= 480) return RESPONSIVE_STEPS.industries.small
  if (w <= 768) return RESPONSIVE_STEPS.industries.mobile
  if (w <= 1024) return RESPONSIVE_STEPS.industries.tablet
  return RESPONSIVE_STEPS.industries.desktop
}

// ------------------------------------------------------------
// 7) DEVICE DETECTION (used by industries/page.js) — untouched
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
// // app/industries/industriesScrollConfig.js
// // ------------------------------------------------------------
// // SINGLE SOURCE OF TRUTH for every scroll-related number on the
// // INDUSTRIES page. Mirrors app/about/aboutScrollConfig.js and
// // lib/scrollConfig.js (Home) so all pages feel identical on
// // desktop AND mobile.
// //
// // DESKTOP values are already tuned & must stay untouched.
// // MOBILE values are tuned per-section:
// //   - Hero       → 0.15  (fast — ek scroll = ek section)
// //   - Industries → 0.0035 (SLOWED — liquid feel smooth)
// //   - Final      → 0.030  (extra sensitive)
// // ============================================================

// const MOBILE_BREAKPOINT = 768

// export const isMobileViewport = () =>
//   typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT

// // ------------------------------------------------------------
// // 1) PER-SECTION SCROLL STEP (progress-per-tick)
// // ------------------------------------------------------------
// // MOBILE:
// //   hero       → 0.15    (fast)
// //   industries → 0.0035  ← SLOWED (liquid feel)
// //   final      → 0.030   ← extra sensitive
// export const SCROLL_STEPS = {
//   hero:       { desktop: 0.08,   mobile: 0.15 },
//   industries: { desktop: 0.005,  mobile: 0.0035 }, // ← MOBILE SLOWED
//   final:      { desktop: 0.025,  mobile: 0.030 },  // extra sensitive
// }

// // Legacy per-viewport fine-tune map (hero/industries keep their
// // fine-tuned per-breakpoint values, matching Home page behaviour).
// export const RESPONSIVE_STEPS = {
//   hero: {
//     desktop: 0.08,   // untouched
//     tablet: 0.060,   // untouched
//     mobile: 0.15,    // ek scroll = ek section
//     small: 0.15,     // chhoti screen bhi fast
//   },
//   industries: {
//     desktop: 0.005,  // untouched
//     tablet: 0.005,   // tablet bhi slow
//     mobile: 0.0035,  // liquid feel
//     small: 0.0035,   // chhoti screen bhi slow
//   },
// }

// // ------------------------------------------------------------
// // 2) SPLIT POINTS (phase boundaries within a section)
// // ------------------------------------------------------------
// export const SPLITS = {
//   industries: 0.2,
//   final: 0.4,
// }

// // Mobile ke liye Industries ka split alag (0.35)
// export const getIndustriesSplit = () => {
//   if (typeof window === 'undefined') return SPLITS.industries
//   return window.innerWidth <= 768 ? 0.35 : SPLITS.industries
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
// // 4) MOBILE SLIDE MODEL (Final/Contact simplified branch)
// // ------------------------------------------------------------
// // 0.030 — Final extra sensitive.
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
// // 6) PUBLIC HELPERS (use these in industries/page.js)
// // ------------------------------------------------------------
// export const getStep = (sectionKey) => {
//   const cfg = SCROLL_STEPS[sectionKey]
//   if (!cfg) return SCROLL_STEPS.industries.mobile
//   return isMobileViewport() ? cfg.mobile : cfg.desktop
// }

// // Legacy responsive getters (kept so industries/page.js's
// // existing responsive behaviour is preserved identically on desktop).
// export const getHeroStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.hero.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.hero.small
//   if (w <= 768) return RESPONSIVE_STEPS.hero.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.hero.tablet
//   return RESPONSIVE_STEPS.hero.desktop
// }

// export const getIndustriesStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.industries.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.industries.small
//   if (w <= 768) return RESPONSIVE_STEPS.industries.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.industries.tablet
//   return RESPONSIVE_STEPS.industries.desktop
// }

// // ------------------------------------------------------------
// // 7) DEVICE DETECTION (used by industries/page.js)
// // ------------------------------------------------------------
// export const isTouchDevice = () => {
//   if (typeof window === 'undefined') return false
//   return (
//     'ontouchstart' in window ||
//     navigator.maxTouchPoints > 0 ||
//     navigator.msMaxTouchPoints > 0
//   )
// }