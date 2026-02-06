import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type ClassId = Nat;
  type SessionId = Nat;
  type VideoId = Nat;

  type ClassStatus = {
    #pendingPayment : { sessionId : SessionId; amount : Nat };
    #confirmed;
    #canceled;
  };

  public type UserProfile = {
    name : Text;
    role : Text; // "student", "instructor", or "admin"
    email : Text;
  };

  public type DanceClass = {
    id : ClassId;
    title : Text;
    style : Text;
    description : Text;
    level : Text;
    instructor : Text;
    duration : Nat; // in minutes
    price : Nat;
  };

  public type Session = {
    id : SessionId;
    classId : ClassId;
    instructor : Text;
    startTime : Time.Time; // unix timestamp in nanoseconds
    duration : Nat; // in minutes
    capacity : Nat;
    location : Text;
    onlineLink : Text;
  };

  public type Booking = {
    id : Nat;
    user : Principal;
    sessionId : SessionId;
    status : ClassStatus;
    timestamp : Time.Time;
  };

  public type VideoLesson = {
    id : VideoId;
    title : Text;
    style : Text;
    instructor : Text;
    duration : Nat; // in minutes
    videoUrl : Text;
  };

  // State
  var nextClassId = 1;
  var nextSessionId = 1;
  var nextVideoLessonId = 1;
  var nextBookingId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let danceClasses = Map.empty<ClassId, DanceClass>();
  let sessions = Map.empty<SessionId, Session>();
  let bookings = Map.empty<Nat, Booking>();
  let videoLessons = Map.empty<VideoId, VideoLesson>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Dance Class Management
  public shared ({ caller }) func createDanceClass(newClass : DanceClass) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create dance classes");
    };

    let classId = nextClassId;
    nextClassId += 1;

    let classWithId = { newClass with id = classId };
    danceClasses.add(classId, classWithId);
  };

  public query func getAllDanceClasses() : async [DanceClass] {
    let classArray = danceClasses.values().toArray();
    classArray.sort();
  };

  module DanceClass {
    public func compare(class1 : DanceClass, class2 : DanceClass) : Order.Order {
      Text.compare(class1.title, class2.title);
    };
  };

  // Session Management
  public shared ({ caller }) func createSession(newSession : Session) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only instructors/admins can create sessions");
    };

    let sessionId = nextSessionId;
    nextSessionId += 1;

    let sessionWithId = { newSession with id = sessionId };
    sessions.add(sessionId, sessionWithId);
  };

  public query func getSessionsForClass(classId : ClassId) : async [Session] {
    let sessionArray = sessions.values().toArray();
    sessionArray.filter(func(session : Session) : Bool { session.classId == classId });
  };

  // Booking Management
  public shared ({ caller }) func bookSession(sessionId : SessionId) : async Booking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can book sessions");
    };

    let session = switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session does not exist") };
      case (?value) { value };
    };

    let bookingId = nextBookingId;
    nextBookingId += 1;

    let newBooking : Booking = {
      id = bookingId;
      user = caller;
      sessionId;
      status = #pendingPayment { sessionId; amount = sessionId };
      timestamp = Time.now();
    };

    bookings.add(bookingId, newBooking);
    newBooking;
  };

  public query ({ caller }) func getUserBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };
    let bookingArray = bookings.values().toArray();
    bookingArray.filter(func(booking : Booking) : Bool { booking.user == caller });
  };

  // Video Library Management
  public shared ({ caller }) func uploadVideoLesson(newLesson : VideoLesson) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only instructors/admins can upload video lessons");
    };

    let videoId = nextVideoLessonId;
    nextVideoLessonId += 1;

    let lessonWithId = { newLesson with id = videoId };
    videoLessons.add(videoId, lessonWithId);
  };

  public query func getAllVideoLessons() : async [VideoLesson] {
    videoLessons.values().toArray();
  };

  // Stripe Payment Integration
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be configured first") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
