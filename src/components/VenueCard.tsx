import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, CardMedia, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { Venue } from '../types/Venue'
import MoreVertIcon from '@mui/icons-material/MoreVert';

type VenueCardProps = {
    venue: Venue;
    onDelete?: (venueId: string) => void;
    onViewBookings?: (venueId: string) => void;
    onEdit?: (venueId: string) => void;
};

const VenueCard: React.FC<VenueCardProps> = ({ venue, onDelete, onViewBookings, onEdit }) => {
    const defaultImage = 'https://placehold.co/400x200?text=No+Image+Available';

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    return (
        <Card variant="outlined" sx={{ mb: 2, boxShadow: 2, borderRadius: '10px' }}>
            {/* Venue image */}
            <CardMedia
                component="img"
                height="200"
                image={venue.media?.length > 0 ? venue.media[0].url : defaultImage}
                alt={venue.media?.[0].alt || 'Placeholder image for venue'}
            />
            <CardContent>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {venue.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {venue.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button color="primary" component={Link} to={`/venues/${venue.id}`} variant="contained">
                        View Details
                    </Button>

                    {/* Conditionally render the action button if callbacks are provided */}
                    {(onDelete || onViewBookings || onEdit) && (
                        <>
                            <IconButton onClick={handleMenuOpen}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{ style: { maxHeight: 200 } }}
                            >
                                {onViewBookings && (
                                    <MenuItem onClick={() => { handleMenuClose(); onViewBookings(venue.id); }}>
                                    View Bookings
                                    </MenuItem>
                                )}
                                {onEdit && (
                                    <MenuItem onClick={() =>{
                                        handleMenuClose();
                                        onEdit(venue.id);
                                    }}>
                                        Edit Venue
                                    </MenuItem>
                                )}
                                {onDelete && (
                                    <MenuItem onClick={() => { handleMenuClose(); onDelete(venue.id); }} sx={{ color: 'error.main' }}>
                                        Delete Venue
                                    </MenuItem>
                                )}
                            </Menu>
                        </>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default VenueCard;