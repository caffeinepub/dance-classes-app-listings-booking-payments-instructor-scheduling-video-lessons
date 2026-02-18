import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Int "mo:core/Int";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";

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
    style : Text; // Added style field
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

  public type ContactInquiry = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type ContactInquiryInput = {
    name : Text;
    email : Text;
    message : Text;
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
  let contactInquiries = Map.empty<Time.Time, ContactInquiry>();

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

  public query ({ caller }) func getAllUsers() : async [(Principal, UserProfile)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfiles.toArray();
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
    // Public access - anyone including guests can browse classes
    danceClasses.values().toArray();
  };

  // Session Management
  public shared ({ caller }) func createSession(newSession : Session) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create sessions");
    };

    let sessionId = nextSessionId;
    nextSessionId += 1;

    switch (danceClasses.get(newSession.classId)) {
      case (null) { Runtime.trap("Dance class not found for session") };
      case (?danceClass) {
        let sessionWithId = { newSession with id = sessionId; style = danceClass.style };
        sessions.add(sessionId, sessionWithId);
      };
    };
  };

  public query func getSessionsForClass(classId : ClassId) : async [Session] {
    // Public access - anyone including guests can browse sessions
    let sessionArray = sessions.values().toArray();
    sessionArray.filter(func(session : Session) : Bool { session.classId == classId });
  };

  public query ({ caller }) func getSession(sessionId : SessionId) : async ?Session {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view session details");
    };
    sessions.get(sessionId);
  };

  public query ({ caller }) func getDanceClass(classId : ClassId) : async ?DanceClass {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view class details");
    };
    danceClasses.get(classId);
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
      Runtime.trap("Unauthorized: Only admins can upload video lessons");
    };

    let videoId = nextVideoLessonId;
    nextVideoLessonId += 1;

    let lessonWithId = { newLesson with id = videoId };
    videoLessons.add(videoId, lessonWithId);
  };

  public query func getAllVideoLessons() : async [VideoLesson] {
    // Public access - anyone including guests can browse video lessons
    videoLessons.values().toArray();
  };

  // Stripe Payment Integration
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    // Public access - anyone can check if Stripe is configured
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

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check payment status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    // No authorization check - this is a system callback for HTTP outcalls
    OutCall.transform(input);
  };

  // Contact Inquiry Management
  public shared ({ caller }) func submitContactInquiry(inquiryInput : ContactInquiryInput) : async () {
    // Public access - anyone including guests can submit contact inquiries
    // Timestamp is set by the backend to prevent manipulation
    let inquiry : ContactInquiry = {
      name = inquiryInput.name;
      email = inquiryInput.email;
      message = inquiryInput.message;
      timestamp = Time.now();
    };
    contactInquiries.add(inquiry.timestamp, inquiry);
  };

  public query ({ caller }) func getAllContactInquiries() : async [ContactInquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact inquiries");
    };
    contactInquiries.values().toArray();
  };

  // Global Session Schedule
  func compareSessionsByStartTime(a : Session, b : Session) : Order.Order {
    Int.compare(a.startTime, b.startTime);
  };

  public query func getGlobalSessionSchedule() : async [Session] {
    // Public access - anyone (including guests) can fetch the global schedule
    sessions.values().toArray().sort(compareSessionsByStartTime);
  };

  type StyleSessionCount = {
    style : Text;
    count : Nat;
  };

  public shared ({ caller }) func ensureMinimumMonthlySessions(styles : [Text]) : async [StyleSessionCount] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can invoke this operation");
    };

    let now = Time.now();
    let monthInNanos = 30 * 24 * 60 * 60 * 1_000_000_000; // 30 days

    let styleStats = Array.tabulate(
      styles.size(),
      func(i) {
        let style = styles[i];
        let upcomingCount = sessions.values().toArray().foldLeft(
          0,
          func(acc, session) {
            if (
              session.style == style and session.startTime >= now and session.startTime <= (now + monthInNanos)
            ) {
              acc + 1;
            } else {
              acc;
            };
          },
        );

        var createdCount = 0;

        if (upcomingCount < 8) {
          let availableClasses = danceClasses.values().toArray().filter(func(dc) { dc.style == style });
          let numToSchedule = 8 - upcomingCount;

          switch (availableClasses.values().next()) {
            case (?selectedClass) {
              let randomSeed = (now / (1_000_000_000)) % 30; // 30-day offset
              var sessionOffset = 0;
              while (createdCount < numToSchedule) {
                let sessionId = nextSessionId;
                nextSessionId += 1;

                // Distribute sessions across the month
                let dayOffset = (randomSeed + createdCount) % 30;

                let newSession : Session = {
                  id = sessionId;
                  classId = selectedClass.id;
                  instructor = selectedClass.instructor;
                  startTime = now + (dayOffset * 24 * 60 * 60 * 1_000_000_000);
                  duration = selectedClass.duration;
                  capacity = 10;
                  location = "Default Location";
                  onlineLink = "";
                  style = style;
                };

                sessions.add(sessionId, newSession);
                createdCount += 1;
                sessionOffset += 1;
              };
            };
            case (null) {};
          };
        };

        { style; count = createdCount };
      },
    );

    styleStats;
  };
};
