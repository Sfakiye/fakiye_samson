import { db } from "../../../../config/firebaseConfig";
import { FirestoreDataTypes } from "../types/firestore";

interface FieldValuePair {
    fieldName: string;
    fieldValue: FirestoreDataTypes;
}

const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : "Unknown error";

export const runTransaction = async <T>(
    operations: (transaction: FirebaseFirestore.Transaction) => Promise<T>
): Promise<T> => {
    try {
        return await db.runTransaction(operations);
    } catch (error: unknown) {
        throw new Error(`Transaction failed: ${getErrorMessage(error)}`, {
            cause: error,
        });
    }
};

export const createDocument = async <T>(
    collectionName: string,
    data: Partial<T>,
    id?: string
): Promise<string> => {
    try {
        let docRef: FirebaseFirestore.DocumentReference;
        if (id) {
            docRef = db.collection(collectionName).doc(id);
            await docRef.set(data);
        } else {
            docRef = await db.collection(collectionName).add(data);
        }
        return docRef.id;
    } catch (error: unknown) {
        throw new Error(
            `Failed to create document in ${collectionName}: ${getErrorMessage(error)}`,
            { cause: error }
        );
    }
};

export const getDocuments = async (
    collectionName: string
): Promise<FirebaseFirestore.QuerySnapshot> => {
    try {
        return await db.collection(collectionName).get();
    } catch (error: unknown) {
        throw new Error(
            `Failed to fetch documents from ${collectionName}: ${getErrorMessage(error)}`,
            { cause: error }
        );
    }
};

export const getDocumentById = async (
    collectionName: string,
    id: string
): Promise<FirebaseFirestore.DocumentSnapshot | null> => {
    try {
        const doc: FirebaseFirestore.DocumentSnapshot = await db
            .collection(collectionName)
            .doc(id)
            .get();
        return doc?.exists ? doc : null;
    } catch (error: unknown) {
        throw new Error(
            `Failed to fetch document ${id} from ${collectionName}: ${getErrorMessage(error)}`,
            { cause: error }
        );
    }
};

export const updateDocument = async <T>(
    collectionName: string,
    id: string,
    data: Partial<T>
): Promise<void> => {
    try {
        await db.collection(collectionName).doc(id).update(data);
    } catch (error: unknown) {
        throw new Error(
            `Failed to update document ${id} in ${collectionName}: ${getErrorMessage(error)}`,
            { cause: error }
        );
    }
};

export const deleteDocument = async (
    collectionName: string,
    id: string,
    transaction?: FirebaseFirestore.Transaction
): Promise<void> => {
    try {
        const docRef: FirebaseFirestore.DocumentReference = db
            .collection(collectionName)
            .doc(id);
        if (transaction) {
            transaction.delete(docRef);
        } else {
            await docRef.delete();
        }
    } catch (error: unknown) {
        throw new Error(
            `Failed to delete document ${id} from ${collectionName}: ${getErrorMessage(error)}`,
            { cause: error }
        );
    }
};

export const deleteDocumentsByFieldValues = async (
    collectionName: string,
    fieldValuePairs: FieldValuePair[],
    transaction?: FirebaseFirestore.Transaction
): Promise<void> => {
    try {
        let query: FirebaseFirestore.Query = db.collection(collectionName);
        fieldValuePairs.forEach(({ fieldName, fieldValue }: FieldValuePair) => {
            query = query.where(fieldName, "==", fieldValue);
        });

        let snapshot: FirebaseFirestore.QuerySnapshot;
        if (transaction) {
            snapshot = await transaction.get(query);
            snapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
                transaction.delete(doc.ref);
            });
        } else {
            snapshot = await query.get();
            const batch: FirebaseFirestore.WriteBatch = db.batch();
            snapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }
    } catch (error: unknown) {
        const fieldValueString: string = fieldValuePairs
            .map(({ fieldName, fieldValue }: FieldValuePair) => `${fieldName} == ${fieldValue}`)
            .join(" AND ");
        throw new Error(
            `Failed to delete documents from ${collectionName} where ${fieldValueString}: ${getErrorMessage(error)}`,
            { cause: error }
        );
    }
};
