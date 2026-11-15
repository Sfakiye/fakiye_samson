import { Timestamp } from "firebase-admin/firestore";
import {
    Event,
    CreateEventInput,
    UpdateEventInput,
} from "../models/eventModel";
import * as firestoreRepository from "../repositories/firestoreRepository";
import { AppError } from "../errors/appError";

export const EVENTS_COLLECTION: string = "events";

const toDate = (value: unknown): Date => {
    if (value instanceof Timestamp) {
        return value.toDate();
    }
    return new Date(value as string | number | Date);
};

const toEvent = (doc: FirebaseFirestore.DocumentSnapshot): Event => {
    const data: FirebaseFirestore.DocumentData = doc.data() ?? {};
    return {
        id: doc.id,
        name: data.name,
        date: toDate(data.date),
        capacity: data.capacity,
        registrationCount: data.registrationCount,
        status: data.status,
        category: data.category,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
    };
};

const serviceError = (action: string, error: unknown): Error => {
    if (error instanceof AppError) {
        return error;
    }
    const message: string = error instanceof Error ? error.message : "Unknown error";
    return new Error(`Failed to ${action}: ${message}`);
};

export const getAllEvents = async (): Promise<Event[]> => {
    try {
        const snapshot: FirebaseFirestore.QuerySnapshot =
            await firestoreRepository.getDocuments(EVENTS_COLLECTION);
        return snapshot.docs.map(toEvent);
    } catch (error: unknown) {
        throw serviceError("retrieve events", error);
    }
};

export const getEventById = async (id: string): Promise<Event | null> => {
    try {
        const doc: FirebaseFirestore.DocumentSnapshot | null =
            await firestoreRepository.getDocumentById(EVENTS_COLLECTION, id);
        return doc ? toEvent(doc) : null;
    } catch (error: unknown) {
        throw serviceError(`retrieve event ${id}`, error);
    }
};

export const createEvent = async (
    eventData: CreateEventInput
): Promise<Event> => {
    try {
        const now: Date = new Date();
        const newEvent: Omit<Event, "id"> = {
            ...eventData,
            createdAt: now,
            updatedAt: now,
        };
        const id: string = await firestoreRepository.createDocument<Event>(
            EVENTS_COLLECTION,
            newEvent
        );
        return { id, ...newEvent };
    } catch (error: unknown) {
        throw serviceError("create event", error);
    }
};

export const updateEvent = async (
    id: string,
    updates: UpdateEventInput
): Promise<Event | null> => {
    try {
        const existing: Event | null = await getEventById(id);
        if (!existing) {
            return null;
        }

        const capacity: number = updates.capacity ?? existing.capacity;
        const registrationCount: number =
            updates.registrationCount ?? existing.registrationCount;
        if (registrationCount > capacity) {
            throw new AppError(
                `Validation error: "registrationCount" must be less than or equal to ref:capacity`
            );
        }

        const changes: UpdateEventInput & { updatedAt: Date } = {
            ...updates,
            updatedAt: new Date(),
        };
        await firestoreRepository.updateDocument<Event>(
            EVENTS_COLLECTION,
            id,
            changes
        );
        return { ...existing, ...changes };
    } catch (error: unknown) {
        throw serviceError(`update event ${id}`, error);
    }
};

export const deleteEvent = async (id: string): Promise<boolean> => {
    try {
        const doc: FirebaseFirestore.DocumentSnapshot | null =
            await firestoreRepository.getDocumentById(EVENTS_COLLECTION, id);
        if (!doc) {
            return false;
        }
        await firestoreRepository.deleteDocument(EVENTS_COLLECTION, id);
        return true;
    } catch (error: unknown) {
        throw serviceError(`delete event ${id}`, error);
    }
};