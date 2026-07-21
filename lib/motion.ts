// Easing and motion presets used by the premium UI design-effects skill.
// Prefer these over generic `transition-all duration-300`.

export const easeOutExpo = [0.16, 1, 0.3, 1] as const
export const easeInOutQuart = [0.76, 0, 0.24, 1] as const

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: easeOutExpo },
}

export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08 },
  },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: easeOutExpo },
}
