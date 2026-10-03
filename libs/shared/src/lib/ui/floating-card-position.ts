// libs/shared/src/lib/ui/floating-card-position.ts
export type FloatingCardPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

const ALL_POSITIONS: readonly FloatingCardPosition[] = [
  'top-left', 'top-center', 'top-right',
  'center-left', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];

/** Picks one of the 8 positions at random. Call once per page load, not reactively. */
export function pickRandomFloatingCardPosition(): FloatingCardPosition {
  return ALL_POSITIONS[Math.floor(Math.random() * ALL_POSITIONS.length)];
}