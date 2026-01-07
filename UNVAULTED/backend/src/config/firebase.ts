import admin from "firebase-admin";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const serviceAccountPath = path.resolve(
  __dirname,
  "../../",
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH!
);

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

export const db = admin.firestore();
export { admin };