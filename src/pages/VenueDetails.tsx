import React from 'react';
import { useParams } from 'react-router-dom';
import { Venue } from '../types/Venue';
import { getVenueById } from '../services/venueService';

const VenueDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [venue, setVenue] = React.useState<Venue | null>(null);

    React.useEffect(() => {
        if (id) {
            getVenueById(id).then((data) => setVenue(data));
        }
    }, [id]);

    if (!venue) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{venue.name}</h1>
            <p>{venue.description}</p>
        </div>
    );
};

export default VenueDetails;