export type EventStatus = "active" | "cancelled" | "completed";

export type EventCategory =
    | "conference"
    | "workshop"
    | "meetup"
    | "seminar"
    | "general";


export const EVENT_STATUSES: EventStatus[] = ["active", "cancelled", "completed"];

export const EVENT_CATEGORIES: EventCategory[] = [
    "conference",
    "workshop",
    "meetup",
    "seminar",
    "general",
];


export interface Event {
    id: string;
    name: string;
    date: Date;
    capacity: number;
    registrationCount: number;
    status: EventStatus;
    category: EventCategory;
    createdAt: Date;
    updatedAt: Date;
}


export type CreateEventInput = Omit<Event, "id" | "createdAt" | "updatedAt">;


export type UpdateEventInput = Partial<CreateEventInput>;