export const DANCE_STYLES = [
  'Bharatnatyam',
  'Semi-classical',
  'Bollywood Fusion',
  'Classical fusion',
  'Indo western',
  'Bollywood'
] as const;

export type DanceStyle = typeof DANCE_STYLES[number];

