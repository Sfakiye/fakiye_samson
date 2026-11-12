import * as eventService from "../src/api/v1/services/eventService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { CreateEventInput, Event } from "../src/api/v1/models/eventModel";

jest.mock("../src/api/v1/repositories/firestoreRepository");

const EVENT_ID: string = "abc123";
const EVENT_DATE: Date = new Date("2025-12-25T09:00:00.000Z");
const CREATED_AT: Date = new Date("2025-12-18T21:24:50.029Z");

const storedEventData: Omit<Event, "id"> = {
    name: "Tech Conference 2025",
    date: EVENT_DATE,
    capacity: 200,
    registrationCount: 50,
    status: "active",
    category: "conference",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
};

const mockDocument = (): FirebaseFirestore.DocumentSnapshot =>
    ({
        id: EVENT_ID,
        exists: true,
        data: (): Omit<Event, "id"> => storedEventData,
    }) as unknown as FirebaseFirestore.DocumentSnapshot;

describe("Event Service", () => {
    describe("getAllEvents", () => {
        it("should return all events mapped from Firestore documents", async () => {
            (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
                docs: [mockDocument()],
            });

            const result: Event[] = await eventService.getAllEvents();

            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("events");
            expect(result).toEqual([{ id: EVENT_ID, ...storedEventData }]);
        });
    });

    describe("getEventById", () => {
        it("should return the event when the document exists", async () => {
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(
                mockDocument()
            );

            const result: Event | null = await eventService.getEventById(EVENT_ID);

            expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith(
                "events",
                EVENT_ID
            );
            expect(result).toEqual({ id: EVENT_ID, ...storedEventData });
        });
    });

    describe("createEvent", () => {
        it("should save the event with timestamps and return it with its new ID", async () => {
            const input: CreateEventInput = {
                name: "Tech Conference 2025",
                date: EVENT_DATE,
                capacity: 200,
                registrationCount: 50,
                status: "active",
                category: "conference",
            };
            (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(
                "newEventId"
            );

            const result: Event = await eventService.createEvent(input);

            expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
                "events",
                expect.objectContaining({
                    ...input,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );
            expect(result.id).toBe("newEventId");
            expect(result.name).toBe("Tech Conference 2025");
        });
    });

    describe("updateEvent", () => {
        it("should update the stored event and return the merged result", async () => {
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(
                mockDocument()
            );
            (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(
                undefined
            );

            const result: Event | null = await eventService.updateEvent(EVENT_ID, {
                capacity: 300,
            });

            expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
                "events",
                EVENT_ID,
                expect.objectContaining({ capacity: 300, updatedAt: expect.any(Date) })
            );
            expect(result?.capacity).toBe(300);
            expect(result?.name).toBe("Tech Conference 2025");
        });
    });

    describe("deleteEvent", () => {
        it("should delete the event and return true when it exists", async () => {
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(
                mockDocument()
            );
            (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
                undefined
            );

            const result: boolean = await eventService.deleteEvent(EVENT_ID);

            expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
                "events",
                EVENT_ID
            );
            expect(result).toBe(true);
        });
    });
});