import "server-only";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getServiceAccountJson() {
  const filePath = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH;
  if (filePath) {
    const absolutePath = resolve(process.cwd(), filePath);
    return readFileSync(absolutePath, "utf8");
  }

  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      "Missing FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH or FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY",
    );
  }
  return raw;
}

function getServiceAccountFromEnv() {
  const parsed = JSON.parse(getServiceAccountJson());
  const projectId = parsed.project_id || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = parsed.client_email;
  const privateKey = parsed.private_key?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Invalid FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY");
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

export function getFirebaseAdminApp() {
  if (!getApps().length) {
    const credential = cert(getServiceAccountFromEnv());
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
