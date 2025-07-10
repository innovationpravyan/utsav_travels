import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  type Firestore,
  connectFirestoreEmulator,
  terminate,

} from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, type Analytics, isSupported } from "firebase/analytics";
import { getPerformance, type FirebasePerformance } from "firebase/performance";
import { AppError, env, FIREBASE_CONFIG, ERROR_MESSAGES } from "@/utils/utils";

/**
 * Firebase configuration interface
 */
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

/**
 * Validates Firebase configuration
 */
function validateFirebaseConfig(config: FirebaseConfig): void {
  const requiredFields = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];

  for (const field of requiredFields) {
    if (!config[field as keyof FirebaseConfig]) {
      throw new AppError(
          `Firebase configuration missing required field: ${field}`,
          "FIREBASE_CONFIG_ERROR"
      );
    }
  }

  // Validate format
  if (!config.apiKey.startsWith("AIza")) {
    throw new AppError(
        "Invalid Firebase API key format",
        "FIREBASE_CONFIG_ERROR"
    );
  }

  if (!config.projectId.match(/^[a-z0-9-]+$/)) {
    throw new AppError(
        "Invalid Firebase project ID format",
        "FIREBASE_CONFIG_ERROR"
    );
  }
}

/**
 * Firebase services interface
 */
interface FirebaseServices {
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
  analytics: Analytics | null;
  performance: FirebasePerformance | null;
}

/**
 * Initialize Firebase app with error handling
 */
function initializeFirebaseApp(): FirebaseApp {
  try {
    validateFirebaseConfig(FIREBASE_CONFIG);

    // Check if app already exists
    const existingApps = getApps();
    if (existingApps.length > 0) {
      return getApp();
    }

    const app = initializeApp(FIREBASE_CONFIG);

    if (env.isDev) {
      console.log("🔥 Firebase app initialized successfully");
    }

    return app;
  } catch (error) {
    console.error("❌ Failed to initialize Firebase app:", error);
    throw new AppError(
        ERROR_MESSAGES.firebase.init,
        "FIREBASE_INIT_ERROR"
    );
  }
}

/**
 * Initialize Firestore with emulator support
 */
function initializeFirestore(app: FirebaseApp): Firestore {
  try {
    const db = getFirestore(app);

    // Connect to emulator in development if configured
    if (env.isDev && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
      const emulatorHost =
          process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST || "localhost";
      const emulatorPort = parseInt(
          process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || "8080"
      );

      try {
        connectFirestoreEmulator(db, emulatorHost, emulatorPort);
        console.log(
            `🔥 Connected to Firestore emulator at ${emulatorHost}:${emulatorPort}`
        );
      } catch (error) {
        console.warn("⚠️ Failed to connect to Firestore emulator:", error);
      }
    }

    return db;
  } catch (error) {
    console.error("❌ Failed to initialize Firestore:", error);
    throw new AppError(
        ERROR_MESSAGES.firebase.firestore,
        "FIRESTORE_INIT_ERROR"
    );
  }
}

/**
 * Initialize Firebase Analytics (client-side only)
 */
async function initializeAnalytics(
    app: FirebaseApp
): Promise<Analytics | null> {
  if (env.isServer || !FIREBASE_CONFIG.measurementId) {
    return null;
  }

  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("⚠️ Firebase Analytics not supported in this environment");
      return null;
    }

    const analytics = getAnalytics(app);

    if (env.isDev) {
      console.log("📊 Firebase Analytics initialized");
    }

    return analytics;
  } catch (error) {
    console.warn("⚠️ Failed to initialize Firebase Analytics:", error);
    return null;
  }
}

/**
 * Initialize Firebase Performance (client-side only)
 */
function initializePerformance(app: FirebaseApp): FirebasePerformance | null {
  if (env.isServer) {
    return null;
  }

  try {
    const performance = getPerformance(app);

    if (env.isDev) {
      console.log("⚡ Firebase Performance initialized");
    }

    return performance;
  } catch (error) {
    console.warn("⚠️ Failed to initialize Firebase Performance:", error);
    return null;
  }
}

/**
 * Initialize all Firebase services
 */
async function initializeFirebaseServices(): Promise<FirebaseServices> {
  const app = initializeFirebaseApp();
  const db = initializeFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  const analytics = await initializeAnalytics(app);
  const performance = initializePerformance(app);

  return {
    app,
    db,
    auth,
    storage,
    analytics,
    performance,
  };
}

/**
 * Firebase connection manager
 */
export class FirebaseManager {
  private static instance: FirebaseManager;
  private services: FirebaseServices | null = null;
  private isInitialized = false;
  private initPromise: Promise<FirebaseServices> | null = null;

  private constructor() {}

  static getInstance(): FirebaseManager {
    if (!FirebaseManager.instance) {
      FirebaseManager.instance = new FirebaseManager();
    }
    return FirebaseManager.instance;
  }

  async getServices(): Promise<FirebaseServices> {
    if (this.services && this.isInitialized) {
      return this.services;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.initialize();
    return this.initPromise;
  }

  private async initialize(): Promise<FirebaseServices> {
    try {
      this.services = await initializeFirebaseServices();
      this.isInitialized = true;

      if (env.isDev) {
        console.log("🚀 All Firebase services initialized successfully");
      }

      return this.services;
    } catch (error) {
      this.initPromise = null;
      throw error;
    }
  }
  async terminate(): Promise<void> {
    if (!this.services) return;

    try {
      await terminate(this.services.db);
      this.services = null;
      this.isInitialized = false;
      this.initPromise = null;
      console.log("🔚 Firebase services terminated");
    } catch (error) {
      console.error("❌ Failed to terminate Firebase services:", error);
    }
  }
}

// Create singleton instance
const firebaseManager = FirebaseManager.getInstance();

/**
 * Get Firebase services (async)
 */
export async function getFirebaseServices(): Promise<FirebaseServices> {
  return firebaseManager.getServices();
}
export const getFirebaseDb = async (): Promise<Firestore> => {
  const services = await getFirebaseServices();
  return services.db;
};
/**
 * Legacy exports for backward compatibility
 */
let legacyApp: FirebaseApp | null = null;
let legacyDb: Firestore | null = null;

// Initialize legacy exports
(async () => {
  try {
    const services = await getFirebaseServices();
    legacyApp = services.app;
    legacyDb = services.db;
  } catch (error) {
    console.error("Failed to initialize legacy Firebase exports:", error);
  }
})();

export { legacyApp as app, legacyDb as db };

/**
 * Firebase connection utilities
 */
export const firebase = {
  manager: firebaseManager,
  terminate: () => firebaseManager.terminate(),
};

/**
 * Export types
 */
export type { FirebaseConfig, FirebaseServices };