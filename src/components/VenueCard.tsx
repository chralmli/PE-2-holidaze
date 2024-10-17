import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Venue } from '../types/Venue'

type VenueCardProps = {
    venue: Venue;
};

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {venue.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {venue.description}
                </Typography>
                <Button color="inherit" component={Link} to={`/venues/${venue.id}`} variant="contained">
                    View Details
                </Button>
            </CardContent>
        </Card>
    );
};

export default VenueCard;