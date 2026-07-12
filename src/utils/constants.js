/* Graph theme colors used in SVG rendering */
export const COLORS = {
  primary: '#6366F1',
  primaryHover: '#818CF8',
  primaryGlow: 'rgba(99, 102, 241, 0.4)',

  secondary: '#06B6D4',
  secondaryHover: '#22D3EE',
  secondaryGlow: 'rgba(6, 182, 212, 0.4)',

  accent: '#10B981',
  accentHover: '#34D399',
  accentGlow: 'rgba(16, 185, 129, 0.4)',

  warning: '#F59E0B',
  warningGlow: 'rgba(245, 158, 11, 0.4)',
  error: '#EF4444',

  surface0: '#09090B',
  surface1: '#18181B',
  surface2: '#27272A',
  surface3: '#3F3F46',

  textPrimary: '#FAFAFA',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
};

/* TSP graph rendering theme */
export const TSP_THEME = {
  nodeFill: '#0E1729',
  nodeStroke: '#06B6D4',
  nodeStrokeWidth: 2.5,
  nodeRadius: 22,
  nodeText: '#FAFAFA',
  nodeGlow: 'rgba(6, 182, 212, 0.25)',

  edgeStroke: '#3F3F46',
  edgeStrokeWidth: 2,
  edgeWeightBg: '#27272A',
  edgeWeightText: '#A1A1AA',

  highlightStroke: '#F59E0B',
  highlightStrokeWidth: 3.5,
  highlightGlow: 'rgba(245, 158, 11, 0.4)',
};

/* Fuel graph rendering theme */
export const FUEL_THEME = {
  nodeFill: '#0E1729',
  nodeStroke: '#10B981',
  nodeStrokeWidth: 2.5,
  nodeRadius: 24,
  nodeText: '#FAFAFA',
  nodeGlow: 'rgba(16, 185, 129, 0.25)',

  edgeStroke: '#3F3F46',
  edgeStrokeWidth: 2,
  edgeWeightBg: '#27272A',
  edgeWeightText: '#A1A1AA',

  highlightStroke: '#F59E0B',
  highlightStrokeWidth: 3.5,
  highlightGlow: 'rgba(245, 158, 11, 0.4)',

  activeNodeFill: 'rgba(16, 185, 129, 0.15)',
  activeNodeStroke: '#34D399',
};

/* Navigation items */
export const NAV_ITEMS = [
  { path: '/', label: 'Home', id: 'nav-home' },
  { path: '/tsp', label: 'TSP Solver', id: 'nav-tsp' },
  { path: '/fuel', label: 'Fuel Optimizer', id: 'nav-fuel' },
];

/* Animation durations */
export const ANIMATION = {
  staggerDelay: 0.08,
  cardEntrance: 0.4,
  pathStep: 800,
  counterDuration: 1.2,
};

/* Breakpoints */
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};
