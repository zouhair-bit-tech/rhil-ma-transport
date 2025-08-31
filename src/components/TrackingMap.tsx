import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Point, LineString } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Text, Fill, Stroke, Circle } from 'ol/style';
import { toast } from 'react-hot-toast';
import { Location, Trip } from '../types';

interface TrackingMapProps {
  trip?: Trip;
  center?: [number, number];
  zoom?: number;
}

// Styled Components
const MapContainer = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  font-size: 0.9rem;
  max-width: 300px;
`;

const TripInfo = styled.div`
  margin-bottom: 8px;
  font-family: 'Arial', sans-serif;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#ffc107';
      case 'assigned': return '#17a2b8';
      case 'in_progress': return '#007bff';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }};
`;

const TrackingMap: React.FC<TrackingMapProps> = ({
  trip,
  center = [31.7917, -7.0926], // Center of Morocco
  zoom = 6
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSource = useRef<VectorSource | null>(null);
  const [mouseCoordinates, setMouseCoordinates] = useState<string>('');

  useEffect(() => {
    if (!mapRef.current) return;

    // Create vector source for markers and routes
    vectorSource.current = new VectorSource();

    // Create vector layer for markers and routes
    const vectorLayer = new VectorLayer({
      source: vectorSource.current,
      style: (feature) => {
        const type = feature.get('type');
        const isPickup = type === 'pickup';
        const isDestination = type === 'destination';
        const isDriver = type === 'driver';
        const isRoute = type === 'route';

        if (isRoute) {
          return new Style({
            stroke: new Stroke({
              color: '#007bff',
              width: 4,
              lineDash: [10, 5]
            })
          });
        }

        if (isPickup) {
          return new Style({
            image: new Circle({
              radius: 12,
              fill: new Fill({ color: '#28a745' }),
              stroke: new Stroke({ color: '#fff', width: 3 })
            }),
            text: new Text({
              text: 'A',
              font: 'bold 16px Arial',
              fill: new Fill({ color: '#fff' })
            })
          });
        }

        if (isDestination) {
          return new Style({
            image: new Circle({
              radius: 12,
              fill: new Fill({ color: '#dc3545' }),
              stroke: new Stroke({ color: '#fff', width: 3 })
            }),
            text: new Text({
              text: 'B',
              font: 'bold 16px Arial',
              fill: new Fill({ color: '#fff' })
            })
          });
        }

        if (isDriver) {
          return new Style({
            image: new Circle({
              radius: 10,
              fill: new Fill({ color: '#ffd700' }),
              stroke: new Stroke({ color: '#1e3c72', width: 3 })
            }),
            text: new Text({
              text: '🚚',
              font: '16px Arial',
              offsetY: -2
            })
          });
        }

        return new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({ color: '#17a2b8' }),
            stroke: new Stroke({ color: '#fff', width: 2 })
          })
        });
      }
    });

    // Create map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
        maxZoom: 18,
        minZoom: 4
      })
    });

    mapInstance.current = map;

    // Handle mouse movement for coordinate display
    map.on('pointermove', (event) => {
      const coordinate = event.coordinate;
      const lonLat = toLonLat(coordinate);
      setMouseCoordinates(`${lonLat[1].toFixed(6)}, ${lonLat[0].toFixed(6)}`);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
    };
  }, []);

  // Update map when trip changes
  useEffect(() => {
    if (!vectorSource.current || !trip) return;

    // Clear existing features
    vectorSource.current.clear();

    // Add pickup marker
    const pickupFeature = new Feature({
      geometry: new Point(fromLonLat([trip.pickup.lng, trip.pickup.lat])),
      type: 'pickup'
    });
    vectorSource.current.addFeature(pickupFeature);

    // Add destination marker
    const destinationFeature = new Feature({
      geometry: new Point(fromLonLat([trip.destination.lng, trip.destination.lat])),
      type: 'destination'
    });
    vectorSource.current.addFeature(destinationFeature);

    // Add route line
    const routeFeature = new Feature({
      geometry: new LineString([
        fromLonLat([trip.pickup.lng, trip.pickup.lat]),
        fromLonLat([trip.destination.lng, trip.destination.lat])
      ]),
      type: 'route'
    });
    vectorSource.current.addFeature(routeFeature);

    // Add driver location if available
    if (trip.driverId && trip.status === 'in_progress') {
      // Pour la démo, la position du chauffeur est simulée.
      // Dans une application réelle, elle viendrait d'une API.
      const driverLocation = { lat: 33.6810, lng: -7.3750 }; 

      const driverFeature = new Feature({
        geometry: new Point(fromLonLat([
          driverLocation.lng,
          driverLocation.lat
        ])),
        type: 'driver'
      });
      vectorSource.current.addFeature(driverFeature);
    }

    // Center map on trip
    if (mapInstance.current) {
      const pickupCoord = fromLonLat([trip.pickup.lng, trip.pickup.lat]);
      const destCoord = fromLonLat([trip.destination.lng, trip.destination.lat]);
      
      const centerCoord = [
        (pickupCoord[0] + destCoord[0]) / 2,
        (pickupCoord[1] + destCoord[1]) / 2
      ];
      
      mapInstance.current.getView().animate({
        center: centerCoord,
        duration: 1000
      });
    }
  }, [trip]);

  // Handle offline/online status
  useEffect(() => {
    const handleOnline = () => {
      toast.success('Connexion internet rétablie');
    };

    const handleOffline = () => {
      toast.success('Mode hors ligne activé - Carte locale disponible');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!trip) {
    return (
      <MapContainer>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        <MapOverlay>
          <TripInfo>
            <strong>🔍 Recherche de Transport</strong><br />
            Entrez un numéro de commande pour voir le trajet sur la carte
          </TripInfo>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            🖱️ Souris: {mouseCoordinates}
          </div>
        </MapOverlay>
      </MapContainer>
    );
  }

  return (
    <MapContainer>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      
      <MapOverlay>
        <TripInfo>
          <strong>📦 Commande: {trip.commandNumber}</strong><br />
          <StatusBadge status={trip.status}>
            {trip.status === 'pending' && 'En Attente'}
            {trip.status === 'assigned' && 'Assignée'}
            {trip.status === 'in_progress' && 'En Cours'}
            {trip.status === 'completed' && 'Terminée'}
            {trip.status === 'cancelled' && 'Annulée'}
            {trip.status === 'accepted' && 'Acceptée'}
          </StatusBadge>
        </TripInfo>
        
        <TripInfo>
          <strong>🟢 Point A:</strong> {trip.pickup.address || `${trip.pickup.lat.toFixed(4)}, ${trip.pickup.lng.toFixed(4)}`}<br />
          <strong>🔴 Point B:</strong> {trip.destination.address || `${trip.destination.lat.toFixed(4)}, ${trip.destination.lng.toFixed(4)}`}
        </TripInfo>
        
        {trip.driverId && (
          <TripInfo>
            <strong>🚚 Chauffeur:</strong> {trip.driverName}<br />
            <strong>📱 Téléphone:</strong> {trip.driverPhone}<br />
            <strong>🚗 Véhicule:</strong> {trip.vehicleInfo}
          </TripInfo>
        )}
        
        <div style={{ fontSize: '0.8rem', color: '#666' }}>
          🖱️ Souris: {mouseCoordinates}
        </div>
      </MapOverlay>
    </MapContainer>
  );
};

export default TrackingMap;
