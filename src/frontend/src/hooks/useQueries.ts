import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DanceClass, Session, Booking, VideoLesson, ClassId, SessionId, VideoId, ShoppingItem, StripeConfiguration, UserRole, UserProfile, ContactInquiry, StyleSessionCount } from '../backend';
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

export function useGetDanceClass(classId: ClassId | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<DanceClass | null>({
    queryKey: ['danceClass', classId?.toString()],
    queryFn: async () => {
      if (!actor || classId === undefined) return null;
      return actor.getDanceClass(classId);
    },
    enabled: !!actor && !isFetching && classId !== undefined,
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

export function useGetSession(sessionId: SessionId | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Session | null>({
    queryKey: ['session', sessionId?.toString()],
    queryFn: async () => {
      if (!actor || sessionId === undefined) return null;
      return actor.getSession(sessionId);
    },
    enabled: !!actor && !isFetching && sessionId !== undefined,
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
      queryClient.invalidateQueries({ queryKey: ['globalSchedule'] });
    },
  });
}

export function useGetGlobalSessionSchedule() {
  const { actor, isFetching } = useActor();

  return useQuery<Session[]>({
    queryKey: ['globalSchedule'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGlobalSessionSchedule();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEnsureMinimumMonthlySessions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (styles: string[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.ensureMinimumMonthlySessions(styles);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalSchedule'] });
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
      queryClient.invalidateQueries({ queryKey: ['globalSchedule'] });
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

// User Management
export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

// Contact Inquiries
export function useSubmitContactInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inquiry: ContactInquiry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContactInquiry(inquiry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInquiries'] });
    },
  });
}

export function useGetAllContactInquiries() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInquiry[]>({
    queryKey: ['contactInquiries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}
