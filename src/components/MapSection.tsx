import React,{ useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L, { LatLngTuple, DivIcon } from 'leaflet';
import { Venue } from '../types/Venue';
import { Typography, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';

interface MapSectionProps {
  venues: Venue[];
  hoveredVenueId: string | null;
  mapLoading: boolean;
  onMapUpdate?: (bounds: L.LatLngBounds, center: L.LatLng, zoom: number) => void;
}

const StyledMapOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const createMarkerIcon = (price: number, isHovered: boolean): DivIcon => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background: ${isHovered ? '#34e89e' : 'white'};
        padding: 8px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        border: 2px solid ${isHovered ? '#2bc67f' : 'white'};
      ">
        <span style="
          font-weight: bold;
          color: ${isHovered? 'white' : '#00000'};
        ">
          ${price.toLocaleString('no-NO')} NOK
        </span>
      </div>
      `,
      iconSize: [60, 40],
      iconAnchor: [30, 40],
  });
};

const MapEventsHandler: React.FC<{ onMapUpdate?: (bounds: L.LatLngBounds, center: L.LatLng, zoom: number) => void}> = ({
  onMapUpdate
}) => {
  const map = useMap();
  const [debounceTimeout, setDebounceTimeout] = React.useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!map || !onMapUpdate) return;

    const handleMapChange = () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      const timeout = setTimeout(() => {
        onMapUpdate(map.getBounds(), map.getCenter(), map.getZoom());
      }, 300);

      setDebounceTimeout(timeout);
    };

    map.on('moveend', handleMapChange);
    map.on('zoomend', handleMapChange);

    // Initial map state
    onMapUpdate(map.getBounds(), map.getCenter(), map.getZoom());

    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      map.off('moveend', handleMapChange);
      map.off('zoomend', handleMapChange);
    };
  }, [map, onMapUpdate, debounceTimeout]);

  return null;
};

const MapSection: React.FC<MapSectionProps> = ({ venues, hoveredVenueId, mapLoading, onMapUpdate }) => {
  const getVenueCoordinates = (venue: Venue): LatLngTuple | null => {
    if (
      venue.location?.lat != null &&
      venue.location?.lng != null &&
      !isNaN(venue.location.lat) &&
      !isNaN(venue.location.lng)
    ) {
      return [venue.location.lat, venue.location.lng];
    }
    return null;
  };

  // Define max bounds that cover a reasonable area of the globe
  const maxBounds: L.LatLngBoundsExpression = [
    [-85, -180],
    [85, 180],
  ];

  const validVenues = useMemo(() =>
    venues.filter(venue => getVenueCoordinates(venue) !== null),
    [venues]
  );

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer 
        center={[63.4305, 10.3951]} 
        zoom={5} 
        minZoom={4} 
        maxZoom={16} 
        style={{ 
          height: '100%', 
          width: '100%' 
          }}
          maxBounds={maxBounds}
          maxBoundsViscosity={1.0}
        >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup>
          {validVenues.map((venue) => {
            const coordinates = getVenueCoordinates(venue);
            if (!coordinates) return null;

            return (
              <Marker
                key={venue.id}
                position={coordinates}
                icon={createMarkerIcon(venue.price, hoveredVenueId === venue.id )}
              >
                <Popup>
                  <Box sx={{ p: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {venue.name}
                    </Typography>
                    <Typography variant="body2">
                      {venue.location.city || 'Unknown City'}, {' '}
                      {venue.location.country || 'Unknown Country'}
                    </Typography>
                    <Typography variant="body2" color="primary.main" mt={1}>
                      {venue.price.toLocaleString('no-NO')} NOK / night
                    </Typography>
                  </Box>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
        <MapEventsHandler onMapUpdate={onMapUpdate} />
      </MapContainer>

      {mapLoading && (
        <StyledMapOverlay>
          <CircularProgress size={24} />
          <Typography variant="body2">Loading venues...</Typography>
        </StyledMapOverlay>
      )}
    </Box>
  );
};


export default MapSection;