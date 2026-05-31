# Framer Motion

- URL: https://motion.dev
- Category: animation
- Relevance: Core animation library used by Aether for all UI transitions, micro-interactions, and layout animations.
- Priority: primary

## Description

Framer Motion (now branded as Motion) is a production-ready animation library for
React. It provides declarative animations, spring physics, layout animations, gesture
handling, scroll-triggered animations, and exit animations. It is the animation
library chosen for the Aether project.

## Key Sections

- Animation: `animate` prop, variants, keyframes, spring and tween transitions
- Gestures: Drag, hover, tap, pan, focus gesture handlers
- Layout animations: `layout` prop, shared layout animations, `AnimatePresence`
- Scroll animations: Scroll-triggered animations, scroll-linked values, scroll velocity
- Transitions: Spring physics (stiffness, damping, mass), tween (duration, ease), inertia
- Variants: Declarative animation states, propagation through component trees
- AnimatePresence: Exit animations for unmounting components
- Motion values: Reactive animation values, `useMotionValue`, `useTransform`, `useSpring`
- SVG animations: Path drawing, morphing, SVG-specific motion properties

## Usage Guidelines for Aether

Framer Motion is a **primary reference** and a direct dependency. Every animation
in Aether's UI is built with this library.

**Adopt directly:**
- Spring-based transitions as the default for all UI animations
- `AnimatePresence` for all mount/unmount transitions (tab close, panel open/close)
- Layout animations for reflow transitions (tab reordering, sidebar toggle)
- Variants for coordinated multi-element animations
- `useMotionValue` and `useTransform` for performant scroll-linked effects

**Standard animation parameters for Aether:**
- Default spring: `{ type: "spring", stiffness: 300, damping: 30 }`
- Quick spring (micro-interactions): `{ type: "spring", stiffness: 500, damping: 35 }`
- Slow spring (panel transitions): `{ type: "spring", stiffness: 200, damping: 25 }`
- Fade transitions: `{ duration: 0.15 }` (tween, not spring)

**Performance guidelines:**
- Always animate `transform` and `opacity` only when possible (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` directly — use the `layout` prop instead
- Use `willChange: "transform"` on frequently animated elements
- Batch animation updates using variants rather than individual animate props
- Test all animations at 60fps on minimum-spec hardware

**Do not do:**
- Do not use CSS animations or transitions where Framer Motion can handle the same
  animation (maintain a single animation system)
- Do not create animations longer than 500ms for interactive UI elements
- Do not use bounce-heavy springs (keep damping ratio above 0.5)
- Do not animate elements that are not visible to the user
