export const DANCE_STYLES = [
  'Bharatnatyam',
  'Semi-classical',
  'Bollywood Fusion',
  'Classical fusion',
  'Indo western',
  'Bollywood'
] as const;

export type DanceStyle = typeof DANCE_STYLES[number];

export interface DanceStyleOption {
  value: DanceStyle;
  label: string;
  description: string;
}

export const DANCE_STYLE_OPTIONS: DanceStyleOption[] = [
  {
    value: 'Bharatnatyam',
    label: 'Bharatnatyam',
    description: 'Traditional South Indian classical dance with intricate footwork and expressive storytelling - 2 classes per week (8 per month)'
  },
  {
    value: 'Semi-classical',
    label: 'Semi-classical',
    description: 'Blend of classical techniques with contemporary expressions and lighter themes'
  },
  {
    value: 'Bollywood Fusion',
    label: 'Bollywood Fusion',
    description: 'Energetic mix of Bollywood film dance with modern and traditional styles'
  },
  {
    value: 'Classical fusion',
    label: 'Classical fusion',
    description: 'Creative combination of multiple classical dance forms with innovative choreography'
  },
  {
    value: 'Indo western',
    label: 'Indo western',
    description: 'Contemporary fusion of Indian dance elements with Western dance techniques'
  },
  {
    value: 'Bollywood',
    label: 'Bollywood',
    description: 'Popular dance style from Indian cinema featuring vibrant movements and expressions'
  }
];

// Helper function to get description by value
export function getDanceStyleDescription(value: DanceStyle): string {
  const option = DANCE_STYLE_OPTIONS.find(opt => opt.value === value);
  return option?.description || '';
}
