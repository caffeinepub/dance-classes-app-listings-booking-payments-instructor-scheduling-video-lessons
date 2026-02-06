import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DanceClass, Session, Booking, VideoLesson, ClassId, SessionId, VideoId, ShoppingItem, StripeConfiguration, UserRole } from '../backend';
import { Principal } from '@dfinity/principal';

// Dance Classes
export function useGetAllDanceClasses() {
  const { actor, isFetching } = useActor();

  return useQuery<DanceClass[]>({
    queryKey: ['danceClasses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDanceClasses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDanceClass() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newClass: DanceClass) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDanceClass(newClass);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['danceClasses'] });
    },
  });
}

// Sessions
export function useGetSessionsForClass(classId: ClassId) {
  const { actor, isFetching } = useActor();

  return useQuery<Session[]>({
    queryKey: ['sessions', classId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSessionsForClass(classId);
    },
    enabled: !!actor && !isFetching && classId !== undefined,
  });
}

export function useCreateSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSession: Session) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSession(newSession);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sessions', variables.classId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

// Bookings
export function useGetUserBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['userBookings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: SessionId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bookSession(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

// Video Lessons
export function useGetAllVideoLessons() {
  const { actor, isFetching } = useActor();

  return useQuery<VideoLesson[]>({
    queryKey: ['videoLessons'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideoLessons();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadVideoLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLesson: VideoLesson) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadVideoLesson(newLesson);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoLessons'] });
    },
  });
}

// Stripe
export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripeConfigured'] });
    },
  });
}

// Role Management
export function useAssignCallerUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerRole'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
