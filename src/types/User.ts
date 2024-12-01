import { Venue } from './Venue';

type AvatarBanner = {
    url: string;
    alt: string;
};

export type User = {
    name: string;
    email: string;
    bio: string;
    avatar?: AvatarBanner;
    banner?: AvatarBanner;
};

export type UserProfileResponse = {
    data: User & {
        venueManager: boolean;
        venues?: Venue[];
        bookings?: {
            id: string;
            dateFrom: string;
            dateTo: string;
            guests: number;
            venue?: Venue;
        }[];
        _count?: {
            venues: number;
            bookings: number;
        };
    };
};

