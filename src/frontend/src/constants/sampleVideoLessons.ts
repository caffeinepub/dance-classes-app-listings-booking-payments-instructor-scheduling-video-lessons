import type { VideoLesson } from '../backend';
import type { DanceStyle } from './danceStyles';

export interface SampleVideoLessonData {
  title: string;
  style: DanceStyle;
  instructor: string;
  duration: number; // in minutes
  videoUrl: string;
}

export const SAMPLE_VIDEO_LESSONS: SampleVideoLessonData[] = [
  {
    title: 'Bharatnatyam Fundamentals: Adavus and Footwork',
    style: 'Bharatnatyam',
    instructor: 'Sujatha Narayanan',
    duration: 45,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    title: 'Bollywood Fusion Dance Basics',
    style: 'Bollywood Fusion',
    instructor: 'Sujatha Narayanan',
    duration: 30,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    title: 'Semi-Classical Dance: Expressive Movements',
    style: 'Semi-classical',
    instructor: 'Sujatha Narayanan',
    duration: 40,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    title: 'Indo Western Contemporary Fusion',
    style: 'Indo western',
    instructor: 'Sujatha Narayanan',
    duration: 35,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
];
