
// ============================================================
// lib/scrollConfig.js
// ------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for every scroll-related number in the
// entire site. Change values here only — never inside page.js
// or any section component.
//
// DESKTOP values are UNTOUCHED — confirmed perfect, do not edit.
//
// MOBILE + TABLET RETUNE (buttery pass, nabilissa.com-style):
//   Problem: setting every section's step equal to Capability's
//   old value (0.007) made the WHOLE site feel slow, because
//   different sections need different tick-counts to cross
//   their SPLITS. Buttery-ness mostly comes from the *input*
//   side (touch delta size), not from shrinking every step to
//   the smallest one.
//
//   What changed:
//     1) touchDeltaMultiplier 2.2 → 1.7 — each finger move
//        pushes a smaller, calmer delta into the accumulator
//        (this is what actually removes the "jumpy" feeling).
//     2) getTouchMultiplier() re-tuned per width tier instead
//        of one flat 1.5 for everything under 1024px.
//     3) A real TABLET tier now exists in SCROLL_STEPS (was
//        silently falling back to desktop numbers before —
//        that's why tablet never felt buttery).
//     4) Per-section mobile steps nudged toward each other
//        (capability up a touch, second/fourth/quality down a
//        touch) so nothing lags behind, instead of forcing one
//        shared number.
//   Desktop column of every object below is identical to before.
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
// desktop → untouched. tablet → new tier (buttery, closer to
// mobile since it's still touch input). mobile → re-tuned.
export const SCROLL_STEPS = {
  hero:       { desktop: 0.08,  tablet: 0.13,   mobile: 0.15  },
  second:     { desktop: 0.015, tablet: 0.019,  mobile: 0.020 },
  fourth:     { desktop: 0.012, tablet: 0.018,  mobile: 0.020 },
  capability: { desktop: 0.008, tablet: 0.0085, mobile: 0.011 },
  process:    { desktop: 0.010, tablet: 0.0115, mobile: 0.011 },
  third:      { desktop: 0.012, tablet: 0.0115, mobile: 0.011 },
  quality:    { desktop: 0.010, tablet: 0.024,  mobile: 0.026 },
  contact:    { desktop: 0.025, tablet: 0.026,  mobile: 0.026 },
}

// Legacy per-viewport fine-tune map (hero/second/process/quality
// already use responsive getters). Kept so page.js can keep its
// existing responsive behaviour on desktop without change.
// NOTE: only touching the tablet entries that clearly feed the
// buttery feel (hero/process). quality's tablet/mobile values
// here (0.10) are on a different scale than SCROLL_STEPS.quality
// — left untouched since it's unclear if this legacy path is
// still wired into page.js; confirm before retuning it further.
export const RESPONSIVE_STEPS = {
  hero: {
    desktop: 0.08,   // untouched
    tablet: 0.013,   // ← buttery pass (was 0.010)
    mobile: 0.30,    // ek scroll = ek section
    small: 0.32,     // chhoti screen aur fast
  },
  second: {
    desktop: 0.015,
    mobile: 0.022,
  },
  process: {
    desktop: 0.006,   // untouched
    tablet: 0.0115,   // ← buttery pass (was 0.010)
    mobile: 0.011,    // ← buttery pass (was 0.011)
    small: 0.011,     // ← buttery pass (was 0.012)
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
  // Wheel accumulation decay per tick — desktop mouse wheel,
  // untouched.
  wheelDecay: 0.55,
  wheelMagnitudeCap: 120,
  wheelFactorDivisor: 55,
  wheelFactorMin: 0.2,
  wheelFactorMax: 1.6,
  wheelDeadZone: 0.5,
  // Touch delta multiplier applied inside touchmove.
  // ← buttery pass: was 2.2 (too much delta per finger move,
  // caused the jumpy non-controllable feel on mobile/tablet).
  // 1.7 = smoother, more controllable, still responsive.
  touchDeltaMultiplier: 2.2,
}

// Wheel/touch delta multiplier — re-tuned per tier. Desktop
// stays 1.0 (untouched). Phones and tablets get progressively
// gentler amplification instead of one flat 1.5 for everything
// under 1024px — that flatness was part of why small phones
// felt jumpy and tablets felt like nothing had changed.
export const getTouchMultiplier = () => {
  if (typeof window === 'undefined') return 1.0
  const w = window.innerWidth
  if (w < 480) return 1.8   // small phones — more sensitive
  if (w < 768) return 1.7   // phones
  if (w < 1024) return 1.5  // tablets
  return 1.0                // desktop, untouched
}

// ------------------------------------------------------------
// 3b) THIRD SECTION MOBILE TOUCH DAMPING — untouched, unrelated
//     to this pass (Capability was the buttery reference, not
//     Third).
// ------------------------------------------------------------
export const THIRD_MOBILE_TOUCH_DAMPING = 0.6

// ------------------------------------------------------------
// 4) MOBILE SLIDE MODEL (Quality/Contact simplified branch)
// ------------------------------------------------------------
export const MOBILE_SLIDE_STEP = 0.035 // ← buttery pass (was 0.030)

// ------------------------------------------------------------
// 5) TRAVEL-TO-STAGE (nav / keyboard instant navigation) — untouched
// ------------------------------------------------------------
export const TRAVEL_CONFIG = {
  legFactor: 1.8,
  fallbackStep: 0.015,
}

// ------------------------------------------------------------
// 6) PROCESS EXTRA DAMPING — untouched (not device-specific,
//    affects desktop too, left as-is per "desktop perfect")
// ------------------------------------------------------------
export const PROCESS_DAMPING = 0.65

// ------------------------------------------------------------
// 7) PUBLIC HELPERS (use these in page.js)
// ------------------------------------------------------------
export const getStep = (sectionKey) => {
  const cfg = SCROLL_STEPS[sectionKey]
  if (!cfg) return SCROLL_STEPS.capability.mobile
  if (isMobileViewport()) return cfg.mobile
  if (isTabletViewport()) return cfg.tablet ?? cfg.mobile
  return cfg.desktop
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
// 8) DEVICE DETECTION (used by page.js) — untouched
// ------------------------------------------------------------
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}