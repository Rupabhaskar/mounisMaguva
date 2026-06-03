import "server-only";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function readServiceAccountFile(filePath) {
  const absolutePath = resolve(/* turbopackIgnore: true */ process.cwd(), filePath);
  return readFileSync(absolutePath, "utf8");
}

function getServiceAccountFromEnv() {
  const projectId =
    process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }

  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY;
  if (raw) {
    const parsed = JSON.parse(raw);
    return {
      projectId: parsed.project_id || projectId,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key?.replace(/\\n/g, "\n"),
    };
  }

  const filePath = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH;
  if (filePath) {
    const parsed = JSON.parse(readServiceAccountFile(filePath));
    return {
      projectId: parsed.project_id || projectId,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key?.replace(/\\n/g, "\n"),
    };
  }

  throw new Error(
    "Missing Firebase Admin credentials. Set FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY, FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY, or FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH.",
  );
}

function assertServiceAccount(credentials) {
  if (!credentials.projectId || !credentials.clientEmail || !credentials.privateKey) {
    throw new Error("Invalid Firebase Admin service account credentials");
  }
  return credentials;
}

export function getFirebaseAdminApp() {
  if (!getApps().length) {
    const credential = cert(assertServiceAccount(getServiceAccountFromEnv()));
    const storageBucket =
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      process.env.FIREBASE_STORAGE_BUCKET;
    initializeApp({
      credential,
      storageBucket,
    });
  }
  return getApps()[0];
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getFirebaseAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}

export function getFirebaseAdminStorage() {
  return getStorage(getFirebaseAdminApp());
}
