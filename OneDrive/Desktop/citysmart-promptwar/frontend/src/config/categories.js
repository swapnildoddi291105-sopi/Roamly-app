/**
 * Roamly — Category Configuration (Single Source of Truth)
 *
 * All components that display categories must import from here.
 * Maps category keys to display label, emoji, and color token.
 */

export const CATEGORIES = [
  { value: '',           label: 'All',         emoji: '🌐', color: '#64748B' },
  { value: 'historical', label: 'Historical',  emoji: '🏛️', color: '#D97706' },
  { value: 'attraction', label: 'Attractions', emoji: '🎯', color: '#7C3AED' },
  { value: 'restaurant', label: 'Food',        emoji: '🍽️', color: '#DC2626' },
  { value: 'cafe',       label: 'Cafes',       emoji: '☕', color: '#059669' },
  { value: 'hotel',      label: 'Hotels',      emoji: '🏨', color: '#DB2777' },
  { value: 'park',       label: 'Parks',       emoji: '🌿', color: '#16A34A' },
];

/**
 * Map category key → color for use in Leaflet markers and charts.
 * Falls back to slate gray for unknown categories.
 */
export const CATEGORY_COLORS = Object.fromEntries(
  CATEGORIES.filter(c => c.value).map(c => [c.value, c.color])
);

// Default map marker color for unknown/missing categories
export const DEFAULT_MARKER_COLOR = '#64748B';

/**
 * Map category key → emoji (for badges and chips).
 */
export const CATEGORY_EMOJIS = Object.fromEntries(
  CATEGORIES.filter(c => c.value).map(c => [c.value, c.emoji])
);
