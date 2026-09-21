import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedAppDevelopmentCourse() {
  console.log("Seeding Mobile App Development Course & Curriculum...");

  // 1. Ensure Competency exists for Mobile App Development
  let comp = await prisma.competency.findFirst({
    where: { code: "APP_DEV_CORE" },
  });
  if (!comp) {
    comp = await prisma.competency.create({
      data: {
        code: "APP_DEV_CORE",
        name: "Mobile Application Development",
        domain: "Software Engineering",
        description: "Mobile system architecture, Kotlin/Android, Flutter/React Native, state management, Firebase, and app store deployment.",
        targetLevel: 80.0,
      },
    });
  }

  // 2. Ensure Course exists
  let appCourse = await prisma.course.findUnique({
    where: { slug: "app-development" },
  });

  if (!appCourse) {
    appCourse = await prisma.course.create({
      data: {
        id: "course_app_dev",
        title: "Mobile App Development",
        slug: "app-development",
        description: "Master modern mobile engineering: Android with Kotlin & Jetpack Compose, cross-platform Flutter & React Native, state management, Firebase cloud services, offline Room/SQLite storage, and production Google Play & Apple App Store deployment.",
        category: "Development",
        branch: "Computer Science & Engineering",
        targetAudience: "Engineering Students & Aspiring Mobile Software Engineers",
        icon: "Smartphone",
      },
    });
    console.log("Created course_app_dev (slug: app-development)");
  } else {
    console.log("Course course_app_dev already exists");
  }

  // 3. Modules & Topics Definition
  const modulesData = [
    {
      title: "1. Android & Mobile Architecture Foundations",
      order: 1,
      topics: [
        {
          title: "Kotlin & Android Core Architecture",
          slug: "kotlin-android",
          order: 1,
          description: "Kotlin fundamentals, null safety, Android Activity & Fragment lifecycles, and Coroutines for background tasks.",
          estimatedTime: "45 mins",
          notesContent: `# Kotlin & Android Core Architecture

## 1. Kotlin Language Essentials for Android
Kotlin is the official, preferred language for Android development designated by Google.

### Key Features
- **Null Safety**: By default, references cannot be null (val s: String = null causes a compile-time error). Use nullable types explicitly: val s: String? = null. Safe call operator: s?.length and Elvis operator: val len = s?.length ?: 0.
- **Data Classes**: Automatically generate equals(), hashCode(), toString(), and copy().
- **Coroutines**: Lightweight concurrency framework enabling non-blocking asynchronous programming on Dispatchers.IO and Dispatchers.Main.

## 2. Android Lifecycle Architecture
The Activity lifecycle consists of distinct callback states:
1. onCreate(): Initialize components, set layout or Compose hierarchy.
2. onStart(): UI becomes visible to the user.
3. onResume(): Activity is in foreground and interactive.
4. onPause(): Activity partially obscured (e.g., dialog, multi-window mode).
5. onStop(): Activity no longer visible. Free heavy resources.
6. onDestroy(): Final cleanup before destruction.
`,
          video: {
            title: "Kotlin for Android Development Full Course",
            youtubeUrl: "https://www.youtube.com/watch?v=F9UC9DY-vIU",
            duration: "35 min",
            channel: "freeCodeCamp / Philipp Lackner",
            description: "Deep dive into Kotlin syntax, Coroutines, and Android Activity lifecycle management.",
            learningObjective: "Master Kotlin null safety, coroutines, and Android Activity lifecycle states.",
          },
          questions: [
            {
              questionText: "What mechanism does Kotlin utilize to prevent NullPointerExceptions at compile-time?",
              optionA: "Automatic garbage collector checkpoints.",
              optionB: "Distinct type declarations distinguishing nullable types (T?) from non-nullable types (T).",
              optionC: "Wrapping every variable in a Java Optional class at runtime.",
              optionD: "Forcing all variables to be global constants.",
              correctAnswer: "B",
              explanation: "Kotlin's type system differentiates between references that can hold null (T?) and those that cannot (T), catching potential null pointer errors at compile time.",
              difficulty: "BEGINNER",
            },
            {
              questionText: "In the Android Activity lifecycle, which callback represents the moment when the app enters the foreground and receives user input?",
              optionA: "onCreate()",
              optionB: "onStart()",
              optionC: "onResume()",
              optionD: "onPause()",
              correctAnswer: "C",
              explanation: "onResume() is invoked when the activity starts interacting with the user, placing it at the top of the activity stack.",
              difficulty: "BEGINNER",
            },
            {
              questionText: "Which Kotlin Coroutine dispatcher should be chosen when executing heavy disk I/O or network API requests?",
              optionA: "Dispatchers.Main",
              optionB: "Dispatchers.IO",
              optionC: "Dispatchers.Unconfined",
              optionD: "Dispatchers.Default for all network calls",
              correctAnswer: "B",
              explanation: "Dispatchers.IO is specifically optimized for offloading blocking I/O tasks like network socket calls and database reads/writes from the main thread.",
              difficulty: "MEDIUM",
            },
            {
              questionText: "Why is viewModelScope preferred over GlobalScope for launching coroutines in Android ViewModels?",
              optionA: "Because GlobalScope consumes more battery.",
              optionB: "Because viewModelScope automatically cancels coroutines when the ViewModel is cleared, preventing memory leaks and orphaned tasks.",
              optionC: "Because GlobalScope only supports single-threaded operations.",
              optionD: "Because viewModelScope compiles directly to C++ binaries.",
              correctAnswer: "B",
              explanation: "viewModelScope is tied to the ViewModel lifecycle; when the ViewModel is destroyed, any running coroutines in viewModelScope are cleanly cancelled.",
              difficulty: "MEDIUM",
            },
          ],
        },
        {
          title: "Modern Android UI with Jetpack Compose",
          slug: "android-compose",
          order: 2,
          description: "Declarative UI layout, State Hoisting, Recomposition, Material 3 Design, and Animations.",
          estimatedTime: "50 mins",
          notesContent: `# Modern Android UI with Jetpack Compose

## 1. Declarative vs Imperative UI
Jetpack Compose is Android's modern toolkit for building native UI without XML. Instead of mutating Views imperatively, UI is described as a function of state.

## 2. State & Recomposition
Recomposition is the process of calling composable functions again when their input state changes.
- remember { mutableStateOf(0) }: Preserves state across recompositions within a single Composable.
- rememberSaveable: Preserves state across configuration changes (such as screen orientation rotations).
- State Hoisting: Moving state to a caller to make components stateless and testable.
`,
          video: {
            title: "Jetpack Compose Crash Course for Android",
            youtubeUrl: "https://www.youtube.com/watch?v=D3nhzxce6ic",
            duration: "40 min",
            channel: "Android Developers",
            description: "Understand declarative UI, recomposition cycles, state hoisting, and Material 3.",
            learningObjective: "Build reactive UI layouts using Jetpack Compose and state hoisting.",
          },
          questions: [
            {
              questionText: "What occurs during 'Recomposition' in Jetpack Compose?",
              optionA: "The entire application APK is recompiled and reinstalled.",
              optionB: "Compose re-executes composable functions whose observed state has changed to emit updated UI.",
              optionC: "The XML layout engine converts layouts into Java Bytecode.",
              optionD: "Android OS restarts the foreground Activity.",
              correctAnswer: "B",
              explanation: "Recomposition calls the composables whose inputs/state changed, skipping those whose inputs remained identical (intelligent skipping).",
              difficulty: "MEDIUM",
            },
            {
              questionText: "Which delegate should be used to retain UI state across device configuration changes (e.g., screen rotation) in Compose?",
              optionA: "remember",
              optionB: "rememberSaveable",
              optionC: "val state = 0",
              optionD: "static StateHolder",
              correctAnswer: "B",
              explanation: "rememberSaveable saves state in a Bundle across configuration changes and process death.",
              difficulty: "MEDIUM",
            },
            {
              questionText: "What is the core benefit of the 'State Hoisting' architectural pattern in Compose?",
              optionA: "It increases GPU rendering memory consumption.",
              optionB: "It makes UI components stateless, easily reusable, and simpler to unit test.",
              optionC: "It eliminates the need for Android Coroutines.",
              optionD: "It allows XML layouts to interact directly with Compose.",
              correctAnswer: "B",
              explanation: "State hoisting decouples state storage from UI presentation, creating single-source-of-truth composables that are predictable and easy to preview/test.",
              difficulty: "HARD",
            },
          ],
        },
      ],
    },
    {
      title: "2. Modern Cross-Platform Frameworks",
      order: 2,
      topics: [
        {
          title: "Flutter Framework & Dart Essentials",
          slug: "flutter-dart",
          order: 3,
          description: "Dart language features, Flutter widget tree (Stateless vs Stateful), and cross-platform high-fps rendering.",
          estimatedTime: "50 mins",
          notesContent: `# Flutter Framework & Dart Essentials

## 1. The Flutter Architecture
Flutter renders directly to the canvas using Impeller (and Skia), bypassing OEM platform widgets. This guarantees pixel-perfect consistency across iOS and Android at 60/120 FPS.

## 2. The Everything-is-a-Widget Philosophy
- StatelessWidget: Immutable UI that depends solely on configuration arguments passed to its constructor.
- StatefulWidget: Stores mutable state inside an associated State object. Triggers UI re-render via setState().
`,
          video: {
            title: "Flutter & Dart Full Course for Beginners",
            youtubeUrl: "https://www.youtube.com/watch?v=x0uinJvhNxI",
            duration: "45 min",
            channel: "freeCodeCamp",
            description: "Learn Flutter widget trees, StatelessWidget vs StatefulWidget, and layout fundamentals.",
            learningObjective: "Understand Flutter's widget architecture and state lifecycle.",
          },
          questions: [
            {
              questionText: "How does Flutter achieve consistent 60/120 FPS rendering across both iOS and Android?",
              optionA: "By translating Dart code into JavaScript running in an embedded WebView.",
              optionB: "By compiling to native machine code and rendering directly via its own graphics engine (Impeller/Skia).",
              optionC: "By using native HTML5 Canvas elements.",
              optionD: "By streaming pre-rendered video frames from a cloud server.",
              correctAnswer: "B",
              explanation: "Flutter does not rely on platform OEM UI widgets or WebViews; it compiles ahead-of-time (AOT) to native ARM binaries and paints directly onto the screen.",
              difficulty: "BEGINNER",
            },
            {
              questionText: "In Flutter, what method must be called to notify the framework that internal state has changed and triggers a build() re-run?",
              optionA: "updateView()",
              optionB: "setState()",
              optionC: "notifyDataSetChanged()",
              optionD: "forceRender()",
              correctAnswer: "B",
              explanation: "Calling setState() flags the State object as dirty and schedules a rebuild of the widget subtree.",
              difficulty: "BEGINNER",
            },
            {
              questionText: "What is the difference between Hot Reload and Hot Restart in Flutter development?",
              optionA: "Hot Reload keeps app state intact while injecting new code; Hot Restart destroys state and restarts the app.",
              optionB: "Hot Reload recompiles C++ engine code; Hot Restart updates Dart files.",
              optionC: "Hot Reload only works on iOS simulators; Hot Restart works on Android devices.",
              optionD: "There is no difference.",
              correctAnswer: "A",
              explanation: "Hot Reload preserves variable values and navigation stack state while swapping in new widget code, whereas Hot Restart resets the Dart VM state to the initial root widget.",
              difficulty: "MEDIUM",
            },
          ],
        },
        {
          title: "React Native & Native Mobile Components",
          slug: "react-native",
          order: 4,
          description: "React Native architecture, New Architecture (Fabric & TurboModules), JSX styling, and FlatList optimization.",
          estimatedTime: "55 mins",
          notesContent: `# React Native & Native Mobile Components

## 1. React Native Architecture
React Native allows developers to use React patterns to render true native platform views.

### New Architecture (Fabric & TurboModules)
- Fabric (New Renderer): Replaces the old asynchronous JSON message bridge with synchronous JSI (JavaScript Interface), allowing direct C++ bindings between JavaScript and host platform threads.
- TurboModules: Lazy-loads native modules on demand via JSI instead of initializing all native modules at application startup.

## 2. High-Performance Lists
Use FlatList rather than ScrollView for rendering long collections to virtualize and recycle off-screen views.
`,
          video: {
            title: "React Native Crash Course 2026",
            youtubeUrl: "https://www.youtube.com/watch?v=0-S5a0eXPoc",
            duration: "42 min",
            channel: "Traversy Media",
            description: "Understand React Native core components, styling with StyleSheet, and the modern JSI architecture.",
            learningObjective: "Master React Native native component mapping and FlatList optimization.",
          },
          questions: [
            {
              questionText: "What is the primary advantage of the JavaScript Interface (JSI) in React Native's New Architecture?",
              optionA: "It requires all JavaScript to run on the UI main thread.",
              optionB: "It enables JavaScript to hold direct references to C++ host objects, eliminating asynchronous JSON serialization over the bridge.",
              optionC: "It converts React Native into a Flutter app.",
              optionD: "It removes the need for React hooks.",
              correctAnswer: "B",
              explanation: "JSI allows JavaScript and C++ to interact directly and synchronously without the overhead of serializing/deserializing JSON messages across a bridge.",
              difficulty: "HARD",
            },
            {
              questionText: "Why should a developer use FlatList instead of ScrollView when displaying an unbounded list of items?",
              optionA: "ScrollView crashes on Android devices.",
              optionB: "FlatList virtualizes and recycles off-screen items, preventing memory bloat and UI frame drops.",
              optionC: "FlatList automatically uploads data to the cloud.",
              optionD: "ScrollView does not support touch interactions.",
              correctAnswer: "B",
              explanation: "ScrollView renders all child components simultaneously into memory, causing severe performance degradation, while FlatList only renders items in the current window viewport.",
              difficulty: "BEGINNER",
            },
          ],
        },
      ],
    },
    {
      title: "3. Mobile Backend, APIs & Offline Architecture",
      order: 3,
      topics: [
        {
          title: "Mobile State Management (Riverpod & Redux)",
          slug: "mobile-state-management",
          order: 5,
          description: "Unidirectional data flow, state immutability, Flutter Riverpod/Bloc patterns, and Redux Toolkit for React Native.",
          estimatedTime: "50 mins",
          notesContent: `# Mobile State Management (Riverpod & Redux)

## 1. Why Dedicated State Management?
As mobile applications grow, passing callbacks and props through dozens of nested screen widgets leads to tight coupling ('prop drilling') and unpredictable UI bugs.

## 2. Riverpod in Flutter
Riverpod is a compile-safe, unidirectional reactive state caching library that catches errors at compile time without relying on BuildContext.

## 3. Redux Toolkit in React Native
- Store: Single source of truth.
- Actions: Declarative payloads describing what occurred.
- Reducers: Pure functions computing the next immutable state.
`,
          video: {
            title: "Mobile App State Management Architecture",
            youtubeUrl: "https://www.youtube.com/watch?v=x0uinJvhNxI",
            duration: "30 min",
            channel: "Mobile Dev Masters",
            description: "Mastering complex state management with Riverpod, Bloc, and Redux Toolkit.",
            learningObjective: "Implement clean unidirectional state architectures in mobile applications.",
          },
          questions: [
            {
              questionText: "What is the core rule of state mutations in Redux and unidirectional state architectures?",
              optionA: "State must be mutated directly by reference to optimize speed.",
              optionB: "State is immutable; any modification must produce a new state object via pure reducer functions.",
              optionC: "Reducers must execute asynchronous network calls directly.",
              optionD: "State must be saved as XML on the device.",
              correctAnswer: "B",
              explanation: "Unidirectional state management enforces immutable state updates through pure functions, making state transitions predictable, trace-able, and testable.",
              difficulty: "MEDIUM",
            },
            {
              questionText: "What compile-time advantage does Flutter's Riverpod have over Provider?",
              optionA: "Riverpod is written in pure C++.",
              optionB: "Riverpod does not depend on the BuildContext to declare or read providers, preventing ProviderNotFoundExceptions at runtime.",
              optionC: "Riverpod eliminates the need for Dart classes.",
              optionD: "Riverpod only works with Firebase.",
              correctAnswer: "B",
              explanation: "Riverpod is defined globally and independent of the widget tree, catching dependency issues at compile-time rather than throwing ProviderNotFoundException at runtime.",
              difficulty: "HARD",
            },
          ],
        },
        {
          title: "APIs & Firebase Cloud Integration for Apps",
          slug: "firebase-mobile",
          order: 6,
          description: "REST & GraphQL networking, Firebase Auth, Cloud Firestore real-time sync, and Firebase Cloud Messaging (FCM).",
          estimatedTime: "60 mins",
          notesContent: `# APIs & Firebase Cloud Integration for Apps

## 1. Mobile HTTP Networking Best Practices
- Use connection pooling and automatic interceptors (Dio in Flutter, Axios / RTK Query in React Native, Retrofit in Android).
- Always configure strict timeouts to prevent hanging UI during poor network connectivity.
- Handle token refresh flows (JWT 401 response -> trigger refresh endpoint -> retry queued request).

## 2. Firebase Suite for Mobile Applications
- Firebase Authentication: Pre-built OAuth2 providers (Google, Apple, Phone SMS, Email/Password).
- Cloud Firestore: NoSQL document-oriented cloud database featuring built-in offline caching and real-time snapshot listeners.
- Firebase Cloud Messaging (FCM): Push notifications infrastructure delivering alerts to iOS and Android.
`,
          video: {
            title: "Firebase & Mobile API Integration Guide",
            youtubeUrl: "https://www.youtube.com/watch?v=9zdvmgGgxv0",
            duration: "38 min",
            channel: "Firebase / Google Developers",
            description: "How to integrate Firebase Auth, Cloud Firestore, and push notifications with FCM.",
            learningObjective: "Integrate Firebase authentication, Firestore sync, and push notifications in mobile apps.",
          },
          questions: [
            {
              questionText: "How does Cloud Firestore handle database operations when an Android or iOS device loses internet connectivity?",
              optionA: "It immediately throws an unhandled fatal network exception.",
              optionB: "It transparently writes changes to a local on-device SQLite/leveldb cache and synchronizes changes once network connectivity is restored.",
              optionC: "It deletes the local app database to prevent data discrepancies.",
              optionD: "It stalls the UI until 5G is re-established.",
              correctAnswer: "B",
              explanation: "Firestore's mobile SDKs provide built-in offline persistence by queuing local writes and resolving conflicting changes upon reconnection.",
              difficulty: "BEGINNER",
            },
            {
              questionText: "What service does Firebase Cloud Messaging (FCM) use to deliver push notifications to iOS devices?",
              optionA: "Apple Push Notification service (APNs)",
              optionB: "Google Play Services",
              optionC: "SMS Gateway",
              optionD: "WebSockets fallback",
              correctAnswer: "A",
              explanation: "On iOS, FCM acts as a routing abstraction that delegates message delivery to Apple's native APNs infrastructure.",
              difficulty: "MEDIUM",
            },
          ],
        },
        {
          title: "Mobile Offline Storage, Room & SQLite",
          slug: "mobile-offline-storage",
          order: 7,
          description: "Offline-first application architecture, Room persistence library, SQLite indexes, and cache invalidation policies.",
          estimatedTime: "50 mins",
          notesContent: `# Mobile Offline Storage, Room & SQLite

## 1. Offline-First Architecture
An offline-first mobile app uses local disk storage as the Single Source of Truth for the UI. Remote APIs act solely as synchronization endpoints.

## 2. Android Room Persistence Library
Room is an abstraction layer over SQLite that provides compile-time verification of raw SQL queries and native reactive support.
`,
          video: {
            title: "Android Room Database & Offline Caching",
            youtubeUrl: "https://www.youtube.com/watch?v=lwAvI3WDXgk",
            duration: "36 min",
            channel: "Philipp Lackner",
            description: "Complete guide to Room DB, DAOs, SQLite migrations, and offline-first repositories.",
            learningObjective: "Implement offline-first persistent storage using Room DB and SQLite.",
          },
          questions: [
            {
              questionText: "What is the primary advantage of Android Room over raw SQLiteOpenHelper?",
              optionA: "Room compresses image files automatically.",
              optionB: "Room validates SQL queries at compile time and eliminates boilerplate cursor parsing.",
              optionC: "Room runs in the cloud rather than on-device.",
              optionD: "Room does not support relationships.",
              correctAnswer: "B",
              explanation: "Room verifies SQL syntax and return types against your data schema at compile time, eliminating runtime crashes caused by typos in SQL queries.",
              difficulty: "MEDIUM",
            },
            {
              questionText: "In an offline-first mobile design pattern, what serves as the Single Source of Truth for the UI?",
              optionA: "The remote cloud database exclusively.",
              optionB: "The local on-device database (e.g. Room/SQLite).",
              optionC: "The phone's clipboard.",
              optionD: "A WebSocket stream.",
              correctAnswer: "B",
              explanation: "In offline-first apps, UI views observe the local database. The network layer updates the local database in the background, which in turn automatically emits changes to the UI.",
              difficulty: "BEGINNER",
            },
          ],
        },
      ],
    },
    {
      title: "4. Mobile UI/UX & App Store Deployment",
      order: 4,
      topics: [
        {
          title: "App Deployment (Google Play Store & App Store)",
          slug: "app-deployment",
          order: 8,
          description: "Android App Bundles (.aab), Keystore signing, App Store Connect, iOS provisioning profiles, Fastlane CI/CD, and review guidelines.",
          estimatedTime: "50 mins",
          notesContent: `# App Deployment (Google Play Store & App Store)

## 1. Android Release Process (Google Play Console)
1. Android App Bundle (.aab): Google Play's publishing format that uses dynamic feature delivery and generates device-specific APKs.
2. App Signing: Configure Play App Signing so Google securely holds the master app signing key.

## 2. iOS Release Process (Apple App Store)
1. Certificates & Provisioning: Distribution Certificate and Provisioning Profile.
2. TestFlight: Beta testing program supporting up to 10,000 external testers before public launch.

## 3. Automated CI/CD with Fastlane
Fastlane automates building, screenshot generation, and uploading binaries to TestFlight and Google Play Internal Track.
`,
          video: {
            title: "Publishing Your App to Google Play Store & Apple App Store",
            youtubeUrl: "https://www.youtube.com/watch?v=f9vT8T_oX2s",
            duration: "32 min",
            channel: "Firebase & Android Devs",
            description: "Step-by-step walkthrough of signing keystores, App Store Connect, and store approvals.",
            learningObjective: "Master release engineering, store submission policies, and CI/CD with Fastlane.",
          },
          questions: [
            {
              questionText: "Why did Google transition mandatory app submissions from APKs to Android App Bundles (.aab)?",
              optionA: "Because App Bundles cannot be decompiled by hackers.",
              optionB: "Because App Bundles allow Google Play to generate tailored, optimized APKs per device configuration, drastically reducing download sizes.",
              optionC: "Because APKs no longer support Kotlin.",
              optionD: "Because App Bundles only contain HTML files.",
              correctAnswer: "B",
              explanation: "The Android App Bundle format lets Google Play's Dynamic Delivery create split APKs containing only the device's specific screen density, language, and CPU architecture.",
              difficulty: "BEGINNER",
            },
            {
              questionText: "What is the function of Fastlane in modern mobile deployment pipelines?",
              optionA: "It compiles Swift code into Java automatically.",
              optionB: "It is an open-source automation tool that streamlines mobile CI/CD, handling code signing, binary builds, and store releases.",
              optionC: "It is an alternative Android emulator.",
              optionD: "It is a cloud database designed by Apple.",
              correctAnswer: "B",
              explanation: "Fastlane provides declarative Ruby/lane scripts to automate tedious release steps like taking screenshots, provisioning profiles, code signing, and binary uploads.",
              difficulty: "MEDIUM",
            },
            {
              questionText: "What happens if a developer permanently loses the private upload keystore used to sign their Google Play app when Play App Signing is enabled?",
              optionA: "The app is deleted from the Google Play Store forever.",
              optionB: "The developer can contact Google Play Support to register a new upload key, because Google manages the master app signing key.",
              optionC: "All existing user accounts are immediately banned.",
              optionD: "The app must be rewritten in Objective-C.",
              correctAnswer: "B",
              explanation: "With Google Play App Signing, Google stores the root app signing key. If the local upload key is lost, you can submit a new upload key to Google without abandoning the app ID.",
              difficulty: "HARD",
            },
          ],
        },
      ],
    },
  ];

  let prevTopicId = null;

  for (const modData of modulesData) {
    let mod = await prisma.courseModule.findFirst({
      where: { courseId: appCourse.id, order: modData.order },
    });

    if (!mod) {
      mod = await prisma.courseModule.create({
        data: {
          courseId: appCourse.id,
          title: modData.title,
          order: modData.order,
        },
      });
      console.log(`Created module: ${mod.title}`);
    }

    for (const tData of modData.topics) {
      let topic = await prisma.topic.findUnique({
        where: { slug: tData.slug },
      });

      if (!topic) {
        topic = await prisma.topic.create({
          data: {
            moduleId: mod.id,
            title: tData.title,
            slug: tData.slug,
            order: tData.order,
            description: tData.description,
            estimatedTime: tData.estimatedTime,
            notesContent: tData.notesContent,
            prerequisiteId: prevTopicId,
          },
        });
        console.log(`Created topic: ${topic.title} (slug: ${topic.slug})`);
      }
      prevTopicId = topic.id;

      // Seed Video
      const existingVideo = await prisma.topicVideo.findFirst({
        where: { topicId: topic.id },
      });
      if (!existingVideo && tData.video) {
        await prisma.topicVideo.create({
          data: {
            topicId: topic.id,
            title: tData.video.title,
            youtubeUrl: tData.video.youtubeUrl,
            duration: tData.video.duration,
            channel: tData.video.channel,
            description: tData.video.description,
            learningObjective: tData.video.learningObjective,
            order: 1,
          },
        });
        console.log(`Attached video for topic: ${topic.title}`);
      }

      // Seed Quiz & Questions
      let quiz = await prisma.quiz.findFirst({
        where: { topicId: topic.id },
      });
      if (!quiz) {
        quiz = await prisma.quiz.create({
          data: {
            id: `quiz_${topic.slug}`,
            title: `${topic.title} Mastery Assessment`,
            description: `Adaptive quiz evaluating understanding of ${topic.title}.`,
            topicId: topic.id,
            topic: topic.title,
            competencyId: comp.id,
            passPercentage: 80.0,
            masteryThreshold: 90.0,
            relearnThreshold: 60.0,
            isPublished: true,
          },
        });
        console.log(`Created quiz: ${quiz.title}`);
      }

      // Add Questions to Quiz
      const existingQuestions = await prisma.quizQuestion.findMany({
        where: { quizId: quiz.id },
      });
      if (existingQuestions.length === 0 && tData.questions) {
        for (const q of tData.questions) {
          await prisma.quizQuestion.create({
            data: {
              quizId: quiz.id,
              competencyId: comp.id,
              topic: topic.title,
              questionText: q.questionText,
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              difficulty: q.difficulty,
              sourceReference: `Mobile Engineering Mastery Syllabus (${topic.title})`,
              status: "APPROVED",
              qualityScore: 100.0,
            },
          });
        }
        console.log(`Inserted ${tData.questions.length} questions for ${topic.title}`);
      }
    }
  }

  console.log("Successfully seeded Mobile App Development Course, Modules, Topics, Videos & Quizzes!");
}

seedAppDevelopmentCourse()
  .catch((e) => {
    console.error("Error seeding app development course:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
