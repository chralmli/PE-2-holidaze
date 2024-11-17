import React,{ useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L, { LatLngTuple } from 'leaflet';
import { Venue } from '../types/Venue';
import { Typography, CircularProgress } from '@mui/material';

interface MapSectionProps {
  venues: Venue[];
  hoveredVenueId: string | null;
  mapLoading: boolean;
  onMapUpdate?: (bounds: L.LatLngBounds) => void;
}

interface MapEventsHandlerProps {
  onMapUpdate?: (bounds: L.LatLngBounds) => void;
}

const MapEventsHandler: React.FC<MapEventsHandlerProps> = ({ onMapUpdate }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const handleMapChange = () => {
      if (onMapUpdate) {
        onMapUpdate(map.getBounds());
      }
    };

    map.on('moveend', handleMapChange);
    map.on('zoomend', handleMapChange);

    return () => {
      map.off('moveend', handleMapChange);
      map.off('zoomend', handleMapChange);
    };
  }, [map, onMapUpdate]);

  return null;
};

const MapSection: React.FC<MapSectionProps> = ({ venues, hoveredVenueId, mapLoading, onMapUpdate }) => {
  const getVenueCoordinates = (venue: Venue): LatLngTuple | null => {
    if (venue.location && typeof venue.location.lat === 'number' && typeof venue.location.lng === 'number') {
      return [venue.location.lat, venue.location.lng];
    }
    return null;
  };

  // Define max bounds that cover a reasonable area of the globe
  const maxBounds: L.LatLngBoundsExpression = [
    [-85, -180],
    [85, 180],
  ];


  return (
    <MapContainer center={[63.4305, 10.3951]} 
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
        {venues.map((venue) => {
          const coordinates = getVenueCoordinates(venue);
          if (!coordinates) return null;

          return (
            <Marker
              key={venue.id}
              position={coordinates}
              icon={L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background: ${
                  hoveredVenueId === venue.id ? '#34e89e' : 'white'
                }; padding: 5px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
                        <span style="font-weight: bold;">${venue.price.toLocaleString('no-NO')} NOK</span>
                      </div>`,
                iconSize: [50, 50],
              })}
            >
              <Popup>
                <Typography variant="body2" fontWeight="bold">
                  {venue.name}
                </Typography>
                <Typography variant="body2">
                  {venue.location.city || 'Unknown City'}, {venue.location.country || 'Unknown Country'}
                </Typography>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
      <MapEventsHandler onMapUpdate={onMapUpdate} />
      {mapLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '10px',
            borderRadius: '10px',
          }}
        >
          <CircularProgress />
        </div>
      )}
    </MapContainer>
  );
};

export default MapSection;