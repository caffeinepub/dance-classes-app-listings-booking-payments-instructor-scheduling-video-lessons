export const CLASS_LEVELS = ['Beginner', 'Intermediate', 'Expert'] as const;

export type ClassLevel = typeof CLASS_LEVELS[number];
