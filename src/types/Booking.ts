import { Venue } from './Venue';
export interface Booking {
    id: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    created?: string;
    updated?: string;
    venue?: Venue;
    customer?: {
        name: string;
        email: string;
        bio: string;
        avatar?: {
            url: string;
            alt?: string;
        };
        banner?: {
            url: string;
            alt?: string;
        };
    };
};

export type BookingRequest = {
    dateFrom: string;
    dateTo: string;
    guests: number;
    venueId: string;
};

export type BookingResponse = Booking;