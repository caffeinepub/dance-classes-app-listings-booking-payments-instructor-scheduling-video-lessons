import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface VideoLesson {
    id: VideoId;
    title: string;
    duration: bigint;
    instructor: string;
    style: string;
    videoUrl: string;
}
export interface DanceClass {
    id: ClassId;
    title: string;
    duration: bigint;
    instructor: string;
    description: string;
    level: string;
    style: string;
    price: bigint;
}
export interface StyleSessionCount {
    count: bigint;
    style: string;
}
export type SessionId = bigint;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type ClassStatus = {
    __kind__: "canceled";
    canceled: null;
} | {
    __kind__: "pendingPayment";
    pendingPayment: {
        sessionId: SessionId;
        amount: bigint;
    };
} | {
    __kind__: "confirmed";
    confirmed: null;
};
export interface Session {
    id: SessionId;
    startTime: Time;
    duration: bigint;
    instructor: string;
    classId: ClassId;
    style: string;
    onlineLink: string;
    capacity: bigint;
    location: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface ContactInquiryInput {
    name: string;
    email: string;
    message: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type VideoId = bigint;
export interface Booking {
    id: bigint;
    status: ClassStatus;
    user: Principal;
    timestamp: Time;
    sessionId: SessionId;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface ContactInquiry {
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export type ClassId = bigint;
export interface UserProfile {
    name: string;
    role: string;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookSession(sessionId: SessionId): Promise<Booking>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createDanceClass(newClass: DanceClass): Promise<void>;
    createSession(newSession: Session): Promise<void>;
    ensureMinimumMonthlySessions(styles: Array<string>): Promise<Array<StyleSessionCount>>;
    getAllContactInquiries(): Promise<Array<ContactInquiry>>;
    getAllDanceClasses(): Promise<Array<DanceClass>>;
    getAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    getAllVideoLessons(): Promise<Array<VideoLesson>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDanceClass(classId: ClassId): Promise<DanceClass | null>;
    getGlobalSessionSchedule(): Promise<Array<Session>>;
    getSession(sessionId: SessionId): Promise<Session | null>;
    getSessionsForClass(classId: ClassId): Promise<Array<Session>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserBookings(): Promise<Array<Booking>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitContactInquiry(inquiryInput: ContactInquiryInput): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    uploadVideoLesson(newLesson: VideoLesson): Promise<void>;
}
