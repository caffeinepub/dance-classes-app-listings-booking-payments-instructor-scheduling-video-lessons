import { useState } from 'react';
import { useUploadVideoLesson, useGetAllVideoLessons } from './useQueries';
import { SAMPLE_VIDEO_LESSONS } from '../constants/sampleVideoLessons';
import type { VideoLesson } from '../backend';
import { toast } from 'sonner';

export function useAddSampleVideoLessons() {
  const [isAdding, setIsAdding] = useState(false);
  const uploadVideoLesson = useUploadVideoLesson();
  const { data: existingLessons = [] } = useGetAllVideoLessons();

  const addSampleLessons = async () => {
    setIsAdding(true);

    try {
      // Check which sample lessons already exist
      const existingTitles = new Set(
        existingLessons.map((lesson) =>
          `${lesson.title.toLowerCase()}-${lesson.style.toLowerCase()}-${lesson.instructor.toLowerCase()}`
        )
      );

      const lessonsToAdd = SAMPLE_VIDEO_LESSONS.filter((sample) => {
        const key = `${sample.title.toLowerCase()}-${sample.style.toLowerCase()}-${sample.instructor.toLowerCase()}`;
        return !existingTitles.has(key);
      });

      if (lessonsToAdd.length === 0) {
        toast.info('Sample lessons have already been added');
        setIsAdding(false);
        return { added: 0, skipped: SAMPLE_VIDEO_LESSONS.length };
      }

      // Add each missing lesson sequentially
      let successCount = 0;
      let errorCount = 0;

      for (const sample of lessonsToAdd) {
        try {
          const newLesson: VideoLesson = {
            id: BigInt(0),
            title: sample.title,
            style: sample.style,
            instructor: sample.instructor,
            duration: BigInt(sample.duration),
            videoUrl: sample.videoUrl,
          };

          await uploadVideoLesson.mutateAsync(newLesson);
          successCount++;
        } catch (error) {
          console.error(`Failed to add lesson "${sample.title}":`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully added ${successCount} sample lesson${successCount > 1 ? 's' : ''}`);
      }

      if (errorCount > 0) {
        toast.error(`Failed to add ${errorCount} lesson${errorCount > 1 ? 's' : ''}`);
      }

      setIsAdding(false);
      return { added: successCount, failed: errorCount };
    } catch (error: any) {
      console.error('Error adding sample lessons:', error);
      toast.error('Failed to add sample lessons: ' + error.message);
      setIsAdding(false);
      throw error;
    }
  };

  return {
    addSampleLessons,
    isAdding,
  };
}
