/**
 * Animation constants for consistent motion across the application
 */

// Page transition variants
export const PAGE_VARIANTS = {
  enter: (direction: number) => ({
    x: direction > 0 ? "40%" : "-40%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "40%" : "-40%",
    opacity: 0,
  }),
} as const;

export const PAGE_TRANSITION = {
  type: "tween" as const,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  duration: 0.5,
} as const;

// Card flip animation
export const CARD_FLIP_DURATION = 0.2; // seconds
export const CARD_MATCH_DELAY = 1000; // ms

// Floating number animation (CookieClicker)
export const FLOATING_NUMBER_DURATION = 0.8; // seconds
export const FLOATING_NUMBER_DISTANCE = 60; // px to move up
export const FLOATING_NUMBER_SCALE = 1.5; // max scale

// Cookie click animation
export const COOKIE_SCALE_DOWN = 0.9;
export const COOKIE_SCALE_RESET_DELAY = 100; // ms

// Button interaction animations
export const BUTTON_HOVER_SCALE = 1.05;
export const BUTTON_TAP_SCALE = 0.95;

// Navigation arrow animations
export const NAV_ARROW_INITIAL_X = 20; // px
export const NAV_ARROW_INITIAL_OPACITY = 0;
export const NAV_ARROW_ANIMATE_SCALE = 1.1; // hover scale for desktop

// Navigation dots
export const NAV_DOT_INITIAL_Y = 20; // px
export const NAV_DOT_ACTIVE_SCALE = 1.25;
export const NAV_DOT_TRANSITION_DURATION = 300; // ms

// Modal animations
export const MODAL_ENTER_SCALE = 0.9;
export const MODAL_EXIT_SCALE = 0.9;
export const MODAL_SPRING_DAMPING = 25;
export const MODAL_SPRING_STIFFNESS = 300;

// Confetti and celebration
export const CONFETTI_DELAY = 0; // Can be overridden per component
export const WIN_MESSAGE_DELAY = 0.4; // seconds before showing win message

// Loading screen
export const LOADING_FADE_IN_DELAY = 0; // ms
export const LOADING_FADE_IN_DURATION = 0.5; // seconds

// Volume slider
export const VOLUME_SLIDER_HIDE_DELAY = 300; // ms
export const VOLUME_SLIDER_ANIMATION_DURATION = 0.2; // seconds

// Audio prompt modal
export const AUDIO_PROMPT_DELAY = 1500; // ms before showing prompt
export const AUDIO_PROMPT_MUSIC_ICON_SCALE: [number, number, number] = [1, 1.1, 1];
export const AUDIO_PROMPT_MUSIC_ICON_DURATION = 1.5; // seconds

// Heart animation (ValentinePage decorative elements)
export const HEART_ANIMATION_Y_RANGE: [number, number, number] = [0, -5, 0];
export const HEART_ANIMATION_ROTATE_RANGE: [number, number, number] = [-5, 5, -5];
export const HEART_ANIMATION_DURATION = 2; // seconds
export const HEART_ANIMATION_DELAY_STEP = 0.2; // seconds between each heart

// Milestone notification (CookieClicker)
export const MILESTONE_SHOW_DURATION = 2000; // ms
export const MILESTONE_INITIAL_Y = -20; // px
export const MILESTONE_INITIAL_SCALE = 0.8;

// Easing functions (common patterns)
export const EASING = {
  // Smooth cubic-bezier
  smooth: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  // Spring-like
  spring: { type: "spring", damping: 25, stiffness: 300 } as const,
  // Ease out
  easeOut: "easeOut" as const,
  // Ease in out
  easeInOut: "easeInOut" as const,
} as const;

// Standard animation durations
export const DURATION = {
  instant: 0,
  fast: 0.2,
  normal: 0.5,
  slow: 0.8,
  verySlow: 1.5,
} as const;

// Scale values
export const SCALE = {
  none: 1,
  small: 0.9,
  large: 1.1,
  veryLarge: 1.25,
} as const;
