// @ts-ignore
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  type Firestore,
  connectFirestoreEmulator,
  terminate,
} from "firebase/firestore";

/**
 * Firebase configuration - Replace with your actual config
 */
const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDbifj2_jatQIx5GNkiDXAOHmAYOCrnzqo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "utsavtravels-299d5.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "utsavtravels-299d5",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "utsavtravels-299d5.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "841887025085",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:841887025085:web:b663dd26817b4aa849f4d4",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-8S5PS1SVXG",
};

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
}

/**
 * Environment detection
 */
const env = {
  isDev: process.env.NODE_ENV === 'development',
  isServer: typeof window === 'undefined',
  isClient: typeof window !== 'undefined',
};

/**
 * App Error class
 */
class AppError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AppError';
  }
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
 * Firebase services interface (simplified)
 */
interface FirebaseServices {
  app: FirebaseApp;
  db: Firestore;
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
        "Failed to initialize Firebase application",
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
        "Failed to initialize Firestore",
        "FIRESTORE_INIT_ERROR"
    );
  }
}

/**
 * Initialize Firebase services (simplified to only Firestore)
 */
async function initializeFirebaseServices(): Promise<FirebaseServices> {
  const app = initializeFirebaseApp();
  const db = initializeFirestore(app);

  return {
    app,
    db,
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
        console.log("🚀 Firebase services initialized successfully");
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
 * Synchronous exports for cases where you're sure Firebase is initialized
 */
let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;

// Initialize synchronous exports (non-blocking)
getFirebaseServices().then(services => {
  _app = services.app;
  _db = services.db;
}).catch(error => {
  console.error("Failed to initialize Firebase services:", error);
});

// Safe synchronous exports (will throw if not initialized)
export const getDb = (): Firestore => {
  if (!_db) {
    throw new AppError("Firestore not initialized. Use getFirebaseDb() first.", "NOT_INITIALIZED");
  }
  return _db;
};

/**
 * Legacy exports for backward compatibility
 */
export { _app as app, _db as db };

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