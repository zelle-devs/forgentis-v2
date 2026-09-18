// // ============================================================
// // lib/scrollConfig.js
// // ------------------------------------------------------------
// // SINGLE SOURCE OF TRUTH for every scroll-related number in the
// // entire site. Change values here only — never inside page.js
// // or any section component.
// //
// // DESKTOP values are already tuned & must stay untouched.
// // MOBILE values are tuned per-section:
// //   - Capability → 0.008 (original liquid feel — restored)
// //   - Quality / Contact → 0.030 (extra sensitive)
// //   - Others → 0.022 (premium sensitive baseline)
// // ============================================================

// const MOBILE_BREAKPOINT = 768

// export const isMobileViewport = () =>
//   typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT

// // ------------------------------------------------------------
// // 1) PER-SECTION SCROLL STEP (progress-per-tick)
// // ------------------------------------------------------------
// // MOBILE:
// //   hero       → 0.022
// //   second     → 0.022
// //   fourth     → 0.022
// //   capability → 0.008  ← PURANI SPEED (liquid feel restored)
// //   process    → 0.022
// //   third      → 0.022
// //   quality    → 0.030  ← extra sensitive
// //   contact    → 0.030  ← extra sensitive
// export const SCROLL_STEPS = {
//   // hero:       { desktop: 0.08,  mobile: 0.022 },
// hero:       { desktop: 0.08,  mobile: 0.15 },
//   second:     { desktop: 0.015, mobile: 0.022 },
//   fourth:     { desktop: 0.012, mobile: 0.022 },
//   capability: { desktop: 0.008, mobile: 0.008 }, // restored old speed
//   process:    { desktop: 0.010, mobile: 0.022 },
//   third:      { desktop: 0.012, mobile: 0.022 },
//   quality:    { desktop: 0.010, mobile: 0.030 }, // extra sensitive
//   contact:    { desktop: 0.025, mobile: 0.030 }, // extra sensitive
// }

// // Legacy per-viewport fine-tune map (hero/second/process/quality
// // already use responsive getters). Kept so page.js can keep its
// // existing responsive behaviour on desktop without change.
// // MOBILE values now boosted — Hero ka mobile step 0.055 (fast),
// // Quality bhi 0.030 (extra sensitive).
// export const RESPONSIVE_STEPS = {
//   // hero: {
//   //   desktop: 0.08,
//   //   tablet: 0.010,
//   //   mobile: 0.10,   // Hero ab fast
//   //   small: 0.10,    // chhoti screen bhi fast
//   // },
//   hero: {
//     desktop: 0.08,   // untouched
//     tablet: 0.010,   // untouched
//     mobile: 0.30,    // ← 0.10 → 0.20 (ek scroll = ek section)
//     small: 0.32,     // ← 0.10 → 0.22 (chhoti screen aur fast)
// },
//   second: {
//     desktop: 0.015,
//     mobile: 0.022,
//   },
//  process: {
//   desktop: 0.006,   // untouched
//   tablet: 0.012,    // was 0.020 — tablet bhi slow
//   mobile: 0.013,    // was 0.022 — Capability jaisa slow (0.013 × 0.65 ≈ 0.0085)
//   small: 0.012,     // was 0.020 — chhoti screen bhi slow
// },
//   quality: {
//     desktop: 0.01,
//     tablet: 0.10,
//     mobile: 0.10,   // extra sensitive (was 0.022)
//     small: 0.10,    // chhoti screen bhi sensitive (was 0.020)
//   },
// }

// // ------------------------------------------------------------
// // 2) SPLIT POINTS (phase boundaries within a section)
// // ------------------------------------------------------------
// export const SPLITS = {
//   capability: 0.4,
//   process: 0.15,
//   fourth: 0.5,
//   third: 0.55,
//   thirdWrap: 0.35,
//   quality: 0.25,
//   contact: 0.4,
// }

// // ------------------------------------------------------------
// // 3) WHEEL / TOUCH SENSITIVITY
// // ------------------------------------------------------------
// export const INPUT_CONFIG = {
//   // Wheel accumulation decay per tick (was hardcoded 0.55)
//   wheelDecay: 0.55,
//   // Wheel magnitude cap (was hardcoded 120)
//   wheelMagnitudeCap: 120,
//   // Wheel factor divisor (was hardcoded 55)
//   wheelFactorDivisor: 55,
//   // Wheel factor min/max (was hardcoded 0.2 / 1.6)
//   wheelFactorMin: 0.2,
//   wheelFactorMax: 1.6,
//   // Dead-zone — ignore tiny deltas (was hardcoded 0.5)
//   wheelDeadZone: 0.5,
//   // Touch delta multiplier applied inside touchmove.
//   // 2.2 = finger ka chhota move bhi section aage badhata hai.
//   touchDeltaMultiplier: 2.2,
// }

// // Wheel/touch delta multiplier — MOBILE par 1.5 (premium
// // sensitive), desktop par 1.0 (unchanged). Net touch boost
// // ≈ 2.2 * 1.5 = 3.3x — finger ka chhota swipe bhi kaafi.
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
// // page.js mein Quality aur Contact dono MOBILE_SLIDE_STEP use
// // karte hain, isliye dono automatically boost ho gaye.
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
// // 6) PROCESS EXTRA DAMPING
// // ------------------------------------------------------------
// export const PROCESS_DAMPING = 0.65

// // ------------------------------------------------------------
// // 7) PUBLIC HELPERS (use these in page.js)
// // ------------------------------------------------------------
// export const getStep = (sectionKey) => {
//   const cfg = SCROLL_STEPS[sectionKey]
//   if (!cfg) return SCROLL_STEPS.capability.mobile
//   return isMobileViewport() ? cfg.mobile : cfg.desktop
// }

// // Legacy responsive getters (kept so page.js's existing
// // responsive behaviour is preserved identically on desktop).
// export const getHeroStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.hero.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.hero.small
//   if (w <= 768) return RESPONSIVE_STEPS.hero.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.hero.tablet
//   return RESPONSIVE_STEPS.hero.desktop
// }

// export const getSecondStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.second.desktop
//   return window.innerWidth <= 768
//     ? RESPONSIVE_STEPS.second.mobile
//     : RESPONSIVE_STEPS.second.desktop
// }

// export const getProcessStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.process.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.process.small
//   if (w <= 768) return RESPONSIVE_STEPS.process.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.process.tablet
//   return RESPONSIVE_STEPS.process.desktop
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
// // 8) DEVICE DETECTION (used by page.js)
// // ------------------------------------------------------------
// export const isTouchDevice = () => {
//   if (typeof window === 'undefined') return false
//   return (
//     'ontouchstart' in window ||
//     navigator.maxTouchPoints > 0 ||
//     navigator.msMaxTouchPoints > 0
//   )
// }








// ============================================================
// lib/scrollConfig.js
// ------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for every scroll-related number in the
// entire site. Change values here only — never inside page.js
// or any section component.
//
// DESKTOP values are already tuned & must stay untouched.
// MOBILE values are tuned per-section:
//   - Capability → 0.005 (SLOWED — was 0.008, ab liquid feel smooth)
//   - Third      → 0.012 (SLOWED — was 0.022, ab mobile par control)
//   - Process    → 0.016 (SLOWED — was 0.022, sensitivity kam ki)
//   - Quality / Contact → 0.030 (extra sensitive)
//   - Others → 0.022 (premium sensitive baseline)
// ============================================================

const MOBILE_BREAKPOINT = 768

export const isMobileViewport = () =>
  typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT

// ------------------------------------------------------------
// 1) PER-SECTION SCROLL STEP (progress-per-tick)
// ------------------------------------------------------------
// MOBILE:
//   hero       → 0.15   (fast — ek scroll = ek section)
//   second     → 0.022
//   fourth     → 0.022
//   capability → 0.005  ← SLOWED (was 0.008)
//   process    → 0.016  ← SLOWED (was 0.022)
//   third      → 0.012  ← SLOWED (was 0.022)
//   quality    → 0.030  ← extra sensitive
//   contact    → 0.030  ← extra sensitive
export const SCROLL_STEPS = {
  hero:       { desktop: 0.08,  mobile: 0.15 },
  second:     { desktop: 0.015, mobile: 0.022 },
  fourth:     { desktop: 0.012, mobile: 0.022 },
  capability: { desktop: 0.008, mobile: 0.007 }, // ← MOBILE SLOWED
  process:    { desktop: 0.010, mobile: 0.016 }, // ← MOBILE SLOWED
  third:      { desktop: 0.012, mobile: 0.012 }, // ← MOBILE SLOWED
  quality:    { desktop: 0.010, mobile: 0.030 }, // extra sensitive
  contact:    { desktop: 0.025, mobile: 0.030 }, // extra sensitive
}

// Legacy per-viewport fine-tune map (hero/second/process/quality
// already use responsive getters). Kept so page.js can keep its
// existing responsive behaviour on desktop without change.
export const RESPONSIVE_STEPS = {
  hero: {
    desktop: 0.08,   // untouched
    tablet: 0.010,   // untouched
    mobile: 0.30,    // ek scroll = ek section
    small: 0.32,     // chhoti screen aur fast
  },
  second: {
    desktop: 0.015,
    mobile: 0.022,
  },
  process: {
    desktop: 0.006,   // untouched
    tablet: 0.010,    // ← SLOWED (was 0.012)
    mobile: 0.011,    // ← SLOWED (was 0.013)
    small: 0.010,     // ← SLOWED (was 0.012)
  },
  quality: {
    desktop: 0.01,
    tablet: 0.10,
    mobile: 0.10,   // extra sensitive
    small: 0.10,    // chhoti screen bhi sensitive
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
  // Wheel accumulation decay per tick
  wheelDecay: 0.55,
  // Wheel magnitude cap
  wheelMagnitudeCap: 120,
  // Wheel factor divisor
  wheelFactorDivisor: 55,
  // Wheel factor min/max
  wheelFactorMin: 0.2,
  wheelFactorMax: 1.6,
  // Dead-zone — ignore tiny deltas
  wheelDeadZone: 0.5,
  // Touch delta multiplier applied inside touchmove.
  // 2.2 = finger ka chhota move bhi section aage badhata hai.
  touchDeltaMultiplier: 2.2,
}

// Wheel/touch delta multiplier — MOBILE par 1.5 (premium
// sensitive), desktop par 1.0 (unchanged).
export const getTouchMultiplier = () => {
  if (typeof window === 'undefined') return 1.0
  const w = window.innerWidth
  if (w < 480) return 1.5
  if (w < 768) return 1.5
  if (w < 1024) return 1.5
  return 1.0
}

// ------------------------------------------------------------
// 3b) THIRD SECTION MOBILE TOUCH DAMPING (optional, agar
//     third.mobile = 0.012 ke baad bhi tezz lage)
// ------------------------------------------------------------
// Sirf Third stage mein mobile touch delta ko damp karta hai.
// page.js ke handleTouchMove mein use karna hai (neeche
// comment dekho). 1.0 = no damping, 0.6 = 40% slow.
export const THIRD_MOBILE_TOUCH_DAMPING = 0.6

// ------------------------------------------------------------
// 4) MOBILE SLIDE MODEL (Quality/Contact simplified branch)
// ------------------------------------------------------------
// 0.030 — Quality/Contact extra sensitive.
export const MOBILE_SLIDE_STEP = 0.030

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









// // ============================================================
// // lib/scrollConfig.js
// // ------------------------------------------------------------
// // SINGLE SOURCE OF TRUTH for every scroll-related number in the
// // entire site. Change values here only — never inside page.js
// // or any section component.
// //
// // DESKTOP values are already tuned & must stay untouched.
// // MOBILE values are tuned per-section:
// //   - Capability → 0.005 (SLOWED — was 0.008, ab liquid feel smooth)
// //   - Third      → 0.012 (SLOWED — was 0.022, ab mobile par control)
// //   - Quality / Contact → 0.030 (extra sensitive)
// //   - Others → 0.022 (premium sensitive baseline)
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
// //   fourth     → 0.022
// //   capability → 0.005  ← SLOWED (was 0.008)
// //   process    → 0.022
// //   third      → 0.012  ← SLOWED (was 0.022)
// //   quality    → 0.030  ← extra sensitive
// //   contact    → 0.030  ← extra sensitive
// export const SCROLL_STEPS = {
//   hero:       { desktop: 0.08,  mobile: 0.15 },
//   second:     { desktop: 0.015, mobile: 0.022 },
//   fourth:     { desktop: 0.012, mobile: 0.022 },
//   capability: { desktop: 0.008, mobile: 0.005 }, // ← MOBILE SLOWED
//   process:    { desktop: 0.010, mobile: 0.022 },
//   third:      { desktop: 0.012, mobile: 0.012 }, // ← MOBILE SLOWED
//   quality:    { desktop: 0.010, mobile: 0.030 }, // extra sensitive
//   contact:    { desktop: 0.025, mobile: 0.030 }, // extra sensitive
// }

// // Legacy per-viewport fine-tune map (hero/second/process/quality
// // already use responsive getters). Kept so page.js can keep its
// // existing responsive behaviour on desktop without change.
// export const RESPONSIVE_STEPS = {
//   hero: {
//     desktop: 0.08,   // untouched
//     tablet: 0.010,   // untouched
//     mobile: 0.30,    // ek scroll = ek section
//     small: 0.32,     // chhoti screen aur fast
//   },
//   second: {
//     desktop: 0.015,
//     mobile: 0.022,
//   },
//   process: {
//     desktop: 0.006,   // untouched
//     tablet: 0.012,    // tablet bhi slow
//     mobile: 0.013,    // Capability jaisa slow
//     small: 0.012,     // chhoti screen bhi slow
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
//   process: 0.15,
//   fourth: 0.5,
//   third: 0.55,
//   thirdWrap: 0.35,
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
// // 3b) THIRD SECTION MOBILE TOUCH DAMPING (optional, agar
// //     third.mobile = 0.012 ke baad bhi tezz lage)
// // ------------------------------------------------------------
// // Sirf Third stage mein mobile touch delta ko damp karta hai.
// // page.js ke handleTouchMove mein use karna hai (neeche
// // comment dekho). 1.0 = no damping, 0.6 = 40% slow.
// export const THIRD_MOBILE_TOUCH_DAMPING = 0.6

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
// // 6) PROCESS EXTRA DAMPING
// // ------------------------------------------------------------
// export const PROCESS_DAMPING = 0.65

// // ------------------------------------------------------------
// // 7) PUBLIC HELPERS (use these in page.js)
// // ------------------------------------------------------------
// export const getStep = (sectionKey) => {
//   const cfg = SCROLL_STEPS[sectionKey]
//   if (!cfg) return SCROLL_STEPS.capability.mobile
//   return isMobileViewport() ? cfg.mobile : cfg.desktop
// }

// // Legacy responsive getters (kept so page.js's existing
// // responsive behaviour is preserved identically on desktop).
// export const getHeroStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.hero.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.hero.small
//   if (w <= 768) return RESPONSIVE_STEPS.hero.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.hero.tablet
//   return RESPONSIVE_STEPS.hero.desktop
// }

// export const getSecondStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.second.desktop
//   return window.innerWidth <= 768
//     ? RESPONSIVE_STEPS.second.mobile
//     : RESPONSIVE_STEPS.second.desktop
// }

// export const getProcessStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.process.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.process.small
//   if (w <= 768) return RESPONSIVE_STEPS.process.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.process.tablet
//   return RESPONSIVE_STEPS.process.desktop
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
// // 8) DEVICE DETECTION (used by page.js)
// // ------------------------------------------------------------
// export const isTouchDevice = () => {
//   if (typeof window === 'undefined') return false
//   return (
//     'ontouchstart' in window ||
//     navigator.maxTouchPoints > 0 ||
//     navigator.msMaxTouchPoints > 0
//   )
// }











// // ============================================================
// // lib/scrollConfig.js
// // ------------------------------------------------------------
// // SINGLE SOURCE OF TRUTH for every scroll-related number in the
// // entire site. Change values here only — never inside page.js
// // or any section component.
// //
// // DESKTOP values are already tuned & must stay untouched.
// // MOBILE values are all aligned to match CapabilitySection's
// // feel (flat 0.008, uniform multiplier, no per-section override).
// // ============================================================

// const MOBILE_BREAKPOINT = 768

// export const isMobileViewport = () =>
//   typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT

// // ------------------------------------------------------------
// // 1) PER-SECTION SCROLL STEP (progress-per-tick)
// // ------------------------------------------------------------
// export const SCROLL_STEPS = {
//   hero:       { desktop: 0.08,  mobile: 0.008 },
//   second:     { desktop: 0.015, mobile: 0.008 },
//   fourth:     { desktop: 0.012, mobile: 0.008 },
//   capability: { desktop: 0.008, mobile: 0.008 }, // reference — unchanged
//   process:    { desktop: 0.010, mobile: 0.022 },
//   third:      { desktop: 0.012, mobile: 0.024 },
//   quality:    { desktop: 0.010, mobile: 0.022 },
//   contact:    { desktop: 0.025, mobile: 0.028 },
// }

// // Legacy per-viewport fine-tune map (hero/second/process/quality
// // already use responsive getters). Kept so page.js can keep its
// // existing responsive behaviour on desktop without change.
// export const RESPONSIVE_STEPS = {
//   hero: {
//     desktop: 0.08,
//     tablet: 0.055,
//     mobile: 0.035,
//     small: 0.030,
//   },
//   second: {
//     desktop: 0.015,
//     mobile: 0.022,
//   },
//   process: {
//     desktop: 0.006,
//     tablet: 0.020,
//     mobile: 0.022,
//     small: 0.020,
//   },
//   quality: {
//     desktop: 0.01,
//     tablet: 0.018,
//     mobile: 0.022,
//     small: 0.020,
//   },
// }

// // ------------------------------------------------------------
// // 2) SPLIT POINTS (phase boundaries within a section)
// // ------------------------------------------------------------
// export const SPLITS = {
//   capability: 0.4,
//   process: 0.15,
//   fourth: 0.5,
//   third: 0.55,
//   thirdWrap: 0.35,
//   quality: 0.25,
//   contact: 0.4,
// }

// // ------------------------------------------------------------
// // 3) WHEEL / TOUCH SENSITIVITY
// // ------------------------------------------------------------
// export const INPUT_CONFIG = {
//   // Wheel accumulation decay per tick (was hardcoded 0.55)
//   wheelDecay: 0.55,
//   // Wheel magnitude cap (was hardcoded 120)
//   wheelMagnitudeCap: 120,
//   // Wheel factor divisor (was hardcoded 55)
//   wheelFactorDivisor: 55,
//   // Wheel factor min/max (was hardcoded 0.2 / 1.6)
//   wheelFactorMin: 0.2,
//   wheelFactorMax: 1.6,
//   // Dead-zone — ignore tiny deltas (was hardcoded 0.5)
//   wheelDeadZone: 0.5,
//   // Touch delta multiplier applied inside touchmove (was 2.5)
//   touchDeltaMultiplier: 1.0,
// }

// // Wheel/touch delta multiplier — Capability jaisa uniform (1.0 sab jagah).
// export const getTouchMultiplier = () => {
//   if (typeof window === 'undefined') return 1.0
//   const w = window.innerWidth
//   if (w < 480) return 1.0
//   if (w < 768) return 1.0
//   if (w < 1024) return 1.0
//   return 1.0
// }

// // ------------------------------------------------------------
// // 4) MOBILE SLIDE MODEL (Quality/Contact simplified branch)
// // ------------------------------------------------------------
// export const MOBILE_SLIDE_STEP = 0.045

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
// // 6) PROCESS EXTRA DAMPING
// // ------------------------------------------------------------
// export const PROCESS_DAMPING = 0.65

// // ------------------------------------------------------------
// // 7) PUBLIC HELPERS (use these in page.js)
// // ------------------------------------------------------------
// export const getStep = (sectionKey) => {
//   const cfg = SCROLL_STEPS[sectionKey]
//   if (!cfg) return SCROLL_STEPS.capability.mobile
//   return isMobileViewport() ? cfg.mobile : cfg.desktop
// }

// // Legacy responsive getters (kept so page.js's existing
// // responsive behaviour is preserved identically on desktop).
// export const getHeroStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.hero.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.hero.small
//   if (w <= 768) return RESPONSIVE_STEPS.hero.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.hero.tablet
//   return RESPONSIVE_STEPS.hero.desktop
// }

// export const getSecondStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.second.desktop
//   return window.innerWidth <= 768
//     ? RESPONSIVE_STEPS.second.mobile
//     : RESPONSIVE_STEPS.second.desktop
// }

// export const getProcessStep = () => {
//   if (typeof window === 'undefined') return RESPONSIVE_STEPS.process.desktop
//   const w = window.innerWidth
//   if (w <= 480) return RESPONSIVE_STEPS.process.small
//   if (w <= 768) return RESPONSIVE_STEPS.process.mobile
//   if (w <= 1024) return RESPONSIVE_STEPS.process.tablet
//   return RESPONSIVE_STEPS.process.desktop
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
// // 8) DEVICE DETECTION (used by page.js)
// // ------------------------------------------------------------
// export const isTouchDevice = () => {
//   if (typeof window === 'undefined') return false
//   return (
//     'ontouchstart' in window ||
//     navigator.maxTouchPoints > 0 ||
//     navigator.msMaxTouchPoints > 0
//   )
// }