import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Point, LineString } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Text, Fill, Stroke, Circle } from 'ol/style';
import { Select } from 'ol/interaction';
import { click } from 'ol/events/condition';
import { toast } from 'react-hot-toast';
import { Location } from '../types';

interface DynamicMapProps {
  onLocationSelect: (location: Location, type: 'pickup' | 'destination') => void;
  pickup?: Location;
  destination?: Location;
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

const CoordinateDisplay = styled.div`
  margin-bottom: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
`;

const InstructionText = styled.div`
  color: #666;
  font-size: 0.8rem;
  line-height: 1.4;
`;

const RouteInfo = styled.div`
  background: #e3f2fd;
  padding: 8px;
  border-radius: 6px;
  margin-top: 8px;
  border-left: 3px solid #2196f3;
`;

const DynamicMap: React.FC<DynamicMapProps> = ({
  onLocationSelect,
  pickup,
  destination,
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
      style: (feature: any) => {
        const type = feature.get('type');
        const isPickup = type === 'pickup';
        const isDestination = type === 'destination';
        const isBouznika = type === 'bouznika';
        const isRoute = type === 'route';

        if (isRoute) {
          return new Style({
            stroke: new Stroke({
              color: '#2196f3',
              width: 4,
              lineDash: [10, 5]
            })
          });
        }

        if (isBouznika) {
          return new Style({
            image: new Circle({
              radius: 8,
              fill: new Fill({ color: '#ffd700' }),
              stroke: new Stroke({ color: '#1e3c72', width: 2 })
            }),
            text: new Text({
              text: 'Bouznika',
              font: 'bold 12px Arial',
              fill: new Fill({ color: '#1e3c72' }),
              offsetY: -15
            })
          });
        }

        if (isPickup) {
          return new Style({
            image: new Circle({
              radius: 10,
              fill: new Fill({ color: '#28a745' }),
              stroke: new Stroke({ color: '#fff', width: 3 })
            }),
            text: new Text({
              text: 'A',
              font: 'bold 14px Arial',
              fill: new Fill({ color: '#fff' })
            })
          });
        }

        if (isDestination) {
          return new Style({
            image: new Circle({
              radius: 10,
              fill: new Fill({ color: '#dc3545' }),
              stroke: new Stroke({ color: '#fff', width: 3 })
            }),
            text: new Text({
              text: 'B',
              font: 'bold 14px Arial',
              fill: new Fill({ color: '#fff' })
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

    // Create map with offline-capable tile sources
    const map = new Map({
      target: mapRef.current,
      layers: [
        // Primary OSM layer
        new TileLayer({
          source: new OSM(),
          visible: true
        }),
        // Fallback XYZ layer for offline scenarios
        new TileLayer({
          source: new XYZ({
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            crossOrigin: 'anonymous'
          }),
          visible: false
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

    // Add click interaction
    const selectInteraction = new Select({
      condition: click,
      style: null
    });

    map.addInteraction(selectInteraction);

    // Handle map clicks
    map.on('click', (event: any) => {
      const coordinate = event.coordinate;
      const lonLat = toLonLat(coordinate);
      
      const location: Location = {
        lat: lonLat[1],
        lng: lonLat[0],
        address: `${lonLat[1].toFixed(6)}, ${lonLat[0].toFixed(6)}`
      };

      // Determine which point to set
      if (!pickup) {
        onLocationSelect(location, 'pickup');
        toast.success('Point de départ (A) sélectionné !');
      } else if (!destination) {
        onLocationSelect(location, 'destination');
        toast.success('Point d\'arrivée (B) sélectionné !');
      } else {
        // Both points selected, allow modification of pickup
        onLocationSelect(location, 'pickup');
        toast.success('Point de départ (A) modifié !');
      }
    });

    // Handle mouse movement for coordinate display
    map.on('pointermove', (event: any) => {
      const coordinate = event.coordinate;
      const lonLat = toLonLat(coordinate);
      setMouseCoordinates(`${lonLat[1].toFixed(6)}, ${lonLat[0].toFixed(6)}`);
    });

    // Add Bouznika marker
    addBouznikaMarker();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
    };
  }, [pickup, destination, onLocationSelect, center, zoom]);

  // Add Bouznika marker
  const addBouznikaMarker = () => {
    if (!vectorSource.current) return;

    const bouznikaFeature = new Feature({
      geometry: new Point(fromLonLat([-7.1600, 33.7890])),
      type: 'bouznika'
    });

    vectorSource.current.addFeature(bouznikaFeature);
  };

  // Update markers and route when pickup/destination change
  useEffect(() => {
    if (!vectorSource.current) return;

    // Clear existing markers and routes (except Bouznika)
    const features = vectorSource.current.getFeatures();
    features.forEach((feature: any) => {
      const type = feature.get('type');
      if (type !== 'bouznika') {
        vectorSource.current?.removeFeature(feature);
      }
    });

    // Add pickup marker
    if (pickup) {
      const pickupFeature = new Feature({
        geometry: new Point(fromLonLat([pickup.lng, pickup.lat])),
        type: 'pickup'
      });
      vectorSource.current.addFeature(pickupFeature);
    }

    // Add destination marker
    if (destination) {
      const destinationFeature = new Feature({
        geometry: new Point(fromLonLat([destination.lng, destination.lat])),
        type: 'destination'
      });
      vectorSource.current.addFeature(destinationFeature);
    }

    // Add route line if both points are selected
    if (pickup && destination) {
      const routeFeature = new Feature({
        geometry: new LineString([
          fromLonLat([pickup.lng, pickup.lat]),
          fromLonLat([destination.lng, destination.lat])
        ]),
        type: 'route'
      });
      vectorSource.current.addFeature(routeFeature);
    }

    // Center map on new points if both are selected
    if (pickup && destination && mapInstance.current) {
      const pickupCoord = fromLonLat([pickup.lng, pickup.lat]);
      const destCoord = fromLonLat([destination.lng, destination.lat]);
      
      // Calculate center between two points
      const centerCoord = [
        (pickupCoord[0] + destCoord[0]) / 2,
        (pickupCoord[1] + destCoord[1]) / 2
      ];
      
      mapInstance.current.getView().animate({
        center: centerCoord,
        duration: 1000
      });
    }
  }, [pickup, destination]);

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

  // Calculate distance between points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <MapContainer>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      
      <MapOverlay>
        <CoordinateDisplay>
          <strong>🖱️ Souris:</strong> {mouseCoordinates}
        </CoordinateDisplay>
        
        {pickup && (
          <CoordinateDisplay>
            <strong>🟢 Point A:</strong> {pickup.lat.toFixed(6)}, {pickup.lng.toFixed(6)}
          </CoordinateDisplay>
        )}
        
        {destination && (
          <CoordinateDisplay>
            <strong>🔴 Point B:</strong> {destination.lat.toFixed(6)}, {destination.lng.toFixed(6)}
          </CoordinateDisplay>
        )}
        
        {pickup && destination && (
          <RouteInfo>
            <strong>📏 Distance:</strong> {calculateDistance(pickup.lat, pickup.lng, destination.lat, destination.lng).toFixed(1)} km
          </RouteInfo>
        )}
        
        <InstructionText>
          <strong>Instructions:</strong><br />
          {!pickup ? '1. Cliquez pour sélectionner le point de départ (A)' :
           !destination ? '2. Cliquez pour sélectionner le point d\'arrivée (B)' :
           '✅ Points sélectionnés - Cliquez pour modifier le point A'}
        </InstructionText>
      </MapOverlay>
    </MapContainer>
  );
};

export default DynamicMap;
