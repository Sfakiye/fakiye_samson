import * as fs from "fs";
import * as path from "path";
import { initializeApp, cert, getApps, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

const SERVICE_ACCOUNT_PATH: string = path.resolve(
    __dirname,
    "..",
    "serviceAccountKey.json"
);

/**
 
 * @returns {ServiceAccount} 
 */
const loadServiceAccount = (): ServiceAccount => {
    if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
        throw new Error(
            `Firebase service account key not found at ${SERVICE_ACCOUNT_PATH}`
        );
    }
    return JSON.parse(
        fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf-8")
    ) as ServiceAccount;
};

if (getApps().length === 0) {
    initializeApp({
        credential: cert(loadServiceAccount()),
    });
}

// Firestore instance used by the repository layer
const db: Firestore = getFirestore();

export { db };